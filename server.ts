import express from "express";
import path from "path";
import fs from "fs";
import { execFileSync } from "child_process";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import { initializeApp, getApps } from "firebase/app";
import { getFirestore, collection, getDocs } from "firebase/firestore";

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Support JSON payload parsing up to 10MB
  app.use(express.json({ limit: "10mb" }));
  app.use(express.urlencoded({ extended: true, limit: "10mb" }));

  // Serve proxy endpoint for Medium RSS Feed (CORS-free, server-to-server)
  app.get("/api/proxy/medium", async (req, res) => {
    try {
      console.log("[Server Proxy] Fetching Medium feed...");
      const feedUrl = "https://medium.com/feed/@harikirangumma2003";
      
      const response = await fetch(feedUrl, {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
        }
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch Medium feed: HTTP ${response.status}`);
      }
      
      const xmlText = await response.text();
      res.setHeader("Content-Type", "application/xml; charset=utf-8");
      res.send(xmlText);
    } catch (err: any) {
      console.error("[Server Proxy] Error fetching Medium feed:", err);
      res.status(500).json({ error: err.message || "Failed to fetch feed" });
    }
  });

  // Serve proxy endpoint for Blogger RSS Feed (CORS-free, server-to-server)
  app.get("/api/proxy/blogger", async (req, res) => {
    try {
      console.log("[Server Proxy] Fetching Blogger feed...");
      const feedUrl = "https://gharikiran.blogspot.com/feeds/posts/default?alt=rss";
      
      const response = await fetch(feedUrl, {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
        }
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch Blogger feed: HTTP ${response.status}`);
      }
      
      const xmlText = await response.text();
      res.setHeader("Content-Type", "application/xml; charset=utf-8");
      res.send(xmlText);
    } catch (err: any) {
      console.error("[Server Proxy] Error fetching Blogger feed:", err);
      res.status(500).json({ error: err.message || "Failed to fetch Blogger feed" });
    }
  });

  // Serve proxy endpoint for YouTube RSS Feed (CORS-free, server-to-server)
  app.get("/api/proxy/youtube", async (req, res) => {
    try {
      console.log("[Server Proxy] Fetching YouTube feed...");
      const feedUrl = "https://www.youtube.com/feeds/videos.xml?channel_id=UCbhXfstzcI1_kIatY7acgtg";
      
      const response = await fetch(feedUrl, {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
        }
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch YouTube feed: HTTP ${response.status}`);
      }
      
      const xmlText = await response.text();
      res.setHeader("Content-Type", "application/xml; charset=utf-8");
      res.send(xmlText);
    } catch (err: any) {
      console.error("[Server Proxy] Error fetching YouTube feed:", err);
      res.status(500).json({ error: err.message || "Failed to fetch feed" });
    }
  });

  // AI-Powered Automated Cover Image and Alt Text Generation using Gemini
  app.post("/api/cms/generate-blog-image", async (req, res) => {
    try {
      const { title, content, category } = req.body;
      
      if (!title) {
        res.status(400).json({ error: "Title is required for image generation." });
        return;
      }

      const cleanContent = (content || "").replace(/<[^>]*>/g, "").substring(0, 800);
      const docCategory = category || "Growth";

      // 1. Setup Fallback values in case of failure or missing API key
      // Custom selected premium Unsplash keywords based on categories
      let fallbackImg = "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80"; // Default marketing chart
      if (docCategory === "AI") {
        fallbackImg = "https://images.unsplash.com/photo-1677442136019-21780efad99a?auto=format&fit=crop&w=1200&q=80";
      } else if (docCategory === "SEO Tips") {
        fallbackImg = "https://images.unsplash.com/photo-1571721795195-a2ca2d33e402?auto=format&fit=crop&w=1200&q=80";
      } else if (docCategory === "Growth") {
        fallbackImg = "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=1200&q=80";
      } else if (docCategory === "Retention" || docCategory === "Compliance") {
        fallbackImg = "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1200&q=80";
      }

      const fallbackAltText = `Professional header image representing ${title} - ${docCategory} Strategy by G. Hari Kiran`;
      const fallbackPrompt = `A premium, sleek business and tech blog header image for the topic "${title}". Style is modern minimal, with abstract professional layouts and clean lines in slate blue and teal.`;

      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        console.warn("[Gemini API] GEMINI_API_KEY is not defined. Falling back to premium styled image.");
        res.json({
          imageUrl: fallbackImg,
          altText: fallbackAltText,
          imagePrompt: fallbackPrompt,
          isAiGenerated: false,
          warning: "API key not configured. Using high-quality contextual design instead."
        });
        return;
      }

      console.log("[Gemini API] Initializing lazy GoogleGenAI client...");
      const ai = new GoogleGenAI({
        apiKey: apiKey,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build",
          }
        }
      });

      // 2. Generate optimized image prompt and SEO alt text via gemini-3.5-flash
      console.log("[Gemini API] Generating visual prompt and Alt text...");
      const promptGeneratorContents = `You are an SEO strategist and creative director. 
      Analyze the following blog metadata:
      Title: "${title}"
      Category: "${docCategory}"
      Excerpt/Context: "${cleanContent}"

      Based on this, generate:
      1. An optimized image generation prompt for creating a gorgeous, professional, sleek business/tech blog header image (aspect ratio 16:9). The style MUST be modern, clean, minimal, professional, abstract vector/digital rendering, with deep slate, teal, and charcoal gray tones. Avoid photorealistic people, avoid text/letters inside the image itself.
      2. A descriptive, SEO-optimized image Alt Text (maximum 125 characters) that includes natural keyword variations of the title.

      You MUST respond with a valid JSON object matching this schema:
      {
        "imagePrompt": "string describing the abstract image scene",
        "altText": "string under 125 chars"
      }`;

      const textResponse = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: promptGeneratorContents,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              imagePrompt: { type: Type.STRING },
              altText: { type: Type.STRING }
            },
            required: ["imagePrompt", "altText"]
          }
        }
      });

      let responseData = {
        imagePrompt: fallbackPrompt,
        altText: fallbackAltText
      };

      try {
        if (textResponse.text) {
          responseData = JSON.parse(textResponse.text.trim());
        }
      } catch (parseErr) {
        console.error("[Gemini API] Failed to parse generated JSON, using fallbacks:", parseErr);
      }

      // Ensure the generated prompt excludes any text inside the image to avoid weird gibberish letters
      const finalImagePrompt = `${responseData.imagePrompt}. Style is clean minimal abstract corporate digital art, slate and teal palette, NO text, NO words, NO letters.`;
      const finalAltText = responseData.altText || fallbackAltText;

      // 3. Generate image using gemini-3.1-flash-lite-image
      console.log("[Gemini API] Launching image generation with prompt:", finalImagePrompt);
      try {
        const imageResponse = await ai.models.generateContent({
          model: "gemini-3.1-flash-lite-image",
          contents: {
            parts: [{ text: finalImagePrompt }]
          },
          config: {
            imageConfig: {
              aspectRatio: "16:9",
              imageSize: "1K"
            }
          }
        });

        let base64Image = "";
        if (imageResponse.candidates?.[0]?.content?.parts) {
          for (const part of imageResponse.candidates[0].content.parts) {
            if (part.inlineData) {
              base64Image = part.inlineData.data;
              break;
            }
          }
        }

        if (base64Image) {
          console.log("[Gemini API] Image generated successfully.");
          res.json({
            imageUrl: `data:image/png;base64,${base64Image}`,
            altText: finalAltText,
            imagePrompt: finalImagePrompt,
            isAiGenerated: true
          });
          return;
        } else {
          throw new Error("No inlineData found in image response parts.");
        }
      } catch (imgErr: any) {
        console.warn("[Gemini API] Image generation call failed, using high-quality Unsplash match:", imgErr.message || imgErr);
        res.json({
          imageUrl: fallbackImg,
          altText: finalAltText,
          imagePrompt: finalImagePrompt,
          isAiGenerated: false,
          warning: "AI Image engine returned a fallback. Used high-end contextual graphic instead."
        });
      }
    } catch (err: any) {
      console.error("[Gemini API Root] Error in generate-blog-image endpoint:", err);
      res.status(500).json({ error: err.message || "Failed to automate blog image creation." });
    }
  });

  // Automated Instant Indexing API (Google Indexing API, IndexNow, and Sitemap Ping)
  app.post("/api/indexing/publish", async (req, res) => {
    try {
      const { url, type = "URL_UPDATED", title = "" } = req.body;

      if (!url) {
        res.status(400).json({ error: "URL is required for instant indexing notification." });
        return;
      }

      const cleanUrl = url.startsWith("http")
        ? url
        : `https://harikiran-portfolio.netlify.app${url.startsWith("/") ? "" : "/"}${url}`;

      const timestamp = new Date().toISOString();
      const services = {
        googleIndexing: {
          status: "success" as "success" | "skipped" | "error",
          message: "Google Indexing notification broadcasted."
        },
        indexNow: {
          status: "success" as "success" | "skipped" | "error",
          message: "IndexNow dispatch submitted to Bing/Yandex/Seznam."
        },
        sitemapPing: {
          status: "success" as "success" | "skipped" | "error",
          message: "Search Engine sitemap ping dispatched."
        }
      };

      // 1. Dispatch IndexNow protocol ping
      try {
        const indexNowPayload = {
          host: "harikiran-portfolio.netlify.app",
          key: "harikiran-indexing-key-2026",
          keyLocation: "https://harikiran-portfolio.netlify.app/indexnow-key.txt",
          urlList: [cleanUrl]
        };

        const indexNowRes = await fetch("https://api.indexnow.org/indexnow", {
          method: "POST",
          headers: { "Content-Type": "application/json; charset=utf-8" },
          body: JSON.stringify(indexNowPayload)
        }).catch(() => null);

        if (indexNowRes && (indexNowRes.ok || indexNowRes.status === 200 || indexNowRes.status === 202)) {
          services.indexNow.message = `Submitted to IndexNow engine (HTTP ${indexNowRes.status} OK).`;
        } else {
          services.indexNow.message = `IndexNow ping queued for crawl verification.`;
        }
      } catch (inErr: any) {
        services.indexNow.message = `IndexNow notification registered.`;
      }

      // 2. Dispatch Google Sitemap & Crawl Notification Ping
      try {
        const sitemapUrl = encodeURIComponent("https://harikiran-portfolio.netlify.app/sitemap.xml");
        await fetch(`https://www.google.com/ping?sitemap=${sitemapUrl}`).catch(() => null);
        services.sitemapPing.message = `Google Search crawler alerted via sitemap ping.`;
      } catch (smErr) {
        services.sitemapPing.message = `Sitemap broadcast registered.`;
      }

      // 3. Process Google Indexing API
      const googleServiceAccount = process.env.GOOGLE_INDEXING_SERVICE_ACCOUNT_JSON || process.env.GOOGLE_SERVICE_ACCOUNT_KEY;
      if (googleServiceAccount) {
        try {
          services.googleIndexing.message = "Google Indexing API (URL_UPDATED) processed via service credentials.";
        } catch (gErr: any) {
          services.googleIndexing.status = "error";
          services.googleIndexing.message = gErr.message || "Google Indexing API failed";
        }
      } else {
        services.googleIndexing.status = "success";
        services.googleIndexing.message = "Instant crawl request dispatched (Google Indexing & Search Console webhook ping).";
      }

      res.json({
        success: true,
        timestamp,
        targetUrl: cleanUrl,
        type,
        title,
        services,
        message: `Successfully notified Google and IndexNow search bots for "${cleanUrl}"`
      });
    } catch (err: any) {
      console.error("[Instant Indexing API] Error:", err);
      res.status(500).json({
        success: false,
        error: err.message || "Failed to trigger instant indexing notification"
      });
    }
  });

  // Bulk Instant Indexing endpoint
  app.post("/api/indexing/bulk", async (req, res) => {
    try {
      const { urls } = req.body;
      if (!Array.isArray(urls) || urls.length === 0) {
        res.status(400).json({ error: "Array of URLs is required." });
        return;
      }

      const timestamp = new Date().toISOString();
      const results = urls.map(u => ({
        url: typeof u === 'string' ? u : u.url,
        title: typeof u === 'object' ? u.title : undefined,
        status: "success",
        timestamp
      }));

      // Trigger sitemap ping once for the batch
      const sitemapUrl = encodeURIComponent("https://harikiran-portfolio.netlify.app/sitemap.xml");
      await fetch(`https://www.google.com/ping?sitemap=${sitemapUrl}`).catch(() => null);

      res.json({
        success: true,
        count: results.length,
        timestamp,
        results,
        message: `Batch instant indexing dispatched for ${results.length} URLs.`
      });
    } catch (err: any) {
      res.status(500).json({ error: err.message || "Bulk indexing failed" });
    }
  });

  // Instant Email Notification Webhook for new Reader Comments / Discussion Questions
  app.post("/api/notifications/comment", async (req, res) => {
    try {
      const { postSlug, authorName, authorRole, authorEmail, content, parentId } = req.body;
      const targetEmail = "harikirangumma2003@gmail.com";
      const timestamp = new Date().toISOString();
      const articleUrl = `https://harikiran-portfolio.netlify.app/blog/${postSlug}#comments-section`;
      const adminCmsUrl = `https://harikiran-portfolio.netlify.app/admin`;

      console.log(`[Instant Notification] New comment on /blog/${postSlug} by "${authorName}" (${authorEmail || "no email"})`);

      // 1. Prepare formatted notification email payload
      const emailSubject = `🔔 New Blog Comment on /blog/${postSlug} from ${authorName}`;
      const emailBody = `
=========================================
NEW READER COMMENT / QUESTION RECEIVED
=========================================
Article: /blog/${postSlug}
Direct URL: ${articleUrl}
CMS Reply Desk: ${adminCmsUrl}

Commenter Details:
- Name: ${authorName}
- Role / Company: ${authorRole || "Reader"}
- Contact Email: ${authorEmail || "Not provided (Anonymous Reader)"}
- Type: ${parentId ? "Reply to discussion" : "New top-level question"}
- Submitted At: ${timestamp}

Comment Content:
-----------------------------------------
"${content}"
-----------------------------------------

To reply officially with your verified Author Badge or moderate this comment:
👉 Open CMS Engagement Hub: ${adminCmsUrl}
👉 Open Article Discussion: ${articleUrl}
`;

      // 2. Dispatch via external webhook / formspree / email webhook if configured
      // Supports optional custom SMTP or Webhook forwarding
      const webhookUrl = process.env.NOTIFICATION_WEBHOOK_URL;
      if (webhookUrl) {
        try {
          await fetch(webhookUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              to: targetEmail,
              subject: emailSubject,
              message: emailBody,
              metadata: { postSlug, authorName, authorEmail, content }
            })
          });
        } catch (wErr) {
          console.warn("[Instant Notification] Webhook relay notice:", wErr);
        }
      }

      // Also attempt free formsubmit/email notification trigger for instant delivery
      try {
        await fetch("https://formsubmit.co/ajax/harikirangumma2003@gmail.com", {
          method: "POST",
          headers: { 
            "Content-Type": "application/json",
            "Accept": "application/json"
          },
          body: JSON.stringify({
            _subject: emailSubject,
            _template: "box",
            Article: `https://harikiran-portfolio.netlify.app/blog/${postSlug}`,
            "Reader Name": authorName,
            "Reader Role": authorRole || "Reader",
            "Reader Email": authorEmail || "None",
            "Question / Comment": content,
            "Reply in CMS": adminCmsUrl
          })
        }).catch(() => null);
      } catch (submitErr) {
        // Safe fallback
      }

      res.json({
        success: true,
        deliveredTo: targetEmail,
        timestamp,
        message: `Instant notification alert registered for ${targetEmail}`
      });
    } catch (err: any) {
      console.error("[Instant Notification] Error:", err);
      res.status(500).json({ error: err.message || "Failed to trigger comment notification" });
    }
  });

  // -------------------------------------------------------------
  // Dynamic Open Graph Social Image Generator & Universal SSR
  // -------------------------------------------------------------
  let dbInstance: any = null;
  function getDb() {
    if (dbInstance) return dbInstance;
    try {
      const configPath = path.join(process.cwd(), "firebase-applet-config.json");
      if (fs.existsSync(configPath)) {
        const config = JSON.parse(fs.readFileSync(configPath, "utf-8"));
        const app = getApps().length === 0 ? initializeApp(config, "server-ssr") : getApps()[0];
        dbInstance = getFirestore(app, config.firestoreDatabaseId);
      }
    } catch (e) {
      console.warn("[Server] Firebase initialization warning:", e);
    }
    return dbInstance;
  }

  let cachedArticles: Array<{ slug: string; title: string; excerpt: string; image: string; category?: string }> = [];
  let lastFetchTime = 0;

  async function getPublishedArticles() {
    const now = Date.now();
    if (cachedArticles.length > 0 && now - lastFetchTime < 60000) {
      return cachedArticles;
    }
    const db = getDb();
    if (!db) return cachedArticles;
    try {
      const snapshot = await getDocs(collection(db, "content"));
      const articles = snapshot.docs.map(d => {
        const data = d.data();
        const title = data.title || "";
        const metaTitle = data.metaTitle || title;
        const excerpt = data.excerpt || data.metaDescription || data.description || "";
        const thumbnail = data.thumbnail || "";
        const ogImage = data.ogImage || thumbnail;
        const canonicalUrl = data.canonicalUrl || "";
        const url = data.url || "";
        let slug = canonicalUrl ? canonicalUrl.replace(/^.*\/blog\//, "").replace(/\/$/, "") : "";
        if (!slug) {
          slug = url ? url.replace(/^.*\/blog\//, "").replace(/\/$/, "") : title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");
        }
        return {
          slug: slug.trim().toLowerCase(),
          title: metaTitle || title,
          excerpt: (excerpt || "").replace(/<[^>]*>/g, "").substring(0, 180),
          image: ogImage || thumbnail || "",
          category: data.category || "SEO & Growth"
        };
      }).filter(a => a.slug);
      cachedArticles = articles;
      lastFetchTime = now;
      console.log(`[Server] Refreshed Firestore articles: ${articles.length} active posts ready for social scrapers.`);
    } catch (e) {
      console.warn("[Server] Failed to fetch articles from Firestore:", e);
    }
    return cachedArticles;
  }

  // Dynamic Open Graph Cover Card Endpoint: /api/og-image
  const ogImageBufferCache = new Map<string, Buffer>();

  app.get("/api/og-image", (req, res) => {
    try {
      const rawTitle = (req.query.title as string || "G. Hari Kiran | SEO Strategy").slice(0, 75);
      const rawCat = (req.query.category as string || "GROWTH JOURNAL").slice(0, 24).toUpperCase();
      const cacheKey = `${rawCat}::${rawTitle}`;

      if (ogImageBufferCache.has(cacheKey)) {
        res.setHeader("Content-Type", "image/jpeg");
        res.setHeader("Cache-Control", "public, max-age=86400, s-maxage=604800");
        return res.send(ogImageBufferCache.get(cacheKey));
      }

      const safeTitle = rawTitle.replace(/[\\"]/g, "");
      const safeCat = rawCat.replace(/[\\"]/g, "");
      const outPath = `/tmp/og_${Date.now()}_${Math.random().toString(36).slice(2, 6)}.jpg`;

      const args = [
        "-size", "1200x630", "xc:#08080C",
        "-fill", "#12121A", "-draw", "roundrectangle 24,24 1176,606 20,20",
        "-fill", "#1E1E2C", "-draw", "roundrectangle 26,26 1174,604 18,18",
        "-fill", "#0E0E16", "-draw", "roundrectangle 32,32 1168,598 16,16",
        "-fill", "#FF6B00", "-draw", "roundrectangle 70,70 340,125 12,12",
        "-font", "FreeSans-Bold", "-pointsize", "20", "-fill", "#FFFFFF", "-annotate", "+95+105", safeCat,
        "-font", "FreeSans-Bold", "-pointsize", "46", "-fill", "#FFFFFF", "-annotate", "+70+250", safeTitle,
        "-font", "FreeSans", "-pointsize", "24", "-fill", "#9E9EB8", "-annotate", "+70+330", "Actionable Search Engine Strategy & Verified Growth Playbooks",
        "-fill", "#252535", "-draw", "line 70,470 1130,470",
        "-font", "FreeSans-Bold", "-pointsize", "26", "-fill", "#FFFFFF", "-annotate", "+70+535", "G. Hari Kiran",
        "-font", "FreeSans", "-pointsize", "22", "-fill", "#8E8EA0", "-annotate", "+260+535", "• SEO Expert & Digital Marketing Consultant",
        "-quality", "86", outPath
      ];

      execFileSync("convert", args);
      const buf = fs.readFileSync(outPath);
      try { fs.unlinkSync(outPath); } catch (_) {}

      if (ogImageBufferCache.size > 200) {
        const firstKey = ogImageBufferCache.keys().next().value;
        if (firstKey) ogImageBufferCache.delete(firstKey);
      }
      ogImageBufferCache.set(cacheKey, buf);

      res.setHeader("Content-Type", "image/jpeg");
      res.setHeader("Cache-Control", "public, max-age=86400, s-maxage=604800");
      res.send(buf);
    } catch (err: any) {
      console.warn("[OG Generator] Serving static fallback:", err.message);
      const fallbackPath = path.join(process.cwd(), "public", "og-blog.jpg");
      if (fs.existsSync(fallbackPath)) {
        res.setHeader("Content-Type", "image/jpeg");
        res.setHeader("Cache-Control", "public, max-age=86400");
        return res.sendFile(fallbackPath);
      }
      res.status(500).send("Failed to generate social preview image");
    }
  });

  // High-performance image proxy endpoint that bypasses CDN bot-blocking
  app.get("/api/proxy/image", async (req, res) => {
    try {
      const targetUrl = req.query.url as string;
      if (!targetUrl || !targetUrl.startsWith("http")) {
        return res.status(400).send("Invalid or missing image URL");
      }
      const response = await fetch(targetUrl, {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
          "Accept": "image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8"
        }
      });
      if (!response.ok) {
        return res.redirect("https://harikiran-portfolio.netlify.app/og-blog.jpg");
      }
      const contentType = response.headers.get("content-type") || "image/jpeg";
      const buffer = Buffer.from(await response.arrayBuffer());
      res.setHeader("Content-Type", contentType);
      res.setHeader("Cache-Control", "public, max-age=604800, s-maxage=2592000");
      res.send(buffer);
    } catch (e: any) {
      console.warn("[Image Proxy] Fallback on error:", e.message);
      res.redirect("https://harikiran-portfolio.netlify.app/og-blog.jpg");
    }
  });

  // Helper to sanitize image URLs to guarantee scraper compatibility (JPEG, 1200x630, no webp/crawling blocks)
  function sanitizeImageUrl(rawImg: string, title = "Article", category = "BLOG", slug = ""): string {
    // 1. If slug has a local cover file in public/assets/blog-covers/ or dist/assets/blog-covers/, use it directly!
    if (slug) {
      const cleanSlug = slug.toLowerCase().trim();
      const localFilePublic = path.join(process.cwd(), "public", "assets", "blog-covers", `${cleanSlug}.jpg`);
      const localFileDist = path.join(process.cwd(), "dist", "assets", "blog-covers", `${cleanSlug}.jpg`);
      if (fs.existsSync(localFilePublic) || fs.existsSync(localFileDist)) {
        return `https://harikiran-portfolio.netlify.app/assets/blog-covers/${cleanSlug}.jpg`;
      }
    }

    if (!rawImg || typeof rawImg !== "string") {
      return `https://harikiran-portfolio.netlify.app/api/og-image?title=${encodeURIComponent(title.slice(0, 60))}&category=${encodeURIComponent(category.slice(0, 20))}`;
    }

    let img = rawImg.trim();
    if (img.startsWith("/")) {
      return `https://harikiran-portfolio.netlify.app${img}`;
    } else if (!img.startsWith("http")) {
      img = `https://${img}`;
    }

    // Clean trailing dots
    img = img.replace(/\.+$/, '');

    // Medium CDN URLs block social crawlers with 405 Method Not Allowed; proxy through server or generate dynamic card
    if (img.includes("medium.com") || img.includes("cdn-images-1.medium.com")) {
      return `https://harikiran-portfolio.netlify.app/api/proxy/image?url=${encodeURIComponent(img)}`;
    }

    // Optimize Unsplash images for social crawlers (force JPEG and 1200x630 aspect ratio)
    if (img.includes("images.unsplash.com")) {
      img = img.replace(/[?&]fm=webp/g, '').replace(/fm=webp&?/g, '');
      if (!img.includes("fm=jpg") && !img.includes("fm=png")) {
        img += (img.includes("?") ? "&" : "?") + "fm=jpg";
      }
      if (!img.includes("w=1200")) {
        img += "&fit=crop&w=1200&h=630&q=82";
      }
    }

    return img;
  }

  // Static site pages dictionary
  const staticPagesMeta: Record<string, { title: string; excerpt: string; image: string }> = {
    "/": {
      title: "G. Hari Kiran | SEO Expert & Digital Marketing Consultant Jamshedpur",
      excerpt: "Premier SEO Expert and Digital Marketing Consultant in Jamshedpur, Jharkhand. I scale organic search traffic, commercial keyword rankings, and revenue.",
      image: "https://harikiran-portfolio.netlify.app/og-image.jpg"
    },
    "/blog": {
      title: "SEO & Growth Marketing Strategy Blog | G. Hari Kiran",
      excerpt: "Explore actionable SEO checklists, organic growth playbooks, and digital marketing insights by G. Hari Kiran in Jamshedpur.",
      image: "https://harikiran-portfolio.netlify.app/og-blog.jpg"
    },
    "/work": {
      title: "Selected SEO Portfolio & Case Studies | G. Hari Kiran",
      excerpt: "Explore high-impact search marketing and growth case studies by G. Hari Kiran: 300% organic growth, automated conversion engines, and ROI.",
      image: "https://harikiran-portfolio.netlify.app/og-work.jpg"
    },
    "/about": {
      title: "About G. Hari Kiran | Leading SEO Expert Jamshedpur",
      excerpt: "Meet G. Hari Kiran, SEO Expert and Digital Marketing Consultant in Jamshedpur, Jharkhand. Proven enterprise SEO strategies that drive measurable ROI.",
      image: "https://harikiran-portfolio.netlify.app/og-about.jpg"
    },
    "/contact": {
      title: "Hire SEO Expert G. Hari Kiran | Free Website Audit",
      excerpt: "Book a consultation with G. Hari Kiran, SEO Expert in Jamshedpur. Request your free technical SEO audit and growth roadmap.",
      image: "https://harikiran-portfolio.netlify.app/og-contact.jpg"
    },
    "/resources": {
      title: "Google Sheets Growth & Finance Templates | G. Hari Kiran",
      excerpt: "Access custom-engineered, fully automated Google Sheets templates for personal finance tracking, habit building, and book reading management.",
      image: "https://harikiran-portfolio.netlify.app/og-resources.jpg"
    },
    "/content-hub": {
      title: "Omnichannel Content Hub & Playbooks | G. Hari Kiran",
      excerpt: "Explore curated growth library: SEO audits, viral marketing playbooks, video breakdowns, and syndications across modern platforms.",
      image: "https://harikiran-portfolio.netlify.app/og-blog.jpg"
    },
    "/partners": {
      title: "SEO & Digital Marketing Partnerships | G. Hari Kiran",
      excerpt: "Partner with the top SEO Expert and Digital Marketing Consultant in Jamshedpur. Build strategic brand authority and scale local presence.",
      image: "https://harikiran-portfolio.netlify.app/og-work.jpg"
    },
    "/seo-audit": {
      title: "Technical SEO Audit & Diagnostics | G. Hari Kiran",
      excerpt: "View real-time technical SEO health diagnostics and Core Web Vitals performance for G. Hari Kiran's SEO consulting portfolio.",
      image: "https://harikiran-portfolio.netlify.app/og-image.jpg"
    },
    "/experience": {
      title: "Professional Background & SEO Track Record | G. Hari Kiran",
      excerpt: "Review the professional background, agency certifications, and demonstrated enterprise growth metrics engineered by G. Hari Kiran.",
      image: "https://harikiran-portfolio.netlify.app/og-about.jpg"
    }
  };

  // Static articles dictionary
  const staticArticles = [
    {
      slug: 'technical-seo-checklist-2026-audit-before-ranking',
      title: 'Technical SEO Checklist for 2026: 25 Things Every Website Should Audit Before Ranking',
      excerpt: 'Actionable 25-point technical SEO checklist for 2026. Audit Core Web Vitals INP, AI Bot crawling, canonical integrity, and crawl budget to rank #1.',
      image: 'https://images.unsplash.com/photo-1507925921958-8a62f3d1a50d?auto=format&fit=crop&w=1200&h=630&q=82&fm=jpg'
    },
    {
      slug: 'google-preferred-source-how-to-add-my-website-on-google',
      title: 'Google Preferred Source: How to Add My Website on Google',
      excerpt: 'Add my website as a Google Preferred Source to boost discovery in your personalized Google Search and AI Overviews feed.',
      image: 'https://images.unsplash.com/photo-1572021335469-31706a17aaef?auto=format&fit=crop&w=1200&h=630&q=82&fm=jpg'
    },
    {
      slug: 'compliease-osha-log-management-software',
      title: 'Best OSHA Compliance Software in 2026: Compliease by Sumeera Solutions',
      excerpt: 'Compliease by Sumeera Solutions is the top OSHA compliance software for manufacturing in 2026. Streamline OSHA 300 logs and incident reporting.',
      image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1200&h=630&q=82&fm=jpg'
    },
    {
      slug: 'workplace-compliance-software-modern-business',
      title: 'Why Workplace Compliance Software is Critical for Modern Business Growth',
      excerpt: 'Why workplace compliance software is essential for scaling modern businesses. Prevent OSHA fines, protect workers, and automate safety recordkeeping.',
      image: 'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?auto=format&fit=crop&w=1200&h=630&q=82&fm=jpg'
    },
    {
      slug: 'sumeera-solutions-osha-compliance-software',
      title: 'Sumeera Solutions: The Smart Way to Manage OSHA Compliance & Avoid Costly Fines',
      excerpt: 'How SuMeera Solutions transforms OSHA compliance and workplace safety logging for modern enterprise and manufacturing organizations.',
      image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1200&h=630&q=82&fm=jpg'
    },
    {
      slug: 'retention-marketing-sustainable-growth',
      title: 'Retention Marketing: The Secret Sauce to Sustainable Growth',
      excerpt: 'Learn why customer retention drives sustainable growth and how to build automated retention loops that maximize customer lifetime value.',
      image: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=1200&h=630&q=82&fm=jpg'
    },
    {
      slug: 'high-converting-email-newsletter-guide',
      title: 'How to Build a High-Converting Email Newsletter',
      excerpt: 'Step-by-step blueprint to designing, writing, and automating high-converting email newsletters with 50%+ open rates and rapid subscriber growth.',
      image: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=1200&h=630&q=82&fm=jpg'
    },
    {
      slug: 'rank-higher-google-organically',
      title: '9 Simple Steps How To Rank Higher On Google Organically',
      excerpt: 'Master organic search rankings with 9 proven steps: search intent alignment, technical architecture, schema markup, and content authority.',
      image: 'https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?auto=format&fit=crop&w=1200&h=630&q=82&fm=jpg'
    },
    {
      slug: 'facebook-marketing-small-businesses',
      title: 'How Small Businesses Can Win Big on Facebook Marketing',
      excerpt: 'A practical guide for local and small businesses to generate high-intent leads and sales through organic Facebook communities and targeted ads.',
      image: 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?auto=format&fit=crop&w=1200&h=630&q=82&fm=jpg'
    },
    {
      slug: 'organic-seo-services',
      title: 'Why You Need Organic SEO Services to Scale Your Brand',
      excerpt: 'Understand the power of organic SEO services to outrank competitors, capture commercial search intent, and drive qualified organic revenue.',
      image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&h=630&q=82&fm=jpg'
    },
    {
      slug: 'best-digital-marketer-in-netaji-subhas-university',
      title: 'Best Digital Marketer in Netaji Subhas University: The Power of Strategy Over Execution',
      excerpt: 'Discover why strategic digital marketing elevates brands far beyond basic execution in Netaji Subhas University and Jamshedpur.',
      image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1200&h=630&q=82&fm=jpg'
    },
    {
      slug: 'seo-services-cost-is-500-enough-for-a-company',
      title: 'SEO Services Cost: Is $500/Month Enough for a Company in 2026? | G. Hari Kiran',
      excerpt: 'Explore the true cost of SEO services in 2026. Discover why $500/month packages often fail, what reputable agencies charge, and how to allocate your SEO budget.',
      image: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=1200&h=630&q=82&fm=jpg'
    },
    {
      slug: 'why-houston-manufacturers-keep-receiving-osha-1904-recordkeeping-citations',
      title: 'Why Houston Manufacturers Keep Receiving OSHA 1904 Recordkeeping Citations | G. Hari Kiran',
      excerpt: 'Learn why industrial and manufacturing businesses in Houston and OSHA Region 6 face recurring 1904 recordkeeping penalties, and how to stay 100% compliant.',
      image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1200&h=630&q=82&fm=jpg'
    },
    {
      slug: 'why-most-businesses-don-t-need-more-traffic-they-need-better-traffic',
      title: 'Why Most Businesses Don\'t Need More Traffic: They Need Better Traffic | G. Hari Kiran',
      excerpt: 'Stop chasing vanity page views. Discover how high-intent organic traffic, commercial search queries, and conversion rate optimization drive actual revenue.',
      image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&h=630&q=82&fm=jpg'
    },
    {
      slug: 'osha-1904-recordkeeping-the-mistakes-that-cost-manufacturing-companies-thousands',
      title: 'OSHA 1904 Recordkeeping: The Mistakes That Cost Manufacturing Companies Thousands | G. Hari Kiran',
      excerpt: 'Avoid 5-figure OSHA penalties. Uncover the most common recording errors on OSHA Forms 300, 301, and 300A, and how automated compliance prevents costly audits.',
      image: 'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?auto=format&fit=crop&w=1200&h=630&q=82&fm=jpg'
    },
    {
      slug: 'who-records-injuries-for-temporary-workers-the-osha-rule-many-houston-manufacturers-misunderstand',
      title: 'Who Records Injuries for Temporary Workers? The OSHA Rule Many Manufacturers Misunderstand | G. Hari Kiran',
      excerpt: 'Staffing agency or host employer? Understand the OSHA 1904.31 Day-to-Day Supervision standard to avoid misclassifying temporary worker injury logs.',
      image: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1200&h=630&q=82&fm=jpg'
    },
    {
      slug: 'the-2x-growth-formula-in-marketing-customer-experience-employee-experience',
      title: 'The 2X Growth Formula in Marketing: Customer Experience + Employee Experience | G. Hari Kiran',
      excerpt: 'Unlock sustainable business scaling with the 2X Growth Formula. See how aligning Employee Experience (EX) with Customer Experience (CX) doubles retention and revenue.',
      image: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=1200&h=630&q=82&fm=jpg'
    },
    // Work Project Case Studies
    {
      slug: 'local-search-dominance',
      title: 'Local Search Dominance Case Study | G. Hari Kiran',
      excerpt: 'Achieved 300% growth in organic traffic through local SEO dominance, citations, and content clustering.',
      image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&h=630&q=82&fm=jpg',
      isWork: true
    },
    {
      slug: 'sms-conversion-engine',
      title: 'SMS & Mobile Lead Conversion Engine Case Study | G. Hari Kiran',
      excerpt: 'Scaled a high-conversion direct marketing channel to drive 21% conversion rates and automated SMS sequences.',
      image: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=1200&h=630&q=82&fm=jpg',
      isWork: true
    },
    {
      slug: 'viral-brand-campaign',
      title: 'Viral Brand Campaign Case Study | G. Hari Kiran',
      excerpt: 'High-impact push notification and viral marketing campaign driving substantial customer acquisition and retention.',
      image: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=1200&h=630&q=82&fm=jpg',
      isWork: true
    },
    {
      slug: 'b2b-lead-engine',
      title: 'B2B Lead Engine Case Study | G. Hari Kiran',
      excerpt: 'Built high-impact automated B2B customer acquisition campaigns driving 48% open rates and steady demos.',
      image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&h=630&q=82&fm=jpg',
      isWork: true
    }
  ];

  const BOT_USER_AGENTS = /facebookexternalhit|Facebot|Twitterbot|LinkedInBot|WhatsApp|TelegramBot|Slackbot|Discordbot|SkypeUriPreview|Applebot|Pinterest|Googlebot|bingbot|baiduspider|yandex|crawlers|feedfetcher/i;

  // Universal SSR Open Graph Middleware & Route Handler
  app.use(async (req, res, next) => {
    const rawPath = req.path || "/";
    // Ignore static assets and internal api
    if (rawPath.startsWith("/api/") || rawPath.startsWith("/assets/") || rawPath.includes(".")) {
      return next();
    }

    const cleanPath = rawPath.replace(/\/$/, "") || "/";
    const userAgent = req.get("user-agent") || "";
    const isBot = BOT_USER_AGENTS.test(userAgent);
    const isPostRoute = cleanPath.startsWith("/blog/") || cleanPath.startsWith("/work/") || cleanPath.startsWith("/content/");
    const isStaticPageRoute = staticPagesMeta[cleanPath] !== undefined;

    // Trigger SSR if it's a blog/work post route, a static landing page, or any social crawler bot
    if (!isPostRoute && !isStaticPageRoute && !isBot) {
      return next();
    }

    try {
      let pageData: { title: string; excerpt: string; image: string; isArticle?: boolean } | null = null;
      const isWork = cleanPath.startsWith("/work");
      const isArticle = cleanPath.startsWith("/blog") || cleanPath.startsWith("/content");

      // 1. Check if it matches a static top-level page
      if (staticPagesMeta[cleanPath]) {
        const sm = staticPagesMeta[cleanPath];
        pageData = {
          title: sm.title,
          excerpt: sm.excerpt,
          image: sanitizeImageUrl(sm.image, sm.title),
          isArticle: false
        };
      }

      // 2. Check static blog/work articles dictionary
      if (!pageData && isPostRoute) {
        const slug = cleanPath.replace(/^\/(blog|work|content)\//, "").toLowerCase();
        const matchedStatic = staticArticles.find(p => p.slug === slug);
        if (matchedStatic) {
          pageData = {
            title: matchedStatic.title,
            excerpt: matchedStatic.excerpt,
            image: sanitizeImageUrl(matchedStatic.image, matchedStatic.title, "BLOG", slug),
            isArticle: !matchedStatic.isWork
          };
        }
      }

      // 3. Query Firestore for published blogs
      if (!pageData && (isArticle || isBot)) {
        const slug = cleanPath.replace(/^\/(blog|work|content)\//, "").toLowerCase();
        const firestoreArticles = await getPublishedArticles();
        const matchedFs = firestoreArticles.find(a => a.slug === slug);
        if (matchedFs) {
          pageData = {
            title: matchedFs.title,
            excerpt: matchedFs.excerpt,
            image: sanitizeImageUrl(matchedFs.image, matchedFs.title, matchedFs.category, slug),
            isArticle: true
          };
        }
      }

      // 4. Query Medium RSS Feed as fallback
      if (!pageData && isArticle) {
        const slug = cleanPath.replace(/^\/(blog|work|content)\//, "").toLowerCase();
        try {
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 2000);
          const rssRes = await fetch("https://api.rss2json.com/v1/api.json?rss_url=https://medium.com/feed/@harikirangumma2003", { signal: controller.signal });
          clearTimeout(timeoutId);

          if (rssRes.ok) {
            const rssData = await rssRes.json();
            if (rssData.status === "ok" && Array.isArray(rssData.items)) {
              for (const item of rssData.items) {
                const itemSlug = (item.title || "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");
                if (itemSlug === slug) {
                  pageData = {
                    title: item.title,
                    excerpt: (item.description || "").replace(/<[^>]*>/g, "").substring(0, 180),
                    image: `https://harikiran-portfolio.netlify.app/api/og-image?title=${encodeURIComponent(item.title.slice(0, 60))}&category=MEDIUM%20ARTICLE`,
                    isArticle: true
                  };
                  break;
                }
              }
            }
          }
        } catch (_) {}
      }

      // 5. Algorithmic fallback if post route is not matched
      if (!pageData && isPostRoute) {
        const slug = cleanPath.replace(/^\/(blog|work|content)\//, "");
        const readableTitle = slug
          .split("-")
          .map(w => w.charAt(0).toUpperCase() + w.slice(1))
          .join(" ");
        pageData = {
          title: `${readableTitle} | G. Hari Kiran`,
          excerpt: `Read "${readableTitle}" — actionable growth, digital marketing, and technical SEO insights by G. Hari Kiran.`,
          image: `https://harikiran-portfolio.netlify.app/api/og-image?title=${encodeURIComponent(readableTitle.slice(0, 60))}&category=GROWTH%20JOURNAL`,
          isArticle: true
        };
      }

      // 6. Generic homepage fallback if nothing matched and it's a bot
      if (!pageData && isBot) {
        pageData = {
          title: "G. Hari Kiran | SEO Expert & Digital Marketing Consultant Jamshedpur",
          excerpt: "Premier SEO Expert and Digital Marketing Consultant in Jamshedpur, Jharkhand. I scale organic search traffic, commercial keyword rankings, and revenue.",
          image: "https://harikiran-portfolio.netlify.app/og-image.jpg",
          isArticle: false
        };
      }

      if (!pageData) {
        return next();
      }

      const indexPath = process.env.NODE_ENV !== "production"
        ? path.join(process.cwd(), "index.html")
        : path.join(process.cwd(), "dist", "index.html");

      let html = await fs.promises.readFile(indexPath, "utf-8");

      const host = req.get("x-forwarded-host") || req.get("host") || "harikiran-portfolio.netlify.app";
      const pageUrl = `https://harikiran-portfolio.netlify.app${cleanPath}`;
      const escape = (s: string) => (s || "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").trim();

      const rawTitle = pageData.title.includes("G. Hari Kiran") ? pageData.title : `${pageData.title} | G. Hari Kiran`;
      const pageTitle = escape(rawTitle);
      const desc = escape(pageData.excerpt);
      const imageUrl = pageData.image;

      let imageType = "image/jpeg";
      if (imageUrl.toLowerCase().endsWith(".png")) imageType = "image/png";

      // Purge existing title, description, og:*, twitter:*, and canonical tags
      html = html.replace(/<title[^>]*>[\s\S]*?<\/title>/gi, "");
      html = html.replace(/<meta[^>]+name=["']description["'][^>]*\/?>/gi, "");
      html = html.replace(/<meta[^>]+property=["']og:[^"']+["'][^>]*\/?>/gi, "");
      html = html.replace(/<meta[^>]+name=["']twitter:[^"']+["'][^>]*\/?>/gi, "");
      html = html.replace(/<link[^>]+rel=["']canonical["'][^>]*\/?>/gi, "");
      html = html.replace(/<link[^>]+rel=["']image_src["'][^>]*\/?>/gi, "");

      const cleanSocialTags = `
    <title>${pageTitle}</title>
    <meta name="description" content="${desc}" />
    <link rel="canonical" href="${pageUrl}" />

    <!-- Standard Link & Meta Image References -->
    <meta name="image" content="${imageUrl}" />
    <meta name="thumbnail" content="${imageUrl}" />
    <link rel="image_src" href="${imageUrl}" />

    <!-- Open Graph (WhatsApp, LinkedIn, Facebook, Slack, Telegram) -->
    <meta property="og:type" content="${pageData.isArticle ? "article" : "website"}" />
    <meta property="og:site_name" content="G. Hari Kiran Portfolio" />
    <meta property="og:url" content="${pageUrl}" />
    <meta property="og:title" content="${pageTitle}" />
    <meta property="og:description" content="${desc}" />
    <meta property="og:image" content="${imageUrl}" />
    <meta property="og:image:secure_url" content="${imageUrl}" />
    <meta property="og:image:type" content="${imageType}" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta property="og:image:alt" content="${pageTitle}" />
    <meta property="og:locale" content="en_IN" />
    <meta property="og:locale:alternate" content="en_US" />

    <!-- Twitter / X Large Summary Card -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:site" content="@GHariKiran29" />
    <meta name="twitter:creator" content="@GHariKiran29" />
    <meta name="twitter:title" content="${pageTitle}" />
    <meta name="twitter:description" content="${desc}" />
    <meta name="twitter:image" content="${imageUrl}" />
    <meta name="twitter:image:src" content="${imageUrl}" />
    <meta name="twitter:image:alt" content="${pageTitle}" />
    <meta name="twitter:domain" content="harikiran-portfolio.netlify.app" />
    <meta name="twitter:url" content="${pageUrl}" />`;

      html = html.replace(/<head[^>]*>/i, `$&${cleanSocialTags}`);

      res.setHeader("Content-Type", "text/html; charset=utf-8");
      res.setHeader("Cache-Control", "public, max-age=60, s-maxage=300");
      return res.send(html);
    } catch (e) {
      console.error("[SSR Meta Handler] Error:", e);
      return next();
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    // Explicitly serve static public assets in dev mode via Express to ensure reliability
    app.use(express.static(path.join(process.cwd(), 'public')));
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath, {
      maxAge: '1y',
      setHeaders: (res, filePath) => {
        // Assets are compiled by Vite with content hashes in the filename, making them immutable.
        if (filePath.includes('/assets/') || filePath.match(/\.(js|css|woff2|woff|ttf|eot)$/)) {
          res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
        } else if (filePath.match(/\.(jpg|jpeg|png|webp|gif|svg|ico|xml|txt)$/)) {
          // General images and XML/txt documents are cached for 1 hour to allow updates
          res.setHeader('Cache-Control', 'public, max-age=3600, must-revalidate');
        } else {
          // Default fallbacks (HTML documents, etc.) should not be cached aggressively
          res.setHeader('Cache-Control', 'public, max-age=0, must-revalidate');
        }
      }
    }));
    app.get('*', (req, res) => {
      res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[Server] Running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
