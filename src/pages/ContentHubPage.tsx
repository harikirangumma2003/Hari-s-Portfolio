import React, { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Search, 
  Grid, 
  List, 
  Clock, 
  Eye, 
  ThumbsUp, 
  Bookmark, 
  Share2, 
  ArrowRight, 
  ArrowUpRight, 
  TrendingUp, 
  Sparkles, 
  BookOpen, 
  Video, 
  FileText, 
  Check, 
  Podcast, 
  Mail, 
  Download, 
  Filter, 
  SlidersHorizontal,
  BookmarkCheck,
  ChevronDown
} from "lucide-react";
import { SEO } from "../components/SEO";
import { ContentHubItem } from "../types/content";
import { useContent } from "../hooks/useContent";
import { Breadcrumbs } from "../components/Breadcrumbs";
import { cn } from "../lib/utils";

// Category list as requested
const filterPills = [
  "All",
  "Articles",
  "Videos",
  "Shorts",
  "Medium",
  "YouTube",
  "Instagram",
  "LinkedIn",
  "Threads",
  "X",
  "Case Studies",
  "Resources",
  "SEO Tips",
  "Marketing",
  "AI"
];

// Helper to render platform badge beautifully
const PlatformBadge = ({ platform }: { platform: ContentHubItem["platform"] }) => {
  const getStyle = () => {
    switch (platform) {
      case "Medium":
        return "bg-black text-[#f7f7f7] border-zinc-800";
      case "Portfolio":
        return "bg-[#ff6b00]/10 text-[#ff6b00] border-[#ff6b00]/20";
      case "Instagram":
        return "bg-gradient-to-r from-[#f9ce34] via-[#ee2a7b] to-[#6228d7] text-white border-transparent";
      case "YouTube":
        return "bg-[#ff0000]/10 text-[#ff0000] border-[#ff0000]/20";
      case "LinkedIn":
        return "bg-[#0077b5]/10 text-[#0077b5] border-[#0077b5]/20";
      case "X":
        return "bg-zinc-900 text-white border-zinc-800";
      case "Threads":
        return "bg-zinc-950 text-white border-zinc-800";
      case "Podcast":
        return "bg-[#1db954]/10 text-[#1db954] border-[#1db954]/20";
      case "Case Study":
        return "bg-amber-500/10 text-amber-500 border-amber-500/20";
      case "Resource":
        return "bg-purple-500/10 text-purple-500 border-purple-500/20";
      default:
        return "bg-zinc-800 text-zinc-300 border-zinc-700";
    }
  };

  return (
    <span className={cn("text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full border", getStyle())} id={`platform-badge-${platform}`}>
      {platform}
    </span>
  );
};

// Helper to render Content Type icon and label
const ContentTypeBadge = ({ contentType }: { contentType: ContentHubItem["contentType"] }) => {
  const getIcon = () => {
    switch (contentType) {
      case "Blog":
        return <BookOpen size={10} />;
      case "Video":
        return <Video size={10} />;
      case "Short":
        return <Sparkles size={10} />;
      case "Social Post":
        return <Share2 size={10} />;
      case "Case Study":
        return <FileText size={10} />;
      case "Resource":
        return <Download size={10} />;
      case "Audio":
        return <Podcast size={10} />;
    }
  };

  return (
    <span className="flex items-center gap-1.5 text-[10px] font-bold text-zinc-400 uppercase tracking-wider bg-zinc-900/60 px-2.5 py-1 rounded-lg border border-white/5" id={`type-badge-${contentType}`}>
      {getIcon()}
      <span>{contentType}</span>
    </span>
  );
};

