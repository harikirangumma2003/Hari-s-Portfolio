import { RawPlatformItem } from "./types";

// Allowed categories in the CMS
type CMSCategory = 'SEO Tips' | 'Marketing' | 'AI' | 'Growth' | 'Compliance' | 'Retention' | 'Video';

/**
 * Maps arbitrary category strings to one of the exact CMS categories.
 */
function mapToCMSCategory(categories: string[]): CMSCategory {
  if (!categories || categories.length === 0) return 'Growth';
  
  const joined = categories.join(" ").toLowerCase();
  
  if (joined.includes("seo") || joined.includes("search engine")) return 'SEO Tips';
  if (joined.includes("marketing") || joined.includes("advertis") || joined.includes("branding")) return 'Marketing';
  if (joined.includes("ai") || joined.includes("artificial") || joined.includes("gpt") || joined.includes("machine learning")) return 'AI';
  if (joined.includes("compliance") || joined.includes("legal") || joined.includes("regulation") || joined.includes("governance")) return 'Compliance';
  if (joined.includes("retention") || joined.includes("churn") || joined.includes("cohort") || joined.includes("loyalty")) return 'Retention';
  if (joined.includes("growth") || joined.includes("product") || joined.includes("saas") || joined.includes("startup")) return 'Growth';
  if (joined.includes("video")) return 'Video';
  
  return 'Growth'; // Fallback
}

/**
 * Calculates a rough read time in minutes based on word count.
 */
function estimateReadTime(text: string): string {
  if (!text) return "3 min read";
  const cleanText = text.replace(/<\/?[^>]+(>|$)/g, ""); // Strip HTML
  const words = cleanText.trim().split(/\s+/).length;
  const minutes = Math.max(1, Math.ceil(words / 200));
  return `${minutes} min read`;
}

/**
 * Generates an array of search keywords from the document text.
 */
function generateSearchKeywords(title: string, excerpt: string, tags: string[]): string[] {
  const combined = `${title} ${excerpt} ${tags.join(" ")}`.toLowerCase();
  const words = combined.match(/\b[a-z0-9]{3,}\b/g) || [];
  return Array.from(new Set(words)).slice(0, 30); // Max 30 keywords
}

/**
 * Generates a clean URL slug from the title.
 */
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "") // remove non-alphanumeric except space and hyphen
    .replace(/[\s_]+/g, "-") // replace spaces and underscores with hyphen
    .replace(/-+/g, "-"); // remove duplicate hyphens
}

