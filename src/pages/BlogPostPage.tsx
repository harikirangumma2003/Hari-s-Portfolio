import { motion } from "motion/react";
import { ArrowLeft, Calendar, User, Share2, Facebook, Twitter, Linkedin as LinkedinIcon, Link as LinkIcon, Clock, Check, MessageCircle, Tag, ArrowRight } from "lucide-react";
import { Link, useParams, Navigate } from "react-router-dom";
import { Newsletter } from "../components/Newsletter";
import { blogPosts } from "../data/blogPosts";
import { SEO } from "../components/SEO";
import { useState, useMemo } from "react";

const BlogPostPage = () => {
  const { slug } = useParams();
  const post = blogPosts.find((p) => p.slug === slug);
  const [isCopied, setIsCopied] = useState(false);

  // Find related posts - same category first, then most recent
  const relatedPosts = useMemo(() => {
    if (!post) return [];
    return blogPosts
      .filter(p => p.slug !== slug)
      .sort((a, b) => {
        if (a.category === post.category && b.category !== post.category) return -1;
        if (b.category === post.category && b.category !== post.category) return 1;
        return 0;
      })
      .slice(0, 3);
  }, [slug, post]);

  if (!post) {
    return <Navigate to="/blog" replace />;
  }

  const shareUrl = window.location.href;

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

  return (
    <div className="pt-32 pb-24">
      <SEO 
        title={post.title}
        description={post.excerpt}
        image={post.image}
        url={`/blog/${post.slug}`}
        type="article"
        articleData={{
          publishedTime: post.date,
          author: "G. Hari Kiran",
          tags: post.keywords
        }}
        schemaData={{
          "@context": "https://schema.org",
          "@type": "BlogPosting",
          "headline": post.title,
          "image": post.image,
          "datePublished": post.date,
          "author": {
            "@type": "Person",
            "name": "G. Hari Kiran",
            "url": "https://harikiran.marketing/about"
          },
          "description": post.excerpt,
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
          {/* Back Navigation */}
          <Link to="/blog" className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-muted hover:text-accent transition-colors mb-12 group">
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            Back to Journal
          </Link>

          {/* Post Header */}
          <header className="mb-12">
            <div className="flex gap-3 mb-6">
              <span className="bg-accent text-white px-3 py-1.5 rounded-full text-[10px] font-black font-display uppercase tracking-widest">
                {post.category}
              </span>
              <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted">
                <Clock size={12} className="text-accent" />
                5 min read
              </div>
            </div>
            
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-display font-black tracking-tighter uppercase leading-[0.9] mb-8">
              {post.title}
            </h1>
            
            <div className="flex flex-wrap items-center justify-between gap-6 py-8 border-y border-primary/5">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/5 flex items-center justify-center border border-primary/10 overflow-hidden">
                  <User size={24} className="text-muted" />
                </div>
                <div>
                  <p className="text-xs font-black uppercase tracking-widest text-primary">G. Hari Kiran</p>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-muted opacity-70 italic">{post.date}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <p className="text-[10px] font-black uppercase tracking-widest text-muted">Share</p>
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
          <div className="relative aspect-video mb-16 rounded-[40px] overflow-hidden border border-primary/5 shadow-2xl">
            <img 
              src={post.image} 
              alt={`Featured image for blog post: ${post.title}`}
              loading="lazy"
              decoding="async"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>

          {/* Post Content */}
          <div className="mx-auto mt-16 px-4 sm:px-0">
            <div 
              className="markdown-content"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
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
            <div className="flex flex-wrap gap-4 mb-16">
              {post.keywords.map((tag) => (
                <span key={tag} className="text-[10px] font-black uppercase tracking-widest px-4 py-2 bg-primary/5 rounded-full text-muted border border-transparent hover:border-accent hover:text-accent transition-all">
                  #{tag}
                </span>
              ))}
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
