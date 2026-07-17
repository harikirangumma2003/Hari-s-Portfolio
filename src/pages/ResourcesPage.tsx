import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { SEO } from "../components/SEO";
import { Breadcrumbs } from "../components/Breadcrumbs";
import { 
  Search, 
  ExternalLink, 
  Award, 
  Sparkles, 
  SlidersHorizontal,
  Layers,
  Zap,
  Filter,
  CheckCircle2,
  Info,
  BookOpen,
  TrendingUp,
  Heart
} from "lucide-react";

// Curated list of high-quality tools for marketing, design, and SEO
interface ToolItem {
  id: string;
  name: string;
  category: "SEO & Analytics" | "Design & Brand" | "Content & Copy" | "Automation & Hosting";
  description: string;
  longDescription: string;
  whyIUseIt: string;
  rating: number;
  promoText: string;
  badge: string;
  badgeColor: string;
  affiliateUrl: string;
  logo: string;
  tags: string[];
}

const RECOMMENDED_TOOLS: ToolItem[] = [
  {
    id: "semrush",
    name: "Semrush",
    category: "SEO & Analytics",
    description: "The gold standard in search intelligence, competitor analysis, and organic traffic growth.",
    longDescription: "Semrush is an all-in-one digital marketing suite that covers SEO, PPC, SMM, keyword research, competitive research, PR, content marketing, and market insights. It is the absolute core engine of my professional SEO consulting workflow.",
    whyIUseIt: "It provides the most accurate search volume metrics, competitor backlink profiling, and automated keyword tracking that allow me to design 300% growth blueprints for my clients.",
    rating: 4.9,
    promoText: "Get a 7-Day Free Trial of Semrush Pro",
    badge: "Must Have",
    badgeColor: "bg-[#FF6B00]/10 text-[#FF6B00] border-[#FF6B00]/20",
    affiliateUrl: "https://semrush.sjv.io/c/5443210/1308303/13010",
    logo: "SR",
    tags: ["Keyword Research", "Competitor Audit", "Rank Tracker"]
  },
  {
    id: "canva",
    name: "Canva Pro",
    category: "Design & Brand",
    description: "Empower your marketing with stunning, professional-grade visual assets and layouts instantly.",
    longDescription: "Canva Pro is a powerhouse graphic design platform that simplifies content creation. With millions of premium templates, fonts, icons, and automated brand-kit syncing, it enables brands to output cohesive visual assets across social channels at warp speed.",
    whyIUseIt: "I use Canva Pro to quickly mock up social content, newsletter graphics, and visual slides for clients. It bridges the gap between raw data and captivating storytelling.",
    rating: 4.8,
    promoText: "Try Canva Pro Free for 30 Days",
    badge: "Best for Social",
    badgeColor: "bg-blue-500/10 text-blue-600 border-blue-500/20",
    affiliateUrl: "https://partner.canva.com/c/5443210/647168/10068",
    logo: "CV",
    tags: ["Graphic Design", "Social Graphics", "Templates"]
  },
  {
    id: "ahrefs",
    name: "Ahrefs",
    category: "SEO & Analytics",
    description: "Unmatched backlink index, keyword explorer, and technical site audit capabilities.",
    longDescription: "Ahrefs is a premium toolset for SEO and marketing professionals. It provides detailed domain comparison charts, link-building opportunities, deep organic traffic estimates, and highly responsive page crawlers.",
    whyIUseIt: "While Semrush is my primary hub, Ahrefs has an incredibly clean backlink database and their Site Explorer tool is unparalleled for reverse-engineering competitor link-building strategies.",
    rating: 4.8,
    promoText: "Explore Ahrefs SEO Tools",
    badge: "Premium Choice",
    badgeColor: "bg-purple-500/10 text-purple-600 border-purple-500/20",
    affiliateUrl: "https://ahrefs.com",
    logo: "AH",
    tags: ["Backlinks Analysis", "Technical Audit", "Content Explorer"]
  },
  {
    id: "surferseo",
    name: "Surfer SEO",
    category: "Content & Copy",
    description: "Write content that Google loves with NLP-driven content editors and outline builders.",
    longDescription: "Surfer SEO merges content creation with technical data science. It analyzes competitor page structures, word counts, and semantic NLP entities to give you an exact roadmap for writing articles that rank on page one.",
    whyIUseIt: "It completely eliminates the guesswork from content marketing. Every article I optimize through Surfer ranks significantly higher, saving weeks of continuous manual testing.",
    rating: 4.7,
    promoText: "Optimize Content with Surfer",
    badge: "AI Powered",
    badgeColor: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
    affiliateUrl: "https://surferseo.com",
    logo: "SF",
    tags: ["NLP SEO", "Content Optimization", "SERP Analyzer"]
  },
  {
    id: "hostinger",
    name: "Hostinger",
    category: "Automation & Hosting",
    description: "Ultra-fast, secure, and budget-friendly web hosting optimized for WordPress SEO.",
    longDescription: "Hostinger provides lightning-quick cloud and WordPress hosting environments. Backed by LiteSpeed cache engines, global CDNs, and robust security Firewalls, it ensures your website scores a perfect 100 on Core Web Vitals.",
    whyIUseIt: "For startups and local e-commerce brands, speed is a major search ranking factor. Hostinger delivers world-class load speeds and server reliability at an accessible price point.",
    rating: 4.6,
    promoText: "Save Up to 75% on High-Speed Hosting",
    badge: "Top Value",
    badgeColor: "bg-amber-500/10 text-amber-600 border-amber-500/20",
    affiliateUrl: "https://www.hostinger.com",
    logo: "HI",
    tags: ["WordPress Hosting", "Site Speed", "Free SSL"]
  },
  {
    id: "mailerlite",
    name: "MailerLite",
    category: "Automation & Hosting",
    description: "Clean, elegant, and highly effective email marketing automation with top-tier deliverability.",
    longDescription: "MailerLite is a digital marketing automation platform that makes newsletters, pop-ups, and custom landing pages accessible to everyone. Known for its clean interfaces and robust deliverability rates.",
    whyIUseIt: "I recommend MailerLite for brands starting with retention marketing. Its drag-and-drop editor is intuitive, and its automation builders make executing drip campaigns incredibly straightforward.",
    rating: 4.7,
    promoText: "Sign Up for MailerLite Free",
    badge: "Easiest to Use",
    badgeColor: "bg-pink-500/10 text-pink-600 border-pink-500/20",
    affiliateUrl: "https://www.mailerlite.com",
    logo: "ML",
    tags: ["Email Automation", "Newsletters", "A/B Testing"]
  }
];

