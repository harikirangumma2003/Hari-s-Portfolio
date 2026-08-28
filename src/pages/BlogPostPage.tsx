import { motion } from "motion/react";
import { ArrowLeft, Calendar, User, Share2, Facebook, Twitter, Linkedin as LinkedinIcon, Link as LinkIcon, Clock, Check, MessageCircle, Tag, ArrowRight, ArrowUpRight, ExternalLink } from "lucide-react";
import { Link, useParams, Navigate, useNavigate } from "react-router-dom";
import { Newsletter } from "../components/Newsletter";
import { blogPosts } from "../data/blogPosts";
import { SEO } from "../components/SEO";
import React, { useState, useMemo, useEffect } from "react";
import { Breadcrumbs } from "../components/Breadcrumbs";
import NotFoundPage from "./NotFoundPage";
import { getPublishedContent } from "../services/contentService";
import { GooglePreferredSourceButton } from "../components/GooglePreferredSourceButton";
import { TableOfContents } from "../components/TableOfContents";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";

const generateSlug = (t: string) => t.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "").substring(0, 100);

const formatDate = (dateVal: any): string => {
  try {
    if (!dateVal) return "Recent Post";
    const d = dateVal instanceof Date ? dateVal : new Date(typeof dateVal === 'string' ? dateVal.replace(/-/g, "/") : dateVal);
    if (isNaN(d.getTime())) return "Recent Post";
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  } catch { return "Recent Post"; }
};

const extractTextFromChildren = (children: any): string => {
  if (!children) return "";
  if (typeof children === "string") return children;
  if (typeof children === "number") return String(children);
  if (Array.isArray(children)) return children.map(extractTextFromChildren).join("");
  if (children.props && children.props.children) return extractTextFromChildren(children.props.children);
  return "";
};

