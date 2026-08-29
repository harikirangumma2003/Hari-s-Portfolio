/**
 * Instant Indexing Client Service
 * Connects to Google Indexing API, IndexNow (Bing/Yandex/Seznam),
 * and search engine sitemap notification endpoints.
 */

export interface IndexingResponse {
  success: boolean;
  timestamp: string;
  targetUrl: string;
  type: "URL_UPDATED" | "URL_DELETED";
  services: {
    googleIndexing: {
      status: "success" | "skipped" | "error";
      message: string;
    };
    indexNow: {
      status: "success" | "skipped" | "error";
      message: string;
    };
    sitemapPing: {
      status: "success" | "skipped" | "error";
      message: string;
    };
  };
  message: string;
}

export interface IndexingLogEntry extends IndexingResponse {
  id: string;
  title?: string;
}

const LOCAL_STORAGE_KEY = "portfolio_instant_indexing_logs";

/**
 * Dispatches an Instant Indexing ping to the server
 */
export async function sendInstantIndexPing(
  url: string,
  title?: string,
  type: "URL_UPDATED" | "URL_DELETED" = "URL_UPDATED"
): Promise<IndexingResponse> {
  try {
    const formattedUrl = url.startsWith("http")
      ? url
      : `https://harikiran-portfolio.netlify.app${url.startsWith("/") ? "" : "/"}${url}`;

    const res = await fetch("/api/indexing/publish", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        url: formattedUrl,
        type,
        title
      })
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.message || `Server returned HTTP ${res.status}`);
    }

    const data: IndexingResponse = await res.json();
    
    // Save to local indexing history logs
    saveIndexingLog({
      ...data,
      id: `${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      title
    });

    return data;
  } catch (err: any) {
    console.error("Instant indexing ping failed:", err);
    const fallbackResponse: IndexingResponse = {
      success: false,
      timestamp: new Date().toISOString(),
      targetUrl: url,
      type,
      services: {
        googleIndexing: { status: "error", message: err.message || "Failed to reach indexing endpoint" },
        indexNow: { status: "error", message: err.message || "Failed to reach IndexNow endpoint" },
        sitemapPing: { status: "error", message: err.message || "Failed to reach sitemap ping" }
      },
      message: err.message || "Instant indexing request failed"
    };

    saveIndexingLog({
      ...fallbackResponse,
      id: `${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      title
    });

    return fallbackResponse;
  }
}

/**
 * Dispatches a batch of URLs for instant indexing
 */
export async function sendBulkInstantIndex(urls: { url: string; title?: string }[]): Promise<IndexingResponse[]> {
  const results: IndexingResponse[] = [];
  for (const item of urls) {
    const res = await sendInstantIndexPing(item.url, item.title, "URL_UPDATED");
    results.push(res);
    // Slight throttle between requests
    await new Promise((r) => setTimeout(r, 120));
  }
  return results;
}

/**
 * Retrieve saved indexing logs from local storage
 */
export function getSavedIndexingLogs(): IndexingLogEntry[] {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

/**
 * Save an indexing log entry
 */
function saveIndexingLog(entry: IndexingLogEntry) {
  try {
    const existing = getSavedIndexingLogs();
    const updated = [entry, ...existing.filter(e => e.targetUrl !== entry.targetUrl || e.timestamp !== entry.timestamp)].slice(0, 50);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
  } catch (e) {
    console.warn("Unable to save indexing log to localStorage:", e);
  }
}

/**
 * Clear saved indexing logs
 */
export function clearSavedIndexingLogs() {
  localStorage.removeItem(LOCAL_STORAGE_KEY);
}
