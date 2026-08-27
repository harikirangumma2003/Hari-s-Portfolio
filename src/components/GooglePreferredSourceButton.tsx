import React, { useEffect, useState } from "react";
import { Sparkles, ExternalLink, BookmarkCheck } from "lucide-react";

interface GooglePreferredSourceButtonProps {
  variant?: "pill" | "banner" | "compact" | "card";
  className?: string;
  theme?: "light" | "dark";
}

export const GooglePreferredSourceButton: React.FC<GooglePreferredSourceButtonProps> = ({
  variant = "pill",
  className = "",
  theme = "light",
}) => {
  const [isFollowed, setIsFollowed] = useState(false);
  const preferredSourceUrl = "https://www.google.com/preferences/source?q=harikiran-portfolio.netlify.app";

  useEffect(() => {
    // Safely check and trigger publisher script rendering if the global library is available
    if (typeof window !== "undefined") {
      try {
        const win = window as any;
        if (win.PREFERRED_SOURCE && Array.isArray(win.PREFERRED_SOURCE)) {
          win.PREFERRED_SOURCE.push((preferredSource: any) => {
            if (preferredSource && typeof preferredSource.init === "function") {
              try {
                preferredSource.init({ theme: theme, lang: "en" });
              } catch (_) {
                // Silently swallow third-party provider mismatch
              }
            }
          });
        }
      } catch (_) {
        // Prevent console errors from non-critical third party scripts
      }
    }
  }, [theme]);

  const handleTrackClick = () => {
    setIsFollowed(true);
    if (typeof window !== "undefined" && typeof (window as any).gtag === "function") {
      try {
        (window as any).gtag("event", "preferred_source_click", {
          event_category: "engagement",
          event_label: "Google Preferred Source Added",
          source_variant: variant,
          destination_url: preferredSourceUrl
        });
      } catch (_) {
        // Analytics error guard
      }
    }
  };

  const GoogleGIcon = ({ className: iconClass = "w-5 h-5 shrink-0" }: { className?: string }) => (
    <svg viewBox="0 0 24 24" className={iconClass} aria-hidden="true" focusable="false">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
      />
    </svg>
  );

  if (variant === "compact") {
    return (
      <a
        id="google-preferred-source-compact"
        href={preferredSourceUrl}
        target="_blank"
        rel="noopener noreferrer"
        onClick={handleTrackClick}
        aria-label="Add G. Hari Kiran Portfolio to Google Preferred Sources"
        title="Add G. Hari Kiran Portfolio to Google Preferred Sources"
        className={`inline-flex items-center justify-center gap-2 min-h-[44px] px-4 py-2 sm:px-3.5 sm:py-1.5 rounded-full bg-white hover:bg-neutral-50 border border-neutral-300 hover:border-[#4285F4] text-xs font-black text-zinc-900 transition-all shadow-sm hover:shadow active:scale-95 group touch-manipulation ${className}`}
      >
        <GoogleGIcon className="w-4 h-4 shrink-0" />
        <span className="text-[11px] sm:text-[10px] font-black uppercase tracking-wider text-zinc-900">
          Follow on Google
        </span>
        <ExternalLink size={12} className="text-zinc-600 group-hover:text-[#4285F4] transition-colors shrink-0" />
      </a>
    );
  }

  if (variant === "card" || variant === "banner") {
    return (
      <div
        id="google-preferred-source-banner"
        className={`relative overflow-hidden rounded-[28px] bg-gradient-to-br from-[#12141a] to-[#0c0d12] border border-white/10 p-6 sm:p-8 md:p-10 shadow-2xl ${className}`}
      >
        {/* Subtle decorative glow */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#4285F4]/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#34A853]/10 rounded-full blur-3xl pointer-events-none -ml-16 -mb-16" />

        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-start gap-4 text-left w-full md:w-auto">
            <div className="w-12 h-12 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center shrink-0 shadow-inner">
              <GoogleGIcon className="w-6 h-6" />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#4285F4]/20 border border-[#4285F4]/40 text-[10px] font-black uppercase tracking-widest text-[#60a5fa] mb-2">
                <Sparkles size={11} className="text-[#60a5fa]" /> Google Preferred Source
              </div>
              <h4 className="text-lg sm:text-xl md:text-2xl font-display font-black text-white uppercase tracking-tight">
                Prioritize My SEO Insights on Google Search
              </h4>
              <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed max-w-xl mt-1.5 font-normal">
                Add <strong className="text-white font-bold">G. Hari Kiran Portfolio</strong> as your preferred source to get top rankings for our latest algorithm breakdowns and digital growth case studies directly in your Google Discover & Search feed.
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0 w-full md:w-auto">
            {/* Embedded Google Web Component Hook */}
            <div google-add-preferred-source-btn="" data-theme="dark" data-lang="en" className="hidden" />

            <a
              href={preferredSourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={handleTrackClick}
              aria-label="Add as Preferred Source on Google"
              className="w-full sm:w-auto min-h-[48px] inline-flex items-center justify-center gap-3 px-7 py-4 rounded-2xl bg-white hover:bg-neutral-100 text-zinc-950 font-black text-xs uppercase tracking-widest transition-all hover:scale-[1.02] active:scale-95 shadow-xl hover:shadow-[#4285F4]/30 touch-manipulation text-center"
            >
              <GoogleGIcon className="w-5 h-5 shrink-0" />
              <span className="text-zinc-950 font-black">{isFollowed ? "Added to Google" : "Add as Preferred Source"}</span>
              {isFollowed ? <BookmarkCheck size={16} className="text-[#16a34a] shrink-0" /> : <ExternalLink size={14} className="text-zinc-700 shrink-0" />}
            </a>
          </div>
        </div>
      </div>
    );
  }

  // Default Pill Variant
  return (
    <div className={`w-full sm:w-auto inline-flex flex-col sm:flex-row items-center gap-2 ${className}`}>
      {/* Official Google Publisher JS Container */}
      <div google-add-preferred-source-btn="" data-theme={theme} data-lang="en" className="hidden" />

      {/* High-visibility native React button linking to Source Preferences */}
      <a
        id="google-preferred-source-pill"
        href={preferredSourceUrl}
        target="_blank"
        rel="noopener noreferrer"
        onClick={handleTrackClick}
        aria-label="Add G. Hari Kiran Portfolio as your preferred source on Google"
        title="Add G. Hari Kiran Portfolio as your preferred source on Google"
        className="w-full sm:w-auto min-h-[48px] inline-flex items-center justify-center gap-3 px-6 py-3.5 rounded-full bg-white hover:bg-neutral-50 text-zinc-950 border border-neutral-300 hover:border-[#4285F4] text-xs font-black uppercase tracking-wider transition-all shadow-md hover:shadow-lg active:scale-95 group touch-manipulation"
      >
        <GoogleGIcon className="w-5 h-5 shrink-0" />
        <span className="text-zinc-950 font-black">{isFollowed ? "Added to Google" : "Add as Preferred Source on Google"}</span>
        {isFollowed ? <BookmarkCheck size={16} className="text-[#16a34a] shrink-0" /> : <ExternalLink size={13} className="text-zinc-700 group-hover:text-[#4285F4] transition-colors shrink-0" />}
      </a>
    </div>
  );
};

