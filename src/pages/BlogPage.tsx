import { useState, useMemo, useEffect } from "react";
import { motion } from "motion/react";
import { ArrowLeft, Calendar, Search, ArrowRight, ArrowUpRight, ExternalLink, Clock } from "lucide-react";
import { Link } from "react-router-dom";
import { Newsletter } from "../components/Newsletter";
import { blogPosts, categories } from "../data/blogPosts";
import { SEO } from "../components/SEO";
import { Breadcrumbs } from "../components/Breadcrumbs";

interface UnifiedBlogPost {
  title: string;
  slug?: string;
  category: string;
  date: string;
  image: string;
  excerpt: string;
  content?: string;
  keywords: string[];
  isExternal: boolean;
  externalUrl?: string;
  readingTime?: string;
  rawDate?: string;
}

const formatDate = (dateStr: string): string => {
  try {
    const d = new Date(dateStr.replace(/-/g, "/"));
    if (isNaN(d.getTime())) return "Recent Post";
    return d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric"
    });
  } catch {
    return "Recent Post";
  }
};

const safeToISOString = (dateStr?: string): string => {
  if (!dateStr) return new Date().toISOString();
  try {
    const parsed = new Date(dateStr.replace(/-/g, "/"));
    if (isNaN(parsed.getTime())) {
      return new Date().toISOString();
    }
    return parsed.toISOString();
  } catch {
    return new Date().toISOString();
  }
};

