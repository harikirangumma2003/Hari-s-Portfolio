import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distDir = path.resolve(__dirname, '../dist');

// Site metadata
const siteUrl = 'https://harikiran-portfolio.netlify.app';

// Static Blog Data synchronized with src/data/blogPosts.ts
const blogPosts = [
  {
    slug: 'technical-seo-checklist-2026-audit-before-ranking',
    title: 'Technical SEO Checklist for 2026: 25 Things Every Website Should Audit Before Ranking',
    seoTitle: 'Technical SEO Checklist 2026: 25 Audit Points | Hari Kiran',
    category: 'SEO',
    date: 'Aug 02, 2026',
    excerpt: 'Actionable 25-point technical SEO checklist for 2026. Audit Core Web Vitals INP, AI Bot crawling, canonical integrity, and crawl budget to rank #1.'
  },
  {
    slug: 'compliease-osha-log-management-software',
    title: 'Best OSHA Compliance Software in 2026: Compliease by Sumeera Solutions',
    seoTitle: 'Best OSHA Compliance Software 2026: Compliease Review',
    category: 'Compliance',
    date: 'Jul 28, 2026',
    excerpt: 'Compliease by Sumeera Solutions is the top OSHA compliance software for manufacturing in 2026. Streamline OSHA 300 logs and incident reporting.'
  },
  {
    slug: 'workplace-compliance-software-modern-business',
    title: 'Why Workplace Compliance Software is Critical for Modern Business Growth',
    seoTitle: 'Workplace Compliance Software for Business Growth (2026)',
    category: 'Compliance',
    date: 'Jul 20, 2026',
    excerpt: 'Why workplace compliance software is essential for scaling modern businesses. Prevent OSHA fines, protect workers, and automate safety recordkeeping.'
  },
  {
    slug: 'sumeera-solutions-osha-compliance-software',
    title: 'Sumeera Solutions: The Smart Way to Manage OSHA Compliance & Avoid Costly Fines',
    seoTitle: 'SuMeera Solutions OSHA Compliance Software Guide (2026)',
    category: 'Compliance',
    date: 'Jul 15, 2026',
    excerpt: 'How SuMeera Solutions transforms OSHA compliance and workplace safety logging for modern enterprise and manufacturing organizations.'
  },
  {
    slug: 'retention-marketing-sustainable-growth',
    title: 'Retention Marketing: The Secret Sauce to Sustainable Growth',
    seoTitle: 'Retention Marketing Guide: Secrets to Sustainable Growth',
    category: 'Retention',
    date: 'Jul 10, 2026',
    excerpt: 'Learn why customer retention drives sustainable growth and how to build automated retention loops that maximize customer lifetime value.'
  },
  {
    slug: 'high-converting-email-newsletter-guide',
    title: 'How to Build a High-Converting Email Newsletter',
    seoTitle: 'Build a High-Converting Email Newsletter: Full Blueprint',
    category: 'Email Marketing',
    date: 'Jul 05, 2026',
    excerpt: 'Step-by-step blueprint to designing, writing, and automating high-converting email newsletters with 50%+ open rates and rapid subscriber growth.'
  },
  {
    slug: 'rank-higher-google-organically',
    title: '9 Simple Steps How To Rank Higher On Google Organically',
    seoTitle: 'How to Rank Higher on Google Organically: 9 Step Blueprint',
    category: 'SEO',
    date: 'Jun 28, 2026',
    excerpt: 'Master organic search rankings with 9 proven steps: search intent alignment, technical architecture, schema markup, and content authority.'
  },
  {
    slug: 'facebook-marketing-small-businesses',
    title: 'How Small Businesses Can Win Big on Facebook Marketing',
    seoTitle: 'Facebook Marketing for Small Business: High-ROI Guide',
    category: 'Digital Marketing',
    date: 'Jun 20, 2026',
    excerpt: 'A practical guide for local and small businesses to generate high-intent leads and sales through organic Facebook communities and targeted ads.'
  },
  {
    slug: 'organic-seo-services',
    title: 'Why You Need Organic SEO Services to Scale Your Brand',
    seoTitle: 'Why Your Brand Needs Organic SEO Services to Scale Online',
    category: 'SEO',
    date: 'Jun 12, 2026',
    excerpt: 'Understand the power of organic SEO services to outrank competitors, capture commercial search intent, and drive qualified organic revenue.'
  },
  {
    slug: 'best-digital-marketer-in-netaji-subhas-university',
    title: 'Best Digital Marketer in Netaji Subhas University: The Power of Strategy Over Execution',
    seoTitle: 'Top Digital Marketer Netaji Subhas University | Hari Kiran',
    category: 'Growth',
    date: 'Jun 01, 2026',
    excerpt: 'Why true digital marketing excellence comes from strategy, positioning, and data-driven systems rather than generic tactical execution.'
  }
];

