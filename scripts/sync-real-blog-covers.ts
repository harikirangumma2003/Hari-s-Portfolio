import fs from 'fs';
import path from 'path';
import { execFileSync } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const publicCoversDir = path.resolve(__dirname, '../public/assets/blog-covers');
fs.mkdirSync(publicCoversDir, { recursive: true });

function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
}

// Master map of real cover images for all known blog posts
const masterCoverImageMap: Record<string, string> = {
  // Google Preferred Source
  'google-preferred-source-how-to-add-my-website-on-google': 'https://i.postimg.cc/Y0S0sHYD/Google-Preferred-Source.png',
  'google-preferred-sources-why-i-added-it-to-my-portfolio-website': 'https://cdn-images-1.medium.com/max/1024/1*ne0ICGDQeq4UtU77PVszRA.png',
  
  // SEO Services Cost $500
  'seo-services-cost-is-500-enough-for-a-company': 'https://cdn-images-1.medium.com/max/1024/0*1BveB2PuJtb1a3x_.jpg',
  
  // Traffic / Better Traffic
  'why-most-businesses-don-t-need-more-traffic-they-need-better-traffic': 'https://cdn-images-1.medium.com/max/1024/1*TMVBBrq0agbi7zWskSVt6Q.png',
  'why-most-businesses-dont-need-more-traffic-they-need-better-traffic': 'https://cdn-images-1.medium.com/max/1024/1*TMVBBrq0agbi7zWskSVt6Q.png',
  
  // OSHA Recordkeeping Mistakes
  'osha-1904-recordkeeping-the-mistakes-that-cost-manufacturing-companies-thousands': 'https://cdn-images-1.medium.com/max/1024/1*0zTa99cjQY-bblevak9sDw.png',
  'why-houston-manufacturers-keep-receiving-osha-1904-recordkeeping-citations': 'https://cdn-images-1.medium.com/max/1024/1*0zTa99cjQY-bblevak9sDw.png',
  
  // Temporary Workers OSHA
  'who-records-injuries-for-temporary-workers-the-osha-rule-many-houston-manufacturers-misunderstand': 'https://cdn-images-1.medium.com/max/1024/0*79kbtFN9cgsuT5sJ.jpg',
  
  // 2X Growth Formula
  'the-2x-growth-formula-in-marketing-customer-experience-employee-experience': 'https://cdn-images-1.medium.com/max/1024/1*eZM0HCirGWHFvXQ3dd4yjA.png',
  
  // Technical SEO Checklist
  'technical-seo-checklist-2026-audit-before-ranking': 'https://images.unsplash.com/photo-1571721795195-a2ca2d33e402?auto=format&fit=crop&w=1200&q=80',
  'technical-seo-checklist': 'https://images.unsplash.com/photo-1571721795195-a2ca2d33e402?auto=format&fit=crop&w=1200&q=80',
  
  // CompliEase & SuMeera Solutions
  'compliease-osha-log-management-software': 'https://i2.ytimg.com/vi/a2PrJ944ndI/hqdefault.jpg',
  'sumeera-solutions-osha-compliance-software': 'https://i2.ytimg.com/vi/a2PrJ944ndI/hqdefault.jpg',
  'compliease-a-sumeera-solutions-product-promotional-campaign': 'https://i2.ytimg.com/vi/a2PrJ944ndI/hqdefault.jpg',
  
  // Workplace Compliance & Contractor Injury
  'workplace-compliance-software-modern-business': 'https://cdn-images-1.medium.com/max/1024/0*7yvtCN6GijGWHmU9.png',
  'the-contractor-injury-reporting-gap-that-creates-osha-1904-problems': 'https://cdn-images-1.medium.com/max/1024/0*7yvtCN6GijGWHmU9.png',
  
  // Retention & Blog Engagement
  'retention-marketing-sustainable-growth': 'https://res.cloudinary.com/rlvicqoq/image/upload/f_webp/q_auto:eco/why-blog-engagement-matters-more-than-page-views.jpg',
  'why-blog-engagement-matters': 'https://res.cloudinary.com/rlvicqoq/image/upload/f_webp/q_auto:eco/why-blog-engagement-matters-more-than-page-views.jpg',
  
  // Email Newsletter & Traffic
  'high-converting-email-newsletter-guide': 'https://cdn-images-1.medium.com/max/1024/1*TMVBBrq0agbi7zWskSVt6Q.png',
  
  // Rank Higher Organically & How Much Time Does SEO Really Take
  'rank-higher-google-organically': 'https://cdn-images-1.medium.com/max/1024/1*PC0bmihRINTbb9OTcQirtA.png',
  'how-much-time-does-seo-really-take-the-question-every-client-asks': 'https://cdn-images-1.medium.com/max/1024/1*PC0bmihRINTbb9OTcQirtA.png',
  
  // Facebook Marketing & Change Strategy
  'facebook-marketing-small-businesses': 'https://cdn-images-1.medium.com/max/1024/1*rJdllH-K-sZxarQP4m3kGg.png',
  'when-your-marketing-strategy-isn-t-working-change-the-strategy-not-the-goal': 'https://cdn-images-1.medium.com/max/1024/1*rJdllH-K-sZxarQP4m3kGg.png',
  'when-your-marketing-strategy-isnt-working-change-the-strategy-not-the-goal': 'https://cdn-images-1.medium.com/max/1024/1*rJdllH-K-sZxarQP4m3kGg.png',
  
  // Organic SEO Services & Three Pillars
  'organic-seo-services': 'https://cdn-images-1.medium.com/max/1024/1*q6Myjv77uCcJ7X1Jx6YWMA.png',
  'the-three-pillars-of-digital-marketing-search-visibility-and-return': 'https://cdn-images-1.medium.com/max/1024/1*q6Myjv77uCcJ7X1Jx6YWMA.png',
  
  // Best Digital Marketer NSU & Brand Placement Offer
  'best-digital-marketer-in-netaji-subhas-university': 'https://cdn-images-1.medium.com/max/1024/1*GU4Y8t75TIsblqACNINA1w.png',
  'how-i-got-a-brand-placement-offer-on-my-portfolio-website': 'https://cdn-images-1.medium.com/max/1024/1*GU4Y8t75TIsblqACNINA1w.png',
  
  // Generative AI in GSC
  'generative-ai-in-google-search-console': 'https://i.postimg.cc/G2t75fM3/generative-ai-google-search-console-seo.png',
  
  // ChatGPT Order
  'this-is-how-i-got-an-order-from-chatgpt': 'https://cdn-images-1.medium.com/max/1024/1*rOCDYfIpxsdCORYefLT9UQ.png',
  
  // Jamshedpur AI Optimization
  'why-every-business-in-jamshedpur-should-start-thinking-about-ai-optimization': 'https://cdn-images-1.medium.com/max/1024/1*_1jHo_cU8TPs9R2hZYTYcw.png',
  
  // 2 A's Freelance Client
  'the-2-a-s-of-getting-your-first-freelance-client': 'https://cdn-images-1.medium.com/max/747/0*5FUSiguQ1-SQl_s3',
  'the-2-as-of-getting-your-first-freelance-client': 'https://cdn-images-1.medium.com/max/747/0*5FUSiguQ1-SQl_s3',
  
  // Why Some Managers Forget
  'why-some-managers-forget-what-it-feels-like-to-be-an-employee': 'https://cdn-images-1.medium.com/max/1024/1*pZ5BB_p7DCgWQEk2PydWpw.png',
  
  // GSC Embracing Creators
  'google-search-console-is-finally-embracing-creators': 'https://cdn-images-1.medium.com/max/1024/1*8KyBVGsGxlx-4hkc7ZBP7g.png',
  
  // Advice to Younger Self
  'if-i-could-give-my-younger-self-one-piece-of-advice-it-would-be-this': 'https://cdn-images-1.medium.com/max/1024/1*VFQt-5Yc0gyqjk3X0sfnPg.png',
  
  // ChatGPT Ads AEO
  'chatgpt-ads-are-here-why-aeo-could-become-the-next-big-brand-visibility-strategy': 'https://cdn-images-1.medium.com/max/1024/1*gl9KmM_-dPwQjKCqQ2_ZYw.png',
  
  // Traffic Drop 7 Reasons
  'why-did-my-website-traffic-suddenly-drop-7-seo-reasons-you-should-check': 'https://cdn-images-1.medium.com/max/1024/0*GZXq4ZmZNpSwjMfl.png',
  
  // Trust Problem
  'your-website-doesnt-have-an-seo-problem-it-has-a-trust-problem': 'https://cdn-images-1.medium.com/max/1024/1*9i-_-QLSgo22d74IESsciA.jpeg',
  
  // Publishing More Blogs
  'why-publishing-more-blogs-isnt-helping-your-seo': 'https://cdn-images-1.medium.com/max/1024/1*IVcENb9SmSIxQLDiM1j_VA.png'
};