const BlogPage = () => {
  const [activeCategory, setActiveCategory] = useState("All Posts");
  const [searchQuery, setSearchQuery] = useState("");
  const [posts, setPosts] = useState<UnifiedBlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const localMapped: UnifiedBlogPost[] = useMemo(() => {
    return blogPosts.map(post => ({
      ...post,
      isExternal: false,
      readingTime: "5 min read",
      rawDate: safeToISOString(post.date)
    }));
  }, []);

  const allCategories = useMemo(() => {
    return ["All Posts", ...categories, "Medium Articles"];
  }, []);

  useEffect(() => {
    const fetchMedium = async () => {
      setIsLoading(true);
      
      const cached = localStorage.getItem("g_hari_kiran_medium_feed");
      let cachedMedium: UnifiedBlogPost[] = [];
      
      if (cached) {
        try {
          const parsed = JSON.parse(cached);
          if (Array.isArray(parsed)) {
            cachedMedium = parsed.map((item: any) => ({
              title: item.title || "",
              category: item.category || "Medium Articles",
              date: item.date || "Recent Post",
              image: item.image || "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format,compress&q=80&w=800&fm=webp",
              excerpt: item.excerpt || "",
              keywords: item.keywords || [],
              isExternal: true,
              externalUrl: item.externalUrl || "",
              readingTime: item.readingTime || "3 min read",
              rawDate: item.rawDate || new Date().toISOString()
            }));
          }
        } catch (e) {
          console.error("Error parsing cached medium posts", e);
        }
      }

      const combineAndSort = (medItems: UnifiedBlogPost[]) => {
        const combined = [...localMapped, ...medItems];
        combined.sort((a, b) => {
          const dateA = a.rawDate ? new Date(a.rawDate).getTime() : 0;
          const dateB = b.rawDate ? new Date(b.rawDate).getTime() : 0;
          return dateB - dateA;
        });
        setPosts(combined);
      };

      if (cachedMedium.length > 0) {
        combineAndSort(cachedMedium);
      } else {
        setPosts(localMapped);
      }

      try {
        const feedUrl = "https://medium.com/feed/@harikirangumma2003";
        const targetUrl = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(feedUrl)}`;
        const res = await fetch(targetUrl);
        
        if (res.ok) {
          const data = await res.json();
          if (data.status === "ok" && Array.isArray(data.items)) {
            const freshMedium: UnifiedBlogPost[] = data.items.map((item: any) => {
              const content = item.content || item.description || "";
              
              let img = item.thumbnail;
              if (!img || img.includes("stat?event=") || img.includes("avatar")) {
                const imgRegex = /<img[^>]+src="([^">]+)"/i;
                const match = content.match(imgRegex);
                if (match && match[1] && !match[1].includes("stat?event=") && !match[1].includes("avatar")) {
                  img = match[1];
                } else {
                  img = "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format,compress&q=80&w=800&fm=webp";
                }
              }

              let clean = content.replace(/<script[^>]*>([\s\S]*?)<\/script>/gi, "").replace(/<style[^>]*>([\s\S]*?)<\/style>/gi, "");
              clean = clean.replace(/<\/?[^>]+(>|$)/g, " ");
              clean = clean.replace(/&nbsp;/g, " ").replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&#39;/g, "'");
              clean = clean.replace(/\s+/g, " ").trim();
              const excerpt = clean.length > 150 ? clean.substring(0, 150) + "..." : clean || "Read G. Hari Kiran's professional search engine optimization strategy guide.";

              const wordCount = clean.split(/\s+/).filter(Boolean).length;
              const minutes = Math.ceil(wordCount / 225);
              const readingTime = `${Math.max(2, minutes)} min read`;

              return {
                title: item.title,
                category: "Medium Articles",
                date: formatDate(item.pubDate),
                image: img,
                excerpt: excerpt,
                keywords: Array.isArray(item.categories) ? item.categories : [],
                isExternal: true,
                externalUrl: item.link,
                readingTime: readingTime,
                rawDate: safeToISOString(item.pubDate)
              };
            });

            if (freshMedium.length > 0) {
              localStorage.setItem("g_hari_kiran_medium_feed", JSON.stringify(freshMedium));
              combineAndSort(freshMedium);
            }
          }
        }
      } catch (err) {
        console.error("Failed to fetch fresh Medium articles inside BlogPage", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMedium();
  }, [localMapped]);

  const filteredPosts = useMemo(() => {
    return posts.filter(post => {
      const matchesCategory = activeCategory === "All Posts" || post.category === activeCategory;
      const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [posts, activeCategory, searchQuery]);

  return (
    <div className="pt-32 pb-24">
      <SEO 
        title="SEO Expert & Digital Marketing Consultant in Jamshedpur | Blog"
        description="Actionable organic search marketing tutorials, automated retention maps, and growth articles from the top SEO Expert and Digital Marketing Consultant in Jamshedpur."
        url="/blog"
        schemaData={{
          "@context": "https://schema.org",
          "@type": "Blog",
          "name": "G. Hari Kiran Growth Journal",
          "description": "Deep dives into SEO, brand positioning, and data-driven growth strategies.",
          "publisher": {
            "@type": "Person",
            "name": "G. Hari Kiran",
            "jobTitle": "SEO Expert & Digital Marketing Consultant in Jamshedpur"
          }
        }}
      />
      
      <div className="container-custom">
          {/* Breadcrumb Navigation */}
          <Breadcrumbs items={[{ name: "Blog", path: "/blog" }]} />

          {/* Header */}
          <div className="mb-16 text-center md:text-left">
            <Link to="/" className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-muted hover:text-accent transition-colors mb-8 group justify-center md:justify-start">
              <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
              Back to Home
            </Link>
            
            <h1 className="text-4xl sm:text-5xl md:text-8xl font-display font-black tracking-tighter uppercase leading-[1] md:leading-[0.85] mb-8">
              The <span className="text-accent">Growth</span> <br className="hidden md:block" />Journal
            </h1>
            <p className="max-w-xl mx-auto md:mx-0 text-muted text-lg leading-relaxed">
              Deep dives into SEO, brand positioning, and the data-driven strategies I use to scale global brands.
            </p>
          </div>

          {/* Search/Filter */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-16 pb-8 border-b border-primary/5">
            <div className="flex gap-3 overflow-x-auto pb-4 w-full md:w-auto -mx-5 px-5 sm:mx-0 sm:px-0 no-scrollbar">
              {allCategories.map((cat) => (
                <button 
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`text-[10px] font-black uppercase tracking-widest px-6 py-3 rounded-full border transition-all whitespace-nowrap shadow-sm ${
                    activeCategory === cat 
                    ? 'bg-primary text-white border-primary shadow-primary/20' 
                    : 'bg-white border-primary/10 text-primary hover:border-accent hover:text-accent'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
            <div className="relative w-full md:w-80">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" size={16} />
              <input 
                type="text" 
                placeholder="Search articles..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-6 py-4 bg-white rounded-2xl border border-primary/5 text-xs font-bold uppercase tracking-widest focus:border-accent focus:ring-0 transition-all shadow-sm"
              />
            </div>
          </div>

          {/* Blog Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.length > 0 ? (
              filteredPosts.map((post, i) => (
                <motion.div
                  key={post.isExternal ? post.externalUrl : post.slug}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  className="group flex flex-col h-full bento-card border border-primary/5 hover:border-accent/30 transition-all cursor-pointer"
                >
                  {post.isExternal ? (
                    <a href={post.externalUrl} target="_blank" rel="noopener noreferrer" className="flex flex-col h-full">
                      <div className="relative aspect-[16/10] overflow-hidden rounded-[24px] mb-6">
                        <img 
                          src={post.image} 
                          alt={`Illustration for blog post: ${post.title}`}
                          loading="lazy"
                          decoding="async"
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute top-4 left-4 bg-black text-white px-3 py-1.5 rounded-full text-[10px] font-black font-display uppercase tracking-widest z-10 border border-white/20 flex items-center gap-1">
                          Medium Article
                        </div>
                      </div>
                      
                      <div className="flex flex-col flex-grow">
                        <h2 className="text-xl md:text-2xl font-display font-black uppercase leading-[1.1] mb-4 group-hover:text-accent transition-colors line-clamp-2">
                          {post.title}
                        </h2>
                        <p className="text-sm text-muted line-clamp-3 mb-6 flex-grow leading-relaxed">
                          {post.excerpt}
                        </p>
                        
                        <div className="flex items-center justify-between pt-6 border-t border-primary/5 mt-auto">
                          <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-widest text-muted italic">
                            <span className="flex items-center gap-2">
                              <Calendar size={12} className="text-accent" />
                              {post.date}
                            </span>
                            {post.readingTime && (
                              <span className="flex items-center gap-1.5 font-sans font-medium text-[9px] text-muted">
                                <Clock size={11} />
                                {post.readingTime}
                              </span>
                            )}
                          </div>
                          <div className="text-accent group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-transform flex items-center gap-1 text-[10px] font-black uppercase tracking-widest">
                            Read Feed
                            <ArrowUpRight size={16} />
                          </div>
                        </div>
                      </div>
                    </a>
                  ) : (
                    <Link to={`/blog/${post.slug}`} className="flex flex-col h-full">
                      <div className="relative aspect-[16/10] overflow-hidden rounded-[24px] mb-6">
                        <img 
                          src={post.image} 
                          alt={`Illustration for blog post: ${post.title}`}
                          loading="lazy"
                          decoding="async"
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute top-4 left-4 bg-accent text-white px-3 py-1.5 rounded-full text-[10px] font-black font-display uppercase tracking-widest z-10">
                          {post.category}
                        </div>
                      </div>
                      
                      <div className="flex flex-col flex-grow">
                        <h2 className="text-xl md:text-2xl font-display font-black uppercase leading-[1.1] mb-4 group-hover:text-accent transition-colors line-clamp-2">
                          {post.title}
                        </h2>
                        <p className="text-sm text-muted line-clamp-3 mb-6 flex-grow leading-relaxed">
                          {post.excerpt}
                        </p>
                        
                        <div className="flex items-center justify-between pt-6 border-t border-primary/5 mt-auto">
                          <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted italic">
                            <Calendar size={12} className="text-accent" />
                            {post.date}
                          </div>
                          <div className="text-accent group-hover:translate-x-1 transition-transform">
                            <ArrowRight size={18} />
                          </div>
                        </div>
                      </div>
                    </Link>
                  )}
                </motion.div>
              ))
            ) : (
              <div className="col-span-full py-24 text-center">
                <Search size={48} className="mx-auto text-muted/30 mb-6" />
                <h3 className="text-2xl font-display font-black uppercase mb-2">No articles found</h3>
                <p className="text-muted text-sm uppercase tracking-widest">Try adjusting your search or category filters.</p>
              </div>
            )}
          </div>
        </div>

        <div className="container-custom mt-24">
          {/* Newsletter / CTA */}
          <Newsletter />
        </div>
      </div>
  );
};

export default BlogPage;