// Static Case Studies / Work Projects Data
const projects = [
  {
    slug: 'local-search-dominance',
    title: 'Local Search Dominance Case Study',
    seoTitle: 'Local SEO Dominance Case Study | G. Hari Kiran',
    heading: 'Local Search Dominance',
    category: 'SEO & Content',
    description: 'Achieved 300% growth in organic traffic through local SEO dominance, citations, and content clustering.'
  },
  {
    slug: 'sms-conversion-engine',
    title: 'High-Impact SMS Conversion Engine Case Study',
    seoTitle: 'SMS Conversion Engine Case Study | G. Hari Kiran',
    heading: 'SMS & Mobile Lead Conversion Engine',
    category: 'Direct Marketing',
    description: 'Scaled a high-conversion direct marketing channel to drive 21% conversion rates and automated SMS sequences.'
  },
  {
    slug: 'viral-brand-campaign',
    title: 'Viral Growth & Push Campaign Case Study',
    seoTitle: 'Viral Brand Campaign Case Study | G. Hari Kiran',
    heading: 'Viral Growth & Brand Hacking Campaign',
    category: 'Creative Strategy',
    description: 'High-impact push notification campaign driving +5% order increase through witty, timed messaging.'
  },
  {
    slug: 'b2b-lead-engine',
    title: 'B2B Automated Customer Acquisition Engine Case Study',
    seoTitle: 'B2B Lead Engine Case Study | G. Hari Kiran',
    heading: 'B2B Automated Customer Acquisition Engine',
    category: 'Email Marketing',
    description: 'Built high-impact automated B2B customer acquisition campaigns driving 48% open rates and steady demos.'
  }
];

// Static Main Pages
const staticPages = [
  {
    path: '/about',
    title: 'About G. Hari Kiran | Leading SEO Expert Jamshedpur',
    heading: 'About G. Hari Kiran',
    description: 'Meet G. Hari Kiran, SEO Expert and Digital Marketing Consultant in Jamshedpur, Jharkhand. Learn how I grow organic search authority and revenue.'
  },
  {
    path: '/experience',
    title: 'SEO Experience & Marketing Strategy | G. Hari Kiran',
    heading: 'Professional Experience',
    description: 'View the professional career timeline of G. Hari Kiran, SEO Expert and Digital Marketing Consultant in Jamshedpur, scaling client revenue and traffic.'
  },
  {
    path: '/work',
    title: 'Selected SEO Portfolio & Case Studies | G. Hari Kiran',
    heading: 'Selected Results & Case Studies',
    description: 'Explore high-impact search marketing and growth case studies by G. Hari Kiran, the premier SEO Expert & Digital Marketing Consultant in Jamshedpur.'
  },
  {
    path: '/blog',
    title: 'SEO & Growth Marketing Strategy Blog | G. Hari Kiran',
    heading: 'The Growth Journal',
    description: 'Explore actionable SEO guides, organic growth strategies, and digital marketing insights written by G. Hari Kiran in Jamshedpur, Jharkhand.'
  },
  {
    path: '/content-hub',
    title: 'Omnichannel Content Hub & Playbooks | G. Hari Kiran',
    heading: 'The Content Hub',
    description: 'Explore G. Hari Kiran\'s curated growth library: SEO audits, viral marketing playbooks, video breakdowns, and syndications across modern platforms.'
  },
  {
    path: '/contact',
    title: 'Hire SEO Expert G. Hari Kiran | Free Website Audit',
    heading: 'Get In Touch',
    description: 'Book a consultation with G. Hari Kiran, SEO Expert and Digital Marketing Consultant in Jamshedpur, Jharkhand. Request your free website audit.'
  },
  {
    path: '/partners',
    title: 'Strategic Growth Partnerships | G. Hari Kiran',
    heading: 'Growth Partnerships',
    description: 'Partner with the top SEO Expert and Digital Marketing Consultant in Jamshedpur. Build strategic brand authority and scale local presence.'
  },
  {
    path: '/resources',
    title: 'Google Sheets Growth & Finance Templates | G. Hari Kiran',
    heading: 'Automated Google Sheets & Digital Products',
    description: 'Access custom-engineered, fully automated Google Sheets templates for personal finance tracking, habit building, and book reading management.'
  },
  {
    path: '/seo-audit',
    title: 'Technical SEO Audit & Diagnostics | G. Hari Kiran',
    heading: 'SEO Audit & Diagnostics Dashboard',
    description: 'View real-time technical SEO health diagnostics and Core Web Vitals performance for G. Hari Kiran\'s SEO consulting portfolio in Jamshedpur.'
  }
];