export class ContentNormalizer {
  /**
   * Normalizes a raw platform item into the exact structure required by both 
   * the existing CMS code (ContentHubItem) and Phase 7 guidelines.
   */
  static normalize(
    item: RawPlatformItem,
    platform: 'Blogger' | 'Medium' | 'YouTube' | 'LinkedIn' | 'Instagram' | 'X' | 'Threads',
    contentType: 'Blog' | 'Video' | 'Social Post'
  ): any {
    const now = new Date();

    if (platform === 'YouTube') {
      const titleStr = item.title || "Untitled Video";
      const descStr = item.description || "";
      const slug = generateSlug(titleStr);
      
      // Detect if YouTube Short from title/description
      const isShort = titleStr.toLowerCase().includes("#shorts") || 
                      titleStr.toLowerCase().includes("#short") || 
                      descStr.toLowerCase().includes("#shorts") || 
                      descStr.toLowerCase().includes("#short");
      const finalContentType = isShort ? "Short" : "Video";
      
      // Tags generation
      let tags = item.categories || [];
      if (tags.length === 0) {
        const stopWords = new Set(["with", "from", "that", "this", "your", "what", "how", "why", "who", "when", "where", "about", "their", "them", "then"]);
        const titleWords = titleStr
          .toLowerCase()
          .replace(/[^\w\s]/g, "")
          .split(/\s+/)
          .filter(w => w.length >= 4 && !stopWords.has(w));
        tags = Array.from(new Set(titleWords)).slice(0, 5);
      }

      // Generate search keywords using: title, category, platform
      const searchKeywords = Array.from(new Set(
        `${titleStr} Video YouTube`
          .toLowerCase()
          .match(/\b[a-z0-9]{3,}\b/g) || []
      ));

      return {
        title: titleStr,
        description: descStr,
        excerpt: item.excerpt || titleStr,
        platform: "YouTube",
        contentType: finalContentType,
        category: "Video",
        author: {
          name: "Hari Kiran",
          website: "https://harikiran-portfolio.netlify.app",
          designation: "Digital Marketing Expert & Growth Strategist",
          role: "Digital Marketing Expert & Growth Strategist", // Compatibility
          image: "https://i.postimg.cc/d1MxW0j1/Hari-Portfolio.png"
        },
        status: "Published",
        visibility: "public",
        source: "YouTube RSS",
        syncStatus: "synced",
        language: "en",
        featured: false,
        slug,
        publishedDate: item.publishedDate || now,
        
        thumbnail: item.thumbnail || "", // Compatibility
        image: {
          thumbnail: item.thumbnail || "",
          alt: titleStr,
          width: 1280,
          height: 720
        },
        
        seo: {
          metaTitle: titleStr.slice(0, 60),
          metaDescription: descStr.slice(0, 160),
          canonical: `/content/${slug}`,
          canonicalUrl: `/content/${slug}`,
          robots: "index,follow"
        },
        
        // Root SEO for compatibility
        metaTitle: titleStr.slice(0, 60),
        metaDescription: descStr.slice(0, 160),
        canonicalUrl: `/content/${slug}`,
        robots: "index, follow",
        ogImage: item.thumbnail || "",
        ogType: "video.other",
        
        metrics: {
          views: item.views || 0,
          likes: item.likes || 0,
          comments: Math.floor((item.views || 0) * 0.005) + 1,
          shares: Math.floor((item.views || 0) * 0.01) + 2,
          bookmarks: Math.floor((item.views || 0) * 0.015) + 3
        },
        // Root metrics for sorting/compatibility
        views: item.views || 0,
        likes: item.likes || 0,
        
        url: `https://www.youtube.com/watch?v=${item.id}`,
        
        externalIds: {
          youtube: item.id
        },
        
        tags,
        searchKeywords,
        readTime: "3 min watch",
        
        createdAt: now,
        updatedAt: now
      };
    }

    const titleStr = item.title || "Untitled Article";
    const descStr = item.description || "";
    const excerptStr = item.excerpt || titleStr;
    const itemCategories = item.categories || [];
    const itemThumbnail = item.thumbnail || "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80";

    const cmsCategory = mapToCMSCategory(itemCategories);
    const readTime = estimateReadTime(descStr);
    
    // Normalize tags to lowercase and filter out empty ones
    const tags = itemCategories
      .map(c => (c || "").trim().toLowerCase())
      .filter(c => c.length > 0)
      .slice(0, 8); // Max 8 tags

    const searchKeywords = generateSearchKeywords(titleStr, excerptStr, tags);
    
    // We construct a document that fulfills BOTH:
    // 1. The original ContentHubItem interface used in the UI list, details, and editor
    // 2. The custom fields requested in PHASE 7 (author, image, metrics, seo, etc.)
    return {
      title: titleStr,
      excerpt: excerptStr,
      description: descStr,
      thumbnail: itemThumbnail,
      image: itemThumbnail, // Phase 7
      platform,
      contentType,
      category: cmsCategory,
      tags,
      searchKeywords, // Phase 7
      url: item.url || "",
      featured: false,
      publishedDate: item.publishedDate || now,
      readTime,
      views: item.views || 0,
      likes: item.likes || 0,
      metrics: { // Phase 7
        views: item.views || 0,
        likes: item.likes || 0,
        comments: Math.floor((item.views || 0) * 0.005) + 1,
        shares: Math.floor((item.views || 0) * 0.01) + 2,
        bookmarks: Math.floor((item.views || 0) * 0.015) + 3
      },
      author: {
        name: item.authorName || "G. Hari Kiran",
        role: "Growth Strategist",
        image: "https://i.postimg.cc/d1MxW0j1/Hari-Portfolio.png"
      },
      status: "Published",
      visibility: "public",
      language: "en", // Phase 7
      
      // External IDs mapped per platform (Phase 6 & 7)
      externalIds: {
        [platform.toLowerCase()]: item.id
      },
      
      // SEO compliance
      metaTitle: titleStr.slice(0, 60),
      metaDescription: excerptStr.slice(0, 160),
      canonicalUrl: item.url || "",
      robots: "index, follow",
      ogImage: itemThumbnail,
      ogType: (platform as string) === 'YouTube' ? 'video.other' : 'article',
      
      seo: { // Phase 7
        metaTitle: titleStr.slice(0, 60),
        metaDescription: excerptStr.slice(0, 160),
        canonicalUrl: item.url || "",
        robots: "index, follow",
        ogImage: itemThumbnail,
        ogType: (platform as string) === 'YouTube' ? 'video.other' : 'article'
      },
      
      createdAt: now,
      updatedAt: now
    };
  }
}
