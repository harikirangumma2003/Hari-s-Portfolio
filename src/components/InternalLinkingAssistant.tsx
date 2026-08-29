import React, { useState, useMemo } from "react";
import { 
  Link as LinkIcon, 
  Sparkles, 
  CheckCircle2, 
  Plus, 
  ExternalLink, 
  Search, 
  TrendingUp, 
  Layers, 
  Copy, 
  Check, 
  HelpCircle,
  Wrench,
  BookOpen,
  Briefcase
} from "lucide-react";
import { blogPosts } from "../data/blogPosts";

export interface InternalTarget {
  id: string;
  title: string;
  url: string;
  category: string;
  type: "Blog" | "Case Study" | "Tool" | "Core Page";
  keywords: string[];
  description: string;
}

// Complete registry of internal linking assets across the portfolio
const INTERNAL_TARGETS: InternalTarget[] = [
  // Interactive Tools & Core High-Value Pages
  {
    id: "tool-seo-audit",
    title: "Free Interactive Technical SEO Audit Tool",
    url: "/seo-audit",
    category: "Tools",
    type: "Tool",
    keywords: ["seo audit", "technical audit", "core web vitals", "inp test", "meta tags checker"],
    description: "Interactive real-time diagnostic engine checking INP, crawlability, canonicals, and Core Web Vitals."
  },
  {
    id: "tool-roi-calculator",
    title: "B2B Marketing & SEO ROI Calculator",
    url: "/calculator",
    category: "Tools",
    type: "Tool",
    keywords: ["roi calculator", "marketing budget", "customer acquisition cost", "ltv calculator", "seo roi"],
    description: "Interactive financial modeling tool for forecasting payback periods and revenue returns."
  },
  {
    id: "page-resources",
    title: "Curated Growth & SEO Resources Hub",
    url: "/resources",
    category: "Resources",
    type: "Core Page",
    keywords: ["growth frameworks", "checklists", "marketing templates", "seo workflows"],
    description: "Downloadable SOPs, audit checklists, and strategic growth playbooks."
  },
  {
    id: "page-contact",
    title: "Work With G. Hari Kiran (Strategy Inquiry)",
    url: "/contact",
    category: "Conversion",
    type: "Core Page",
    keywords: ["hire seo consultant", "contact hari kiran", "consulting inquiry", "strategy audit"],
    description: "Direct booking and project inquiry channel for founders and growth teams."
  },
  // Work Case Studies
  {
    id: "work-local-search",
    title: "Case Study: Local Search Dominance (+285% Inbound Calls)",
    url: "/work/local-search-dominance",
    category: "SEO",
    type: "Case Study",
    keywords: ["local seo", "google business profile", "map pack ranking", "local citations"],
    description: "Multi-location SEO playbook scaling inbound qualified phone calls."
  },
  {
    id: "work-b2b-lead-engine",
    title: "Case Study: High-Conversion B2B Inbound Lead Engine",
    url: "/work/b2b-lead-engine",
    category: "Growth",
    type: "Case Study",
    keywords: ["b2b lead generation", "conversion rate optimization", "cro", "pipeline velocity"],
    description: "Complete funnel restructuring driving high-ticket commercial inquiries."
  },
  {
    id: "work-ecommerce-growth",
    title: "Case Study: E-Commerce Organic Scaler ($420k Net Revenue)",
    url: "/work/ecommerce-growth-engine",
    category: "Growth",
    type: "Case Study",
    keywords: ["ecommerce seo", "product schema", "category ranking", "organic revenue"],
    description: "Product entity graph structuring and category cluster optimization."
  },
  // Published Blog Articles
  ...blogPosts.map(post => ({
    id: `blog-${post.slug}`,
    title: post.title,
    url: `/blog/${post.slug}`,
    category: post.category,
    type: "Blog" as const,
    keywords: post.keywords || [],
    description: post.excerpt
  }))
];

