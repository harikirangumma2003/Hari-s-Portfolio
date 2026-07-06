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
    category: "Enterprise IT Solutions",
    description: "Providing premium consulting, industrial software deployment, and strategic cyber operations.",
    stats: {
      label: "Operational Efficiency Lift",
      value: "98.4%"
    },
    brandStory: {
      headline: "How SuMeera Solutions Architected High-Performance Regional Software Systems",
      paragraphs: [
        "SuMeera Solutions collaborated with G. Hari Kiran to deploy structured, contextual technical landing pathways across regional discovery networks.",
        "Through high-impact strategic content mapping and expert integration of lead generation components, SuMeera Solutions successfully captured critical enterprise leads and enhanced their corporate domain authority."
      ],
      videoPlaceholderImg: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=1200",
      videoUrl: "https://www.youtube.com/embed/c-vevPRIsWo"
    }
  }
];
