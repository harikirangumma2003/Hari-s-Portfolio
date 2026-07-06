import { useState, useEffect, useCallback } from "react";
import { AutomationSettings, SyncLog } from "../services/automation/types";
import { AutomationService, SyncSummary } from "../services/automation/automationService";
import { SyncLogger } from "../services/automation/syncLogger";

export interface UseAutomationResult {
  settings: AutomationSettings | null;
  logs: SyncLog[];
  loading: boolean;
  syncingPlatform: string | null;
  syncSummary: SyncSummary | null;
  clearSyncSummary: () => void;
  refresh: () => Promise<void>;
  updateSettings: (newSettings: Partial<AutomationSettings>) => Promise<void>;
  triggerSync: (platform: 'Medium' | 'YouTube' | 'LinkedIn' | 'Instagram' | 'X' | 'Threads') => Promise<SyncSummary | null>;
}

export function useAutomation(): UseAutomationResult {
  const [settings, setSettings] = useState<AutomationSettings | null>(null);
  const [logs, setLogs] = useState<SyncLog[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [syncingPlatform, setSyncingPlatform] = useState<string | null>(null);
  const [syncSummary, setSyncSummary] = useState<SyncSummary | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const [settingsData, logsData] = await Promise.all([
        AutomationService.getSettings(),
        SyncLogger.getLogs(30)
      ]);
      setSettings(settingsData);
      setLogs(logsData);
    } catch (err) {
      console.error("Failed to load automation data:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  // Automatic background sync on CMS start and scheduled refresh
  useEffect(() => {
    if (!settings || !settings.autoSync) return;

    let isSyncing = false;

    const checkAndRunSync = async () => {
      if (isSyncing) return;
      
      const now = new Date();
      const lastSync = settings.lastGlobalSync;
      const intervalMs = settings.syncInterval * 60 * 1000;

      // Determine if we need to sync: if never synced, or last sync was longer than interval ago
      const needsSync = !lastSync || (now.getTime() - lastSync.getTime() >= intervalMs);

      if (needsSync) {
        isSyncing = true;
        console.log("[Automation] Auto-sync triggered. Starting sync...");
        try {
          if (settings.mediumEnabled) {
            console.log("[Automation] Auto-syncing Medium...");
            await AutomationService.syncMedium();
          }
          if (settings.youtubeEnabled) {
            console.log("[Automation] Auto-syncing YouTube...");
            await AutomationService.syncYoutube();
          }
          await refresh();
        } catch (err) {
          console.error("[Automation] Auto-sync failed:", err);
        } finally {
          isSyncing = false;
        }
      }
    };

    // 1. Run on start
    checkAndRunSync();

    // 2. Scheduled background refresh check (every 30 seconds)
    const intervalId = setInterval(checkAndRunSync, 30000);

    return () => clearInterval(intervalId);
  }, [settings, refresh]);

  const updateSettings = async (newSettings: Partial<AutomationSettings>) => {
    try {
      await AutomationService.updateSettings(newSettings);
      setSettings(prev => prev ? { ...prev, ...newSettings } : null);
    } catch (err) {
      console.error("Failed to update settings:", err);
      throw err;
    }
  };

  const triggerSync = async (platform: 'Medium' | 'YouTube' | 'LinkedIn' | 'Instagram' | 'X' | 'Threads'): Promise<SyncSummary | null> => {
    setSyncingPlatform(platform);
    setSyncSummary(null);
    try {
      let summary: SyncSummary;
      if (platform === 'Medium') {
        summary = await AutomationService.syncMedium();
      } else if (platform === 'YouTube') {
        summary = await AutomationService.syncYoutube();
      } else {
        // Future ready mock logic for unimplemented platforms as per Phase 11
        // (Runs the pipeline format, logs skipped)
        const startedAt = new Date();
        const duration = 150;
        summary = {
          imported: 0,
          updated: 0,
          skipped: 0,
          failed: 0,
          duration,
          errors: [`Platform ${platform} integration is configured as 'Future-Ready'. Setup credentials to start importing.`]
        };
        
        await SyncLogger.log({
          platform,
          startedAt,
          completedAt: new Date(startedAt.getTime() + duration),
          status: 'success',
          imported: 0,
          updated: 0,
          skipped: 0,
          failed: 0,
          duration,
          errors: []
        });
      }
      
      setSyncSummary(summary);
      await refresh(); // Refresh logs and settings
      return summary;
    } catch (err) {
      console.error(`Failed to sync platform ${platform}:`, err);
      return null;
    } finally {
      setSyncingPlatform(null);
    }
  };

  const clearSyncSummary = () => {
    setSyncSummary(null);
  };

  return {
    settings,
    logs,
    loading,
    syncingPlatform,
    syncSummary,
    clearSyncSummary,
    refresh,
    updateSettings,
    triggerSync
  };
}
