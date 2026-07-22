import { useState, useEffect, useMemo, useRef, FormEvent } from "react";
import { 
  Sparkles, Plus, FileText, CheckCircle2, AlertTriangle, 
  Heading, Image, Tag, Globe, Check, Loader2, HelpCircle, 
  RefreshCw, BookOpen, AlertCircle, Eye, Info, PenTool, Link, Bold, List, TrendingUp
} from "lucide-react";
import { ContentHubItem } from "../types/content";

interface BlogWriterSectionProps {
  themeMode: "dark" | "light";
  triggerToast: (message: string, type?: "success" | "error" | "info") => void;
  items: ContentHubItem[];
  addItem: (item: any) => Promise<string>;
  editItem: (id: string, item: any) => Promise<void>;
  onSuccess: () => void;
}

export function BlogWriterSection({
  themeMode,
  triggerToast,
  items,
  addItem,
  editItem,
  onSuccess
}: BlogWriterSectionProps) {
  // Select which blog post to load or edit (null means New Post)
  const [selectedBlogId, setSelectedBlogId] = useState<string | null>(null);

  // Core Form Fields
  const [formTitle, setFormTitle] = useState("");
  const [formExcerpt, setFormExcerpt] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formThumbnail, setFormThumbnail] = useState("");
  const [formCategory, setFormCategory] = useState<'SEO Tips' | 'Marketing' | 'AI' | 'Growth' | 'Compliance' | 'Retention' | 'Video'>("Growth");
  const [formTags, setFormTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  
  // Focus Keyword for SEO Scoring (prominent Wix/WordPress style focus field)
  const [focusKeyword, setFocusKeyword] = useState("");
  
  // Image Alt text (automated)
  const [imageAltText, setImageAltText] = useState("");
  const [imagePrompt, setImagePrompt] = useState("");

  // Metadata
  const [metaTitle, setMetaTitle] = useState("");
  const [metaDescription, setMetaDescription] = useState("");
  const [canonicalUrl, setCanonicalUrl] = useState("");
  const [robots, setRobots] = useState("index, follow");
  const [ogType, setOgType] = useState("article");
  const [formStatus, setFormStatus] = useState<"Published" | "Draft">("Published");
  const [formVisibility, setFormVisibility] = useState("public");

  // Author details
  const [authorName, setAuthorName] = useState("G. Hari Kiran");
  const [authorRole, setAuthorRole] = useState("Growth Strategist");
  const [authorImage, setAuthorImage] = useState("https://i.postimg.cc/d1MxW0j1/Hari-Portfolio.png");

  // Action states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [activeWorkspaceTab, setActiveWorkspaceTab] = useState<"write" | "seo-meta">("write");

  // Ref for description text-area to insert formatting tags
  const descriptionRef = useRef<HTMLTextAreaElement>(null);

  // Filter current content to list blogs
  const blogsList = useMemo(() => {
    return items.filter(item => item.contentType === "Blog" && item.status !== "Trash");
  }, [items]);

  // Load selected blog into form
  useEffect(() => {
    if (selectedBlogId) {
      const blog = items.find(item => item.id === selectedBlogId);
      if (blog) {
        setFormTitle(blog.title);
        setFormExcerpt(blog.excerpt);
        setFormDescription(blog.description);
        setFormThumbnail(blog.thumbnail);
        setFormCategory(blog.category as any || "Growth");
        setFormTags(blog.tags || []);
        
        // Retrieve focusKeyword and imageAltText if saved on document, fallback to defaults
        setFocusKeyword((blog as any).focusKeyword || "");
        setImageAltText((blog as any).imageAltText || "");
        setImagePrompt((blog as any).imagePrompt || "");

        setMetaTitle(blog.metaTitle || "");
        setMetaDescription(blog.metaDescription || "");
        setCanonicalUrl(blog.canonicalUrl || "");
        setRobots(blog.robots || "index, follow");
        setOgType(blog.ogType || "article");
        setFormStatus((blog.status as any) === "Published" ? "Published" : "Draft");
        setFormVisibility(blog.visibility || "public");

        setAuthorName(blog.author.name);
        setAuthorRole(blog.author.role);
        setAuthorImage(blog.author.image || "https://i.postimg.cc/d1MxW0j1/Hari-Portfolio.png");
        
        triggerToast(`Loaded "${blog.title}" for SEO optimization`, "info");
      }
    } else {
      // Clear form for New Blog
      handleResetAll();
    }
  }, [selectedBlogId]);

  // Sync Meta fields dynamically as user types (standard CMS convenience)
  useEffect(() => {
    if (!selectedBlogId) {
      if (formTitle) {
        setMetaTitle(formTitle.substring(0, 60));
        setCanonicalUrl(`/blog/${formTitle.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`);
      }
      if (formExcerpt) {
        setMetaDescription(formExcerpt.substring(0, 160));
      }
    }
  }, [formTitle, formExcerpt, selectedBlogId]);

  // Format description text helper
  const insertTextAtCursor = (before: string, after: string = "") => {
    const textarea = descriptionRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    const selected = text.substring(start, end);
    const replacement = before + selected + after;

    setFormDescription(
      text.substring(0, start) + replacement + text.substring(end)
    );

    // Refocus and set cursor position
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + before.length, start + before.length + selected.length);
    }, 50);
  };

  // Reset function
  const handleResetAll = () => {
    setFormTitle("");
    setFormExcerpt("");
    setFormDescription("");
    setFormThumbnail("");
    setFormCategory("Growth");
    setFormTags([]);
    setTagInput("");
    setFocusKeyword("");
    setImageAltText("");
    setImagePrompt("");
    setMetaTitle("");
    setMetaDescription("");
    setCanonicalUrl("");
    setRobots("index, follow");
    setOgType("article");
    setFormStatus("Published");
    setFormVisibility("public");
    setAuthorName("G. Hari Kiran");
    setAuthorRole("Growth Strategist");
    setAuthorImage("https://i.postimg.cc/d1MxW0j1/Hari-Portfolio.png");
  };

  // Add tag handler
  const handleAddTag = () => {
    const cleanTag = tagInput.trim().toLowerCase();
    if (cleanTag && !formTags.includes(cleanTag)) {
      setFormTags([...formTags, cleanTag]);
    }
    setTagInput("");
  };

  // Remove tag handler
  const handleRemoveTag = (tagToRemove: string) => {
    setFormTags(formTags.filter(t => t !== tagToRemove));
  };

  // Call automated image and alt text generation endpoint
  const handleAutoGenerateImageAndAlt = async () => {
    if (!formTitle) {
      triggerToast("Please provide a Blog Title first so Gemini can design a contextual visual.", "error");
      return;
    }

    setIsGeneratingImage(true);
    triggerToast("Gemini is reading your content & writing custom visual prompts...", "info");

    try {
      const response = await fetch("/api/cms/generate-blog-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: formTitle,
          content: formDescription,
          category: formCategory
        })
      });

      if (!response.ok) {
        throw new Error(`Server returned HTTP ${response.status}`);
      }

      const data = await response.json();
      if (data.imageUrl) {
        setFormThumbnail(data.imageUrl);
        if (data.altText) {
          setImageAltText(data.altText);
        }
        if (data.imagePrompt) {
          setImagePrompt(data.imagePrompt);
        }

        if (data.isAiGenerated) {
          triggerToast("Successfully auto-generated a custom AI cover image and alt text!", "success");
        } else {
          triggerToast("Auto-selected a stunning contextual background and generated SEO alt text!", "success");
        }
      } else {
        throw new Error("No image URL returned in payload");
      }
    } catch (err: any) {
      console.error("Failed to generate image:", err);
      triggerToast("Automated design failed. Please check Gemini settings or enter image URL manually.", "error");
    } finally {
      setIsGeneratingImage(false);
    }
  };

  // Word count and text analysis helpers
  const wordCount = useMemo(() => {
    if (!formDescription) return 0;
    return formDescription.trim().split(/\s+/).filter(Boolean).length;
  }, [formDescription]);

  // Real-time SEO Scoring & Diagnostics Calculations
  const seoDiagnostics = useMemo(() => {
    const checks: {
      id: string;
      title: string;
      maxScore: number;
      actualScore: number;
      passed: boolean;
      statusText: string;
      advice: string;
    }[] = [];

    const lowerTitle = formTitle.toLowerCase();
    const lowerExcerpt = formExcerpt.toLowerCase();
    const lowerBody = formDescription.toLowerCase();
    const keyword = focusKeyword.trim().toLowerCase();

    // 1. Focus Keyword Presence
    const hasKeyword = keyword.length > 0;

    // Keyword in Title check (15 pts)
    let keywordInTitleScore = 0;
    let keywordInTitlePassed = false;
    let keywordInTitleAdvice = "Define a focus keyword to analyze your title optimization.";
    let keywordInTitleStatus = "No Focus Keyword";

    if (hasKeyword) {
      keywordInTitlePassed = lowerTitle.includes(keyword);
      keywordInTitleScore = keywordInTitlePassed ? 15 : 0;
      keywordInTitleStatus = keywordInTitlePassed ? "Keyword Found" : "Keyword Missing";
      keywordInTitleAdvice = keywordInTitlePassed 
        ? "Perfect! The focus keyword is present in your heading."
        : `Include the exact keyword "${focusKeyword}" in your title to boost search index matching.`;
    }
    checks.push({
      id: "keyword-title",
      title: "Focus Keyword in Title",
      maxScore: 15,
      actualScore: keywordInTitleScore,
      passed: keywordInTitlePassed,
      statusText: keywordInTitleStatus,
      advice: keywordInTitleAdvice
    });

    // Keyword in Excerpt check (10 pts)
    let keywordInExcerptScore = 0;
    let keywordInExcerptPassed = false;
    let keywordInExcerptAdvice = "Focus keyword not defined.";
    let keywordInExcerptStatus = "No Focus Keyword";

    if (hasKeyword) {
      keywordInExcerptPassed = lowerExcerpt.includes(keyword);
      keywordInExcerptScore = keywordInExcerptPassed ? 10 : 0;
      keywordInExcerptStatus = keywordInExcerptPassed ? "Keyword Found" : "Keyword Missing";
      keywordInExcerptAdvice = keywordInExcerptPassed
        ? "Excellent! The keyword is present in your excerpt summary."
        : `Try including "${focusKeyword}" in the short description for search snippet optimization.`;
    }
    checks.push({
      id: "keyword-excerpt",
      title: "Focus Keyword in Excerpt",
      maxScore: 10,
      actualScore: keywordInExcerptScore,
      passed: keywordInExcerptPassed,
      statusText: keywordInExcerptStatus,
      advice: keywordInExcerptAdvice
    });

    // Keyword in early Body Paragraph (15 pts)
    let keywordInIntroScore = 0;
    let keywordInIntroPassed = false;
    let keywordInIntroAdvice = "Focus keyword not defined.";
    let keywordInIntroStatus = "No Focus Keyword";

    if (hasKeyword) {
      // Check first 15% of description
      const introSlice = lowerBody.substring(0, Math.max(200, Math.floor(lowerBody.length * 0.15)));
      keywordInIntroPassed = introSlice.includes(keyword);
      keywordInIntroScore = keywordInIntroPassed ? 15 : 0;
      keywordInIntroStatus = keywordInIntroPassed ? "Keyword Present Early" : "Keyword Missing Early";
      keywordInIntroAdvice = keywordInIntroPassed
        ? "Perfect! You introduced the keyword early in the text."
        : `Add your focus keyword "${focusKeyword}" within the first paragraph to signal priority to search bots.`;
    }
    checks.push({
      id: "keyword-intro",
      title: "Focus Keyword in Intro",
      maxScore: 15,
      actualScore: keywordInIntroScore,
      passed: keywordInIntroPassed,
      statusText: keywordInIntroStatus,
      advice: keywordInIntroAdvice
    });

    // Keyword Density (15 pts)
    let keywordDensityScore = 0;
    let keywordDensityPassed = false;
    let keywordDensityAdvice = "Write more content and add focus keyword to evaluate density.";
    let keywordDensityStatus = "0.0%";

    if (hasKeyword && wordCount > 0) {
      // Find matches of keyword in body text
      const regex = new RegExp(`\\b${keyword.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')}\\b`, 'gi');
      const matches = lowerBody.match(regex);
      const occurrences = matches ? matches.length : 0;
      const density = (occurrences / wordCount) * 100;
      
      keywordDensityStatus = `${density.toFixed(1)}% density (${occurrences} matches)`;
      
      if (density >= 0.8 && density <= 2.5) {
        keywordDensityPassed = true;
        keywordDensityScore = 15;
        keywordDensityAdvice = `Ideal density! Solid search presence without over-optimization.`;
      } else if (density > 2.5) {
        keywordDensityPassed = false;
        keywordDensityScore = 5; // Partial points
        keywordDensityAdvice = `Keyword stuffing detected (${density.toFixed(1)}%)! Reduce occurrences to prevent Google search penalty.`;
      } else {
        keywordDensityPassed = false;
        keywordDensityScore = occurrences > 0 ? 8 : 0;
        keywordDensityAdvice = `Density too low (${density.toFixed(1)}%). Mention "${focusKeyword}" a few more times (ideal: 1.0% to 2.0%).`;
      }
    }
    checks.push({
      id: "keyword-density",
      title: "Keyword Density Check",
      maxScore: 15,
      actualScore: keywordDensityScore,
      passed: keywordDensityPassed,
      statusText: keywordDensityStatus,
      advice: keywordDensityAdvice
    });

    // 2. Structural & Layout Checks
    // Title Length (10 pts)
    const titleLen = formTitle.length;
    const titleLenPassed = titleLen >= 40 && titleLen <= 65;
    const titleLenScore = titleLenPassed ? 10 : (titleLen > 15 ? 5 : 0);
    const titleLenStatus = `${titleLen} characters`;
    const titleLenAdvice = titleLenPassed
      ? "Perfect length! Ensures full visibility on search result pages."
      : titleLen > 65 
        ? "Title is too long (over 65 characters) and might be truncated by Google." 
        : "Title is too short. Aim for 40-65 characters to maximize interest and clicks.";
    
    checks.push({
      id: "title-length",
      title: "Optimized Title Length",
      maxScore: 10,
      actualScore: titleLenScore,
      passed: titleLenPassed,
      statusText: titleLenStatus,
      advice: titleLenAdvice
    });

    // Excerpt Length / Meta Description (10 pts)
    const excerptLen = formExcerpt.length;
    const excerptLenPassed = excerptLen >= 110 && excerptLen <= 165;
    const excerptLenScore = excerptLenPassed ? 10 : (excerptLen > 40 ? 5 : 0);
    const excerptLenStatus = `${excerptLen} characters`;
    const excerptLenAdvice = excerptLenPassed
      ? "Meta Snippet is excellent. Fits the Google description limits perfectly."
      : excerptLen > 165 
        ? "Snippet is too long (above 165 characters) and will get cut off on screens." 
        : "Snippet is too short. Expand to 110-165 characters to improve search click rate.";
    
    checks.push({
      id: "excerpt-length",
      title: "Snippet / Meta Description",
      maxScore: 10,
      actualScore: excerptLenScore,
      passed: excerptLenPassed,
      statusText: excerptLenStatus,
      advice: excerptLenAdvice
    });

    // Word Count (15 pts)
    const wordCountPassed = wordCount >= 600;
    const wordCountScore = wordCount >= 600 ? 15 : (wordCount >= 300 ? 8 : 0);
    const wordCountStatus = `${wordCount} words`;
    const wordCountAdvice = wordCountPassed
      ? "Comprehensive! Long-form articles are heavily prioritized by search engines."
      : wordCount >= 300 
        ? "Good starting size, but aim for 600+ words to cover the topic in high authority."
        : "Very thin content. Write at least 300-400 more words to provide genuine value.";

    checks.push({
      id: "word-count",
      title: "Detailed Content Length",
      maxScore: 15,
      actualScore: wordCountScore,
      passed: wordCountPassed,
      statusText: wordCountStatus,
      advice: wordCountAdvice
    });

    // Subheadings Presence (5 pts)
    const hasHeadings = /^(##|###)\s+\w+/m.test(formDescription) || /<h[23]>/i.test(formDescription);
    const headingsScore = hasHeadings ? 5 : 0;
    const headingsStatus = hasHeadings ? "Structure Found" : "No Subheadings";
    const headingsAdvice = hasHeadings
      ? "Splendid! Using H2/H3 elements helps readers scan and improves crawl hierarchy."
      : "Structure is missing! Insert subheadings (e.g. ## Section Name) to divide your topics.";

    checks.push({
      id: "headings",
      title: "Content Heading Structure",
      maxScore: 5,
      actualScore: headingsScore,
      passed: hasHeadings,
      statusText: headingsStatus,
      advice: headingsAdvice
    });

    // Image Alt text (5 pts)
    const hasImageAndAlt = formThumbnail.length > 0 && imageAltText.length > 5;
    const imageAltScore = hasImageAndAlt ? 5 : (formThumbnail.length > 0 ? 2 : 0);
    const imageAltStatus = hasImageAndAlt ? "Cover Image + Alt Defined" : (formThumbnail.length > 0 ? "Alt Missing" : "No Cover Image");
    const imageAltAdvice = hasImageAndAlt
      ? "Perfect! Search bots can index your image with your descriptive alt tag."
      : formThumbnail.length > 0 
        ? "Image added, but Alt Text is blank or thin. Generate it automatically using Gemini!" 
        : "Add a custom cover image and description to boost visual discovery on Google.";

    checks.push({
      id: "image-alt",
      title: "Visual Asset Alt Indexing",
      maxScore: 5,
      actualScore: imageAltScore,
      passed: hasImageAndAlt,
      statusText: imageAltStatus,
      advice: imageAltAdvice
    });

    // Sum scores
    const totalMax = checks.reduce((sum, c) => sum + c.maxScore, 0);
    const totalActual = checks.reduce((sum, c) => sum + c.actualScore, 0);
    const scorePercentage = Math.round((totalActual / totalMax) * 100);

    return {
      checks,
      score: scorePercentage
    };
  }, [formTitle, formExcerpt, formDescription, focusKeyword, formThumbnail, imageAltText, wordCount]);

  // Handle Save
  const handlePublishOrSave = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!formTitle.trim()) {
      triggerToast("Blog title is required", "error");
      return;
    }
    if (!formDescription.trim()) {
      triggerToast("Blog body content is required", "error");
      return;
    }
    if (!formExcerpt.trim()) {
      triggerToast("A short summary/excerpt is required", "error");
      return;
    }

    setIsSubmitting(true);
    try {
      const readingSpeedWordsPerMinute = 225;
      const readTimeVal = `${Math.max(1, Math.ceil(wordCount / readingSpeedWordsPerMinute))} min read`;

      const payload = {
        title: formTitle,
        excerpt: formExcerpt,
        description: formDescription,
        thumbnail: formThumbnail || "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80",
        platform: "Portfolio" as const,
        contentType: "Blog" as const,
        category: formCategory,
        tags: formTags,
        url: canonicalUrl || `#`,
        featured: false,
        readTime: readTimeVal,
        author: {
          name: authorName,
          role: authorRole,
          image: authorImage
        },
        status: formStatus,
        visibility: formVisibility,
        publishedDate: new Date(),
        
        // SEO optimization fields
        metaTitle: metaTitle || formTitle,
        metaDescription: metaDescription || formExcerpt,
        canonicalUrl: canonicalUrl,
        robots: robots,
        ogImage: formThumbnail || "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80",
        ogType: ogType,

        // Custom fields for SEO metrics storage
        focusKeyword: focusKeyword,
        imageAltText: imageAltText,
        imagePrompt: imagePrompt,
        seoScore: seoDiagnostics.score
      };

      if (selectedBlogId) {
        await editItem(selectedBlogId, payload);
        triggerToast(`"${formTitle}" has been updated with SEO Score ${seoDiagnostics.score}%!`, "success");
      } else {
        const newId = await addItem(payload);
        setSelectedBlogId(newId);
        triggerToast(`"${formTitle}" is now live with SEO Score ${seoDiagnostics.score}%!`, "success");
      }
      onSuccess();
    } catch (err: any) {
      console.error("Save error:", err);
      triggerToast("Failed to save content. Please try again.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6" id="blog-writer-workspace">
      {/* Upper Action Banner */}
      <div className={themeMode === "dark" ? "bg-zinc-900 border border-white/5 rounded-2xl p-5" : "bg-white border border-zinc-200 rounded-2xl p-5"}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <h2 className="text-lg font-bold tracking-tight flex items-center gap-2">
              <PenTool className="w-5 h-5 text-accent" />
              SEO Optimized Blog Suite
            </h2>
            <p className="text-xs text-zinc-400">
              Wix & WordPress style professional editor featuring live crawling metrics, alt indexing, and automated AI graphics.
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {/* Selector Dropdown to load blogs */}
            <div className="relative">
              <select
                value={selectedBlogId || ""}
                onChange={(e) => setSelectedBlogId(e.target.value || null)}
                className={`text-xs font-medium py-2 px-3 pr-8 rounded-xl border focus:outline-none focus:ring-1 focus:ring-accent ${
                  themeMode === "dark" 
                    ? "bg-zinc-950 border-white/5 text-zinc-300" 
                    : "bg-zinc-50 border-zinc-200 text-zinc-700"
                }`}
              >
                <option value="">📝 Start New Blog Post</option>
                {blogsList.map(blog => (
                  <option key={blog.id} value={blog.id}>
                    📄 Edit: {blog.title.substring(0, 32)}... ({ (blog as any).seoScore || "N/A"}%)
                  </option>
                ))}
              </select>
            </div>

            {selectedBlogId && (
              <button
                type="button"
                onClick={() => { setSelectedBlogId(null); handleResetAll(); }}
                className={`px-3 py-2 text-xs font-semibold rounded-xl border flex items-center gap-1 transition-all ${
                  themeMode === "dark" 
                    ? "bg-zinc-900 border-white/5 hover:bg-white/5 text-zinc-300" 
                    : "bg-white border-zinc-200 hover:bg-zinc-50 text-zinc-600"
                }`}
              >
                <Plus className="w-3.5 h-3.5" />
                New Post
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Split Editor Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT COLUMN: Workspace (Form Editor) */}
        <form onSubmit={handlePublishOrSave} className="lg:col-span-8 space-y-6">
          <div className={themeMode === "dark" ? "bg-zinc-900 border border-white/5 rounded-2xl" : "bg-white border border-zinc-200 rounded-2xl"}>
            
            {/* Workspace tabs header */}
            <div className="flex border-b border-white/5 px-5 py-3 justify-between items-center flex-wrap gap-2">
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setActiveWorkspaceTab("write")}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors ${
                    activeWorkspaceTab === "write"
                      ? "bg-accent/10 text-accent"
                      : "text-zinc-400 hover:text-zinc-200"
                  }`}
                >
                  <FileText className="w-3.5 h-3.5" />
                  Visual Workspace
                </button>
                <button
                  type="button"
                  onClick={() => setActiveWorkspaceTab("seo-meta")}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors ${
                    activeWorkspaceTab === "seo-meta"
                      ? "bg-accent/10 text-accent"
                      : "text-zinc-400 hover:text-zinc-200"
                  }`}
                >
                  <Globe className="w-3.5 h-3.5" />
                  Meta Settings
                </button>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[10px] text-zinc-400 flex items-center gap-1 bg-zinc-800/40 px-2 py-0.5 rounded">
                  <BookOpen className="w-3 h-3" />
                  {wordCount} words
                </span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                  seoDiagnostics.score >= 80 
                    ? "bg-emerald-500/10 text-emerald-400" 
                    : seoDiagnostics.score >= 50 
                      ? "bg-amber-500/10 text-amber-400" 
                      : "bg-red-500/10 text-red-400"
                }`}>
                  SEO: {seoDiagnostics.score}%
                </span>
              </div>
            </div>

            {/* Tab: Write Component */}
            {activeWorkspaceTab === "write" && (
              <div className="p-6 space-y-5">
                {/* 1. Title */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">
                    Blog Title
                  </label>
                  <input
                    type="text"
                    required
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    placeholder="e.g., 5 Advanced Tactics for SaaS Conversion Rate Optimization"
                    className={`w-full px-4 py-3 rounded-xl border text-sm font-medium focus:outline-none focus:ring-1 focus:ring-accent ${
                      themeMode === "dark" 
                        ? "bg-zinc-950 border-white/5 text-white placeholder-zinc-600" 
                        : "bg-zinc-50 border-zinc-200 text-zinc-900 placeholder-zinc-400"
                    }`}
                  />
                </div>

                {/* Focus Keyword & Category */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Target Focus Keyword */}
                  <div className="space-y-1.5 relative group">
                    <label className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
                      Target Focus Keyword
                      <HelpCircle className="w-3 h-3 text-zinc-500 hover:text-zinc-300 cursor-pointer" title="The search keyword you want to rank for on Google" />
                    </label>
                    <input
                      type="text"
                      value={focusKeyword}
                      onChange={(e) => setFocusKeyword(e.target.value)}
                      placeholder="e.g., saas conversion rate"
                      className={`w-full px-4 py-2.5 rounded-xl border text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-accent ${
                        themeMode === "dark" 
                          ? "bg-zinc-950 border-white/5 text-accent placeholder-zinc-700" 
                          : "bg-zinc-50 border-zinc-200 text-accent placeholder-zinc-400"
                      }`}
                    />
                  </div>

                  {/* Category */}
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">
                      Business Pillar
                    </label>
                    <select
                      value={formCategory}
                      onChange={(e) => setFormCategory(e.target.value as any)}
                      className={`w-full px-4 py-2.5 rounded-xl border text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-accent ${
                        themeMode === "dark" 
                          ? "bg-zinc-950 border-white/5 text-zinc-300" 
                          : "bg-zinc-50 border-zinc-200 text-zinc-700"
                      }`}
                    >
                      <option value="SEO Tips">SEO Tips</option>
                      <option value="Marketing">Marketing</option>
                      <option value="AI">AI</option>
                      <option value="Growth">Growth</option>
                      <option value="Compliance">Compliance</option>
                      <option value="Retention">Retention</option>
                      <option value="Video">Video</option>
                    </select>
                  </div>
                </div>

                {/* 2. Excerpt */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">
                    Snippet / Meta Description
                  </label>
                  <textarea
                    required
                    rows={2}
                    maxLength={220}
                    value={formExcerpt}
                    onChange={(e) => setFormExcerpt(e.target.value)}
                    placeholder="Provide an eye-catching, SEO-optimized summary under 160 characters..."
                    className={`w-full px-4 py-2.5 rounded-xl border text-xs font-medium focus:outline-none focus:ring-1 focus:ring-accent ${
                      themeMode === "dark" 
                        ? "bg-zinc-950 border-white/5 text-zinc-300 placeholder-zinc-600" 
                        : "bg-zinc-50 border-zinc-200 text-zinc-800 placeholder-zinc-400"
                    }`}
                  />
                </div>

                {/* 3. Text Editor formatting bar & Textarea */}
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center">
                    <label className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">
                      Blog Content (Body)
                    </label>
                    
                    {/* Formatting utilities */}
                    <div className="flex items-center gap-1 bg-zinc-800/30 p-1 rounded-lg">
                      <button
                        type="button"
                        onClick={() => insertTextAtCursor("## ", "")}
                        title="Heading 2"
                        className="p-1 rounded text-zinc-400 hover:text-zinc-200 hover:bg-zinc-700/50"
                      >
                        <Heading className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => insertTextAtCursor("### ", "")}
                        title="Heading 3"
                        className="p-1 rounded text-zinc-400 hover:text-zinc-200 hover:bg-zinc-700/50"
                      >
                        <Heading className="w-3 h-3" />
                      </button>
                      <button
                        type="button"
                        onClick={() => insertTextAtCursor("**", "**")}
                        title="Bold Text"
                        className="p-1 rounded text-zinc-400 hover:text-zinc-200 hover:bg-zinc-700/50"
                      >
                        <Bold className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => insertTextAtCursor("\n- ", "")}
                        title="Bullet list"
                        className="p-1 rounded text-zinc-400 hover:text-zinc-200 hover:bg-zinc-700/50"
                      >
                        <List className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => insertTextAtCursor("[anchor](", ")")}
                        title="Insert hyperlink"
                        className="p-1 rounded text-zinc-400 hover:text-zinc-200 hover:bg-zinc-700/50"
                      >
                        <Link className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <textarea
                    required
                    ref={descriptionRef}
                    rows={12}
                    value={formDescription}
                    onChange={(e) => setFormDescription(e.target.value)}
                    placeholder="Write your article body here. Use markdown tags (## Heading, **bold**) to format structural layouts."
                    className={`w-full px-4 py-3 rounded-xl border text-xs font-medium font-sans leading-relaxed focus:outline-none focus:ring-1 focus:ring-accent ${
                      themeMode === "dark" 
                        ? "bg-zinc-950 border-white/5 text-zinc-200 placeholder-zinc-700" 
                        : "bg-zinc-50 border-zinc-200 text-zinc-800 placeholder-zinc-400"
                    }`}
                  />
                </div>

                {/* 4. Cover Image Visual Box & AI trigger */}
                <div className="space-y-3 pt-3 border-t border-white/5">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                    <div className="space-y-0.5">
                      <label className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider flex items-center gap-1">
                        <Image className="w-3.5 h-3.5 text-accent" />
                        Automated Cover Image
                      </label>
                      <p className="text-[10px] text-zinc-500">
                        Generate bespoke corporate vector visuals with Gemini on demand.
                      </p>
                    </div>

                    <button
                      type="button"
                      disabled={isGeneratingImage}
                      onClick={handleAutoGenerateImageAndAlt}
                      className={`text-[10px] font-bold px-4 py-2 rounded-xl flex items-center gap-1.5 transition-all cursor-pointer ${
                        isGeneratingImage 
                          ? "bg-zinc-800 text-zinc-500" 
                          : "bg-accent text-white hover:bg-accent/90 shadow-lg shadow-accent/15"
                      }`}
                    >
                      {isGeneratingImage ? (
                        <>
                          <Loader2 className="w-3 h-3 animate-spin" />
                          Designing...
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-3 h-3" />
                          Auto-Generate Cover & Alt Text
                        </>
                      )}
                    </button>
                  </div>

                  {formThumbnail && (
                    <div className={`relative rounded-xl overflow-hidden border aspect-video max-h-48 group ${
                      themeMode === "dark" ? "border-white/5" : "border-zinc-200"
                    }`}>
                      <img
                        src={formThumbnail}
                        alt={imageAltText || "Cover Preview"}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-3 text-white text-[10px] space-y-1">
                        <p className="font-bold line-clamp-1">Alt text: {imageAltText || "No Alt text defined"}</p>
                        <p className="text-zinc-300 line-clamp-2">Prompt: {imagePrompt || "No prompt"}</p>
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Thumbnail URL Manual Input */}
                    <div className="space-y-1">
                      <span className="text-[10px] font-semibold text-zinc-500">Thumbnail Link</span>
                      <input
                        type="text"
                        value={formThumbnail}
                        onChange={(e) => setFormThumbnail(e.target.value)}
                        placeholder="Paste image URL or use AI to generate..."
                        className={`w-full px-3 py-2 rounded-lg border text-[10px] focus:outline-none ${
                          themeMode === "dark" 
                            ? "bg-zinc-950 border-white/5 text-zinc-300" 
                            : "bg-zinc-50 border-zinc-200 text-zinc-800"
                        }`}
                      />
                    </div>

                    {/* Image Alt Text manual field */}
                    <div className="space-y-1">
                      <span className="text-[10px] font-semibold text-zinc-500 flex items-center gap-1">
                        Image Alt Text (SEO Alt Tag)
                        {imageAltText && <Check className="w-3 h-3 text-emerald-400" />}
                      </span>
                      <input
                        type="text"
                        value={imageAltText}
                        onChange={(e) => setImageAltText(e.target.value)}
                        placeholder="SEO alt tag description..."
                        className={`w-full px-3 py-2 rounded-lg border text-[10px] focus:outline-none ${
                          themeMode === "dark" 
                            ? "bg-zinc-950 border-white/5 text-zinc-300" 
                            : "bg-zinc-50 border-zinc-200 text-zinc-800"
                        }`}
                      />
                    </div>
                  </div>
                </div>

                {/* Tags section */}
                <div className="space-y-2 pt-3 border-t border-white/5">
                  <label className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider flex items-center gap-1">
                    <Tag className="w-3.5 h-3.5 text-zinc-400" />
                    Keywords & Tags
                  </label>
                  
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleAddTag())}
                      placeholder="Add tag..."
                      className={`px-3 py-1.5 rounded-lg border text-xs focus:outline-none ${
                        themeMode === "dark" 
                          ? "bg-zinc-950 border-white/5 text-zinc-300" 
                          : "bg-zinc-50 border-zinc-200 text-zinc-800"
                      }`}
                    />
                    <button
                      type="button"
                      onClick={handleAddTag}
                      className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-colors ${
                        themeMode === "dark" 
                          ? "bg-zinc-800 border-white/5 hover:bg-zinc-700 text-zinc-300" 
                          : "bg-zinc-100 border-zinc-200 hover:bg-zinc-200 text-zinc-700"
                      }`}
                    >
                      Add
                    </button>
                  </div>

                  {formTags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {formTags.map(tag => (
                        <span 
                          key={tag}
                          className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-accent/10 text-accent"
                        >
                          #{tag}
                          <button 
                            type="button" 
                            onClick={() => handleRemoveTag(tag)}
                            className="hover:text-red-400 font-bold"
                          >
                            &times;
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Tab: SEO Meta Details */}
            {activeWorkspaceTab === "seo-meta" && (
              <div className="p-6 space-y-5">
                <div className="flex items-center gap-2 text-zinc-400 pb-2 border-b border-white/5">
                  <Info className="w-4 h-4 text-accent" />
                  <span className="text-xs font-semibold">Wix-style custom crawlers configuration. Set precise meta overrides.</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Meta Title */}
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">
                      SERP Meta Title
                    </label>
                    <input
                      type="text"
                      value={metaTitle}
                      onChange={(e) => setMetaTitle(e.target.value)}
                      placeholder="Overrides title on search page..."
                      className={`w-full px-4 py-2.5 rounded-xl border text-xs font-semibold focus:outline-none ${
                        themeMode === "dark" 
                          ? "bg-zinc-950 border-white/5 text-zinc-300" 
                          : "bg-zinc-50 border-zinc-200 text-zinc-800"
                      }`}
                    />
                  </div>

                  {/* Canonical URL */}
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">
                      Canonical Link Override
                    </label>
                    <input
                      type="text"
                      value={canonicalUrl}
                      onChange={(e) => setCanonicalUrl(e.target.value)}
                      placeholder="/blog/growth-metrics"
                      className={`w-full px-4 py-2.5 rounded-xl border text-xs font-semibold focus:outline-none ${
                        themeMode === "dark" 
                          ? "bg-zinc-950 border-white/5 text-zinc-300" 
                          : "bg-zinc-50 border-zinc-200 text-zinc-800"
                      }`}
                    />
                  </div>
                </div>

                {/* Meta Description override */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">
                    SERP Meta Description Override
                  </label>
                  <textarea
                    rows={3}
                    value={metaDescription}
                    onChange={(e) => setMetaDescription(e.target.value)}
                    placeholder="Provide description override. Fallbacks to excerpt automatically..."
                    className={`w-full px-4 py-2.5 rounded-xl border text-xs font-medium focus:outline-none ${
                      themeMode === "dark" 
                        ? "bg-zinc-950 border-white/5 text-zinc-300" 
                        : "bg-zinc-50 border-zinc-200 text-zinc-800"
                    }`}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Robots */}
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">
                      Robots Directives
                    </label>
                    <input
                      type="text"
                      value={robots}
                      onChange={(e) => setRobots(e.target.value)}
                      placeholder="index, follow"
                      className={`w-full px-4 py-2.5 rounded-xl border text-xs font-semibold focus:outline-none ${
                        themeMode === "dark" 
                          ? "bg-zinc-950 border-white/5 text-zinc-300" 
                          : "bg-zinc-50 border-zinc-200 text-zinc-800"
                      }`}
                    />
                  </div>

                  {/* OG Type */}
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">
                      OG Type
                    </label>
                    <input
                      type="text"
                      value={ogType}
                      onChange={(e) => setOgType(e.target.value)}
                      placeholder="article"
                      className={`w-full px-4 py-2.5 rounded-xl border text-xs font-semibold focus:outline-none ${
                        themeMode === "dark" 
                          ? "bg-zinc-950 border-white/5 text-zinc-300" 
                          : "bg-zinc-50 border-zinc-200 text-zinc-800"
                      }`}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-white/5">
                  {/* Status selection */}
                  <div className="space-y-1">
                    <span className="text-[10px] font-semibold text-zinc-400">Save Status</span>
                    <select
                      value={formStatus}
                      onChange={(e) => setFormStatus(e.target.value as any)}
                      className={`w-full px-3 py-2 rounded-lg border text-[10px] focus:outline-none ${
                        themeMode === "dark" 
                          ? "bg-zinc-950 border-white/5 text-zinc-300" 
                          : "bg-zinc-50 border-zinc-200 text-zinc-700"
                      }`}
                    >
                      <option value="Published">Published (Go Live)</option>
                      <option value="Draft">Draft (Save offline)</option>
                    </select>
                  </div>

                  {/* Visibility */}
                  <div className="space-y-1">
                    <span className="text-[10px] font-semibold text-zinc-400">Visibility</span>
                    <select
                      value={formVisibility}
                      onChange={(e) => setFormVisibility(e.target.value)}
                      className={`w-full px-3 py-2 rounded-lg border text-[10px] focus:outline-none ${
                        themeMode === "dark" 
                          ? "bg-zinc-950 border-white/5 text-zinc-300" 
                          : "bg-zinc-50 border-zinc-200 text-zinc-700"
                      }`}
                    >
                      <option value="public">Public (Open access)</option>
                      <option value="private">Private (Restricted)</option>
                    </select>
                  </div>

                  {/* Author Override */}
                  <div className="space-y-1">
                    <span className="text-[10px] font-semibold text-zinc-400">Author Credit</span>
                    <input
                      type="text"
                      value={authorName}
                      onChange={(e) => setAuthorName(e.target.value)}
                      placeholder="G. Hari Kiran"
                      className={`w-full px-3 py-2 rounded-lg border text-[10px] focus:outline-none ${
                        themeMode === "dark" 
                          ? "bg-zinc-950 border-white/5 text-zinc-300" 
                          : "bg-zinc-50 border-zinc-200 text-zinc-800"
                      }`}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Bottom Form Actions */}
            <div className="flex justify-between items-center px-6 py-4 border-t border-white/5 bg-zinc-800/10 rounded-b-2xl">
              <button
                type="button"
                onClick={handleResetAll}
                className={`px-4 py-2 text-xs font-semibold rounded-xl transition-colors ${
                  themeMode === "dark"
                    ? "text-zinc-400 hover:text-zinc-200 hover:bg-white/5"
                    : "text-zinc-500 hover:text-zinc-800 hover:bg-zinc-100"
                }`}
              >
                Clear Changes
              </button>

              <button
                type="submit"
                disabled={isSubmitting}
                className="px-5 py-2.5 text-xs font-bold rounded-xl bg-accent text-white hover:bg-accent/90 shadow-xl shadow-accent/15 flex items-center gap-1.5"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    Publishing...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    {selectedBlogId ? "Apply SEO Optimizations" : "Post SEO Optimized Blog"}
                  </>
                )}
              </button>
            </div>
          </div>
        </form>

        {/* RIGHT COLUMN: Interactive SEO Scorecard */}
        <div className="lg:col-span-4 space-y-6">
          <div className={themeMode === "dark" ? "bg-zinc-900 border border-white/5 rounded-2xl p-6 space-y-6" : "bg-white border border-zinc-200 rounded-2xl p-6 space-y-6"}>
            
            {/* 1. Header & Dial Score indicator */}
            <div className="space-y-4 text-center">
              <h3 className="text-xs font-extrabold uppercase tracking-widest text-zinc-400 flex items-center justify-center gap-1.5">
                <TrendingUp className="w-4 h-4 text-accent" />
                Live SEO Scorecard
              </h3>

              <div className="flex flex-col items-center justify-center py-2">
                {/* Score gauge */}
                <div className="relative w-28 h-28 flex items-center justify-center">
                  <svg className="w-full h-full transform -rotate-90">
                    {/* Background Circle */}
                    <circle
                      cx="56"
                      cy="56"
                      r="48"
                      className={themeMode === "dark" ? "stroke-zinc-800" : "stroke-zinc-100"}
                      strokeWidth="10"
                      fill="transparent"
                    />
                    {/* Foreground Circle */}
                    <circle
                      cx="56"
                      cy="56"
                      r="48"
                      strokeDasharray={2 * Math.PI * 48}
                      strokeDashoffset={2 * Math.PI * 48 * (1 - seoDiagnostics.score / 100)}
                      className={`transition-all duration-500 ease-out ${
                        seoDiagnostics.score >= 80 
                          ? "stroke-emerald-400" 
                          : seoDiagnostics.score >= 50 
                            ? "stroke-amber-400" 
                            : "stroke-red-400"
                      }`}
                      strokeWidth="10"
                      strokeLinecap="round"
                      fill="transparent"
                    />
                  </svg>
                  <div className="absolute flex flex-col items-center">
                    <span className="text-3xl font-black tracking-tighter">{seoDiagnostics.score}</span>
                    <span className="text-[8px] font-bold text-zinc-500 uppercase tracking-widest">Score</span>
                  </div>
                </div>

                <p className={`text-xs font-bold mt-3 ${
                  seoDiagnostics.score >= 80 
                    ? "text-emerald-400" 
                    : seoDiagnostics.score >= 50 
                      ? "text-amber-400" 
                      : "text-red-400"
                }`}>
                  {seoDiagnostics.score >= 80 
                    ? "Excellent Optimization!" 
                    : seoDiagnostics.score >= 50 
                      ? "Needs moderate work" 
                      : "Poor SEO Health"}
                </p>
              </div>
            </div>

            {/* Keyword Alert box */}
            {!focusKeyword.trim() && (
              <div className="bg-red-500/10 border border-red-500/15 rounded-xl p-3.5 flex gap-3 text-red-400">
                <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <h4 className="text-[11px] font-black uppercase tracking-wider">No Target Keyword!</h4>
                  <p className="text-[10px] leading-relaxed text-red-400/80">
                    Specify a Target Focus Keyword in the workspace to active search index scoring and crawler metrics checks.
                  </p>
                </div>
              </div>
            )}

            {/* 2. List of Diagnostics items */}
            <div className="space-y-3 pt-2">
              <h4 className="text-[10px] font-extrabold text-zinc-500 uppercase tracking-widest border-b border-white/5 pb-2">
                Diagnostics Details
              </h4>

              <div className="space-y-3.5 max-h-[360px] overflow-y-auto pr-1">
                {seoDiagnostics.checks.map(check => (
                  <div key={check.id} className="space-y-1 group">
                    <div className="flex items-center justify-between text-xs font-semibold">
                      <div className="flex items-center gap-2">
                        {check.passed ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                        ) : check.actualScore > 0 ? (
                          <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0" />
                        ) : (
                          <AlertCircle className="w-4 h-4 text-red-400/80 flex-shrink-0" />
                        )}
                        <span className={themeMode === "dark" ? "text-zinc-200" : "text-zinc-800"}>
                          {check.title}
                        </span>
                      </div>
                      
                      <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded ${
                        check.passed 
                          ? "bg-emerald-500/10 text-emerald-400" 
                          : check.actualScore > 0 
                            ? "bg-amber-500/10 text-amber-400" 
                            : "bg-red-500/10 text-red-400"
                      }`}>
                        {check.statusText}
                      </span>
                    </div>

                    <p className="text-[10px] text-zinc-400 pl-6 leading-relaxed group-hover:text-zinc-300 transition-colors">
                      {check.advice}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* SEO Action Strategy Footer Card */}
            <div className={`p-4 rounded-xl text-[10px] leading-relaxed ${
              themeMode === "dark" ? "bg-zinc-950 text-zinc-400 border border-white/5" : "bg-zinc-50 text-zinc-500 border border-zinc-200"
            }`}>
              <span className="font-extrabold text-zinc-300 block mb-1 uppercase tracking-wider flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-accent animate-pulse" />
                Pro optimization tips
              </span>
              Verify keyword density is ideally between 1% and 2%. Over-optimizing above 3% results in google indexing penalties. Use clean H2 headings to split sections cleanly.
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
