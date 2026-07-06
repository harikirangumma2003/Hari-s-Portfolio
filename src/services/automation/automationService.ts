import { doc, getDoc, setDoc, updateDoc, collection, addDoc, Timestamp } from "firebase/firestore";
import { db } from "../../lib/firebase";
import { AutomationSettings, ContentImporter, RawPlatformItem, SyncLog } from "./types";
import { MediumImporter } from "./mediumImporter";
import { YoutubeImporter } from "./youtubeImporter";
import { DuplicateDetector } from "./duplicateDetector";
import { ContentNormalizer } from "./normalizer";
import { SyncLogger } from "./syncLogger";

const DEFAULT_SETTINGS: AutomationSettings = {
  mediumEnabled: true,
  youtubeEnabled: true,
  linkedinEnabled: false,
  instagramEnabled: false,
  threadsEnabled: false,
  xEnabled: false,
  autoSync: false,
  syncInterval: 60,
  lastGlobalSync: null
};

export interface SyncSummary {
  imported: number;
  updated: number;
  skipped: number;
  failed: number;
  duration: number; // in milliseconds
  errors: string[];
}

export class AutomationService {
  /**
   * Fetches global automation settings from Firestore under automation/settings.
   * If it does not exist, it initializes it with default values.
   */
  static async getSettings(): Promise<AutomationSettings> {
    const docRef = doc(db, "automation", "settings");
    try {
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        
        const parseDate = (val: any): Date | null => {
          if (val instanceof Timestamp) return val.toDate();
          if (val && typeof val.toDate === "function") return val.toDate();
          return val ? new Date(val) : null;
        };

        return {
          mediumEnabled: data.mediumEnabled ?? DEFAULT_SETTINGS.mediumEnabled,
          youtubeEnabled: data.youtubeEnabled ?? DEFAULT_SETTINGS.youtubeEnabled,
          linkedinEnabled: data.linkedinEnabled ?? DEFAULT_SETTINGS.linkedinEnabled,
          instagramEnabled: data.instagramEnabled ?? DEFAULT_SETTINGS.instagramEnabled,
          threadsEnabled: data.threadsEnabled ?? DEFAULT_SETTINGS.threadsEnabled,
          xEnabled: data.xEnabled ?? DEFAULT_SETTINGS.xEnabled,
          autoSync: data.autoSync ?? DEFAULT_SETTINGS.autoSync,
          syncInterval: data.syncInterval ?? DEFAULT_SETTINGS.syncInterval,
          lastGlobalSync: parseDate(data.lastGlobalSync)
        };
      } else {
        // Document doesn't exist, create it with default values
        await setDoc(docRef, {
          ...DEFAULT_SETTINGS,
          lastGlobalSync: null
        });
        return DEFAULT_SETTINGS;
      }
    } catch (err) {
      console.error("Failed to get automation settings, returning defaults:", err);
      return DEFAULT_SETTINGS;
    }
  }

  /**
   * Updates global automation settings in Firestore.
   */
  static async updateSettings(settings: Partial<AutomationSettings>): Promise<void> {
    const docRef = doc(db, "automation", "settings");
    try {
      const updateData: any = { ...settings };
      if (settings.lastGlobalSync instanceof Date) {
        updateData.lastGlobalSync = Timestamp.fromDate(settings.lastGlobalSync);
      }
      await setDoc(docRef, updateData, { merge: true });
    } catch (err) {
      console.error("Failed to update automation settings:", err);
      throw err;
    }
  }

  /**
   * Universal Sync Pipeline (Phase 4, 10 & 11)
   * Any platform can be synchronized using this reusable process.
   */
  static async runPipeline(
    importer: ContentImporter,
    platform: 'Medium' | 'YouTube' | 'LinkedIn' | 'Instagram' | 'X' | 'Threads',
    contentType: 'Blog' | 'Video' | 'Social Post'
  ): Promise<SyncSummary> {
    const startedAt = new Date();
    const errors: string[] = [];
    
    let importedCount = 0;
    let updatedCount = 0;
    let skippedCount = 0;
    let failedCount = 0;

    try {
      // 1. FETCH DATA
      const rawItems = await importer.fetchAndParse();
      
      for (const rawItem of rawItems) {
        try {
          // 2. VALIDATE (Ensure minimum critical information is present)
          if (!rawItem.id || !rawItem.title || !rawItem.url) {
            failedCount++;
            errors.push(`Validation failed for item: ${rawItem.title || 'Unknown'}. Missing ID, Title, or URL.`);
            continue;
          }
          
          // 3. DUPLICATE CHECK (Phase 6)
          const platformKey = platform.toLowerCase();
          const existingDocId = await DuplicateDetector.check(platformKey, rawItem.id);
          
          // 4. TRANSFORM / NORMALIZE (Phase 7)
          const normalizedData = ContentNormalizer.normalize(rawItem, platform, contentType);
          
          // Convert normalizer Date types to Firestore Timestamps
          const firestoreData: any = {
            ...normalizedData,
            publishedDate: Timestamp.fromDate(normalizedData.publishedDate),
            createdAt: Timestamp.fromDate(normalizedData.createdAt),
            updatedAt: Timestamp.fromDate(normalizedData.updatedAt)
          };
          
          // 5. INSERT OR UPDATE (Phase 6)
          if (existingDocId) {
            // Update
            const docRef = doc(db, "content", existingDocId);
            // We preserve original createdAt, but update the rest of the metadata and metrics
            delete firestoreData.createdAt; // Prevent overwriting creation date
            
            await updateDoc(docRef, {
              ...firestoreData,
              updatedAt: Timestamp.now()
            });
            updatedCount++;
          } else {
            // Insert
            const contentRef = collection(db, "content");
            await addDoc(contentRef, firestoreData);
            importedCount++;
          }
        } catch (itemErr: any) {
          failedCount++;
          errors.push(`Error processing item "${rawItem.title}": ${itemErr.message || itemErr}`);
        }
      }
    } catch (pipelineErr: any) {
      errors.push(`Pipeline execution failed: ${pipelineErr.message || pipelineErr}`);
    }

    const completedAt = new Date();
    const duration = completedAt.getTime() - startedAt.getTime();
    const status = errors.length > 0 && importedCount === 0 && updatedCount === 0 ? "failed" : "success";

    const syncLog: Omit<SyncLog, "id"> = {
      platform: importer.platformName,
      startedAt,
      completedAt,
      status: status as 'success' | 'failed',
      imported: importedCount,
      updated: updatedCount,
      skipped: skippedCount,
      failed: failedCount,
      duration,
      errors
    };

    // 6. WRITE SYNC LOG (Phase 3)
    try {
      await SyncLogger.log(syncLog);
    } catch (logErr) {
      console.error("Failed to write sync logs:", logErr);
    }

    // Update global sync timestamps
    try {
      await this.updateSettings({
        lastGlobalSync: completedAt
      });
    } catch (setErr) {
      console.error("Failed to update global sync timestamp:", setErr);
    }

    return {
      imported: importedCount,
      updated: updatedCount,
      skipped: skippedCount,
      failed: failedCount,
      duration,
      errors
    };
  }

  /**
   * Synchronizes Medium RSS items (Phase 8 & 9)
   */
  static async syncMedium(): Promise<SyncSummary> {
    const importer = new MediumImporter();
    return this.runPipeline(importer, "Medium", "Blog");
  }

  /**
   * Synchronizes YouTube RSS items
   */
  static async syncYoutube(): Promise<SyncSummary> {
    const importer = new YoutubeImporter();
    return this.runPipeline(importer, "YouTube", "Video");
  }
}
