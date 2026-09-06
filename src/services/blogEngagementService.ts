import { 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc, 
  increment, 
  collection, 
  query, 
  where, 
  orderBy, 
  onSnapshot, 
  addDoc, 
  serverTimestamp, 
  deleteDoc
} from 'firebase/firestore';
import { db } from '../lib/firebase';

export interface BlogReactionsData {
  postSlug: string;
  claps: number;
  insights: number;
  hearts: number;
  rockets: number;
  totalReactions: number;
  updatedAt?: any;
}

export interface BlogCommentItem {
  id: string;
  postSlug: string;
  authorName: string;
  authorRole?: string;
  authorEmail?: string;
  content: string;
  parentId?: string | null;
  isAuthor?: boolean;
  isPinned?: boolean;
  likes: number;
  status: 'published' | 'pending' | 'hidden';
  createdAt: any;
}

// Local storage key for user's personal reactions
const getUserReactionsKey = (slug: string) => `blog_user_reactions_${slug}`;

export const getUserReactionCounts = (slug: string): Record<string, number> => {
  try {
    const raw = localStorage.getItem(getUserReactionsKey(slug));
    return raw ? JSON.parse(raw) : { claps: 0, insights: 0, hearts: 0, rockets: 0 };
  } catch {
    return { claps: 0, insights: 0, hearts: 0, rockets: 0 };
  }
};

export const saveUserReactionCounts = (slug: string, counts: Record<string, number>) => {
  try {
    localStorage.setItem(getUserReactionsKey(slug), JSON.stringify(counts));
  } catch (e) {
    console.error('Failed to save reactions to local storage', e);
  }
};

/**
 * Real-time listener for blog reactions on a single article
 */
export const subscribeToBlogReactions = (
  slug: string,
  callback: (data: BlogReactionsData) => void
) => {
  const docRef = doc(db, 'blog_reactions', slug);

  const defaultData: BlogReactionsData = {
    postSlug: slug,
    claps: 0,
    insights: 0,
    hearts: 0,
    rockets: 0,
    totalReactions: 0
  };

  return onSnapshot(docRef, (docSnap) => {
    if (docSnap.exists()) {
      const data = docSnap.data() as BlogReactionsData;
      callback({
        postSlug: slug,
        claps: data.claps || 0,
        insights: data.insights || 0,
        hearts: data.hearts || 0,
        rockets: data.rockets || 0,
        totalReactions: (data.claps || 0) + (data.insights || 0) + (data.hearts || 0) + (data.rockets || 0),
        updatedAt: data.updatedAt
      });
    } else {
      callback(defaultData);
    }
  }, (error) => {
    console.warn('Reactions subscription fallback to local cache:', error.message);
    callback(defaultData);
  });
};

/**
 * Real-time listener for all blog reactions across all articles (For CMS Dashboard)
 */
export const subscribeToAllBlogReactions = (
  callback: (reactions: BlogReactionsData[]) => void
) => {
  try {
    const reactionsRef = collection(db, 'blog_reactions');

    return onSnapshot(reactionsRef, (snapshot) => {
      const list: BlogReactionsData[] = snapshot.docs.map((docSnap) => {
        const d = docSnap.data();
        return {
          postSlug: docSnap.id,
          claps: Number(d.claps) || 0,
          insights: Number(d.insights) || 0,
          hearts: Number(d.hearts) || 0,
          rockets: Number(d.rockets) || 0,
          totalReactions: (Number(d.claps) || 0) + (Number(d.insights) || 0) + (Number(d.hearts) || 0) + (Number(d.rockets) || 0),
          updatedAt: d.updatedAt
        };
      });
      callback(list);
    }, (err) => {
      console.warn('All reactions subscription fallback:', err.message);
      callback([]);
    });
  } catch (err: any) {
    console.warn('Failed to initiate reactions listener:', err?.message);
    callback([]);
    return () => {};
  }
};

/**
 * Increment a specific reaction type (clap, insight, heart, rocket)
 */
