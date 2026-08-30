import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, Sparkles, Rocket, ThumbsUp, Flame, Check } from 'lucide-react';
import {
  BlogReactionsData,
  subscribeToBlogReactions,
  incrementBlogReaction,
  getUserReactionCounts
} from '../services/blogEngagementService';

interface BlogReactionsProps {
  postSlug: string;
  postTitle?: string;
  variant?: 'banner' | 'floating' | 'inline';
}

interface FloatingBadge {
  id: number;
  text: string;
  x: number;
}

export const BlogReactions: React.FC<BlogReactionsProps> = ({
  postSlug,
  postTitle,
  variant = 'banner'
}) => {
  const [reactions, setReactions] = useState<BlogReactionsData>({
    postSlug,
    claps: 0,
    insights: 0,
    hearts: 0,
    rockets: 0,
    totalReactions: 0
  });

  const [userCounts, setUserCounts] = useState<Record<string, number>>({
    claps: 0,
    insights: 0,
    hearts: 0,
    rockets: 0
  });

  const [floatingBadges, setFloatingBadges] = useState<FloatingBadge[]>([]);
  const [justReacted, setJustReacted] = useState<string | null>(null);

  // Subscribe to real-time reactions
  useEffect(() => {
    setUserCounts(getUserReactionCounts(postSlug));
    const unsubscribe = subscribeToBlogReactions(postSlug, (data) => {
      setReactions(data);
    });
    return () => unsubscribe();
  }, [postSlug]);

  const handleReact = async (type: 'claps' | 'insights' | 'hearts' | 'rockets', label: string) => {
    // Check max user reactions (50 for claps, 10 for others)
    const limit = type === 'claps' ? 50 : 10;
    const current = userCounts[type] || 0;
    if (current >= limit) return;

    // Optimistic UI updates
    setReactions((prev) => ({
      ...prev,
      [type]: (prev[type] || 0) + 1,
      totalReactions: prev.totalReactions + 1
    }));

    setUserCounts((prev) => ({
      ...prev,
      [type]: (prev[type] || 0) + 1
    }));

    setJustReacted(type);
    setTimeout(() => setJustReacted(null), 800);

    // Add floating badge
    const badgeId = Date.now() + Math.random();
    const randomX = (Math.random() - 0.5) * 40;
    setFloatingBadges((prev) => [...prev, { id: badgeId, text: '+1', x: randomX }]);
    setTimeout(() => {
      setFloatingBadges((prev) => prev.filter((b) => b.id !== badgeId));
    }, 1000);

    // Call service to write to Firestore
    await incrementBlogReaction(postSlug, type, 1);
  };

  const reactionButtons = [
    {
      id: 'claps' as const,
      label: 'Helpful',
      icon: ThumbsUp,
      emoji: '👏',
      count: reactions.claps,
      userCount: userCounts.claps || 0,
      color: 'hover:bg-amber-500/10 hover:text-amber-600 border-amber-500/20 text-amber-600',
      activeColor: 'bg-amber-500 text-white shadow-amber-500/30'
    },
    {
      id: 'insights' as const,
      label: 'Insightful',
      icon: Sparkles,
      emoji: '💡',
      count: reactions.insights,
      userCount: userCounts.insights || 0,
      color: 'hover:bg-blue-500/10 hover:text-blue-600 border-blue-500/20 text-blue-600',
      activeColor: 'bg-blue-500 text-white shadow-blue-500/30'
    },
    {
      id: 'hearts' as const,
      label: 'Love it',
      icon: Heart,
      emoji: '❤️',
      count: reactions.hearts,
      userCount: userCounts.hearts || 0,
      color: 'hover:bg-rose-500/10 hover:text-rose-600 border-rose-500/20 text-rose-600',
      activeColor: 'bg-rose-500 text-white shadow-rose-500/30'
    },
    {
      id: 'rockets' as const,
      label: 'Actionable',
      icon: Rocket,
      emoji: '🚀',
      count: reactions.rockets,
      userCount: userCounts.rockets || 0,
      color: 'hover:bg-emerald-500/10 hover:text-emerald-600 border-emerald-500/20 text-emerald-600',
      activeColor: 'bg-emerald-500 text-white shadow-emerald-500/30'
    }
  ];

  if (variant === 'floating') {
    return (
      <div className="fixed left-6 bottom-8 z-40 hidden xl:flex flex-col gap-3 p-3 bg-white/90 backdrop-blur-md rounded-full shadow-2xl border border-primary/10">
        {reactionButtons.map((btn) => (
          <button
            key={btn.id}
            onClick={() => handleReact(btn.id, btn.label)}
            title={`${btn.label} (${btn.count})`}
            className={`relative p-3 rounded-full flex flex-col items-center justify-center transition-all hover:scale-110 active:scale-95 ${
              btn.userCount > 0
                ? `${btn.activeColor} shadow-lg`
                : 'bg-primary/5 text-zinc-700 hover:bg-primary/10'
            }`}
          >
            <span className="text-base">{btn.emoji}</span>
            <span className="text-[10px] font-black tracking-tighter mt-0.5">
              {btn.count}
            </span>
          </button>
        ))}
      </div>
    );
  }

  return (
    <section className="relative my-12 p-8 sm:p-10 rounded-3xl bg-gradient-to-br from-zinc-50 via-white to-accent/5 border border-primary/10 shadow-lg shadow-primary/5">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 text-accent text-[11px] font-black uppercase tracking-wider mb-2">
            <Flame size={14} /> Real-Time Reader Feedback
          </div>
          <h4 className="text-xl sm:text-2xl font-display font-black text-primary uppercase">
            Was this strategy valuable?
          </h4>
          <p className="text-sm text-muted mt-1">
            Tap a reaction to let Hari know how this content helped you.
          </p>
        </div>

        {/* Reaction Pill Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 relative">
          {/* Floating animated badges */}
          <div className="absolute -top-8 left-1/2 -translate-x-1/2 pointer-events-none">
            <AnimatePresence>
              {floatingBadges.map((badge) => (
                <motion.span
                  key={badge.id}
                  initial={{ opacity: 1, y: 0, x: badge.x, scale: 0.8 }}
                  animate={{ opacity: 0, y: -45, scale: 1.3 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.8, ease: 'easeOut' }}
                  className="absolute bg-accent text-white font-black text-xs px-2.5 py-1 rounded-full shadow-lg"
                >
                  {badge.text}
                </motion.span>
              ))}
            </AnimatePresence>
          </div>

          {reactionButtons.map((btn) => {
            const hasReacted = btn.userCount > 0;
            return (
              <motion.button
                key={btn.id}
                whileTap={{ scale: 0.92 }}
                onClick={() => handleReact(btn.id, btn.label)}
                className={`group relative flex items-center gap-2.5 px-4 py-2.5 sm:px-5 sm:py-3 rounded-2xl text-xs font-black uppercase tracking-wider transition-all duration-200 border ${
                  hasReacted
                    ? `${btn.activeColor} shadow-md border-transparent scale-105`
                    : `bg-white ${btn.color} shadow-sm hover:shadow-md`
                }`}
              >
                <span className="text-base group-hover:scale-125 transition-transform">
                  {btn.emoji}
                </span>
                <span className="font-bold">{btn.label}</span>
                <span
                  className={`ml-1 px-2 py-0.5 rounded-full text-[10px] font-black ${
                    hasReacted ? 'bg-white/20 text-white' : 'bg-primary/5 text-primary'
                  }`}
                >
                  {btn.count}
                </span>
              </motion.button>
            );
          })}
        </div>
      </div>

      {reactions.totalReactions > 0 && (
        <div className="mt-6 pt-6 border-t border-primary/5 flex items-center justify-between text-xs text-muted">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-medium">
              <strong className="text-primary font-bold">{reactions.totalReactions}</strong> verified reader reactions on this article
            </span>
          </div>
          {Object.values(userCounts).some((c) => c > 0) && (
            <span className="inline-flex items-center gap-1 text-accent font-bold">
              <Check size={14} /> You gave {Object.values(userCounts).reduce((a, b) => a + b, 0)} reactions
            </span>
          )}
        </div>
      )}
    </section>
  );
};
