import { useState, useEffect, useCallback } from "react";
import { ContentHubItem } from "../types/content";
import { getPublishedContent } from "../services/contentService";
import { contentHubItems } from "../data/contentHubItems";

export interface UseContentResult {
  content: ContentHubItem[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

/**
 * Custom hook to fetch and manage published and public Content Hub items from Firestore
 * merged with static Content Hub items (Medium, Podcasts, Resources, etc.).
 */
export function useContent(): UseContentResult {
  const [content, setContent] = useState<ContentHubItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchContent = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const firestoreData = await getPublishedContent();

      // Normalize static items
      const staticData: ContentHubItem[] = contentHubItems.map(item => ({
        ...item,
        publishedDate: item.publishedDate ? new Date(item.publishedDate) : new Date(),
        status: item.status || "published",
        visibility: "public"
      }));

      // Combine Firestore data and static data without duplicates by title or ID
      const existingIds = new Set(firestoreData.map(i => i.id));
      const existingTitles = new Set(firestoreData.map(i => i.title.toLowerCase().trim()));

      const uniqueStatic = staticData.filter(
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
      console.error("Error loading content from Firestore, falling back to static items:", err);
      const fallbackStatic = contentHubItems.map(item => ({
        ...item,
        publishedDate: new Date(item.publishedDate)
      }));
      setContent(fallbackStatic);
      setError(err?.message || "Loaded offline static content.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchContent();
  }, [fetchContent]);

  return {
    content,
    loading,
    error,
    refetch: fetchContent
  };
}