export const incrementBlogReaction = async (
  slug: string,
  type: 'claps' | 'insights' | 'hearts' | 'rockets',
  amount = 1
) => {
  const docRef = doc(db, 'blog_reactions', slug);

  try {
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) {
      const initial: BlogReactionsData = {
        postSlug: slug,
        claps: type === 'claps' ? amount : 0,
        insights: type === 'insights' ? amount : 0,
        hearts: type === 'hearts' ? amount : 0,
        rockets: type === 'rockets' ? amount : 0,
        totalReactions: amount
      };
      await setDoc(docRef, initial);
    } else {
      await updateDoc(docRef, {
        [type]: increment(amount),
        totalReactions: increment(amount)
      });
    }

    // Update local user limits
    const currentLocal = getUserReactionCounts(slug);
    currentLocal[type] = (currentLocal[type] || 0) + amount;
    saveUserReactionCounts(slug, currentLocal);

    return true;
  } catch (error) {
    console.error('Error incrementing reaction:', error);
    // Still allow local counting so reader sees immediate response
    const currentLocal = getUserReactionCounts(slug);
    currentLocal[type] = (currentLocal[type] || 0) + amount;
    saveUserReactionCounts(slug, currentLocal);
    return false;
  }
};

/**
 * Subscribe to comments for a specific blog post
 */
export const subscribeToBlogComments = (
  slug: string,
  callback: (comments: BlogCommentItem[]) => void
) => {
  const commentsRef = collection(db, 'blog_comments');
  const q = query(
    commentsRef,
    where('postSlug', '==', slug),
    orderBy('createdAt', 'desc')
  );

  return onSnapshot(q, (snapshot) => {
    const items: BlogCommentItem[] = snapshot.docs.map((docSnap) => {
      const d = docSnap.data();
      return {
        id: docSnap.id,
        postSlug: d.postSlug,
        authorName: d.authorName,
        authorRole: d.authorRole || 'Reader',
        authorEmail: d.authorEmail || '',
        content: d.content,
        parentId: d.parentId || null,
        isAuthor: d.isAuthor || false,
        isPinned: d.isPinned || false,
        likes: d.likes || 0,
        status: d.status || 'published',
        createdAt: d.createdAt ? (d.createdAt.toDate ? d.createdAt.toDate().toISOString() : d.createdAt) : new Date().toISOString()
      };
    }).filter(item => item.status !== 'hidden');

    callback(items);
  }, (error) => {
    console.warn('Comments subscription fallback:', error.message);
    try {
      const cached = localStorage.getItem(`blog_comments_cache_${slug}`);
      if (cached) {
        callback(JSON.parse(cached));
      } else {
        callback([]);
      }
    } catch {
      callback([]);
    }
  });
};

/**
 * Subscribe to ALL blog comments across all articles (For CMS Engagement Tab)
 */
export const subscribeToAllBlogComments = (
  callback: (comments: BlogCommentItem[]) => void
) => {
  try {
    const commentsRef = collection(db, 'blog_comments');
    const q = query(
      commentsRef,
      orderBy('createdAt', 'desc')
    );

    return onSnapshot(q, (snapshot) => {
      const items: BlogCommentItem[] = snapshot.docs.map((docSnap) => {
        const d = docSnap.data();
        return {
          id: docSnap.id,
          postSlug: d.postSlug || '',
          authorName: d.authorName || 'Anonymous',
          authorRole: d.authorRole || 'Reader',
          authorEmail: d.authorEmail || '',
          content: d.content || '',
          parentId: d.parentId || null,
          isAuthor: Boolean(d.isAuthor),
          isPinned: Boolean(d.isPinned),
          likes: Number(d.likes) || 0,
          status: d.status || 'published',
          createdAt: d.createdAt ? (d.createdAt.toDate ? d.createdAt.toDate().toISOString() : d.createdAt) : new Date().toISOString()
        };
      }).filter(item => item.status !== 'hidden');

      callback(items);
    }, (err) => {
      console.warn('All comments subscription fallback:', err.message);
      try {
        const cachedList: BlogCommentItem[] = [];
        if (typeof window !== 'undefined' && window.localStorage) {
          for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key && key.startsWith('blog_comments_cache_')) {
              const raw = localStorage.getItem(key);
              if (raw) {
                const parsed = JSON.parse(raw);
                if (Array.isArray(parsed)) {
                  cachedList.push(...parsed);
                }
              }
            }
          }
        }
        callback(cachedList);
      } catch {
        callback([]);
      }
    });
  } catch (err: any) {
    console.warn('Failed to initiate all comments listener:', err?.message);
    callback([]);
    return () => {};
  }
};

