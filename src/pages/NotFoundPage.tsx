import React, { useState } from "react";
import { motion } from "motion/react";
import { Link } from "react-router-dom";
import { ArrowRight, HelpCircle, FileSearch, RefreshCw, Send } from "lucide-react";
import { SEO } from "../components/SEO";
import { Breadcrumbs } from "../components/Breadcrumbs";
import { submitToIndexNow } from "../lib/indexnow";

const NotFoundPage = () => {
  const [indexUrl, setIndexUrl] = useState("");
  const [indexStatus, setIndexStatus] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleIndexSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!indexUrl) return;
    setIsLoading(true);
    setIndexStatus("Submitting modified URL via IndexNow API protocol...");
    
    try {
      const results = await submitToIndexNow([indexUrl]);
      const statusText = results.map(r => `${r.message} (HTTP Code: ${r.status})`).join(" | ");
      setIndexStatus(statusText);
    } catch {
      setIndexStatus("Error: IndexNow submission aborted. Check API availability.");
    } finally {
      setIsLoading(false);
    }
  };

  const breadcrumbs = [
    { name: "404 Diagnostic", path: "/404" }
  ];

  return (
    <div className="pt-32 pb-24 bg-bg-light min-h-[85vh]">
      <SEO 
        title="404 Page Not Found - SEO Audit Diagnostic | G. Hari Kiran"
        description="The requested page could not be located. Access G. Hari Kiran's digital marketing, SEO strategy, and high-ROI conversion solutions here."
        url="/404"
      />

      <div className="container-custom max-w-4xl">
        {/* Dynamic Breadcrumbs */}
        <Breadcrumbs items={breadcrumbs} />

        {/* 404 Hero Card */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-stretch mt-8">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="md:col-span-8 bento-card p-10 bg-white flex flex-col justify-between"
          >
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-accent/10 border border-accent/20 rounded-full mb-6">
                <FileSearch size={14} className="text-accent animate-bounce" />
                <span className="text-[9px] font-black uppercase tracking-widest text-accent">Error Code: 404 (Not Found)</span>
              </div>
              <h1 className="text-5xl md:text-7xl font-display font-black uppercase tracking-tighter leading-none mb-6">
                Lost in the <span className="text-accent">Algorithms?</span>
              </h1>
              <p className="text-muted leading-relaxed text-sm md:text-base mb-8 max-w-xl">
                The URL you followed might be broken, renamed, or temporarily offline. As part of my custom <strong>Ahrefs Technical Audit Optimization</strong>, this crawlable custom 404 page prevents orphan links and points bots back into high-authority pages.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-4">
              <Link to="/" className="btn-accent text-center justify-center py-4">
                 Homepage <ArrowRight size={14} />
              </Link>
              <Link to="/contact" className="px-6 py-4 border border-primary/20 hover:bg-primary hover:text-white rounded-full text-[10px] font-black uppercase tracking-widest text-center transition-all">
                Hire Jamshedpur SEO Specialist
              </Link>
            </div>
          </motion.div>

          {/* Crawl Recovery & Navigation Map */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="md:col-span-4 bento-card p-8 bg-black text-white flex flex-col justify-between"
          >
            <div>
              <span className="text-[10px] font-black uppercase tracking-[3px] text-accent mb-4 block">Crawl Recovery</span>
              <h3 className="text-lg font-display font-black uppercase tracking-tight text-white mb-6">Crawl Map Navigation</h3>
              
              <ul className="space-y-4 text-xs font-mono uppercase tracking-widest">
                <li>
                  <Link to="/work" className="text-white/70 hover:text-accent transition-colors flex items-center justify-between">
                    <span>📁 Client Campaigns</span>
                    <ArrowRight size={12} />
                  </Link>
                </li>
                <li>
                  <Link to="/about" className="text-white/70 hover:text-accent transition-colors flex items-center justify-between">
                    <span>👤 Learn About Hari</span>
                    <ArrowRight size={12} />
                  </Link>
                </li>
                <li>
                  <Link to="/experience" className="text-white/70 hover:text-accent transition-colors flex items-center justify-between">
                    <span>💼 Professional CV</span>
                    <ArrowRight size={12} />
                  </Link>
                </li>
                <li>
                  <Link to="/blog" className="text-white/70 hover:text-accent transition-colors flex items-center justify-between">
                    <span>📰 Business Journal</span>
                    <ArrowRight size={12} />
                  </Link>
                </li>
                <li>
                  <Link to="/partners" className="text-white/70 hover:text-accent transition-colors flex items-center justify-between">
                    <span>🤝 Growth Partners</span>
                    <ArrowRight size={12} />
                  </Link>
                </li>
              </ul>
            </div>

            <div className="pt-6 border-t border-white/10 mt-6 text-[10px] text-white/50 leading-relaxed font-mono">
              ⚡ Status: Googlebot & Bingbot Allowed. Automated Redirect Routing Active.
            </div>
          </motion.div>
        </div>

        {/* Live IndexNow Submission Interface */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bento-card p-8 bg-white border border-primary/5 hover:border-accent/15 mt-10"
        >
          <div className="flex flex-col md:flex-row gap-6 justify-between items-start md:items-center mb-6">
            <div>
              <h3 className="text-xl font-display font-black uppercase tracking-tight text-primary">
                IndexNow Crawler Submission API
              </h3>
              <p className="text-muted text-xs md:text-sm mt-1 max-w-2xl">
                Encountered a changed URL or wanting to expedite search engine indexing? Push your link directly to Bing, Yandex, and partners via the secure IndexNow pipeline instantly below.
              </p>
            </div>
            <div className="px-3 py-1 bg-emerald-50 text-emerald-700 text-[9px] font-black uppercase tracking-widest rounded-full border border-emerald-100 flex items-center gap-1.5 font-mono">
              <RefreshCw size={10} className="animate-spin text-emerald-600" /> Key verification active
            </div>
          </div>

          <form onSubmit={handleIndexSubmit} className="flex flex-col sm:flex-row gap-4">
            <input 
              type="url" 
              placeholder="e.g. https://harikiran-portfolio.netlify.app/partners" 
              required
              value={indexUrl}
              onChange={(e) => setIndexUrl(e.target.value)}
              className="flex-grow px-4 py-3 bg-neutral-50 rounded-xl text-xs font-mono border border-primary/10 focus:outline-none focus:border-accent focus:bg-white text-primary transition-all shadow-inner"
            />
            <button 
              type="submit" 
              disabled={isLoading}
              className="btn-accent px-6 py-3 whitespace-nowrap justify-center flex items-center gap-2 text-xs"
            >
              <Send size={12} /> 
              {isLoading ? "Broadcasting..." : "Fast Index Now"}
            </button>
          </form>

          {indexStatus && (
            <motion.div 
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 p-4 rounded-xl bg-primary/5 text-[11px] font-mono text-primary border border-primary/10 flex items-start gap-2.5 leading-relaxed"
            >
              <HelpCircle size={14} className="text-accent flex-shrink-0 mt-0.5" />
              <span>{indexStatus}</span>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default NotFoundPage;
