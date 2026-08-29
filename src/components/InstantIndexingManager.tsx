import React, { useState, useEffect } from "react";
import { 
  Send, 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  RefreshCw, 
  ExternalLink, 
  Globe, 
  Clock, 
  Trash2, 
  Sparkles,
  Search,
  Radio,
  Layers
} from "lucide-react";
import { 
  sendInstantIndexPing, 
  sendBulkInstantIndex, 
  getSavedIndexingLogs, 
  clearSavedIndexingLogs, 
  IndexingLogEntry 
} from "../services/indexingService";
import { blogPosts } from "../data/blogPosts";

interface InstantIndexingManagerProps {
  currentUrl?: string;
  currentTitle?: string;
  themeMode: "dark" | "light";
  triggerToast: (message: string, type?: "success" | "error" | "info") => void;
}

export function InstantIndexingManager({
  currentUrl = "https://harikiran-portfolio.netlify.app/blog",
  currentTitle = "G. Hari Kiran Growth Platform",
  themeMode,
  triggerToast
}: InstantIndexingManagerProps) {
  const [customUrl, setCustomUrl] = useState(currentUrl);
  const [isPinging, setIsPinging] = useState(false);
  const [isBulkPinging, setIsBulkPinging] = useState(false);
  const [logs, setLogs] = useState<IndexingLogEntry[]>([]);
  const [activeTab, setActiveTab] = useState<"single" | "bulk" | "logs">("single");

  // Sync customUrl if currentUrl changes
  useEffect(() => {
    if (currentUrl) {
      setCustomUrl(currentUrl);
    }
  }, [currentUrl]);

  // Load saved indexing logs
  useEffect(() => {
    setLogs(getSavedIndexingLogs());
  }, []);

  // Handle single URL instant indexing ping
  const handleTriggerIndex = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!customUrl.trim()) {
      triggerToast("Please enter a valid URL to index", "error");
      return;
    }

    setIsPinging(true);
    triggerToast("Broadcasting instant crawl notification to Google & IndexNow...", "info");

    try {
      const result = await sendInstantIndexPing(customUrl, currentTitle);
      setLogs(getSavedIndexingLogs());

      if (result.success) {
        triggerToast("Google & IndexNow bots notified successfully! Crawl prioritized.", "success");
      } else {
        triggerToast("Indexing notification dispatched with notices. Check logs.", "info");
      }
    } catch (err: any) {
      triggerToast(err.message || "Failed to trigger instant indexing", "error");
    } finally {
      setIsPinging(false);
    }
  };

  // Handle bulk instant indexing
  const handleBulkIndex = async () => {
    setIsBulkPinging(true);
    triggerToast(`Submitting all ${blogPosts.length} canonical articles and tools to IndexNow & Google...`, "info");

    try {
      const allUrls = [
        ...blogPosts.map(p => ({ url: `https://harikiran-portfolio.netlify.app/blog/${p.slug}`, title: p.title })),
        { url: "https://harikiran-portfolio.netlify.app/seo-audit", title: "Free Technical SEO Audit Tool" },
        { url: "https://harikiran-portfolio.netlify.app/calculator", title: "Marketing ROI Calculator" },
        { url: "https://harikiran-portfolio.netlify.app/work", title: "Client Case Studies" }
      ];

      await sendBulkInstantIndex(allUrls);
      setLogs(getSavedIndexingLogs());
      triggerToast(`Successfully dispatched instant indexing for ${allUrls.length} pages!`, "success");
    } catch (err: any) {
      triggerToast("Bulk indexing failed: " + err.message, "error");
    } finally {
      setIsBulkPinging(false);
    }
  };

  const handleClearLogs = () => {
    clearSavedIndexingLogs();
    setLogs([]);
    triggerToast("Cleared indexing history logs", "info");
  };

  return (
    <div className={`rounded-2xl border p-5 space-y-5 ${
      themeMode === "dark" ? "bg-zinc-900/90 border-white/10" : "bg-white border-zinc-200 shadow-sm"
    }`}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-4 border-white/5">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400">
              <Radio className="w-4 h-4 animate-pulse" />
            </div>
            <h3 className="text-sm font-bold tracking-tight flex items-center gap-1.5">
              Google & IndexNow Instant Indexing
              <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/25">
                Live Stream
              </span>
            </h3>
          </div>
          <p className="text-xs text-zinc-400">
            Direct real-time API dispatch to Googlebot, Bing, Yandex, and Seznam search engines for immediate crawling.
          </p>
        </div>

        {/* Tab navigation */}
        <div className="flex items-center gap-1 bg-zinc-800/40 p-1 rounded-xl">
          <button
            type="button"
            onClick={() => setActiveTab("single")}
            className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors ${
              activeTab === "single" ? "bg-accent text-white" : "text-zinc-400 hover:text-zinc-200"
            }`}
          >
            Direct Ping
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("bulk")}
            className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors ${
              activeTab === "bulk" ? "bg-accent text-white" : "text-zinc-400 hover:text-zinc-200"
            }`}
          >
            Bulk Site Ping
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("logs")}
            className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1 ${
              activeTab === "logs" ? "bg-accent text-white" : "text-zinc-400 hover:text-zinc-200"
            }`}
          >
            Logs ({logs.length})
          </button>
        </div>
      </div>

      {/* Tab: Single Instant Ping */}
      {activeTab === "single" && (
        <form onSubmit={handleTriggerIndex} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">
              Target Canonical URL to Index
            </label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Globe className="w-3.5 h-3.5 absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-500" />
                <input
                  type="text"
                  required
                  value={customUrl}
                  onChange={(e) => setCustomUrl(e.target.value)}
                  placeholder="https://harikiran-portfolio.netlify.app/blog/your-slug"
                  className={`w-full pl-9 pr-3 py-2.5 rounded-xl border text-xs font-mono focus:outline-none focus:ring-1 focus:ring-accent ${
                    themeMode === "dark" 
                      ? "bg-zinc-950 border-white/10 text-zinc-200" 
                      : "bg-zinc-50 border-zinc-200 text-zinc-800"
                  }`}
                />
              </div>

              <button
                type="submit"
                disabled={isPinging}
                className="px-4 py-2.5 rounded-xl bg-accent text-white font-bold text-xs hover:bg-accent/90 disabled:opacity-50 flex items-center gap-1.5 flex-shrink-0 cursor-pointer shadow-md shadow-accent/15"
              >
                {isPinging ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    Pinging...
                  </>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    Publish to Google & IndexNow
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Protocols active grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-2">
            <div className={`p-3 rounded-xl border space-y-1 ${
              themeMode === "dark" ? "bg-zinc-950/60 border-white/5" : "bg-zinc-50 border-zinc-200"
            }`}>
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-zinc-300">Google Indexing API</span>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              </div>
              <p className="text-[10px] text-zinc-500">Fast-track crawl prioritization queue</p>
            </div>

            <div className={`p-3 rounded-xl border space-y-1 ${
              themeMode === "dark" ? "bg-zinc-950/60 border-white/5" : "bg-zinc-50 border-zinc-200"
            }`}>
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-zinc-300">IndexNow Protocol</span>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              </div>
              <p className="text-[10px] text-zinc-500">Bing, Yandex, Seznam & Naver instant crawl</p>
            </div>

            <div className={`p-3 rounded-xl border space-y-1 ${
              themeMode === "dark" ? "bg-zinc-950/60 border-white/5" : "bg-zinc-50 border-zinc-200"
            }`}>
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-zinc-300">Sitemap Webhook Ping</span>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              </div>
              <p className="text-[10px] text-zinc-500">Automated Google sitemap crawler ping</p>
            </div>
          </div>
        </form>
      )}

      {/* Tab: Bulk Site Ping */}
      {activeTab === "bulk" && (
        <div className="space-y-4">
          <div className="space-y-1">
            <h4 className="text-xs font-bold text-zinc-200">
              Bulk Broadcast All Site URLs
            </h4>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Dispatches all {blogPosts.length} canonical blog articles, technical case studies, and interactive SEO tools to Google Indexing API and IndexNow in a synchronized batch.
            </p>
          </div>

          <div className="p-4 rounded-xl border border-white/5 bg-zinc-950/40 flex items-center justify-between gap-4 flex-wrap">
            <div className="space-y-0.5">
              <span className="text-xs font-bold text-zinc-300">
                Total Canonical Endpoints: {blogPosts.length + 3} URLs
              </span>
              <p className="text-[11px] text-zinc-500">Includes all 6 newly resolved canonicals + Core Tools</p>
            </div>

            <button
              type="button"
              disabled={isBulkPinging}
              onClick={handleBulkIndex}
              className="px-4 py-2 rounded-xl bg-accent text-white font-bold text-xs hover:bg-accent/90 disabled:opacity-50 flex items-center gap-1.5 cursor-pointer"
            >
              {isBulkPinging ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  Broadcasting Batch...
                </>
              ) : (
                <>
                  <Layers className="w-3.5 h-3.5" />
                  Submit All {blogPosts.length + 3} URLs Now
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Tab: Logs Feed */}
      {activeTab === "logs" && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-zinc-400">
              Recent Indexing Broadcasts ({logs.length})
            </span>
            {logs.length > 0 && (
              <button
                type="button"
                onClick={handleClearLogs}
                className="text-[10px] text-zinc-500 hover:text-red-400 flex items-center gap-1 transition-colors"
              >
                <Trash2 className="w-3 h-3" /> Clear History
              </button>
            )}
          </div>

          {logs.length === 0 ? (
            <div className="text-center py-8 text-zinc-500 text-xs">
              No indexing notifications logged yet. Dispatch a ping to view real-time crawl dispatch records.
            </div>
          ) : (
            <div className="space-y-2.5 max-h-[260px] overflow-y-auto pr-1 font-mono text-[11px]">
              {logs.map((log) => (
                <div
                  key={log.id}
                  className={`p-3 rounded-xl border space-y-1.5 ${
                    log.success
                      ? "bg-emerald-950/20 border-emerald-500/20 text-zinc-300"
                      : "bg-red-950/20 border-red-500/20 text-zinc-300"
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-bold truncate text-zinc-200">
                      {log.title || log.targetUrl}
                    </span>
                    <span className="text-[10px] text-zinc-500 flex-shrink-0 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                    </span>
                  </div>

                  <p className="text-[10px] text-zinc-400 truncate">
                    {log.targetUrl}
                  </p>

                  <div className="flex items-center gap-3 text-[10px] pt-1 border-t border-white/5 text-zinc-400 flex-wrap">
                    <span className="flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                      Google Indexing: {log.services?.googleIndexing?.status || "OK"}
                    </span>
                    <span className="flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                      IndexNow: {log.services?.indexNow?.status || "OK"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
