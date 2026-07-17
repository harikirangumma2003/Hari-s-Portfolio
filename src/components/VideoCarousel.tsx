import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useContent } from "../hooks/useContent";
import { 
  Play, 
  ChevronLeft, 
  ChevronRight, 
  ExternalLink, 
  Calendar, 
  X,
  Sparkles,
  Youtube
} from "lucide-react";
import { cn } from "../lib/utils";

export const VideoCarousel: React.FC = () => {
  const { content, loading } = useContent();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [activeEmbedId, setActiveEmbedId] = useState<string | null>(null);

  // Filter YouTube items
  const youtubeItems = useMemo(() => {
    return content.filter(item => item.platform === "YouTube");
  }, [content]);

  // Extract video ID helper
  const getYoutubeVideoId = (url: string) => {
    if (!url) return null;
    let match = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i);
    if (match && match[1]) return match[1];
    if (url.includes("shorts/")) {
      const parts = url.split("shorts/");
      return parts[1]?.split(/[?#]/)[0] || null;
    }
    return null;
  };

  const handleNext = () => {
    if (youtubeItems.length === 0) return;
    setCurrentIndex((prevIndex) => (prevIndex + 1) % youtubeItems.length);
  };

  const handlePrev = () => {
    if (youtubeItems.length === 0) return;
    setCurrentIndex((prevIndex) => (prevIndex - 1 + youtubeItems.length) % youtubeItems.length);
  };

  if (loading) {
    return (
      <div className="w-full rounded-[40px] bg-gradient-to-br from-zinc-900/60 to-zinc-950/80 border border-white/5 p-6 md:p-10 shadow-2xl backdrop-blur-md animate-pulse">
        <div className="relative z-10 min-h-[360px] flex flex-col justify-between">
          <div className="flex items-center justify-between mb-6 md:mb-8 border-b border-white/5 pb-4">
            <div className="h-4 bg-zinc-900 rounded w-1/4" />
            <div className="h-4 bg-zinc-900 rounded w-1/12" />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center flex-1">
            <div className="lg:col-span-6 w-full aspect-video rounded-3xl bg-zinc-900" />
            <div className="lg:col-span-6 space-y-4">
              <div className="h-4 bg-zinc-900 rounded w-1/3" />
              <div className="h-8 bg-zinc-900 rounded w-3/4" />
              <div className="h-4 bg-zinc-900 rounded w-full" />
              <div className="h-4 bg-zinc-900 rounded w-5/6" />
              <div className="h-10 bg-zinc-900 rounded w-1/3 mt-6" />
            </div>
          </div>
          <div className="flex items-center justify-between mt-8 pt-4 border-t border-white/5">
            <div className="h-4 bg-zinc-900 rounded w-16" />
            <div className="flex gap-2">
              <div className="w-10 h-10 rounded-full bg-zinc-900" />
              <div className="w-10 h-10 rounded-full bg-zinc-900" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (youtubeItems.length === 0) {
    return (
      <div className="text-center py-16 rounded-[40px] bg-zinc-950/30 border border-white/5">
        <Youtube className="mx-auto w-10 h-10 text-zinc-600 mb-3" />
        <p className="text-sm text-zinc-400 font-mono uppercase tracking-wider">No YouTube content synchronized yet</p>
      </div>
    );
  }

  const currentItem = youtubeItems[currentIndex];
  const videoId = currentItem ? getYoutubeVideoId(currentItem.url) : null;

  return (
    <div id="video-carousel" className="w-full relative group/carousel">
      {/* Outer Shell */}
      <div className="relative overflow-hidden rounded-[40px] bg-gradient-to-br from-zinc-900/60 to-zinc-950/80 border border-white/5 p-6 md:p-10 shadow-2xl backdrop-blur-md">
        
        {/* Glow Effects */}
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-red-600/5 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-accent/5 rounded-full blur-[100px] pointer-events-none" />

        {/* Content Panel Container with AnimatePresence */}
        <div className="relative z-10 min-h-[360px] flex flex-col justify-between">
          
          {/* Header Controls */}
          <div className="flex items-center justify-between mb-6 md:mb-8 border-b border-white/5 pb-4">
            <div className="flex items-center gap-2.5">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
              <p className="text-[10px] font-mono uppercase tracking-[3px] text-zinc-400 font-bold flex items-center gap-1.5">
                <Youtube size={12} className="text-red-500 shrink-0" />
                Featured Video Broadcast
              </p>
            </div>
            
            {/* Carousel navigation indicators */}
            <div className="flex items-center gap-1.5">
              {youtubeItems.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentIndex(idx)}
                  className={cn(
                    "h-1.5 rounded-full transition-all duration-300",
                    currentIndex === idx 
                      ? "w-6 bg-red-500" 
                      : "w-1.5 bg-zinc-700 hover:bg-zinc-500"
                  )}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>
          </div>

          {/* Core Content Body */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center flex-1">
            
            {/* Interactive Thumbnail Preview */}
            <div className="lg:col-span-6 relative w-full aspect-video rounded-3xl overflow-hidden group/thumb cursor-pointer border border-white/5 shadow-xl bg-zinc-950">
              <img
                src={currentItem.thumbnail || "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?auto=format,compress&fit=crop&fm=webp&q=70&w=800"}
                alt={currentItem.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover transition-transform duration-700 group-hover/thumb:scale-105"
              />
              {/* Overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/30 group-hover/thumb:opacity-90 transition-opacity duration-300" />
              
              {/* Content Type tag (Short vs Video) */}
              <div className="absolute top-4 left-4 z-20">
                <span className={cn(
                  "px-3 py-1.5 text-[8px] font-mono uppercase tracking-widest rounded-full font-black flex items-center gap-1 backdrop-blur-md border border-white/10 text-white",
                  currentItem.contentType === "Short" 
                    ? "bg-amber-500/25 border-amber-500/30 text-amber-300" 
                    : "bg-red-500/25 border-red-500/30 text-red-300"
                )}>
                  {currentItem.contentType === "Short" && <Sparkles size={8} />}
                  YouTube {currentItem.contentType}
                </span>
              </div>

              {/* Central Play Button */}
              <div 
                onClick={() => {
                  if (videoId) {
                    setActiveEmbedId(videoId);
                  } else {
                    window.open(currentItem.url, "_blank", "noopener,noreferrer");
                  }
                }}
                className="absolute inset-0 flex items-center justify-center z-10"
              >
                <div className="w-16 h-16 rounded-full bg-red-600 hover:bg-red-500 text-white flex items-center justify-center shadow-lg transition-transform duration-300 group-hover/thumb:scale-110 active:scale-95 border border-white/10">
                  <Play size={24} fill="currentColor" className="translate-x-0.5" />
                </div>
              </div>
            </div>

            {/* Dynamic Metadata Block */}
            <div className="lg:col-span-6 space-y-4 md:space-y-5 text-left flex flex-col justify-center h-full">
              <div className="flex items-center gap-3 text-[10px] font-mono text-zinc-500 uppercase tracking-wider">
                <span className="flex items-center gap-1">
                  <Calendar size={11} />
                  {currentItem.publishedDate ? new Date(currentItem.publishedDate).toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric"
                  }) : "Recent Video"}
                </span>
                <span>•</span>
                <span>{currentItem.category || "Video"}</span>
              </div>

              <h3 className="text-xl md:text-3xl font-display font-black text-white uppercase tracking-tighter leading-tight line-clamp-2">
                {currentItem.title}
              </h3>

              <p className="text-[12px] md:text-sm text-zinc-400 font-sans leading-relaxed font-medium line-clamp-3">
                {currentItem.description || currentItem.excerpt || "No description provided."}
              </p>

              {/* Call to Actions */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  onClick={() => {
                    if (videoId) {
                      setActiveEmbedId(videoId);
                    } else {
                      window.open(currentItem.url, "_blank", "noopener,noreferrer");
                    }
                  }}
                  className="btn-primary flex items-center bg-red-600 hover:bg-red-500 text-white px-5 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all gap-2 cursor-pointer border-none shadow-lg shadow-red-600/10"
                >
                  <Play size={10} fill="currentColor" /> Play Inline
                </button>
                <a
                  href={currentItem.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest border border-white/10 hover:border-white/20 text-white bg-white/5 hover:bg-white/10 transition-all"
                >
                  <span>Watch on YouTube</span>
                  <ExternalLink size={10} />
                </a>
              </div>
            </div>

          </div>

          {/* Manual Arrow Controls (Bottom Area) */}
          <div className="flex items-center justify-between mt-8 pt-4 border-t border-white/5 text-zinc-500 text-[10px] font-mono uppercase tracking-wider">
            <span>
              Item <strong className="text-white">{currentIndex + 1}</strong> of <strong className="text-white">{youtubeItems.length}</strong>
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={handlePrev}
                className="w-10 h-10 rounded-full border border-white/5 hover:border-white/10 bg-white/5 hover:bg-white/10 text-white flex items-center justify-center transition-all cursor-pointer"
                aria-label="Previous slide"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                onClick={handleNext}
                className="w-10 h-10 rounded-full border border-white/5 hover:border-white/10 bg-white/5 hover:bg-white/10 text-white flex items-center justify-center transition-all cursor-pointer"
                aria-label="Next slide"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* Embedded Lightbox Video Player */}
      <AnimatePresence>
        {activeEmbedId && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 backdrop-blur-md z-[9999] flex items-center justify-center p-4 md:p-8"
            onClick={() => setActiveEmbedId(null)}
          >
            {/* Modal Body */}
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 350 }}
              className="relative w-full max-w-4xl aspect-video rounded-3xl overflow-hidden bg-zinc-950 border border-white/10 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={() => setActiveEmbedId(null)}
                className="absolute top-4 right-4 z-50 w-10 h-10 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center border border-white/10 transition-colors"
                aria-label="Close video player"
              >
                <X size={18} />
              </button>
              
              {/* Embed Iframe */}
              <iframe
                src={`https://www.youtube.com/embed/${activeEmbedId}?autoplay=1&rel=0`}
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className="w-full h-full"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
