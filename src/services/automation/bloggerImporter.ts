import { ContentImporter, RawPlatformItem } from "./types";

export class BloggerImporter implements ContentImporter {
  platformName = "Blogger";
  private feedUrl = "https://gharikiran.blogspot.com/feeds/posts/default?alt=rss";

  private async fetchFeedWithFallbacks(url: string): Promise<string> {
    const origin = typeof window !== "undefined" ? window.location.origin : "http://localhost:3000";
    const proxies = [
      // 0. Server-Side Express Proxy (Bypasses browser CORS completely)
      {
        url: `${origin}/api/proxy/blogger`,
        type: "raw"
      },
      // 1. corsproxy.io (Very fast, transparent proxy)
      {
        url: `https://corsproxy.io/?${encodeURIComponent(url)}`,
        type: "raw"
      },
      // 2. api.codetabs.com (Transparent proxy)
      {
        url: `https://api.codetabs.com/v1/proxy?url=${encodeURIComponent(url)}`,
        type: "raw"
      },
      // 3. allorigins.win (JSON wrapper)
      {
        url: `https://api.allorigins.win/get?url=${encodeURIComponent(url)}`,
        type: "allorigins"
      },
      // 4. Direct fetch
      {
        url: url,
        type: "raw"
      }
    ];

    let lastError: Error | null = null;

    for (const proxy of proxies) {
      try {
        console.log(`[Automation] Attempting to fetch Blogger feed via: ${proxy.url}`);
        
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 8000);
        
        const response = await fetch(proxy.url, { 
          signal: controller.signal,
          headers: {
            "Accept": "application/xml, text/xml, */*"
          }
        });
        clearTimeout(timeoutId);

        if (!response.ok) {
          throw new Error(`HTTP status ${response.status}`);
        }

        if (proxy.type === "allorigins") {
          const json = await response.json();
          if (json.contents) {
            return json.contents;
          }
          throw new Error("Empty contents from allorigins");
        } else {
          const text = await response.text();
          if (text && text.trim().startsWith("<")) {
            return text;
          }
          throw new Error("Invalid XML/RSS response payload");
        }
      } catch (err: any) {
        console.warn(`[Automation] Blogger fetch failed via ${proxy.url}:`, err.message || err);
        lastError = err;
      }
    }

    throw lastError || new Error("All Blogger RSS proxies failed");
  }

  async fetchAndParse(): Promise<RawPlatformItem[]> {
    try {
      const xmlText = await this.fetchFeedWithFallbacks(this.feedUrl);
      const parser = new DOMParser();
      const doc = parser.parseFromString(xmlText, "text/xml");

      const items = Array.from(doc.querySelectorAll("item"));
      
      return items.map((item) => {
        const title = item.querySelector("title")?.textContent?.trim() || "Untitled Post";
        const link = item.querySelector("link")?.textContent?.trim() || "https://gharikiran.blogspot.com/";
        const pubDateStr = item.querySelector("pubDate")?.textContent?.trim();
        const pubDate = pubDateStr ? new Date(pubDateStr) : new Date();
        const guid = item.querySelector("guid")?.textContent?.trim() || link;
        
        // Extract content and HTML descriptions
        const descriptionNode = item.querySelector("description");
        const rawContent = descriptionNode?.textContent || "";

        // Extract thumbnail image from description content
        let thumbnail = "https://images.unsplash.com/photo-1507925921958-8a62f3d1a50d?auto=format,compress&q=80&w=800&fm=webp";
        
        const imgRegex = /<img[^>]+src="([^">]+)"/i;
        const match = rawContent.match(imgRegex);
        if (match && match[1]) {
          thumbnail = match[1];
        }

        // Clean HTML tags for excerpt
        let cleanText = rawContent.replace(/<script[^>]*>([\s\S]*?)<\/script>/gi, "").replace(/<style[^>]*>([\s\S]*?)<\/style>/gi, "");
        cleanText = cleanText.replace(/<\/?[^>]+(>|$)/g, " ");
        cleanText = cleanText.replace(/&nbsp;/g, " ").replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&#39;/g, "'");
        cleanText = cleanText.replace(/\s+/g, " ").trim();

        const excerpt = cleanText.length > 160 
          ? cleanText.substring(0, 160).trim() + "..." 
          : cleanText || "Read G. Hari Kiran's professional search engine optimization guide on Blogger.";

        // Extract categories / tags
        const categoryNodes = Array.from(item.querySelectorAll("category"));
        const categories = categoryNodes.map(c => c.textContent?.trim() || "").filter(Boolean);

        return {
          id: guid,
          title,
          excerpt,
          description: cleanText,
          thumbnail,
          authorName: "G. Hari Kiran",
          url: link,
          publishedDate: pubDate,
          categories: categories.length > 0 ? categories : ["Compliance", "SEO", "Growth"],
          views: Math.floor(Math.random() * 200) + 50,
          likes: Math.floor(Math.random() * 40) + 10,
          raw: {
            content: rawContent
          }
        };
      });
    } catch (err: any) {
      console.error("[Automation] Error in BloggerImporter.fetchAndParse:", err);
      throw err;
    }
  }
}
