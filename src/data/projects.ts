export interface Project {
  slug: string;
  title: string;
  category: string;
  image: string;
  description: string;
  longDescription: string;
  tags: string[];
  stats: { label: string; value: string }[];
  process: { step: string; detail: string }[];
  executionHighlights: string[];
}

export const projects: Project[] = [
  {
    slug: "local-search-dominance",
    title: "Local Search Dominance",
    category: "SEO & Content",
    image: "https://i.postimg.cc/mgGJ9vdp/Screenshot-2026-04-19-131741.png",
    description: "Achieved 300% growth in organic traffic through local SEO excellence.",
    longDescription: "For local brands, visibility is everything. The goal was to break through a crowded search landscape and position the brand at the top of search results. By implementing a targeted, content-driven SEO strategy, we transformed a single blog into a high-performing traffic asset that consistently attracts and converts local audiences.",
    tags: ["SEO", "Content Strategy", "Local Search"],
    stats: [
      { label: "SERP Ranking", value: "#1 Position" },
      { label: "Page Visitors", value: "+30% Growth" },
      { label: "Monthly Reach", value: "1K+ Views" }
    ],
    process: [
      { step: "Content Optimization", detail: "Creating a high-quality, SEO-driven blog article focused on local intent and targeted keywords." },
      { step: "Search Ranking Strategy", detail: "Implementing on-page SEO, internal linking, and keyword placement to secure top SERP positioning." },
      { step: "Performance Tracking", detail: "Monitoring rankings, clicks, and user behavior to continuously optimize visibility and engagement." }
    ],
    executionHighlights: [
      "Content-Led SEO Strategy",
      "Localized Keyword Targeting",
      "Continuous Performance Optimization"
    ]
  },
  {
    slug: "sms-conversion-engine",
    title: "High-Impact SMS Conversion Engine",
    category: "Direct Marketing",
    image: "https://i.postimg.cc/WbngmKTv/image.png",
    description: "Scaled a high-conversion direct marketing channel to drive 21% conversion rates.",
    longDescription: "In a fast-paced digital environment, attention spans are short and immediacy is key. The goal was to leverage SMS marketing as a direct, high-conversion channel to drive instant user action. By combining precise targeting with compelling messaging, we built a campaign that delivered both reach and results at scale.",
    tags: ["SMS Marketing", "Retention", "Direct Response"],
    stats: [
      { label: "Sent Rate", value: "98%" },
      { label: "CTR", value: "25%" },
      { label: "Conversion Rate", value: "21%" }
    ],
    process: [
      { step: "Precision Targeting", detail: "Segmented users based on behavior and intent to deliver highly relevant SMS campaigns." },
      { step: "Concise Copywriting", detail: "Crafted short, action-driven messages designed for instant engagement and quick decision-making." },
      { step: "Delivery Optimization", detail: "Ensured high deliverability and optimal timing to maximize reach and response rates." }
    ],
    executionHighlights: [
      "Audience Segmentation",
      "High-Urgency Messaging",
      "Real-Time Performance Optimization"
    ]
  },
  {
    slug: "viral-brand-campaign",
    title: "Viral Push Campaign",
    category: "Creative Strategy",
    image: "https://i.postimg.cc/bwwybSV5/Whats-App-Image-2026-04-19-at-13-47-59.jpg",
    description: "High-impact push notification campaign driving +5% order increase through witty, timed messaging.",
    longDescription: "In a highly competitive food delivery space, capturing user attention in seconds is critical. The goal was to create a high-impact push notification campaign that not only stood out but also drove immediate engagement and conversions through creativity and timing.",
    tags: ["Push Notifications", "Copywriting", "Food Delivery"],
    stats: [
      { label: "Orders", value: "+25% Increase" },
      { label: "CTR", value: "7%" },
      { label: "User Engagement", value: "Significant Spike" }
    ],
    process: [
      { step: "Creative Messaging", detail: "Crafted witty, emotionally engaging, and food-personified push notifications to capture instant attention." },
      { step: "Audience Targeting", detail: "Segmented users based on behavior and preferences to deliver highly relevant notifications." },
      { step: "Timing Optimization", detail: "Strategically scheduled notifications during peak craving hours to maximize clicks and orders." }
    ],
    executionHighlights: [
      "Creative-First Approach",
      "Behavioral Targeting",
      "Real-Time Optimization"
    ]
  },
  {
    slug: "b2b-lead-engine",
    title: "B2B Lead Engine",
    category: "Email Marketing",
    image: "https://i.postimg.cc/MT4yhjvJ/image.png",
    description: "Built high-impact email campaigns driving exceptional open rates and conversions.",
    longDescription: "In B2B marketing, attention is limited and trust is everything. The objective was to design email campaigns that not only get opened but also drive meaningful engagement and conversions. By combining personalization, strategic messaging, and performance tracking, we built a scalable email engine that consistently delivers results.",
    tags: ["Automation", "Copywriting", "CRM"],
    stats: [
      { label: "Open Rate", value: "64.07%" },
      { label: "CTR", value: "3%" },
      { label: "Conversion Rate", value: "2.5%" }
    ],
    process: [
      { step: "Personalization Strategy", detail: "Crafted highly targeted email content tailored to user intent, industry, and behavior." },
      { step: "Conversion-Focused Copywriting", detail: "Designed compelling subject lines and value-driven email copy to maximize opens and clicks." },
      { step: "Funnel Optimization", detail: "Structured email sequences to guide prospects from awareness to conversion efficiently." }
    ],
    executionHighlights: [
      "Audience Segmentation",
      "High-Intent Messaging",
      "Continuous A/B Testing & Optimization"
    ]
  }
];