export default function ResourcesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const categories = [
    { id: "all", name: "All Tools", icon: Layers },
    { id: "SEO & Analytics", name: "SEO & Analytics", icon: TrendingUp },
    { id: "Design & Brand", name: "Design & Brand", icon: Sparkles },
    { id: "Content & Copy", name: "Content & Copy", icon: BookOpen },
    { id: "Automation & Hosting", name: "Automation & Hosting", icon: Zap }
  ];

  const filteredTools = RECOMMENDED_TOOLS.filter((tool) => {
    const matchesSearch = 
      tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = selectedCategory === "all" || tool.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <>
      <SEO 
        title="Recommended Tools & Marketing Stack | G. Hari Kiran" 
        description="Explore the curated, battle-tested suite of SEO, graphic design, content marketing, and web hosting tools I use to scale brands organic growth." 
      />

      <main className="pt-24 pb-32 bg-white text-primary" id="resources-page-container">
        {/* Hero Section */}
        <div className="container-custom max-w-7xl mx-auto px-6 lg:px-12 mb-16">
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
              <span className="text-[10px] font-black uppercase tracking-[4px] text-accent mb-4 block">Recommended Tech Stack</span>
              <h1 className="text-4xl md:text-6xl font-display font-black tracking-tighter uppercase leading-[0.9] mb-6">
                Tools that scale <br/> <span className="text-accent underline underline-offset-8 decoration-4">Organic Growth</span>
              </h1>
              <p className="text-sm md:text-base text-muted font-medium leading-relaxed opacity-80">
                I believe in transparency and performance. Every platform listed here is actively integrated into my daily client workflows. These tools have been battle-tested to deliver actual organic traffic and conversion results.
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
                placeholder="Search tools, features, tags..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white text-primary pl-11 pr-4 py-3 rounded-2xl border border-primary/10 text-xs font-bold uppercase tracking-wider focus:outline-none focus:border-accent transition-colors shadow-sm"
              />
            </div>

            {/* Category Filters */}
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => {
                const CatIcon = cat.icon;
                const isSelected = selectedCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
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

        {/* FTC Disclosure Notice */}
        <section className="container-custom max-w-7xl mx-auto px-6 lg:px-12 mb-16">
          <div className="flex gap-4 p-6 rounded-[24px] bg-accent/5 border border-accent/10 items-start max-w-4xl">
            <Info className="w-5 h-5 text-accent shrink-0 mt-0.5" />
            <div className="text-xs text-primary/70 leading-relaxed font-medium">
              <strong className="text-primary font-black uppercase tracking-wider text-[10px] block mb-1">FTC Affiliate Disclosure:</strong>
              Some of the recommendations listed below contain custom partner links. If you purchase a premium plan or register using my referral links, I may receive a small commission at zero additional cost to you. I only recommend software I genuinely use and advocate for to help brands scale.
            </div>
          </div>
        </section>

        {/* Tools Grid */}
        <section className="container-custom max-w-7xl mx-auto px-6 lg:px-12 mb-20">
          {filteredTools.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredTools.map((tool, index) => (
                <motion.div
                  key={tool.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                  className="flex flex-col p-8 rounded-[40px] bg-[#fafafa] border border-primary/5 hover:border-accent/30 hover:bg-white hover:shadow-2xl transition-all duration-500 group relative overflow-hidden h-full"
                >
                  {/* Rating & Badge Row */}
                  <div className="flex justify-between items-center mb-6">
                    <span className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest border ${tool.badgeColor}`}>
                      {tool.badge}
                    </span>
                    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white border border-primary/5 shadow-sm text-[10px] font-black text-primary">
                      <Award className="w-3.5 h-3.5 text-accent" />
                      <span>{tool.rating.toFixed(1)} / 5.0</span>
                    </div>
                  </div>

                  {/* Header Row */}
                  <div className="flex items-center gap-4 mb-5">
                    <div className="w-12 h-12 rounded-2xl bg-primary text-white flex items-center justify-center font-display font-black text-lg shadow-md group-hover:bg-accent transition-colors shrink-0">
                      {tool.logo}
                    </div>
                    <div>
                      <h3 className="text-lg font-display font-black uppercase tracking-tight text-primary">
                        {tool.name}
                      </h3>
                      <span className="text-[9px] font-black uppercase tracking-widest text-accent italic">
                        {tool.category}
                      </span>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-xs text-primary/80 font-bold mb-4 line-clamp-2">
                    {tool.description}
                  </p>

                  <p className="text-[11px] text-muted font-medium leading-[1.6] opacity-75 mb-6 flex-grow">
                    {tool.longDescription}
                  </p>

                  {/* Expert Commentary */}
                  <div className="p-4 rounded-2xl bg-white border border-primary/5 shadow-sm mb-6">
                    <span className="text-[8px] font-black uppercase tracking-[2px] text-primary/40 block mb-1">Hari's Insights</span>
                    <p className="text-[10px] text-primary/75 leading-relaxed font-semibold italic">
                      "{tool.whyIUseIt}"
                    </p>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5 mb-8">
                    {tool.tags.map((tag) => (
                      <span key={tag} className="px-2 py-1 bg-white border border-primary/5 rounded-lg text-[8px] font-black uppercase tracking-wider text-primary/50">
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Call To Action Buttons */}
                  <div className="mt-auto pt-4 border-t border-primary/5 flex flex-col gap-3">
                    <div className="text-[10px] font-black uppercase text-accent tracking-widest flex items-center gap-1.5">
                      <Sparkles className="w-3 h-3 text-accent shrink-0 animate-pulse" />
                      <span className="truncate">{tool.promoText}</span>
                    </div>
                    <a
                      href={tool.affiliateUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-4 rounded-2xl bg-primary hover:bg-accent text-white font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg transition-all group-hover:shadow-accent/10 hover:-translate-y-0.5 active:translate-y-0 active:scale-95"
                    >
                      <span>Claim Deal</span>
                      <ExternalLink size={12} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    </a>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-[#fafafa] rounded-[40px] border border-primary/5">
              <Layers className="w-12 h-12 text-primary/20 mx-auto mb-4" />
              <h3 className="text-lg font-display font-black uppercase text-primary mb-2">No tools matches search</h3>
              <p className="text-xs text-muted max-w-md mx-auto px-6 font-medium">
                Try searching for general terms like "SEO", "design", "analytics", or "automation".
              </p>
            </div>
          )}
        </section>

        {/* Sticky Value Proposition */}
        <section className="container-custom max-w-7xl mx-auto px-6 lg:px-12">
          <div className="p-8 md:p-12 rounded-[48px] bg-primary text-white relative overflow-hidden">
            <div className="max-w-2xl relative z-10">
              <span className="text-[9px] font-black uppercase tracking-[4px] text-accent mb-4 block">Direct Consultations</span>
              <h2 className="text-3xl md:text-5xl font-display font-black tracking-tighter uppercase leading-[0.9] mb-6">
                Need help choosing the right stack?
              </h2>
              <p className="text-xs md:text-sm text-white/60 font-medium leading-relaxed mb-8 max-w-lg">
                Setting up your software configuration correctly from day one prevents costly technical debt. Let's schedule an organic growth mapping call to audit your current tech stack.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <a
                  href="/contact"
                  className="px-8 py-4 rounded-full bg-accent text-white font-black text-[10px] uppercase tracking-widest hover:bg-white hover:text-primary transition-all shadow-lg text-center"
                >
                  Schedule Free Stack Audit
                </a>
              </div>
            </div>

            {/* Background elements */}
            <div className="absolute top-1/2 -right-12 w-[350px] h-[350px] bg-accent/10 rounded-full blur-[80px] -translate-y-1/2 pointer-events-none" />
          </div>
        </section>
      </main>
    </>
  );
}