const ContentHubPage = () => {
  const { content: items, loading, error: fetchError } = useContent();

  // States
  const [activeFilter, setActiveFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"newest" | "oldest" | "popular" | "featured">("newest");
  const [layoutMode, setLayoutMode] = useState<"grid" | "list">("grid");
  const [visibleCount, setVisibleCount] = useState(6);
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>(() => {
    const saved = localStorage.getItem("g_hari_kiran_content_bookmarks");
    return saved ? JSON.parse(saved) : [];
  });
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [emailInput, setEmailInput] = useState("");

  // Save bookmarks
  useEffect(() => {
    localStorage.setItem("g_hari_kiran_content_bookmarks", JSON.stringify(bookmarkedIds));
  }, [bookmarkedIds]);

  // Copy share link
  const handleShare = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const mockUrl = `${window.location.origin}/content-hub#item-${id}`;
    navigator.clipboard.writeText(mockUrl).then(() => {
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    });
  };

  // Toggle bookmark
  const toggleBookmark = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setBookmarkedIds(prev => 
      prev.includes(id) ? prev.filter(bId => bId !== id) : [...prev, id]
    );
  };

  // Newsletter Submit
  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (emailInput.trim()) {
      setIsSubscribed(true);
      setEmailInput("");
      setTimeout(() => setIsSubscribed(false), 5000);
    }
  };

  // Filtering Logic
  const filteredItems = useMemo(() => {
    return items.filter(item => {
      // 1. Quick Filters
      if (activeFilter !== "All") {
        if (activeFilter === "Blogs" || activeFilter === "Articles") {
          if (item.contentType !== "Blog") return false;
        } else if (activeFilter === "Videos") {
          if (item.contentType !== "Video") return false;
        } else if (activeFilter === "Shorts") {
          if (item.contentType !== "Short") return false;
        } else if (activeFilter === "Medium") {
          if (item.platform !== "Medium") return false;
        } else if (activeFilter === "Instagram") {
          if (item.platform !== "Instagram") return false;
        } else if (activeFilter === "LinkedIn") {
          if (item.platform !== "LinkedIn") return false;
        } else if (activeFilter === "YouTube") {
          if (item.platform !== "YouTube") return false;
        } else if (activeFilter === "Threads") {
          if (item.platform !== "Threads") return false;
        } else if (activeFilter === "X") {
          if (item.platform !== "X") return false;
        } else if (activeFilter === "Case Studies") {
          if (item.contentType !== "Case Study") return false;
        } else if (activeFilter === "Resources") {
          if (item.contentType !== "Resource") return false;
        } else if (activeFilter === "SEO Tips") {
          if (item.category !== "SEO Tips" && !item.tags.includes("SEO Tips")) return false;
        } else if (activeFilter === "Marketing") {
          if (item.category !== "Marketing" && !item.tags.includes("Marketing")) return false;
        } else if (activeFilter === "AI") {
          if (item.category !== "AI" && !item.tags.includes("AI")) return false;
        }
      }

      // 2. Search query matching (Title, Platform, Tag, Category, Description)
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchesTitle = item.title.toLowerCase().includes(query);
        const matchesPlatform = item.platform.toLowerCase().includes(query);
        const matchesDesc = item.description.toLowerCase().includes(query) || item.excerpt.toLowerCase().includes(query);
        const matchesCategory = item.category.toLowerCase().includes(query);
        const matchesTags = item.tags.some(tag => tag.toLowerCase().includes(query));

        return matchesTitle || matchesPlatform || matchesDesc || matchesCategory || matchesTags;
      }

      return true;
    });
  }, [items, activeFilter, searchQuery]);

  // Sorting Logic
  const sortedItems = useMemo(() => {
    const itemsCopy = [...filteredItems];
    switch (sortBy) {
      case "newest":
        return itemsCopy.sort((a, b) => b.publishedDate.getTime() - a.publishedDate.getTime());
      case "oldest":
        return itemsCopy.sort((a, b) => a.publishedDate.getTime() - b.publishedDate.getTime());
      case "popular":
        return itemsCopy.sort((a, b) => ((b.views || 0) + (b.likes || 0)) - ((a.views || 0) + (a.likes || 0)));
      case "featured":
        return itemsCopy.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
      default:
        return itemsCopy;
    }
  }, [filteredItems, sortBy]);

  // Paginated/visible items
  const visibleItems = useMemo(() => {
    return sortedItems.slice(0, visibleCount);
  }, [sortedItems, visibleCount]);

  // Quick statistics calculated dynamically
  const statistics = useMemo(() => {
    const totalCount = items.length;
    const totalViews = items.reduce((acc, curr) => acc + (curr.views || 0), 0);
    const totalLikes = items.reduce((acc, curr) => acc + (curr.likes || 0), 0);
    const featuredCount = items.filter(i => i.featured).length;

    const viewsStr = totalViews >= 1000 ? (totalViews / 1000).toFixed(1) + "k" : totalViews.toString();
    const likesStr = totalLikes >= 1000 ? (totalLikes / 1000).toFixed(1) + "k" : totalLikes.toString();

    return {
      totalCount,
      totalViews: viewsStr,
      totalLikes: likesStr,
      featuredCount
    };
  }, [items]);

  // Hot Topics and Tags
  const allTags = useMemo(() => {
    const tagsMap: { [key: string]: number } = {};
    items.forEach(item => {
      item.tags.forEach(tag => {
        tagsMap[tag] = (tagsMap[tag] || 0) + 1;
      });
    });
    return Object.entries(tagsMap)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(entry => entry[0]);
  }, [items]);

  // SEO Schema Markup Generation
  const collectionSchema = useMemo(() => ({
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        "@id": "https://harikiran-portfolio.netlify.app/content-hub/#webpage",
        "url": "https://harikiran-portfolio.netlify.app/content-hub",
        "name": "Content Hub | G. Hari Kiran",
        "description": "Discover all of G. Hari Kiran's published articles, Medium posts, YouTube shorts, Instagram reels, and growth resources in one premium curated content space.",
        "isPartOf": {
          "@id": "https://harikiran-portfolio.netlify.app/#website"
        },
        "about": {
          "@id": "https://harikiran-portfolio.netlify.app/#person"
        },
        "breadcrumb": {
          "@id": "https://harikiran-portfolio.netlify.app/content-hub/#breadcrumb"
        }
      },
      {
        "@type": "BreadcrumbList",
        "@id": "https://harikiran-portfolio.netlify.app/content-hub/#breadcrumb",
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Home",
            "item": "https://harikiran-portfolio.netlify.app"
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": "Content Hub",
            "item": "https://harikiran-portfolio.netlify.app/content-hub"
          }
        ]
      },
      {
        "@type": "ItemList",
        "@id": "https://harikiran-portfolio.netlify.app/content-hub/#itemlist",
        "name": "G. Hari Kiran's Latest Articles and Growth Content",
        "itemListElement": items.map((item, index) => ({
          "@type": "ListItem",
          "position": index + 1,
          "name": item.title,
          "url": item.url.startsWith("http") ? item.url : `https://harikiran-portfolio.netlify.app${item.url}`
        }))
      }
    ]
  }), [items]);

  return (
    <div className="min-h-screen bg-[#070708] text-zinc-100 pt-28 pb-16 overflow-x-hidden relative" id="content-hub-page">
      <SEO 
        title="Content Hub - Curated Marketing, SEO, and Growth Engine | G. Hari Kiran"
        description="Access G. Hari Kiran's centralized content stream: deep-dive SEO audits, case studies, high-performing Instagram reels, and actionable guides for business growth."
        url="/content-hub"
        schemaData={collectionSchema}
      />

      {/* Futuristic Ambient Glow Backgrounds */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-accent/5 blur-[120px] pointer-events-none" />
      <div className="absolute top-[20%] right-[-10%] w-[40%] h-[40%] rounded-full bg-purple-500/5 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[10%] left-[10%] w-[45%] h-[45%] rounded-full bg-amber-500/5 blur-[130px] pointer-events-none" />

      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 lg:px-12 relative">
        {/* Breadcrumb Header */}
        <div className="mb-8" id="content-breadcrumbs">
          <Breadcrumbs 
            items={[
              { label: "Home", path: "/" },
              { label: "Content Hub", path: "/content-hub", active: true }
            ]}
          />
        </div>

        {/* Hero Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 pb-12 border-b border-white/5" id="hub-hero">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-3xl"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-accent text-[9px] font-black uppercase tracking-widest mb-6">
              <Sparkles size={12} className="animate-pulse" />
              Omnichannel Knowledge Engine
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-black tracking-tight uppercase leading-[0.9] text-white">
              The <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent via-orange-500 to-amber-400">Content Hub</span>
            </h1>
            
            <p className="mt-4 text-base sm:text-lg text-zinc-400 leading-relaxed max-w-2xl font-sans font-medium">
              A curated real-time catalog of my growth playbooks, viral breakdowns, and tactical marketing insights syndicated across Medium, YouTube, LinkedIn, X, and Threads.
            </p>
          </motion.div>

          {/* Core Hub Metrics Panel */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-2 lg:grid-cols-4 gap-4 p-4 rounded-3xl bg-zinc-950/80 border border-white/5 backdrop-blur-md shadow-2xl min-w-[280px]"
            id="hub-metrics-panel"
          >
            <div className="px-4 py-2 border-r border-white/5">
              <span className="text-2xl font-display font-black text-white">{statistics.totalCount}</span>
              <p className="text-[9px] font-black tracking-wider text-zinc-500 uppercase mt-1">Total Assets</p>
            </div>
            <div className="px-4 py-2 sm:border-r md:border-r-0 lg:border-r border-white/5">
              <span className="text-2xl font-display font-black text-accent">{statistics.totalViews}</span>
              <p className="text-[9px] font-black tracking-wider text-zinc-500 uppercase mt-1">Est. Views</p>
            </div>
            <div className="px-4 py-2 border-r border-white/5">
              <span className="text-2xl font-display font-black text-amber-500">{statistics.totalLikes}</span>
              <p className="text-[9px] font-black tracking-wider text-zinc-500 uppercase mt-1">Total Likes</p>
            </div>
            <div className="px-4 py-2">
              <span className="text-2xl font-display font-black text-purple-400">{statistics.featuredCount}</span>
              <p className="text-[9px] font-black tracking-wider text-zinc-500 uppercase mt-1">Featured</p>
            </div>
          </motion.div>
        </div>

        {/* Live Search and Control Panel */}
        <div className="sticky top-[80px] z-30 py-4 mt-8 bg-[#070708]/95 border-b border-white/5 backdrop-blur-md" id="sticky-filter-bar">
          <div className="flex flex-col gap-4">
            {/* Quick Filters - Beautiful Pill Select */}
            <div className="flex items-center gap-3 w-full" id="quick-filters-container">
              <span className="text-[9px] font-black uppercase tracking-widest text-zinc-500 flex items-center gap-1 shrink-0">
                <Filter size={10} /> Filters:
              </span>
              <div 
                className="overflow-x-auto scrollbar-none flex items-center gap-2 flex-grow -mr-6 pr-6 md:mr-0 md:pr-0 scroll-smooth touch-pan-x" 
                id="quick-filters-scroll"
                style={{ WebkitOverflowScrolling: "touch" }}
              >
                <div className="flex items-center gap-2 flex-nowrap shrink-0 pr-12 pb-1">
                  {filterPills.map((pill) => (
                    <button
                      key={pill}
                      onClick={() => {
                        setActiveFilter(pill);
                        setVisibleCount(6); // reset pagination on filter change
                      }}
                      className={cn(
                        "text-[10px] font-black uppercase tracking-wider px-4 py-2 rounded-full border transition-all whitespace-nowrap focus:outline-none relative shrink-0",
                        activeFilter === pill 
                          ? "bg-white text-black border-white" 
                          : "bg-zinc-950/40 text-zinc-400 border-white/5 hover:text-white hover:border-white/15"
                      )}
                    >
                      <span>{pill}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Inputs & Sorting controls */}
            <div className="flex flex-col sm:flex-row items-center gap-3 justify-between">
              {/* Search input field */}
              <div className="w-full sm:max-w-md relative">
                <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" />
                <input
                  type="text"
                  placeholder="Search by Title, Category, Tag or Platform..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setVisibleCount(6); // reset pagination
                  }}
                  className="w-full bg-zinc-950/60 border border-white/5 rounded-2xl pl-10 pr-4 py-3 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-accent/40 focus:ring-2 focus:ring-accent/10 transition-all font-sans font-medium"
                />
                {searchQuery && (
                  <button 
                    onClick={() => setSearchQuery("")}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[9px] font-black uppercase tracking-widest text-zinc-500 hover:text-white transition-colors"
                  >
                    Clear
                  </button>
                )}
              </div>

              {/* Sorting & Layout mode togglers */}
              <div className="flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto">
                {/* Sort dropdown styled */}
                <div className="flex items-center gap-2 bg-zinc-950/60 border border-white/5 px-4 py-2.5 rounded-2xl">
                  <SlidersHorizontal size={12} className="text-zinc-500" />
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="bg-transparent text-xs text-zinc-300 font-bold focus:outline-none border-none pr-2 cursor-pointer uppercase tracking-wider"
                  >
                    <option value="newest" className="bg-zinc-950 text-white">Newest First</option>
                    <option value="oldest" className="bg-zinc-950 text-white">Oldest First</option>
                    <option value="popular" className="bg-zinc-950 text-white">Most Popular</option>
                    <option value="featured" className="bg-zinc-950 text-white">Featured</option>
                  </select>
                </div>

                {/* Grid / List toggle icons */}
                <div className="flex items-center gap-1 p-1 rounded-2xl bg-zinc-950/60 border border-white/5">
                  <button
                    aria-label="Grid View"
                    onClick={() => setLayoutMode("grid")}
                    className={cn(
                      "p-2 rounded-xl transition-all",
                      layoutMode === "grid" ? "bg-white/10 text-accent shadow-sm" : "text-zinc-500 hover:text-zinc-300"
                    )}
                  >
                    <Grid size={14} />
                  </button>
                  <button
                    aria-label="List View"
                    onClick={() => setLayoutMode("list")}
                    className={cn(
                      "p-2 rounded-xl transition-all",
                      layoutMode === "list" ? "bg-white/10 text-accent shadow-sm" : "text-zinc-500 hover:text-zinc-300"
                    )}
                  >
                    <List size={14} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Core Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-12">
          {/* Main Content Area */}
          <div className="lg:col-span-8 flex flex-col gap-6" id="hub-main-cards-container">
            {loading ? (
              <div className={cn(
                "grid gap-6",
                layoutMode === "grid" ? "grid-cols-1 md:grid-cols-2" : "grid-cols-1"
              )}>
                {[...Array(4)].map((_, idx) => (
                  <div key={idx} className="rounded-[32px] bg-[#0c0c0e] border border-white/5 overflow-hidden p-6 flex flex-col justify-between h-[380px] animate-pulse">
                    <div>
                      <div className="w-full aspect-video bg-zinc-900 rounded-2xl mb-4" />
                      <div className="h-4 w-1/4 bg-zinc-900 rounded mb-2" />
                      <div className="h-6 w-3/4 bg-zinc-900 rounded mb-4" />
                      <div className="h-4 w-full bg-zinc-900 rounded mb-2" />
                      <div className="h-4 w-2/3 bg-zinc-900 rounded" />
                    </div>
                    <div className="flex items-center justify-between pt-4 border-t border-white/5 mt-6">
                      <div className="h-8 w-1/3 bg-zinc-900 rounded-full" />
                      <div className="h-4 w-1/4 bg-zinc-900 rounded" />
                    </div>
                  </div>
                ))}
              </div>
            ) : fetchError ? (
              <div className="flex flex-col items-center justify-center py-20 text-center rounded-3xl bg-red-950/10 border border-red-500/20 p-6">
                <span className="text-red-500 text-3xl mb-4">⚠️</span>
                <h3 className="text-lg font-black uppercase text-white mb-2">Error Loading Content</h3>
                <p className="text-xs text-zinc-400 max-w-md">{fetchError}</p>
                <button 
                  onClick={() => window.location.reload()}
                  className="mt-6 px-6 py-2.5 bg-accent text-white rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-white hover:text-black transition-colors"
                >
                  Reload Page
                </button>
              </div>
            ) : visibleItems.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center rounded-3xl bg-zinc-950/20 border border-white/5">
                <span className="text-zinc-500 text-3xl mb-4">🔍</span>
                <h3 className="text-lg font-black uppercase text-white mb-2">No Content Found</h3>
                <p className="text-xs text-zinc-400 max-w-md">No content cards matched your current search queries or filter selections. Try adjusting your parameters.</p>
                <button 
                  onClick={() => { setActiveFilter("All"); setSearchQuery(""); }}
                  className="mt-6 px-6 py-2.5 bg-accent text-white rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-white hover:text-black transition-colors"
                >
                  Reset Hub Filters
                </button>
              </div>
            ) : (
              <div className={cn(
                "transition-all duration-500",
                layoutMode === "grid" 
                  ? "grid grid-cols-1 md:grid-cols-2 gap-6" 
                  : "flex flex-col gap-5"
              )}>
                {visibleItems.map((item) => (
                  <motion.article
                    key={item.id}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35, ease: "easeOut" }}
                      className={cn(
                        "group rounded-[32px] bg-[#0c0c0e] border border-white/5 overflow-hidden shadow-2xl relative flex flex-col transition-all duration-500",
                        "hover:border-accent/40 hover:shadow-[0_20px_50px_rgba(255,107,0,0.08)] hover:-translate-y-1.5",
                        layoutMode === "list" && "flex-col md:flex-row md:items-stretch md:min-h-[220px]"
                      )}
                      id={`content-card-${item.id}`}
                    >
                      {/* Card Thumbnail */}
                      <div className={cn(
                        "relative overflow-hidden aspect-video",
                        layoutMode === "list" ? "w-full md:w-2/5 aspect-auto md:min-h-full" : "w-full"
                      )}>
                        <img 
                          src={item.thumbnail || "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80"} 
                          alt={item.title}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0c0c0e] via-transparent to-black/30 pointer-events-none" />
                        
                        {/* Featured Badge */}
                        {item.featured && (
                          <span className="absolute top-4 left-4 bg-accent text-white text-[8px] font-black uppercase tracking-[2px] px-2.5 py-1 rounded-full shadow-lg flex items-center gap-1 animate-pulse">
                            <Sparkles size={10} /> Featured
                          </span>
                        )}

                        {/* Badges Overlay */}
                        <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between gap-2 pointer-events-auto">
                          <PlatformBadge platform={item.platform} />
                          <ContentTypeBadge contentType={item.contentType} />
                        </div>
                      </div>

                      {/* Card Meta Content */}
                      <div className="p-6 flex-1 flex flex-col justify-between">
                        <div>
                          {/* Heading & stats */}
                          <div className="flex items-center justify-between gap-4 text-zinc-500 text-[10px] font-bold uppercase tracking-widest mb-3">
                            <div className="flex items-center gap-1.5">
                              <Clock size={12} className="text-zinc-500" />
                              <span>{item.readTime}</span>
                            </div>
                            <div className="flex items-center gap-3">
                              {item.views !== undefined && (
                                <span className="flex items-center gap-1">
                                  <Eye size={11} /> {item.views}
                                </span>
                              )}
                              {item.likes !== undefined && (
                                <span className="flex items-center gap-1">
                                  <ThumbsUp size={11} /> {item.likes}
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Post Title */}
                          <h3 className="text-base sm:text-lg font-display font-black text-white leading-tight uppercase tracking-tight mb-2 group-hover:text-accent transition-colors">
                            <a href={item.url} target={item.url.startsWith("http") ? "_blank" : "_self"} rel="noopener noreferrer">
                              {item.title}
                            </a>
                          </h3>

                          {/* Excerpt */}
                          <p className="text-xs text-zinc-400 leading-relaxed font-sans font-medium line-clamp-2 mb-4">
                            {item.excerpt}
                          </p>

                          {/* Tags list */}
                          <div className="flex flex-wrap gap-1.5 mb-6">
                            {item.tags.map(tag => (
                              <button
                                key={tag}
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  setSearchQuery(tag);
                                }}
                                className="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-zinc-900 text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
                              >
                                #{tag}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Interactive footer bar */}
                        <div className="flex items-center justify-between gap-4 pt-4 border-t border-white/5 mt-auto">
                          {/* Bookmark and Share */}
                          <div className="flex items-center gap-2">
                            <button
                              aria-label={bookmarkedIds.includes(item.id) ? "Remove bookmark" : "Add bookmark"}
                              onClick={(e) => toggleBookmark(item.id, e)}
                              className={cn(
                                "p-2 rounded-xl border transition-all active:scale-95",
                                bookmarkedIds.includes(item.id)
                                  ? "bg-accent/10 border-accent/20 text-accent"
                                  : "bg-zinc-900/40 border-white/5 text-zinc-400 hover:text-white hover:border-white/10"
                              )}
                            >
                              {bookmarkedIds.includes(item.id) ? <BookmarkCheck size={14} /> : <Bookmark size={14} />}
                            </button>
                            <button
                              aria-label="Share article link"
                              onClick={(e) => handleShare(item.id, e)}
                              className="p-2 rounded-xl border bg-zinc-900/40 border-white/5 text-zinc-400 hover:text-white hover:border-white/10 transition-all active:scale-95 relative"
                            >
                              {copiedId === item.id ? <Check size={14} className="text-green-400" /> : <Share2 size={14} />}
                              {copiedId === item.id && (
                                <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-green-500 text-black font-black text-[8px] uppercase tracking-widest px-2 py-1 rounded shadow-lg whitespace-nowrap animate-bounce">
                                  Copied!
                                </span>
                              )}
                            </button>
                          </div>

                          {/* Call To Action button */}
                          <a
                            href={item.url}
                            target={item.url.startsWith("http") ? "_blank" : "_self"}
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-white hover:text-accent transition-colors group/btn"
                          >
                            <span>{item.contentType === "Video" ? "Watch video" : item.contentType === "Resource" ? "Download guide" : "Read post"}</span>
                            {item.url.startsWith("http") ? (
                              <ArrowUpRight size={12} className="group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
                            ) : (
                              <ArrowRight size={12} className="group-hover/btn:translate-x-0.5 transition-transform" />
                            )}
                          </a>
                        </div>
                      </div>
                    </motion.article>
                  ))}
              </div>
            )}

            {/* Load More Trigger Container */}
            {sortedItems.length > visibleCount && (
              <div className="flex justify-center mt-12 mb-16" id="hub-load-more-btn">
                <button
                  onClick={() => setVisibleCount(prev => prev + 4)}
                  className="px-8 py-4 rounded-full bg-zinc-950 border border-white/5 text-zinc-300 font-black text-[10px] uppercase tracking-widest hover:bg-white hover:text-black hover:border-white transition-all active:scale-95 shadow-2xl hover:shadow-[0_12px_40px_rgba(255,255,255,0.05)]"
                >
                  Load More Content ({sortedItems.length - visibleCount} remaining)
                </button>
              </div>
            )}
          </div>

          {/* Sidebar Area */}
          <div className="lg:col-span-4 flex flex-col gap-8" id="hub-sidebar-widgets">
            {/* Newsletter Signup (ConvertKit Ready Premium Styling) */}
            <div className="p-8 rounded-[40px] bg-zinc-950 border border-white/5 shadow-2xl relative overflow-hidden" id="sidebar-newsletter">
              <div className="absolute top-0 right-0 w-24 h-24 bg-accent/5 rounded-full blur-2xl" />
              <div className="flex items-center gap-2 text-accent text-[9px] font-black uppercase tracking-widest mb-3">
                <Mail size={12} /> Newsletter Subscription
              </div>
              <h3 className="text-xl font-display font-black text-white uppercase tracking-tight mb-2">Unlock Growth Playbooks</h3>
              <p className="text-xs text-zinc-400 font-sans font-medium leading-relaxed mb-6">
                Join 5,000+ digital founders and SEO marketers who receive weekly tactical templates, conversion audits, and advanced search scaling frameworks directly.
              </p>

              {isSubscribed ? (
                <div className="p-4 rounded-2xl bg-green-500/10 border border-green-500/20 text-green-400 text-xs font-bold text-center">
                  ✨ Successfully subscribed! Watch your inbox for your first SEO audit template.
                </div>
              ) : (
                <form onSubmit={handleNewsletterSubmit} className="flex flex-col gap-3">
                  <input
                    type="email"
                    required
                    placeholder="Enter your primary business email"
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    className="w-full bg-zinc-900 border border-white/10 rounded-2xl px-4 py-3.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-accent transition-colors font-sans font-medium"
                  />
                  <button
                    type="submit"
                    className="w-full bg-accent text-white py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-white hover:text-black transition-all shadow-lg shadow-accent/10 hover:shadow-white/10 active:scale-95"
                  >
                    Subscribe & Unlock
                  </button>
                </form>
              )}
            </div>

            {/* Featured Lead Magnet / Resource */}
            <div className="p-8 rounded-[40px] bg-gradient-to-br from-zinc-950 to-[#0e0c0a] border border-white/5 hover:border-accent/30 shadow-2xl relative overflow-hidden group transition-all duration-500" id="sidebar-lead-resource">
              <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-accent/10 rounded-full blur-3xl pointer-events-none group-hover:bg-accent/15 transition-all" />
              <div className="flex items-center gap-2 text-purple-400 text-[9px] font-black uppercase tracking-widest mb-3">
                <Download size={12} /> High-Value Resource
              </div>
              <h3 className="text-xl font-display font-black text-white uppercase tracking-tight mb-2">The Ultimate SEO Checklist</h3>
              <p className="text-xs text-zinc-400 font-sans font-medium leading-relaxed mb-6">
                Our complete 120-Point technical spreadsheet loaded with prioritized SEO actions, Schema markup builders, and Conversion trackers. Over 3k downloads.
              </p>
              <a 
                href="#download-resource" 
                onClick={(e) => { e.preventDefault(); setActiveFilter("Resources"); setSearchQuery("Spreadsheet"); }}
                className="w-full py-4 rounded-2xl bg-zinc-900 text-white font-black text-[10px] uppercase tracking-widest border border-white/10 hover:border-accent hover:bg-accent hover:text-white transition-all flex items-center justify-center gap-2 shadow-xl"
              >
                Download Free Guide <ArrowRight size={12} />
              </a>
            </div>

            {/* Trending Hot Topics & Popular Tags */}
            <div className="p-8 rounded-[40px] bg-zinc-950 border border-white/5 shadow-2xl" id="sidebar-trending-tags">
              <div className="flex items-center gap-2 text-zinc-500 text-[9px] font-black uppercase tracking-widest mb-4">
                <TrendingUp size={12} /> Hot Trending Topics
              </div>
              <div className="flex flex-wrap gap-2">
                {allTags.map(tag => (
                  <button
                    key={tag}
                    onClick={() => {
                      setSearchQuery(tag);
                      setActiveFilter("All");
                    }}
                    className={cn(
                      "text-[10px] font-black uppercase tracking-wider px-3 py-1.5 rounded-xl border transition-all duration-300",
                      searchQuery.toLowerCase().trim() === tag.toLowerCase()
                        ? "bg-accent border-accent text-white"
                        : "bg-zinc-900/40 border-white/5 text-zinc-400 hover:text-white hover:border-white/10"
                    )}
                  >
                    #{tag}
                  </button>
                ))}
              </div>
            </div>

            {/* Recent curated snippets */}
            <div className="p-8 rounded-[40px] bg-zinc-950 border border-white/5 shadow-2xl" id="sidebar-recent-widgets">
              <h3 className="text-sm font-display font-black text-white uppercase tracking-wider mb-5">Latest Curated Additions</h3>
              <div className="flex flex-col gap-4">
                {loading ? (
                  [...Array(3)].map((_, idx) => (
                    <div key={idx} className="flex items-center gap-3 p-2 animate-pulse">
                      <div className="w-12 h-12 rounded-xl bg-zinc-900 shrink-0" />
                      <div className="flex-1">
                        <div className="h-3 w-3/4 bg-zinc-900 rounded mb-1" />
                        <div className="h-2.5 w-1/2 bg-zinc-900 rounded" />
                      </div>
                    </div>
                  ))
                ) : items.slice(0, 3).map(item => (
                  <a
                    key={item.id}
                    href={item.url}
                    className="flex items-center gap-3 p-2 rounded-2xl hover:bg-white/5 transition-colors group"
                  >
                    <img
                      src={item.thumbnail || "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80"}
                      alt={item.title}
                      referrerPolicy="no-referrer"
                      className="w-12 h-12 rounded-xl object-cover shrink-0"
                    />
                    <div className="overflow-hidden">
                      <h4 className="text-xs font-black text-white group-hover:text-accent transition-colors truncate uppercase tracking-tight">{item.title}</h4>
                      <div className="flex items-center gap-2 text-[8px] font-black uppercase tracking-widest text-zinc-500 mt-1">
                        <span>{item.platform}</span>
                        <span>•</span>
                        <span>{item.readTime}</span>
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContentHubPage;

// ====================================================
// REUSABLE HOMEPAGE WIDGETS
// ====================================================

/**
 * Reusable Content Hub Highlight Widget
 * Can be imported anywhere (e.g. inside HomePage) to display a beautiful card 
 * representating the latest asset from specific platforms.
 */
interface WidgetProps {
  platform: ContentHubItem["platform"];
  className?: string;
}

export const LatestContentWidget: React.FC<WidgetProps> = ({ platform, className }) => {
  const { content: items, loading, error } = useContent();

  const latestItem = useMemo(() => {
    return items.find(item => item.platform === platform);
  }, [items, platform]);

  if (loading) {
    return (
      <div className={cn("p-6 rounded-[32px] bg-zinc-950 border border-white/5 shadow-xl flex flex-col justify-between h-[180px] animate-pulse", className)}>
        <div>
          <div className="flex items-center justify-between gap-4 mb-4">
            <div className="h-4 w-1/4 bg-zinc-900 rounded-full" />
            <div className="h-2.5 w-1/5 bg-zinc-900 rounded" />
          </div>
          <div className="h-5 w-3/4 bg-zinc-900 rounded mb-2" />
          <div className="h-3.5 w-full bg-zinc-900 rounded mb-1" />
          <div className="h-3.5 w-2/3 bg-zinc-900 rounded" />
        </div>
        <div className="h-3 w-1/4 bg-zinc-900 rounded mt-4" />
      </div>
    );
  }

  if (error || !latestItem) return null;

  return (
    <div className={cn("p-6 rounded-[32px] bg-white border border-primary/5 shadow-xl flex flex-col justify-between hover:shadow-2xl transition-all duration-300 relative group overflow-hidden", className)}>
      <div className="absolute top-0 right-0 w-16 h-16 bg-accent/5 rounded-full blur-xl pointer-events-none" />
      <div>
        <div className="flex items-center justify-between gap-4 mb-4">
          <PlatformBadge platform={latestItem.platform} />
          <span className="text-[9px] font-black uppercase tracking-widest text-muted">{latestItem.readTime}</span>
        </div>
        <h4 className="text-sm font-display font-black text-primary uppercase leading-tight tracking-tight mb-2 group-hover:text-accent transition-colors">
          {latestItem.title}
        </h4>
        <p className="text-[11px] text-muted line-clamp-2 leading-relaxed mb-4 font-sans font-medium">
          {latestItem.excerpt}
        </p>
      </div>
      <a
        href={latestItem.url}
        target={latestItem.url.startsWith("http") ? "_blank" : "_self"}
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest text-primary hover:text-accent transition-colors group/btn mt-auto"
      >
        <span>Explore original</span>
        <ArrowUpRight size={10} className="group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
      </a>
    </div>
  );
};
