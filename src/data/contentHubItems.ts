export interface ContentHubItem {
  id: string;
  title: string;
  excerpt: string;
  description: string;
  thumbnail: string;
  platform: 'Blogger' | 'Medium' | 'Portfolio' | 'Instagram' | 'YouTube' | 'LinkedIn' | 'X' | 'Threads' | 'Podcast' | 'Case Study' | 'Resource';
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
    id: "hub-blogger-1",
    title: "When Should You Update or Correct an OSHA 300 Log? A Complete Guide",
    excerpt: "Maintaining an OSHA 300 Log is an ongoing obligation. Discover under 29 CFR 1904.33 when and how employers must update recordable injury logs.",
    description: "Under 29 CFR 1904.33, employers have an ongoing obligation to update the OSHA 300 Log during the required 5-year retention period when newly discovered recordable cases or diagnosis updates arise. Read this practical breakdown on log corrections and compliance audits.",
    thumbnail: "https://blogger.googleusercontent.com/img/a/AVvXsEipwE1nA3QgKuLzQRmC5wXXuGg5mhPjJu3WM9BBHTVH7mact8evC8tzA5MPYA3M1hSLYLx9Rce3xhADcner3mx8nxwd43MqCb0Ua-GqQTmr8DGRU-aOz6YSNUZHVTCADdVh3e-gYswnVhylmkxpN9ZegEkQwRRrZ855kkOdffhUPLBV4iv6ItoTo9EN0og=w640-h312",
    platform: "Blogger",
    contentType: "Blog",
    category: "Compliance",
    tags: ["Blogger", "OSHA 300 Log", "Workplace Safety", "Compliance"],
    url: "https://gharikiran.blogspot.com/",
    featured: true,
    publishedDate: "2026-08-25T13:27:48Z",
    readTime: "6 min read",
    views: 1420,
    likes: 215,
    author: {
      name: "G. Hari Kiran",
      role: "SEO & Growth Consultant",
      image: "https://i.postimg.cc/d1MxW0j1/Hari-Portfolio.png"
    },
    status: "published"
  },
  {
    id: "hub-7",
    title: "Best OSHA Compliance Software in 2026: Compliease by Sumeera Solutions",
    excerpt: "Discover Compliease, the industry-leading OSHA compliance log management software developed by SuMeera Solutions, designed to simplify workplace safety records.",
    description: "OSHA recordkeeping can be a administrative nightmare. We developed Compliease to streamline electronic incident filings, worker logs, and compliance reporting in one single portal, eliminating clerical errors and ensuring full safety protocol adherence for industrial clients.",
    thumbnail: "https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?auto=format,compress&q=70&w=800&fm=webp",
    platform: "Portfolio",
    contentType: "Blog",
    category: "Compliance",
    tags: ["Compliance", "OSHA", "SaaS", "Software"],
    url: "/blog/compliease-osha-log-management-software",
    featured: true,
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
    thumbnail: "https://images.unsplash.com/photo-1507925921958-8a62f3d1a50d?auto=format,compress&q=70&w=800&fm=webp",
    platform: "Portfolio",
    contentType: "Resource",
    category: "SEO Tips",
    tags: ["SEO Audit", "Resource", "Spreadsheet", "Technical SEO"],
    url: "/ultimate_seo_checklist.csv",
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
    thumbnail: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format,compress&q=70&w=800&fm=webp",
    platform: "Medium",
    contentType: "Blog",
    category: "Retention",
    tags: ["Email Marketing", "Retention", "SaaS", "Automation"],
    url: "https://medium.com/@harikirangumma2003",
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
    thumbnail: "https://images.unsplash.com/photo-1542744094-3a31f103e35f?auto=format,compress&q=70&w=800&fm=webp",
    platform: "Portfolio",
    contentType: "Case Study",
    category: "Growth",
    tags: ["Case Study", "Growth", "Bootstrapping", "MRR"],
    url: "/work/b2b-lead-engine",
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
  }
];
