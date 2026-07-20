import React, { useMemo } from "react";
import { ArrowUpRight } from "lucide-react";
import { useContent } from "../hooks/useContent";
import { ContentHubItem } from "../types/content";
import { cn } from "../lib/utils";

// Helper to render platform badge beautifully
export const PlatformBadge = ({ platform }: { platform: ContentHubItem["platform"] }) => {
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
    <div className={cn("p-6 rounded-[32px] bg-white border border-primary/5 shadow-xl flex flex-col justify-between hover:shadow-2xl transition-all duration-300 relative group overflow-hidden h-[180px]", className)}>
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
