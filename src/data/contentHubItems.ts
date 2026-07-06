export interface ContentHubItem {
  id: string;
  title: string;
  excerpt: string;
  description: string;
  thumbnail: string;
  platform: 'Medium' | 'Portfolio' | 'Instagram' | 'YouTube' | 'LinkedIn' | 'X' | 'Threads' | 'Podcast' | 'Case Study' | 'Resource';
  contentType: 'Blog' | 'Video' | 'Social Post' | 'Case Study' | 'Resource' | 'Audio';
  category: 'SEO Tips' | 'Marketing' | 'AI' | 'Growth' | 'Compliance' | 'Retention';
  tags: string[];
  url: string;
  featured: boolean;
  publishedDate: string; // ISO string or formatted Date
  readTime: string; // e.g., '5 min read', '3 min watch', '12 min listen'
  views?: number;
  likes?: number;
  author: {
    name: string;
    role: string;
    image?: string;
  };
  status: 'published' | 'draft';
}

export const contentHubItems: ContentHubItem[] = [
  {
    id: "hub-2",
    title: "3 Non-Negotiable Local SEO Checkpoints for 2026 E-Commerce Growth",
    excerpt: "An inside look into the critical ranking factors that are defining local and regional search results this year.",
    description: "Local intent queries are converting 3x higher than generic keywords in 2026. Watch this quick visual guide detailing the 3 essential Google Business Profile optimizations, local schema injection, and citation audits needed to dominate regional search, specially tested on Jamshedpur retail sectors.",
    thumbnail: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format,compress&q=80&w=800&fm=webp",
    platform: "Instagram",
    contentType: "Video",
    category: "SEO Tips",
    tags: ["SEO Tips", "Local SEO", "Marketing", "Reels"],
    url: "https://instagram.com",
    featured: true,
    publishedDate: "2026-06-25T14:30:00Z",
    readTime: "90s watch",
    views: 4520,
    likes: 890,
    author: {
      name: "G. Hari Kiran",
      role: "SEO Consultant",
      image: "https://i.postimg.cc/d1MxW0j1/Hari-Portfolio.png"
    },
    status: "published"
  },
  {
    id: "hub-3",
    title: "E-E-A-T is not a score, it's an architectural framework. Stop writing generic blog posts.",
    excerpt: "Google's quality rater guidelines are clear: expertise, authoritativeness, and trustworthiness cannot be simulated. Here is how to construct a semantic entity web.",
    description: "Many digital marketing agencies fail because they treat E-E-A-T as a checklist of meta tags. This guide explores how to build deep topical authority by mapping entity networks, publishing verifiable expert biographies, configuring robust Organization Schema, and linking original research to become an undisputed source of truth in Google's Knowledge Graph.",
    thumbnail: "https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format,compress&q=80&w=800&fm=webp",
    platform: "LinkedIn",
    contentType: "Social Post",
    category: "Marketing",
    tags: ["EEAT", "SEO Tips", "Branding", "Google Search"],
    url: "https://linkedin.com",
    featured: false,
    publishedDate: "2026-06-22T08:15:00Z",
    readTime: "3 min read",
    views: 5670,
    likes: 1205,
    author: {
      name: "G. Hari Kiran",
      role: "SEO Consultant",
      image: "https://i.postimg.cc/d1MxW0j1/Hari-Portfolio.png"
    },
    status: "published"
  },
  {
    id: "hub-5",
    title: "AI Search engines are looking for structured semantic schemas, not keyword-stuffed blocks. 🧵",
    excerpt: "With Google Search Generative Experience, ChatGPT Search, and Perplexity gaining ground, your content must be readable by LLM crawlers.",
    description: "An in-depth thread analyzing how LLM-based search agents extract answers from web pages. Learn how to format your text with clean markdown, write direct semantic answers to questions, establish distinct entity relations, and use correct JSON-LD schemas so that AI search engines summarize and cite your website first.",
    thumbnail: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format,compress&q=80&w=800&fm=webp",
    platform: "X",
    contentType: "Social Post",
    category: "AI",
    tags: ["AI Search", "AIO", "SEO Tips", "Perplexity", "ChatGPT"],
    url: "https://x.com",
    featured: false,
    publishedDate: "2026-06-15T15:40:00Z",
    readTime: "2 min read",
    views: 12400,
    likes: 2150,
    author: {
      name: "G. Hari Kiran",
      role: "AI Search Specialist",
      image: "https://i.postimg.cc/d1MxW0j1/Hari-Portfolio.png"
    },
    status: "published"
  },
  {
    id: "hub-6",
    title: "Threads vs. X for B2B Personal Branding in 2026",
    excerpt: "Analyzing the organic algorithms of Meta Threads and X (formerly Twitter) for marketing consultants and strategists.",
    description: "Should you spend your energy on Threads or X this year? Based on our testing across multiple accounts, X is still the king for developer relations and technical SEO, while Threads is showing unprecedented engagement for lifestyle, general digital marketing, and creative industries. Here is the exact distribution formula we recommend to stay omnipresent.",
    thumbnail: "https://images.unsplash.com/photo-1533750349088-cd871a92f311?auto=format,compress&q=80&w=800&fm=webp",
    platform: "Threads",
    contentType: "Social Post",
    category: "Marketing",
    tags: ["Threads", "Branding", "Social Media", "X"],
    url: "https://threads.net",
    featured: false,
    publishedDate: "2026-06-10T09:20:00Z",
    readTime: "1 min read",
    views: 3100,
    likes: 412,
    author: {
      name: "G. Hari Kiran",
      role: "Growth Strategist",
      image: "https://i.postimg.cc/d1MxW0j1/Hari-Portfolio.png"
    },
    status: "published"
  },
  {
    id: "hub-7",
    title: "Best OSHA Compliance Software in 2026: Compliease by Sumeera Solutions",
    excerpt: "Discover Compliease, the industry-leading OSHA compliance log management software developed by SuMeera Solutions, designed to simplify workplace safety records.",
    description: "OSHA recordkeeping can be a administrative nightmare. We developed Compliease to streamline electronic incident filings, worker logs, and compliance reporting in one single portal, eliminating clerical errors and ensuring full safety protocol adherence for industrial clients.",
    thumbnail: "https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?auto=format,compress&q=80&w=800&fm=webp",
    platform: "Portfolio",
    contentType: "Blog",
    category: "Compliance",
    tags: ["Compliance", "OSHA", "SaaS", "Software"],
    url: "/blog/compliease-osha-log-management-software",
    featured: false,
    publishedDate: "2026-05-15T09:00:00Z",
    readTime: "5 min read",
    views: 920,
    likes: 184,
    author: {
      name: "G. Hari Kiran",
      role: "Growth Strategist",
      image: "https://i.postimg.cc/d1MxW0j1/Hari-Portfolio.png"
    },
    status: "published"
  },
  {
    id: "hub-8",
    title: "The Ultimate 120-Point Technical SEO Audit Spreadsheet",
    excerpt: "Download the exact template we use to audit enterprise SaaS and e-commerce platforms for search blockages.",
    description: "Stop guessing why your organic traffic is flatlining. This 120-point checklist covers crawling, indexing, rendering, HTTP status codes, core web vitals, indexation logic, hreflang structures, and advanced schema verification. Complete with automated prioritization calculators and client dashboard templates.",
    thumbnail: "https://images.unsplash.com/photo-1507925921958-8a62f3d1a50d?auto=format,compress&q=80&w=800&fm=webp",
    platform: "Portfolio",
    contentType: "Resource",
    category: "SEO Tips",
    tags: ["SEO Audit", "Resource", "Spreadsheet", "Technical SEO"],
    url: "#download-resource",
    featured: true,
    publishedDate: "2026-06-01T08:00:00Z",
    readTime: "Resource Download",
    views: 3450,
    likes: 912,
    author: {
      name: "G. Hari Kiran",
      role: "SEO Consultant",
      image: "https://i.postimg.cc/d1MxW0j1/Hari-Portfolio.png"
    },
    status: "published"
  },
  {
    id: "hub-9",
    title: "How to Build a High-Converting Email Retention Loop with Zero Unsubscribes",
    excerpt: "The science of behavioral email marketing, segmentation, and trigger workflows for e-commerce and B2B SaaS.",
    description: "Retention is the new growth. Acquiring customers is too expensive to let them slip away. In this Medium exclusive article, we outline our proprietary 4-step retention loop that triggers relevant, high-value newsletters based on real-time customer behavior, keeping unsubscribes under 0.1% while tripling repeat purchases.",
    thumbnail: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format,compress&q=80&w=800&fm=webp",
    platform: "Medium",
    contentType: "Blog",
    category: "Retention",
    tags: ["Email Marketing", "Retention", "SaaS", "Automation"],
    url: "https://medium.com",
    featured: false,
    publishedDate: "2026-05-20T10:15:00Z",
    readTime: "7 min read",
    views: 2890,
    likes: 670,
    author: {
      name: "G. Hari Kiran",
      role: "Growth Strategist",
      image: "https://i.postimg.cc/d1MxW0j1/Hari-Portfolio.png"
    },
    status: "published"
  },
  {
    id: "hub-10",
    title: "The Growth Blueprint: Scaling From $10k to $100k MRR Without Venture Capital",
    excerpt: "Case studies and strategic growth playbooks of bootstrapped SaaS founders scaling with hyper-efficient search positioning.",
    description: "VC money is sweet, but freedom is sweeter. In this featured masterclass case study, we lay out the growth models of three bootstrapped companies that achieved escape velocity entirely through organic search visibility, cold outreach automation, and referral program loops.",
    thumbnail: "https://images.unsplash.com/photo-1542744094-3a31f103e35f?auto=format,compress&q=80&w=800&fm=webp",
    platform: "Portfolio",
    contentType: "Case Study",
    category: "Growth",
    tags: ["Case Study", "Growth", "Bootstrapping", "MRR"],
    url: "#case-study-mrr",
    featured: true,
    publishedDate: "2026-04-10T11:00:00Z",
    readTime: "15 min read",
    views: 4120,
    likes: 1045,
    author: {
      name: "G. Hari Kiran",
      role: "Growth Strategist",
      image: "https://i.postimg.cc/d1MxW0j1/Hari-Portfolio.png"
    },
    status: "published"
  },
  {
    id: "hub-11",
    title: "Episode 15: Demystifying AI Overviews with G. Hari Kiran",
    excerpt: "Listen to our comprehensive discussion on how the modern search landscape is evolving with LLM-powered answer boxes.",
    description: "In this podcast episode, we discuss the practical mechanics of Google's AI Overviews, how search intent is fragmenting, and what brands must do today to safeguard their organic traffic pipeline from zero-click searches.",
    thumbnail: "https://images.unsplash.com/photo-1478737270239-2f02b77fc618?auto=format,compress&q=80&w=800&fm=webp",
    platform: "Podcast",
    contentType: "Audio",
    category: "AI",
    tags: ["Podcast", "AI Search", "AIO", "Audio"],
    url: "https://spotify.com",
    featured: false,
    publishedDate: "2026-06-20T08:00:00Z",
    readTime: "24 min listen",
    views: 1820,
    likes: 310,
    author: {
      name: "G. Hari Kiran",
      role: "SEO Consultant",
      image: "https://i.postimg.cc/d1MxW0j1/Hari-Portfolio.png"
    },
    status: "published"
  }
];
