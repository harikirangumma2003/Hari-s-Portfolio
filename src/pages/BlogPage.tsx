import { motion } from "motion/react";
import { ArrowLeft, Calendar, Search, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import { Footer } from "../components/ContactFooter";
import { blogPosts } from "../data/blogPosts";
import { Helmet } from "react-helmet-async";

const BlogPage = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Helmet>
        <title>Blog | G. Hari Kiran - Digital Marketing & Growth Insights</title>
        <meta name="description" content="Read the latest insights on SEO, digital marketing, and growth strategies from G. Hari Kiran. Practical tips to scale your brand." />
        <meta name="keywords" content="Digital Marketing Blog, SEO Tips, Growth Strategy, Content Marketing, G. Hari Kiran" />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Blog | G. Hari Kiran - Digital Marketing & Growth Insights" />
        <meta property="og:description" content="Fresh insights on SEO, digital marketing, and performance growth strategies." />
        <meta property="og:image" content="https://i.postimg.cc/59rp3LDd/Hari-Portfolio.png" />
        
        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:title" content="Blog | G. Hari Kiran - Digital Marketing & Growth Insights" />
        <meta property="twitter:description" content="Fresh insights on SEO, digital marketing, and performance growth strategies." />
        <meta property="twitter:image" content="https://i.postimg.cc/59rp3LDd/Hari-Portfolio.png" />

        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Blog",
            "name": "G. Hari Kiran Growth Blog",
            "description": "Latest insights on SEO and Digital Marketing.",
            "publisher": {
              "@type": "Person",
              "name": "G. Hari Kiran"
            }
          })}
        </script>
      </Helmet>

      <Navbar />
      
      <main className="flex-grow pt-32 pb-24">
        <div className="container-custom">
          {/* Header */}
          <div className="mb-16">
            <Link to="/" className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-muted hover:text-accent transition-colors mb-8 group">
              <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
              Back to Home
            </Link>
            
            <h1 className="text-5xl md:text-8xl font-display font-black tracking-tighter uppercase leading-[0.85] mb-8">
              The <span className="text-accent">Growth</span> <br />Journal
            </h1>
            <p className="max-w-xl text-muted text-lg leading-relaxed">
              Deep dives into SEO, brand positioning, and the data-driven strategies I use to scale global brands. No fluff, just results.
            </p>
          </div>

          {/* Search/Filter placeholder */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-16 pb-8 border-b border-primary/5">
            <div className="flex gap-3 overflow-x-auto pb-4 w-full md:w-auto -mx-5 px-5 sm:mx-0 sm:px-0 no-scrollbar">
              {["All Posts", "SEO", "Social Media", "Growth"].map((cat) => (
                <button 
                  key={cat}
                  className={`text-[10px] font-black uppercase tracking-widest px-6 py-3 rounded-full border border-primary/10 hover:border-accent hover:text-accent transition-all whitespace-nowrap shadow-sm bg-white ${cat === "All Posts" ? 'bg-primary text-white border-primary shadow-primary/20' : ''}`}
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
                className="w-full pl-12 pr-6 py-4 bg-white rounded-2xl border border-primary/5 text-xs font-bold uppercase tracking-widest focus:border-accent focus:ring-0 transition-all shadow-sm"
              />
            </div>
          </div>

          {/* Blog Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogPosts.map((post, i) => (
              <motion.div
                key={post.slug}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group flex flex-col h-full bento-card border border-primary/5 hover:border-accent/30 transition-all cursor-pointer"
              >
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
              </motion.div>
            ))}
          </div>

          {/* Newsletter / CTA */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-32 p-12 rounded-[40px] bg-[#faf9f6] border border-primary/5 flex flex-col md:flex-row justify-between items-center gap-12"
          >
            <div className="max-w-md">
              <h3 className="text-3xl font-display font-black uppercase leading-tight mb-4">Get growth hacks in your inbox.</h3>
              <p className="text-muted text-sm uppercase font-bold tracking-widest opacity-70">No spam. Only high-signal marketing insights.</p>
            </div>
            <div className="flex w-full md:w-auto gap-2">
              <input 
                type="email" 
                placeholder="EMAIL ADDRESS" 
                className="flex-grow md:w-64 px-6 py-4 rounded-full bg-white border border-primary/10 text-[10px] font-black uppercase tracking-widest focus:border-accent outline-none"
              />
              <button className="bg-primary text-white px-8 py-4 rounded-full font-black text-[10px] uppercase tracking-widest hover:bg-accent transition-all shrink-0 shadow-lg">
                Subscribe
              </button>
            </div>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default BlogPage;
