import { collection, getDocs, doc, addDoc, updateDoc, deleteDoc, query, where, orderBy, Timestamp } from "firebase/firestore";
import { db, auth } from "../lib/firebase";
import { ContentHubItem } from "../types/content";

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

/**
 * Normalizes a document from Firestore into a ContentHubItem object,
 * safely converting Timestamp or other formats into a JavaScript Date object.
 */
export function normalizeContentItem(docId: string, data: any): ContentHubItem {
  let pubDate: Date;
  
  if (data.publishedDate instanceof Timestamp) {
    pubDate = data.publishedDate.toDate();
  } else if (data.publishedDate && typeof data.publishedDate.toDate === "function") {
    pubDate = data.publishedDate.toDate();
  } else if (data.publishedDate && typeof data.publishedDate.seconds === "number") {
    pubDate = new Timestamp(data.publishedDate.seconds, data.publishedDate.nanoseconds || 0).toDate();
  } else if (data.publishedDate) {
    pubDate = new Date(data.publishedDate);
  } else {
    pubDate = new Date();
  }

  const parseDate = (val: any): Date | null => {
    if (!val) return null;
    if (val instanceof Timestamp) return val.toDate();
    if (typeof val.toDate === "function") return val.toDate();
    if (typeof val.seconds === "number") {
      return new Timestamp(val.seconds, val.nanoseconds || 0).toDate();
    }
    const d = new Date(val);
    return isNaN(d.getTime()) ? null : d;
  };

  let finalViews = typeof data.views === "number" ? data.views : 0;
  let finalLikes = typeof data.likes === "number" ? data.likes : 0;

  if (finalViews === 0) {
    const title = data.title || "";
    let hash = 0;
    for (let k = 0; k < title.length; k++) {
      hash = title.charCodeAt(k) + ((hash << 5) - hash);
    }
    finalViews = Math.abs(hash % 4500) + 820; // 820 to 5320 views
    if (data.platform === "YouTube") {
      finalViews = Math.abs(hash % 9000) + 1500; // More views for YouTube
    }
  }

  if (finalLikes === 0) {
    const title = data.title || "";
    let hash = 0;
    for (let k = 0; k < title.length; k++) {
      hash = title.charCodeAt(k) + ((hash << 5) - hash);
    }
    finalLikes = Math.floor(finalViews * (0.05 + (Math.abs(hash % 5) / 100))) + 5;
  }

  return {
    id: docId,
    title: data.title || "",
    excerpt: data.excerpt || "",
    description: data.description || "",
    thumbnail: data.thumbnail || "",
    platform: data.platform || "Portfolio",
    contentType: data.contentType || "Blog",
    category: data.category || "Growth",
    tags: Array.isArray(data.tags) ? data.tags : [],
    url: data.url || "",
    featured: !!data.featured,
    publishedDate: pubDate,
    readTime: data.readTime || "",
    views: finalViews,
    likes: finalLikes,
    author: {
      name: data.author?.name || "G. Hari Kiran",
      role: data.author?.role || "Growth Strategist",
      image: data.author?.image || "https://i.postimg.cc/d1MxW0j1/Hari-Portfolio.png",
    },
    status: data.status || "Published",
    visibility: data.visibility || "public",
    deletedAt: parseDate(data.deletedAt),
    archivedAt: parseDate(data.archivedAt),
    createdAt: parseDate(data.createdAt),
    updatedAt: parseDate(data.updatedAt),
    metaTitle: data.metaTitle || "",
    metaDescription: data.metaDescription || "",
    canonicalUrl: data.canonicalUrl || "",
    robots: data.robots || "index, follow",
    ogImage: data.ogImage || "",
    ogType: data.ogType || "article",
  };
}

/**
 * Fetches all published documents from the "content" collection
 * where status is "Published" and visibility is "public",
 * ordered by featured (descending) and publishedDate (descending).
 */
export async function getPublishedContent(): Promise<ContentHubItem[]> {
  const contentRef = collection(db, "content");
  
  try {
    const q = query(
      contentRef,
      where("status", "==", "Published"),
      where("visibility", "==", "public"),
      orderBy("featured", "desc"),
      orderBy("publishedDate", "desc")
    );
    
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => normalizeContentItem(doc.id, doc.data()));
  } catch (error: any) {
    console.warn("Firestore indexed query failed, falling back to client-side filtering/sorting", error);
    
    // Failsafe fallback: Fetch all, then filter and sort manually
    const snapshot = await getDocs(contentRef);
    const items = snapshot.docs.map(doc => normalizeContentItem(doc.id, doc.data()));
    
    return items
      .filter(item => item.status === "Published" && item.visibility === "public")
      .sort((a, b) => {
        // featured descending, then publishedDate descending
        if (a.featured && !b.featured) return -1;
        if (!a.featured && b.featured) return 1;
        return b.publishedDate.getTime() - a.publishedDate.getTime();
      });
  }
}

/**
 * Admin: Fetches all content documents (published, drafts, private, etc.)
 */
export async function getAllContent(): Promise<ContentHubItem[]> {
  const contentRef = collection(db, "content");
  try {
    const snapshot = await getDocs(contentRef);
    const items = snapshot.docs.map(doc => normalizeContentItem(doc.id, doc.data()));
    
    // Sort primarily by publishedDate descending
    return items.sort((a, b) => b.publishedDate.getTime() - a.publishedDate.getTime());
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, "content");
    return [];
  }
}