async function downloadAndProcess() {
  console.log('Starting sync of all real blog covers...');
  
  // Fetch from Firestore dynamic content to capture any new blogs
  try {
    const configPath = path.resolve(__dirname, '../firebase-applet-config.json');
    if (fs.existsSync(configPath)) {
      const { initializeApp } = await import('firebase/app');
      const { getFirestore, collection, getDocs, terminate } = await import('firebase/firestore');
      const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
      const app = initializeApp(config);
      const db = getFirestore(app, config.firestoreDatabaseId);

      const snap = await getDocs(collection(db, 'content'));
      snap.forEach(doc => {
        const d = doc.data();
        let s = '';
        if (d.canonicalUrl && d.canonicalUrl.includes('/blog/')) {
          s = d.canonicalUrl.replace(/^.*\/blog\//, '').replace(/\/$/, '');
        } else if (d.url && d.url.includes('/blog/')) {
          s = d.url.replace(/^.*\/blog\//, '').replace(/\/$/, '');
        } else {
          s = slugify(d.title);
        }
        const img = d.thumbnail || d.ogImage || (typeof d.image === 'string' ? d.image : (d.image ? d.image.thumbnail : ''));
        if (s && img && !masterCoverImageMap[s]) {
          masterCoverImageMap[s] = img;
        }
      });
      await terminate(db);
    }
  } catch (e: any) {
    console.warn('Firestore sync note:', e.message);
  }

  const entries = Object.entries(masterCoverImageMap);
  console.log(`Processing ${entries.length} covers...`);

  for (const [slug, imageUrl] of entries) {
    const destPath = path.join(publicCoversDir, `${slug}.jpg`);
    const tempSrc = `/tmp/cover-${slug}.tmp`;

    try {
      // Use curl to download image safely following redirects and with realistic browser UA
      execFileSync('curl', [
        '-s', '-L',
        '-A', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
        '--max-time', '15',
        imageUrl,
        '-o', tempSrc
      ]);

      if (fs.existsSync(tempSrc) && fs.statSync(tempSrc).size > 1000) {
        // Convert with ImageMagick into high-fidelity 1200x630 JPEG
        execFileSync('convert', [
          tempSrc,
          '-resize', '1200x630^',
          '-gravity', 'center',
          '-extent', '1200x630',
          '-quality', '88',
          destPath
        ]);
        console.log(`✓ Processed ${slug}.jpg (${fs.statSync(destPath).size} bytes)`);
      } else {
        console.warn(`! Failed to download valid image for ${slug} from ${imageUrl}`);
      }
    } catch (err: any) {
      console.error(`✕ Error converting ${slug}:`, err.message);
    } finally {
      try { if (fs.existsSync(tempSrc)) fs.unlinkSync(tempSrc); } catch (_) {}
    }
  }

  console.log('Cover sync complete!');
}

downloadAndProcess().catch(console.error);
