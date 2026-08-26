import React, { useState, useMemo, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { 
  LayoutDashboard, 
  FileText, 
  PlusCircle, 
  Settings, 
  LogOut, 
  Sun, 
  Moon, 
  Search, 
  Filter, 
  ArrowUpDown, 
  ChevronLeft, 
  ChevronRight, 
  Trash2, 
  Edit, 
  Eye, 
  UploadCloud, 
  Globe, 
  User as UserIcon, 
  Calendar, 
  Sparkles, 
  CheckCircle, 
  AlertCircle, 
  Info, 
  BookOpen, 
  Tag, 
  ExternalLink,
  ChevronDown,
  X,
  Lock,
  Archive,
  RotateCcw,
  RefreshCw,
  PenTool
} from "lucide-react";
import { useAdminAuth } from "../hooks/useAdminAuth";
import { useAdminContent } from "../hooks/useAdminContent";
import { ContentHubItem, FirestoreAuthor } from "../types/content";
import { uploadImage } from "../services/storageService";
import { cn } from "../lib/utils";
import AutomationSection from "../components/AutomationSection";
import { BlogWriterSection } from "../components/BlogWriterSection";

// Types for Toast Notifications
interface Toast {
  id: string;
  type: "success" | "error" | "info";
  message: string;
}

export default function AdminCMSPage() {
  const { user, loading: authLoading, error: authError, login, logout, registerTemp } = useAdminAuth();
  const { 
    items, 
    loading: contentLoading, 
    error: contentError, 
    addItem, 
    editItem, 
    removeItem,
    archiveItem,
    moveToTrashItem,
    restoreItem,
    deleteItemForever,
    publishItem,
    draftItem,
    refresh
  } = useAdminContent();

  const location = useLocation();
  const navigate = useNavigate();

  // CMS Views: "dashboard" | "list" | "form" | "trash" | "archived" | "automation" | "blog-writer"
  const [activeTab, setActiveTab] = useState<"dashboard" | "list" | "form" | "trash" | "archived" | "automation" | "blog-writer">("dashboard");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [previewItem, setPreviewItem] = useState<ContentHubItem | null>(null);

  // Authentication states
  const [authEmail, setAuthEmail] = useState("");
  const [authPassword, setAuthPassword] = useState("");
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [authFormLoading, setAuthFormLoading] = useState(false);

  // Custom Toast System
  const [toasts, setToasts] = useState<Toast[]>([]);
  const triggerToast = (message: string, type: "success" | "error" | "info" = "success") => {
    const id = Date.now().toString();
    setToasts(prev => [...prev, { id, type, message }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 5000);
  };

  // Dark & Light Mode local state for CMS UI
  const [themeMode, setThemeMode] = useState<"dark" | "light">("dark");

  // Content Filtering, Search, Sorting & Pagination
  const [searchQuery, setSearchQuery] = useState("");
  const [platformFilter, setPlatformFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [contentTypeFilter, setContentTypeFilter] = useState("All");
  const [authorFilter, setAuthorFilter] = useState("All");
  const [sortBy, setSortBy] = useState<"newest" | "oldest" | "title" | "views" | "likes">("newest");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Selected item IDs for Bulk Actions
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Reusable Elegant Confirmation Modal State
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void | Promise<void>;
    confirmButtonText?: string;
    variant?: "danger" | "warning" | "info";
  }>({
    isOpen: false,
    title: "",
    message: "",
    onConfirm: () => {},
    confirmButtonText: "Confirm",
    variant: "info"
  });

  const triggerConfirm = (
    title: string,
    message: string,
    onConfirm: () => void | Promise<void>,
    confirmButtonText = "Confirm",
    variant: "danger" | "warning" | "info" = "info"
  ) => {
    setConfirmModal({
      isOpen: true,
      title,
      message,
      onConfirm: async () => {
        try {
          await onConfirm();
        } catch (err: any) {
          triggerToast("Action failed: " + err.message, "error");
        } finally {
          setConfirmModal(prev => ({ ...prev, isOpen: false }));
        }
      },
      confirmButtonText,
      variant
    });
  };

  // Sync activeTab with pathname
  useEffect(() => {
    if (location.pathname === "/admin/content/trash") {
      setActiveTab("trash");
    } else if (location.pathname === "/admin") {
      if (activeTab === "trash") {
        setActiveTab("dashboard");
      }
    }
  }, [location.pathname]);

  // Clear selected elements when filters/pages change to prevent background mutation issues
  useEffect(() => {
    setSelectedIds([]);
  }, [platformFilter, statusFilter, categoryFilter, contentTypeFilter, authorFilter, searchQuery, currentPage, sortBy]);

  // Form input states
  const [formTitle, setFormTitle] = useState("");
  const [formExcerpt, setFormExcerpt] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formThumbnail, setFormThumbnail] = useState("");
  const [formPlatform, setFormPlatform] = useState<ContentHubItem["platform"]>("Portfolio");
  const [formContentType, setFormContentType] = useState<ContentHubItem["contentType"]>("Blog");
  const [formCategory, setFormCategory] = useState<ContentHubItem["category"]>("Growth");
  const [formTags, setFormTags] = useState<string[]>([]);
  const [formTagInput, setFormTagInput] = useState("");
  const [formUrl, setFormUrl] = useState("");
  const [formFeatured, setFormFeatured] = useState(false);
  const [formPublishedDate, setFormPublishedDate] = useState<string>("");
  const [formReadTime, setFormReadTime] = useState("");
  const [formViews, setFormViews] = useState<number>(0);
  const [formLikes, setFormLikes] = useState<number>(0);
  const [formStatus, setFormStatus] = useState("Published");
  const [formVisibility, setFormVisibility] = useState("public");
  
  // Author Details
  const [authorName, setAuthorName] = useState("G. Hari Kiran");
  const [authorRole, setAuthorRole] = useState("Growth Strategist");
  const [authorImage, setAuthorImage] = useState("https://i.postimg.cc/d1MxW0j1/Hari-Portfolio.png");

  // SEO Fields
  const [metaTitle, setMetaTitle] = useState("");
  const [metaDescription, setMetaDescription] = useState("");
  const [canonicalUrl, setCanonicalUrl] = useState("");
  const [robots, setRobots] = useState("index, follow");
  const [ogImage, setOgImage] = useState("");
  const [ogType, setOgType] = useState("article");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  // Set initial date when loading or creating
  useEffect(() => {
    if (!formPublishedDate) {
      const todayStr = new Date().toISOString().substring(0, 10);
      setFormPublishedDate(todayStr);
    }
  }, [formPublishedDate]);

  // Handle Authentication submit
  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!authEmail || !authPassword) {
      triggerToast("Please fill in all fields", "error");
      return;
    }
    setAuthFormLoading(true);
    try {
      if (isRegisterMode) {
        await registerTemp(authEmail, authPassword);
        triggerToast("Admin account registered successfully!", "success");
      } else {
        await login(authEmail, authPassword);
        triggerToast("Welcome back, Administrator!", "success");
      }
    } catch (err: any) {
      triggerToast(err.message || "Authentication failed", "error");
    } finally {
      setAuthFormLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      triggerToast("Successfully logged out.", "info");
    } catch (err) {
      triggerToast("Logout failed.", "error");
    }
  };

  // Seed default sample documents if db is empty
  const handleSeedSamples = async () => {
    try {
      setAuthFormLoading(true);
      const sampleItem: Omit<ContentHubItem, "id" | "publishedDate"> & { publishedDate: Date } = {
        title: "The Ultimate Omnichannel Growth Framework",
        excerpt: "An actionable playbook detailing how scalable marketing hooks can trigger massive retention increases.",
        description: "In today's hyper-competitive digital landscape, relying on a single channel is a bottleneck to growth. High-retention organizations construct dynamic multichannel hooks that keep users consistently engaged. This framework guides you on mapping content syndication, behavioral retargeting, and technical analytics pipelines.",
        thumbnail: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80",
        platform: "Portfolio",
        contentType: "Blog",
        category: "Growth",
        tags: ["Growth Marketing", "Analytics", "SEO Tips"],
        url: "#",
        featured: true,
        publishedDate: new Date(),
        readTime: "8 min read",
        views: 340,
        likes: 120,
        author: {
          name: "G. Hari Kiran",
          role: "Growth Strategist",
          image: "https://i.postimg.cc/d1MxW0j1/Hari-Portfolio.png"
        },
        status: "Published",
        visibility: "public",
        metaTitle: "Omnichannel Growth Framework | G. Hari Kiran",
        metaDescription: "Learn how to orchestrate high-retention marketing structures with omnichannel content models.",
        canonicalUrl: "https://harikiran-portfolio.netlify.app/content-hub/omnichannel-growth",
        robots: "index, follow",
        ogImage: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80",
        ogType: "article"
      };
      
      await addItem(sampleItem);
      triggerToast("Sample syndicated content seeded successfully!", "success");
    } catch (err: any) {
      triggerToast("Failed to seed content: " + err.message, "error");
    } finally {
      setAuthFormLoading(false);
    }
  };

  // Add/Delete Tags
  const handleAddTag = () => {
    const tag = formTagInput.trim();
    if (tag && !formTags.includes(tag)) {
      setFormTags(prev => [...prev, tag]);
      setFormTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormTags(prev => prev.filter(t => t !== tagToRemove));
  };

  // Handle file uploads
  const handleThumbnailUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    triggerToast("Uploading asset to Cloud Storage...", "info");
    try {
      const url = await uploadImage(file);
      setFormThumbnail(url);
      setOgImage(url); // Auto-fill OG image for convenience
      triggerToast("Thumbnail uploaded successfully!", "success");
    } catch (err: any) {
      triggerToast("Upload failed: " + err.message, "error");
    } finally {
      setIsUploading(false);
    }
  };

  // Handle CRUD Save operations
  const handleSaveContent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle || !formExcerpt || !formDescription || !formThumbnail) {
      triggerToast("Title, Excerpt, Description, and Thumbnail are required", "error");
      return;
    }

    setIsSubmitting(true);
    try {
      const itemPayload = {
        title: formTitle,
        excerpt: formExcerpt,
        description: formDescription,
        thumbnail: formThumbnail,
        platform: formPlatform,
        contentType: formContentType,
        category: formCategory,
        tags: formTags,
        url: formUrl || "#",
        featured: formFeatured,
        publishedDate: formPublishedDate ? new Date(formPublishedDate) : new Date(),
        readTime: formReadTime || "5 min read",
        views: Number(formViews) || 0,
        likes: Number(formLikes) || 0,
        author: {
          name: authorName,
          role: authorRole,
          image: authorImage
        },
        status: formStatus,
        visibility: formVisibility,
        metaTitle: metaTitle || formTitle,
        metaDescription: metaDescription || formExcerpt,
        canonicalUrl: canonicalUrl || formUrl,
        robots: robots,
        ogImage: ogImage || formThumbnail,
        ogType: ogType
      };

      if (editingId) {
        await editItem(editingId, itemPayload);
        triggerToast(`"${formTitle}" updated successfully!`, "success");
      } else {
        await addItem(itemPayload);
        triggerToast(`"${formTitle}" published successfully!`, "success");
      }

      // Reset form states and return to list
      resetForm();
      setActiveTab("list");
    } catch (err: any) {
      triggerToast("Save failed: " + err.message, "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setFormTitle("");
    setFormExcerpt("");
    setFormDescription("");
    setFormThumbnail("");
    setFormPlatform("Portfolio");
    setFormContentType("Blog");
    setFormCategory("Growth");
    setFormTags([]);
    setFormTagInput("");
    setFormUrl("");
    setFormFeatured(false);
    setFormPublishedDate(new Date().toISOString().substring(0, 10));
    setFormReadTime("");
    setFormViews(0);
    setFormLikes(0);
    setFormStatus("Published");
    setFormVisibility("public");
    
    // SEO fields Reset
    setMetaTitle("");
    setMetaDescription("");
    setCanonicalUrl("");
    setRobots("index, follow");
    setOgImage("");
    setOgType("article");
  };

  // Populate form with content item for editing
  const handleEditInitiate = (item: ContentHubItem) => {
    setEditingId(item.id);
    setFormTitle(item.title);
    setFormExcerpt(item.excerpt);
    setFormDescription(item.description);
    setFormThumbnail(item.thumbnail);
    setFormPlatform(item.platform);
    setFormContentType(item.contentType);
    setFormCategory(item.category);
    setFormTags(item.tags);
    setFormUrl(item.url);
    setFormFeatured(item.featured);
    
    const formattedDate = item.publishedDate.toISOString().substring(0, 10);
    setFormPublishedDate(formattedDate);
    setFormReadTime(item.readTime);
    setFormViews(item.views || 0);
    setFormLikes(item.likes || 0);
    setFormStatus(item.status);
    setFormVisibility(item.visibility);

    setAuthorName(item.author.name);
    setAuthorRole(item.author.role);
    setAuthorImage(item.author.image || "");

    // SEO fields populate
    setMetaTitle(item.metaTitle || "");
    setMetaDescription(item.metaDescription || "");
    setCanonicalUrl(item.canonicalUrl || "");
    setRobots(item.robots || "index, follow");
    setOgImage(item.ogImage || "");
    setOgType(item.ogType || "article");

    setActiveTab("form");
  };

  // Handle deletion safely with soft delete (Move to Trash)
  const handleDeleteConfirm = async (id: string, title: string) => {
    triggerConfirm(
      "Move to Trash?",
      `Are you sure you want to move "${title}" to Trash? It can be restored or permanently deleted from the Trash Center.`,
      async () => {
        try {
          await moveToTrashItem(id);
          triggerToast(`"${title}" moved to trash!`, "success");
        } catch (err: any) {
          triggerToast("Failed to move to trash: " + err.message, "error");
        }
      },
      "Move to Trash",
      "warning"
    );
  };

  // Handle archiving with confirmation
  const handleArchiveConfirm = async (id: string, title: string) => {
    triggerConfirm(
      "Archive Content?",
      `Are you sure you want to archive "${title}"? It will not be shown on the public website.`,
      async () => {
        try {
          await archiveItem(id);
          triggerToast(`"${title}" archived successfully!`, "success");
        } catch (err: any) {
          triggerToast("Failed to archive: " + err.message, "error");
        }
      },
      "Archive",
      "warning"
    );
  };

  // Handle restoring content
  const handleRestoreClick = async (id: string, title: string) => {
    try {
      await restoreItem(id);
      triggerToast(`"${title}" restored successfully!`, "success");
    } catch (err: any) {
      triggerToast("Restore failed: " + err.message, "error");
    }
  };

  // Handle permanent deletion (Delete Forever)
  const handleDeleteForeverConfirm = async (id: string, title: string) => {
    triggerConfirm(
      "Delete Forever?",
      `Are you sure you want to permanently delete "${title}"? This action cannot be undone.`,
      async () => {
        try {
          await deleteItemForever(id);
          triggerToast(`"${title}" deleted forever!`, "success");
        } catch (err: any) {
          triggerToast("Deletion failed: " + err.message, "error");
        }
      },
      "Delete Forever",
      "danger"
    );
  };

  // Handle bulk action execution
  const handleBulkAction = async (action: "publish" | "archive" | "trash" | "delete") => {
    if (selectedIds.length === 0) return;

    const execute = async () => {
      setIsSubmitting(true);
      try {
        if (action === "publish") {
          await Promise.all(selectedIds.map(id => publishItem(id)));
          triggerToast(`Successfully published ${selectedIds.length} items`, "success");
        } else if (action === "archive") {
          await Promise.all(selectedIds.map(id => archiveItem(id)));
          triggerToast(`Successfully archived ${selectedIds.length} items`, "success");
        } else if (action === "trash") {
          await Promise.all(selectedIds.map(id => moveToTrashItem(id)));
          triggerToast(`Successfully moved ${selectedIds.length} items to trash`, "success");
        } else if (action === "delete") {
          await Promise.all(selectedIds.map(id => deleteItemForever(id)));
          triggerToast(`Successfully deleted ${selectedIds.length} items forever`, "success");
        }
        setSelectedIds([]);
      } catch (err: any) {
        triggerToast("Bulk action failed: " + err.message, "error");
      } finally {
        setIsSubmitting(false);
      }
    };

    if (action === "archive") {
      triggerConfirm(
        "Archive Selected Items?",
        `Are you sure you want to archive ${selectedIds.length} items?`,
        execute,
        "Archive Selected",
        "warning"
      );
    } else if (action === "trash") {
      triggerConfirm(
        "Move Selected to Trash?",
        `Are you sure you want to move ${selectedIds.length} items to trash?`,
        execute,
        "Move to Trash",
        "warning"
      );
    } else if (action === "delete") {
      triggerConfirm(
        "Delete Selected Forever?",
        `This action cannot be undone. All ${selectedIds.length} selected items will be permanently removed.`,
        execute,
        "Delete Forever",
        "danger"
      );
    } else {
      execute();
    }
  };

  // Quick statistics calculated dynamically
  const dashboardStats = useMemo(() => {
    const total = items.length;
    const published = items.filter(i => i.status === "Published").length;
    const drafts = items.filter(i => i.status === "Draft").length;
    const archived = items.filter(i => i.status === "Archived").length;
    const trash = items.filter(i => i.status === "Trash").length;
    const featured = items.filter(i => i.featured).length;

    // Platform & content type counters
    const websiteArticles = items.filter(i => i.platform === "Portfolio").length;
    const mediumArticles = items.filter(i => i.platform === "Medium").length;
    const instagramReels = items.filter(i => i.platform === "Instagram").length;
    const youtubeShorts = items.filter(i => i.platform === "YouTube").length;
    const linkedinPosts = items.filter(i => i.platform === "LinkedIn").length;
    const xPosts = items.filter(i => i.platform === "X").length;
    const threadsPosts = items.filter(i => i.platform === "Threads").length;

    // Platform breakdown
    const platformCounts: Record<string, number> = {};
    items.forEach(item => {
      platformCounts[item.platform] = (platformCounts[item.platform] || 0) + 1;
    });

    return {
      total,
      published,
      drafts,
      archived,
      trash,
      featured,
      websiteArticles,
      mediumArticles,
      instagramReels,
      youtubeShorts,
      linkedinPosts,
      xPosts,
      threadsPosts,
      platforms: platformCounts
    };
  }, [items]);

  // Extract unique authors dynamically from syndicated content
  const uniqueAuthors = useMemo(() => {
    const names = new Set(items.map(item => item.author?.name || "G. Hari Kiran"));
    return Array.from(names);
  }, [items]);

  // Sorting, Filtering & Searching content list
  const processedList = useMemo(() => {
    let filtered = [...items];

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(
        item => 
          item.title.toLowerCase().includes(q) || 
          item.excerpt.toLowerCase().includes(q) ||
          item.category.toLowerCase().includes(q) ||
          item.tags.some(tag => tag.toLowerCase().includes(q))
      );
    }

    // Platform filter
    if (platformFilter !== "All") {
      filtered = filtered.filter(item => item.platform === platformFilter);
    }

    // Status filter - WordPress pattern: Hide Trash items from "All" main list view by default
    if (statusFilter !== "All") {
      filtered = filtered.filter(item => item.status === statusFilter);
    } else {
      filtered = filtered.filter(item => item.status !== "Trash");
    }

    // Category filter
    if (categoryFilter !== "All") {
      filtered = filtered.filter(item => item.category === categoryFilter);
    }

    // Content Type filter
    if (contentTypeFilter !== "All") {
      filtered = filtered.filter(item => item.contentType === contentTypeFilter);
    }

    // Author filter
    if (authorFilter !== "All") {
      filtered = filtered.filter(item => (item.author?.name || "G. Hari Kiran") === authorFilter);
    }

    // Sorting
    filtered.sort((a, b) => {
      if (sortBy === "newest") {
        return b.publishedDate.getTime() - a.publishedDate.getTime();
      }
      if (sortBy === "oldest") {
        return a.publishedDate.getTime() - b.publishedDate.getTime();
      }
      if (sortBy === "title") {
        return a.title.localeCompare(b.title);
      }
      if (sortBy === "views") {
        return (b.views || 0) - (a.views || 0);
      }
      if (sortBy === "likes") {
        return (b.likes || 0) - (a.likes || 0);
      }
      return 0;
    });

    return filtered;
  }, [items, searchQuery, platformFilter, statusFilter, categoryFilter, contentTypeFilter, authorFilter, sortBy]);

  // Paginated List
  const paginatedItems = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return processedList.slice(startIndex, startIndex + itemsPerPage);
  }, [processedList, currentPage]);

  const totalPages = Math.ceil(processedList.length / itemsPerPage);

  const handleSelectAllToggle = () => {
    const paginatedIds = paginatedItems.map(item => item.id);
    const allSelected = paginatedIds.length > 0 && paginatedIds.every(id => selectedIds.includes(id));
    if (allSelected) {
      setSelectedIds(prev => prev.filter(id => !paginatedIds.includes(id)));
    } else {
      setSelectedIds(prev => Array.from(new Set([...prev, ...paginatedIds])));
    }
  };

  const handleRowSelectToggle = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  // Trigger preview block
  const handleOpenPreview = (item: ContentHubItem) => {
    setPreviewItem(item);
    setIsPreviewOpen(true);
  };

  const handleLivePreview = () => {
    const liveItem: ContentHubItem = {
      id: "preview-id",
      title: formTitle || "Untitled Live Preview",
      excerpt: formExcerpt || "This is a live excerpt mapping the metadata text.",
      description: formDescription || "Full description details here.",
      thumbnail: formThumbnail || "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80",
      platform: formPlatform,
      contentType: formContentType,
      category: formCategory,
      tags: formTags,
      url: formUrl || "#",
      featured: formFeatured,
      publishedDate: formPublishedDate ? new Date(formPublishedDate) : new Date(),
      readTime: formReadTime || "5 min read",
      views: Number(formViews) || 120,
      likes: Number(formLikes) || 45,
      author: {
        name: authorName,
        role: authorRole,
        image: authorImage
      },
      status: formStatus,
      visibility: formVisibility,
      metaTitle: metaTitle,
      metaDescription: metaDescription,
      canonicalUrl: canonicalUrl,
      robots: robots,
      ogImage: ogImage,
      ogType: ogType
    };
    setPreviewItem(liveItem);
    setIsPreviewOpen(true);
  };

  // Render auth loading spinner
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#070708] text-white">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-accent/20 border-t-accent rounded-full animate-spin" />
          <p className="text-xs font-mono text-zinc-400 tracking-widest uppercase">Initializing CMS Portal...</p>
        </div>
      </div>
    );
  }

  // Render Login view if user is unauthenticated
  if (!user) {
    return (
      <div className={cn(
        "min-h-screen flex items-center justify-center transition-colors duration-300 relative px-4 overflow-hidden",
        themeMode === "dark" ? "bg-[#070708] text-zinc-100" : "bg-zinc-50 text-zinc-950"
      )}>
        {/* Ambient absolute graphics */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-accent/5 blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/3 right-1/4 w-96 h-96 rounded-full bg-indigo-500/5 blur-3xl pointer-events-none" />

        <div className={cn(
          "w-full max-w-md rounded-[32px] border p-8 shadow-2xl backdrop-blur-xl relative z-10 transition-all duration-300",
          themeMode === "dark" ? "bg-[#0c0c0e]/80 border-white/5" : "bg-white/90 border-zinc-200"
        )}>
          {/* Logo Heading */}
          <div className="text-center mb-8">
            <div className={cn(
              "w-12 h-12 rounded-2xl mx-auto mb-4 flex items-center justify-center",
              themeMode === "dark" ? "bg-accent/10 border border-accent/20" : "bg-accent/5 border border-accent/10"
            )}>
              <Lock className="w-5 h-5 text-accent" />
            </div>
            <h1 className="text-2xl font-black uppercase tracking-tight font-display mb-1.5">CMS Gatekeeper</h1>
            <p className="text-xs font-mono text-zinc-400">Authenticated Admin Console</p>
          </div>

          <form onSubmit={handleAuthSubmit} className="space-y-5">
            <div>
              <label className="block text-[10px] font-black uppercase tracking-wider text-zinc-400 mb-2">Administrator Email</label>
              <input 
                type="email" 
                value={authEmail}
                onChange={(e) => setAuthEmail(e.target.value)}
                placeholder="admin@portfolio.com"
                required
                className={cn(
                  "w-full px-4 py-3.5 rounded-xl border text-sm transition-all outline-none font-sans",
                  themeMode === "dark" 
                    ? "bg-zinc-900 border-white/5 focus:border-accent text-white placeholder-zinc-600" 
                    : "bg-zinc-50 border-zinc-200 focus:border-accent text-zinc-900 placeholder-zinc-400"
                )}
              />
            </div>

            <div>
              <label className="block text-[10px] font-black uppercase tracking-wider text-zinc-400 mb-2">Secure Passcode</label>
              <input 
                type="password" 
                value={authPassword}
                onChange={(e) => setAuthPassword(e.target.value)}
                placeholder="••••••••••••"
                required
                className={cn(
                  "w-full px-4 py-3.5 rounded-xl border text-sm transition-all outline-none font-sans",
                  themeMode === "dark" 
                    ? "bg-zinc-900 border-white/5 focus:border-accent text-white placeholder-zinc-600" 
                    : "bg-zinc-50 border-zinc-200 focus:border-accent text-zinc-900 placeholder-zinc-400"
                )}
              />
            </div>

            <button 
              type="submit" 
              disabled={authFormLoading}
              className="w-full py-4 bg-accent text-white rounded-xl text-xs font-black uppercase tracking-widest hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
            >
              {authFormLoading ? (
                <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
              ) : isRegisterMode ? (
                "Create Admin Account"
              ) : (
                "Validate Identity"
              )}
            </button>
          </form>

          {/* Quick switcher to ease sandbox registration if needed */}
          <div className="mt-6 pt-6 border-t border-dashed border-white/5 text-center flex flex-col gap-2.5">
            <button 
              type="button"
              onClick={() => setIsRegisterMode(!isRegisterMode)}
              className="text-[10px] font-mono uppercase tracking-wider text-accent hover:underline hover:opacity-85"
            >
              {isRegisterMode ? "Already registered? Sign In" : "Need to register first admin account?"}
            </button>

            <button
              onClick={() => setThemeMode(themeMode === "dark" ? "light" : "dark")}
              className="text-[10px] font-mono text-zinc-400 hover:text-white mx-auto flex items-center gap-1.5"
            >
              {themeMode === "dark" ? <Sun className="w-3.5 h-3.5 text-yellow-400" /> : <Moon className="w-3.5 h-3.5 text-indigo-400" />}
              Switch visual layout
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={cn(
      "min-h-screen transition-colors duration-300 relative flex font-sans",
      themeMode === "dark" ? "bg-[#070708] text-zinc-100" : "bg-[#f4f4f5] text-zinc-900"
    )}>
      {/* Toast Alert stack */}
      <div className="fixed top-6 right-6 z-[9999] flex flex-col gap-3 max-w-sm w-full">
        {toasts.map(toast => (
          <div 
            key={toast.id} 
            className={cn(
              "p-4 rounded-2xl shadow-2xl flex items-start gap-3 border animate-bounce backdrop-blur-md relative overflow-hidden",
              toast.type === "success" 
                ? (themeMode === "dark" ? "bg-emerald-950/90 border-emerald-500/20 text-emerald-100" : "bg-emerald-50 border-emerald-200 text-emerald-800")
                : toast.type === "error"
                ? (themeMode === "dark" ? "bg-red-950/90 border-red-500/20 text-red-100" : "bg-red-50 border-red-200 text-red-800")
                : (themeMode === "dark" ? "bg-zinc-900/90 border-white/5 text-zinc-100" : "bg-white border-zinc-200 text-zinc-800")
            )}
          >
            {toast.type === "success" ? (
              <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
            ) : toast.type === "error" ? (
              <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
            ) : (
              <Info className="w-5 h-5 text-accent shrink-0 mt-0.5" />
            )}
            <div className="flex-1">
              <p className="text-xs font-semibold leading-relaxed">{toast.message}</p>
            </div>
            <button 
              onClick={() => setToasts(prev => prev.filter(t => t.id !== toast.id))}
              className="text-zinc-400 hover:text-white shrink-0"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>

      {/* SIDEBAR NAVIGATION PANEL */}
      <aside className={cn(
        "w-64 border-r shrink-0 min-h-screen hidden md:flex flex-col justify-between p-6 transition-all duration-300",
        themeMode === "dark" ? "bg-[#0b0b0d] border-white/5" : "bg-white border-zinc-200"
      )}>
        <div className="flex flex-col gap-8">
          {/* Main Title heading */}
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-accent animate-ping" />
              <h2 className="text-sm font-black uppercase tracking-wider font-display">Hub CMS</h2>
            </div>
            <p className="text-[10px] font-mono text-zinc-400">Syndication Dashboard</p>
          </div>

          {/* Nav Links */}
          <nav className="flex flex-col gap-2">
            <button
              onClick={() => { navigate("/admin"); setActiveTab("dashboard"); resetForm(); }}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all",
                activeTab === "dashboard"
                  ? "bg-accent text-white shadow-xl shadow-accent/15"
                  : (themeMode === "dark" ? "text-zinc-400 hover:bg-white/5 hover:text-white" : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-950")
              )}
            >
              <LayoutDashboard className="w-4 h-4" />
              Stats Center
            </button>

            <button
              onClick={() => { navigate("/admin"); setActiveTab("list"); resetForm(); }}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all",
                activeTab === "list"
                  ? "bg-accent text-white shadow-xl shadow-accent/15"
                  : (themeMode === "dark" ? "text-zinc-400 hover:bg-white/5 hover:text-white" : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-950")
              )}
            >
              <FileText className="w-4 h-4" />
              Syndicated List
            </button>

            <button
              onClick={() => { navigate("/admin"); resetForm(); setActiveTab("form"); }}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all",
                activeTab === "form" && !editingId
                  ? "bg-accent text-white shadow-xl shadow-accent/15"
                  : (themeMode === "dark" ? "text-zinc-400 hover:bg-white/5 hover:text-white" : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-950")
              )}
            >
              <PlusCircle className="w-4 h-4" />
              Create Content
            </button>

            <button
              onClick={() => { navigate("/admin"); resetForm(); setActiveTab("blog-writer"); }}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all",
                activeTab === "blog-writer"
                  ? "bg-accent text-white shadow-xl shadow-accent/15"
                  : (themeMode === "dark" ? "text-zinc-400 hover:bg-white/5 hover:text-white" : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-950")
              )}
            >
              <PenTool className="w-4 h-4 text-accent" />
              Blog Writer Suite
            </button>

            <button
              onClick={() => { navigate("/admin"); resetForm(); setActiveTab("archived"); }}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all",
                activeTab === "archived"
                  ? "bg-accent text-white shadow-xl shadow-accent/15"
                  : (themeMode === "dark" ? "text-zinc-400 hover:bg-white/5 hover:text-white" : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-950")
              )}
            >
              <Archive className="w-4 h-4" />
              Archives Center
            </button>

            <button
              onClick={() => { navigate("/admin"); resetForm(); setActiveTab("automation"); }}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all",
                activeTab === "automation"
                  ? "bg-accent text-white shadow-xl shadow-accent/15"
                  : (themeMode === "dark" ? "text-zinc-400 hover:bg-white/5 hover:text-white" : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-950")
              )}
            >
              <RefreshCw className="w-4 h-4" />
              Automation Core
            </button>

            <button
              onClick={() => { navigate("/admin/content/trash"); resetForm(); setActiveTab("trash"); }}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all",
                activeTab === "trash"
                  ? "bg-accent text-white shadow-xl shadow-accent/15"
                  : (themeMode === "dark" ? "text-zinc-400 hover:bg-white/5 hover:text-white" : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-950")
              )}
            >
              <Trash2 className="w-4 h-4" />
              Trash Center
            </button>
          </nav>
        </div>

        {/* Profile/Footer action buttons */}
        <div className="flex flex-col gap-5 pt-6 border-t border-zinc-800">
          <div className="flex items-center gap-3">
            <img 
              src={(user.photoURL && user.photoURL.trim() !== "") ? user.photoURL : "https://i.postimg.cc/d1MxW0j1/Hari-Portfolio.png"} 
              alt="Admin avatar" 
              className="w-10 h-10 rounded-full border border-white/10 shrink-0 object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="min-w-0">
              <p className="text-[10px] font-black uppercase tracking-wider truncate text-white">Administrator</p>
              <p className="text-[9px] font-mono text-zinc-400 truncate">{user.email}</p>
            </div>
          </div>

          <div className="flex items-center justify-between gap-2.5">
            <button
              onClick={() => setThemeMode(themeMode === "dark" ? "light" : "dark")}
              className={cn(
                "p-2.5 rounded-lg shrink-0 border transition-colors",
                themeMode === "dark" ? "bg-zinc-900 border-white/5 text-yellow-400" : "bg-zinc-50 border-zinc-200 text-indigo-500"
              )}
              title="Toggle theme mode"
            >
              {themeMode === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            <button
              onClick={handleLogout}
              className={cn(
                "flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg border text-[10px] font-black uppercase tracking-wider transition-colors",
                themeMode === "dark" 
                  ? "bg-zinc-900 border-white/5 text-zinc-400 hover:bg-red-950/20 hover:text-red-400" 
                  : "bg-zinc-50 border-zinc-200 text-zinc-600 hover:bg-red-50 hover:text-red-600"
              )}
            >
              <LogOut className="w-3.5 h-3.5" />
              Sign Out
            </button>
          </div>
        </div>
      </aside>

      {/* MAIN LAYOUT CANVAS */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* TOP COMPACT HEADER (Responsive friendly) */}
        <header className={cn(
          "px-6 py-4 border-b flex items-center justify-between transition-all duration-300 relative z-20",
          themeMode === "dark" ? "bg-[#0c0c0e] border-white/5 text-white" : "bg-white border-zinc-200 text-zinc-900"
        )}>
          <div className="flex items-center gap-4">
            <div className="md:hidden flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-accent animate-ping" />
              <h1 className="text-xs font-black uppercase tracking-wider">Hub CMS</h1>
            </div>
            
            <span className="hidden md:inline-block text-[10px] font-mono text-zinc-400">
              Session Live Code: <span className="text-accent">{user.uid.substring(0, 8)}</span>
            </span>
          </div>

          {/* Quick links for Mobile view */}
          <div className="flex items-center gap-3">
            <div className="md:hidden flex items-center gap-1.5 flex-wrap">
              <button 
                onClick={() => { navigate("/admin"); setActiveTab("dashboard"); resetForm(); }}
                className={cn("p-1.5 rounded", activeTab === "dashboard" ? "text-accent" : "text-zinc-400")}
                title="Stats"
              >
                <LayoutDashboard className="w-4 h-4" />
              </button>
              <button 
                onClick={() => { navigate("/admin"); setActiveTab("list"); resetForm(); }}
                className={cn("p-1.5 rounded", activeTab === "list" ? "text-accent" : "text-zinc-400")}
                title="List"
              >
                <FileText className="w-4 h-4" />
              </button>
              <button 
                onClick={() => { navigate("/admin"); resetForm(); setActiveTab("form"); }}
                className={cn("p-1.5 rounded", activeTab === "form" && !editingId ? "text-accent" : "text-zinc-400")}
                title="Create"
              >
                <PlusCircle className="w-4 h-4" />
              </button>
              <button 
                onClick={() => { navigate("/admin"); resetForm(); setActiveTab("blog-writer"); }}
                className={cn("p-1.5 rounded", activeTab === "blog-writer" ? "text-accent" : "text-zinc-400")}
                title="Blog Writer"
              >
                <PenTool className="w-4 h-4 text-accent" />
              </button>
              <button 
                onClick={() => { navigate("/admin"); resetForm(); setActiveTab("archived"); }}
                className={cn("p-1.5 rounded", activeTab === "archived" ? "text-accent" : "text-zinc-400")}
                title="Archived"
              >
                <Archive className="w-4 h-4" />
              </button>
              <button 
                onClick={() => { navigate("/admin"); resetForm(); setActiveTab("automation"); }}
                className={cn("p-1.5 rounded", activeTab === "automation" ? "text-accent" : "text-zinc-400")}
                title="Automation"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
              <button 
                onClick={() => { navigate("/admin/content/trash"); resetForm(); setActiveTab("trash"); }}
                className={cn("p-1.5 rounded", activeTab === "trash" ? "text-accent" : "text-zinc-400")}
                title="Trash"
              >
                <Trash2 className="w-4 h-4" />
              </button>
              <button 
                onClick={handleLogout}
                className="p-1.5 text-red-400 hover:bg-red-900/10 rounded"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>

            <a 
              href="/content-hub" 
              target="_blank" 
              className={cn(
                "px-3.5 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border flex items-center gap-1.5 transition-colors",
                themeMode === "dark" ? "bg-zinc-900 border-white/5 hover:bg-zinc-800 text-zinc-300" : "bg-zinc-50 border-zinc-200 hover:bg-zinc-100 text-zinc-700"
              )}
            >
              Public Hub <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </header>

        {/* CMS ACTIVE VIEW CONTAINER */}
        <main className="flex-1 p-6 md:p-8">
          
          {/* VIEW: DASHBOARD / STATISTICS */}
          {activeTab === "dashboard" && (
            <div className="space-y-8 animate-fade-in" id="dashboard-statistics-tab">
              
              {/* Heading */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl md:text-2xl font-black uppercase tracking-tight font-display text-white">Syndication Dashboard</h2>
                  <p className="text-xs font-mono text-zinc-400 mt-1">Holistic health snapshot of syndicated channels & growth index.</p>
                </div>

                {items.length === 0 && !contentLoading && (
                  <button
                    onClick={handleSeedSamples}
                    className="px-6 py-3 bg-accent/10 border border-accent/20 text-accent hover:bg-accent hover:text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all"
                  >
                    🚀 Seed Sample Content
                  </button>
                )}
              </div>

              {/* STAT CARDS GRID */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-5">
                
                {/* Stat 1: Total */}
                <div className={cn(
                  "p-5 rounded-3xl border relative overflow-hidden transition-all duration-300",
                  themeMode === "dark" ? "bg-[#0c0c0e] border-white/5 text-white" : "bg-white border-zinc-200 text-zinc-900"
                )}>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[9px] font-mono text-zinc-400 uppercase tracking-widest">Total Assets</span>
                    <BookOpen className="w-4 h-4 text-accent" />
                  </div>
                  {contentLoading ? (
                    <div className="h-6 w-12 bg-zinc-800 animate-pulse rounded" />
                  ) : (
                    <div>
                      <h3 className="text-2xl font-black font-display">{dashboardStats.total}</h3>
                      <p className="text-[9px] text-zinc-400 font-mono mt-1">Total database items</p>
                    </div>
                  )}
                </div>

                {/* Stat 2: Published */}
                <div className={cn(
                  "p-5 rounded-3xl border relative overflow-hidden transition-all duration-300",
                  themeMode === "dark" ? "bg-[#0c0c0e] border-white/5 text-white" : "bg-white border-zinc-200 text-zinc-900"
                )}>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[9px] font-mono text-emerald-400 uppercase tracking-widest">Published</span>
                    <CheckCircle className="w-4 h-4 text-emerald-400" />
                  </div>
                  {contentLoading ? (
                    <div className="h-6 w-12 bg-zinc-800 animate-pulse rounded" />
                  ) : (
                    <div>
                      <h3 className="text-2xl font-black font-display text-emerald-400">{dashboardStats.published}</h3>
                      <p className="text-[9px] text-zinc-400 font-mono mt-1">Live search files</p>
                    </div>
                  )}
                </div>

                {/* Stat 3: Drafts */}
                <div className={cn(
                  "p-5 rounded-3xl border relative overflow-hidden transition-all duration-300",
                  themeMode === "dark" ? "bg-[#0c0c0e] border-white/5 text-white" : "bg-white border-zinc-200 text-zinc-900"
                )}>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[9px] font-mono text-yellow-500 uppercase tracking-widest">Drafts</span>
                    <Info className="w-4 h-4 text-yellow-500" />
                  </div>
                  {contentLoading ? (
                    <div className="h-6 w-12 bg-zinc-800 animate-pulse rounded" />
                  ) : (
                    <div>
                      <h3 className="text-2xl font-black font-display text-yellow-500">{dashboardStats.drafts}</h3>
                      <p className="text-[9px] text-zinc-400 font-mono mt-1">Work-in-progress drafts</p>
                    </div>
                  )}
                </div>

                {/* Stat 4: Archived */}
                <div className={cn(
                  "p-5 rounded-3xl border relative overflow-hidden transition-all duration-300",
                  themeMode === "dark" ? "bg-[#0c0c0e] border-white/5 text-white" : "bg-white border-zinc-200 text-zinc-900"
                )}>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[9px] font-mono text-blue-400 uppercase tracking-widest">Archived</span>
                    <Archive className="w-4 h-4 text-blue-400" />
                  </div>
                  {contentLoading ? (
                    <div className="h-6 w-12 bg-zinc-800 animate-pulse rounded" />
                  ) : (
                    <div>
                      <h3 className="text-2xl font-black font-display text-blue-400">{dashboardStats.archived}</h3>
                      <p className="text-[9px] text-zinc-400 font-mono mt-1">Stored archives</p>
                    </div>
                  )}
                </div>

                {/* Stat 5: Trash */}
                <div className={cn(
                  "p-5 rounded-3xl border relative overflow-hidden transition-all duration-300",
                  themeMode === "dark" ? "bg-[#0c0c0e] border-white/5 text-white" : "bg-white border-zinc-200 text-zinc-900"
                )}>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[9px] font-mono text-red-400 uppercase tracking-widest">Trash Bin</span>
                    <Trash2 className="w-4 h-4 text-red-400" />
                  </div>
                  {contentLoading ? (
                    <div className="h-6 w-12 bg-zinc-800 animate-pulse rounded" />
                  ) : (
                    <div>
                      <h3 className="text-2xl font-black font-display text-red-400">{dashboardStats.trash}</h3>
                      <p className="text-[9px] text-zinc-400 font-mono mt-1">Soft-deleted items</p>
                    </div>
                  )}
                </div>

                {/* Stat 6: Featured */}
                <div className={cn(
                  "p-5 rounded-3xl border relative overflow-hidden transition-all duration-300",
                  themeMode === "dark" ? "bg-[#0c0c0e] border-white/5 text-white" : "bg-white border-zinc-200 text-zinc-900"
                )}>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[9px] font-mono text-amber-500 uppercase tracking-widest">Featured</span>
                    <Sparkles className="w-4 h-4 text-amber-400" />
                  </div>
                  {contentLoading ? (
                    <div className="h-6 w-12 bg-zinc-800 animate-pulse rounded" />
                  ) : (
                    <div>
                      <h3 className="text-2xl font-black font-display text-amber-500">{dashboardStats.featured}</h3>
                      <p className="text-[9px] text-zinc-400 font-mono mt-1">Pinned spotlight index</p>
                    </div>
                  )}
                </div>

              </div>

              {/* PLATFORM CHANNELS GRID */}
              <div className="space-y-3">
                <h3 className="text-[10px] font-black uppercase tracking-widest text-zinc-400 font-mono">Platform Channel Breakdown</h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-4">
                  {/* Website */}
                  <div className={cn(
                    "p-4 rounded-2xl border transition-all duration-300",
                    themeMode === "dark" ? "bg-[#0c0c0e] border-white/5 text-white" : "bg-white border-zinc-200 text-zinc-900"
                  )}>
                    <div className="text-[9px] font-mono text-zinc-400 uppercase tracking-wider mb-2 truncate">Website</div>
                    <h4 className="text-xl font-black font-display text-accent">{dashboardStats.websiteArticles}</h4>
                  </div>

                  {/* Medium */}
                  <div className={cn(
                    "p-4 rounded-2xl border transition-all duration-300",
                    themeMode === "dark" ? "bg-[#0c0c0e] border-white/5 text-white" : "bg-white border-zinc-200 text-zinc-900"
                  )}>
                    <div className="text-[9px] font-mono text-zinc-400 uppercase tracking-wider mb-2 truncate">Medium</div>
                    <h4 className="text-xl font-black font-display text-blue-400">{dashboardStats.mediumArticles}</h4>
                  </div>

                  {/* Instagram */}
                  <div className={cn(
                    "p-4 rounded-2xl border transition-all duration-300",
                    themeMode === "dark" ? "bg-[#0c0c0e] border-white/5 text-white" : "bg-white border-zinc-200 text-zinc-900"
                  )}>
                    <div className="text-[9px] font-mono text-zinc-400 uppercase tracking-wider mb-2 truncate">Instagram</div>
                    <h4 className="text-xl font-black font-display text-pink-400">{dashboardStats.instagramReels}</h4>
                  </div>

                  {/* YouTube */}
                  <div className={cn(
                    "p-4 rounded-2xl border transition-all duration-300",
                    themeMode === "dark" ? "bg-[#0c0c0e] border-white/5 text-white" : "bg-white border-zinc-200 text-zinc-900"
                  )}>
                    <div className="text-[9px] font-mono text-zinc-400 uppercase tracking-wider mb-2 truncate">YouTube</div>
                    <h4 className="text-xl font-black font-display text-red-500">{dashboardStats.youtubeShorts}</h4>
                  </div>

                  {/* LinkedIn */}
                  <div className={cn(
                    "p-4 rounded-2xl border transition-all duration-300",
                    themeMode === "dark" ? "bg-[#0c0c0e] border-white/5 text-white" : "bg-white border-zinc-200 text-zinc-900"
                  )}>
                    <div className="text-[9px] font-mono text-zinc-400 uppercase tracking-wider mb-2 truncate">LinkedIn</div>
                    <h4 className="text-xl font-black font-display text-sky-400">{dashboardStats.linkedinPosts}</h4>
                  </div>

                  {/* X */}
                  <div className={cn(
                    "p-4 rounded-2xl border transition-all duration-300",
                    themeMode === "dark" ? "bg-[#0c0c0e] border-white/5 text-white" : "bg-white border-zinc-200 text-zinc-900"
                  )}>
                    <div className="text-[9px] font-mono text-zinc-400 uppercase tracking-wider mb-2 truncate">X Posts</div>
                    <h4 className="text-xl font-black font-display text-zinc-100">{dashboardStats.xPosts}</h4>
                  </div>

                  {/* Threads */}
                  <div className={cn(
                    "p-4 rounded-2xl border transition-all duration-300",
                    themeMode === "dark" ? "bg-[#0c0c0e] border-white/5 text-white" : "bg-white border-zinc-200 text-zinc-900"
                  )}>
                    <div className="text-[9px] font-mono text-zinc-400 uppercase tracking-wider mb-2 truncate">Threads</div>
                    <h4 className="text-xl font-black font-display text-purple-400">{dashboardStats.threadsPosts}</h4>
                  </div>
                </div>
              </div>

              {/* TWO COLUMN GRID BELOW STATS */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                
                {/* Left Column: Platform break-downs */}
                <div className={cn(
                  "lg:col-span-5 p-8 rounded-[40px] border relative transition-all duration-300",
                  themeMode === "dark" ? "bg-[#0c0c0e] border-white/5" : "bg-white border-zinc-200"
                )}>
                  <h3 className="text-sm font-black uppercase tracking-wider text-white mb-6">Omnichannel Syndication Breakdown</h3>
                  
                  {contentLoading ? (
                    <div className="space-y-4">
                      {[...Array(4)].map((_, i) => (
                        <div key={i} className="h-8 bg-zinc-800 animate-pulse rounded" />
                      ))}
                    </div>
                  ) : Object.keys(dashboardStats.platforms).length === 0 ? (
                    <div className="text-center py-8 text-zinc-400 text-xs">No syndication data available. Seed content first.</div>
                  ) : (
                    <div className="space-y-5">
                      {Object.entries(dashboardStats.platforms).map(([platform, count]) => {
                        const countNum = count as number;
                        const percent = Math.round((countNum / dashboardStats.total) * 100);
                        return (
                          <div key={platform}>
                            <div className="flex justify-between items-center text-xs mb-1.5">
                              <span className="font-mono font-bold text-zinc-300">{platform}</span>
                              <span className="font-mono text-zinc-400">{countNum} item{countNum > 1 ? "s" : ""} ({percent}%)</span>
                            </div>
                            <div className="w-full h-2 rounded-full bg-zinc-800 overflow-hidden">
                              <div 
                                className="h-full bg-accent rounded-full transition-all duration-500"
                                style={{ width: `${percent}%` }}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Right Column: Latest Content Additions */}
                <div className={cn(
                  "lg:col-span-7 p-8 rounded-[40px] border relative transition-all duration-300",
                  themeMode === "dark" ? "bg-[#0c0c0e] border-white/5" : "bg-white border-zinc-200"
                )}>
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-sm font-black uppercase tracking-wider text-white">Lately Synced Activity</h3>
                    <button 
                      onClick={() => setActiveTab("list")} 
                      className="text-[10px] font-mono uppercase text-accent hover:underline"
                    >
                      View All
                    </button>
                  </div>

                  {contentLoading ? (
                    <div className="space-y-4">
                      {[...Array(3)].map((_, i) => (
                        <div key={i} className="h-12 bg-zinc-800 animate-pulse rounded" />
                      ))}
                    </div>
                  ) : items.length === 0 ? (
                    <div className="text-center py-12 text-zinc-400 text-xs">
                      No documents logged in database. Click "Create Content" to add the first asset!
                    </div>
                  ) : (
                    <div className="flex flex-col gap-4">
                      {items.slice(0, 4).map(item => (
                        <div 
                          key={item.id}
                          className="flex items-center justify-between p-3.5 rounded-2xl bg-zinc-950/40 border border-white/5 hover:border-accent/10 transition-all group"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <img 
                              src={item.thumbnail || "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80"} 
                              alt="thumbnail" 
                              className="w-10 h-10 rounded-lg object-cover shrink-0 border border-white/10"
                            />
                            <div className="min-w-0">
                              <h4 className="text-xs font-bold text-white truncate group-hover:text-accent transition-colors">
                                {item.title}
                              </h4>
                              <p className="text-[10px] text-zinc-400 font-mono mt-0.5">
                                {item.platform} • {item.publishedDate.toLocaleDateString(undefined, { dateStyle: "short" })}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <span className={cn(
                              "px-2.5 py-1 rounded-full text-[8px] font-black uppercase tracking-wider",
                              item.status === "Published" ? "bg-emerald-500/10 text-emerald-400" : "bg-yellow-500/10 text-yellow-500"
                            )}>
                              {item.status}
                            </span>
                            <button 
                              onClick={() => handleEditInitiate(item)}
                              className="p-1.5 text-zinc-400 hover:text-white"
                              title="Edit item"
                            >
                              <Edit className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

              </div>

            </div>
          )}

          {/* VIEW: CONTENT LIST / TABLE */}
          {activeTab === "list" && (
            <div className="space-y-6 animate-fade-in" id="content-list-tab">
              
              {/* Header section with Create trigger */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl md:text-2xl font-black uppercase tracking-tight font-display text-white">Syndicated Portfolios</h2>
                  <p className="text-xs font-mono text-zinc-400 mt-1">Review, search, filter, and delete Firestore content syndications.</p>
                </div>

                <button
                  onClick={() => { resetForm(); setActiveTab("form"); }}
                  className="px-6 py-3.5 bg-accent hover:bg-white text-white hover:text-black rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-xl shadow-accent/15 flex items-center justify-center gap-2 self-start"
                >
                  <PlusCircle className="w-4 h-4" /> Create Content
                </button>
              </div>

              {/* INTERACTIVE FILTERS BLOCK */}
              <div className={cn(
                "p-5 rounded-[24px] border grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-4 transition-all duration-300",
                themeMode === "dark" ? "bg-[#0c0c0e] border-white/5" : "bg-white border-zinc-200"
              )}>
                {/* Search */}
                <div className="relative col-span-1 sm:col-span-2 md:col-span-3 lg:col-span-1">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                  <input 
                    type="text" 
                    placeholder="Search documents..."
                    value={searchQuery}
                    onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                    className={cn(
                      "w-full pl-10 pr-4 py-3 rounded-xl text-xs outline-none transition-all border",
                      themeMode === "dark" 
                        ? "bg-zinc-900 border-white/5 focus:border-accent text-white" 
                        : "bg-zinc-50 border-zinc-200 focus:border-accent text-zinc-900"
                    )}
                  />
                </div>

                {/* Platform Filter */}
                <div className="relative">
                  <select 
                    value={platformFilter}
                    onChange={(e) => { setPlatformFilter(e.target.value); setCurrentPage(1); }}
                    className={cn(
                      "w-full px-4 py-3 rounded-xl text-xs outline-none border appearance-none font-semibold uppercase tracking-wider cursor-pointer",
                      themeMode === "dark" 
                        ? "bg-zinc-900 border-white/5 text-zinc-200" 
                        : "bg-zinc-50 border-zinc-200 text-zinc-700"
                    )}
                  >
                    <option value="All">All Platforms</option>
                    <option value="Blogger">Blogger</option>
                    <option value="Medium">Medium</option>
                    <option value="Portfolio">Portfolio</option>
                    <option value="Instagram">Instagram</option>
                    <option value="YouTube">YouTube</option>
                    <option value="LinkedIn">LinkedIn</option>
                    <option value="X">X</option>
                    <option value="Threads">Threads</option>
                    <option value="Podcast">Podcast</option>
                    <option value="Case Study">Case Study</option>
                    <option value="Resource">Resource</option>
                  </select>
                  <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 pointer-events-none" />
                </div>

                {/* Status Filter */}
                <div className="relative">
                  <select 
                    value={statusFilter}
                    onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
                    className={cn(
                      "w-full px-4 py-3 rounded-xl text-xs outline-none border appearance-none font-semibold uppercase tracking-wider cursor-pointer",
                      themeMode === "dark" 
                        ? "bg-zinc-900 border-white/5 text-zinc-200" 
                        : "bg-zinc-50 border-zinc-200 text-zinc-700"
                    )}
                  >
                    <option value="All">All Statuses</option>
                    <option value="Published">Published</option>
                    <option value="Draft">Draft</option>
                    <option value="Archived">Archived</option>
                  </select>
                  <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 pointer-events-none" />
                </div>

                {/* Category Filter */}
                <div className="relative">
                  <select 
                    value={categoryFilter}
                    onChange={(e) => { setCategoryFilter(e.target.value); setCurrentPage(1); }}
                    className={cn(
                      "w-full px-4 py-3 rounded-xl text-xs outline-none border appearance-none font-semibold uppercase tracking-wider cursor-pointer",
                      themeMode === "dark" 
                        ? "bg-zinc-900 border-white/5 text-zinc-200" 
                        : "bg-zinc-50 border-zinc-200 text-zinc-700"
                    )}
                  >
                    <option value="All">All Categories</option>
                    <option value="Growth">Growth</option>
                    <option value="Marketing">Marketing</option>
                    <option value="AI">AI</option>
                    <option value="SEO Tips">SEO Tips</option>
                    <option value="Compliance">Compliance</option>
                    <option value="Retention">Retention</option>
                  </select>
                  <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 pointer-events-none" />
                </div>

                {/* Content Type Filter */}
                <div className="relative">
                  <select 
                    value={contentTypeFilter}
                    onChange={(e) => { setContentTypeFilter(e.target.value); setCurrentPage(1); }}
                    className={cn(
                      "w-full px-4 py-3 rounded-xl text-xs outline-none border appearance-none font-semibold uppercase tracking-wider cursor-pointer",
                      themeMode === "dark" 
                        ? "bg-zinc-900 border-white/5 text-zinc-200" 
                        : "bg-zinc-50 border-zinc-200 text-zinc-700"
                    )}
                  >
                    <option value="All">All Types</option>
                    <option value="Blog">Blog</option>
                    <option value="Video">Video</option>
                    <option value="Newsletter">Newsletter</option>
                    <option value="Post">Post</option>
                    <option value="Playbook">Playbook</option>
                  </select>
                  <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 pointer-events-none" />
                </div>

                {/* Author Filter */}
                <div className="relative">
                  <select 
                    value={authorFilter}
                    onChange={(e) => { setAuthorFilter(e.target.value); setCurrentPage(1); }}
                    className={cn(
                      "w-full px-4 py-3 rounded-xl text-xs outline-none border appearance-none font-semibold uppercase tracking-wider cursor-pointer",
                      themeMode === "dark" 
                        ? "bg-zinc-900 border-white/5 text-zinc-200" 
                        : "bg-zinc-50 border-zinc-200 text-zinc-700"
                    )}
                  >
                    <option value="All">All Authors</option>
                    {uniqueAuthors.map(authName => (
                      <option key={authName} value={authName}>{authName}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 pointer-events-none" />
                </div>

                {/* Sort By */}
                <div className="relative">
                  <select 
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className={cn(
                      "w-full px-4 py-3 rounded-xl text-xs outline-none border appearance-none font-semibold uppercase tracking-wider cursor-pointer",
                      themeMode === "dark" 
                        ? "bg-zinc-900 border-white/5 text-zinc-200" 
                        : "bg-zinc-50 border-zinc-200 text-zinc-700"
                    )}
                  >
                    <option value="newest">Newest First</option>
                    <option value="oldest">Oldest First</option>
                    <option value="title">Alphabetical Title</option>
                    <option value="views">Most Viewed</option>
                    <option value="likes">Most Liked</option>
                  </select>
                  <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 pointer-events-none" />
                </div>
              </div>

              {/* TABLE LIST BOARD */}
              <div className={cn(
                "rounded-[32px] border overflow-hidden transition-all duration-300 shadow-xl relative",
                themeMode === "dark" ? "bg-[#0c0c0e] border-white/5" : "bg-white border-zinc-200"
              )}>
                {/* Floating Bulk Actions Bar */}
                {selectedIds.length > 0 && (
                  <div className={cn(
                    "p-4 border-b flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-fade-in z-10",
                    themeMode === "dark" ? "bg-zinc-950 border-white/5 text-white" : "bg-zinc-100 border-zinc-200 text-zinc-900"
                  )}>
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-accent animate-pulse" />
                      <span className="text-xs font-bold uppercase tracking-wider">
                        Selected {selectedIds.length} {selectedIds.length === 1 ? "document" : "documents"}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 flex-wrap">
                      <button
                        onClick={() => handleBulkAction("publish")}
                        className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-[10px] font-black uppercase tracking-widest rounded-lg transition-colors"
                      >
                        Publish Selected
                      </button>
                      <button
                        onClick={() => handleBulkAction("archive")}
                        className="px-3 py-1.5 bg-yellow-600 hover:bg-yellow-500 text-white text-[10px] font-black uppercase tracking-widest rounded-lg transition-colors"
                      >
                        Archive Selected
                      </button>
                      <button
                        onClick={() => handleBulkAction("trash")}
                        className="px-3 py-1.5 bg-amber-600 hover:bg-amber-500 text-white text-[10px] font-black uppercase tracking-widest rounded-lg transition-colors"
                      >
                        Move to Trash
                      </button>
                      <button
                        onClick={() => handleBulkAction("delete")}
                        className="px-3 py-1.5 bg-red-600 hover:bg-red-500 text-white text-[10px] font-black uppercase tracking-widest rounded-lg transition-colors"
                      >
                        Delete Forever
                      </button>
                      <button
                        onClick={() => setSelectedIds([])}
                        className="px-3 py-1.5 bg-zinc-700 hover:bg-zinc-600 text-white text-[10px] font-black uppercase tracking-widest rounded-lg transition-colors"
                      >
                        Deselect All
                      </button>
                    </div>
                  </div>
                )}

                {contentLoading ? (
                  <div className="p-20 text-center">
                    <div className="w-10 h-10 border-4 border-accent/20 border-t-accent rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-xs font-mono text-zinc-400 tracking-widest uppercase">Fetching Content Files...</p>
                  </div>
                ) : paginatedItems.length === 0 ? (
                  <div className="p-20 text-center max-w-md mx-auto">
                    <span className="text-zinc-500 text-3xl mb-4 block">📂</span>
                    <h3 className="text-sm font-black uppercase text-white mb-2">No Matching Records Found</h3>
                    <p className="text-xs text-zinc-400">Refine your query, reset the filter keys, or create a new syndicated article.</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className={cn(
                          "border-b text-[10px] font-black uppercase tracking-widest text-zinc-400",
                          themeMode === "dark" ? "border-white/5" : "border-zinc-200"
                        )}>
                          <th className="p-5 w-12 text-center">
                            <input 
                              type="checkbox" 
                              checked={paginatedItems.length > 0 && paginatedItems.every(item => selectedIds.includes(item.id))}
                              onChange={handleSelectAllToggle}
                              className="rounded border-zinc-700 text-accent focus:ring-accent bg-zinc-900 cursor-pointer w-4 h-4"
                            />
                          </th>
                          <th className="p-5">Asset</th>
                          <th className="p-5">Platform</th>
                          <th className="p-5">Category</th>
                          <th className="p-5">Date / Status</th>
                          <th className="p-5">Stats</th>
                          <th className="p-5 text-center">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        {paginatedItems.map(item => (
                          <tr 
                            key={item.id}
                            className={cn(
                              "text-xs transition-colors group",
                              themeMode === "dark" ? "hover:bg-white/5" : "hover:bg-zinc-50"
                            )}
                          >
                            <td className="p-5 text-center">
                              <input 
                                type="checkbox" 
                                checked={selectedIds.includes(item.id)}
                                onChange={() => handleRowSelectToggle(item.id)}
                                className="rounded border-zinc-700 text-accent focus:ring-accent bg-zinc-900 cursor-pointer w-4 h-4"
                              />
                            </td>
                            <td className="p-5">
                              <div className="flex items-center gap-3.5 max-w-xs sm:max-w-md">
                                <img 
                                  src={item.thumbnail || "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80"} 
                                  alt="thumb" 
                                  className="w-12 h-12 rounded-xl object-cover border border-white/5 shrink-0"
                                />
                                <div className="min-w-0">
                                  <div className="flex items-center gap-2">
                                    <h4 className="font-bold text-white truncate text-xs group-hover:text-accent transition-colors">
                                      {item.title}
                                    </h4>
                                    {item.featured && (
                                      <span className="px-1.5 py-0.5 bg-amber-500/10 text-amber-500 border border-amber-500/25 rounded text-[8px] shrink-0 font-bold uppercase tracking-wider">
                                        Pin
                                      </span>
                                    )}
                                  </div>
                                  <p className="text-[10px] text-zinc-400 truncate mt-1">{item.excerpt}</p>
                                </div>
                              </div>
                            </td>
                            <td className="p-5">
                              <span className="font-mono bg-zinc-950/40 text-zinc-300 px-2.5 py-1.5 rounded-lg border border-white/5 text-[10px]">
                                {item.platform}
                              </span>
                            </td>
                            <td className="p-5">
                              <span className="text-[10px] font-black uppercase tracking-wider text-accent">
                                {item.category}
                              </span>
                            </td>
                            <td className="p-5 text-zinc-300 font-mono">
                              {item.publishedDate.toLocaleDateString(undefined, { dateStyle: "medium" })}
                              <div className={cn(
                                "text-[9px] mt-0.5 font-sans uppercase font-bold flex items-center gap-1.5",
                                item.status === "Published" 
                                  ? "text-emerald-400" 
                                  : item.status === "Archived"
                                    ? "text-blue-400"
                                    : "text-yellow-500"
                              )}>
                                <span className={cn(
                                  "w-1.5 h-1.5 rounded-full",
                                  item.status === "Published" 
                                    ? "bg-emerald-400" 
                                    : item.status === "Archived"
                                      ? "bg-blue-400"
                                      : "bg-yellow-500"
                                )} />
                                {item.status} • {item.visibility}
                              </div>
                            </td>
                            <td className="p-5 font-mono text-zinc-400 text-[10px]">
                              <div>Views: {item.views ?? 0}</div>
                              <div>Likes: {item.likes ?? 0}</div>
                            </td>
                            <td className="p-5 text-center">
                              <div className="flex items-center justify-center gap-2">
                                <button
                                  onClick={() => handleOpenPreview(item)}
                                  className="p-2 bg-zinc-900 border border-white/5 hover:border-accent text-zinc-300 hover:text-white rounded-lg transition-colors"
                                  title="View Public Card"
                                >
                                  <Eye className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => handleEditInitiate(item)}
                                  className="p-2 bg-zinc-900 border border-white/5 hover:border-accent text-zinc-300 hover:text-white rounded-lg transition-colors"
                                  title="Edit Content"
                                >
                                  <Edit className="w-3.5 h-3.5" />
                                </button>
                                {item.status === "Published" ? (
                                  <button
                                    onClick={() => handleArchiveConfirm(item.id, item.title)}
                                    className="p-2 bg-zinc-900 border border-white/5 hover:border-yellow-500 text-zinc-300 hover:text-yellow-400 rounded-lg transition-colors"
                                    title="Archive Content"
                                  >
                                    <Archive className="w-3.5 h-3.5" />
                                  </button>
                                ) : (
                                  <button
                                    onClick={async () => {
                                      try {
                                        await publishItem(item.id);
                                        triggerToast(`"${item.title}" published successfully!`, "success");
                                      } catch (err: any) {
                                        triggerToast("Publish failed: " + err.message, "error");
                                      }
                                    }}
                                    className="p-2 bg-zinc-900 border border-white/5 hover:border-emerald-500 text-zinc-300 hover:text-emerald-400 rounded-lg transition-colors"
                                    title="Publish Content"
                                  >
                                    <CheckCircle className="w-3.5 h-3.5" />
                                  </button>
                                )}
                                <button
                                  onClick={() => handleDeleteConfirm(item.id, item.title)}
                                  className="p-2 bg-zinc-900 border border-white/5 hover:border-red-500 text-zinc-300 hover:text-red-400 rounded-lg transition-colors"
                                  title="Move to Trash"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {/* PAGINATION CONTROLS */}
                {totalPages > 1 && !contentLoading && (
                  <div className={cn(
                    "p-5 border-t flex items-center justify-between transition-colors text-xs font-mono",
                    themeMode === "dark" ? "border-white/5 text-zinc-400" : "border-zinc-200 text-zinc-600"
                  )}>
                    <button 
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                      className="px-4 py-2.5 rounded-lg border border-white/5 bg-zinc-950/50 hover:bg-zinc-900 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5"
                    >
                      <ChevronLeft className="w-4 h-4" /> Previous
                    </button>

                    <span>Page {currentPage} of {totalPages}</span>

                    <button 
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                      className="px-4 py-2.5 rounded-lg border border-white/5 bg-zinc-950/50 hover:bg-zinc-900 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5"
                    >
                      Next <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                )}

              </div>

            </div>
          )}

          {/* VIEW: ARCHIVED CENTER */}
          {activeTab === "archived" && (
            <div className="space-y-6 animate-fade-in" id="content-archived-tab">
              <div>
                <h2 className="text-xl md:text-2xl font-black uppercase tracking-tight font-display text-white">Archives Center</h2>
                <p className="text-xs font-mono text-zinc-400 mt-1">Manage archived content. Archives are preserved in Firestore but hidden from the public website.</p>
              </div>

              <div className={cn(
                "rounded-[32px] border overflow-hidden transition-all duration-300 shadow-xl",
                themeMode === "dark" ? "bg-[#0c0c0e] border-white/5" : "bg-white border-zinc-200"
              )}>
                {contentLoading ? (
                  <div className="p-20 text-center">
                    <div className="w-10 h-10 border-4 border-accent/20 border-t-accent rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-xs font-mono text-zinc-400 tracking-widest uppercase">Loading Archives...</p>
                  </div>
                ) : items.filter(i => i.status === "Archived").length === 0 ? (
                  <div className="p-20 text-center max-w-md mx-auto">
                    <span className="text-zinc-500 text-3xl mb-4 block">📂</span>
                    <h3 className="text-sm font-black uppercase text-white mb-2">No Archives Found</h3>
                    <p className="text-xs text-zinc-400">Archived documents will appear here. You can archive content from the Syndicated List.</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className={cn(
                          "border-b text-[10px] font-black uppercase tracking-widest text-zinc-400",
                          themeMode === "dark" ? "border-white/5" : "border-zinc-200"
                        )}>
                          <th className="p-5">Asset</th>
                          <th className="p-5">Platform</th>
                          <th className="p-5">Category</th>
                          <th className="p-5">Archived At</th>
                          <th className="p-5 text-center">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        {items.filter(i => i.status === "Archived").map(item => (
                          <tr 
                            key={item.id}
                            className={cn(
                              "text-xs transition-colors group",
                              themeMode === "dark" ? "hover:bg-white/5" : "hover:bg-zinc-50"
                            )}
                          >
                            <td className="p-5">
                              <div className="flex items-center gap-3.5 max-w-xs sm:max-w-md">
                                <img 
                                  src={item.thumbnail || "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80"} 
                                  alt="thumb" 
                                  className="w-12 h-12 rounded-xl object-cover border border-white/5 shrink-0"
                                />
                                <div className="min-w-0">
                                  <h4 className="font-bold text-white truncate text-xs group-hover:text-accent transition-colors">
                                    {item.title}
                                  </h4>
                                  <p className="text-[10px] text-zinc-400 truncate mt-1">{item.excerpt}</p>
                                </div>
                              </div>
                            </td>
                            <td className="p-5">
                              <span className="font-mono bg-zinc-950/40 text-zinc-300 px-2.5 py-1.5 rounded-lg border border-white/5 text-[10px]">
                                {item.platform}
                              </span>
                            </td>
                            <td className="p-5">
                              <span className="text-[10px] font-black uppercase tracking-wider text-accent">
                                {item.category}
                              </span>
                            </td>
                            <td className="p-5 text-zinc-300 font-mono">
                              {item.archivedAt 
                                ? item.archivedAt.toLocaleDateString(undefined, { dateStyle: "medium" })
                                : item.publishedDate.toLocaleDateString(undefined, { dateStyle: "medium" })}
                            </td>
                            <td className="p-5 text-center">
                              <div className="flex items-center justify-center gap-2">
                                <button
                                  onClick={async () => {
                                    try {
                                      await publishItem(item.id);
                                      triggerToast(`"${item.title}" restored to Published!`, "success");
                                    } catch (err: any) {
                                      triggerToast("Publish failed: " + err.message, "error");
                                    }
                                  }}
                                  className="p-2 bg-zinc-900 border border-white/5 hover:border-emerald-500 text-zinc-300 hover:text-emerald-400 rounded-lg transition-colors"
                                  title="Publish Asset"
                                >
                                  <CheckCircle className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => handleDeleteConfirm(item.id, item.title)}
                                  className="p-2 bg-zinc-900 border border-white/5 hover:border-red-500 text-zinc-300 hover:text-red-400 rounded-lg transition-colors"
                                  title="Move to Trash"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* VIEW: TRASH CENTER */}
          {activeTab === "trash" && (
            <div className="space-y-6 animate-fade-in" id="content-trash-tab">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl md:text-2xl font-black uppercase tracking-tight font-display text-white">Trash Center</h2>
                  <p className="text-xs font-mono text-zinc-400 mt-1">Review soft-deleted documents. Restored files go back to Published status. Permanently deleted records cannot be recovered.</p>
                </div>

                {items.filter(i => i.status === "Trash").length > 0 && (
                  <button
                    onClick={() => {
                      triggerConfirm(
                        "Empty Trash Center?",
                        "Are you sure you want to permanently delete ALL trashed content? This action cannot be undone.",
                        async () => {
                          const trashIds = items.filter(i => i.status === "Trash").map(i => i.id);
                          await Promise.all(trashIds.map(id => deleteItemForever(id)));
                          triggerToast("Trash Center emptied successfully!", "success");
                        },
                        "Empty Trash",
                        "danger"
                      );
                    }}
                    className="px-5 py-3 bg-red-600 hover:bg-red-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-xl shadow-red-900/15 flex items-center justify-center gap-2 self-start"
                  >
                    <Trash2 className="w-4 h-4" /> Empty Trash
                  </button>
                )}
              </div>

              <div className={cn(
                "rounded-[32px] border overflow-hidden transition-all duration-300 shadow-xl",
                themeMode === "dark" ? "bg-[#0c0c0e] border-white/5" : "bg-white border-zinc-200"
              )}>
                {contentLoading ? (
                  <div className="p-20 text-center">
                    <div className="w-10 h-10 border-4 border-accent/20 border-t-accent rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-xs font-mono text-zinc-400 tracking-widest uppercase">Loading Trash Center...</p>
                  </div>
                ) : items.filter(i => i.status === "Trash").length === 0 ? (
                  <div className="p-20 text-center max-w-md mx-auto">
                    <span className="text-zinc-500 text-3xl mb-4 block">🗑️</span>
                    <h3 className="text-sm font-black uppercase text-white mb-2">Trash Center is Empty</h3>
                    <p className="text-xs text-zinc-400">Great! No soft-deleted content found inside this collection.</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className={cn(
                          "border-b text-[10px] font-black uppercase tracking-widest text-zinc-400",
                          themeMode === "dark" ? "border-white/5" : "border-zinc-200"
                        )}>
                          <th className="p-5">Asset</th>
                          <th className="p-5">Platform</th>
                          <th className="p-5">Deleted At</th>
                          <th className="p-5 text-center">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        {items.filter(i => i.status === "Trash").map(item => (
                          <tr 
                            key={item.id}
                            className={cn(
                              "text-xs transition-colors group",
                              themeMode === "dark" ? "hover:bg-white/5" : "hover:bg-zinc-50"
                            )}
                          >
                            <td className="p-5">
                              <div className="flex items-center gap-3.5 max-w-xs sm:max-w-md">
                                <img 
                                  src={item.thumbnail || "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80"} 
                                  alt="thumb" 
                                  className="w-12 h-12 rounded-xl object-cover border border-white/5 shrink-0 grayscale opacity-60"
                                />
                                <div className="min-w-0">
                                  <h4 className="font-bold text-zinc-400 truncate text-xs group-hover:text-white transition-colors">
                                    {item.title}
                                  </h4>
                                  <p className="text-[10px] text-zinc-500 truncate mt-1">{item.excerpt}</p>
                                </div>
                              </div>
                            </td>
                            <td className="p-5">
                              <span className="font-mono bg-zinc-950/40 text-zinc-400 px-2.5 py-1.5 rounded-lg border border-white/5 text-[10px]">
                                {item.platform}
                              </span>
                            </td>
                            <td className="p-5 text-zinc-400 font-mono">
                              {item.deletedAt 
                                ? item.deletedAt.toLocaleDateString(undefined, { dateStyle: "medium" })
                                : item.publishedDate.toLocaleDateString(undefined, { dateStyle: "medium" })}
                            </td>
                            <td className="p-5 text-center">
                              <div className="flex items-center justify-center gap-2">
                                <button
                                  onClick={() => handleRestoreClick(item.id, item.title)}
                                  className="p-2 bg-zinc-900 border border-white/5 hover:border-emerald-500 text-zinc-300 hover:text-emerald-400 rounded-lg transition-colors"
                                  title="Restore Asset"
                                >
                                  <RotateCcw className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => handleDeleteForeverConfirm(item.id, item.title)}
                                  className="p-2 bg-zinc-900 border border-white/5 hover:border-red-500 text-zinc-300 hover:text-red-400 rounded-lg transition-colors"
                                  title="Delete Forever"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* VIEW: AUTOMATION SECTION */}
          {activeTab === "automation" && (
            <AutomationSection themeMode={themeMode} triggerToast={triggerToast} />
          )}

          {/* VIEW: BLOG WRITER SUITE */}
          {activeTab === "blog-writer" && (
            <BlogWriterSection
              themeMode={themeMode}
              triggerToast={triggerToast}
              items={items}
              addItem={addItem}
              editItem={editItem}
              onSuccess={() => {
                refresh();
                setActiveTab("list");
              }}
            />
          )}

          {/* VIEW: CREATE/EDIT FORM AND SEO MODULE */}
          {activeTab === "form" && (
            <form onSubmit={handleSaveContent} className="space-y-8 animate-fade-in" id="content-form-tab">
              
              {/* Action bar and trigger */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl md:text-2xl font-black uppercase tracking-tight font-display text-white">
                    {editingId ? "Revise Portfolio Metadata" : "Syntricate Content Asset"}
                  </h2>
                  <p className="text-xs font-mono text-zinc-400 mt-1">Configure database fields, file paths, author roles, and SEO indexing keys.</p>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={handleLivePreview}
                    className="px-5 py-3 border border-white/5 hover:border-accent bg-zinc-950/50 rounded-xl text-[10px] font-black uppercase tracking-widest text-zinc-300 hover:text-white transition-all flex items-center gap-1.5"
                  >
                    <Eye className="w-4 h-4" /> Real-Time Card
                  </button>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-6 py-3 bg-accent hover:bg-white text-white hover:text-black rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-xl shadow-accent/15 flex items-center gap-2"
                  >
                    {isSubmitting ? (
                      <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                    ) : (
                      editingId ? "Update Document" : "Publish Content"
                    )}
                  </button>
                </div>
              </div>

              {/* TWO COLUMN WORKSPACE */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                
                {/* Column Left: Base metadata fields */}
                <div className="lg:col-span-8 space-y-6">
                  
                  {/* Card Section 1: Standard Properties */}
                  <div className={cn(
                    "p-8 rounded-[40px] border transition-all duration-300 space-y-5",
                    themeMode === "dark" ? "bg-[#0c0c0e] border-white/5" : "bg-white border-zinc-200"
                  )}>
                    <h3 className="text-sm font-black uppercase tracking-wider text-white mb-2 flex items-center gap-2">
                      <FileText className="w-4 h-4 text-accent" /> Base Content Attributes
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      {/* Title */}
                      <div className="md:col-span-2">
                        <label className="block text-[10px] font-black uppercase tracking-wider text-zinc-400 mb-2">Content Title</label>
                        <input 
                          type="text" 
                          required
                          value={formTitle}
                          onChange={(e) => {
                            setFormTitle(e.target.value);
                            // Auto fill meta title for convenience
                            if (!metaTitle) setMetaTitle(e.target.value);
                          }}
                          placeholder="e.g. Scaling Omnichannel Marketing Hook Loops"
                          className={cn(
                            "w-full px-4 py-3 rounded-xl border text-xs outline-none transition-all",
                            themeMode === "dark" ? "bg-zinc-900 border-white/5 text-white focus:border-accent" : "bg-zinc-50 border-zinc-200 text-zinc-900 focus:border-accent"
                          )}
                        />
                      </div>

                      {/* Excerpt */}
                      <div className="md:col-span-2">
                        <label className="block text-[10px] font-black uppercase tracking-wider text-zinc-400 mb-2">Short Excerpt (Grid Card Preview Text)</label>
                        <textarea 
                          required
                          rows={2}
                          value={formExcerpt}
                          onChange={(e) => {
                            setFormExcerpt(e.target.value);
                            // Auto fill meta desc
                            if (!metaDescription) setMetaDescription(e.target.value);
                          }}
                          placeholder="An elegant high-level description used to capture visitor's interest in the feeds."
                          className={cn(
                            "w-full px-4 py-3 rounded-xl border text-xs outline-none transition-all resize-none",
                            themeMode === "dark" ? "bg-zinc-900 border-white/5 text-white focus:border-accent" : "bg-zinc-50 border-zinc-200 text-zinc-900 focus:border-accent"
                          )}
                        />
                      </div>

                      {/* Full description */}
                      <div className="md:col-span-2">
                        <label className="block text-[10px] font-black uppercase tracking-wider text-zinc-400 mb-2">Full Core Description (Rich Text/Markdown compatible)</label>
                        <textarea 
                          required
                          rows={6}
                          value={formDescription}
                          onChange={(e) => setFormDescription(e.target.value)}
                          placeholder="Complete, fully-fledged copy summarizing the case study, article details, or social platform assets..."
                          className={cn(
                            "w-full px-4 py-3 rounded-xl border text-xs outline-none transition-all",
                            themeMode === "dark" ? "bg-zinc-900 border-white/5 text-white focus:border-accent" : "bg-zinc-50 border-zinc-200 text-zinc-900 focus:border-accent"
                          )}
                        />
                      </div>

                    </div>
                  </div>

                  {/* Card Section 2: Media and Links */}
                  <div className={cn(
                    "p-8 rounded-[40px] border transition-all duration-300 space-y-5",
                    themeMode === "dark" ? "bg-[#0c0c0e] border-white/5" : "bg-white border-zinc-200"
                  )}>
                    <h3 className="text-sm font-black uppercase tracking-wider text-white mb-2 flex items-center gap-2">
                      <UploadCloud className="w-4 h-4 text-accent" /> Media, Taxonomy, & Destination URL
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      
                      {/* Thumbnail URL / Upload */}
                      <div className="md:col-span-2">
                        <label className="block text-[10px] font-black uppercase tracking-wider text-zinc-400 mb-2">Cover Thumbnail Resource</label>
                        <div className="flex flex-col sm:flex-row gap-3">
                          <input 
                            type="text" 
                            required
                            value={formThumbnail}
                            onChange={(e) => setFormThumbnail(e.target.value)}
                            placeholder="https://images.unsplash.com/photo-..."
                            className={cn(
                              "flex-1 px-4 py-3 rounded-xl border text-xs outline-none transition-all",
                              themeMode === "dark" ? "bg-zinc-900 border-white/5 text-white focus:border-accent" : "bg-zinc-50 border-zinc-200 text-zinc-900 focus:border-accent"
                            )}
                          />

                          <div className="relative shrink-0">
                            <input 
                              type="file" 
                              id="thumb-upload-input"
                              accept="image/*"
                              disabled={isUploading}
                              onChange={handleThumbnailUpload}
                              className="absolute inset-0 opacity-0 w-full h-full cursor-pointer disabled:cursor-not-allowed"
                            />
                            <button 
                              type="button"
                              className={cn(
                                "w-full sm:w-auto px-5 py-3 border border-white/5 bg-zinc-950/40 hover:bg-zinc-900 text-zinc-300 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-1.5 transition-colors",
                                isUploading && "opacity-60"
                              )}
                            >
                              <UploadCloud className="w-4 h-4 text-accent" /> Upload Image
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Destination URL */}
                      <div>
                        <label className="block text-[10px] font-black uppercase tracking-wider text-zinc-400 mb-2">External Destination URL</label>
                        <input 
                          type="text" 
                          value={formUrl}
                          onChange={(e) => setFormUrl(e.target.value)}
                          placeholder="e.g. https://medium.com/@kiran/..."
                          className={cn(
                            "w-full px-4 py-3 rounded-xl border text-xs outline-none transition-all",
                            themeMode === "dark" ? "bg-zinc-900 border-white/5 text-white focus:border-accent" : "bg-zinc-50 border-zinc-200 text-zinc-900 focus:border-accent"
                          )}
                        />
                      </div>

                      {/* Platform */}
                      <div>
                        <label className="block text-[10px] font-black uppercase tracking-wider text-zinc-400 mb-2">Target Syndicated Platform</label>
                        <select 
                          value={formPlatform}
                          onChange={(e) => setFormPlatform(e.target.value as any)}
                          className={cn(
                            "w-full px-4 py-3 rounded-xl text-xs outline-none border font-semibold uppercase tracking-wider",
                            themeMode === "dark" ? "bg-zinc-900 border-white/5 text-zinc-200 focus:border-accent" : "bg-zinc-50 border-zinc-200 text-zinc-700 focus:border-accent"
                          )}
                        >
                          <option value="Blogger">Blogger</option>
                          <option value="Medium">Medium</option>
                          <option value="Portfolio">Portfolio</option>
                          <option value="Instagram">Instagram</option>
                          <option value="YouTube">YouTube</option>
                          <option value="LinkedIn">LinkedIn</option>
                          <option value="X">X</option>
                          <option value="Threads">Threads</option>
                          <option value="Podcast">Podcast</option>
                          <option value="Case Study">Case Study</option>
                          <option value="Resource">Resource</option>
                        </select>
                      </div>

                      {/* Content Type */}
                      <div>
                        <label className="block text-[10px] font-black uppercase tracking-wider text-zinc-400 mb-2">Content Type Classification</label>
                        <select 
                          value={formContentType}
                          onChange={(e) => setFormContentType(e.target.value as any)}
                          className={cn(
                            "w-full px-4 py-3 rounded-xl text-xs outline-none border font-semibold uppercase tracking-wider",
                            themeMode === "dark" ? "bg-zinc-900 border-white/5 text-zinc-200 focus:border-accent" : "bg-zinc-50 border-zinc-200 text-zinc-700 focus:border-accent"
                          )}
                        >
                          <option value="Blog">Blog</option>
                          <option value="Video">Video</option>
                          <option value="Social Post">Social Post</option>
                          <option value="Case Study">Case Study</option>
                          <option value="Resource">Resource</option>
                          <option value="Audio">Audio</option>
                        </select>
                      </div>

                      {/* Category */}
                      <div>
                        <label className="block text-[10px] font-black uppercase tracking-wider text-zinc-400 mb-2">Taxonomy Category</label>
                        <select 
                          value={formCategory}
                          onChange={(e) => setFormCategory(e.target.value as any)}
                          className={cn(
                            "w-full px-4 py-3 rounded-xl text-xs outline-none border font-semibold uppercase tracking-wider",
                            themeMode === "dark" ? "bg-zinc-900 border-white/5 text-zinc-200 focus:border-accent" : "bg-zinc-50 border-zinc-200 text-zinc-700 focus:border-accent"
                          )}
                        >
                          <option value="Growth">Growth</option>
                          <option value="Marketing">Marketing</option>
                          <option value="AI">AI</option>
                          <option value="SEO Tips">SEO Tips</option>
                          <option value="Compliance">Compliance</option>
                          <option value="Retention">Retention</option>
                        </select>
                      </div>

                      {/* Tags creation */}
                      <div className="md:col-span-2">
                        <label className="block text-[10px] font-black uppercase tracking-wider text-zinc-400 mb-2">Taxonomy Tags</label>
                        <div className="flex gap-2">
                          <input 
                            type="text" 
                            value={formTagInput}
                            onChange={(e) => setFormTagInput(e.target.value)}
                            onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); handleAddTag(); } }}
                            placeholder="Add tag (Press Enter or Add button)"
                            className={cn(
                              "flex-1 px-4 py-3 rounded-xl border text-xs outline-none transition-all",
                              themeMode === "dark" ? "bg-zinc-900 border-white/5 text-white focus:border-accent" : "bg-zinc-50 border-zinc-200 text-zinc-900 focus:border-accent"
                            )}
                          />
                          <button 
                            type="button" 
                            onClick={handleAddTag}
                            className="px-5 bg-zinc-900 text-white border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-wider hover:bg-white hover:text-black transition-all"
                          >
                            Add
                          </button>
                        </div>

                        {/* Staged tags container */}
                        {formTags.length > 0 && (
                          <div className="flex flex-wrap gap-2.5 mt-3">
                            {formTags.map(tag => (
                              <span 
                                key={tag} 
                                className="flex items-center gap-1.5 px-3 py-1 bg-zinc-950 border border-white/10 rounded-full text-[10px] text-zinc-300"
                              >
                                <Tag className="w-3 h-3 text-accent" /> {tag}
                                <button 
                                  type="button" 
                                  onClick={() => handleRemoveTag(tag)}
                                  className="text-red-400 hover:text-white ml-1 font-bold"
                                >
                                  ×
                                </button>
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                    </div>
                  </div>

                  {/* Card Section 3: Author details */}
                  <div className={cn(
                    "p-8 rounded-[40px] border transition-all duration-300 space-y-5",
                    themeMode === "dark" ? "bg-[#0c0c0e] border-white/5" : "bg-white border-zinc-200"
                  )}>
                    <h3 className="text-sm font-black uppercase tracking-wider text-white mb-2 flex items-center gap-2">
                      <UserIcon className="w-4 h-4 text-accent" /> Author Attribution profile
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-[10px] font-black uppercase tracking-wider text-zinc-400 mb-2">Author Name</label>
                        <input 
                          type="text" 
                          value={authorName}
                          onChange={(e) => setAuthorName(e.target.value)}
                          placeholder="e.g. G. Hari Kiran"
                          className={cn(
                            "w-full px-4 py-3 rounded-xl border text-xs outline-none transition-all",
                            themeMode === "dark" ? "bg-zinc-900 border-white/5 text-white focus:border-accent" : "bg-zinc-50 border-zinc-200 text-zinc-900 focus:border-accent"
                          )}
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-black uppercase tracking-wider text-zinc-400 mb-2">Author Professional Role</label>
                        <input 
                          type="text" 
                          value={authorRole}
                          onChange={(e) => setAuthorRole(e.target.value)}
                          placeholder="e.g. Growth Strategist"
                          className={cn(
                            "w-full px-4 py-3 rounded-xl border text-xs outline-none transition-all",
                            themeMode === "dark" ? "bg-zinc-900 border-white/5 text-white focus:border-accent" : "bg-zinc-50 border-zinc-200 text-zinc-900 focus:border-accent"
                          )}
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-[10px] font-black uppercase tracking-wider text-zinc-400 mb-2">Author Avatar URL</label>
                        <input 
                          type="text" 
                          value={authorImage}
                          onChange={(e) => setAuthorImage(e.target.value)}
                          placeholder="https://..."
                          className={cn(
                            "w-full px-4 py-3 rounded-xl border text-xs outline-none transition-all",
                            themeMode === "dark" ? "bg-zinc-900 border-white/5 text-white focus:border-accent" : "bg-zinc-50 border-zinc-200 text-zinc-900 focus:border-accent"
                          )}
                        />
                      </div>
                    </div>
                  </div>

                </div>

                {/* Column Right: Settings, SEO and Status parameters */}
                <div className="lg:col-span-4 space-y-6">
                  
                  {/* Status Panel */}
                  <div className={cn(
                    "p-6 rounded-[32px] border transition-all duration-300 space-y-5",
                    themeMode === "dark" ? "bg-[#0c0c0e] border-white/5" : "bg-white border-zinc-200"
                  )}>
                    <h3 className="text-sm font-black uppercase tracking-wider text-white">Asset Settings</h3>

                    <div>
                      <label className="block text-[10px] font-black uppercase tracking-wider text-zinc-400 mb-2">Publishing Status</label>
                      <div className="flex gap-3">
                        <button
                          type="button"
                          onClick={() => setFormStatus("Published")}
                          className={cn(
                            "flex-1 py-3 border rounded-xl text-[10px] font-black uppercase tracking-wider transition-all",
                            formStatus === "Published"
                              ? "bg-emerald-500/10 border-emerald-500 text-emerald-400 font-bold"
                              : "border-white/5 hover:border-zinc-700 text-zinc-400"
                          )}
                        >
                          Published
                        </button>
                        <button
                          type="button"
                          onClick={() => setFormStatus("Draft")}
                          className={cn(
                            "flex-1 py-3 border rounded-xl text-[10px] font-black uppercase tracking-wider transition-all",
                            formStatus === "Draft"
                              ? "bg-yellow-500/10 border-yellow-500 text-yellow-500 font-bold"
                              : "border-white/5 hover:border-zinc-700 text-zinc-400"
                          )}
                        >
                          Draft
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] font-black uppercase tracking-wider text-zinc-400 mb-2">Audience Visibility</label>
                      <div className="flex gap-3">
                        <button
                          type="button"
                          onClick={() => setFormVisibility("public")}
                          className={cn(
                            "flex-1 py-3 border rounded-xl text-[10px] font-black uppercase tracking-wider transition-all",
                            formVisibility === "public"
                              ? "bg-accent/10 border-accent text-accent font-bold"
                              : "border-white/5 hover:border-zinc-700 text-zinc-400"
                          )}
                        >
                          Public
                        </button>
                        <button
                          type="button"
                          onClick={() => setFormVisibility("private")}
                          className={cn(
                            "flex-1 py-3 border rounded-xl text-[10px] font-black uppercase tracking-wider transition-all",
                            formVisibility === "private"
                              ? "bg-indigo-500/10 border-indigo-500 text-indigo-400 font-bold"
                              : "border-white/5 hover:border-zinc-700 text-zinc-400"
                          )}
                        >
                          Private
                        </button>
                      </div>
                    </div>

                    {/* Featured pinned tag */}
                    <div className="flex items-center justify-between p-3.5 rounded-2xl bg-zinc-950/40 border border-white/5">
                      <div>
                        <span className="block text-xs font-bold text-white">Featured Asset Pin</span>
                        <span className="block text-[9px] text-zinc-400 font-mono mt-0.5">Pins article to the top spot</span>
                      </div>
                      <input 
                        type="checkbox" 
                        checked={formFeatured}
                        onChange={(e) => setFormFeatured(e.target.checked)}
                        className="w-5 h-5 rounded border border-white/5 accent-accent cursor-pointer"
                      />
                    </div>

                    {/* Numeric parameters (views, likes) */}
                    <div className="grid grid-cols-2 gap-4 pt-2">
                      <div>
                        <label className="block text-[9px] font-black uppercase tracking-wider text-zinc-400 mb-1.5">Views</label>
                        <input 
                          type="number" 
                          value={formViews}
                          onChange={(e) => setFormViews(Number(e.target.value))}
                          className={cn(
                            "w-full px-3 py-2.5 rounded-xl border text-xs font-mono outline-none",
                            themeMode === "dark" ? "bg-zinc-900 border-white/5 text-white" : "bg-zinc-50 border-zinc-200 text-zinc-900"
                          )}
                        />
                      </div>
                      <div>
                        <label className="block text-[9px] font-black uppercase tracking-wider text-zinc-400 mb-1.5">Likes</label>
                        <input 
                          type="number" 
                          value={formLikes}
                          onChange={(e) => setFormLikes(Number(e.target.value))}
                          className={cn(
                            "w-full px-3 py-2.5 rounded-xl border text-xs font-mono outline-none",
                            themeMode === "dark" ? "bg-zinc-900 border-white/5 text-white" : "bg-zinc-50 border-zinc-200 text-zinc-900"
                          )}
                        />
                      </div>
                    </div>

                    {/* Date picker */}
                    <div className="grid grid-cols-1 gap-4">
                      <div>
                        <label className="block text-[10px] font-black uppercase tracking-wider text-zinc-400 mb-2">Publishing Calendar Date</label>
                        <input 
                          type="date" 
                          required
                          value={formPublishedDate}
                          onChange={(e) => setFormPublishedDate(e.target.value)}
                          className={cn(
                            "w-full px-4 py-3 rounded-xl border text-xs outline-none transition-all",
                            themeMode === "dark" ? "bg-zinc-900 border-white/5 text-white focus:border-accent" : "bg-zinc-50 border-zinc-200 text-zinc-900 focus:border-accent"
                          )}
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-black uppercase tracking-wider text-zinc-400 mb-2">Calculated Read Time</label>
                        <input 
                          type="text" 
                          value={formReadTime}
                          onChange={(e) => setFormReadTime(e.target.value)}
                          placeholder="e.g. 5 min read"
                          className={cn(
                            "w-full px-4 py-3 rounded-xl border text-xs outline-none transition-all",
                            themeMode === "dark" ? "bg-zinc-900 border-white/5 text-white focus:border-accent" : "bg-zinc-50 border-zinc-200 text-zinc-900 focus:border-accent"
                          )}
                        />
                      </div>
                    </div>

                  </div>

                  {/* SEO METADATA PANEL */}
                  <div className={cn(
                    "p-6 rounded-[32px] border transition-all duration-300 space-y-5",
                    themeMode === "dark" ? "bg-[#0c0c0e] border-white/5" : "bg-white border-zinc-200"
                  )}>
                    <h3 className="text-sm font-black uppercase tracking-wider text-white flex items-center gap-2">
                      <Globe className="w-4 h-4 text-accent" /> Search Engine Optimization
                    </h3>

                    {/* Meta Title */}
                    <div>
                      <label className="block text-[10px] font-black uppercase tracking-wider text-zinc-400 mb-1.5">Meta Title</label>
                      <input 
                        type="text" 
                        value={metaTitle}
                        onChange={(e) => setMetaTitle(e.target.value)}
                        placeholder="Title used for browser tabs & google index"
                        className={cn(
                          "w-full px-4 py-2.5 rounded-xl border text-xs outline-none transition-all",
                          themeMode === "dark" ? "bg-zinc-900 border-white/5 text-white" : "bg-zinc-50 border-zinc-200 text-zinc-900"
                        )}
                      />
                    </div>

                    {/* Meta Description */}
                    <div>
                      <label className="block text-[10px] font-black uppercase tracking-wider text-zinc-400 mb-1.5">Meta Description</label>
                      <textarea 
                        rows={3}
                        value={metaDescription}
                        onChange={(e) => setMetaDescription(e.target.value)}
                        placeholder="Snippet summarizing article on Google listing cards"
                        className={cn(
                          "w-full px-4 py-2.5 rounded-xl border text-xs outline-none transition-all resize-none",
                          themeMode === "dark" ? "bg-zinc-900 border-white/5 text-white" : "bg-zinc-50 border-zinc-200 text-zinc-900"
                        )}
                      />
                    </div>

                    {/* Canonical URL */}
                    <div>
                      <label className="block text-[10px] font-black uppercase tracking-wider text-zinc-400 mb-1.5">Canonical Link</label>
                      <input 
                        type="text" 
                        value={canonicalUrl}
                        onChange={(e) => setCanonicalUrl(e.target.value)}
                        placeholder="https://original-link.com"
                        className={cn(
                          "w-full px-4 py-2.5 rounded-xl border text-xs outline-none transition-all",
                          themeMode === "dark" ? "bg-zinc-900 border-white/5 text-white" : "bg-zinc-50 border-zinc-200 text-zinc-900"
                        )}
                      />
                    </div>

                    {/* Robots */}
                    <div>
                      <label className="block text-[10px] font-black uppercase tracking-wider text-zinc-400 mb-1.5">Crawler indexing (Robots)</label>
                      <select 
                        value={robots}
                        onChange={(e) => setRobots(e.target.value)}
                        className={cn(
                          "w-full px-4 py-2.5 rounded-xl text-xs outline-none border",
                          themeMode === "dark" ? "bg-zinc-900 border-white/5 text-zinc-200" : "bg-zinc-50 border-zinc-200 text-zinc-700"
                        )}
                      >
                        <option value="index, follow">index, follow (Standard)</option>
                        <option value="noindex, nofollow">noindex, nofollow (Hidden)</option>
                        <option value="index, nofollow">index, nofollow</option>
                        <option value="noindex, follow">noindex, follow</option>
                      </select>
                    </div>

                    {/* Open Graph OG Image */}
                    <div>
                      <label className="block text-[10px] font-black uppercase tracking-wider text-zinc-400 mb-1.5">Open Graph Cover Link (og:image)</label>
                      <input 
                        type="text" 
                        value={ogImage}
                        onChange={(e) => setOgImage(e.target.value)}
                        placeholder="Fallback image URL for social media cards"
                        className={cn(
                          "w-full px-4 py-2.5 rounded-xl border text-xs outline-none transition-all",
                          themeMode === "dark" ? "bg-zinc-900 border-white/5 text-white" : "bg-zinc-50 border-zinc-200 text-zinc-900"
                        )}
                      />
                    </div>

                    {/* Open Graph ogType */}
                    <div>
                      <label className="block text-[10px] font-black uppercase tracking-wider text-zinc-400 mb-1.5">OG Card Classification (og:type)</label>
                      <input 
                        type="text" 
                        value={ogType}
                        onChange={(e) => setOgType(e.target.value)}
                        placeholder="e.g. article, website"
                        className={cn(
                          "w-full px-4 py-2.5 rounded-xl border text-xs outline-none transition-all",
                          themeMode === "dark" ? "bg-zinc-900 border-white/5 text-white" : "bg-zinc-50 border-zinc-200 text-zinc-900"
                        )}
                      />
                    </div>

                  </div>

                </div>

              </div>

            </form>
          )}

        </main>
      </div>

      {/* MODAL: PREVIEW ITEM DETAILS */}
      {isPreviewOpen && previewItem && (
        <div className="fixed inset-0 z-[9999] bg-[#070708]/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-lg rounded-[40px] bg-[#0c0c0e] border border-white/5 overflow-hidden shadow-2xl relative max-h-[90vh] flex flex-col">
            
            {/* Modal close */}
            <button 
              onClick={() => { setIsPreviewOpen(false); setPreviewItem(null); }}
              className="absolute top-6 right-6 p-2 bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white rounded-full transition-colors z-20"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="overflow-y-auto flex-1 p-6 md:p-8 space-y-6">
              
              {/* Cover layout */}
              <div className="relative rounded-3xl overflow-hidden aspect-video border border-white/5">
                <img 
                  src={previewItem.thumbnail || "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80"} 
                  alt={previewItem.title} 
                  className="w-full h-full object-cover"
                />
                
                <div className="absolute top-4 left-4 flex gap-2">
                  <span className="px-3 py-1 bg-[#070708]/85 text-accent border border-accent/25 rounded-full text-[9px] font-black uppercase tracking-wider backdrop-blur-md">
                    {previewItem.platform}
                  </span>
                  {previewItem.featured && (
                    <span className="px-3 py-1 bg-amber-500 text-black rounded-full text-[9px] font-black uppercase tracking-wider shadow-lg">
                      Featured Pin
                    </span>
                  )}
                </div>
              </div>

              {/* Title & Metadata */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-[10px] font-mono text-zinc-400 uppercase tracking-widest">
                  <span>{previewItem.contentType}</span>
                  <span>•</span>
                  <span>{previewItem.category}</span>
                  <span>•</span>
                  <span>{previewItem.readTime}</span>
                </div>

                <h3 className="text-xl font-black font-display text-white tracking-tight leading-snug">
                  {previewItem.title}
                </h3>
              </div>

              {/* Author attribution */}
              <div className="flex items-center gap-3 p-4 rounded-2xl bg-zinc-950/50 border border-white/5">
                <img 
                  src={(previewItem.author.image && previewItem.author.image.trim() !== "") ? previewItem.author.image : "https://i.postimg.cc/d1MxW0j1/Hari-Portfolio.png"} 
                  alt={previewItem.author.name} 
                  className="w-9 h-9 rounded-full object-cover shrink-0"
                />
                <div>
                  <h5 className="text-xs font-bold text-white leading-tight">{previewItem.author.name}</h5>
                  <p className="text-[10px] text-zinc-400 font-mono">{previewItem.author.role}</p>
                </div>
              </div>

              {/* Excerpt */}
              <div className="space-y-1.5">
                <h4 className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Excerpt / Abstract</h4>
                <p className="text-xs text-zinc-300 leading-relaxed font-sans">{previewItem.excerpt}</p>
              </div>

              {/* Core Body Description */}
              <div className="space-y-1.5">
                <h4 className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Core Content Body</h4>
                <p className="text-xs text-zinc-400 leading-relaxed font-sans whitespace-pre-wrap">{previewItem.description}</p>
              </div>

              {/* SEO Specs table */}
              <div className="space-y-2.5 pt-4 border-t border-white/5">
                <h4 className="text-[10px] font-black uppercase tracking-widest text-zinc-400 flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5 text-accent" /> Associated SEO Indexing Metadata
                </h4>

                <div className="grid grid-cols-2 gap-4 font-mono text-[9px] text-zinc-400 bg-zinc-950/60 p-4 rounded-2xl border border-white/5">
                  <div className="truncate">
                    <span className="block font-sans uppercase font-bold text-[8px] text-zinc-500 mb-0.5">Meta Title</span>
                    <span className="text-white" title={previewItem.metaTitle}>{previewItem.metaTitle || "Not set"}</span>
                  </div>
                  <div className="truncate">
                    <span className="block font-sans uppercase font-bold text-[8px] text-zinc-500 mb-0.5">Canonical Link</span>
                    <span className="text-white" title={previewItem.canonicalUrl}>{previewItem.canonicalUrl || "Not set"}</span>
                  </div>
                  <div className="col-span-2 truncate">
                    <span className="block font-sans uppercase font-bold text-[8px] text-zinc-500 mb-0.5">Meta Description</span>
                    <span className="text-white whitespace-pre-wrap block" title={previewItem.metaDescription}>
                      {previewItem.metaDescription || "Not set"}
                    </span>
                  </div>
                  <div>
                    <span className="block font-sans uppercase font-bold text-[8px] text-zinc-500 mb-0.5">Crawler Robots</span>
                    <span className="text-white">{previewItem.robots || "index, follow"}</span>
                  </div>
                  <div>
                    <span className="block font-sans uppercase font-bold text-[8px] text-zinc-500 mb-0.5">OG Classification</span>
                    <span className="text-white">{previewItem.ogType || "article"}</span>
                  </div>
                </div>
              </div>

            </div>

            {/* Modal footer action */}
            <div className="p-6 border-t border-white/5 bg-[#0a0a0c] flex justify-end">
              <button 
                onClick={() => { setIsPreviewOpen(false); setPreviewItem(null); }}
                className="px-6 py-2.5 bg-zinc-900 border border-white/5 hover:border-accent text-zinc-300 hover:text-white rounded-full text-[10px] font-black uppercase tracking-wider transition-all"
              >
                Close Preview
              </button>
            </div>

          </div>
        </div>
      )}

      {/* REUSABLE ELEGANT CONFIRMATION MODAL */}
      {confirmModal.isOpen && (
        <div className="fixed inset-0 z-[10000] bg-[#070708]/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-md rounded-[32px] bg-[#0c0c0e] border border-white/5 overflow-hidden shadow-2xl relative p-6 md:p-8 space-y-6">
            <div className="space-y-2">
              <h3 className={`text-sm font-black font-display uppercase tracking-widest ${
                confirmModal.variant === "danger" ? "text-red-500" : confirmModal.variant === "warning" ? "text-amber-500" : "text-accent"
              }`}>
                {confirmModal.title}
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed font-sans">
                {confirmModal.message}
              </p>
            </div>
            
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setConfirmModal(prev => ({ ...prev, isOpen: false }))}
                className="px-5 py-2.5 bg-zinc-900 border border-white/5 hover:border-zinc-700 text-zinc-400 hover:text-white rounded-full text-[10px] font-black uppercase tracking-widest transition-all"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                onClick={confirmModal.onConfirm}
                className={`px-5 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all text-white flex items-center justify-center gap-1.5 ${
                  confirmModal.variant === "danger" 
                    ? "bg-red-600 hover:bg-red-500 shadow-lg shadow-red-900/15" 
                    : confirmModal.variant === "warning"
                    ? "bg-amber-600 hover:bg-amber-500 shadow-lg shadow-amber-900/15"
                    : "bg-accent hover:bg-accent/80 shadow-lg shadow-accent/15"
                }`}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <div className="w-3 h-3 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                    Processing...
                  </>
                ) : (
                  confirmModal.confirmButtonText || "Confirm"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
