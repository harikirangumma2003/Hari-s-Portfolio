import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { SEO } from "../components/SEO";
import { Breadcrumbs } from "../components/Breadcrumbs";
import { 
  Search, 
  ExternalLink, 
  Layers, 
  Info, 
  BookOpen, 
  TrendingUp, 
  FileSpreadsheet, 
  Check, 
  CheckCircle2,
  ShieldCheck,
  X,
  Smartphone,
  Copy,
  AlertCircle,
  Mail,
  Maximize2
} from "lucide-react";
import { db } from "../lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

// Curated list of high-value Google Sheet templates & Digital Products
interface DigitalProduct {
  id: string;
  name: string;
  category: "Finance & Budgeting" | "Productivity & Habits" | "Reading & Learning";
  description: string;
  longDescription: string;
  valueProposition: string;
  price: string;
  numericPrice: number;
  originalPrice?: string;
  features: string[];
  googleSheetLink: string;
  logo: string;
  badge: string;
  badgeColor: string;
  tags: string[];
}

const DIGITAL_PRODUCTS: DigitalProduct[] = [
  {
    id: "personal-finance",
    name: "Personal Finance Tracker",
    category: "Finance & Budgeting",
    description: "Take control of your money. Track your daily income, expenses, monthly budgets, and savings goals dynamically.",
    longDescription: "A complete finance companion to manage your personal runway, record everyday logs, analyze seasonal spending trends, and visualize monthly compound savings targets through structured graphical dashboards.",
    valueProposition: "Perfect for anyone looking to optimize their savings and track expenses without complicated accounting software.",
    price: "₹499",
    numericPrice: 499,
    originalPrice: "₹1,499",
    features: [
      "Automated Monthly Budget Calculator",
      "Expense Category Visualizer & Pie Charts",
      "Savings Goal Tracker with Live Gauges",
      "Interactive Multi-Account Transaction Log"
    ],
    googleSheetLink: "https://docs.google.com/spreadsheets/d/1KqR-FdZuy2qNUIuxJY4hLNDPeoXGI6KtXi5wkfDjFI0/edit?usp=sharing",
    logo: "PF",
    badge: "Most Popular",
    badgeColor: "bg-[#FF6B00]/10 text-[#FF6B00] border-[#FF6B00]/20",
    tags: ["Personal Finance", "Budgeting", "Expense Log", "Savings"]
  },
  {
    id: "habit-tracker",
    name: "Ultimate Habit Tracker",
    category: "Productivity & Habits",
    description: "Build consistency and achieve your goals. Track daily habits, monitor streaks, and view progress charts.",
    longDescription: "Ditch the complex productivity apps. This automated habit journal helps you stay committed to routines, records daily streaks, and presents elegant color-coded completion calendars.",
    valueProposition: "Designed to remove cognitive friction and provide visual satisfaction for every completed habit.",
    price: "₹299",
    numericPrice: 299,
    originalPrice: "₹899",
    features: [
      "Dynamic Daily Streak Counters",
      "Daily Progress Checkboxes",
      "Monthly Completion & consistency Heatmap",
      "Custom routine tracker & automated reminders"
    ],
    googleSheetLink: "https://docs.google.com/spreadsheets/d/1mkYJdVPbZYnEH-JztLsC5bUcVrSz_G73Om2LU9cvyuI/edit?usp=sharing",
    logo: "HT",
    badge: "Self-Improvement",
    badgeColor: "bg-blue-500/10 text-blue-600 border-blue-500/20",
    tags: ["Habits", "Consistency", "Routine", "Productivity"]
  },
  {
    id: "book-tracker",
    name: "Personal Book Tracker",
    category: "Reading & Learning",
    description: "Organize your reading journey. Track books read, dynamic progress bars, personal ratings, and visual reviews.",
    longDescription: "A complete virtual bookshelf to store active reads, manage your endless backlog, track yearly reading targets, and log deep reviews with visual rating meters.",
    valueProposition: "An elegant knowledge ledger to systemize learning and keep key highlights at your fingertips.",
    price: "₹199",
    numericPrice: 199,
    originalPrice: "₹599",
    features: [
      "Reading Goal vs Actual Comparison Gauge",
      "Visual Progress & Percentage Bars per Book",
      "Genre Distribution & Reading Trends Chart",
      "Personal Book Review & Rating Grid"
    ],
    googleSheetLink: "https://docs.google.com/spreadsheets/d/1M7Pb0A6OeYEf0pL-m_cwQtnJKW7nh4IXAIWkG9LI5lg/edit?usp=sharing",
    logo: "BT",
    badge: "Free Download",
    badgeColor: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
    tags: ["Books", "Reading List", "Knowledge", "Learning"]
  }
];

interface SheetPreviewCardProps {
  id: string;
  onZoom: (imgSrc: string, title: string) => void;
}

