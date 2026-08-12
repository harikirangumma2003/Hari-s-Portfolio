import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { SEO } from "../components/SEO";
import { partnersData } from "../data/partners";
import { db, auth } from "../lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { Breadcrumbs } from "../components/Breadcrumbs";
import { 
  ArrowUpRight, 
  Search, 
  SlidersHorizontal, 
  Check, 
  Send, 
  HelpCircle, 
  Sparkles, 
  TrendingUp, 
  Layers, 
  Award,
  Globe2,
  LineChart,
  Megaphone,
  UserCheck
} from "lucide-react";

export default function PartnersPage() {
  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedTier, setSelectedTier] = useState<string>("all");
  
  // Application Form States
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    website: "",
    tier: "tier-2",
    budget: "₹2,000 - ₹5,000 / month",
    message: ""
  });

  // Filter Categories
  const categories = ["all", "Enterprise IT Solutions", "Modern Retail & E-Commerce"];
  
  const filteredPartners = partnersData.filter((partner) => {
    const matchesSearch = partner.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (partner.description && partner.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
                          (partner.category && partner.category.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = selectedCategory === "all" || partner.category === selectedCategory;
    const matchesTier = selectedTier === "all" || partner.tier.toString() === selectedTier;
    
    return matchesSearch && matchesCategory && matchesTier;
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.website) {
      setFormError("Please fill out your Name, Email, and Website address to apply.");
      return;
    }
    
    setFormError("");
    setIsSubmitting(true);

    const pathForWrite = "partners_submissions";
    try {
      // 1. Write the backup log inside Firestore securely
      await addDoc(collection(db, pathForWrite), {
        name: formData.name,
        email: formData.email,
        website: formData.website,
        tier: formData.tier,
        budget: formData.budget,
        message: formData.message || "",
        createdAt: serverTimestamp()
      });

      // 2. Dispatch the real-time email notification via web3forms
      const form = new FormData();
      form.append("name", formData.name);
      form.append("email", formData.email);
      form.append("subject", `New Partnership Proposal from ${formData.name}`);
      form.append("message", `
A new partner application has been received:

• Name: ${formData.name}
• Corporate Email: ${formData.email}
• Company Website: ${formData.website}
• Target Tier: ${formData.tier}
• Proposed Budget: ${formData.budget}
• Business Summary:
${formData.message || "N/A"}
      `.trim());

      const accessKey = ((import.meta as any).env?.VITE_WEB3FORMS_ACCESS_KEY) || "c6af2c9e-9a52-4d5f-af99-72cd9707d7dd";
      form.append("access_key", accessKey);
      form.append("from_name", "G. Hari Kiran Partner Program");

      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: form
      });

      const responseData = await response.json();

      if (responseData.success) {
        setFormSubmitted(true);
        setFormData({
          name: "",
          email: "",
          website: "",
          tier: "tier-2",
          budget: "₹2,000 - ₹5,000 / month",
          message: ""
        });
      } else {
        console.warn("Web3Forms email delivery failed, but submission has been successfully logged to Firestore database:", responseData);
        // Display success because persistent logging in Firestore worked
        setFormSubmitted(true);
        setFormData({
          name: "",
          email: "",
          website: "",
          tier: "tier-2",
          budget: "₹2,000 - ₹5,000 / month",
          message: ""
        });
      }
    } catch (error: any) {
      console.error("Firestore Partner Submission Error:", error);
      
      const errInfo = {
        error: error instanceof Error ? error.message : String(error),
        authInfo: {
          userId: auth.currentUser?.uid,
          email: auth.currentUser?.email,
          emailVerified: auth.currentUser?.emailVerified,
          isAnonymous: auth.currentUser?.isAnonymous,
          tenantId: auth.currentUser?.tenantId,
        },
        operationType: "write" as const,
        path: pathForWrite
      };
      
      console.error("Firestore Error Logging Payload:", JSON.stringify(errInfo));
      setFormError("We encountered a small communication issue. Please review your connection and try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Structured Data Schema for Local Search Optimization
  const schemaData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": "https://harikiran-portfolio.netlify.app/partners/#webpage",
        "url": "https://harikiran-portfolio.netlify.app/partners",
        "name": "Business Partnerships & Collaborations | G. Hari Kiran",
        "description": "Collaborate, build trust, and gain organic brand visibility with G. Hari Kiran's professional partner program.",
        "isPartOf": {
          "@type": "WebSite",
          "name": "G. Hari Kiran Portfolio",
          "url": "https://harikiran-portfolio.netlify.app/"
        }
      },
      {
        "@type": "Organization",
        "@id": "https://harikiran-portfolio.netlify.app/#organization",
        "name": "G. Hari Kiran",
        "url": "https://harikiran-portfolio.netlify.app",
        "logo": "https://i.postimg.cc/d1MxW0j1/Hari-Portfolio.png",
        "sameAs": [
          "https://www.linkedin.com/in/hari-kiran-gumma",
          "https://x.com/GHariKiran29",
          "https://medium.com/@harikirangumma2003"
        ],
        "sponsor": partnersData.map(p => ({
          "@type": "Organization",
          "name": p.name,
          "url": p.url
        }))
      }
    ]
  };

  return (
    <div className="pt-32 pb-24 bg-bg-light min-h-screen">
      <SEO 
        title="SEO & Digital Marketing Partnerships | G. Hari Kiran"
        description="Partner with the top SEO Expert and Digital Marketing Consultant in Jamshedpur. Build strategic brand authority and scale local presence."
        url="/partners"
        schemaData={schemaData}
      />

      <div className="container-custom">
        {/* Breadcrumb Navigation */}
        <Breadcrumbs items={[{ name: "Partners", path: "/partners" }]} />

        {/* HERO SECTION */}
        <div className="max-w-4xl mb-20">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-accent/10 border border-accent/20 rounded-full text-accent mb-6">
            <Sparkles size={12} className="animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-widest">Growth Partnerships</span>
          </div>
          
          <h1 className="text-5xl sm:text-7xl md:text-9xl font-display font-black uppercase tracking-tighter leading-[0.85] mb-8">
            Growth <br/>
            <span className="text-accent italic">Partnerships</span>
          </h1>

          <p className="text-primary text-lg md:text-2xl font-display font-black uppercase tracking-tight text-neutral-800 leading-tight mb-6">
            Grow your brand with hands-on support. I connect local businesses, startups, and SaaS platforms with an active audience of business owners and marketing decision-makers.
          </p>

          <div className="text-neutral-600 text-sm md:text-base leading-relaxed space-y-4 max-w-3xl font-sans">
            <p>
              Our partnership program is designed to help software founders, local companies, and service-focused brands get direct exposure. By joining forces, we put your brand name, tools, and services right in front of people who are actively looking for solutions to expand their operations.
            </p>
            <p>
              Instead of spending thousands on temporary, expensive digital ads that get blocked, a collaboration here builds long-term authority, permanent features, and genuine word-of-mouth recommendations.
            </p>
          </div>
        </div>

        {/* STATISTICS SECTION */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-24">
          <div className="bg-white border border-primary/5 rounded-[32px] p-8 shadow-sm flex flex-col justify-between hover:border-accent/10 transition-colors">
            <div className="w-12 h-12 bg-accent/10 rounded-2xl flex items-center justify-center text-accent mb-6">
              <TrendingUp size={22} />
            </div>
            <div>
              <p className="text-4xl font-display font-black text-primary leading-none mb-2">45,000+</p>
              <p className="text-[10px] font-black uppercase tracking-wider text-muted mb-4 font-mono">Monthly Readers Reached</p>
              <p className="text-xs text-neutral-500 font-sans leading-relaxed">
                Directly showcase your software, product, or service to highly active founders, small business owners, and marketing decision-makers looking to grow.
              </p>
            </div>
          </div>

          <div className="bg-white border border-primary/5 rounded-[32px] p-8 shadow-sm flex flex-col justify-between hover:border-accent/10 transition-colors">
            <div className="w-12 h-12 bg-primary/5 rounded-2xl flex items-center justify-center text-primary mb-6">
              <UserCheck size={22} />
            </div>
            <div>
              <p className="text-4xl font-display font-black text-primary leading-none mb-2">100%</p>
              <p className="text-[10px] font-black uppercase tracking-wider text-muted mb-4 font-mono">Real Organic Audience</p>
              <p className="text-xs text-neutral-500 font-sans leading-relaxed">
                We do not buy views or use bots. Our listing traffic comes from high-quality web searches and reader engagement. That means higher click rates and genuine interest in your brand.
              </p>
            </div>
          </div>

          <div className="bg-white border border-primary/5 rounded-[32px] p-8 shadow-sm flex flex-col justify-between hover:border-accent/10 transition-colors">
            <div className="w-12 h-12 bg-accent/10 rounded-2xl flex items-center justify-center text-accent mb-6">
              <Layers size={22} />
            </div>
            <div>
              <p className="text-4xl font-display font-black text-primary leading-none mb-2">DA 40+</p>
              <p className="text-[10px] font-black uppercase tracking-wider text-muted mb-4 font-mono">Better Google Rankings</p>
              <p className="text-xs text-neutral-500 font-sans leading-relaxed">
                We link naturally from our key sections directly to your website. Google recognizes these links, signaling to search engines that your site is a highly trusted source.
              </p>
            </div>
          </div>
        </section>

        {/* PARTNERS DIRECTORY */}
        <section className="mb-32">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <div>
              <span className="text-[10px] font-black uppercase tracking-widest text-accent mb-2 block font-mono">Our Trusted Partners</span>
              <h2 className="text-3xl sm:text-5xl font-display font-black uppercase tracking-tighter mb-4">Our Trusted Network</h2>
              <p className="text-neutral-500 text-xs sm:text-sm max-w-xl font-sans">
                We only recommend products and businesses we know, use, and trust. Every business on this list is reviewed to make sure they offer high-quality services or tools that help other companies succeed.
              </p>
            </div>

            {/* Directory Controls */}
            <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
              <div className="relative flex-grow sm:flex-grow-0">
                <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
                <input
                  type="text"
                  placeholder="Search brands or sectors..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full sm:w-64 bg-white border border-primary/5 rounded-2xl pl-12 pr-4 py-3 text-xs font-semibold focus:outline-none focus:border-accent transition-all"
                />
              </div>

              <div className="flex items-center gap-2">
                <SlidersHorizontal size={14} className="text-muted" />
                <select
                  aria-label="Filter Partners by Category"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="bg-white border border-primary/5 rounded-2xl px-4 py-3 text-xs font-semibold focus:outline-none focus:border-accent transition-all text-neutral-700"
                >
                  <option value="all">Sectors: All</option>
                  {categories.filter(c => c !== "all").map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>

                <select
                  aria-label="Filter Partners by Tier"
                  value={selectedTier}
                  onChange={(e) => setSelectedTier(e.target.value)}
                  className="bg-white border border-primary/5 rounded-2xl px-4 py-3 text-xs font-semibold focus:outline-none focus:border-accent transition-all text-neutral-700"
                >
                  <option value="all">Tiers: All</option>
                  <option value="3">Special Partner (Tier 3)</option>
                  <option value="2">Featured Partner (Tier 2)</option>
                  <option value="1">Logo Partner (Tier 1)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Directory Output Grid */}
          {filteredPartners.length === 0 ? (
            <div className="text-center bg-white border border-primary/5 rounded-[32px] p-16">
              <p className="font-display font-black uppercase text-xl text-primary mb-2">No partners found</p>
              <p className="text-xs text-muted">Try changing your search term or resetting your category filters.</p>
              <button
                onClick={() => { setSearchQuery(""); setSelectedCategory("all"); setSelectedTier("all"); }}
                className="mt-6 inline-flex px-6 py-3 bg-neutral-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-accent transition-all"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPartners.map((item) => (
                <div 
                  key={item.id}
                  className="bg-white border border-primary/5 rounded-[32px] p-6 sm:p-8 shadow-sm flex flex-col justify-between hover:border-accent/15 hover:shadow-md transition-all duration-300 group"
                >
                  <div>
                    <div className="flex justify-between items-start mb-6">
                      {item.logo.startsWith('/') ? (
                        <div className="bg-neutral-50 border border-neutral-100 px-3 py-1.5 rounded-2xl flex items-center justify-center max-h-12 max-w-[155px]">
                          <img src={item.logo} alt={item.name} className="h-6 object-contain" />
                        </div>
                      ) : (
                        <span className="font-display font-black text-sm tracking-tight text-accent bg-accent/5 px-3 py-1 rounded-full uppercase">
                          {item.logo}
                        </span>
                      )}
                      <span className="text-[9px] font-black tracking-widest uppercase px-2.5 py-1 rounded-full bg-neutral-100 text-neutral-600 font-mono">
                        Tier {item.tier}
                      </span>
                    </div>

                    <h3 className="text-xl font-display font-black uppercase mb-3 text-neutral-950 group-hover:text-accent transition-colors">
                      {item.name}
                    </h3>
                    
                    {item.description && (
                      <p className="text-xs sm:text-sm text-neutral-500 leading-relaxed font-sans mb-6">
                        {item.description}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center justify-between border-t border-primary/5 pt-4 mt-4">
                    <span className="text-[10px] font-mono text-muted/85 uppercase">{item.category || "Ecosystem Partner"}</span>
                    <a 
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[9px] font-black uppercase tracking-widest text-primary group-hover:text-accent inline-flex items-center gap-1.5"
                    >
                      Visit Website <ArrowUpRight size={12} />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* CASE STUDIES SECTION */}
        <section className="mb-32">
          <div className="mb-12">
            <span className="text-[10px] font-black uppercase tracking-[4px] text-accent mb-2 block font-mono">Success Stories</span>
            <h2 className="text-3xl sm:text-5xl font-display font-black uppercase tracking-tight">Real Success Stories</h2>
            <p className="text-muted text-xs sm:text-sm mt-3 max-w-xl font-sans">
              See how we help partners turn baseline brand placements into steady business growth, increased web traffic, and qualified client inquires.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* SuMeera Solutions */}
            <div className="bg-black text-white rounded-[40px] p-8 sm:p-12 relative overflow-hidden flex flex-col justify-between border border-white/5 shadow-2xl min-h-[450px]">
              <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-accent/10 rounded-full blur-[80px]" />
              <div>
                <div className="flex items-center justify-between gap-4 mb-6">
                  <span className="text-[9px] font-black uppercase tracking-widest bg-accent px-3 py-1 rounded-full inline-block font-mono">Custom Collaboration</span>
                  <div className="bg-white px-3 py-1.5 rounded-xl inline-flex items-center justify-center max-h-10">
                    <img src="/sumeera_logo.svg" alt="SuMeera Solutions" className="h-5 object-contain" />
                  </div>
                </div>
                <h3 className="text-2.5xl sm:text-4xl font-display font-black uppercase leading-tight mb-4">
                  Scaling SaaS Leads via Semantic SEO
                </h3>
                <p className="text-xs sm:text-sm text-white/75 leading-relaxed font-sans mb-8">
                  We partnered with SuMeera Solutions, an OSHA compliance SaaS provider, to design and execute a high-impact semantic SEO roadmap and optimize their automated email lead flows. By mapping high-intent compliance keywords and deploying dedicated resource directories, we helped them rank for critical compliance terms and drive active software subscriptions.
                </p>
              </div>

              <div className="flex flex-wrap gap-8 items-center border-t border-white/10 pt-8 relative z-10">
                <div>
                  <p className="text-3xl font-display font-black text-accent">+245%</p>
                  <p className="text-[9px] font-mono text-white/50 uppercase tracking-widest">Organic Traffic Growth</p>
                </div>
                <div>
                  <p className="text-3xl font-display font-black text-white">5.2x</p>
                  <p className="text-[9px] font-mono text-white/50 uppercase tracking-widest">More Qualified Leads</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* PARTNERSHIP PACKAGES */}
        <section id="partnership-pricing" className="mb-32">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-[10px] font-black uppercase tracking-[4px] text-accent mb-2 block font-mono">Simple Sponsorship Tiers</span>
            <h2 className="text-3xl sm:text-5xl font-display font-black uppercase tracking-tight">Partnership Packages</h2>
            <p className="text-muted text-xs sm:text-sm mt-3 font-sans">
              Choose a plan that fits your business goals. No complex agreements, no confusing metrics. Just reliable visibility for your brand.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* TIER 1 - BASE */}
            <div className="bg-white border border-primary/5 rounded-[32px] p-6 flex flex-col justify-between hover:border-accent/15 transition-all shadow-sm">
              <div>
                <div className="mb-6">
                  <span className="text-[9px] font-black uppercase tracking-widest bg-neutral-100 text-neutral-600 px-3 py-1 rounded-full font-mono">Base Tier</span>
                  <h3 className="text-lg font-display font-black uppercase mt-3 mb-1">Featured Logo</h3>
                  <p className="text-[10px] uppercase font-black text-accent tracking-wider font-mono">Build Baseline Credibility</p>
                  <p className="text-xs text-neutral-500 mt-2 font-sans">For small, local brands wanting simple and affordable web presence.</p>
                </div>
                
                <div className="my-6 border-y border-neutral-100 py-4">
                  <p className="text-2.5xl font-display font-black text-primary">₹999<span className="text-xs text-muted font-normal font-sans"> / month</span></p>
                  <p className="text-[9px] text-neutral-400 font-mono mt-0.5">billed quarterly</p>
                </div>

                <ul className="space-y-3 mb-8">
                  {[
                    "Your Logo shown on the Homepage",
                    "Clickable link directly to your site",
                    "Featured in our partners directory",
                    "Fully optimized for mobile layouts",
                    "Standard email customer support"
                  ].map((feat, i) => (
                    <li key={i} className="flex gap-2 text-xs text-neutral-600 font-sans">
                      <Check size={14} className="text-accent flex-shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <a 
                href="#apply-partner"
                onClick={() => setFormData(prev => ({ ...prev, tier: "tier-1" }))}
                className="w-full text-center py-3 border border-primary/10 hover:bg-neutral-950 hover:text-white rounded-2xl text-[10px] font-black uppercase tracking-wider transition-all font-mono"
              >
                Apply For Base Tier
              </a>
            </div>

            {/* TIER 2 - GROWTH */}
            <div className="bg-white border border-accent/20 rounded-[32px] p-6 flex flex-col justify-between hover:border-accent/45 transition-all shadow-md relative">
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-accent text-white px-3 py-0.5 rounded-full text-[8.5px] font-black uppercase tracking-widest font-mono">Recommended</span>
              
              <div>
                <div className="mb-6">
                  <span className="text-[9px] font-black uppercase tracking-widest bg-accent/10 text-accent px-3 py-1 rounded-full font-mono">Growth Tier</span>
                  <h3 className="text-lg font-display font-black uppercase mt-3 mb-1">Featured Brand</h3>
                  <p className="text-[10px] uppercase font-black text-accent tracking-wider font-mono">Increase Clicks &amp; Reach</p>
                  <p className="text-xs text-neutral-500 mt-2 font-sans">Perfect for growing startups and service businesses looking to stand out.</p>
                </div>
                
                <div className="my-6 border-y border-neutral-100 py-4">
                  <p className="text-2.5xl font-display font-black text-primary">₹2,999<span className="text-xs text-muted font-normal font-sans"> / month</span></p>
                  <p className="text-[9px] text-neutral-400 font-mono mt-0.5">billed semi-annually</p>
                </div>

                <ul className="space-y-3 mb-8">
                  {[
                    "Everything included in Base Tier",
                    "Premium brand card layout",
                    "Logo and custom business summary",
                    "Direct links to custom inner pages",
                    "Featured on Home and Partners pages",
                    "Boosts your Google ranking authority"
                  ].map((feat, i) => (
                    <li key={i} className="flex gap-2 text-xs text-neutral-600 font-sans animate-fadeIn">
                      <Check size={14} className="text-accent flex-shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <a 
                href="#apply-partner"
                onClick={() => setFormData(prev => ({ ...prev, tier: "tier-2" }))}
                className="w-full text-center py-3 bg-neutral-900 text-white hover:bg-accent rounded-2xl text-[10px] font-black uppercase tracking-wider transition-all font-mono shadow-sm"
              >
                Select Growth Plan
              </a>
            </div>

            {/* TIER 3 - PRIORITY */}
            <div className="bg-black text-white rounded-[32px] p-6 flex flex-col justify-between relative overflow-hidden shadow-xl">
              <div className="absolute top-0 right-0 w-24 h-24 bg-accent/20 rounded-full blur-2xl pointer-events-none" />
              <div>
                <div className="mb-6">
                  <span className="text-[9px] font-black uppercase tracking-widest bg-accent text-white px-3 py-1 rounded-full font-mono">Priority Tier</span>
                  <h3 className="text-lg font-display font-black uppercase mt-3 mb-1 text-white">Partner Spotlight</h3>
                  <p className="text-[10px] uppercase font-black text-accent tracking-wider font-mono">Maximum Brand Exposure</p>
                  <p className="text-xs text-neutral-400 mt-2 font-sans">Best for software companies and SaaS tools that want high-visibility placements.</p>
                </div>
                
                <div className="my-6 border-y border-white/10 py-4">
                  <p className="text-2.5xl font-display font-black text-accent">₹4,999<span className="text-xs text-white/50 font-normal font-sans"> / month</span></p>
                  <p className="text-[9px] text-white/40 font-mono mt-0.5">billed annually</p>
                </div>

                <ul className="space-y-3 mb-8">
                  {[
                    "Everything in Growth Tier",
                    "Top, permanent spot on Home page",
                    "Dedicated custom spotlight container",
                    "Business description + Action Button",
                    "1 featured social media shoutout",
                    "Priority review and updates weekly"
                  ].map((feat, i) => (
                    <li key={i} className="flex gap-2 text-xs text-white/85 font-sans">
                      <Check size={14} className="text-accent flex-shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <a 
                href="#apply-partner"
                onClick={() => setFormData(prev => ({ ...prev, tier: "tier-3" }))}
                className="w-full text-center py-3 bg-white hover:bg-accent text-black hover:text-white rounded-2xl text-[10px] font-black uppercase tracking-wider transition-all font-mono"
              >
                Claim Priority Spot
              </a>
            </div>

            {/* TIER 4 - CUSTOM */}
            <div className="bg-white border border-primary/5 rounded-[32px] p-6 flex flex-col justify-between hover:border-black/20 transition-all shadow-sm">
              <div>
                <div className="mb-6">
                  <span className="text-[9px] font-black uppercase tracking-widest bg-neutral-900 text-white px-3 py-1 rounded-full font-mono">Custom Tier</span>
                  <h3 className="text-lg font-display font-black uppercase mt-3 mb-1 text-primary">Custom Plan</h3>
                  <p className="text-[10px] uppercase font-black text-neutral-500 tracking-wider font-mono">Fully Tailored Collaboration</p>
                  <p className="text-xs text-neutral-500 mt-2 font-sans">For agencies and companies needing specialized, long-term marketing campaigns.</p>
                </div>
                
                <div className="my-6 border-y border-neutral-100 py-4">
                  <p className="text-2xl font-display font-black text-primary">Custom Quote</p>
                  <p className="text-[9px] text-neutral-400 font-mono mt-1.5">flexible billing setups</p>
                </div>

                <ul className="space-y-3 mb-8">
                  {[
                    "Dedicated reviews and tutorials",
                    "Sponsor video placements",
                    "Custom case study co-authorship",
                    "Exclusive newsletter features",
                    "Direct lead-referral setups",
                    "1-on-1 ongoing strategic planning"
                  ].map((feat, i) => (
                    <li key={i} className="flex gap-2 text-xs text-neutral-600 font-sans">
                      <Check size={14} className="text-accent flex-shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <a 
                href="#apply-partner"
                onClick={() => setFormData(prev => ({ ...prev, tier: "enterprise" }))}
                className="w-full text-center py-3 border border-neutral-900 bg-neutral-950 text-white hover:bg-accent rounded-2xl text-[10px] font-black uppercase tracking-wider transition-all font-mono"
              >
                Request Custom Plan
              </a>
            </div>
          </div>
        </section>

        {/* WHY PARTNER WITH US */}
        <section className="mb-32">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-[10px] font-black uppercase tracking-[4px] text-accent mb-2 block font-mono">Value Proposition</span>
              <h2 className="text-3xl sm:text-5xl font-display font-black uppercase tracking-tight mb-6">
                Why Businesses Partner With Us
              </h2>
              <p className="text-muted text-xs sm:text-sm leading-relaxed font-sans mb-8">
                Banner ads are easy to ignore and get blocked by browsers. Our partnerships are natural, friendly, and integrated directly into the helpful resources our readers trust.
              </p>

              <div className="space-y-6">
                {[
                  {
                    title: "Build Trust",
                    desc: "Our audience of small businesses and tech companies trusts our recommendations. When your business is displayed with us, you gain instant reliability and brand goodwill."
                  },
                  {
                    title: "Increase Visibility",
                    desc: "Get seen by thousands of decision-makers every single month. We put your business card and logo in high-engagement areas where visitors naturally look."
                  },
                  {
                    title: "Reach the Right Audience",
                    desc: "No wasted ad budgets. We connect you directly with startups, local managers, and founders who are already looking for growth tools and reliable local partners."
                  }
                ].map((item, idx) => (
                  <div key={idx} className="flex gap-4">
                    <span className="w-6 h-6 rounded-full bg-accent/10 text-accent flex items-center justify-center flex-shrink-0 font-display font-black text-xs">
                      {idx + 1}
                    </span>
                    <div>
                      <h4 className="text-base font-display font-black uppercase text-neutral-900 leading-tight">{item.title}</h4>
                      <p className="text-xs text-neutral-500 font-sans mt-1 leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* HOW WE PROMOTE YOUR BUSINESS */}
            <div className="bg-neutral-900 rounded-[40px] p-8 sm:p-12 text-white border border-white/5 relative overflow-hidden">
              <div className="absolute -bottom-10 -left-10 w-44 h-44 bg-accent/20 rounded-full blur-[60px]" />
              
              <span className="text-[9px] font-mono uppercase tracking-[2px] text-accent block mb-2">Our Promotion Channels</span>
              <h3 className="text-2.5xl sm:text-3xl font-display font-black uppercase leading-none mb-4">
                How We Promote Your Business
              </h3>
              <p className="text-xs text-white/60 mb-8 font-sans">
                We use five clear ways to give your company maximum exposure across our digital channels:
              </p>

              <ul className="space-y-6 relative z-10">
                <li className="border-b border-white/10 pb-4">
                  <div className="flex items-center gap-2 mb-1.5">
                    <Globe2 size={16} className="text-accent" />
                    <h5 className="text-xs uppercase font-black tracking-wider text-white">Website Placement</h5>
                  </div>
                  <p className="text-xs text-white/50 leading-relaxed font-sans">
                    We insert your clickable logo and business profile directly into our footer directories and clean sidebar layouts across the entire site.
                  </p>
                </li>

                <li className="border-b border-white/10 pb-4">
                  <div className="flex items-center gap-2 mb-1.5">
                    <Award size={16} className="text-accent" />
                    <h5 className="text-xs uppercase font-black tracking-wider text-white">Homepage Features</h5>
                  </div>
                  <p className="text-xs text-white/50 leading-relaxed font-sans">
                    Your brand gets secondary or spotlight promotion directly on G. Hari Kiran's high-traffic homepage bento blocks.
                  </p>
                </li>

                <li className="border-b border-white/10 pb-4">
                  <div className="flex items-center gap-2 mb-1.5">
                    <LineChart size={16} className="text-accent" />
                    <h5 className="text-xs uppercase font-black tracking-wider text-white">Recommended Case Studies</h5>
                  </div>
                  <p className="text-xs text-white/50 leading-relaxed font-sans">
                    We suggest your service or platform inside our specialized marketing success guides, proving to readers that your business is the best fit.
                  </p>
                </li>

                <li className="border-b border-white/10 pb-4">
                  <div className="flex items-center gap-2 mb-1.5">
                    <Megaphone size={16} className="text-accent" />
                    <h5 className="text-xs uppercase font-black tracking-wider text-white">Sponsored Content</h5>
                  </div>
                  <p className="text-xs text-white/50 leading-relaxed font-sans">
                    We co-author dedicated blog reviews, standard tutorials, and guides explaining step-by-step how our audience can solve problems using your software.
                  </p>
                </li>

                <li>
                  <div className="flex items-center gap-2 mb-1.5">
                    <Award size={16} className="text-accent" />
                    <h5 className="text-xs uppercase font-black tracking-wider text-white">Social Media Mentions</h5>
                  </div>
                  <p className="text-xs text-white/50 leading-relaxed font-sans">
                    We share details about your services with our professional followers on LinkedIn and business channels to bring in warm, indirect referrals.
                  </p>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* APPLICATION FORM */}
        <section id="apply-partner" className="bg-black text-white rounded-[40px] p-8 sm:p-16 border border-white/10 relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-accent/15 rounded-full blur-[120px] pointer-events-none" />
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
            {/* Form Left Side Copy */}
            <div className="lg:col-span-5">
              <span className="text-[10px] font-black uppercase tracking-[4px] text-accent mb-4 pl-1 border-l-2 border-accent block font-mono">
                Become a Partner
              </span>
              <h2 className="text-4xl sm:text-5xl md:text-6.5xl font-display font-black uppercase tracking-tighter leading-[0.9] mb-6">
                Become <br />
                <span className="text-accent italic">A Partner</span>
              </h2>
              
              <div className="text-white/70 text-xs sm:text-sm leading-relaxed mb-6 font-sans space-y-4">
                <p>
                  We are always looking to partner with reliable software solutions, regional businesses, and service agencies that help our audience grow.
                </p>
                <p>
                  To keep the quality of our recommendations high, we only accept a limited number of new partners every month. Fill out this simple application to apply.
                </p>
                <p>
                  Our team reads and reviews every application within 24 to 48 hours. If approved, we will email you with your custom setup plans.
                </p>
              </div>

              <div className="space-y-4 font-sans text-xs">
                <div className="flex items-center gap-3">
                  <span className="w-5 h-5 rounded-full bg-white/10 text-white flex items-center justify-center text-[10px] font-bold"><Check size={10} /></span>
                  <span className="text-white/80">Manual, personalized review of your website</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="w-5 h-5 rounded-full bg-white/10 text-white flex items-center justify-center text-[10px] font-bold"><Check size={10} /></span>
                  <span className="text-white/80">Secure custom setup — zero automated charges</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="w-5 h-5 rounded-full bg-white/10 text-white flex items-center justify-center text-[10px] font-bold"><Check size={10} /></span>
                  <span className="text-white/80">Monthly click and traffic reports included for free</span>
                </div>
              </div>
            </div>

            {/* Interactive Form card */}
            <div className="lg:col-span-7">
              <div className="bg-white/[0.03] border border-white/10 p-6 sm:p-10 rounded-[32px] backdrop-blur-md">
                
                <AnimatePresence mode="wait">
                  {!formSubmitted ? (
                    <motion.form 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      onSubmit={handleSubmit}
                      className="space-y-5"
                    >
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <div className="space-y-1.5">
                          <label htmlFor="form-name" className="text-[10px] uppercase font-black tracking-widest text-white/50 font-mono">Full Name</label>
                          <input
                            id="form-name"
                            type="text"
                            name="name"
                            placeholder="e.g. Rahul Sharma"
                            value={formData.name}
                            onChange={handleInputChange}
                            disabled={isSubmitting}
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-xs focus:outline-none focus:border-accent focus:bg-white/10 transition-all text-white disabled:opacity-50"
                          />
                        </div>

                        <div className="space-y-1.5">
                          <label htmlFor="form-email" className="text-[10px] uppercase font-black tracking-widest text-white/50 font-mono">Corporate Email</label>
                          <input
                            id="form-email"
                            type="email"
                            name="email"
                            placeholder="e.g. rahul@yourcompany.com"
                            value={formData.email}
                            onChange={handleInputChange}
                            disabled={isSubmitting}
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-xs focus:outline-none focus:border-accent focus:bg-white/10 transition-all text-white disabled:opacity-50"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <div className="space-y-1.5">
                          <label htmlFor="form-website" className="text-[10px] uppercase font-black tracking-widest text-white/50 font-mono">Company Website</label>
                          <input
                            id="form-website"
                            type="url"
                            name="website"
                            placeholder="e.g. https://yourcompany.com"
                            value={formData.website}
                            onChange={handleInputChange}
                            disabled={isSubmitting}
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-xs focus:outline-none focus:border-accent focus:bg-white/10 transition-all text-white disabled:opacity-50"
                          />
                        </div>

                        <div className="space-y-1.5">
                          <label htmlFor="form-tier" className="text-[10px] uppercase font-black tracking-widest text-white/50 font-mono">Preferred Package</label>
                          <select
                            id="form-tier"
                            name="tier"
                            value={formData.tier}
                            onChange={handleInputChange}
                            disabled={isSubmitting}
                            className="aria-label-select w-full bg-neutral-900 border border-white/10 rounded-xl px-4 py-3.5 text-xs focus:outline-none focus:border-accent focus:bg-neutral-800 transition-all text-white disabled:opacity-50"
                          >
                            <option value="tier-1">Featured Logo (₹999/mo)</option>
                            <option value="tier-2">Featured Brand (₹2,999/mo)</option>
                            <option value="tier-3">Spotlight Partner (₹4,999/mo)</option>
                            <option value="enterprise">Custom Partnership Plan</option>
                          </select>
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <label htmlFor="form-budget" className="text-[10px] uppercase font-black tracking-widest text-white/50 font-mono">Monthly Budget</label>
                        <select
                          id="form-budget"
                          name="budget"
                          value={formData.budget}
                          onChange={handleInputChange}
                          disabled={isSubmitting}
                          className="aria-label-select w-full bg-neutral-900 border border-white/10 rounded-xl px-4 py-3.5 text-xs focus:outline-none focus:border-accent focus:bg-neutral-800 transition-all text-white disabled:opacity-50"
                        >
                          <option value="<₹1,000 / month">Under ₹1,000 / month</option>
                          <option value="₹1,000 - ₹3,000 / month">₹1,000 - ₹3,000 / month</option>
                          <option value="₹3,000 - ₹5,000 / month">₹3,000 - ₹5,000 / month</option>
                          <option value="₹5,000+ / month">₹5,000+ / month (Custom Goals)</option>
                        </select>
                      </div>

                      <div className="space-y-1.5">
                        <label htmlFor="form-message" className="text-[10px] uppercase font-black tracking-widest text-white/50 font-mono">Briefly describe your business</label>
                        <textarea
                          id="form-message"
                          name="message"
                          rows={4}
                          placeholder="Tell us what your company does and who you want to reach..."
                          value={formData.message}
                          onChange={handleInputChange}
                          disabled={isSubmitting}
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-xs focus:outline-none focus:border-accent focus:bg-white/10 transition-all text-white resize-none disabled:opacity-50"
                        />
                      </div>

                      {formError && (
                        <p className="text-red-400 text-xs font-semibold">{formError}</p>
                      )}

                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full flex items-center justify-center gap-3 bg-accent hover:bg-white hover:text-black text-white py-4 rounded-xl text-[10px] font-black tracking-widest uppercase transition-all shadow-[0_8px_25px_rgba(255,107,0,0.3)] active:scale-95 group font-mono disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isSubmitting ? (
                          <>Submitting application... <span className="animate-spin inline-block w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full ml-1" /></>
                        ) : (
                          <>Submit Partner Application <Send size={12} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" /></>
                        )}
                      </button>
                    </motion.form>
                  ) : (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="text-center py-10"
                    >
                      <div className="w-16 h-16 bg-accent text-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl">
                        <Check size={32} />
                      </div>
                      <h3 className="text-2.5xl font-display font-black uppercase mb-3">Application Submitted!</h3>
                      <p className="text-xs text-white/70 max-w-sm mx-auto leading-relaxed mb-6 font-sans">
                        Thank you for applying. We have received your proposal! We will review your website and email you custom options or setup instructions within 24 to 48 hours.
                      </p>
                      <button
                        onClick={() => setFormSubmitted(false)}
                        className="inline-flex px-6 py-3 border border-white/20 hover:border-white text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all font-mono"
                      >
                        Submit Another Application
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>

              </div>
            </div>
          </div>
        </section>

        {/* FAQ SECTION */}
        <section className="mt-32 max-w-3xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-[10px] font-black uppercase tracking-[4px] text-accent mb-2 block font-mono">Common Questions</span>
            <h2 className="text-3xl sm:text-4xl font-display font-black uppercase tracking-tight">Our Partnership FAQs</h2>
          </div>

          <div className="space-y-6">
            {[
              {
                q: "Will my website receive a link?",
                a: "Yes! All partner plans include a direct, clickable link to your company website. This makes it incredibly easy for our readers to find your business and signals to search engines like Google that your platform is a trustworthy, highly relevant resource."
              },
              {
                q: "Can I track my results?",
                a: "Absolutely. All custom tiers allow you to use standard, custom tracking URLs (using standard Google UTM tags). By checking your digital analytics tools (like Google Analytics), you can see exactly how many visitors and warm leads came from our listings."
              },
              {
                q: "How long does it take to get featured?",
                a: "Since we manually review every application to verify the quality of our partner companies, the review takes 1 to 2 business days. Once approved, your logos and business profile go live immediately. Dedicated co-authored tutorials usually launch within 10 to 14 days."
              },
              {
                q: "What types of businesses are allowed?",
                a: "We accept applications from verified local services, software tools, SaaS platforms, design/marketing agencies, and e-commerce companies that provide real, genuine value to other growing businesses."
              }
            ].map((faq, idx) => (
              <div key={idx} className="bg-white border border-primary/5 rounded-3xl p-6 shadow-sm">
                <div className="flex items-start gap-3">
                  <HelpCircle size={18} className="text-accent flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-base font-display font-black uppercase text-neutral-900 mb-2 leading-tight">{faq.q}</h4>
                    <p className="text-xs sm:text-sm text-neutral-500 font-sans leading-relaxed">{faq.a}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
}
