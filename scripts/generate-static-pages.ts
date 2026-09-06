import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { blogPosts } from '../src/data/blogPosts';
import { projects } from '../src/data/projects';
import { partnersData } from '../src/data/partners';
import { contentHubItems } from '../src/data/contentHubItems';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distDir = path.resolve(__dirname, '../dist');

// Canonical Site metadata
const siteUrl = 'https://harikiran-portfolio.netlify.app';

// Static Main Pages with comprehensive semantic copy for search engines
const staticPages = [
  {
    path: '/about',
    title: 'About G. Hari Kiran | Leading SEO Expert & Growth Consultant Jamshedpur',
    heading: 'About G. Hari Kiran - SEO & Growth Specialist',
    description: 'Meet G. Hari Kiran, SEO Expert and Digital Marketing Consultant in Jamshedpur, Jharkhand. Learn about my background, core marketing philosophies, and proven track record in scaling organic search traffic and client revenue.',
    image: 'https://harikiran-portfolio.netlify.app/og-about.jpg',
    content: `
      <h2>Executive Summary & Background</h2>
      <p>I am G. Hari Kiran, an SEO Expert and Digital Marketing Consultant based in Jamshedpur, Jharkhand, India. Over the past several years, I have specialized in building data-backed search engine optimization strategies, technical site architectures, organic content engines, and high-converting customer retention funnels.</p>
      <p>My core approach bridges the gap between technical search algorithms and real commercial search intent. Rather than chasing vanity traffic, I focus on capturing high-intent organic visitors, optimizing user journey funnels, and translating rankings into measurable enterprise revenue.</p>
      <h2>Core Areas of Expertise</h2>
      <ul>
        <li><strong>Technical SEO & Core Web Vitals:</strong> Optimizing Interaction to Next Paint (INP), Cumulative Layout Shift (CLS), Largest Contentful Paint (LCP), and server-side crawl budget efficiency.</li>
        <li><strong>Local Search Dominance:</strong> Google Business Profile architecture, local citation networks, and targeted regional ranking in Jamshedpur, Jharkhand, and nationwide.</li>
        <li><strong>Schema.org Graph Engineering:</strong> Structuring semantic linked-data graphs (JSON-LD) for enhanced SERP rich snippets and AI search engine visibility (Google AI Overviews, Perplexity, ChatGPT Search).</li>
        <li><strong>Customer Retention & Lifecycle Marketing:</strong> Automated email onboarding sequences, SMS retention loops, and high-conversion direct-response copy.</li>
      </ul>
      <h2>Educational Background & Certifications</h2>
      <p>Graduating with honors in digital marketing and business management from Netaji Subhas University, I combine academic strategic marketing principles with hands-on technical execution across modern web ecosystems.</p>
    `
  },
  {
    path: '/experience',
    title: 'Professional SEO Experience & Career Timeline | G. Hari Kiran',
    heading: 'Professional Experience & Strategic Milestones',
    description: 'View the professional career timeline of G. Hari Kiran, SEO Expert and Digital Marketing Consultant in Jamshedpur. Explore lead generation campaigns, consulting roles, and client growth outcomes.',
    image: 'https://harikiran-portfolio.netlify.app/og-about.jpg',
    content: `
      <h2>Career Track Record & Achievements</h2>
      <p>Detailed timeline of professional consulting roles, lead generation architectures, and high-ROI growth initiatives spearheaded by G. Hari Kiran across retail, SaaS, and industrial enterprises.</p>
      <h2>Key Consulting Engagements</h2>
      <ul>
        <li><strong>SEO & Growth Consultant (Independent Practice):</strong> Designed comprehensive search marketing and local SEO strategies for clients across healthcare, retail, and B2B sectors, driving +300% organic traffic growth.</li>
        <li><strong>SuMeera Solutions & CompliEase:</strong> Orchestrated digital go-to-market strategies and product-led content marketing for workplace compliance and OSHA recordkeeping software.</li>
        <li><strong>Direct-Response Marketing & SMS Campaigns:</strong> Executed automated messaging funnels delivering 25% click-through rates and 21% verified sales conversion.</li>
      </ul>
    `
  },
  {
    path: '/work',
    title: 'Selected SEO Portfolio & Case Studies | G. Hari Kiran',
    heading: 'Selected Case Studies & Proven Growth Results',
    description: 'Explore high-impact search marketing and growth case studies by G. Hari Kiran. Discover how data-driven SEO, local search dominance, and direct marketing scaled client revenue.',
    image: 'https://harikiran-portfolio.netlify.app/og-work.jpg',
    content: `
      <h2>Real Deliverables & Data-Driven Case Studies</h2>
      <p>Explore detailed case studies documenting organic traffic expansion, top SERP rankings, and high-converting marketing engines engineered by G. Hari Kiran.</p>
      <ul>
        ${projects.map(p => `<li><a href="/work/${p.slug}/"><strong>${p.title}:</strong></a> ${p.description}</li>`).join('')}
      </ul>
    `
  },
  {
    path: '/blog',
    title: 'SEO & Growth Marketing Strategy Blog | G. Hari Kiran',
    heading: 'The Growth Journal - SEO, AI & Marketing Insights',
    description: 'Explore actionable SEO guides, organic growth strategies, OSHA compliance checklists, and digital marketing insights written by G. Hari Kiran in Jamshedpur, Jharkhand.',
    image: 'https://harikiran-portfolio.netlify.app/og-blog.jpg',
    content: `
      <h2>Published Articles & Strategy Guides</h2>
      <p>Browse our in-depth library of actionable search engine optimization tutorials, compliance manuals, and retention playbooks:</p>
      <ul>
        ${blogPosts.map(b => `<li><a href="/blog/${b.slug}/"><strong>${b.title}</strong></a> (${b.category} - ${b.date})<br/><p>${b.excerpt}</p></li>`).join('')}
      </ul>
    `
  },
  {
    path: '/content-hub',
    title: 'Omnichannel Content Hub & Playbooks | G. Hari Kiran',
    heading: 'The Content Hub - Multi-Platform Insights & Playbooks',
    description: 'Explore G. Hari Kiran\'s curated growth library: SEO audits, viral marketing playbooks, video breakdowns, and syndications across Blogger, Medium, YouTube, and LinkedIn.',
    image: 'https://harikiran-portfolio.netlify.app/og-blog.jpg',
    content: `
      <h2>Curated Omnichannel Resources</h2>
      <p>Access articles, tutorials, video analyses, and playbooks published across top platforms including Blogger, Medium, LinkedIn, and YouTube.</p>
      <ul>
        ${contentHubItems.map(item => `<li><a href="${item.url}" target="_blank" rel="noopener"><strong>${item.title}</strong></a> [${item.platform} - ${item.contentType}]<br/><p>${item.excerpt}</p></li>`).join('')}
      </ul>
    `
  },
  {
    path: '/contact',
    title: 'Hire SEO Expert G. Hari Kiran | Free Website Audit Jamshedpur',
    heading: 'Get in Touch - Request a Free SEO Consultation',
    description: 'Book a consultation with G. Hari Kiran, SEO Expert and Digital Marketing Consultant in Jamshedpur, Jharkhand. Request your free website audit and customized growth strategy.',
    image: 'https://harikiran-portfolio.netlify.app/og-contact.jpg',
    content: `
      <h2>Ready to Scale Your Organic Search Revenue?</h2>
      <p>Whether you need a full technical SEO audit, a local search ranking roadmap in Jamshedpur/Jharkhand, or a custom retention funnel, I am here to help.</p>
      <h3>Direct Inquiries</h3>
      <p>Email: <a href="mailto:harikirangumma2003@gmail.com">harikirangumma2003@gmail.com</a></p>
      <p>Location: Jamshedpur, Jharkhand, India</p>
      <p>Social: Twitter/X: <a href="https://twitter.com/GHariKiran29" target="_blank" rel="noopener">@GHariKiran29</a> | Medium: <a href="https://medium.com/@harikirangumma2003" target="_blank" rel="noopener">@harikirangumma2003</a> | Blogger: <a href="https://gharikiran.blogspot.com" target="_blank" rel="noopener">G. Hari Kiran Blog</a></p>
    `
  },
  {
    path: '/partners',
    title: 'Strategic Growth Partnerships | G. Hari Kiran',
    heading: 'Growth Partnerships & Client Collaborations',
    description: 'Partner with the top SEO Expert and Digital Marketing Consultant in Jamshedpur. Build strategic brand authority and scale local presence.',
    image: 'https://harikiran-portfolio.netlify.app/og-work.jpg',
    content: `
      <h2>Collaborations & Client Ecosystem</h2>
      <p>Discover successful partnerships and joint initiatives engineered with modern brands, software developers, and retail platforms.</p>
      <ul>
        ${partnersData.map(p => `<li><strong>${p.name}:</strong> ${p.description || ''} (Category: ${p.category || 'Strategic Partner'})</li>`).join('')}
      </ul>
    `
  },
  {
    path: '/resources',
    title: 'Google Sheets Growth & Finance Templates | G. Hari Kiran',
    heading: 'Automated Google Sheets & Digital Productivity Products',
    description: 'Access custom-engineered, fully automated Google Sheets templates for personal finance tracking, habit building, and book reading management.',
    image: 'https://harikiran-portfolio.netlify.app/og-resources.jpg',
    content: `
      <h2>Automated Tools & Digital Systems</h2>
      <p>Explore custom Google Sheets spreadsheets designed for automated budget tracking, habit formation analytics, and personal library management.</p>
    `
  },
  {
    path: '/seo-audit',
    title: 'Technical SEO Audit & Diagnostics | G. Hari Kiran',
    heading: 'Technical SEO Diagnostics & Crawler Health Dashboard',
    description: 'View real-time technical SEO health diagnostics, IndexNow submission logs, and Core Web Vitals performance for G. Hari Kiran\'s SEO consulting portfolio in Jamshedpur.',
    image: 'https://harikiran-portfolio.netlify.app/og-image.jpg',
    content: `
      <h2>Website Health & Indexing Diagnostics</h2>
      <p>Real-time telemetry evaluating crawl efficiency, schema graph compliance, canonical resolution, and search crawler indexation across Bing, Google, and AI Search Engines.</p>
    `
  }
];

