import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  MessageSquare,
  Send,
  ThumbsUp,
  Pin,
  ShieldCheck,
  CornerDownRight,
  Sparkles,
  HelpCircle,
  CheckCircle2,
  Trash2,
  Lock,
  UserCheck,
  AlertCircle
} from 'lucide-react';
import {
  BlogCommentItem,
  subscribeToBlogComments,
  postBlogComment,
  likeBlogComment,
  deleteBlogComment,
  togglePinBlogComment
} from '../services/blogEngagementService';

interface BlogCommentsProps {
  postSlug: string;
  postTitle: string;
}

export const BlogComments: React.FC<BlogCommentsProps> = ({ postSlug, postTitle }) => {
  const [comments, setComments] = useState<BlogCommentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'all' | 'author' | 'top'>('all');

  // Form State
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [email, setEmail] = useState('');
  const [content, setContent] = useState('');
  const [replyingTo, setReplyingTo] = useState<BlogCommentItem | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Author & Admin Mode
  const [isAuthorMode, setIsAuthorMode] = useState(false);
  const [authorPasscode, setAuthorPasscode] = useState('');
  const [showAuthorUnlock, setShowAuthorUnlock] = useState(false);

  // Load saved commenter details from localStorage
  useEffect(() => {
    try {
      const savedName = localStorage.getItem('blog_commenter_name');
      const savedRole = localStorage.getItem('blog_commenter_role');
      const savedEmail = localStorage.getItem('blog_commenter_email');
      const isSavedAuthor = localStorage.getItem('blog_author_unlocked') === 'true';

      if (savedName) setName(savedName);
      if (savedRole) setRole(savedRole);
      if (savedEmail) setEmail(savedEmail);
      if (isSavedAuthor) setIsAuthorMode(true);
    } catch {
      // ignore
    }
  }, []);

  // Real-time comments subscription
  useEffect(() => {
    setLoading(true);
    const unsubscribe = subscribeToBlogComments(postSlug, (items) => {
      setComments(items);
      setLoading(false);
    });
    return () => unsubscribe();
  }, [postSlug]);

  const handleUnlockAuthor = (e: React.FormEvent) => {
    e.preventDefault();
    if (authorPasscode.trim().toLowerCase() === 'hari2026' || authorPasscode.trim().toLowerCase() === 'admin') {
      setIsAuthorMode(true);
      setName('G. Hari Kiran');
      setRole('Author & SEO Consultant');
      setShowAuthorUnlock(false);
      localStorage.setItem('blog_author_unlocked', 'true');
    } else {
      alert('Invalid passcode. Use your administrator access.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !content.trim()) {
      setErrorMessage('Please provide your name and your question/comment.');
      return;
    }

    if (content.trim().length < 5) {
      setErrorMessage('Please enter at least 5 characters.');
      return;
    }

    setSubmitting(true);
    setErrorMessage('');

    try {
      // Save details to localStorage for future visits
      if (!isAuthorMode) {
        localStorage.setItem('blog_commenter_name', name.trim());
        localStorage.setItem('blog_commenter_role', role.trim());
        localStorage.setItem('blog_commenter_email', email.trim());
      }

      await postBlogComment({
        postSlug,
        authorName: isAuthorMode ? 'G. Hari Kiran' : name.trim(),
        authorRole: isAuthorMode ? 'Author & SEO Consultant' : (role.trim() || 'Reader'),
        authorEmail: email.trim(),
        content: content.trim(),
        parentId: replyingTo ? replyingTo.id : null,
        isAuthor: isAuthorMode
      });

      setContent('');
      setReplyingTo(null);
      setSuccessMessage(true);
      setTimeout(() => setSuccessMessage(false), 4000);
    } catch (err: any) {
      console.error(err);
      setErrorMessage('Failed to submit comment. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleLike = async (commentId: string) => {
    await likeBlogComment(commentId, postSlug);
  };

  const handleDelete = async (commentId: string) => {
    if (window.confirm('Delete this comment?')) {
      await deleteBlogComment(commentId);
    }
  };

  const handleTogglePin = async (commentId: string, currentPinned: boolean) => {
    await togglePinBlogComment(commentId, currentPinned);
  };

  // Group top-level comments and replies
  const { topLevelComments, repliesMap } = useMemo(() => {
    const topLevel: BlogCommentItem[] = [];
    const replies: Record<string, BlogCommentItem[]> = {};

    comments.forEach((c) => {
      if (c.parentId) {
        if (!replies[c.parentId]) replies[c.parentId] = [];
        replies[c.parentId].push(c);
      } else {
        topLevel.push(c);
      }
    });

    // Sort replies chronologically
    Object.keys(replies).forEach((k) => {
      replies[k].sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    });

    return { topLevelComments: topLevel, repliesMap: replies };
  }, [comments]);

  // Filtered comments
  const filteredComments = useMemo(() => {
    let list = [...topLevelComments];

    if (activeTab === 'author') {
      list = list.filter((c) => c.isAuthor || (repliesMap[c.id] && repliesMap[c.id].some((r) => r.isAuthor)));
    } else if (activeTab === 'top') {
      list.sort((a, b) => (b.likes || 0) - (a.likes || 0));
    }

    // Always sort pinned comments to top
    list.sort((a, b) => (b.isPinned ? 1 : 0) - (a.isPinned ? 1 : 0));

    return list;
  }, [topLevelComments, repliesMap, activeTab]);

  return (
    <section id="comments-section" className="mt-20 pt-12 border-t border-primary/10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/5 text-primary text-[11px] font-black uppercase tracking-wider mb-2">
            <MessageSquare size={14} className="text-accent" /> Community Q&A & Discussion
          </div>
          <h3 className="text-2xl sm:text-3xl font-display font-black uppercase text-primary">
            Discussion & <span className="text-accent">Insights</span> ({comments.length})
          </h3>
          <p className="text-sm text-muted mt-1">
            Have a question about this SEO strategy or want feedback on your site? Ask below.
          </p>
        </div>

        {/* Tab Filters */}
        <div className="flex items-center gap-2 bg-primary/5 p-1.5 rounded-2xl self-start md:self-auto">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${
              activeTab === 'all'
                ? 'bg-white text-primary shadow-sm'
                : 'text-muted hover:text-primary'
            }`}
          >
            All ({topLevelComments.length})
          </button>
          <button
            onClick={() => setActiveTab('author')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${
              activeTab === 'author'
                ? 'bg-white text-accent shadow-sm'
                : 'text-muted hover:text-primary'
            }`}
          >
            <ShieldCheck size={14} /> Answers by Hari
          </button>
          <button
            onClick={() => setActiveTab('top')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${
              activeTab === 'top'
                ? 'bg-white text-primary shadow-sm'
                : 'text-muted hover:text-primary'
            }`}
          >
            Most Helpful
          </button>
        </div>
      </div>

      {/* New Comment Submission Box */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-primary/10 shadow-xl shadow-primary/5 mb-12">
        {replyingTo && (
          <div className="mb-4 p-3 rounded-2xl bg-accent/5 border border-accent/20 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-bold text-accent">
              <CornerDownRight size={16} /> Replying to{' '}
              <span className="text-primary font-black">{replyingTo.authorName}</span>: "{replyingTo.content.substring(0, 50)}..."
            </div>
            <button
              onClick={() => setReplyingTo(null)}
              className="text-xs font-black text-muted hover:text-rose-500 underline"
            >
              Cancel Reply
            </button>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase tracking-widest text-primary flex items-center gap-1.5">
              <Sparkles size={14} className="text-accent" />
              {replyingTo ? 'Write your reply' : 'Ask a Question / Share Your Strategy'}
            </span>

            {/* Author Mode Toggle */}
            <div className="flex items-center gap-2">
              {isAuthorMode ? (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-accent text-white text-[10px] font-black uppercase tracking-widest">
                  <ShieldCheck size={12} /> Replying as Author (G. Hari Kiran)
                </span>
              ) : (
                <button
                  type="button"
                  onClick={() => setShowAuthorUnlock(!showAuthorUnlock)}
                  className="text-[10px] text-muted hover:text-accent font-bold uppercase tracking-widest flex items-center gap-1"
                >
                  <Lock size={12} /> Hari Login
                </button>
              )}
            </div>
          </div>

          {/* Author Passcode Modal Form */}
          {showAuthorUnlock && !isAuthorMode && (
            <div className="p-4 rounded-2xl bg-primary/5 border border-primary/10 flex flex-wrap items-center gap-3">
              <input
                type="password"
                placeholder="Enter admin passcode"
                value={authorPasscode}
                onChange={(e) => setAuthorPasscode(e.target.value)}
                className="px-3 py-1.5 text-xs rounded-xl border border-primary/10 bg-white"
              />
              <button
                type="button"
                onClick={handleUnlockAuthor}
                className="px-4 py-1.5 bg-primary text-white rounded-xl text-xs font-black uppercase"
              >
                Verify & Post as Author
              </button>
            </div>
          )}

          {!isAuthorMode && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <input
                  type="text"
                  required
                  placeholder="Your Name *"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl bg-zinc-50 border border-primary/10 text-sm focus:outline-none focus:ring-2 focus:ring-accent/20 focus:bg-white"
                />
              </div>
              <div>
                <input
                  type="text"
                  placeholder="Role / Company (e.g. SEO Manager)"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl bg-zinc-50 border border-primary/10 text-sm focus:outline-none focus:ring-2 focus:ring-accent/20 focus:bg-white"
                />
              </div>
              <div>
                <input
                  type="email"
                  placeholder="Email (Never displayed publicly)"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl bg-zinc-50 border border-primary/10 text-sm focus:outline-none focus:ring-2 focus:ring-accent/20 focus:bg-white"
                />
              </div>
            </div>
          )}

          <div>
            <textarea
              required
              rows={3}
              placeholder={
                isAuthorMode
                  ? 'Write your official verified author response...'
                  : 'Write your question or comment here (e.g. How would you handle this for an e-commerce store?)...'
              }
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl bg-zinc-50 border border-primary/10 text-sm focus:outline-none focus:ring-2 focus:ring-accent/20 focus:bg-white resize-y"
            />
          </div>

          {errorMessage && (
            <div className="flex items-center gap-2 text-xs font-bold text-rose-600">
              <AlertCircle size={14} /> {errorMessage}
            </div>
          )}

          {successMessage && (
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-600">
              <CheckCircle2 size={14} /> Comment published live! Thank you for participating.
            </div>
          )}

          <div className="flex items-center justify-between pt-2">
            <span className="text-[11px] text-muted">
              🛡️ Spam-protected. Constructive SEO & Growth insights are welcomed.
            </span>

            <button
              type="submit"
              disabled={submitting}
              className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-accent text-white text-xs font-black uppercase tracking-wider hover:bg-accent/90 active:scale-95 transition-all shadow-lg shadow-accent/20 disabled:opacity-50"
            >
              {submitting ? (
                'Publishing...'
              ) : (
                <>
                  <Send size={14} /> {replyingTo ? 'Post Reply' : 'Post Question / Comment'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Comments List */}
      {loading ? (
        <div className="py-12 text-center text-muted text-sm">
          Loading discussion thread...
        </div>
      ) : filteredComments.length === 0 ? (
        <div className="py-12 px-8 rounded-3xl bg-zinc-50 border border-primary/5 text-center">
          <HelpCircle size={36} className="mx-auto text-accent mb-3 opacity-60" />
          <h4 className="text-base font-display font-black uppercase text-primary mb-1">
            No questions yet on this article
          </h4>
          <p className="text-xs text-muted max-w-md mx-auto">
            Be the first to ask G. Hari Kiran a question about this growth framework or share your own observations.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {filteredComments.map((comment) => {
            const replies = repliesMap[comment.id] || [];
            return (
              <div
                key={comment.id}
                className={`p-6 sm:p-7 rounded-3xl border transition-all ${
                  comment.isPinned
                    ? 'bg-amber-500/5 border-amber-500/30 shadow-md'
                    : comment.isAuthor
                    ? 'bg-accent/5 border-accent/20'
                    : 'bg-white border-primary/10 shadow-sm'
                }`}
              >
                {/* Comment Header */}
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-2xl flex items-center justify-center font-black text-sm uppercase shadow-sm ${
                        comment.isAuthor
                          ? 'bg-accent text-white ring-2 ring-accent/30'
                          : 'bg-primary/5 text-primary'
                      }`}
                    >
                      {comment.isAuthor ? 'HK' : comment.authorName.substring(0, 2)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-black text-primary">
                          {comment.authorName}
                        </span>
                        {comment.isAuthor && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-accent text-white text-[9px] font-black uppercase tracking-wider">
                            <ShieldCheck size={10} /> Author
                          </span>
                        )}
                        {comment.isPinned && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500 text-white text-[9px] font-black uppercase tracking-wider">
                            <Pin size={10} /> Pinned
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-muted font-medium">
                        {comment.authorRole} • {new Date(comment.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </div>
                    </div>
                  </div>

                  {/* Admin actions if unlocked */}
                  {isAuthorMode && (
                    <div className="flex items-center gap-1 text-muted">
                      <button
                        onClick={() => handleTogglePin(comment.id, Boolean(comment.isPinned))}
                        className={`p-1.5 rounded-lg hover:bg-primary/5 ${
                          comment.isPinned ? 'text-amber-600' : ''
                        }`}
                        title="Pin this question"
                      >
                        <Pin size={14} />
                      </button>
                      <button
                        onClick={() => handleDelete(comment.id)}
                        className="p-1.5 rounded-lg hover:bg-rose-50 text-rose-500"
                        title="Delete comment"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  )}
                </div>

                {/* Comment Body */}
                <div className="text-sm text-zinc-800 leading-relaxed whitespace-pre-line pl-1 sm:pl-13 mb-4">
                  {comment.content}
                </div>

                {/* Comment Actions */}
                <div className="flex items-center gap-4 pl-1 sm:pl-13 text-xs">
                  <button
                    onClick={() => handleLike(comment.id)}
                    className="flex items-center gap-1.5 text-muted hover:text-accent font-bold transition-colors"
                  >
                    <ThumbsUp size={14} /> Helpful ({comment.likes || 0})
                  </button>

                  <button
                    onClick={() => {
                      setReplyingTo(comment);
                      document.getElementById('comments-section')?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="flex items-center gap-1.5 text-muted hover:text-primary font-bold transition-colors"
                  >
                    <CornerDownRight size={14} /> Reply
                  </button>
                </div>

                {/* Replies Stream */}
                {replies.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-primary/5 space-y-3 sm:ml-12 pl-4 border-l-2 border-primary/10">
                    {replies.map((reply) => (
                      <div
                        key={reply.id}
                        className={`p-4 rounded-2xl ${
                          reply.isAuthor
                            ? 'bg-accent/10 border border-accent/20'
                            : 'bg-zinc-50 border border-primary/5'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2 mb-1.5">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-black text-primary">
                              {reply.authorName}
                            </span>
                            {reply.isAuthor && (
                              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-accent text-white text-[8px] font-black uppercase">
                                <ShieldCheck size={10} /> Author
                              </span>
                            )}
                            <span className="text-[10px] text-muted">
                              {new Date(reply.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                            </span>
                          </div>
                          {isAuthorMode && (
                            <button
                              onClick={() => handleDelete(reply.id)}
                              className="text-rose-500 hover:opacity-80 p-1"
                            >
                              <Trash2 size={12} />
                            </button>
                          )}
                        </div>
                        <p className="text-xs text-zinc-800 leading-relaxed whitespace-pre-line">
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
    </section>
  );
};