function generatePages() {
  if (!fs.existsSync(distDir)) {
    console.error('dist directory does not exist! Please run vite build first.');
    return;
  }

  const baseHtmlPath = path.join(distDir, 'index.html');
  if (!fs.existsSync(baseHtmlPath)) {
    console.error('dist/index.html not found!');
    return;
  }

  const template = fs.readFileSync(baseHtmlPath, 'utf8');

  // Helper to inject route-specific metadata and H1
  function createPageHtml(pageUrl, title, heading, description, category = '') {
    const canonical = `${siteUrl}${pageUrl}`;
    let html = template;

    // Replace Title
    html = html.replace(/<title[^>]*>.*?<\/title>/i, `<title>${title}</title>`);

    // Replace Meta Description
    html = html.replace(/<meta[^>]*name="description"[^>]*content=".*?"[^>]*>/i, `<meta name="description" content="${description}">`);

    // Replace Canonical Link
    html = html.replace(/<link[^>]*rel="canonical"[^>]*>/i, `<link rel="canonical" href="${canonical}">`);

    // Replace OG Tags
    html = html.replace(/<meta[^>]*property="og:title"[^>]*content=".*?"[^>]*>/i, `<meta property="og:title" content="${title}">`);
    html = html.replace(/<meta[^>]*property="og:description"[^>]*content=".*?"[^>]*>/i, `<meta property="og:description" content="${description}">`);
    html = html.replace(/<meta[^>]*property="og:url"[^>]*content=".*?"[^>]*>/i, `<meta property="og:url" content="${canonical}">`);

    // Replace Twitter Tags
    html = html.replace(/<meta[^>]*name="twitter:title"[^>]*content=".*?"[^>]*>/i, `<meta name="twitter:title" content="${title}">`);
    html = html.replace(/<meta[^>]*name="twitter:description"[^>]*content=".*?"[^>]*>/i, `<meta name="twitter:description" content="${description}">`);
    html = html.replace(/<meta[^>]*name="twitter:url"[^>]*content=".*?"[^>]*>/i, `<meta name="twitter:url" content="${canonical}">`);

    // Pre-render semantic H1 and initial HTML inside #root
    const preRenderedContent = `
      <div id="prerendered-content" style="max-width: 1200px; margin: 0 auto; padding: 120px 24px 60px; font-family: 'Space Grotesk', system-ui, sans-serif;">
        <nav aria-label="Breadcrumb" style="margin-bottom: 24px;">
          <a href="/" style="color: #FF6B00; text-decoration: none; font-weight: 700; text-transform: uppercase; font-size: 0.75rem; letter-spacing: 2px;">Home</a>
          <span style="color: #999; margin: 0 8px;">/</span>
          <span style="color: #666; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 1px;">${heading}</span>
        </nav>
        <header style="margin-bottom: 40px;">
          ${category ? `<span style="display: inline-block; background: #FF6B00; color: #fff; padding: 4px 12px; border-radius: 9999px; font-size: 0.65rem; font-weight: 900; text-transform: uppercase; letter-spacing: 2px; margin-bottom: 16px;">${category}</span>` : ''}
          <h1 style="font-size: clamp(2rem, 5vw, 4rem); font-weight: 900; line-height: 1; text-transform: uppercase; letter-spacing: -1px; margin-bottom: 20px; color: #0A0A0A;">
            ${heading}
          </h1>
          <p style="font-size: 1.125rem; line-height: 1.6; color: #666; max-width: 800px;">
            ${description}
          </p>
        </header>
      </div>
    `;

    // Inject into #root so crawlers see the H1 immediately
    html = html.replace('<div id="root">', `<div id="root">${preRenderedContent}`);

    return html;
  }

  // 1. Generate Static Pages
  staticPages.forEach(p => {
    const targetDir = path.join(distDir, p.path.slice(1));
    fs.mkdirSync(targetDir, { recursive: true });
    const pageHtml = createPageHtml(p.path, p.title, p.heading, p.description);
    fs.writeFileSync(path.join(targetDir, 'index.html'), pageHtml);
    console.log(`Generated pre-rendered page: ${p.path}/index.html with H1: "${p.heading}"`);
  });

  // 2. Generate Blog Post Pages
  blogPosts.forEach(b => {
    const postPath = `/blog/${b.slug}`;
    const targetDir = path.join(distDir, 'blog', b.slug);
    fs.mkdirSync(targetDir, { recursive: true });
    const pageTitle = b.seoTitle || b.title;
    const pageHtml = createPageHtml(postPath, pageTitle, b.title, b.excerpt, b.category);
    fs.writeFileSync(path.join(targetDir, 'index.html'), pageHtml);
    console.log(`Generated pre-rendered blog post: ${postPath}/index.html with H1: "${b.title}"`);
  });

  // 3. Generate Project Detail Pages
  projects.forEach(prj => {
    const prjPath = `/work/${prj.slug}`;
    const targetDir = path.join(distDir, 'work', prj.slug);
    fs.mkdirSync(targetDir, { recursive: true });
    const pageTitle = prj.seoTitle || `${prj.title} | G. Hari Kiran`;
    const pageHtml = createPageHtml(prjPath, pageTitle, prj.heading, prj.description, prj.category);
    fs.writeFileSync(path.join(targetDir, 'index.html'), pageHtml);
    console.log(`Generated pre-rendered work project: ${prjPath}/index.html with H1: "${prj.heading}"`);
  });

  console.log('Successfully generated all pre-rendered HTML files with valid semantic H1 tags!');
}

generatePages();