async function generatePages() {
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

  // Helper to inject route-specific metadata and full semantic HTML
  function createPageHtml(
    pageUrl: string,
    title: string,
    heading: string,
    description: string,
    bodyHtml: string,
    category = '',
    ogImage = 'https://harikiran-portfolio.netlify.app/og-image.jpg',
    authorName = 'G. Hari Kiran',
    publishDate = '2026-08-30'
  ) {
    const normalizedPageUrl = pageUrl.endsWith('/') ? pageUrl : `${pageUrl}/`;
    const canonical = `${siteUrl}${normalizedPageUrl}`;
    let html = template;

    let imageType = "image/jpeg";
    if (ogImage.endsWith(".png")) imageType = "image/png";
    else if (ogImage.endsWith(".webp")) imageType = "image/webp";

    // Purge existing tags to prevent duplicates
    html = html.replace(/<title[^>]*>[\s\S]*?<\/title>/gi, "");
    html = html.replace(/<meta[^>]+name=["']description["'][^>]*\/?>/gi, "");
    html = html.replace(/<meta[^>]+property=["']og:[^"']+["'][^>]*\/?>/gi, "");
    html = html.replace(/<meta[^>]+name=["']twitter:[^"']+["'][^>]*\/?>/gi, "");
    html = html.replace(/<link[^>]+rel=["']canonical["'][^>]*\/?>/gi, "");

    const fullTitle = title.includes("G. Hari Kiran") ? title : `${title} | G. Hari Kiran`;

    const isArticle = pageUrl.startsWith('/blog/');
    const schemaJsonLd = isArticle ? JSON.stringify({
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      "headline": heading,
      "name": fullTitle,
      "description": description,
      "image": ogImage,
      "datePublished": publishDate,
      "dateModified": publishDate,
      "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": canonical
      },
      "author": {
        "@type": "Person",
        "name": authorName,
        "url": siteUrl
      },
      "publisher": {
        "@type": "Person",
        "name": "G. Hari Kiran",
        "url": siteUrl,
        "image": "https://i.postimg.cc/d1MxW0j1/Hari-Portfolio.png"
      }
    }) : JSON.stringify({
      "@context": "https://schema.org",
      "@type": "WebPage",
      "name": fullTitle,
      "description": description,
      "url": canonical
    });

    const cleanSocialTags = `
    <title>${fullTitle}</title>
    <meta name="description" content="${description}">
    <link rel="canonical" href="${canonical}">

    <!-- Open Graph (Bing, WhatsApp, LinkedIn, Facebook, Slack, Telegram) -->
    <meta property="og:type" content="${isArticle ? 'article' : 'website'}">
    <meta property="og:site_name" content="G. Hari Kiran Portfolio">
    <meta property="og:url" content="${canonical}">
    <meta property="og:title" content="${fullTitle}">
    <meta property="og:description" content="${description}">
    <meta property="og:image" content="${ogImage}">
    <meta property="og:image:secure_url" content="${ogImage}">
    <meta property="og:image:type" content="${imageType}">
    <meta property="og:image:width" content="1200">
    <meta property="og:image:height" content="630">
    <meta property="og:image:alt" content="${fullTitle}">

    <!-- Twitter / X Card -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:site" content="@GHariKiran29">
    <meta name="twitter:creator" content="@GHariKiran29">
    <meta name="twitter:title" content="${fullTitle}">
    <meta name="twitter:description" content="${description}">
    <meta name="twitter:image" content="${ogImage}">
    <meta name="twitter:image:src" content="${ogImage}">
    <meta name="twitter:image:alt" content="${fullTitle}">
    <meta name="twitter:domain" content="harikiran-portfolio.netlify.app">
    <meta name="twitter:url" content="${canonical}">

    <!-- Page Specific Structured Schema.org JSON-LD -->
    <script type="application/ld+json">
    ${schemaJsonLd}
    </script>`;

    html = html.replace(/<head[^>]*>/i, `$&${cleanSocialTags}`);

    // Pre-render rich, complete semantic HTML inside #root so Bingbot & search crawlers see 1000+ words immediately
    const preRenderedContent = `
      <div id="prerendered-content" style="max-width: 900px; margin: 0 auto; padding: 100px 24px 80px; font-family: 'Space Grotesk', system-ui, -apple-system, sans-serif; color: #1a1a1a; line-height: 1.7;">
        <nav aria-label="Breadcrumb" style="margin-bottom: 24px;">
          <a href="/" style="color: #FF6B00; text-decoration: none; font-weight: 700; text-transform: uppercase; font-size: 0.75rem; letter-spacing: 2px;">Home</a>
          <span style="color: #999; margin: 0 8px;">/</span>
          ${isArticle ? `<a href="/blog/" style="color: #FF6B00; text-decoration: none; font-weight: 700; text-transform: uppercase; font-size: 0.75rem; letter-spacing: 2px;">Blog</a><span style="color: #999; margin: 0 8px;">/</span>` : ''}
          <span style="color: #666; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 1px;">${heading}</span>
        </nav>
        
        <header style="margin-bottom: 36px; border-bottom: 1px solid #e5e5e5; padding-bottom: 24px;">
          ${category ? `<span style="display: inline-block; background: #FF6B00; color: #fff; padding: 4px 12px; border-radius: 9999px; font-size: 0.65rem; font-weight: 900; text-transform: uppercase; letter-spacing: 2px; margin-bottom: 16px;">${category}</span>` : ''}
          <h1 style="font-size: clamp(2rem, 4vw, 3.2rem); font-weight: 900; line-height: 1.15; letter-spacing: -0.5px; margin-bottom: 16px; color: #0A0A0A;">
            ${heading}
          </h1>
          <p style="font-size: 1.15rem; line-height: 1.6; color: #444; margin-bottom: 16px; font-weight: 500;">
            ${description}
          </p>
          <div style="font-size: 0.85rem; color: #777; display: flex; gap: 16px; align-items: center; flex-wrap: wrap;">
            <span>By <strong>${authorName}</strong></span>
            <span>•</span>
            <span>Published: ${publishDate}</span>
            <span>•</span>
            <span>Location: Jamshedpur, Jharkhand</span>
          </div>
        </header>

        <article style="font-size: 1.05rem; color: #222;">
          ${bodyHtml}
        </article>

        <footer style="margin-top: 50px; padding-top: 30px; border-top: 1px solid #e5e5e5; font-size: 0.95rem; color: #555;">
          <p><strong>About the Author:</strong> G. Hari Kiran is an SEO Expert and Digital Marketing Consultant based in Jamshedpur, Jharkhand, India. For consultations, inquiries, or custom marketing audits, visit the <a href="/contact/" style="color: #FF6B00; font-weight: 700;">Contact Page</a> or explore the <a href="/blog/" style="color: #FF6B00; font-weight: 700;">SEO Blog</a>.</p>
        </footer>
      </div>
    `;

    // Inject into #root
    html = html.replace('<div id="root">', `<div id="root">${preRenderedContent}`);

    return html;
  }

  const publicDir = path.resolve(__dirname, '../public');
  const distCoversDir = path.join(distDir, 'assets', 'blog-covers');
  const publicCoversDir = path.join(publicDir, 'assets', 'blog-covers');

  // Ensure dist/assets/blog-covers exists and synchronize all covers
  fs.mkdirSync(distCoversDir, { recursive: true });
  if (fs.existsSync(publicCoversDir)) {
    const coverFiles = fs.readdirSync(publicCoversDir);
    for (const f of coverFiles) {
      fs.copyFileSync(path.join(publicCoversDir, f), path.join(distCoversDir, f));
    }
    console.log(`Synchronized ${coverFiles.length} blog cover images to dist/assets/blog-covers/`);
  }

  // 1. Generate Static Pages
  staticPages.forEach(p => {
    const targetDir = path.join(distDir, p.path.slice(1));
    fs.mkdirSync(targetDir, { recursive: true });
    const pageHtml = createPageHtml(p.path, p.title, p.heading, p.description, p.content, '', p.image);
    fs.writeFileSync(path.join(targetDir, 'index.html'), pageHtml);
    console.log(`Generated rich pre-rendered page: ${p.path}/index.html`);
  });

  // 2. Generate Blog Post Pages with FULL content & optimized social covers
  blogPosts.forEach(b => {
    const postPath = `/blog/${b.slug}`;
    const targetDir = path.join(distDir, 'blog', b.slug);
    fs.mkdirSync(targetDir, { recursive: true });
    const pageTitle = b.seoTitle || b.title;

    // Check if high-resolution local cover exists
    const localCoverPath = path.join(publicCoversDir, `${b.slug}.jpg`);
    const postImage = fs.existsSync(localCoverPath)
      ? `https://harikiran-portfolio.netlify.app/assets/blog-covers/${b.slug}.jpg`
      : (b.image || 'https://harikiran-portfolio.netlify.app/og-image.jpg');

    const authorName = b.author?.name || 'G. Hari Kiran';
    const pageHtml = createPageHtml(
      postPath,
      pageTitle,
      b.title,
      b.excerpt,
      b.content,
      b.category,
      postImage,
      authorName,
      b.date
    );
    fs.writeFileSync(path.join(targetDir, 'index.html'), pageHtml);
    console.log(`Generated full-content pre-rendered blog post: ${postPath}/index.html (${b.content.length} chars)`);
  });

  // 2b. Pre-render dynamic Firestore articles if available
  try {
    const configPath = path.resolve(__dirname, '../firebase-applet-config.json');
    if (fs.existsSync(configPath)) {
      const { initializeApp } = await import('firebase/app');
      const { getFirestore, collection, getDocs, terminate } = await import('firebase/firestore');
      const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
      const app = initializeApp(config);
      const db = getFirestore(app, config.firestoreDatabaseId);

      const snap = await getDocs(collection(db, 'content'));
      console.log(`Pre-rendering ${snap.size} Firestore articles...`);
      snap.forEach(doc => {
        const data = doc.data();
        const title = data.title || '';
        const cleanSlug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
        if (!cleanSlug) return;

        const postPath = `/blog/${cleanSlug}`;
        const targetDir = path.join(distDir, 'blog', cleanSlug);
        fs.mkdirSync(targetDir, { recursive: true });

        const localCoverPath = path.join(publicCoversDir, `${cleanSlug}.jpg`);
        const postImage = fs.existsSync(localCoverPath)
          ? `https://harikiran-portfolio.netlify.app/assets/blog-covers/${cleanSlug}.jpg`
          : (data.thumbnail || data.image || data.ogImage || 'https://harikiran-portfolio.netlify.app/og-image.jpg');

        const pageHtml = createPageHtml(
          postPath,
          data.metaTitle || title,
          title,
          data.excerpt || data.metaDescription || data.description || '',
          data.description || data.content || '',
          data.category || 'SEO Tips',
          postImage,
          data.author?.name || 'G. Hari Kiran',
          data.publishedDate || '2026-08-30'
        );
        fs.writeFileSync(path.join(targetDir, 'index.html'), pageHtml);
        console.log(`Generated Firestore pre-rendered blog post: ${postPath}/index.html`);
      });
      await terminate(db);
    }
  } catch (fsErr: any) {
    console.warn('[Static Generator] Firestore pre-render note:', fsErr.message);
  }

  // 3. Generate Project Detail Pages with FULL details
  projects.forEach(prj => {
    const prjPath = `/work/${prj.slug}`;
    const targetDir = path.join(distDir, 'work', prj.slug);
    fs.mkdirSync(targetDir, { recursive: true });
    const pageTitle = prj.seoTitle || `${prj.title} | G. Hari Kiran`;
    const prjImage = prj.image || 'https://harikiran-portfolio.netlify.app/og-image.jpg';
    const projectContent = `
      <h2>Executive Overview</h2>
      <p>${prj.longDescription || prj.description}</p>
      
      <h2>Verified Performance Metrics</h2>
      <ul>
        ${prj.stats ? prj.stats.map(s => `<li><strong>${s.label}:</strong> ${s.value}</li>`).join('') : ''}
      </ul>

      <h2>Strategic Implementation Steps</h2>
      <ol>
        ${prj.process ? prj.process.map(step => `<li><strong>${step.step}:</strong> ${step.detail}</li>`).join('') : ''}
      </ol>

      <h2>Key Execution Highlights</h2>
      <ul>
        ${prj.executionHighlights ? prj.executionHighlights.map(h => `<li>${h}</li>`).join('') : ''}
      </ul>
    `;
    const pageHtml = createPageHtml(
      prjPath,
      pageTitle,
      prj.title,
      prj.description,
      projectContent,
      prj.category,
      prjImage
    );
    fs.writeFileSync(path.join(targetDir, 'index.html'), pageHtml);
    console.log(`Generated rich pre-rendered work project: ${prjPath}/index.html`);
  });

  // 4. Generate and synchronize image-enabled sitemap.xml to dist and public
  const sitemapPath = path.join(publicDir, 'sitemap.xml');
  if (fs.existsSync(sitemapPath)) {
    const sitemapContent = fs.readFileSync(sitemapPath, 'utf8');
    fs.writeFileSync(path.join(distDir, 'sitemap.xml'), sitemapContent);
    console.log('Successfully synchronized Google Image-enabled sitemap.xml to dist/sitemap.xml');
  }

  // 5. Enhance root dist/index.html with default social sharing meta tags
  const rootIndex = path.join(distDir, 'index.html');
  if (fs.existsSync(rootIndex)) {
    let rootHtml = fs.readFileSync(rootIndex, 'utf8');
    if (!rootHtml.includes('property="og:image"')) {
      const defaultMeta = `
    <meta property="og:type" content="website" />
    <meta property="og:title" content="G. Hari Kiran | Leading SEO Expert & Digital Marketing Consultant" />
    <meta property="og:description" content="Premier SEO Expert and Digital Marketing Consultant in Jamshedpur, Jharkhand. I scale organic search traffic, commercial keyword rankings, and client revenue." />
    <meta property="og:url" content="https://harikiran-portfolio.netlify.app/" />
    <meta property="og:image" content="https://harikiran-portfolio.netlify.app/og-image.jpg" />
    <meta property="og:image:secure_url" content="https://harikiran-portfolio.netlify.app/og-image.jpg" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta property="og:image:type" content="image/jpeg" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="G. Hari Kiran | Leading SEO Expert & Digital Marketing Consultant" />
    <meta name="twitter:description" content="Premier SEO Expert and Digital Marketing Consultant in Jamshedpur, Jharkhand. I scale organic search traffic, commercial keyword rankings, and client revenue." />
    <meta name="twitter:image" content="https://harikiran-portfolio.netlify.app/og-image.jpg" />`;
      rootHtml = rootHtml.replace('</head>', `${defaultMeta}\n  </head>`);
      fs.writeFileSync(rootIndex, rootHtml);
      console.log('Injected default Open Graph metadata into root dist/index.html');
    }
  }

  console.log('Successfully generated all pre-rendered HTML files with full content depth for Bing & Google search engines!');
}

generatePages();
