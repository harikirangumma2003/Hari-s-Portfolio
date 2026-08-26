import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distDir = path.resolve(__dirname, '../dist');

// Site metadata
const siteUrl = 'https://harikiran-portfolio.netlify.app';

// Static Blog Data
const blogPosts = [
  {
    slug: 'technical-seo-checklist-2026-audit-before-ranking',
    title: 'Technical SEO Checklist for 2026: 25 Things Every Website Should Audit Before Ranking',
    category: 'SEO',
    date: 'Aug 02, 2026',
    excerpt: 'The definitive 25-point technical SEO checklist for 2026. Audit your website for Core Web Vitals INP, AI Bot crawling, Schema JSON-LD, canonical integrity, and crawl budget to achieve 100/100 search performance.'
  },
  {
    slug: 'compliease-osha-log-management-software',
    title: 'Best OSHA Compliance Software in 2026: Compliease by Sumeera Solutions',
    category: 'Compliance',
    date: 'Jul 28, 2026',
    excerpt: 'Compliease by Sumeera Solutions is the best OSHA compliance software for manufacturing in 2026. Streamline OSHA 300 logs, incident reporting, and safety tracking effortlessly.'
  },
  {
    slug: 'workplace-compliance-software-modern-business',
    title: 'Why Workplace Compliance Software is Critical for Modern Business Growth',
    category: 'Compliance',
    date: 'Jul 20, 2026',
    excerpt: 'Discover why workplace compliance software is essential for scaling modern businesses. Prevent OSHA fines, protect employee safety, and automate safety recordkeeping.'
  },
  {
    slug: 'sumeera-solutions-osha-compliance-software',
    title: 'Sumeera Solutions: The Smart Way to Manage OSHA Compliance & Avoid Costly Fines',
    category: 'Compliance',
    date: 'Jul 15, 2026',
    excerpt: 'How SuMeera Solutions is transforming OSHA compliance and workplace safety logging for modern enterprise and manufacturing organizations.'
  },
  {
    slug: 'retention-marketing-sustainable-growth',
    title: 'Retention Marketing: The Secret Sauce to Sustainable Growth',
    category: 'Retention',
    date: 'Jul 10, 2026',
    excerpt: 'Why customer retention drives sustainable growth and how to build automated retention loops that maximize customer lifetime value.'
  },
  {
    slug: 'high-converting-email-newsletter-guide',
    title: 'How to Build a High-Converting Email Newsletter',
    category: 'Email Marketing',
    date: 'Jul 05, 2026',
    excerpt: 'Step-by-step blueprint to designing, writing, and automating high-converting email newsletters with 50%+ open rates and rapid subscriber growth.'
  },
  {
    slug: 'rank-higher-google-organically',
    title: '9 Simple Steps How To Rank Higher On Google Organically',
    category: 'SEO',
    date: 'Jun 28, 2026',
    excerpt: 'Master organic search rankings with 9 proven steps: search intent alignment, technical architecture, schema markup, and content authority.'
  },
  {
    slug: 'facebook-marketing-small-businesses',
    title: 'How Small Businesses Can Win Big on Facebook Marketing',
    category: 'Digital Marketing',
    date: 'Jun 20, 2026',
    excerpt: 'A practical guide for local and small businesses to generate high-intent leads and sales through organic Facebook communities and targeted ads.'
  },
  {
    slug: 'organic-seo-services',
    title: 'Why You Need Organic SEO Services to Scale Your Brand',
    category: 'SEO',
    date: 'Jun 12, 2026',
    excerpt: 'Understand the power of organic SEO services to outrank competitors, capture commercial search intent, and drive qualified organic revenue.'
  },
  {
    slug: 'best-digital-marketer-in-netaji-subhas-university',
    title: 'Best Digital Marketer in Netaji Subhas University: The Power of Strategy Over Execution',
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
    heading: 'Local Search Dominance',
    category: 'SEO & Content',
    description: 'Achieved 300% growth in organic traffic through local SEO excellence.'
  },
  {
    slug: 'sms-conversion-engine',
    title: 'High-Impact SMS Conversion Engine Case Study',
    heading: 'SMS & Mobile Lead Conversion Engine',
    category: 'Direct Marketing',
    description: 'Scaled a high-conversion direct marketing channel to drive 21% conversion rates.'
  },
  {
    slug: 'viral-brand-campaign',
    title: 'Viral Growth & Push Campaign Case Study',
    heading: 'Viral Growth & Brand Hacking Campaign',
    category: 'Creative Strategy',
    description: 'High-impact push notification campaign driving +5% order increase through witty, timed messaging.'
  },
  {
    slug: 'b2b-lead-engine',
    title: 'B2B Automated Customer Acquisition Engine Case Study',
    heading: 'B2B Automated Customer Acquisition Engine',
    category: 'Email Marketing',
    description: 'Built high-impact email campaigns driving exceptional open rates and conversions.'
  }
];