/**
 * Post a new comment or reader question, and trigger instant email notification
 */
export const postBlogComment = async (
  comment: Omit<BlogCommentItem, 'id' | 'createdAt' | 'likes' | 'status'> & { isAuthor?: boolean }
): Promise<string | null> => {
  try {
    const commentsRef = collection(db, 'blog_comments');
    const docData = {
      postSlug: comment.postSlug,
      authorName: comment.authorName.trim(),
      authorRole: comment.authorRole?.trim() || 'SEO Reader',
      authorEmail: comment.authorEmail?.trim() || '',
      content: comment.content.trim(),
      parentId: comment.parentId || null,
      isAuthor: Boolean(comment.isAuthor),
      isPinned: false,
      likes: 0,
      status: 'published',
      createdAt: serverTimestamp()
    };

    const docRef = await addDoc(commentsRef, docData);

    // Cache locally
    try {
      const cacheKey = `blog_comments_cache_${comment.postSlug}`;
      const existing = JSON.parse(localStorage.getItem(cacheKey) || '[]');
      const newComment: BlogCommentItem = {
        ...comment,
        id: docRef.id,
        likes: 0,
        status: 'published',
        createdAt: new Date().toISOString()
      };
      localStorage.setItem(cacheKey, JSON.stringify([newComment, ...existing]));
    } catch (e) {
      console.warn('Local comment cache update error', e);
    }

    // Trigger instant email notification to harikirangumma2003@gmail.com if it's a reader comment
    if (!comment.isAuthor) {
      triggerCommentNotificationEmail({
        postSlug: comment.postSlug,
        authorName: comment.authorName,
        authorRole: comment.authorRole,
        authorEmail: comment.authorEmail,
        content: comment.content,
        parentId: comment.parentId
      }).catch((emailErr) => {
        console.warn('Comment notification email dispatch notice:', emailErr);
      });
    }

    return docRef.id;
  } catch (error) {
    console.error('Error posting comment:', error);
    throw error;
  }
};

/**
 * Send Instant Email Alert to Hari via server-side /api/notifications/comment endpoint
 */
export async function triggerCommentNotificationEmail(payload: {
  postSlug: string;
  authorName: string;
  authorRole?: string;
  authorEmail?: string;
  content: string;
  parentId?: string | null;
}) {
  try {
    await fetch('/api/notifications/comment', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
  } catch (err) {
    console.warn('Failed to send comment notification email:', err);
  }
}

/**
 * Like a comment
 */
export const likeBlogComment = async (commentId: string, postSlug: string) => {
  try {
    const likedCommentsKey = `liked_comments_${postSlug}`;
    const liked = JSON.parse(localStorage.getItem(likedCommentsKey) || '[]');
    if (liked.includes(commentId)) {
      return false; // already liked
    }

    const docRef = doc(db, 'blog_comments', commentId);
    await updateDoc(docRef, {
      likes: increment(1)
    });

    liked.push(commentId);
    localStorage.setItem(likedCommentsKey, JSON.stringify(liked));
    return true;
  } catch (error) {
    console.error('Error liking comment:', error);
    return false;
  }
};

/**
 * Delete / Moderate comment (Admin only)
 */
export const deleteBlogComment = async (commentId: string) => {
  try {
    const docRef = doc(db, 'blog_comments', commentId);
    await deleteDoc(docRef);
    return true;
  } catch (error) {
    console.error('Error deleting comment:', error);
    return false;
  }
};

/**
 * Toggle pin status for important Q&A (Admin only)
 */
export const togglePinBlogComment = async (commentId: string, currentPinned: boolean) => {
  try {
    const docRef = doc(db, 'blog_comments', commentId);
    await updateDoc(docRef, {
      isPinned: !currentPinned
    });
    return true;
  } catch (error) {
    console.error('Error toggling pin on comment:', error);
    return false;
  }
};
