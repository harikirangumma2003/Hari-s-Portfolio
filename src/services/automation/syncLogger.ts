import { collection, addDoc, getDocs, query, orderBy, limit, Timestamp } from "firebase/firestore";
import { db } from "../../lib/firebase";
import { SyncLog } from "./types";

export class SyncLogger {
  /**
   * Writes a sync log record to the "syncLogs" collection.
   */
  static async log(syncLog: Omit<SyncLog, "id">): Promise<string> {
    const logsRef = collection(db, "syncLogs");
    
    const docData = {
      platform: syncLog.platform,
      startedAt: Timestamp.fromDate(syncLog.startedAt),
      completedAt: Timestamp.fromDate(syncLog.completedAt),
      status: syncLog.status,
      imported: syncLog.imported,
      updated: syncLog.updated,
      skipped: syncLog.skipped,
      failed: syncLog.failed,
      duration: syncLog.duration,
      errors: syncLog.errors || []
    };
    
    try {
      const docRef = await addDoc(logsRef, docData);
      return docRef.id;
    } catch (err) {
      console.error("Failed to write sync log to Firestore:", err);
      throw err;
    }
  }

  /**
   * Fetches the latest sync logs.
   */
  static async getLogs(maxLogs: number = 50): Promise<SyncLog[]> {
    const logsRef = collection(db, "syncLogs");
    const q = query(logsRef, orderBy("startedAt", "desc"), limit(maxLogs));
    
    try {
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => {
        const data = doc.data();
        
        const parseDate = (val: any): Date => {
          if (val instanceof Timestamp) return val.toDate();
          if (val && typeof val.toDate === "function") return val.toDate();
          return new Date(val);
        };
        
        return {
          id: doc.id,
          platform: data.platform || "Unknown",
          startedAt: parseDate(data.startedAt),
          completedAt: parseDate(data.completedAt),
          status: data.status || "success",
          imported: typeof data.imported === "number" ? data.imported : 0,
          updated: typeof data.updated === "number" ? data.updated : 0,
          skipped: typeof data.skipped === "number" ? data.skipped : 0,
          failed: typeof data.failed === "number" ? data.failed : 0,
          duration: typeof data.duration === "number" ? data.duration : 0,
          errors: Array.isArray(data.errors) ? data.errors : []
        };
      });
    } catch (err) {
      console.error("Failed to fetch sync logs from Firestore:", err);
      return [];
    }
  }
}