const slugifyHeading = (text: string): string => {
  const clean = text
    .toLowerCase()
    .replace(/<[^>]+>/g, '')
    .replace(/[*_~`#[\]()]/g, '')
    .replace(/&[a-z0-9#]+;/gi, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');
  return clean || 'section';
};

const BlogPostPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [isCopied, setIsCopied] = useState(false);
  
  const initialPosts = useMemo(() => {
    const staticPosts = blogPosts;
    const combined: any[] = [...staticPosts];

    // Read cached CMS posts
    const cachedCms = localStorage.getItem("portfolio_cms_blog_cache");
    if (cachedCms) {
      try {
        const parsed = JSON.parse(cachedCms);
        if (Array.isArray(parsed)) {
          combined.push(...parsed);
        }
      } catch (e) {
        console.error("Error parsing cached CMS posts inside BlogPostPage", e);
      }
    }

    // Read cached Medium posts
    const cachedMedium = localStorage.getItem("g_hari_kiran_medium_feed");
    if (cachedMedium) {
      try {
        const parsed = JSON.parse(cachedMedium);
        if (Array.isArray(parsed)) {
          combined.push(...parsed);
        }
      } catch (e) {
        console.error("Error parsing cached medium posts inside BlogPostPage", e);
      }
    }

    return combined;
  }, []);

  const [posts, setPosts] = useState<any[]>(initialPosts);

  const initialPostFound = useMemo(() => {
    return initialPosts.some((p) => p.slug === slug);
  }, [initialPosts, slug]);

  const [isLoading, setIsLoading] = useState(!initialPostFound);

  const post = useMemo(() => {
    return posts.find((p) => p.slug === slug);
  }, [posts, slug]);

  useEffect(() => {
    const fetchAdditionalPosts = async () => {
      try {
        // 1. Fetch CMS posts from Firestore
        const firestoreContent = await getPublishedContent();
        const cmsPosts = firestoreContent.map(item => {
          let postSlug = item.canonicalUrl ? item.canonicalUrl.replace(/^.*\/blog\//, "") : "";
          if (!postSlug) {
            postSlug = item.url ? item.url.replace(/^.*\/blog\//, "") : generateSlug(item.title);
          }
          
          const postImg = item.ogImage || item.thumbnail || "https://images.unsplash.com/photo-1507925921958-8a62f3d1a50d?auto=format,compress&q=80&w=1200&fm=webp";

          return {
            title: item.title,
            seoTitle: item.metaTitle || item.title,
            slug: postSlug,
            category: item.category || "SEO",
            date: formatDate(item.publishedDate),
            image: postImg,
            excerpt: item.metaDescription || item.excerpt || item.description || "",
            content: item.description || "",
            keywords: item.tags || [],
            isExternal: false,
            externalUrl: item.url && !item.url.startsWith('#') && !item.url.startsWith('/blog/') ? item.url : "",
            readingTime: item.readTime || "5 min read",
            rawDate: item.publishedDate ? new Date(item.publishedDate).toISOString() : new Date().toISOString()
          };
        });

        if (cmsPosts.length > 0) {
          localStorage.setItem("portfolio_cms_blog_cache", JSON.stringify(cmsPosts));
          setPosts(prev => {
            const existingSlugs = new Set(prev.map(p => p.slug));
            const newToAdd = cmsPosts.filter(c => !existingSlugs.has(c.slug));
            const updated = prev.map(p => {
              const matchedCms = cmsPosts.find(c => c.slug === p.slug);
              return matchedCms ? { ...p, ...matchedCms } : p;
            });
            return [...updated, ...newToAdd];
          });
        }

        // 2. Fetch fresh Medium RSS
        const feedUrl = "https://medium.com/feed/@harikirangumma2003";
        const targetUrl = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(feedUrl)}`;
        const res = await fetch(targetUrl);
        if (res.ok) {
          const data = await res.json();
          if (data.status === "ok" && Array.isArray(data.items)) {
            const freshMedium = data.items.map((item: any) => {
              const content = item.content || item.description || "";
              
              let img = item.thumbnail;
              if (!img || img.includes("stat?event=") || img.includes("avatar")) {
                const imgRegex = /<img[^>]+src="([^">]+)"/i;
                const match = content.match(imgRegex);
                if (match && match[1] && !match[1].includes("stat?event=") && !match[1].includes("avatar")) {
                  img = match[1];
                } else {
                  img = "https://images.unsplash.com/photo-1507925921958-8a62f3d1a50d?auto=format,compress&q=80&w=1200&fm=webp";
                }
              }

              let clean = content.replace(/<script[^>]*>([\s\S]*?)<\/script>/gi, "").replace(/<style[^>]*>([\s\S]*?)<\/style>/gi, "");
              clean = clean.replace(/<\/?[^>]+(>|$)/g, " ");
              clean = clean.replace(/&nbsp;/g, " ").replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&#39;/g, "'");
              clean = clean.replace(/\s+/g, " ").trim();
              const excerpt = clean.length > 150 ? clean.substring(0, 150) + "..." : clean;

              const wordCount = clean.split(/\s+/).filter(Boolean).length;
              const minutes = Math.ceil(wordCount / 225);
              const readingTime = `${Math.max(2, minutes)} min read`;

              return {
                title: item.title,
                slug: generateSlug(item.title),
                category: "Medium Articles",
                date: formatDate(item.pubDate),
                image: img,
                excerpt: excerpt,
                content: content,
                keywords: Array.isArray(item.categories) ? item.categories : [],
                isExternal: false,
                externalUrl: item.link,
                readingTime: readingTime,
                rawDate: new Date(item.pubDate).toISOString()
              };
            });

            if (freshMedium.length > 0) {
              localStorage.setItem("g_hari_kiran_medium_feed", JSON.stringify(freshMedium));
              setPosts(prev => {
                const base = prev.filter(p => !freshMedium.some(f => f.slug === p.slug));
                return [...base, ...freshMedium];
              });
            }
          }
        }
      } catch (err) {
        console.error("Failed to fetch fresh posts inside BlogPostPage", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAdditionalPosts();
  }, [slug]);

  const handleContentClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;
    const anchor = target.closest("a");
    if (anchor) {
      const href = anchor.getAttribute("href");
      if (href && href.startsWith("/")) {
        e.preventDefault();
        navigate(href);
      }
    }
  };

  // Find related posts - same category first, then most recent
  const relatedPosts = useMemo(() => {
    if (!post) return [];
    return posts
      .filter(p => p.slug !== slug)
      .sort((a, b) => {
        if (a.category === post.category && b.category !== post.category) return -1;
        if (b.category === post.category && b.category !== post.category) return 1;
        return 0;
      })
      .slice(0, 3);
  }, [slug, post, posts]);

  if (!post && isLoading) {
    const formattedSlugTitle = slug 
      ? slug.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ")
      : "Growth Article";

    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4" id="post-loading">
        <h1 className="text-2xl sm:text-3xl font-display font-black tracking-tight uppercase text-primary text-center px-4">
          {formattedSlugTitle}
        </h1>
        <div className="w-8 h-8 border-2 border-primary/20 border-t-primary rounded-full animate-spin mt-2" />
        <p className="text-xs font-black uppercase tracking-widest text-muted">Fetching original article...</p>
      </div>
    );
  }

  if (!post) {
    return <NotFoundPage />;
  }

  const siteUrl = "https://harikiran-portfolio.netlify.app";
  const shareUrl = `${siteUrl}/blog/${post.slug}`;

  const handleShare = (platform: string) => {
    const url = encodeURIComponent(shareUrl);
    const text = encodeURIComponent(`Check out this growth strategy: ${post.title}`);
    
    let shareLink = "";
    switch (platform) {
      case "twitter":
        shareLink = `https://twitter.com/intent/tweet?url=${url}&text=${text}`;
        break;
      case "linkedin":
        shareLink = `https://www.linkedin.com/sharing/share-offsite/?url=${url}`;
        break;
      case "facebook":
        shareLink = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
        break;
      case "whatsapp":
        shareLink = `https://api.whatsapp.com/send?text=${text}%20${url}`;
        break;
      case "copy":
        navigator.clipboard.writeText(shareUrl);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
        return;
    }
    
    if (shareLink) {
      window.open(shareLink, "_blank", "noopener,noreferrer");
    }
  };

  const postTitle = post.seoTitle || (post.title.length > 55 ? post.title.slice(0, 52) + "..." : post.title);
  const postExcerpt = post.excerpt || (post.content ? post.content.replace(/<[^>]*>/g, '').substring(0, 160) : "Expert growth and technical SEO strategy by G. Hari Kiran");
  const postImage = post.image || "https://images.unsplash.com/photo-1507925921958-8a62f3d1a50d?auto=format,compress&q=80&w=1200&fm=webp";

  return (
    <div className="pt-32 pb-24">
      <SEO 
        title={postTitle}
        description={postExcerpt}
        image={postImage}
        url={`/blog/${post.slug}`}
        type="article"
        canonical={post.externalUrl || `https://harikiran-portfolio.netlify.app/blog/${post.slug}`}
        articleData={{
          publishedTime: post.rawDate || post.date,
          author: "G. Hari Kiran",
          section: post.category,
          tags: post.keywords
        }}
        schemaData={{
          "@context": "https://schema.org",
          "@type": "BlogPosting",
          "headline": post.title,
          "image": postImage,
          "datePublished": post.rawDate || post.date,
          "author": {
            "@type": "Person",
            "name": "G. Hari Kiran",
            "url": "https://harikiran-portfolio.netlify.app/about"
          },
          "description": postExcerpt,
          "mainEntityOfPage": {
            "@type": "WebPage",
            "@id": shareUrl
          },
          "publisher": {
            "@type": "Person",
            "name": "G. Hari Kiran"
          }
        }}
      />
      
      <article className="container-custom max-w-3xl">
          {/* Breadcrumb Navigation */}
          <div className="mb-6">
            <Breadcrumbs items={[{ name: "Blog", path: "/blog" }, { name: post.title }]} />
          </div>

          {/* Back Navigation */}
          <Link to="/blog" className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-muted hover:text-accent transition-colors mb-12 group justify-center md:justify-start">
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            Back to Journal
          </Link>

          {/* Post Header */}
          <header className="mb-12 text-center md:text-left">
            <div className="flex flex-wrap justify-center md:justify-start gap-3 mb-6">
              <span className="bg-accent text-white px-3 py-1.5 rounded-full text-[10px] font-black font-display uppercase tracking-widest">
                {post.category}
              </span>
              <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted">
                <Clock size={12} className="text-accent" />
                {post.readingTime || "5 min read"}
              </div>
            </div>
            
            <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-display font-black tracking-tighter uppercase leading-[1] md:leading-[0.9] mb-8">
              {post.title}
            </h1>
            
            <div className="flex flex-wrap items-center justify-center md:justify-between gap-6 py-8 border-y border-primary/5">
              <div className="flex items-center gap-4 text-left">
                <div className="w-12 h-12 rounded-full bg-primary/5 flex items-center justify-center border border-primary/10 overflow-hidden">
                  <User size={24} className="text-muted" />
                </div>
                <div>
                  <p className="text-xs font-black uppercase tracking-widest text-primary">G. Hari Kiran</p>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-muted opacity-70 italic">{post.date}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <p className="text-[10px] font-black uppercase tracking-widest text-muted hidden sm:block">Share</p>
                <div className="flex gap-2">
                  <button 
                    onClick={() => handleShare('linkedin')}
                    className="w-10 h-10 rounded-full border border-primary/10 flex items-center justify-center text-muted hover:bg-primary hover:text-white hover:border-primary transition-all"
                    title="Share on LinkedIn"
                  >
                    <LinkedinIcon size={16} />
                  </button>
                  <button 
                    onClick={() => handleShare('twitter')}
                    className="w-10 h-10 rounded-full border border-primary/10 flex items-center justify-center text-muted hover:bg-primary hover:text-white hover:border-primary transition-all"
                    title="Share on Twitter"
                  >
                    <Twitter size={16} />
                  </button>
                  <button 
                    onClick={() => handleShare('facebook')}
                    className="w-10 h-10 rounded-full border border-primary/10 flex items-center justify-center text-muted hover:bg-primary hover:text-white hover:border-primary transition-all"
                    title="Share on Facebook"
                  >
                    <Facebook size={16} />
                  </button>
                  <button 
                    onClick={() => handleShare('whatsapp')}
                    className="w-10 h-10 rounded-full border border-primary/10 flex items-center justify-center text-muted hover:bg-primary hover:text-white hover:border-primary transition-all"
                    title="Share on WhatsApp"
                  >
                    <MessageCircle size={16} />
                  </button>
                  <button 
                    onClick={() => handleShare('copy')}
                    className={`w-10 h-10 rounded-full border border-primary/10 flex items-center justify-center transition-all ${isCopied ? 'bg-accent text-white border-accent' : 'text-muted hover:bg-primary hover:text-white hover:border-primary'}`}
                    title="Copy Link"
                  >
                    {isCopied ? <Check size={16} /> : <LinkIcon size={16} />}
                  </button>
                </div>
              </div>
            </div>
          </header>

          {/* Featured Image */}
          <div className="relative aspect-square sm:aspect-video mb-16 rounded-[32px] md:rounded-[40px] overflow-hidden border border-primary/5 shadow-2xl bg-neutral-100">
            <img 
              src={post.image || "https://images.unsplash.com/photo-1507925921958-8a62f3d1a50d?auto=format,compress&q=80&w=1200&fm=webp"} 
              alt={`Featured image for blog post: ${post.title}`}
              loading="eager"
              fetchPriority="high"
              decoding="async"
              width="1200"
              height="675"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.onerror = null;
                target.src = "https://images.unsplash.com/photo-1507925921958-8a62f3d1a50d?auto=format,compress&q=80&w=1200&fm=webp";
              }}
            />
          </div>

          {/* Post Content */}
          <div className="mx-auto mt-16 px-4 sm:px-0">
            {post.externalUrl && (
              <div className="mb-12 p-6 rounded-3xl bg-[#faf9f6] border border-primary/5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm" id="medium-original-notice">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-primary/5 flex items-center justify-center text-primary font-display font-black text-lg">M</div>
                  <div>
                    <h4 className="text-sm font-black uppercase tracking-tight text-primary">Originally Published on Medium</h4>
                    <p className="text-[11px] text-muted uppercase font-bold tracking-widest">Syndicated for search performance optimization</p>
                  </div>
                </div>
                <a 
                  href={post.externalUrl} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-white text-[10px] font-black uppercase tracking-widest hover:bg-accent hover:text-white transition-all shadow-md shadow-primary/10"
                >
                  Read original <ArrowUpRight size={12} />
                </a>
              </div>
            )}
            
            {/* Table of Contents for Article Navigation */}
            <TableOfContents content={post.content || ""} />
            
            <div 
              className="markdown-content"
              onClick={handleContentClick}
            >
              <Markdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeRaw]}
                components={{
                  h1: ({ node, children, ...props }: any) => {
                    const text = extractTextFromChildren(children);
                    const id = props.id || slugifyHeading(text);
                    return (
                      <h1 id={id} className="scroll-mt-28 text-3xl sm:text-4xl md:text-5xl font-display font-black tracking-tight text-primary mt-12 mb-6 uppercase border-b border-primary/10 pb-4" {...props}>
                        {children}
                      </h1>
                    );
                  },
                  h2: ({ node, children, ...props }: any) => {
                    const text = extractTextFromChildren(children);
                    const id = props.id || slugifyHeading(text);
                    return (
                      <h2 id={id} className="scroll-mt-28 text-2xl sm:text-3xl md:text-4xl font-display font-black tracking-tight text-primary mt-14 mb-6 uppercase border-b border-primary/10 pb-3" {...props}>
                        {children}
                      </h2>
                    );
                  },
                  h3: ({ node, children, ...props }: any) => {
                    const text = extractTextFromChildren(children);
                    const id = props.id || slugifyHeading(text);
                    return (
                      <h3 id={id} className="scroll-mt-28 text-xl sm:text-2xl md:text-3xl font-display font-black tracking-tight text-primary mt-10 mb-4 uppercase flex items-center gap-2" {...props}>
                        {children}
                      </h3>
                    );
                  },
                  h4: ({ node, children, ...props }: any) => {
                    const text = extractTextFromChildren(children);
                    const id = props.id || slugifyHeading(text);
                    return (
                      <h4 id={id} className="scroll-mt-28 text-lg sm:text-xl font-display font-black text-primary mt-8 mb-3 uppercase" {...props}>
                        {children}
                      </h4>
                    );
                  },
                  p: ({ node, ...props }) => (
                    <p className="text-base sm:text-lg text-zinc-800 leading-[1.85] mb-6 font-normal" {...props} />
                  ),
                  ul: ({ node, ...props }) => (
                    <ul className="list-disc ml-6 sm:ml-8 mb-8 space-y-3 text-zinc-800 text-base sm:text-lg" {...props} />
                  ),
                  ol: ({ node, ...props }) => (
                    <ol className="list-decimal ml-6 sm:ml-8 mb-8 space-y-3 text-zinc-800 text-base sm:text-lg" {...props} />
                  ),
                  li: ({ node, ...props }) => (
                    <li className="pl-2 leading-relaxed" {...props} />
                  ),
                  blockquote: ({ node, ...props }) => (
                    <blockquote className="border-l-4 border-accent pl-6 py-4 my-8 bg-accent/5 rounded-r-2xl italic text-zinc-700 text-lg font-medium shadow-sm" {...props} />
                  ),
                  a: ({ node, href, ...props }) => {
                    const isInternal = href?.startsWith('/') || href?.includes('harikiran-portfolio.netlify.app');
                    if (isInternal) {
                      return <a href={href} className="text-accent font-semibold underline underline-offset-4 decoration-accent/40 hover:decoration-accent transition-colors" {...props} />;
                    }
                    return <a href={href} target="_blank" rel="noopener noreferrer" className="text-accent font-semibold underline underline-offset-4 decoration-accent/40 hover:decoration-accent transition-colors" {...props} />;
                  },
                  table: ({ node, ...props }) => (
                    <div className="overflow-x-auto my-10 rounded-2xl border border-primary/10 shadow-sm bg-white">
                      <table className="w-full text-left border-collapse text-sm" {...props} />
                    </div>
                  ),
                  th: ({ node, ...props }) => (
                    <th className="border-b border-primary/10 bg-primary/5 px-6 py-4 font-display font-black uppercase text-xs tracking-wider text-primary" {...props} />
                  ),
                  td: ({ node, ...props }) => (
                    <td className="border-b border-primary/5 px-6 py-4 text-zinc-700 text-sm" {...props} />
                  ),
                  strong: ({ node, ...props }) => (
                    <strong className="font-bold text-zinc-950" {...props} />
                  ),
                  code: ({ node, ...props }: any) => (
                    <code className="bg-zinc-100 text-accent font-mono text-sm px-2 py-0.5 rounded border border-zinc-200" {...props} />
                  ),
                  hr: ({ node, ...props }) => (
                    <hr className="my-12 border-t border-primary/10" {...props} />
                  ),
                  img: ({ node, ...props }) => (
                    <img className="rounded-3xl border border-primary/5 shadow-xl my-8 mx-auto max-w-full" loading="lazy" decoding="async" referrerPolicy="no-referrer" {...props} />
                  )
                }}
              >
                {post.content || ""}
              </Markdown>
            </div>
          </div>

          {/* Social Share Section - Bottom */}
          <div className="mt-16 py-12 border-t border-primary/5 flex flex-col items-center text-center">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h4 className="text-xl font-display font-black uppercase mb-3">Liked this strategy?</h4>
              <p className="text-muted text-xs uppercase font-bold tracking-widest mb-8 opacity-60 italic">Spread the growth to your network</p>
              
              <div className="flex flex-wrap justify-center gap-4">
                <button 
                  onClick={() => handleShare('linkedin')}
                  className="flex items-center gap-3 px-6 py-3 rounded-2xl bg-[#0077b5] text-white text-xs font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl shadow-[#0077b5]/20"
                >
                  <LinkedinIcon size={16} /> LinkedIn
                </button>
                <button 
                  onClick={() => handleShare('twitter')}
                  className="flex items-center gap-3 px-6 py-3 rounded-2xl bg-primary text-white text-xs font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl shadow-primary/20"
                >
                  <Twitter size={16} /> X / Twitter
                </button>
                <button 
                  onClick={() => handleShare('whatsapp')}
                  className="flex items-center gap-3 px-6 py-3 rounded-2xl bg-[#25D366] text-white text-xs font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl shadow-[#25D366]/20"
                >
                  <MessageCircle size={16} /> WhatsApp
                </button>
                <button 
                  onClick={() => handleShare('copy')}
                  className={`flex items-center gap-3 px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl ${
                    isCopied ? 'bg-accent text-white shadow-accent/20' : 'bg-white border border-primary/10 text-primary shadow-primary/5'
                  }`}
                >
                  {isCopied ? <><Check size={16} /> Copied</> : <><LinkIcon size={16} /> Copy Link</>}
                </button>
              </div>
            </motion.div>
          </div>

          {/* Footer / Tags */}
          <footer className="mt-20 pt-12 border-t border-primary/5">
            <div className="flex flex-wrap gap-4 mb-12">
              {post.keywords.map((tag) => (
                <span key={tag} className="text-[10px] font-black uppercase tracking-widest px-4 py-2 bg-primary/5 rounded-full text-muted border border-transparent hover:border-accent hover:text-accent transition-all">
                  #{tag}
                </span>
              ))}
            </div>

            {/* Google Preferred Source Follow Prompt */}
            <div className="mb-12">
              <GooglePreferredSourceButton variant="banner" />
            </div>

            {/* Author Card */}
            <div className="p-12 rounded-[40px] bg-[#faf9f6] border border-primary/5 flex flex-col md:flex-row items-center gap-10">
              <div className="w-32 h-32 rounded-3xl overflow-hidden bg-white shrink-0 shadow-lg p-2 border border-primary/5">
                <div className="w-full h-full rounded-2xl bg-primary/5 flex items-center justify-center">
                   <User size={64} className="text-primary/10" />
                </div>
              </div>
              <div className="text-center md:text-left">
                <h4 className="text-xl font-display font-black uppercase mb-3">Written by G. Hari Kiran</h4>
                <p className="text-muted text-sm leading-relaxed mb-6 italic">
                  Digital Marketer and Growth Strategist helpings brands scale with data and precision. Specialist in SEO and Retention Marketing.
                </p>
                <Link to="/about" className="text-xs font-black uppercase tracking-widest text-accent hover:underline decoration-2 underline-offset-4">
                  View Full Profile →
                </Link>
              </div>
            </div>

            <Newsletter />
          </footer>
        </article>

        {/* Read More Section */}
        <section className="container-custom mt-32">
          <h3 className="text-3xl font-display font-black uppercase mb-12">More to <span className="text-accent">Read</span></h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {relatedPosts.map((related, i) => (
              <motion.div
                key={related.slug}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group flex flex-col h-full bento-card border border-primary/5 hover:border-accent/30 transition-all overflow-hidden"
              >
                  <Link to={`/blog/${related.slug}`} className="flex flex-col h-full">
                    <div className="relative aspect-[16/9] mb-6 overflow-hidden rounded-2xl">
                       <img 
                         src={related.image} 
                         alt={`Related post: ${related.title}`} 
                         loading="lazy"
                         decoding="async"
                         width="480"
                         height="270"
                         className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                         referrerPolicy="no-referrer" 
                       />
                       <div className="absolute top-3 left-3 bg-accent text-white px-2 py-1 rounded-full text-[8px] font-black font-display uppercase tracking-widest z-10">
                        {related.category}
                      </div>
                    </div>
                    <div className="flex flex-col flex-grow">
                      <h4 className="text-lg font-display font-black uppercase leading-tight group-hover:text-accent transition-colors line-clamp-2 mb-4">
                        {related.title}
                      </h4>
                      <p className="text-xs text-muted line-clamp-2 mb-6 flex-grow leading-relaxed">
                        {related.excerpt}
                      </p>
                      <div className="flex items-center justify-between pt-4 border-t border-primary/5 mt-auto">
                        <div className="text-[9px] font-black uppercase tracking-widest text-muted italic">
                          {related.date}
                        </div>
                        <div className="text-accent group-hover:translate-x-1 transition-transform">
                          <ArrowRight size={14} />
                        </div>
                      </div>
                    </div>
                  </Link>
              </motion.div>
            ))}
          </div>
        </section>
      </div>
    );
  };

export default BlogPostPage;