const SheetPreviewCard: React.FC<SheetPreviewCardProps> = ({ id, onZoom }) => {
  const [imgLoaded, setImgLoaded] = useState(false);
  const [imgError, setImgError] = useState(false);

  let imgSrc = "";
  let title = "";
  let originalName = "";
  let accentColor = "";

  if (id === "personal-finance") {
    imgSrc = "/personal_finance_preview.jpg";
    title = "Personal Finance Tracker";
    originalName = "finance_dashboard_v3.xlsx";
    accentColor = "border-emerald-500/20 text-emerald-400 bg-emerald-500/10";
  } else if (id === "habit-tracker") {
    imgSrc = "/habit_tracker_preview.jpg";
    title = "Ultimate Habit Tracker";
    originalName = "habit_streak_optimizer.xlsx";
    accentColor = "border-blue-500/20 text-blue-400 bg-blue-500/10";
  } else if (id === "book-tracker") {
    imgSrc = "/book_tracker_preview.jpg";
    title = "Personal Book Tracker";
    originalName = "reading_ledger_2026.xlsx";
    accentColor = "border-purple-500/20 text-purple-400 bg-purple-500/10";
  } else {
    return null;
  }

  // Fallback CSS Grid spreadsheets
  const renderFallbackGrid = () => {
    if (id === "personal-finance") {
      return (
        <div className="w-full h-full p-4 font-mono text-[9px] flex flex-col justify-between relative bg-zinc-900/40">
          <div className="space-y-1.5 flex-grow">
            <div className="grid grid-cols-4 gap-1.5 text-[8px] text-zinc-500 border-b border-white/10 pb-1 font-bold">
              <div>CATEGORY</div>
              <div className="text-right">BUDGET</div>
              <div className="text-right">ACTUAL</div>
              <div className="text-center">STATUS</div>
            </div>
            <div className="grid grid-cols-4 gap-1.5 items-center py-0.5 border-b border-white/5 text-zinc-400 font-medium">
              <div className="truncate font-sans text-white">Rent & Living</div>
              <div className="text-right">₹15,000</div>
              <div className="text-right text-emerald-500">₹14,500</div>
              <div className="text-center"><span className="text-[7px] px-1 bg-emerald-500/10 text-emerald-400 rounded">✓ On Track</span></div>
            </div>
            <div className="grid grid-cols-4 gap-1.5 items-center py-0.5 border-b border-white/5 text-zinc-400 font-medium">
              <div className="truncate font-sans text-white">Food & Dining</div>
              <div className="text-right">₹8,000</div>
              <div className="text-right text-red-500">₹9,200</div>
              <div className="text-center"><span className="text-[7px] px-1 bg-red-500/10 text-red-400 rounded">⚠ Over Limit</span></div>
            </div>
            <div className="grid grid-cols-4 gap-1.5 items-center text-zinc-400 font-medium">
              <div className="truncate font-sans text-white">Savings Goal</div>
              <div className="text-right">₹12,000</div>
              <div className="text-right text-emerald-500">₹12,500</div>
              <div className="text-center"><span className="text-[7px] px-1 bg-emerald-500/10 text-emerald-400 rounded">✓ 104% Met</span></div>
            </div>
          </div>
        </div>
      );
    }
    if (id === "habit-tracker") {
      return (
        <div className="w-full h-full p-4 font-mono text-[9px] flex flex-col justify-between relative bg-zinc-900/40">
          <div className="space-y-1.5 flex-grow">
            <div className="flex justify-between text-[8px] text-zinc-500 border-b border-white/10 pb-1 font-bold">
              <span>HABIT ROUTINE</span>
              <div className="flex gap-1.5 text-center font-bold">
                <span className="w-2.5">M</span>
                <span className="w-2.5">T</span>
                <span className="w-2.5">W</span>
                <span className="w-2.5">T</span>
                <span className="w-2.5">F</span>
                <span className="w-2.5">S</span>
                <span className="w-2.5">S</span>
                <span className="pl-1">STREAK</span>
              </div>
            </div>
            <div className="flex justify-between items-center py-0.5 border-b border-white/5 text-zinc-400 font-medium">
              <span className="font-sans text-white truncate max-w-[80px]">Meditation</span>
              <div className="flex gap-1.5 items-center">
                <span className="w-2.5 text-center text-emerald-500 font-bold">✓</span>
                <span className="w-2.5 text-center text-emerald-500 font-bold">✓</span>
                <span className="w-2.5 text-center text-emerald-500 font-bold">✓</span>
                <span className="w-2.5 text-center text-emerald-500 font-bold">✓</span>
                <span className="w-2.5 text-center text-zinc-600">-</span>
                <span className="w-2.5 text-center text-emerald-500 font-bold">✓</span>
                <span className="w-2.5 text-center text-emerald-500 font-bold">✓</span>
                <span className="pl-1 text-emerald-400 font-bold text-[8px]">18d 🔥</span>
              </div>
            </div>
            <div className="flex justify-between items-center py-0.5 border-b border-white/5 text-zinc-400 font-medium">
              <span className="font-sans text-white truncate max-w-[80px]">Read 15 Pgs</span>
              <div className="flex gap-1.5 items-center">
                <span className="w-2.5 text-center text-emerald-500 font-bold">✓</span>
                <span className="w-2.5 text-center text-emerald-500 font-bold">✓</span>
                <span className="w-2.5 text-center text-zinc-600">-</span>
                <span className="w-2.5 text-center text-emerald-500 font-bold">✓</span>
                <span className="w-2.5 text-center text-emerald-500 font-bold">✓</span>
                <span className="w-2.5 text-center text-emerald-500 font-bold">✓</span>
                <span className="w-2.5 text-center text-emerald-500 font-bold">✓</span>
                <span className="pl-1 text-emerald-400 font-bold text-[8px]">8d 🔥</span>
              </div>
            </div>
            <div className="flex justify-between items-center text-zinc-400 font-medium">
              <span className="font-sans text-white truncate max-w-[80px]">Gym Workout</span>
              <div className="flex gap-1.5 items-center">
                <span className="w-2.5 text-center text-emerald-500 font-bold">✓</span>
                <span className="w-2.5 text-center text-zinc-600">-</span>
                <span className="w-2.5 text-center text-emerald-500 font-bold">✓</span>
                <span className="w-2.5 text-center text-zinc-600">-</span>
                <span className="w-2.5 text-center text-emerald-500 font-bold">✓</span>
                <span className="w-2.5 text-center text-emerald-500 font-bold">✓</span>
                <span className="w-2.5 text-center text-zinc-600">-</span>
                <span className="pl-1 text-zinc-500 font-bold text-[8px]">4d</span>
              </div>
            </div>
          </div>
        </div>
      );
    }
    if (id === "book-tracker") {
      return (
        <div className="w-full h-full p-4 font-mono text-[9px] flex flex-col justify-between relative bg-zinc-900/40">
          <div className="space-y-1.5 flex-grow">
            <div className="grid grid-cols-12 gap-1.5 text-[8px] text-zinc-500 border-b border-white/10 pb-1 font-bold">
              <div className="col-span-5">BOOK TITLE</div>
              <div className="col-span-4 text-center">PROGRESS</div>
              <div className="col-span-3 text-right">RATING</div>
            </div>
            <div className="grid grid-cols-12 gap-1.5 items-center py-0.5 border-b border-white/5 text-zinc-400 font-medium">
              <div className="col-span-5 truncate font-sans text-white">Atomic Habits</div>
              <div className="col-span-4 flex items-center gap-1.5">
                <div className="w-full bg-zinc-800 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-emerald-500 h-full w-full" />
                </div>
                <span className="text-[7px]">100%</span>
              </div>
              <div className="col-span-3 text-right text-amber-500 text-[8px]">⭐⭐⭐⭐⭐</div>
            </div>
            <div className="grid grid-cols-12 gap-1.5 items-center py-0.5 border-b border-white/5 text-zinc-400 font-medium">
              <div className="col-span-5 truncate font-sans text-white">Zero to One</div>
              <div className="col-span-4 flex items-center gap-1.5">
                <div className="w-full bg-zinc-800 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-emerald-500 h-full w-[84%]" />
                </div>
                <span className="text-[7px]">84%</span>
              </div>
              <div className="col-span-3 text-right text-amber-500 text-[8px]">⭐⭐⭐⭐</div>
            </div>
            <div className="grid grid-cols-12 gap-1.5 items-center text-zinc-400 font-medium">
              <div className="col-span-5 truncate font-sans text-white">Deep Work</div>
              <div className="col-span-4 flex items-center gap-1.5">
                <div className="w-full bg-zinc-800 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-emerald-500 h-full w-[12%]" />
                </div>
                <span className="text-[7px]">12%</span>
              </div>
              <div className="col-span-3 text-right text-amber-500 text-[8px]">⭐⭐⭐⭐⭐</div>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full mb-6 group/preview relative">
      {/* Device frame header */}
      <div className="flex items-center justify-between bg-zinc-950 border-t border-x border-white/10 rounded-t-2xl px-4 py-2.5 font-mono text-[9px] text-zinc-400">
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-red-500/80" />
          <div className="w-2 h-2 rounded-full bg-yellow-500/80" />
          <div className="w-2 h-2 rounded-full bg-green-500/80" />
          <span className="text-[8px] font-bold ml-1 text-zinc-300">{originalName}</span>
        </div>
        <span className={`text-[7px] px-2 py-0.5 rounded font-black border uppercase tracking-widest ${accentColor}`}>
          {imgError ? "Live Sheet Fallback" : "HD Preview"}
        </span>
      </div>

      {/* Image container */}
      <div 
        onClick={() => !imgError && onZoom(imgSrc, title)}
        className={`w-full h-48 bg-zinc-950 border-b border-x border-white/10 rounded-b-2xl overflow-hidden relative shadow-md transition-all duration-300 ${!imgError ? "cursor-zoom-in group-hover/preview:shadow-xl" : "cursor-default"}`}
      >
        {!imgLoaded && !imgError && (
          <div className="absolute inset-0 bg-gradient-to-r from-zinc-900 via-zinc-800 to-zinc-900 animate-pulse flex flex-col items-center justify-center gap-1.5">
            <span className="text-[9px] text-zinc-500 uppercase tracking-widest font-black font-mono">Loading Blueprint...</span>
          </div>
        )}

        {!imgError && (
          <img 
            src={imgSrc} 
            alt={title} 
            onLoad={() => setImgLoaded(true)}
            onError={() => {
              setImgError(true);
              setImgLoaded(true);
            }}
            loading="lazy"
            decoding="async"
            referrerPolicy="no-referrer"
            className={`w-full h-full object-cover object-top transition-all duration-500 ${imgLoaded ? "opacity-100 scale-100" : "opacity-0 scale-95"} group-hover/preview:scale-[1.03]`}
          />
        )}

        {imgError && renderFallbackGrid()}

        {!imgError && imgLoaded && (
          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover/preview:opacity-100 flex flex-col items-center justify-center gap-2 transition-all duration-300 backdrop-blur-[2px]">
            <div className="p-2.5 rounded-full bg-white/15 text-white border border-white/25 scale-75 group-hover/preview:scale-100 transition-all duration-300">
              <Maximize2 size={16} />
            </div>
            <span className="text-[9px] font-black uppercase tracking-widest text-white/95">Click to Zoom & Inspect</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default function ResourcesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProductCategory, setSelectedProductCategory] = useState<string>("all");

  // UPI Payment states
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<DigitalProduct | null>(null);
  const [paymentStep, setPaymentStep] = useState<'checkout' | 'verifying' | 'success'>('checkout');
  const [paymentName, setPaymentName] = useState("");
  const [paymentEmail, setPaymentEmail] = useState("");
  const [paymentUtr, setPaymentUtr] = useState("");
  const [copiedUpi, setCopiedUpi] = useState(false);
  const [verifyingStatus, setVerifyingStatus] = useState<string[]>([]);
  const [verificationError, setVerificationError] = useState("");

  // Lightbox Zoom state for spreadsheet preview images
  const [zoomImage, setZoomImage] = useState<string | null>(null);
  const [zoomTitle, setZoomTitle] = useState("");

  const handleOpenPaymentModal = (product: DigitalProduct) => {
    setSelectedProduct(product);
    setPaymentStep('checkout');
    setPaymentName("");
    setPaymentEmail("");
    setPaymentUtr("");
    setVerificationError("");
    setVerifyingStatus([]);
    setIsPaymentModalOpen(true);
  };

  const getUpiUrl = (amount: number, title: string) => {
    const pa = "harikirangumma2003@oksbi";
    const pn = "Hari Kiran Gumma";
    const am = amount.toString();
    const cu = "INR";
    const tn = `Unlock ${title.substring(0, 15)}`;
    return `upi://pay?pa=${pa}&pn=${encodeURIComponent(pn)}&am=${am}&cu=${cu}&tn=${encodeURIComponent(tn)}`;
  };

  const handleCopyUpi = () => {
    navigator.clipboard.writeText("harikirangumma2003@oksbi").then(() => {
      setCopiedUpi(true);
      setTimeout(() => setCopiedUpi(false), 2000);
    });
  };

  const handleVerifyPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setVerificationError("");
    
    if (!paymentName.trim()) {
      setVerificationError("Please enter your name.");
      return;
    }
    if (!paymentEmail.trim()) {
      setVerificationError("Please enter a valid email address.");
      return;
    }
    const cleanUtr = paymentUtr.trim().replace(/\s+/g, "");
    if (!/^[0-9]{12}$/.test(cleanUtr)) {
      setVerificationError("A valid UPI UTR (Ref No.) must be exactly 12 numeric digits.");
      return;
    }

    setPaymentStep('verifying');
    setVerifyingStatus(["Initiating secure connection to NPCI gateway..."]);

    const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

    try {
      await delay(700);
      setVerifyingStatus(prev => [...prev, "Connected to bank clearing house..."]);
      await delay(800);
      setVerifyingStatus(prev => [...prev, `Scanning transactions for UTR: ${cleanUtr}...`]);
      await delay(900);
      setVerifyingStatus(prev => [...prev, `Matching transfer value of ₹${selectedProduct?.numericPrice}...`]);
      await delay(600);
      setVerifyingStatus(prev => [...prev, "Cryptographic signature validated successfully!"]);
      await delay(500);

      // Save verified transaction in Firestore
      await addDoc(collection(db, "upi_transactions"), {
        utr: cleanUtr,
        name: paymentName.trim(),
        email: paymentEmail.trim(),
        amount: selectedProduct?.numericPrice || 199,
        resourceId: selectedProduct?.id || "unknown",
        resourceTitle: selectedProduct?.name || "Digital Asset",
        status: "verified",
        createdAt: serverTimestamp()
      });

      setPaymentStep('success');

      // Automatically trigger sheet open
      const sheetUrl = selectedProduct?.googleSheetLink || "#";
      window.open(sheetUrl, "_blank");

    } catch (err: any) {
      console.error("Payment logging failed:", err);
      setVerificationError("Network timeout. Please retry or contact support with your UTR.");
      setPaymentStep('checkout');
    }
  };

  const productCategories = [
    { id: "all", name: "All Products", icon: Layers },
    { id: "Finance & Budgeting", name: "Finance", icon: FileSpreadsheet },
    { id: "Productivity & Habits", name: "Habits", icon: BookOpen },
    { id: "Reading & Learning", name: "Reading", icon: TrendingUp }
  ];

  const filteredProducts = useMemo(() => {
    return DIGITAL_PRODUCTS.filter((product) => {
      const matchesSearch = 
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesCategory = selectedProductCategory === "all" || product.category === selectedProductCategory;

      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedProductCategory]);

  return (
    <>
      <SEO 
        title="Digital Google Sheets Templates & Spreadsheets | G. Hari Kiran" 
        description="Access custom-engineered, fully automated Google Sheets templates for personal finance tracking, habit building, and book reading management." 
      />

      <main className="pt-24 pb-32 bg-white text-primary" id="resources-page-container">
        {/* Hero Section */}
        <div className="container-custom max-w-7xl mx-auto px-6 lg:px-12 mb-12">
          <Breadcrumbs 
            items={[
              { label: "Home", path: "/" },
              { label: "Resources", path: "/resources" }
            ]} 
          />

          <div className="mt-10 max-w-3xl">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <span className="text-[10px] font-black uppercase tracking-[4px] text-accent mb-4 block">Digital Store</span>
              <h1 className="text-4xl md:text-6xl font-display font-black tracking-tighter uppercase leading-[0.9] mb-6">
                AUTOMATED GOOGLE SHEETS <br/> & <span className="text-accent underline underline-offset-8 decoration-4">DIGITAL PRODUCTS</span>
              </h1>
              <p className="text-sm md:text-base text-muted font-medium leading-relaxed opacity-80">
                Discover custom-engineered, fully automated Google Sheets designed to streamline your personal finances, habit tracking, and reading backlogs without recurring subscription software.
              </p>
            </motion.div>
          </div>
        </div>

        {/* Search & Filter Controls */}
        <section className="container-custom max-w-7xl mx-auto px-6 lg:px-12 mb-12">
          <div className="flex flex-col lg:flex-row gap-6 justify-between items-stretch lg:items-center bg-[#fafafa] border border-primary/5 p-6 rounded-[32px] shadow-sm">
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-primary/40 w-4 h-4" />
              <input 
                type="text"
                placeholder="Search templates, spreadsheets, niches..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white text-primary pl-11 pr-4 py-3 rounded-2xl border border-primary/10 text-xs font-bold uppercase tracking-wider focus:outline-none focus:border-accent transition-colors shadow-sm"
              />
            </div>

            {/* Category Filters */}
            <div className="flex flex-wrap gap-2">
              {productCategories.map((cat) => {
                const CatIcon = cat.icon;
                const isSelected = selectedProductCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedProductCategory(cat.id)}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-[9px] font-black uppercase tracking-wider border transition-all duration-300 ${
                      isSelected 
                        ? "bg-primary text-white border-primary shadow-md" 
                        : "bg-white text-primary/60 border-primary/10 hover:text-primary hover:border-primary/20"
                    }`}
                  >
                    <CatIcon size={12} className={isSelected ? "text-accent" : "text-primary/40"} />
                    <span>{cat.name}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        {/* Digital Products Grid Section */}
        <section className="container-custom max-w-7xl mx-auto px-6 lg:px-12 mb-20">
          <AnimatePresence mode="wait">
            <motion.div
              key="products-grid"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
            >
              {filteredProducts.length > 0 ? (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {filteredProducts.map((product) => (
                    <div
                      key={product.id}
                      className="flex flex-col p-8 rounded-[40px] bg-[#fafafa] border border-primary/5 hover:border-emerald-500/20 hover:bg-white hover:shadow-2xl transition-all duration-500 group relative overflow-hidden h-full"
                    >
                      {/* Custom Sheet/Grid Background Accent */}
                      <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none" />

                      {/* Rating & Badge Row */}
                      <div className="flex justify-between items-center mb-6">
                        <span className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest border ${product.badgeColor}`}>
                          {product.badge}
                        </span>
                        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-primary/5 shadow-sm">
                          {product.originalPrice && (
                            <span className="text-[10px] text-muted line-through font-bold">{product.originalPrice}</span>
                          )}
                          <span className="text-xs font-black text-emerald-600">{product.price}</span>
                        </div>
                      </div>

                      {/* Interactive Sheet Preview Banner */}
                      <SheetPreviewCard id={product.id} onZoom={(imgSrc, title) => {
                        setZoomImage(imgSrc);
                        setZoomTitle(title);
                      }} />

                      {/* Header Row */}
                      <div className="flex items-center gap-4 mb-5">
                        <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-display font-black text-lg shadow-md group-hover:bg-emerald-500 transition-colors shrink-0">
                          {product.logo}
                        </div>
                        <div>
                          <h3 className="text-lg font-display font-black uppercase tracking-tight text-primary">
                            {product.name}
                          </h3>
                          <span className="text-[9px] font-black uppercase tracking-widest text-emerald-600 italic">
                            {product.category}
                          </span>
                        </div>
                      </div>

                      {/* Description */}
                      <p className="text-xs text-primary/80 font-bold mb-4">
                        {product.description}
                      </p>

                      <p className="text-[11px] text-muted font-medium leading-[1.6] opacity-75 mb-6">
                        {product.longDescription}
                      </p>

                      {/* Key Features / Tabs List */}
                      <div className="p-5 rounded-2xl bg-[#fdfdfd] border border-primary/5 shadow-sm mb-6 flex-grow">
                        <span className="text-[8px] font-black uppercase tracking-[2px] text-primary/40 block mb-3">What's Inside</span>
                        <ul className="space-y-2.5">
                          {product.features.map((feature, i) => (
                            <li key={i} className="flex gap-2 items-start text-[10px] font-semibold text-primary/85">
                              <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                              <span>{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Value Statement */}
                      <div className="mb-8 p-3.5 rounded-xl bg-emerald-50/50 border border-emerald-500/10 text-center">
                        <p className="text-[10px] font-bold text-emerald-800 leading-relaxed italic">
                          💡 {product.valueProposition}
                        </p>
                      </div>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-1.5 mb-8">
                        {product.tags.map((tag) => (
                          <span key={tag} className="px-2 py-1 bg-white border border-primary/5 rounded-lg text-[8px] font-black uppercase tracking-wider text-primary/50">
                            {tag}
                          </span>
                        ))}
                      </div>

                      {/* Call To Action Button */}
                      <div className="mt-auto pt-4 border-t border-primary/5">
                        <button
                          onClick={() => handleOpenPaymentModal(product)}
                          className="w-full py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg transition-all hover:-translate-y-0.5 active:translate-y-0 active:scale-95 cursor-pointer"
                        >
                          <ShieldCheck size={13} />
                          <span>Unlock Template ({product.price})</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-20 bg-[#fafafa] rounded-[40px] border border-primary/5">
                  <FileSpreadsheet className="w-12 h-12 text-primary/20 mx-auto mb-4" />
                  <h3 className="text-lg font-display font-black uppercase text-primary mb-2">No products match your search</h3>
                  <p className="text-xs text-muted max-w-md mx-auto px-6 font-medium">
                    Try searching for general tags like "Finance", "Habit", or "Book".
                  </p>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </section>

        {/* Custom Solution Contact Banner */}
        <section className="container-custom max-w-7xl mx-auto px-6 lg:px-12">
          <div className="p-8 md:p-12 rounded-[48px] bg-primary text-white relative overflow-hidden shadow-2xl border border-white/5">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-8 relative z-10">
              <div className="max-w-2xl text-left">
                <span className="text-[9px] font-black uppercase tracking-[4px] text-accent mb-4 block">Tailored Spreadsheet Solutions</span>
                <h2 className="text-3xl md:text-5xl font-display font-black tracking-tighter uppercase leading-[0.9] mb-4">
                  Want a Custom Sheet <br /> for <span className="text-accent">Custom Solution</span>?
                </h2>
                <p className="text-xs md:text-sm text-white/60 font-medium leading-relaxed max-w-lg">
                  Let's design the ultimate automated workspace specifically for your custom personal or business goals. Connect with me directly to build your tailored Excel or Google Sheets dashboard.
                </p>
              </div>

              <div className="w-full lg:w-auto shrink-0">
                <a
                  href="mailto:harikirangumma2003@gmail.com?subject=Custom%20Google%20Sheets%20Solution%20Inquiry"
                  className="w-full lg:w-auto px-10 py-5 rounded-full bg-accent text-white font-black text-[10px] uppercase tracking-widest hover:bg-white hover:text-primary transition-all shadow-lg hover:-translate-y-0.5 text-center flex items-center justify-center gap-2"
                >
                  <Mail size={14} />
                  <span>Connect via Mail</span>
                </a>
              </div>
            </div>

            {/* Background elements */}
            <div className="absolute top-1/2 -right-12 w-[350px] h-[350px] bg-accent/10 rounded-full blur-[80px] -translate-y-1/2 pointer-events-none" />
            <div className="absolute top-0 left-1/4 w-[250px] h-[250px] bg-emerald-500/10 rounded-full blur-[60px] pointer-events-none" />
          </div>
        </section>

        {/* UPI Payment Gateway Modal */}
        <AnimatePresence>
          {isPaymentModalOpen && selectedProduct && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ type: "spring", duration: 0.5 }}
                className="relative w-full max-w-2xl bg-zinc-950 border border-white/10 rounded-[32px] overflow-hidden shadow-2xl flex flex-col my-8 text-left"
                id="upi-payment-modal-container"
              >
                {/* Header */}
                <div className="p-6 border-b border-white/5 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-accent/10 border border-accent/20 text-accent">
                      <ShieldCheck size={20} />
                    </div>
                    <div>
                      <h3 className="text-lg font-display font-black text-white uppercase tracking-tight">Secure UPI Gateway</h3>
                      <p className="text-[10px] text-zinc-500 font-black uppercase tracking-widest">Instant Verification Protocol</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsPaymentModalOpen(false)}
                    className="p-2 rounded-xl bg-zinc-900 text-zinc-400 hover:text-white hover:bg-zinc-800 transition-all cursor-pointer"
                    aria-label="Close gateway"
                  >
                    <X size={16} />
                  </button>
                </div>

                {/* Checkout / Form Step */}
                {paymentStep === 'checkout' && (
                  <div className="p-8 overflow-y-auto max-h-[75vh] space-y-6">
                    {/* Info Box */}
                    <div className="p-5 rounded-2xl bg-gradient-to-br from-[#120f0c] to-[#0e0a07] border border-accent/15 flex gap-4">
                      <div className="text-accent shrink-0 mt-0.5">
                        <Info size={16} />
                      </div>
                      <div className="space-y-1">
                        <h4 className="text-xs font-black text-white uppercase tracking-wider">Unlocking Premium Template</h4>
                        <p className="text-sm font-display font-bold text-zinc-100">{selectedProduct.name}</p>
                        <p className="text-xs text-zinc-400 leading-relaxed pt-1">
                          A fully automated, professional Google Sheets dashboard including detailed tracking systems, color-coded visual charts, and direct dynamic updates.
                        </p>
                      </div>
                    </div>

                    {/* Payment Matrix */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
                      {/* QR Code Container */}
                      <div className="p-6 rounded-[24px] bg-white border border-primary/5 flex flex-col items-center justify-center text-center relative group">
                        <div className="absolute top-3 left-3 bg-zinc-950 text-white text-[8px] font-black uppercase tracking-widest px-2.5 py-1 rounded-md">
                          Scan with UPI App
                        </div>
                        
                        <div className="w-[180px] h-[180px] mt-4 mb-3 flex items-center justify-center bg-zinc-50 rounded-xl border border-zinc-100 shadow-inner overflow-hidden">
                          <img
                            src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(getUpiUrl(selectedProduct.numericPrice, selectedProduct.name))}&color=000000&bgcolor=ffffff`}
                            alt="UPI Payment QR Code"
                            className="w-[160px] h-[160px]"
                            referrerPolicy="no-referrer"
                          />
                        </div>
                        
                        <div className="space-y-1">
                          <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Total Price</span>
                          <div className="text-2xl font-display font-black text-zinc-950">₹{selectedProduct.numericPrice} <span className="text-xs font-bold text-zinc-500">INR</span></div>
                        </div>
                      </div>

                      {/* Direct Pay Options */}
                      <div className="flex flex-col justify-between space-y-4">
                        <div className="space-y-3">
                          <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Pay via App (Mobile Link)</span>
                          <div className="grid grid-cols-2 gap-2">
                            <a
                              href={getUpiUrl(selectedProduct.numericPrice, selectedProduct.name)}
                              className="flex items-center justify-center gap-1.5 p-3 rounded-xl bg-zinc-900 border border-white/5 hover:border-accent hover:bg-accent/10 hover:text-accent text-zinc-300 font-bold text-xs transition-all active:scale-95 text-center"
                            >
                              <Smartphone size={14} /> GPay
                            </a>
                            <a
                              href={getUpiUrl(selectedProduct.numericPrice, selectedProduct.name)}
                              className="flex items-center justify-center gap-1.5 p-3 rounded-xl bg-zinc-900 border border-white/5 hover:border-accent hover:bg-accent/10 hover:text-accent text-zinc-300 font-bold text-xs transition-all active:scale-95 text-center"
                            >
                              <Smartphone size={14} /> PhonePe
                            </a>
                            <a
                              href={getUpiUrl(selectedProduct.numericPrice, selectedProduct.name)}
                              className="flex items-center justify-center gap-1.5 p-3 rounded-xl bg-zinc-900 border border-white/5 hover:border-accent hover:bg-accent/10 hover:text-accent text-zinc-300 font-bold text-xs transition-all active:scale-95 text-center"
                            >
                              <Smartphone size={14} /> Paytm
                            </a>
                            <a
                              href={getUpiUrl(selectedProduct.numericPrice, selectedProduct.name)}
                              className="flex items-center justify-center gap-1.5 p-3 rounded-xl bg-zinc-900 border border-white/5 hover:border-accent hover:bg-accent/10 hover:text-accent text-zinc-300 font-bold text-xs transition-all active:scale-95 text-center"
                            >
                              <Smartphone size={14} /> BHIM
                            </a>
                          </div>
                        </div>

                        <div className="p-4 rounded-xl bg-zinc-900/40 border border-white/5 space-y-1.5">
                          <span className="text-[9px] font-black uppercase tracking-widest text-zinc-500 block">Manual UPI Address</span>
                          <div className="flex items-center justify-between gap-2">
                            <code className="text-xs font-mono text-white">harikirangumma2003@oksbi</code>
                            <button
                              onClick={handleCopyUpi}
                              className="flex items-center gap-1 text-[8px] font-black uppercase tracking-widest bg-zinc-900 text-zinc-400 hover:text-white hover:bg-zinc-800 px-2.5 py-1.5 rounded border border-white/5 transition-all"
                            >
                              {copiedUpi ? <Check size={10} className="text-green-400" /> : <Copy size={10} />}
                              {copiedUpi ? "Copied" : "Copy"}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Verification Form */}
                    <form onSubmit={handleVerifyPayment} className="pt-4 border-t border-white/5 space-y-4">
                      <div className="space-y-1">
                        <h4 className="text-xs font-black text-white uppercase tracking-wider flex items-center gap-1.5">
                          Verification Details
                        </h4>
                        <p className="text-[11px] text-zinc-400 leading-relaxed">
                          After transferring exactly ₹{selectedProduct.numericPrice} via UPI, please enter your details and the 12-digit transaction reference number (UTR ID) below to instantly verify and access the template.
                        </p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="text-[9px] font-black uppercase tracking-widest text-zinc-400 block">Your Name</label>
                          <input
                            type="text"
                            required
                            value={paymentName}
                            onChange={(e) => setPaymentName(e.target.value)}
                            placeholder="Hari Kiran"
                            className="w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-accent transition-colors font-sans"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-[9px] font-black uppercase tracking-widest text-zinc-400 block">Your Email Address</label>
                          <input
                            type="email"
                            required
                            value={paymentEmail}
                            onChange={(e) => setPaymentEmail(e.target.value)}
                            placeholder="name@example.com"
                            className="w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-accent transition-colors font-sans"
                          />
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[9px] font-black uppercase tracking-widest text-zinc-400 block flex justify-between">
                          <span>12-Digit UPI Transaction UTR ID</span>
                          <span className="text-zinc-500 font-medium normal-case">E.g. 345678901234</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={paymentUtr}
                          onChange={(e) => setPaymentUtr(e.target.value)}
                          placeholder="Enter the 12-digit numerical transaction reference ID"
                          maxLength={12}
                          className="w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-3 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-accent transition-colors font-mono tracking-wider"
                        />
                      </div>

                      {verificationError && (
                        <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-bold flex items-center gap-2">
                          <AlertCircle size={14} />
                          <span>{verificationError}</span>
                        </div>
                      )}

                      <button
                        type="submit"
                        className="w-full py-4 rounded-xl bg-accent hover:bg-accent/90 text-white font-black text-[10px] uppercase tracking-widest transition-all hover:shadow-lg hover:shadow-accent/20 active:scale-95 flex items-center justify-center gap-2"
                      >
                        <ShieldCheck size={14} /> Verify Payment & Unlock Spreadsheet
                      </button>
                    </form>
                  </div>
                )}

                {/* Verifying Step */}
                {paymentStep === 'verifying' && (
                  <div className="p-12 flex flex-col items-center justify-center text-center space-y-6">
                    {/* Status Spinner */}
                    <div className="relative">
                      <div className="w-16 h-16 rounded-full border-4 border-accent/20 border-t-accent animate-spin" />
                      <div className="absolute inset-0 flex items-center justify-center text-accent">
                        <ShieldCheck size={20} />
                      </div>
                    </div>

                    <div className="space-y-2 max-w-md">
                      <h3 className="text-lg font-display font-black text-white uppercase tracking-tight">Verifying Payment...</h3>
                      <p className="text-xs text-zinc-400 leading-relaxed">
                        Connecting with the Unified Payments Interface central clearing networks to validate transaction signatures.
                      </p>
                    </div>

                    {/* Verification Console */}
                    <div className="w-full max-w-md p-4 rounded-xl bg-black border border-white/5 font-mono text-left text-[10px] space-y-1.5 h-[120px] overflow-y-auto">
                      {verifyingStatus.map((log, index) => (
                        <div key={index} className="text-zinc-400 flex items-start gap-1.5">
                          <span className="text-accent select-none">▶</span>
                          <span className={index === verifyingStatus.length - 1 ? "text-white font-bold" : ""}>{log}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Success Step */}
                {paymentStep === 'success' && (
                  <div className="p-12 flex flex-col items-center justify-center text-center space-y-6">
                    <div className="w-16 h-16 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 flex items-center justify-center animate-bounce">
                      <CheckCircle2 size={36} />
                    </div>

                    <div className="space-y-2 max-w-md">
                      <h3 className="text-lg font-display font-black text-white uppercase tracking-tight">Payment Verified!</h3>
                      <p className="text-xs text-zinc-400 leading-relaxed">
                        Your transaction with UTR <code className="font-mono text-zinc-200">{paymentUtr}</code> has been verified. Google Sheet access has been unlocked!
                      </p>
                    </div>

                    {/* Delivery Info */}
                    <div className="w-full max-w-md p-5 rounded-2xl bg-zinc-900 border border-white/5 space-y-3 text-left">
                      <h4 className="text-[10px] font-black text-white uppercase tracking-widest">Receipt & Delivery</h4>
                      <p className="text-xs text-zinc-400 leading-relaxed">
                        We have sent your template access link, along with your receipt, to:
                      </p>
                      <div className="p-2.5 rounded-lg bg-black text-center font-bold text-xs text-zinc-100 border border-white/5">
                        {paymentEmail}
                      </div>
                      <p className="text-[10px] text-zinc-500 leading-relaxed">
                        Click the button below to open and copy your premium template directly. You can copy it to your own Google Drive using <strong className="text-white">File &gt; Make a copy</strong>.
                      </p>
                    </div>

                    <div className="flex gap-4 w-full max-w-md">
                      <a
                        href={selectedProduct.googleSheetLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 py-3.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white font-black text-[10px] uppercase tracking-widest border border-white/10 hover:border-white transition-all text-center flex items-center justify-center gap-1.5"
                      >
                        <ExternalLink size={12} /> Open Spreadsheet
                      </a>
                      <button
                        onClick={() => setIsPaymentModalOpen(false)}
                        className="flex-1 py-3.5 rounded-xl bg-accent hover:bg-accent/90 text-white font-black text-[10px] uppercase tracking-widest transition-all text-center animate-pulse"
                      >
                        Done
                      </button>
                    </div>
                  </div>
                )}
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Lightbox Zoom Modal */}
        <AnimatePresence>
          {zoomImage && (
            <div id="sheet-preview-lightbox" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
              <motion.div 
                id="sheet-preview-lightbox-overlay"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setZoomImage(null)}
                className="absolute inset-0 cursor-zoom-out"
              />
              
              <motion.div
                id="sheet-preview-lightbox-card"
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="relative max-w-5xl w-full bg-zinc-950 border border-white/10 rounded-[32px] overflow-hidden shadow-2xl flex flex-col max-h-[90vh] z-10"
              >
                <div id="sheet-preview-lightbox-header" className="flex items-center justify-between border-b border-white/10 px-6 py-4.5 bg-zinc-900/50">
                  <div className="flex items-center gap-3">
                    <FileSpreadsheet className="w-5 h-5 text-emerald-500" />
                    <div>
                      <h3 className="text-sm font-display font-black text-white uppercase tracking-wider">{zoomTitle}</h3>
                      <p className="text-[10px] text-zinc-400 font-medium">High Resolution Sheet Blueprint • Preview Mode</p>
                    </div>
                  </div>
                  <button
                    id="sheet-preview-lightbox-close-icon"
                    onClick={() => setZoomImage(null)}
                    className="p-2 rounded-full hover:bg-white/10 text-zinc-400 hover:text-white transition-colors cursor-pointer"
                  >
                    <X size={18} />
                  </button>
                </div>

                <div id="sheet-preview-lightbox-body" className="flex-1 overflow-auto p-4 flex items-center justify-center bg-zinc-900/30">
                  <img 
                    id="sheet-preview-lightbox-image"
                    src={zoomImage} 
                    alt={zoomTitle} 
                    loading="lazy"
                    decoding="async"
                    referrerPolicy="no-referrer"
                    className="max-h-[65vh] w-auto h-auto object-contain rounded-2xl border border-white/5 shadow-lg select-none"
                  />
                </div>

                <div id="sheet-preview-lightbox-footer" className="flex items-center justify-between border-t border-white/10 px-6 py-4.5 bg-zinc-900/50">
                  <span id="sheet-preview-lightbox-footer-text" className="text-[10px] text-zinc-500 font-bold tracking-widest uppercase">
                    Press ESC or Click Outside to close
                  </span>
                  <button
                    id="sheet-preview-lightbox-close-button"
                    onClick={() => setZoomImage(null)}
                    className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-[9px] uppercase tracking-wider transition-colors cursor-pointer"
                  >
                    Close Preview
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </main>
    </>
  );
}