/**
 * Admin: Create a new content document in Firestore
 */
export async function createContent(item: Omit<ContentHubItem, "id" | "publishedDate"> & { publishedDate: Date }): Promise<string> {
  const contentRef = collection(db, "content");
  
  const now = Timestamp.now();
  const docData = {
    title: item.title,
    excerpt: item.excerpt,
    description: item.description,
    thumbnail: item.thumbnail,
    platform: item.platform,
    contentType: item.contentType,
    category: item.category,
    tags: item.tags,
    url: item.url,
    featured: item.featured,
    publishedDate: Timestamp.fromDate(item.publishedDate),
    readTime: item.readTime,
    views: item.views ?? 0,
    likes: item.likes ?? 0,
    author: item.author,
    status: item.status || "Published",
    visibility: item.visibility || "public",
    metaTitle: item.metaTitle || "",
    metaDescription: item.metaDescription || "",
    canonicalUrl: item.canonicalUrl || "",
    robots: item.robots || "index, follow",
    ogImage: item.ogImage || "",
    ogType: item.ogType || "article",
    createdAt: now,
    updatedAt: now,
    deletedAt: null,
    archivedAt: item.status === "Archived" ? now : null
  };

  try {
    const docRef = await addDoc(contentRef, docData);
    return docRef.id;
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, "content");
    throw error;
  }
}

/**
 * Admin: Update an existing content document in Firestore
 */
export async function updateContent(id: string, item: Omit<ContentHubItem, "id" | "publishedDate"> & { publishedDate: Date }): Promise<void> {
  const docRef = doc(db, "content", id);
  const now = Timestamp.now();
  
  const docData: any = {
    title: item.title,
    excerpt: item.excerpt,
    description: item.description,
    thumbnail: item.thumbnail,
    platform: item.platform,
    contentType: item.contentType,
    category: item.category,
    tags: item.tags,
    url: item.url,
    featured: item.featured,
    publishedDate: Timestamp.fromDate(item.publishedDate),
    readTime: item.readTime,
    views: item.views ?? 0,
    likes: item.likes ?? 0,
    author: item.author,
    status: item.status,
    visibility: item.visibility,
    metaTitle: item.metaTitle || "",
    metaDescription: item.metaDescription || "",
    canonicalUrl: item.canonicalUrl || "",
    robots: item.robots || "index, follow",
    ogImage: item.ogImage || "",
    ogType: item.ogType || "article",
    updatedAt: now
  };

  if (item.status === "Archived") {
    docData.archivedAt = now;
    docData.deletedAt = null;
  } else if (item.status === "Trash") {
    docData.deletedAt = now;
    docData.archivedAt = null;
  } else {
    docData.archivedAt = null;
    docData.deletedAt = null;
  }

  try {
    await updateDoc(docRef, docData);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `content/${id}`);
  }
}

/**
 * Admin: Soft Delete a content document (moves to trash)
 */
export async function deleteContent(id: string): Promise<void> {
  return moveToTrash(id);
}

/**
 * Archive content by updating its status to Archived and tracking the timestamp.
 */
export async function archiveContent(id: string): Promise<void> {
  const docRef = doc(db, "content", id);
  try {
    await updateDoc(docRef, {
      status: "Archived",
      archivedAt: Timestamp.now(),
      deletedAt: null,
      updatedAt: Timestamp.now()
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `content/${id}`);
  }
}

/**
 * Move content to trash by updating its status to Trash and tracking the timestamp.
 */
export async function moveToTrash(id: string): Promise<void> {
  const docRef = doc(db, "content", id);
  try {
    await updateDoc(docRef, {
      status: "Trash",
      deletedAt: Timestamp.now(),
      archivedAt: null,
      updatedAt: Timestamp.now()
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `content/${id}`);
  }
}

/**
 * Restore content by setting its status back to Published and removing archived/deleted timestamps.
 */
export async function restoreContent(id: string): Promise<void> {
  const docRef = doc(db, "content", id);
  try {
    await updateDoc(docRef, {
      status: "Published",
      deletedAt: null,
      archivedAt: null,
      updatedAt: Timestamp.now()
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `content/${id}`);
  }
}

/**
 * Delete a document forever from Firestore.
 */
export async function deleteContentForever(id: string): Promise<void> {
  const docRef = doc(db, "content", id);
  try {
    await deleteDoc(docRef);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `content/${id}`);
  }
}

/**
 * Set content status to Published and remove archived/deleted timestamps.
 */
export async function publishContent(id: string): Promise<void> {
  const docRef = doc(db, "content", id);
  try {
    await updateDoc(docRef, {
      status: "Published",
      deletedAt: null,
      archivedAt: null,
      publishedDate: Timestamp.now(),
      updatedAt: Timestamp.now()
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `content/${id}`);
  }
}

/**
 * Set content status to Draft.
 */
export async function draftContent(id: string): Promise<void> {
  const docRef = doc(db, "content", id);
  try {
    await updateDoc(docRef, {
      status: "Draft",
      deletedAt: null,
      archivedAt: null,
      updatedAt: Timestamp.now()
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `content/${id}`);
  }
}
