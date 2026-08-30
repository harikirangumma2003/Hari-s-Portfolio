import React, { useState, useEffect, useMemo } from 'react';
import { 
  Heart, 
  MessageSquare, 
  Send, 
  Trash2, 
  Pin, 
  ExternalLink, 
  Search, 
  Filter, 
  CornerDownRight, 
  ShieldCheck, 
  Sparkles, 
  ThumbsUp, 
  CheckCircle2, 
  Mail, 
  Bell, 
  RefreshCw, 
  TrendingUp, 
  Flame, 
  AlertCircle,
  Eye
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { 
  BlogCommentItem, 
  BlogReactionsData,
  subscribeToAllBlogComments, 
  subscribeToAllBlogReactions, 
  postBlogComment, 
  deleteBlogComment, 
  togglePinBlogComment,
  likeBlogComment
} from '../services/blogEngagementService';
import { blogPosts } from '../data/blogPosts';

interface EngagementDashboardProps {
  themeMode?: 'dark' | 'light';
  triggerToast?: (message: string, type?: 'success' | 'error' | 'info') => void;
}

export const EngagementDashboard: React.FC<EngagementDashboardProps> = ({
  themeMode = 'dark',
  triggerToast
}) => {
  const [comments, setComments] = useState<BlogCommentItem[]>([]);
  const [reactionsMap, setReactionsMap] = useState<Record<string, BlogReactionsData>>({});
  const [loading, setLoading] = useState(true);

  // Filter & Search
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedArticleSlug, setSelectedArticleSlug] = useState<string>('all');
  const [filterType, setFilterType] = useState<'all' | 'unreplied' | 'author' | 'pinned'>('all');

  // Quick Reply modal / inline state
  const [replyingCommentId, setReplyingCommentId] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState('');
  const [submittingReply, setSubmittingReply] = useState(false);

  // Subscribe to real-time comments & reactions across all blog articles
  useEffect(() => {
    setLoading(true);

    const unsubComments = subscribeToAllBlogComments((allComments) => {
      setComments(allComments);
      setLoading(false);
    });

    const unsubReactions = subscribeToAllBlogReactions((allReactions) => {
      const map: Record<string, BlogReactionsData> = {};
      allReactions.forEach((r) => {
        map[r.postSlug] = r;
      });
      setReactionsMap(map);
    });

    return () => {
      unsubComments();
      unsubReactions();
    };
  }, []);

  // Map slugs to article details
  const articleMap = useMemo(() => {
    const map: Record<string, { title: string; category?: string }> = {};
    blogPosts.forEach((art) => {
      map[art.slug] = {
        title: art.title,
        category: art.category
      };
    });
    return map;
  }, []);

  // Compute aggregated stats
  const totalStats = useMemo(() => {
    let totalClaps = 0;
    let totalInsights = 0;
    let totalHearts = 0;
    let totalRockets = 0;

    Object.values(reactionsMap).forEach((r) => {
      totalClaps += r.claps || 0;
      totalInsights += r.insights || 0;
      totalHearts += r.hearts || 0;
      totalRockets += r.rockets || 0;
    });

    const totalReactionsCount = totalClaps + totalInsights + totalHearts + totalRockets;
    const totalCommentsCount = comments.length;
    const authorRepliesCount = comments.filter((c) => c.isAuthor).length;
    const readerQuestionsCount = totalCommentsCount - authorRepliesCount;

    return {
      totalReactionsCount,
      totalClaps,
      totalInsights,
      totalHearts,
      totalRockets,
      totalCommentsCount,
      authorRepliesCount,
      readerQuestionsCount
    };
  }, [reactionsMap, comments]);

  // Handle posting reply from CMS as verified author
  const handleSendReply = async (parentComment: BlogCommentItem) => {
    if (!replyContent.trim()) {
      triggerToast?.('Please write a reply message.', 'error');
      return;
    }

    setSubmittingReply(true);
    try {
      await postBlogComment({
        postSlug: parentComment.postSlug,
        authorName: 'G. Hari Kiran',
        authorRole: 'Author & SEO Consultant',
        authorEmail: 'harikirangumma2003@gmail.com',
        content: replyContent.trim(),
        parentId: parentComment.id,
        isAuthor: true
      });

      setReplyContent('');
      setReplyingCommentId(null);
      triggerToast?.('Reply posted successfully as G. Hari Kiran!', 'success');
    } catch (err: any) {
      console.error(err);
      triggerToast?.('Failed to post reply: ' + err.message, 'error');
    } finally {
      setSubmittingReply(false);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    if (window.confirm('Permanently delete this comment?')) {
      try {
        await deleteBlogComment(commentId);
        triggerToast?.('Comment deleted.', 'info');
      } catch (err: any) {
        triggerToast?.('Delete failed: ' + err.message, 'error');
      }
    }
  };

  const handleTogglePin = async (commentId: string, currentPinned: boolean) => {
    try {
      await togglePinBlogComment(commentId, currentPinned);
      triggerToast?.(currentPinned ? 'Comment unpinned' : 'Comment pinned to top!', 'success');
    } catch (err: any) {
      triggerToast?.('Pin toggle failed: ' + err.message, 'error');
    }
  };

  // Group top-level comments and replies
  const { topLevelComments, repliesMap } = useMemo(() => {
    const top: BlogCommentItem[] = [];
    const rep: Record<string, BlogCommentItem[]> = {};

    comments.forEach((c) => {
      if (c.parentId) {
        if (!rep[c.parentId]) rep[c.parentId] = [];
        rep[c.parentId].push(c);
      } else {
        top.push(c);
      }
    });

    return { topLevelComments: top, repliesMap: rep };
  }, [comments]);

  // Filtered comments
  const filteredComments = useMemo(() => {
    let list = [...topLevelComments];

    if (selectedArticleSlug !== 'all') {
      list = list.filter((c) => c.postSlug === selectedArticleSlug);
    }

    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      list = list.filter(
        (c) =>
          c.authorName.toLowerCase().includes(q) ||
          c.content.toLowerCase().includes(q) ||
          (c.authorEmail && c.authorEmail.toLowerCase().includes(q)) ||
          (c.authorRole && c.authorRole.toLowerCase().includes(q))
      );
    }

    if (filterType === 'unreplied') {
      list = list.filter((c) => {
        const reps = repliesMap[c.id] || [];
        return !c.isAuthor && !reps.some((r) => r.isAuthor);
      });
    } else if (filterType === 'author') {
      list = list.filter((c) => c.isAuthor || (repliesMap[c.id] && repliesMap[c.id].some((r) => r.isAuthor)));
    } else if (filterType === 'pinned') {
      list = list.filter((c) => c.isPinned);
    }

    return list;
  }, [topLevelComments, repliesMap, selectedArticleSlug, searchTerm, filterType]);

  const isDark = themeMode === 'dark';

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Top Header & Overview Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 sm:p-8 rounded-3xl border bg-gradient-to-br from-accent/10 via-primary/5 to-transparent backdrop-blur-md">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/20 text-accent text-[11px] font-black uppercase tracking-wider mb-2">
            <Flame size={14} className="animate-pulse" /> Live Engagement Hub
          </div>
          <h2 className="text-2xl sm:text-3xl font-display font-black uppercase tracking-tight">
            Blog <span className="text-accent">Likes, Reactions & Community Q&A</span>
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1 max-w-2xl">
            Monitor real-time reader feedback, review multi-reactions (Claps, Insights, Hearts, Rockets), and reply to questions with your verified Author badge.
          </p>
        </div>

        {/* Live Notification Status Badge */}
        <div className="flex items-center gap-3 self-start md:self-auto bg-emerald-500/10 border border-emerald-500/20 px-4 py-3 rounded-2xl">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
          <div className="text-left">
            <p className="text-[10px] font-black uppercase text-emerald-400 tracking-wider">
              Instant Email Alerts Active
            </p>
            <p className="text-[9px] font-mono text-zinc-400">
              harikirangumma2003@gmail.com
            </p>
          </div>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Reactions */}
        <div className={`p-5 rounded-2xl border transition-all ${isDark ? 'bg-[#0e0e11] border-white/5' : 'bg-white border-zinc-200 shadow-sm'}`}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-black uppercase text-zinc-400">Total Reactions</span>
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center font-bold">
              👏
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-display font-black text-amber-500">
            {totalStats.totalReactionsCount}
          </p>
          <div className="flex items-center gap-2 mt-2 text-[10px] text-zinc-400">
            <span>💡 {totalStats.totalInsights}</span>
            <span>•</span>
            <span>❤️ {totalStats.totalHearts}</span>
            <span>•</span>
            <span>🚀 {totalStats.totalRockets}</span>
          </div>
        </div>

        {/* Total Comments */}
        <div className={`p-5 rounded-2xl border transition-all ${isDark ? 'bg-[#0e0e11] border-white/5' : 'bg-white border-zinc-200 shadow-sm'}`}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-black uppercase text-zinc-400">Reader Discussions</span>
            <div className="w-8 h-8 rounded-xl bg-accent/10 text-accent flex items-center justify-center">
              <MessageSquare size={16} />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-display font-black text-accent">
            {totalStats.totalCommentsCount}
          </p>
          <p className="text-[10px] text-zinc-400 mt-2">
            Across {ARTICLES.length} published articles
          </p>
        </div>

        {/* Reader Questions */}
        <div className={`p-5 rounded-2xl border transition-all ${isDark ? 'bg-[#0e0e11] border-white/5' : 'bg-white border-zinc-200 shadow-sm'}`}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-black uppercase text-zinc-400">Reader Inquiries</span>
            <div className="w-8 h-8 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center">
              <Mail size={16} />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-display font-black text-blue-400">
            {totalStats.readerQuestionsCount}
          </p>
          <p className="text-[10px] text-zinc-400 mt-2">
            Potential client leads & questions
          </p>
        </div>

        {/* Author Verified Replies */}
        <div className={`p-5 rounded-2xl border transition-all ${isDark ? 'bg-[#0e0e11] border-white/5' : 'bg-white border-zinc-200 shadow-sm'}`}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-black uppercase text-zinc-400">Hari's Responses</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
              <ShieldCheck size={16} />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-display font-black text-emerald-400">
            {totalStats.authorRepliesCount}
          </p>
          <p className="text-[10px] text-zinc-400 mt-2">
            Verified SEO expert replies
          </p>
        </div>
      </div>

      {/* ARTICLE-BY-ARTICLE ENGAGEMENT TABLE */}
      <div className={`p-6 sm:p-7 rounded-3xl border ${isDark ? 'bg-[#0c0c0e] border-white/5' : 'bg-white border-zinc-200 shadow-sm'}`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h3 className="text-lg font-display font-black uppercase tracking-tight flex items-center gap-2">
              <TrendingUp size={18} className="text-accent" /> Article Engagement Breakdown
            </h3>
            <p className="text-xs text-zinc-400 mt-0.5">
              Live reaction counts and comment tallies per published blog post
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className={`border-b ${isDark ? 'border-white/5 text-zinc-400' : 'border-zinc-200 text-zinc-500'} uppercase font-black tracking-wider text-[10px]`}>
                <th className="py-3 px-4">Article</th>
                <th className="py-3 px-3 text-center">👏 Helpful</th>
                <th className="py-3 px-3 text-center">💡 Insights</th>
                <th className="py-3 px-3 text-center">❤️ Hearts</th>
                <th className="py-3 px-3 text-center">🚀 Actionable</th>
                <th className="py-3 px-3 text-center">Total Reactions</th>
                <th className="py-3 px-3 text-center">Comments</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {blogPosts.map((art) => {
                const reactions = reactionsMap[art.slug] || { claps: 0, insights: 0, hearts: 0, rockets: 0, totalReactions: 0 };
                const articleCommentsCount = comments.filter((c) => c.postSlug === art.slug).length;

                return (
                  <tr key={art.slug} className={`hover:bg-white/[0.02] transition-colors ${selectedArticleSlug === art.slug ? 'bg-accent/5' : ''}`}>
                    <td className="py-3.5 px-4 max-w-xs sm:max-w-md">
                      <div className="font-bold line-clamp-1 text-zinc-200">
                        {art.title}
                      </div>
                      <div className="flex items-center gap-2 mt-0.5 text-[10px] text-zinc-400">
                        <span className="text-accent font-bold uppercase">{art.category}</span>
                        <span>•</span>
                        <span className="font-mono">/blog/{art.slug}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-3 text-center font-bold text-amber-400">
                      {reactions.claps || 0}
                    </td>
                    <td className="py-3.5 px-3 text-center font-bold text-blue-400">
                      {reactions.insights || 0}
                    </td>
                    <td className="py-3.5 px-3 text-center font-bold text-rose-400">
                      {reactions.hearts || 0}
                    </td>
                    <td className="py-3.5 px-3 text-center font-bold text-emerald-400">
                      {reactions.rockets || 0}
                    </td>
                    <td className="py-3.5 px-3 text-center">
                      <span className="px-2.5 py-1 rounded-full bg-accent/10 text-accent font-black text-[11px]">
                        {(reactions.claps || 0) + (reactions.insights || 0) + (reactions.hearts || 0) + (reactions.rockets || 0)}
                      </span>
                    </td>
                    <td className="py-3.5 px-3 text-center">
                      <span className="px-2.5 py-1 rounded-full bg-primary/10 text-zinc-300 font-bold text-[11px]">
                        {articleCommentsCount}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setSelectedArticleSlug(selectedArticleSlug === art.slug ? 'all' : art.slug)}
                          className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all ${
                            selectedArticleSlug === art.slug
                              ? 'bg-accent text-white'
                              : 'bg-white/5 hover:bg-white/10 text-zinc-300'
                          }`}
                        >
                          {selectedArticleSlug === art.slug ? 'Filtering' : 'View Comments'}
                        </button>
                        <Link
                          to={`/blog/${art.slug}`}
                          target="_blank"
                          className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white"
                          title="Open live article in new tab"
                        >
                          <ExternalLink size={14} />
                        </Link>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* COMMENTS MANAGEMENT & REPLY CENTER */}
      <div className={`p-6 sm:p-8 rounded-3xl border ${isDark ? 'bg-[#0c0c0e] border-white/5' : 'bg-white border-zinc-200 shadow-sm'}`}>
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-accent" />
              <h3 className="text-xl font-display font-black uppercase tracking-tight">
                Community Discussion & Reply Desk
              </h3>
            </div>
            <p className="text-xs text-zinc-400 mt-1">
              Read questions left by readers, reply directly as G. Hari Kiran, pin top discussions, or delete spam.
            </p>
          </div>

          {/* Quick Filters */}
          <div className="flex flex-wrap items-center gap-2.5">
            <div className="relative min-w-[200px]">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
              <input
                type="text"
                placeholder="Search comments or name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-white/5 border border-white/10 text-white placeholder-zinc-500 focus:outline-none focus:border-accent"
              />
            </div>

            <select
              value={selectedArticleSlug}
              onChange={(e) => setSelectedArticleSlug(e.target.value)}
              className="px-3 py-2 text-xs rounded-xl bg-white/5 border border-white/10 text-zinc-300 focus:outline-none focus:border-accent"
            >
              <option value="all" className="bg-zinc-900 text-white">All Articles ({blogPosts.length})</option>
              {blogPosts.map((a) => (
                <option key={a.slug} value={a.slug} className="bg-zinc-900 text-white">
                  {a.title.substring(0, 40)}...
                </option>
              ))}
            </select>

            <div className="flex items-center gap-1 bg-white/5 p-1 rounded-xl">
              <button
                onClick={() => setFilterType('all')}
                className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider ${
                  filterType === 'all' ? 'bg-accent text-white' : 'text-zinc-400 hover:text-white'
                }`}
              >
                All ({topLevelComments.length})
              </button>
              <button
                onClick={() => setFilterType('unreplied')}
                className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider ${
                  filterType === 'unreplied' ? 'bg-amber-500 text-white' : 'text-zinc-400 hover:text-white'
                }`}
              >
                Needs Reply
              </button>
              <button
                onClick={() => setFilterType('pinned')}
                className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider ${
                  filterType === 'pinned' ? 'bg-blue-500 text-white' : 'text-zinc-400 hover:text-white'
                }`}
              >
                Pinned
              </button>
            </div>
          </div>
        </div>

        {/* Selected Article Filter Alert */}
        {selectedArticleSlug !== 'all' && (
          <div className="mb-6 p-3.5 rounded-2xl bg-accent/10 border border-accent/20 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs text-accent font-bold">
              <span>Filtering comments for:</span>
              <strong className="text-white">
                {articleMap[selectedArticleSlug]?.title || selectedArticleSlug}
              </strong>
            </div>
            <button
              onClick={() => setSelectedArticleSlug('all')}
              className="text-[10px] font-black uppercase tracking-wider text-zinc-400 hover:text-white underline"
            >
              Clear Filter
            </button>
          </div>
        )}

        {/* Comments Feed */}
        {loading ? (
          <div className="py-16 text-center text-zinc-400 text-xs flex flex-col items-center gap-3">
            <RefreshCw className="w-6 h-6 animate-spin text-accent" />
            Loading real-time comments & discussion threads...
          </div>
        ) : filteredComments.length === 0 ? (
          <div className="py-16 px-6 text-center rounded-3xl border border-dashed border-white/10">
            <MessageSquare className="w-10 h-10 mx-auto text-zinc-500 mb-3 opacity-50" />
            <h4 className="text-sm font-black uppercase text-zinc-300 mb-1">
              No comments match this filter
            </h4>
            <p className="text-xs text-zinc-500">
              When readers leave comments or questions on your articles, they will appear here in real time.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredComments.map((comment) => {
              const replies = repliesMap[comment.id] || [];
              const article = articleMap[comment.postSlug];
              const isReplyingThis = replyingCommentId === comment.id;

              return (
                <div
                  key={comment.id}
                  className={`p-6 rounded-3xl border transition-all ${
                    comment.isPinned
                      ? 'bg-amber-500/5 border-amber-500/20'
                      : isDark
                      ? 'bg-[#111115] border-white/5'
                      : 'bg-zinc-50 border-zinc-200'
                  }`}
                >
                  {/* Article Reference Banner */}
                  <div className="flex items-center justify-between gap-3 mb-4 pb-3 border-b border-white/5">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-accent/10 text-accent shrink-0">
                        Article
                      </span>
                      <Link
                        to={`/blog/${comment.postSlug}`}
                        target="_blank"
                        className="text-xs font-bold text-zinc-300 hover:text-white truncate hover:underline"
                      >
                        {article?.title || comment.postSlug}
                      </Link>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-[10px] text-zinc-400 font-mono">
                        {new Date(comment.createdAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </span>
                      <Link
                        to={`/blog/${comment.postSlug}#comments-section`}
                        target="_blank"
                        className="p-1 rounded bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white"
                        title="View on live page"
                      >
                        <Eye size={12} />
                      </Link>
                    </div>
                  </div>

                  {/* Comment Author Header */}
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-9 h-9 rounded-2xl flex items-center justify-center font-black text-xs uppercase ${
                          comment.isAuthor ? 'bg-accent text-white' : 'bg-white/10 text-zinc-200'
                        }`}
                      >
                        {comment.isAuthor ? 'HK' : comment.authorName.substring(0, 2)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-xs font-black text-white">
                            {comment.authorName}
                          </span>
                          {comment.isAuthor && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-accent text-white text-[9px] font-black uppercase">
                              <ShieldCheck size={10} /> Author
                            </span>
                          )}
                          {comment.isPinned && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500 text-white text-[9px] font-black uppercase">
                              <Pin size={10} /> Pinned
                            </span>
                          )}
                        </div>
                        <div className="text-[10px] text-zinc-400 flex items-center gap-2 mt-0.5">
                          <span>{comment.authorRole || 'Reader'}</span>
                          {comment.authorEmail && (
                            <>
                              <span>•</span>
                              <span className="text-accent/80 font-mono">{comment.authorEmail}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Moderation Controls */}
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleTogglePin(comment.id, Boolean(comment.isPinned))}
                        className={`p-1.5 rounded-xl border text-xs transition-colors ${
                          comment.isPinned
                            ? 'bg-amber-500 text-white border-amber-500'
                            : 'bg-white/5 border-white/10 text-zinc-400 hover:text-white'
                        }`}
                        title={comment.isPinned ? 'Unpin' : 'Pin to top'}
                      >
                        <Pin size={13} />
                      </button>
                      <button
                        onClick={() => handleDeleteComment(comment.id)}
                        className="p-1.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500 hover:text-white transition-colors"
                        title="Delete comment"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>

                  {/* Comment Body */}
                  <div className="text-xs text-zinc-200 leading-relaxed whitespace-pre-line pl-1 sm:pl-12 mb-4 bg-white/[0.02] p-3 rounded-2xl border border-white/5">
                    {comment.content}
                  </div>

                  {/* Comment Action Footer */}
                  <div className="flex items-center justify-between pl-1 sm:pl-12 text-xs pt-1">
                    <div className="flex items-center gap-3">
                      <span className="text-[11px] text-zinc-400 flex items-center gap-1">
                        <ThumbsUp size={12} className="text-zinc-500" /> {comment.likes || 0} Helpful upvotes
                      </span>
                    </div>

                    <button
                      onClick={() => {
                        setReplyingCommentId(isReplyingThis ? null : comment.id);
                        setReplyContent('');
                      }}
                      className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-accent text-white text-[11px] font-black uppercase tracking-wider hover:bg-accent/90 transition-all shadow-md"
                    >
                      <CornerDownRight size={12} /> {isReplyingThis ? 'Cancel Reply' : 'Reply as Hari'}
                    </button>
                  </div>

                  {/* INLINE REPLY FORM */}
                  {isReplyingThis && (
                    <div className="mt-4 pt-4 border-t border-white/10 pl-1 sm:pl-12">
                      <div className="p-4 rounded-2xl bg-accent/10 border border-accent/20 space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-black uppercase tracking-wider text-accent flex items-center gap-1.5">
                            <ShieldCheck size={12} /> Replying officially as G. Hari Kiran (Author & SEO Consultant)
                          </span>
                        </div>
                        <textarea
                          rows={3}
                          value={replyContent}
                          onChange={(e) => setReplyContent(e.target.value)}
                          placeholder="Write your authoritative expert answer..."
                          className="w-full px-3.5 py-2.5 rounded-xl bg-[#0c0c0e] border border-accent/30 text-xs text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-accent"
                        />
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => setReplyingCommentId(null)}
                            className="px-3 py-1.5 text-xs text-zinc-400 hover:text-white"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={() => handleSendReply(comment)}
                            disabled={submittingReply}
                            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-accent text-white text-xs font-black uppercase tracking-wider hover:bg-accent/90 disabled:opacity-50"
                          >
                            {submittingReply ? (
                              'Publishing...'
                            ) : (
                              <>
                                <Send size={12} /> Post Official Reply
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* THREADED REPLIES STREAM */}
                  {replies.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-white/5 space-y-3 sm:ml-12 pl-4 border-l-2 border-accent/30">
                      {replies.map((reply) => (
                        <div
                          key={reply.id}
                          className={`p-3.5 rounded-2xl border ${
                            reply.isAuthor
                              ? 'bg-accent/10 border-accent/20'
                              : 'bg-white/5 border-white/5'
                          }`}
                        >
                          <div className="flex items-center justify-between gap-2 mb-1.5">
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-black text-white">
                                {reply.authorName}
                              </span>
                              {reply.isAuthor && (
                                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-accent text-white text-[8px] font-black uppercase">
                                  <ShieldCheck size={9} /> Author Reply
                                </span>
                              )}
                              <span className="text-[10px] text-zinc-400">
                                {new Date(reply.createdAt).toLocaleDateString('en-US', {
                                  month: 'short',
                                  day: 'numeric'
                                })}
                              </span>
                            </div>

                            <button
                              onClick={() => handleDeleteComment(reply.id)}
                              className="text-red-400 hover:text-red-300 p-1"
                              title="Delete reply"
                            >
                              <Trash2 size={12} />
                            </button>
                          </div>
                          <p className="text-xs text-zinc-200 leading-relaxed whitespace-pre-line">
                            {reply.content}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
