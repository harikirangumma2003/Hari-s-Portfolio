export interface Partner {
  id: string;
  name: string;
  logo: string;
  url: string;
  tier: 1 | 2 | 3;
  description?: string;
  category?: string;
  stats?: {
    label: string;
    value: string;
  };
  brandStory?: {
    headline: string;
    paragraphs: string[];
    videoPlaceholderImg: string;
    videoUrl?: string;
  };
}

export const partnersData: Partner[] = [
  {
    id: "partner-sumeera",
    name: "SuMeera Solutions",
    logo: "/sumeera_logo.svg",
    url: "https://www.sumeerasolutions.com/",
    tier: 3,
    category: "OSHA Compliance SaaS",
    description: "An automated OSHA log management and workplace safety compliance platform, scaled globally through organic SEO and automated marketing.",
    stats: {
      label: "Organic Traffic Growth",
      value: "+245%"
    },
    brandStory: {
      headline: "How SuMeera Solutions Scaled Organic Lead Flow via Semantic SEO and Growth Marketing",
      paragraphs: [
        "SuMeera Solutions partnered with G. Hari Kiran to build a robust semantic search and content marketing engine for their OSHA compliance SaaS platforms.",
        "By optimizing technical SEO infrastructure, designing target-focused compliance landing pages, and establishing clean educational resources, they achieved significant organic search growth, ranking for high-intent safety compliance terms and turning organic visitors into active trial sign-ups."
      ],
      videoPlaceholderImg: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format,compress&fit=crop&fm=webp&q=70&w=1200",
      videoUrl: "https://www.youtube.com/embed/c-vevPRIsWo"
    }
  }
];
