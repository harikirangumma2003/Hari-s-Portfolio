import React, { useState, useEffect, useMemo } from 'react';
import { List, ChevronDown, ChevronUp, Bookmark, ArrowUp, AlignLeft, Hash } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export interface HeadingItem {
  id: string;
  text: string;
  level: number;
}

interface TableOfContentsProps {
  content: string;
  className?: string;
}

/**
 * Utility to extract headings from both Markdown and HTML content
 */
export function extractHeadings(rawContent: string): HeadingItem[] {
  if (!rawContent || typeof rawContent !== 'string') return [];

  const headings: HeadingItem[] = [];
  const idCounts = new Map<string, number>();

  const slugify = (text: string): string => {
    const clean = text
      .toLowerCase()
      .replace(/<[^>]+>/g, '') // remove HTML tags
      .replace(/[*_~`#[\]()]/g, '') // remove Markdown symbols
      .replace(/&[a-z0-9#]+;/gi, '') // remove HTML entities
      .replace(/[^a-z0-9\s-]/g, '') // remove special characters
      .trim()
      .replace(/\s+/g, '-');
    return clean || 'section';
  };

  const generateUniqueId = (baseSlug: string): string => {
    const count = idCounts.get(baseSlug) || 0;
    idCounts.set(baseSlug, count + 1);
    return count === 0 ? baseSlug : `${baseSlug}-${count}`;
  };

  // 1. Check for HTML headings <h1...>, <h2...>, <h3...>
  const htmlHeadingRegex = /<h([1-3])[^>]*>([\s\S]*?)<\/h\1>/gi;
  let htmlMatch: RegExpExecArray | null;
  const htmlHeadings: { index: number; item: HeadingItem }[] = [];

  while ((htmlMatch = htmlHeadingRegex.exec(rawContent)) !== null) {
    const level = parseInt(htmlMatch[1], 10);
    const rawText = htmlMatch[2]
      .replace(/<[^>]+>/g, '')
      .replace(/&nbsp;/g, ' ')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .trim();

    if (rawText) {
      const baseSlug = slugify(rawText);
      const id = generateUniqueId(baseSlug);
      htmlHeadings.push({
        index: htmlMatch.index,
        item: { id, text: rawText, level }
      });
    }
  }

  // 2. Check for Markdown headings #, ##, ###
  const lines = rawContent.split('\n');
  let charOffset = 0;
  const mdHeadings: { index: number; item: HeadingItem }[] = [];

  for (const line of lines) {
    const trimmed = line.trim();
    const mdMatch = trimmed.match(/^(#{1,3})\s+(.+)$/);
    if (mdMatch) {
      const level = mdMatch[1].length;
      const rawText = mdMatch[2]
        .replace(/[*_~`#[\]()]/g, '')
        .replace(/<[^>]+>/g, '')
        .trim();

      if (rawText) {
        const baseSlug = slugify(rawText);
        const id = generateUniqueId(baseSlug);
        mdHeadings.push({
          index: charOffset,
          item: { id, text: rawText, level }
        });
      }
    }
    charOffset += line.length + 1;
  }

  // If HTML headings exist, prioritize them or merge based on index
  if (htmlHeadings.length > 0 && mdHeadings.length === 0) {
    return htmlHeadings.map(h => h.item);
  } else if (mdHeadings.length > 0 && htmlHeadings.length === 0) {
    return mdHeadings.map(h => h.item);
  } else if (htmlHeadings.length > 0 && mdHeadings.length > 0) {
    const combined = [...htmlHeadings, ...mdHeadings].sort((a, b) => a.index - b.index);
    return combined.map(h => h.item);
  }

  return [];
}

export const TableOfContents: React.FC<TableOfContentsProps> = ({ content, className = '' }) => {
  const [isOpen, setIsOpen] = useState(true);
  const [activeId, setActiveId] = useState<string>('');
  const [readingProgress, setReadingProgress] = useState(0);

  const headings = useMemo(() => extractHeadings(content), [content]);

  // Track active section and scroll progress
  useEffect(() => {
    if (headings.length === 0) return;

    const handleScroll = () => {
      // Calculate overall page scroll progress
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        const currentProgress = (window.scrollY / totalHeight) * 100;
        setReadingProgress(Math.min(100, Math.max(0, currentProgress)));
      }

      // Find current heading in viewport
      const headingElements = headings
        .map(h => document.getElementById(h.id))
        .filter((el): el is HTMLElement => el !== null);

      const scrollPosition = window.scrollY + 140; // Offset for navbar

      for (let i = headingElements.length - 1; i >= 0; i--) {
        const el = headingElements[i];
        if (el.offsetTop <= scrollPosition) {
          setActiveId(el.id);
          return;
        }
      }

      if (headingElements.length > 0 && window.scrollY < headingElements[0].offsetTop - 140) {
        setActiveId(headingElements[0].id);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial check

    return () => window.removeEventListener('scroll', handleScroll);
  }, [headings]);

  const handleHeadingClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const targetElement = document.getElementById(id);
    if (targetElement) {
      const headerOffset = 100;
      const elementPosition = targetElement.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });

      setActiveId(id);
      history.pushState(null, '', `#${id}`);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (headings.length < 2) {
    return null;
  }

  return (
    <nav 
      aria-label="Table of Contents" 
      className={`my-10 rounded-3xl border border-zinc-800 bg-black shadow-2xl overflow-hidden transition-all duration-300 ${className}`}
      id="table-of-contents"
    >
      {/* Header Bar */}
      <div 
        className="flex items-center justify-between p-5 sm:p-6 cursor-pointer select-none bg-[#0a0a0c] border-b border-zinc-800/80 hover:bg-zinc-900/50 transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-accent text-white flex items-center justify-center shadow-md shadow-accent/30">
            <List size={18} />
          </div>
          <div>
            <div className="flex items-center gap-2.5">
              <span className="font-display font-black text-base sm:text-lg uppercase tracking-tight text-white">
                Table of Contents
              </span>
              <span className="text-[10px] font-mono font-bold bg-zinc-800 text-zinc-200 border border-zinc-700/60 px-2.5 py-0.5 rounded-full uppercase">
                {headings.length} Sections
              </span>
            </div>
            <p className="text-[11px] font-medium text-zinc-400 uppercase tracking-wider mt-0.5">
              Quick article navigator & key milestones
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs font-mono font-bold text-accent hidden sm:inline-block">
            {Math.round(readingProgress)}% read
          </span>
          <button 
            type="button"
            aria-label={isOpen ? "Collapse Table of Contents" : "Expand Table of Contents"}
            className="w-8 h-8 rounded-lg bg-zinc-800/80 border border-zinc-700/50 flex items-center justify-center text-white hover:bg-zinc-700 transition-colors"
          >
            {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
        </div>
      </div>

      {/* Reading Progress Line */}
      <div className="w-full h-1 bg-zinc-800">
        <div 
          className="h-full bg-accent transition-all duration-150 ease-out rounded-r-full shadow-[0_0_8px_rgba(255,107,0,0.5)]"
          style={{ width: `${readingProgress}%` }}
        />
      </div>

      {/* Headings List Accordion */}
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="overflow-hidden bg-black"
          >
            <div className="p-5 sm:p-6 space-y-1.5 max-h-[60vh] overflow-y-auto custom-scrollbar">
              {headings.map((heading, index) => {
                const isActive = activeId === heading.id;
                const isSubHeading = heading.level === 3;

                return (
                  <a
                    key={`${heading.id}-${index}`}
                    href={`#${heading.id}`}
                    onClick={(e) => handleHeadingClick(e, heading.id)}
                    className={`group flex items-start gap-2.5 py-2 px-3 rounded-xl text-sm transition-all duration-200 ${
                      isSubHeading ? 'ml-4 sm:ml-6 text-xs' : 'font-medium'
                    } ${
                      isActive 
                        ? 'bg-accent/20 text-white font-bold border border-accent/40 shadow-sm translate-x-1' 
                        : 'text-zinc-300 hover:bg-zinc-900 hover:text-white'
                    }`}
                  >
                    <span className={`mt-0.5 shrink-0 transition-colors ${
                      isActive ? 'text-accent' : 'text-zinc-500 group-hover:text-accent'
                    }`}>
                      {isSubHeading ? (
                        <span className="inline-block w-1.5 h-1.5 rounded-full bg-current mt-1.5 ml-1" />
                      ) : (
                        <Hash size={14} className="opacity-80" />
                      )}
                    </span>
                    <span className="line-clamp-2 leading-relaxed">
                      {heading.text}
                    </span>
                  </a>
                );
              })}

              {/* Bottom Quick Navigation */}
              <div className="pt-4 mt-4 border-t border-zinc-800 flex items-center justify-between text-xs text-zinc-400">
                <span className="font-mono text-[11px]">
                  Click any heading to jump instantly
                </span>
                <button
                  type="button"
                  onClick={scrollToTop}
                  className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-accent hover:text-accent/80 transition-colors"
                >
                  <ArrowUp size={12} /> Top of Article
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};
