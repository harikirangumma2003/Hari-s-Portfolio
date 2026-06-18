import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { partnersData, Partner } from "../data/partners";
import { ArrowUpRight, Play, X, Target, BarChart3, Star, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

export const GrowthPartners = () => {
  const [activeVideo, setActiveVideo] = useState<string | null>(null);

  const tier3Partners = partnersData.filter((p) => p.tier === 3);
  const tier2Partners = partnersData.filter((p) => p.tier === 2);
  const tier1Partners = partnersData.filter((p) => p.tier === 1);

  return (
    <section id="growth-partners" className="mt-20 md:mt-40">
      {/* Visual Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-8">
        <div className="max-w-2xl">
          <span className="text-[10px] font-black uppercase tracking-[4px] text-accent mb-4 pl-1 border-l-2 border-accent block">
            Co-Branded Authority
          </span>
          <h2 className="text-4xl sm:text-5xl md:text-7xl font-display font-black tracking-tighter uppercase leading-[0.9]">
            Growth Partners <br />
            <span className="text-accent italic">&amp; Featured Brands</span>
          </h2>
          <p className="text-muted text-sm md:text-base mt-4 max-w-xl leading-relaxed">
            We operate at the nexus of high-signal organic visibility and conversion engineering. Explore the market leaders scaling with our framework.
          </p>
        </div>
        <Link 
          to="/partners" 
          className="btn-primary group self-start md:self-end"
          id="btn-all-partners"
        >
          Partner Directory <ArrowUpRight size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
        </Link>
      </div>

      {/* Bento Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* TIER 3 - PREMIUM PARTNER CARD (Spans 8 columns on large screens) */}
        {tier3Partners.map((partner) => (
          <div
            key={partner.id}
            className="lg:col-span-8 bg-black text-white rounded-[40px] p-6 sm:p-10 border border-white/10 relative overflow-hidden flex flex-col justify-between shadow-2xl min-h-[500px]"
          >
            {/* Background elements */}
            <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-accent/10 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute -bottom-20 -left-20 w-[300px] h-[300px] bg-white/[0.02] rounded-full blur-[80px] pointer-events-none" />

            <div>
              {/* Header inside card */}
              <div className="flex justify-between items-start mb-8 relative z-10">
                <div className="flex items-center gap-3">
                  <span className="text-[10px] font-black uppercase tracking-widest bg-accent text-white px-3 py-1 rounded-full flex items-center gap-1">
                    <Star size={10} fill="currentColor" /> Premium Partner
                  </span>
                  <span className="text-xs font-mono opacity-50 px-2">{partner.category}</span>
                </div>
                <a
                  href={partner.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-11 h-11 bg-white/5 border border-white/10 text-white rounded-full flex items-center justify-center hover:bg-accent hover:text-white transition-all transform hover:scale-105 active:scale-95"
                  aria-label={`Visit ${partner.name}`}
                >
                  <ArrowUpRight size={18} />
                </a>
              </div>

              {/* Logo & Headline */}
              <div className="relative z-10 mb-6">
                {partner.logo.startsWith('/') ? (
                  <div className="bg-white/10 px-4 py-2 rounded-2xl inline-flex items-center justify-center max-h-14 mb-4">
                    <img src={partner.logo} alt={partner.name} className="h-8 object-contain" />
                  </div>
                ) : (
                  <span className="font-display font-black text-2xl tracking-tight text-accent block mb-2 uppercase">
                    {partner.logo}
                  </span>
                )}
                <h3 className="text-2xl sm:text-4xl font-display font-black uppercase tracking-tighter leading-none mb-4">
                  {partner.brandStory?.headline}
                </h3>
                <div className="space-y-4 max-w-xl">
                  {partner.brandStory?.paragraphs.slice(0, 1).map((p, idx) => (
                    <p key={idx} className="text-white/70 text-sm leading-relaxed font-sans">
                      {p}
                    </p>
                  ))}
                </div>
              </div>
            </div>

            {/* Interactive Showcase Layer */}
            <div className="relative z-10 mt-8 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
              {/* Left detail Column */}
              <div className="md:col-span-5 space-y-4">
                <div className="bg-white/[0.05] border border-white/10 rounded-3xl p-5 backdrop-blur-sm">
                  <p className="text-[10px] font-mono tracking-widest uppercase text-white/40 mb-1">Impact Metric</p>
                  <p className="text-3xl font-display font-black text-accent">{partner.stats?.value}</p>
                  <p className="text-xs text-white/60 font-sans font-medium">{partner.stats?.label}</p>
                </div>
                <button
                  onClick={() => setActiveVideo(partner.brandStory?.videoUrl || null)}
                  className="w-full flex items-center justify-center gap-3 bg-white hover:bg-accent text-black hover:text-white py-4 px-6 rounded-2xl text-[10px] font-black tracking-wider uppercase transition-all shadow-xl active:scale-95"
                  id="btn-play-story"
                >
                  <Play size={14} fill="currentColor" /> Watch Brand Case Study
                </button>
              </div>

              {/* Right Mockup Video Thumbnail Column */}
              <div className="md:col-span-7">
                <div 
                  onClick={() => setActiveVideo(partner.brandStory?.videoUrl || null)}
                  className="aspect-video w-full rounded-3xl overflow-hidden border border-white/15 relative group cursor-pointer shadow-2xl"
                >
                  <img
                    src={partner.brandStory?.videoPlaceholderImg}
                    alt={`${partner.name} Video Case Study`}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors duration-500 flex items-center justify-center">
                    <div className="w-16 h-16 rounded-full bg-accent text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-500">
                      <Play size={24} fill="currentColor" className="ml-1" />
                    </div>
                  </div>
                  <div className="absolute bottom-4 left-4 bg-black/70 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
                    <p className="text-[9px] font-mono font-black uppercase text-white/80">Interactive Video Case Study</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* TIER 2 - FEATURED BRAND CARDS (Spans 4 columns) */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          {tier2Partners.map((partner) => (
            <div
              key={partner.id}
              className="bg-white border border-primary/5 rounded-[40px] p-6 sm:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.01)] transition-all duration-500 relative overflow-hidden flex flex-col justify-between group hover:shadow-[0_20px_50px_rgba(0,0,0,0.05)] hover:border-accent/20 hover:scale-[1.01]"
            >
              {/* Corner badge styling block */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-accent/[0.01] rounded-full blur-2xl pointer-events-none group-hover:bg-accent/[0.03] transition-all duration-500" />
              
              <div>
                <div className="flex justify-between items-start mb-6">
                  {partner.logo.startsWith('/') ? (
                    <div className="bg-neutral-50 border border-neutral-100 px-3 py-1.5 rounded-2xl flex items-center justify-center max-h-12 max-w-[150px]">
                      <img src={partner.logo} alt={partner.name} className="h-6 object-contain" />
                    </div>
                  ) : (
                    <span className="font-display font-black text-lg tracking-tight text-primary uppercase">
                      {partner.logo}
                    </span>
                  )}
                  <span className="text-[9px] font-black uppercase tracking-widest text-accent bg-accent/5 border border-accent/10 px-2.5 py-0.5 rounded-full inline-flex items-center gap-1">
                    <BarChart3 size={10} /> {partner.stats?.value}
                  </span>
                </div>

                <h4 className="text-xl font-display font-black uppercase text-primary mb-3">
                  {partner.name}
                </h4>
                <p className="text-muted text-xs sm:text-sm leading-relaxed mb-6 font-sans">
                  {partner.description}
                </p>
              </div>

              <div className="flex items-center justify-between mt-auto border-t border-primary/5 pt-5">
                <span className="text-[10px] font-mono text-muted/60 uppercase">{partner.category}</span>
                <a
                  href={partner.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 border border-primary/10 hover:border-accent hover:bg-accent text-primary hover:text-white text-[10px] uppercase font-black tracking-wider rounded-xl transition-all"
                >
                  Visit Brand <ArrowUpRight size={12} />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* TIER 1 - TRUSTED PARTNERS (Logo Strip Carousel) */}
      <div className="mt-16 bg-white border border-primary/5 rounded-[32px] p-8 shadow-[0_4px_20px_rgba(0,0,0,0.01)] relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-2 flex-shrink-0">
            <span className="w-1.5 h-1.5 bg-accent rounded-full animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-widest text-muted">Trusted Growth Ecosystem</span>
          </div>
          
          <div className="flex flex-wrap justify-center items-center gap-x-10 gap-y-4 md:gap-x-12">
            {(tier1Partners.length > 0 ? tier1Partners : partnersData).map((partner) => (
              <a
                key={partner.id}
                href={partner.url}
                target="_blank"
                rel="noopener noreferrer"
                className="font-display font-black text-sm tracking-tight text-primary/40 hover:text-accent transition-colors duration-300 uppercase flex items-center gap-1 py-1 group"
              >
                {partner.name}
                <ArrowUpRight size={10} className="opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* VIDEO POPUP MODAL */}
      <AnimatePresence>
        {activeVideo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 backdrop-blur-md z-[100] flex items-center justify-center p-4"
            onClick={() => setActiveVideo(null)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="relative w-full max-w-4xl aspect-video bg-black rounded-3xl overflow-hidden border border-white/10 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setActiveVideo(null)}
                className="absolute top-4 right-4 bg-black/60 backdrop-blur-md border border-white/15 text-white w-10 h-10 rounded-full flex items-center justify-center hover:bg-accent hover:border-accent transition-all z-20"
                aria-label="Close video player"
              >
                <X size={20} />
              </button>

              <iframe
                src={activeVideo}
                title="Growth Partner Brand Story Video"
                className="w-full h-full border-none outline-none"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default GrowthPartners;