// Static Main Pages
const staticPages = [
  {
    path: '/about',
    title: 'About G. Hari Kiran | SEO Expert & Digital Marketing Strategist Jamshedpur',
    heading: 'About G. Hari Kiran',
    description: 'Meet G. Hari Kiran, SEO Expert and Digital Marketing Consultant based in Jamshedpur, Jharkhand. Discover strategies, background, and client success stories.'
  },
  {
    path: '/experience',
    title: 'Professional Experience | G. Hari Kiran - SEO Expert Jamshedpur',
    heading: 'Professional Experience',
    description: 'Explore the career timeline, accomplishments, and client results delivered by G. Hari Kiran across SaaS, retail, and local enterprise growth.'
  },
  {
    path: '/work',
    title: 'Selected Results & Case Studies | G. Hari Kiran Growth Portfolio',
    heading: 'Selected Results & Case Studies',
    description: 'Discover proven marketing case studies, local search dominance campaigns, SMS conversion engines, and B2B automated growth systems.'
  },
  {
    path: '/blog',
    title: 'The Growth Journal | SEO, Marketing & Business Strategy Blog',
    heading: 'The Growth Journal',
    description: 'Deep dives into SEO, brand positioning, OSHA compliance frameworks, and data-driven marketing strategies by G. Hari Kiran.'
  },
  {
    path: '/content-hub',
    title: 'The Content Hub | Omnichannel Knowledge Engine | G. Hari Kiran',
    heading: 'The Content Hub',
    description: 'A curated real-time catalog of growth playbooks, viral breakdowns, and tactical marketing insights syndicated across Medium, YouTube, and LinkedIn.'
  },
  {
    path: '/contact',
    title: 'Contact G. Hari Kiran | SEO Consultant & Marketing Strategist Jamshedpur',
    heading: 'Get In Touch',
    description: 'Schedule an SEO consultation, request a website audit, or discuss digital marketing partnerships with G. Hari Kiran in Jamshedpur.'
  },
  {
    path: '/partners',
    title: 'Strategic Growth Partnerships | G. Hari Kiran',
    heading: 'Growth Partnerships',
    description: 'Partner with G. Hari Kiran to build strategic brand authority, local reach, and business collaboration opportunities.'
  },
  {
    path: '/resources',
    title: 'Automated Google Sheets & Digital Growth Products | G. Hari Kiran',
    heading: 'Automated Google Sheets & Digital Products',
    description: 'Discover custom-engineered Google Sheets and productivity frameworks for finance, habit tracking, and marketing workflows.'
  },
  {
    path: '/seo-audit',
    title: 'Technical SEO Audit & Diagnostics Dashboard | G. Hari Kiran',
    heading: 'SEO Audit & Diagnostics Dashboard',
    description: 'Live status of G. Hari Kiran\'s website compliance with modern mobile indexing, Core Web Vitals, and technical SEO benchmarks.'
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
    const pageTitle = `${b.title} | G. Hari Kiran Growth Journal`;
    const pageHtml = createPageHtml(postPath, pageTitle, b.title, b.excerpt, b.category);
    fs.writeFileSync(path.join(targetDir, 'index.html'), pageHtml);
    console.log(`Generated pre-rendered blog post: ${postPath}/index.html with H1: "${b.title}"`);
  });

  // 3. Generate Project Detail Pages
  projects.forEach(prj => {
    const prjPath = `/work/${prj.slug}`;
    const targetDir = path.join(distDir, 'work', prj.slug);
    fs.mkdirSync(targetDir, { recursive: true });
    const pageHtml = createPageHtml(prjPath, prj.title, prj.heading, prj.description, prj.category);
    fs.writeFileSync(path.join(targetDir, 'index.html'), pageHtml);
    console.log(`Generated pre-rendered work project: ${prjPath}/index.html with H1: "${prj.heading}"`);
  });

  console.log('Successfully generated all pre-rendered HTML files with valid semantic H1 tags!');
}

generatePages();