interface InternalLinkingAssistantProps {
  currentTitle: string;
  currentExcerpt: string;
  currentContent: string;
  currentCategory: string;
  focusKeyword: string;
  onInsertLink: (markdownLink: string) => void;
  themeMode: "dark" | "light";
  triggerToast: (message: string, type?: "success" | "error" | "info") => void;
}

export function InternalLinkingAssistant({
  currentTitle,
  currentExcerpt,
  currentContent,
  currentCategory,
  focusKeyword,
  onInsertLink,
  themeMode,
  triggerToast
}: InternalLinkingAssistantProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTypeFilter, setSelectedTypeFilter] = useState<string>("All");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Compute recommendations and relevance scoring
  const recommendations = useMemo(() => {
    const lowerTitle = currentTitle.toLowerCase();
    const lowerExcerpt = currentExcerpt.toLowerCase();
    const lowerBody = currentContent.toLowerCase();
    const lowerFocus = focusKeyword.trim().toLowerCase();
    const currentSlug = currentTitle.toLowerCase().replace(/[^a-z0-9]+/g, "-");

    // Extract current word tokens
    const textPool = `${lowerTitle} ${lowerExcerpt} ${lowerBody} ${lowerFocus}`;
    const cleanTokens = textPool
      .replace(/[^\w\s]/g, " ")
      .split(/\s+/)
      .filter(w => w.length > 3);
    const tokenSet = new Set(cleanTokens);

    return INTERNAL_TARGETS.map(target => {
      // Don't recommend linking to the current article itself
      const isSelf = target.url.includes(currentSlug) && currentSlug.length > 5;
      if (isSelf) return null;

      // Check if already linked in content
      const alreadyLinked = lowerBody.includes(target.url.toLowerCase()) || 
        (target.url.startsWith("/blog/") && lowerBody.includes(target.url.replace("/blog/", "")));

      let relevanceScore = 0;

      // Category match
      if (target.category.toLowerCase() === currentCategory.toLowerCase()) {
        relevanceScore += 25;
      }

      // Target keywords matching current content
      target.keywords.forEach(kw => {
        const lowerKw = kw.toLowerCase();
        if (lowerFocus && (lowerKw.includes(lowerFocus) || lowerFocus.includes(lowerKw))) {
          relevanceScore += 35;
        }
        if (lowerTitle.includes(lowerKw)) {
          relevanceScore += 25;
        } else if (lowerBody.includes(lowerKw)) {
          relevanceScore += 15;
        }
      });

      // Target title tokens matching
      const targetTokens = target.title.toLowerCase().split(/\s+/).filter(w => w.length > 3);
      targetTokens.forEach(t => {
        if (tokenSet.has(t)) relevanceScore += 8;
      });

      // High-priority core tools boost if text mentions audit, calculator, or tools
      if (target.type === "Tool" && (lowerBody.includes("audit") || lowerBody.includes("tool") || lowerBody.includes("calculat"))) {
        relevanceScore += 30;
      }

      const normalizedScore = Math.min(99, Math.max(10, relevanceScore));

      return {
        ...target,
        score: normalizedScore,
        alreadyLinked
      };
    })
    .filter(Boolean) as (InternalTarget & { score: number; alreadyLinked: boolean })[];
  }, [currentTitle, currentExcerpt, currentContent, currentCategory, focusKeyword]);

  // Filter and sort recommendations
  const filteredRecommendations = useMemo(() => {
    return recommendations
      .filter(item => {
        if (selectedTypeFilter !== "All" && item.type !== selectedTypeFilter) return false;
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          return item.title.toLowerCase().includes(q) || 
            item.description.toLowerCase().includes(q) || 
            item.keywords.some(k => k.toLowerCase().includes(q));
        }
        return true;
      })
      .sort((a, b) => {
        // Unlinked with high score first
        if (a.alreadyLinked !== b.alreadyLinked) {
          return a.alreadyLinked ? 1 : -1;
        }
        return b.score - a.score;
      });
  }, [recommendations, searchQuery, selectedTypeFilter]);

  // Overall linking health metrics
  const internalLinkMetrics = useMemo(() => {
    const totalLinked = recommendations.filter(r => r.alreadyLinked).length;
    const targetCount = 3; // Best practice: 3-5 internal links per 1000 words
    return {
      totalLinked,
      targetCount,
      isOptimal: totalLinked >= targetCount,
      status: totalLinked >= 4 ? "Great Link Depth" : totalLinked >= 2 ? "Moderate Linking" : "Needs More Internal Links"
    };
  }, [recommendations]);

  const handleCopyLink = (markdownLink: string, id: string) => {
    navigator.clipboard.writeText(markdownLink);
    setCopiedId(id);
    triggerToast("Copied markdown hyperlink to clipboard!", "success");
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleInsert = (anchor: string, url: string) => {
    const markdown = `[${anchor}](${url})`;
    onInsertLink(markdown);
    triggerToast(`Inserted link to "${anchor}" into article editor!`, "success");
  };

  return (
    <div className={`rounded-2xl border p-5 space-y-5 ${
      themeMode === "dark" 
        ? "bg-zinc-900/90 border-white/10" 
        : "bg-white border-zinc-200 shadow-sm"
    }`}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-4 border-white/5">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-accent/10 text-accent">
              <LinkIcon className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold tracking-tight flex items-center gap-1.5">
              Internal Linking Assistant
              <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-accent/15 text-accent border border-accent/25">
                SEO Power
              </span>
            </h3>
          </div>
          <p className="text-xs text-zinc-400">
            Intelligent semantic suggestions to pass PageRank, boost crawl discovery, and lower bounce rates.
          </p>
        </div>

        {/* Health status badge */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <div className={`px-3 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 ${
            internalLinkMetrics.isOptimal
              ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
              : "bg-amber-500/10 text-amber-400 border-amber-500/20"
          }`}>
            {internalLinkMetrics.isOptimal ? (
              <CheckCircle2 className="w-3.5 h-3.5" />
            ) : (
              <TrendingUp className="w-3.5 h-3.5" />
            )}
            <span>{internalLinkMetrics.totalLinked} Links Active</span>
            <span className="text-[10px] opacity-75 font-normal">({internalLinkMetrics.status})</span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-2">
        <div className="relative flex-1 w-full">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search articles, tools, case studies by topic..."
            className={`w-full pl-9 pr-3 py-2 rounded-xl text-xs border focus:outline-none focus:ring-1 focus:ring-accent ${
              themeMode === "dark"
                ? "bg-zinc-950 border-white/10 text-zinc-200 placeholder-zinc-500"
                : "bg-zinc-50 border-zinc-200 text-zinc-800 placeholder-zinc-400"
            }`}
          />
        </div>

        {/* Type pills */}
        <div className="flex items-center gap-1 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          {["All", "Blog", "Tool", "Case Study", "Core Page"].map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => setSelectedTypeFilter(type)}
              className={`px-2.5 py-1.5 rounded-lg text-[11px] font-semibold whitespace-nowrap transition-colors ${
                selectedTypeFilter === type
                  ? "bg-accent text-white"
                  : themeMode === "dark"
                    ? "bg-zinc-800 text-zinc-400 hover:text-zinc-200"
                    : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Recommendations Cards Feed */}
      <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1">
        {filteredRecommendations.length === 0 ? (
          <div className="text-center py-8 text-zinc-500 text-xs">
            No matching internal pages found. Try clearing your search filter.
          </div>
        ) : (
          filteredRecommendations.slice(0, 10).map((item) => {
            const primaryAnchor = item.title;
            const actionAnchor = item.type === "Tool" 
              ? `our ${item.title}` 
              : item.type === "Case Study"
                ? `our ${item.title.replace("Case Study: ", "")}`
                : `our guide to ${item.title.toLowerCase().replace(/^(the|how to|why)\s+/i, "")}`;

            const markdownToCopy = `[${primaryAnchor}](${item.url})`;

            return (
              <div
                key={item.id}
                className={`p-3.5 rounded-xl border transition-all ${
                  item.alreadyLinked
                    ? themeMode === "dark"
                      ? "bg-emerald-950/20 border-emerald-500/20"
                      : "bg-emerald-50/50 border-emerald-200"
                    : themeMode === "dark"
                      ? "bg-zinc-950/60 border-white/5 hover:border-white/15"
                      : "bg-zinc-50/80 border-zinc-200 hover:border-zinc-300"
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1 flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                        item.type === "Tool"
                          ? "bg-indigo-500/10 text-indigo-400 border border-indigo-500/20"
                          : item.type === "Case Study"
                            ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                            : "bg-accent/10 text-accent border border-accent/20"
                      }`}>
                        {item.type}
                      </span>
                      
                      <span className="text-[10px] text-zinc-500 font-mono">
                        {item.url}
                      </span>

                      {item.alreadyLinked && (
                        <span className="text-[10px] font-semibold text-emerald-400 flex items-center gap-1 bg-emerald-500/10 px-2 py-0.5 rounded">
                          <Check className="w-3 h-3" /> Already In Body
                        </span>
                      )}
                    </div>

                    <h4 className="text-xs font-bold text-zinc-900 dark:text-zinc-100 line-clamp-1">
                      {item.title}
                    </h4>

                    <p className="text-[11px] text-zinc-500 dark:text-zinc-400 line-clamp-1">
                      {item.description}
                    </p>
                  </div>

                  {/* Relevance Dial */}
                  <div className="text-right flex-shrink-0">
                    <div className="text-[11px] font-black text-accent">
                      {item.score}% Match
                    </div>
                    <span className="text-[9px] text-zinc-500 uppercase tracking-wider">
                      Relevance
                    </span>
                  </div>
                </div>

                {/* Quick Anchor Insertion Buttons */}
                <div className="mt-3 pt-2.5 border-t border-white/5 flex items-center justify-between gap-2 flex-wrap">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-[10px] text-zinc-500 font-semibold">
                      1-Click Insert:
                    </span>

                    <button
                      type="button"
                      onClick={() => handleInsert(primaryAnchor, item.url)}
                      className={`text-[10px] font-medium px-2.5 py-1 rounded-lg border transition-colors flex items-center gap-1 ${
                        themeMode === "dark"
                          ? "bg-zinc-900 border-white/10 hover:bg-accent/20 hover:text-accent hover:border-accent/40 text-zinc-300"
                          : "bg-white border-zinc-200 hover:bg-accent/10 hover:text-accent text-zinc-700"
                      }`}
                      title={`Insert: [${primaryAnchor}](${item.url})`}
                    >
                      <Plus className="w-2.5 h-2.5" />
                      Title Anchor
                    </button>

                    <button
                      type="button"
                      onClick={() => handleInsert(actionAnchor, item.url)}
                      className={`text-[10px] font-medium px-2.5 py-1 rounded-lg border transition-colors flex items-center gap-1 ${
                        themeMode === "dark"
                          ? "bg-zinc-900 border-white/10 hover:bg-accent/20 hover:text-accent hover:border-accent/40 text-zinc-300"
                          : "bg-white border-zinc-200 hover:bg-accent/10 hover:text-accent text-zinc-700"
                      }`}
                      title={`Insert: [${actionAnchor}](${item.url})`}
                    >
                      <Plus className="w-2.5 h-2.5" />
                      Natural Phrase
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleCopyLink(markdownToCopy, item.id)}
                    className="text-[10px] text-zinc-400 hover:text-zinc-200 flex items-center gap-1 transition-colors p-1"
                    title="Copy Markdown link to clipboard"
                  >
                    {copiedId === item.id ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-400" />
                        <span className="text-emerald-400 font-semibold">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span>Copy Link</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* SEO Advice Footer */}
      <div className={`p-3 rounded-xl text-[10px] flex items-center justify-between gap-3 ${
        themeMode === "dark" ? "bg-zinc-950 text-zinc-400 border border-white/5" : "bg-zinc-50 text-zinc-600 border border-zinc-200"
      }`}>
        <span className="flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-accent flex-shrink-0" />
          Aim for 3 to 5 natural internal links per article to distribute PageRank and boost Google crawl depth.
        </span>
      </div>
    </div>
  );
}
