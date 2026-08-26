import { useState, useEffect, useCallback } from "react";
import { ContentHubItem } from "../types/content";
import { contentHubItems } from "../data/contentHubItems";

export interface UseContentResult {
  content: ContentHubItem[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

// Pre-normalize static items once to avoid re-computation and layout shifts
const initialStaticData: ContentHubItem[] = contentHubItems.map(item => ({
  ...item,
  publishedDate: item.publishedDate ? new Date(item.publishedDate) : new Date(),
  status: item.status || "published",
  visibility: "public"
}));

/**
 * Custom hook to fetch and manage Content Hub items.
 * Starts with instant static content for 0ms First Paint, 0 CLS, and 0 initial Firebase JS bundle overhead.
 * Lazily synchronizes with Firestore in the background when network is idle.
 */
export function useContent(): UseContentResult {
  const [content, setContent] = useState<ContentHubItem[]>(initialStaticData);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchContent = useCallback(async () => {
    try {
      // Dynamic import ensures Firebase is NOT included in the critical initial JS bundle
      const { getPublishedContent } = await import("../services/contentService");
      const firestoreData = await getPublishedContent();

      if (!firestoreData || firestoreData.length === 0) {
        return;
      }

      // Combine Firestore data and static data without duplicates by title or ID
      const existingIds = new Set(firestoreData.map(i => i.id));
      const existingTitles = new Set(firestoreData.map(i => i.title.toLowerCase().trim()));

      const uniqueStatic = initialStaticData.filter(
        item => !existingIds.has(item.id) && !existingTitles.has(item.title.toLowerCase().trim())
      );

      const combined = [...firestoreData, ...uniqueStatic].sort((a, b) => {
        if (a.featured && !b.featured) return -1;
        if (!a.featured && b.featured) return 1;
        const timeA = a.publishedDate instanceof Date ? a.publishedDate.getTime() : new Date(a.publishedDate || 0).getTime();
        const timeB = b.publishedDate instanceof Date ? b.publishedDate.getTime() : new Date(b.publishedDate || 0).getTime();
        return timeB - timeA;
      });

      setContent(combined);
    } catch (err: any) {
      // Gracefully silent fallback to static content if offline or in preview
      setError(err?.message || null);
    }
  }, []);

  useEffect(() => {
    // Schedule background synchronization when browser is idle to avoid main-thread blocking
    if (typeof window !== "undefined" && "requestIdleCallback" in window) {
      const handle = (window as any).requestIdleCallback(() => {
        fetchContent();
      }, { timeout: 2000 });
      return () => (window as any).cancelIdleCallback(handle);
    } else {
      const timer = setTimeout(() => {
        fetchContent();
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [fetchContent]);

  return {
    content,
    loading,
    error,
    refetch: fetchContent
  };
}


