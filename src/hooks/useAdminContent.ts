import { useState, useEffect, useCallback } from "react";
import { ContentHubItem } from "../types/content";
import { 
  getAllContent, 
  createContent, 
  updateContent, 
  deleteContent,
  archiveContent,
  moveToTrash,
  restoreContent,
  deleteContentForever,
  publishContent,
  draftContent
} from "../services/contentService";

export interface UseAdminContentResult {
  items: ContentHubItem[];
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  addItem: (item: Omit<ContentHubItem, "id" | "publishedDate"> & { publishedDate: Date }) => Promise<string>;
  editItem: (id: string, item: Omit<ContentHubItem, "id" | "publishedDate"> & { publishedDate: Date }) => Promise<void>;
  removeItem: (id: string) => Promise<void>;
  archiveItem: (id: string) => Promise<void>;
  moveToTrashItem: (id: string) => Promise<void>;
  restoreItem: (id: string) => Promise<void>;
  deleteItemForever: (id: string) => Promise<void>;
  publishItem: (id: string) => Promise<void>;
  draftItem: (id: string) => Promise<void>;
}

export function useAdminContent(): UseAdminContentResult {
  const [items, setItems] = useState<ContentHubItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAllContent();
      setItems(data);
    } catch (err: any) {
      console.error("Failed to fetch admin content:", err);
      setError(err?.message || "Failed to load content from Firestore database.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const addItem = async (item: Omit<ContentHubItem, "id" | "publishedDate"> & { publishedDate: Date }): Promise<string> => {
    setError(null);
    try {
      const newId = await createContent(item);
      await fetchAll(); // Re-fetch to ensure sync with server
      return newId;
    } catch (err: any) {
      console.error("Failed to add item:", err);
      setError(err?.message || "Failed to create new item.");
      throw err;
    }
  };

  const editItem = async (id: string, item: Omit<ContentHubItem, "id" | "publishedDate"> & { publishedDate: Date }): Promise<void> => {
    setError(null);
    try {
      await updateContent(id, item);
      await fetchAll(); // Re-fetch to ensure sync with server
    } catch (err: any) {
      console.error("Failed to update item:", err);
      setError(err?.message || "Failed to update item.");
      throw err;
    }
  };

  const removeItem = async (id: string): Promise<void> => {
    setError(null);
    try {
      await deleteContent(id);
      await fetchAll(); // Re-fetch to ensure sync with server
    } catch (err: any) {
      console.error("Failed to delete item:", err);
      setError(err?.message || "Failed to delete item.");
      throw err;
    }
  };

  const archiveItem = async (id: string): Promise<void> => {
    setError(null);
    try {
      await archiveContent(id);
      await fetchAll();
    } catch (err: any) {
      console.error("Failed to archive item:", err);
      setError(err?.message || "Failed to archive item.");
      throw err;
    }
  };

  const moveToTrashItem = async (id: string): Promise<void> => {
    setError(null);
    try {
      await moveToTrash(id);
      await fetchAll();
    } catch (err: any) {
      console.error("Failed to move item to trash:", err);
      setError(err?.message || "Failed to move item to trash.");
      throw err;
    }
  };

  const restoreItem = async (id: string): Promise<void> => {
    setError(null);
    try {
      await restoreContent(id);
      await fetchAll();
    } catch (err: any) {
      console.error("Failed to restore item:", err);
      setError(err?.message || "Failed to restore item.");
      throw err;
    }
  };

  const deleteItemForever = async (id: string): Promise<void> => {
    setError(null);
    try {
      await deleteContentForever(id);
      await fetchAll();
    } catch (err: any) {
      console.error("Failed to permanently delete item:", err);
      setError(err?.message || "Failed to delete item forever.");
      throw err;
    }
  };

  const publishItem = async (id: string): Promise<void> => {
    setError(null);
    try {
      await publishContent(id);
      await fetchAll();
    } catch (err: any) {
      console.error("Failed to publish item:", err);
      setError(err?.message || "Failed to publish item.");
      throw err;
    }
  };

  const draftItem = async (id: string): Promise<void> => {
    setError(null);
    try {
      await draftContent(id);
      await fetchAll();
    } catch (err: any) {
      console.error("Failed to draft item:", err);
      setError(err?.message || "Failed to draft item.");
      throw err;
    }
  };

  return {
    items,
    loading,
    error,
    refresh: fetchAll,
    addItem,
    editItem,
    removeItem,
    archiveItem,
    moveToTrashItem,
    restoreItem,
    deleteItemForever,
    publishItem,
    draftItem
  };
}
