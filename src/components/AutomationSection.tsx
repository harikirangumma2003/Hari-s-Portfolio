import React, { useState, useMemo } from "react";
import { 
  RefreshCw, 
  Settings, 
  FileText, 
  Link, 
  CheckCircle, 
  XCircle, 
  Clock, 
  AlertCircle,
  Sparkles,
  ToggleLeft,
  ChevronDown,
  Info,
  Calendar,
  Activity,
  Play
} from "lucide-react";
import { useAutomation } from "../hooks/useAutomation";
import { SyncLog } from "../services/automation/types";
import { cn } from "../lib/utils";

interface AutomationSectionProps {
  themeMode: "dark" | "light";
  triggerToast: (message: string, type: "success" | "error" | "info") => void;
}

export default function AutomationSection({ themeMode, triggerToast }: AutomationSectionProps) {
  const {
    settings,
    logs,
    loading,
    syncingPlatform,
    syncSummary,
    clearSyncSummary,
    updateSettings,
    triggerSync
  } = useAutomation();

  const [activeSubTab, setActiveSubTab] = useState<"dashboard" | "settings" | "logs">("dashboard");
  const [selectedPlatformFilter, setSelectedPlatformFilter] = useState<string>("All");
  const [expandedLogId, setExpandedLogId] = useState<string | null>(null);

  // Connection settings Modal / State
  const [isConnectModalOpen, setIsConnectModalOpen] = useState(false);
  const [connectPlatform, setConnectPlatform] = useState<string | null>(null);
  const [rssUrlInput, setRssUrlInput] = useState("https://medium.com/feed/@harikirangumma2003");

  // Local settings forms
  const [localSettings, setLocalSettings] = useState<any>(null);

  // Initialize local settings once loaded
  React.useEffect(() => {
    if (settings && !localSettings) {
      setLocalSettings({ ...settings });
    }
  }, [settings, localSettings]);

  // Aggregate stats per platform from real Firestore logs
  const platformStats = useMemo(() => {
    const stats: Record<string, { imported: number; updated: number; failed: number; lastSync: Date | null }> = {
      Medium: { imported: 0, updated: 0, failed: 0, lastSync: null },
      YouTube: { imported: 0, updated: 0, failed: 0, lastSync: null },
      LinkedIn: { imported: 0, updated: 0, failed: 0, lastSync: null },
      Instagram: { imported: 0, updated: 0, failed: 0, lastSync: null },
      X: { imported: 0, updated: 0, failed: 0, lastSync: null },
      Threads: { imported: 0, updated: 0, failed: 0, lastSync: null },
    };

    // Parse logs chronologically to get aggregates and correct lastSync
    const sortedLogs = [...logs].sort((a, b) => a.startedAt.getTime() - b.startedAt.getTime());
    
    sortedLogs.forEach(log => {
      const platform = log.platform;
      if (stats[platform]) {
        stats[platform].imported += log.imported;
        stats[platform].updated += log.updated;
        stats[platform].failed += log.failed;
        stats[platform].lastSync = log.completedAt;
      }
    });

    return stats;
  }, [logs]);

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!localSettings) return;

    try {
      await updateSettings(localSettings);
      triggerToast("Automation settings updated successfully!", "success");
    } catch (err: any) {
      triggerToast("Failed to update settings: " + err.message, "error");
    }
  };

  const handleSyncPlatform = async (platform: 'Medium' | 'YouTube' | 'LinkedIn' | 'Instagram' | 'X' | 'Threads') => {
    if (platform === 'Medium' && settings && !settings.mediumEnabled) {
      triggerToast("Medium integration is currently disabled in Settings.", "info");
      return;
    }
    if (platform === 'YouTube' && settings && !settings.youtubeEnabled) {
      triggerToast("YouTube integration is currently disabled in Settings.", "info");
      return;
    }

    triggerToast(`Starting synchronization for ${platform}...`, "info");
    const summary = await triggerSync(platform);
    if (summary) {
      if (summary.errors.length > 0 && summary.imported === 0 && summary.updated === 0) {
        triggerToast(`${platform} sync failed. Check logs.`, "error");
      } else {
        triggerToast(`${platform} sync completed! Imported: ${summary.imported}, Updated: ${summary.updated}`, "success");
      }
    } else {
      triggerToast(`Failed to connect or synchronize ${platform}.`, "error");
    }
  };

  const handleOpenConnect = (platform: string) => {
    setConnectPlatform(platform);
    if (platform === "Medium") {
      setRssUrlInput("https://medium.com/feed/@harikirangumma2003");
    } else if (platform === "YouTube") {
      setRssUrlInput("https://www.youtube.com/feeds/videos.xml?channel_id=UCbhXfstzcI1_kIatY7acgtg");
    }
    setIsConnectModalOpen(true);
  };

  const handleSaveConnection = () => {
    setIsConnectModalOpen(false);
    triggerToast(`Connection established for ${connectPlatform}!`, "success");
  };

  const filteredLogs = useMemo(() => {
    if (selectedPlatformFilter === "All") return logs;
    return logs.filter(log => log.platform === selectedPlatformFilter);
  }, [logs, selectedPlatformFilter]);

  const platformsList = [
    { name: "Medium" as const, subtitle: "RSS Feed Importer", key: "mediumEnabled", iconColor: "text-emerald-400" },
    { name: "YouTube" as const, subtitle: "Video Catalog Sync", key: "youtubeEnabled", iconColor: "text-red-500" },
    { name: "LinkedIn" as const, subtitle: "Professional Posts Feed", key: "linkedinEnabled", iconColor: "text-blue-500" },
    { name: "Instagram" as const, subtitle: "Media Feed Sync", key: "instagramEnabled", iconColor: "text-pink-500" },
    { name: "X" as const, subtitle: "Micro-Posts Syndication", key: "xEnabled", iconColor: "text-zinc-300" },
    { name: "Threads" as const, subtitle: "Threads Feed Syndication", key: "threadsEnabled", iconColor: "text-violet-400" }
  ];

  if (loading && !settings) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <RefreshCw className="w-8 h-8 text-accent animate-spin" />
        <p className="text-xs font-mono text-zinc-400">Loading Automation Engine...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in" id="automation-section">
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl md:text-2xl font-black uppercase tracking-tight font-display text-white">Content Automation Engine</h2>
          <p className="text-xs font-mono text-zinc-400 mt-1">
            Omnichannel ingestion pipeline connecting external publications to the CMS core.
          </p>
        </div>

        {/* Sync All button */}
        <button
          onClick={() => handleSyncPlatform("Medium")}
          disabled={syncingPlatform !== null}
          className={cn(
            "px-6 py-3.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 self-start shadow-xl",
            syncingPlatform 
              ? "bg-zinc-800 text-zinc-400 border border-zinc-700 cursor-not-allowed" 
              : "bg-accent hover:bg-white text-white hover:text-black shadow-accent/15"
          )}
        >
          <RefreshCw className={cn("w-3.5 h-3.5", syncingPlatform && "animate-spin")} />
          {syncingPlatform ? "Syncing Platform..." : "Sync Medium Content"}
        </button>
      </div>

      {/* Sub-Navigation tabs */}
      <div className="flex border-b border-zinc-800 gap-6">
        <button
          onClick={() => setActiveSubTab("dashboard")}
          className={cn(
            "pb-3 text-xs font-semibold uppercase tracking-wider transition-all relative",
            activeSubTab === "dashboard" ? "text-accent border-b-2 border-accent" : "text-zinc-400 hover:text-white"
          )}
        >
          Platform Ingestion
        </button>
        <button
          onClick={() => setActiveSubTab("settings")}
          className={cn(
            "pb-3 text-xs font-semibold uppercase tracking-wider transition-all relative",
            activeSubTab === "settings" ? "text-accent border-b-2 border-accent" : "text-zinc-400 hover:text-white"
          )}
        >
          Pipeline Settings
        </button>
        <button
          onClick={() => setActiveSubTab("logs")}
          className={cn(
            "pb-3 text-xs font-semibold uppercase tracking-wider transition-all relative",
            activeSubTab === "logs" ? "text-accent border-b-2 border-accent" : "text-zinc-400 hover:text-white"
          )}
        >
          Integration Logs
        </button>
      </div>

      {/* VIEW: PLATFORMS DASHBOARD */}
      {activeSubTab === "dashboard" && (
        <div className="space-y-6">
          {/* Platform Ingestion Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {platformsList.map((p) => {
              const pStats = platformStats[p.name] || { imported: 0, updated: 0, failed: 0, lastSync: null };
              const isEnabled = settings ? (settings as any)[p.key] : false;
              const isSyncing = syncingPlatform === p.name;
              
              let statusText = "Ready";
              let statusColor = "bg-emerald-500/10 text-emerald-400 border-emerald-500/10";
              
              if (!isEnabled) {
                statusText = "Disabled";
                statusColor = "bg-zinc-800/50 text-zinc-400 border-zinc-800";
              } else if (p.name !== "Medium" && p.name !== "YouTube") {
                statusText = "Future Ready";
                statusColor = "bg-blue-500/10 text-blue-400 border-blue-500/10";
              } else {
                statusText = "Active Ingestion";
                statusColor = "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
              }

              return (
                <div 
                  key={p.name}
                  className={cn(
                    "p-6 rounded-[28px] border relative flex flex-col transition-all duration-300",
                    themeMode === "dark" ? "bg-[#0c0c0e] border-white/5 text-white" : "bg-white border-zinc-200 text-zinc-900"
                  )}
                >
                  {/* Top line with Platform & Status */}
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-base font-black font-display flex items-center gap-2">
                        <span className={cn("w-2 h-2 rounded-full", isEnabled ? "bg-accent animate-pulse" : "bg-zinc-600")} />
                        {p.name}
                      </h3>
                      <p className="text-[10px] font-mono text-zinc-400 mt-0.5">{p.subtitle}</p>
                    </div>
                    
                    <span className={cn("px-2.5 py-1 text-[9px] font-bold font-mono rounded-full border", statusColor)}>
                      {statusText}
                    </span>
                  </div>

                  {/* Core stats block */}
                  <div className="grid grid-cols-2 gap-4 my-4 p-4 rounded-2xl bg-zinc-900/40 border border-white/5">
                    <div>
                      <span className="block text-[8px] font-mono uppercase tracking-widest text-zinc-400">Ingested</span>
                      <span className="text-lg font-black font-display text-white">{pStats.imported}</span>
                    </div>
                    <div>
                      <span className="block text-[8px] font-mono uppercase tracking-widest text-zinc-400">Updated</span>
                      <span className="text-lg font-black font-display text-white">{pStats.updated}</span>
                    </div>
                    <div>
                      <span className="block text-[8px] font-mono uppercase tracking-widest text-zinc-400">Failed Logs</span>
                      <span className={cn("text-lg font-black font-display", pStats.failed > 0 ? "text-red-400" : "text-zinc-500")}>
                        {pStats.failed}
                      </span>
                    </div>
                    <div>
                      <span className="block text-[8px] font-mono uppercase tracking-widest text-zinc-400">Status</span>
                      <span className="text-[10px] font-bold font-mono text-accent">
                        {isEnabled ? "Connected" : "Disconnected"}
                      </span>
                    </div>
                  </div>

                  {/* Timeline info */}
                  <div className="flex items-center gap-2 text-[10px] font-mono text-zinc-400 mb-6 border-t border-white/5 pt-3 mt-1">
                    <Clock className="w-3.5 h-3.5 text-zinc-500" />
                    <span>Last Ingest:</span>
                    <span className="text-white ml-auto">
                      {pStats.lastSync ? pStats.lastSync.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "Never"}
                    </span>
                  </div>

                  {/* Operational actions buttons */}
                  <div className="grid grid-cols-2 gap-2.5 mt-auto">
                    <button
                      onClick={() => handleSyncPlatform(p.name)}
                      disabled={isSyncing || syncingPlatform !== null}
                      className={cn(
                        "py-3 px-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-1.5",
                        isSyncing 
                          ? "bg-zinc-800 text-zinc-400 animate-pulse border border-zinc-700" 
                          : "bg-accent hover:bg-white text-white hover:text-black shadow-lg"
                      )}
                    >
                      {isSyncing ? (
                        <>
                          <RefreshCw className="w-3 h-3 animate-spin" /> Ingesting...
                        </>
                      ) : (
                        <>
                          <Play className="w-3 h-3" /> Sync Now
                        </>
                      )}
                    </button>

                    <button
                      onClick={() => handleOpenConnect(p.name)}
                      className="py-3 px-2 border border-white/5 bg-zinc-900/20 hover:bg-zinc-800 text-zinc-300 rounded-xl text-[9px] font-black uppercase tracking-widest transition-colors flex items-center justify-center gap-1.5"
                    >
                      <Link className="w-3 h-3" /> Connect
                    </button>

                    <button
                      onClick={() => setActiveSubTab("settings")}
                      className="py-2.5 px-2 text-zinc-400 hover:text-white transition-colors text-[9px] font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 col-span-2 border-t border-white/5 pt-3 mt-1"
                    >
                      <Settings className="w-3 h-3" /> Configure Platform Parameters
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Activity timeline summary */}
          <div className="p-6 rounded-[28px] bg-zinc-900/30 border border-white/5">
            <h3 className="text-xs font-black uppercase tracking-widest text-zinc-400 font-mono mb-4 flex items-center gap-2">
              <Activity className="w-4 h-4 text-accent" /> Ingestion Activity Log Snapshot
            </h3>
            {logs.length === 0 ? (
              <p className="text-xs font-mono text-zinc-500 py-2">No ingestion operations logged yet.</p>
            ) : (
              <div className="space-y-4">
                {logs.slice(0, 3).map((log, idx) => (
                  <div key={idx} className="flex items-center gap-4 text-xs font-mono py-2 border-b border-zinc-800 last:border-none">
                    {log.status === "success" ? (
                      <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                    ) : (
                      <XCircle className="w-4 h-4 text-red-400 shrink-0" />
                    )}
                    <div>
                      <span className="font-bold text-white uppercase">{log.platform} Ingestion</span>
                      <span className="text-zinc-500 mx-2">|</span>
                      <span className="text-zinc-400">Imported: {log.imported}, Updated: {log.updated}</span>
                    </div>
                    <span className="ml-auto text-[10px] text-zinc-500">
                      {log.completedAt.toLocaleTimeString()} ({Math.round(log.duration / 1000)}s)
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* VIEW: SETTINGS SUB-PANEL */}
      {activeSubTab === "settings" && localSettings && (
        <form onSubmit={handleSaveSettings} className="space-y-6">
          <div className={cn(
            "p-8 rounded-[28px] border space-y-6 transition-all duration-300",
            themeMode === "dark" ? "bg-[#0c0c0e] border-white/5" : "bg-white border-zinc-200"
          )}>
            <div className="border-b border-zinc-800 pb-4">
              <h3 className="text-base font-black font-display text-white">Pipeline Settings</h3>
              <p className="text-xs font-mono text-zinc-400 mt-1">Configure global synchronization interval & manage enabled platform feeds.</p>
            </div>

            {/* Sync options */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-[10px] font-mono uppercase tracking-widest text-zinc-400">Background Syncing</label>
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="autoSync"
                    checked={localSettings.autoSync}
                    onChange={(e) => setLocalSettings({ ...localSettings, autoSync: e.target.checked })}
                    className="w-4 h-4 rounded border-zinc-700 bg-zinc-900 text-accent focus:ring-accent"
                  />
                  <label htmlFor="autoSync" className="text-xs text-zinc-300 font-mono">
                    Enable Automatic Content Background Syncing (Cron-enabled)
                  </label>
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-[10px] font-mono uppercase tracking-widest text-zinc-400">Sync Interval (Minutes)</label>
                <input
                  type="number"
                  min="15"
                  value={localSettings.syncInterval}
                  onChange={(e) => setLocalSettings({ ...localSettings, syncInterval: parseInt(e.target.value) || 60 })}
                  className="w-full max-w-xs p-3 rounded-xl bg-zinc-900 border border-white/5 text-xs text-white outline-none focus:border-accent"
                />
                <p className="text-[10px] font-mono text-zinc-500">Minimum background interval of 15 minutes is recommended to preserve database quota.</p>
              </div>
            </div>

            {/* Platform toggles */}
            <div className="border-t border-zinc-800 pt-6 space-y-4">
              <h4 className="text-xs font-black font-display text-white uppercase tracking-wider">Feed Collectors Enablers</h4>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {platformsList.map((p) => (
                  <div key={p.name} className="flex items-center justify-between p-4 rounded-2xl bg-zinc-900/40 border border-white/5">
                    <div>
                      <span className="block text-xs font-bold text-white">{p.name}</span>
                      <span className="text-[9px] font-mono text-zinc-500">RSS / Ingestion Feed</span>
                    </div>
                    
                    <input
                      type="checkbox"
                      checked={localSettings[p.key]}
                      onChange={(e) => setLocalSettings({ ...localSettings, [p.key]: e.target.checked })}
                      className="w-4 h-4 rounded border-zinc-700 bg-zinc-900 text-accent focus:ring-accent cursor-pointer"
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <button
                type="submit"
                className="px-6 py-3.5 bg-accent hover:bg-white text-white hover:text-black rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-xl shadow-accent/15"
              >
                Save Engine Parameters
              </button>
            </div>
          </div>
        </form>
      )}

      {/* VIEW: LOGS VIEW */}
      {activeSubTab === "logs" && (
        <div className="space-y-6">
          {/* Filters line */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-5 rounded-[24px] border border-white/5 bg-[#0c0c0e]">
            <div>
              <span className="block text-[10px] font-mono uppercase tracking-widest text-zinc-400">Filters</span>
              <p className="text-[9px] font-mono text-zinc-500 mt-1">Sift through automation records in real-time.</p>
            </div>
            
            <div className="flex gap-2">
              {["All", "Medium", "YouTube", "LinkedIn", "Instagram", "X", "Threads"].map(plat => (
                <button
                  key={plat}
                  onClick={() => setSelectedPlatformFilter(plat)}
                  className={cn(
                    "px-3.5 py-1.5 rounded-full text-[9px] font-bold uppercase tracking-wider border transition-colors",
                    selectedPlatformFilter === plat
                      ? "bg-accent text-white border-accent"
                      : "bg-zinc-900 border-white/5 text-zinc-400 hover:text-white"
                  )}
                >
                  {plat}
                </button>
              ))}
            </div>
          </div>

          {/* Logs List */}
          <div className="overflow-hidden border border-white/5 rounded-[28px] bg-[#0c0c0e]">
            {filteredLogs.length === 0 ? (
              <div className="p-12 text-center text-zinc-500 font-mono text-xs">
                No logs recorded matching the filter.
              </div>
            ) : (
              <div className="divide-y divide-zinc-800">
                {filteredLogs.map((log) => {
                  const isExpanded = expandedLogId === log.id;
                  return (
                    <div key={log.id} className="p-5 hover:bg-zinc-900/10 transition-colors">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                          {log.status === "success" ? (
                            <CheckCircle className="w-5 h-5 text-emerald-400" />
                          ) : (
                            <XCircle className="w-5 h-5 text-red-400" />
                          )}
                          <div>
                            <h4 className="text-sm font-bold text-white uppercase font-display">{log.platform} Ingest</h4>
                            <p className="text-[10px] font-mono text-zinc-500 mt-0.5">
                              Started: {log.startedAt.toLocaleString()}
                            </p>
                          </div>
                        </div>

                        {/* Middle counters */}
                        <div className="grid grid-cols-4 gap-4 text-center">
                          <div className="px-2">
                            <span className="block text-[8px] font-mono uppercase text-zinc-500">Import</span>
                            <span className="text-xs font-bold text-emerald-400">{log.imported}</span>
                          </div>
                          <div className="px-2">
                            <span className="block text-[8px] font-mono uppercase text-zinc-500">Update</span>
                            <span className="text-xs font-bold text-accent">{log.updated}</span>
                          </div>
                          <div className="px-2">
                            <span className="block text-[8px] font-mono uppercase text-zinc-500">Skip</span>
                            <span className="text-xs font-bold text-zinc-400">{log.skipped}</span>
                          </div>
                          <div className="px-2">
                            <span className="block text-[8px] font-mono uppercase text-zinc-500">Fail</span>
                            <span className={cn("text-xs font-bold", log.failed > 0 ? "text-red-400" : "text-zinc-500")}>
                              {log.failed}
                            </span>
                          </div>
                        </div>

                        {/* End stats / expansion */}
                        <div className="flex items-center gap-4 ml-auto sm:ml-0">
                          <div className="text-right">
                            <span className="block text-[8px] font-mono uppercase text-zinc-500">Duration</span>
                            <span className="text-xs font-mono text-zinc-300">{Math.round(log.duration / 1000)}s</span>
                          </div>
                          
                          {(log.errors.length > 0) && (
                            <button
                              onClick={() => setExpandedLogId(isExpanded ? null : log.id || null)}
                              className="p-1.5 rounded-lg border border-white/5 bg-zinc-900 text-zinc-400 hover:text-white transition-colors"
                            >
                              <ChevronDown className={cn("w-4 h-4 transition-transform", isExpanded && "rotate-180")} />
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Expandable errors list */}
                      {isExpanded && log.errors.length > 0 && (
                        <div className="mt-4 p-4 rounded-xl bg-red-950/20 border border-red-900/20 space-y-2">
                          <span className="block text-[9px] font-mono uppercase text-red-400 font-bold tracking-widest flex items-center gap-1">
                            <AlertCircle className="w-3.5 h-3.5" /> Pipeline Error Logs ({log.errors.length})
                          </span>
                          <ul className="list-disc list-inside text-xs font-mono text-zinc-400 space-y-1">
                            {log.errors.map((err, idx) => (
                              <li key={idx} className="leading-relaxed">
                                {err}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* POPUP SUMMARY MODAL (Phase 9 Sync Summary) */}
      {syncSummary && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-zinc-950 border border-white/5 rounded-[32px] p-8 max-w-md w-full space-y-6 shadow-2xl">
            <div className="flex items-center gap-3 border-b border-zinc-800 pb-4">
              <div className="p-2.5 rounded-2xl bg-accent/10 border border-accent/20">
                <Sparkles className="w-6 h-6 text-accent animate-pulse" />
              </div>
              <div>
                <h3 className="text-lg font-black font-display text-white">Synchronization Complete</h3>
                <p className="text-xs font-mono text-zinc-400">Ingested and updated Omnichannel channels.</p>
              </div>
            </div>

            <div className="space-y-3.5 bg-zinc-900/50 p-5 rounded-2xl border border-white/5">
              <div className="flex justify-between items-center text-xs font-mono">
                <span className="text-zinc-400">New Content Ingested:</span>
                <span className="font-bold text-emerald-400 text-sm">+{syncSummary.imported}</span>
              </div>
              <div className="flex justify-between items-center text-xs font-mono">
                <span className="text-zinc-400">Existing Content Updated:</span>
                <span className="font-bold text-accent text-sm">+{syncSummary.updated}</span>
              </div>
              <div className="flex justify-between items-center text-xs font-mono">
                <span className="text-zinc-400">Skipped (No changes):</span>
                <span className="font-bold text-zinc-400">{syncSummary.skipped}</span>
              </div>
              <div className="flex justify-between items-center text-xs font-mono border-b border-zinc-800 pb-3">
                <span className="text-zinc-400">Skipped (With failures):</span>
                <span className={cn("font-bold", syncSummary.failed > 0 ? "text-red-400" : "text-zinc-500")}>
                  {syncSummary.failed}
                </span>
              </div>
              <div className="flex justify-between items-center text-xs font-mono pt-1">
                <span className="text-zinc-400">Execution Time:</span>
                <span className="text-zinc-300 font-bold">{Math.round(syncSummary.duration / 1000)} seconds</span>
              </div>
            </div>

            {syncSummary.errors.length > 0 && (
              <div className="p-3.5 rounded-xl bg-red-950/10 border border-red-950/30 max-h-32 overflow-y-auto">
                <span className="block text-[9px] font-mono uppercase text-red-400 font-bold mb-1">Encountered Issues ({syncSummary.errors.length})</span>
                <ul className="text-[10px] font-mono text-zinc-500 list-disc list-inside space-y-0.5">
                  {syncSummary.errors.map((e, idx) => (
                    <li key={idx} className="truncate">{e}</li>
                  ))}
                </ul>
              </div>
            )}

            <button
              onClick={clearSyncSummary}
              className="w-full py-4 bg-accent hover:bg-white text-white hover:text-black rounded-xl text-xs font-black uppercase tracking-widest transition-all shadow-xl shadow-accent/15"
            >
              Close Summary View
            </button>
          </div>
        </div>
      )}

      {/* PLATFORM CONNECTION MODAL */}
      {isConnectModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-zinc-950 border border-white/5 rounded-[32px] p-8 max-w-md w-full space-y-6 shadow-2xl">
            <div className="flex items-center gap-3 border-b border-zinc-800 pb-4">
              <Link className="w-5 h-5 text-accent" />
              <div>
                <h3 className="text-lg font-black font-display text-white">Connect {connectPlatform}</h3>
                <p className="text-xs font-mono text-zinc-400">Setup channel feeds and credential links.</p>
              </div>
            </div>

            {connectPlatform === "Medium" || connectPlatform === "YouTube" ? (
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="block text-[10px] font-mono uppercase tracking-widest text-zinc-400">{connectPlatform} RSS Feed URL</label>
                  <input
                    type="url"
                    value={rssUrlInput}
                    onChange={(e) => setRssUrlInput(e.target.value)}
                    className="w-full p-3.5 rounded-xl bg-zinc-900 border border-white/5 text-xs text-white outline-none focus:border-accent font-mono"
                  />
                </div>
                <div className="p-4 rounded-xl bg-zinc-900/40 border border-white/5 flex gap-3 text-[11px] text-zinc-400 leading-relaxed">
                  <Info className="w-5 h-5 text-accent shrink-0 mt-0.5" />
                  <p>
                    By default, we read from {connectPlatform}'s standard feed URL. No private API key is required.
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-zinc-900/40 border border-white/5 flex gap-3 text-[11px] text-zinc-400 leading-relaxed">
                  <Info className="w-5 h-5 text-accent shrink-0 mt-0.5" />
                  <p>
                    Future support: This platform's API connection will use standard secure credentials stored server-side.
                  </p>
                </div>
                <div className="space-y-2">
                  <label className="block text-[10px] font-mono uppercase tracking-widest text-zinc-400">API Connection String (Client ID)</label>
                  <input
                    type="text"
                    placeholder="Enter Client ID or Integration Handle"
                    className="w-full p-3.5 rounded-xl bg-zinc-900 border border-white/5 text-xs text-zinc-600 outline-none focus:border-accent cursor-not-allowed"
                    disabled
                  />
                </div>
              </div>
            )}

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setIsConnectModalOpen(false)}
                className="flex-1 py-3.5 border border-white/5 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 rounded-xl text-[10px] font-black uppercase tracking-widest transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveConnection}
                className="flex-1 py-3.5 bg-accent hover:bg-white text-white hover:text-black rounded-xl text-[10px] font-black uppercase tracking-widest transition-all"
              >
                Save Connection
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
