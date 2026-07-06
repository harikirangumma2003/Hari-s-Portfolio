import { useState, useEffect, useCallback } from "react";
import { ContentHubItem } from "../types/content";
import { getPublishedContent } from "../services/contentService";

export interface UseContentResult {
  content: ContentHubItem[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

/**
 * Custom hook to fetch and manage published and public Content Hub items from Firestore.
 */
export function useContent(): UseContentResult {
  const [content, setContent] = useState<ContentHubItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchContent = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getPublishedContent();
      setContent(data);
    } catch (err: any) {
      console.error("Error loading content from Firestore:", err);
      setError(err?.message || "Failed to load content from database.");
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
