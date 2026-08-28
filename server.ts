import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";

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

  // Dynamic SSR Open Graph & Twitter Card Meta Tag Handler for /blog/:slug
  app.get("/blog/:slug", async (req, res, next) => {
    const { slug } = req.params;
    try {
      let postMeta: { title: string; excerpt: string; image: string; slug: string } | null = null;

      // 1. Static posts lookup
      const staticList = [
        {
          slug: 'technical-seo-checklist-2026-audit-before-ranking',
          title: 'Technical SEO Checklist for 2026: 25 Things Every Website Should Audit Before Ranking',
          excerpt: 'Actionable 25-point technical SEO checklist for 2026. Audit Core Web Vitals INP, AI Bot crawling, canonical integrity, and crawl budget to rank #1.',
          image: 'https://images.unsplash.com/photo-1507925921958-8a62f3d1a50d?auto=format,compress&q=80&w=1200&fm=webp'
        },
        {
          slug: 'compliease-osha-log-management-software',
          title: 'Best OSHA Compliance Software in 2026: Compliease by Sumeera Solutions',
          excerpt: 'Compliease by Sumeera Solutions is the top OSHA compliance software for manufacturing in 2026. Streamline OSHA 300 logs and incident reporting.',
          image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format,compress&q=70&w=1200&fm=webp'
        },
        {
          slug: 'workplace-compliance-software-modern-business',
          title: 'Why Workplace Compliance Software is Critical for Modern Business Growth',
          excerpt: 'Why workplace compliance software is essential for scaling modern businesses. Prevent OSHA fines, protect workers, and automate safety recordkeeping.',
          image: 'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?auto=format,compress&q=70&w=1200&fm=webp'
        },
        {
          slug: 'sumeera-solutions-osha-compliance-software',
          title: 'Sumeera Solutions: The Smart Way to Manage OSHA Compliance & Avoid Costly Fines',
          excerpt: 'How SuMeera Solutions transforms OSHA compliance and workplace safety logging for modern enterprise and manufacturing organizations.',
          image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format,compress&q=70&w=1200&fm=webp'
        },
        {
          slug: 'retention-marketing-sustainable-growth',
          title: 'Retention Marketing: The Secret Sauce to Sustainable Growth',
          excerpt: 'Learn why customer retention drives sustainable growth and how to build automated retention loops that maximize customer lifetime value.',
          image: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format,compress&q=70&w=1200&fm=webp'
        },
        {
          slug: 'high-converting-email-newsletter-guide',
          title: 'How to Build a High-Converting Email Newsletter',
          excerpt: 'Step-by-step blueprint to designing, writing, and automating high-converting email newsletters with 50%+ open rates and rapid subscriber growth.',
          image: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format,compress&q=70&w=1200&fm=webp'
        },
        {
          slug: 'rank-higher-google-organically',
          title: '9 Simple Steps How To Rank Higher On Google Organically',
          excerpt: 'Master organic search rankings with 9 proven steps: search intent alignment, technical architecture, schema markup, and content authority.',
          image: 'https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?auto=format,compress&q=70&w=1200&fm=webp'
        },
        {
          slug: 'facebook-marketing-small-businesses',
          title: 'How Small Businesses Can Win Big on Facebook Marketing',
          excerpt: 'A practical guide for local and small businesses to generate high-intent leads and sales through organic Facebook communities and targeted ads.',
          image: 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?auto=format,compress&q=70&w=1200&fm=webp'
        },
        {
          slug: 'organic-seo-services',
          title: 'Why You Need Organic SEO Services to Scale Your Brand',
          excerpt: 'Understand the power of organic SEO services to outrank competitors, capture commercial search intent, and drive qualified organic revenue.',
          image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format,compress&q=70&w=1200&fm=webp'
        },
        {
          slug: 'best-digital-marketer-in-netaji-subhas-university',
          title: 'Best Digital Marketer in Netaji Subhas University: The Power of Strategy Over Execution',
          excerpt: 'Discover why strategic digital marketing elevates brands far beyond basic execution in Netaji Subhas University and Jamshedpur.',
          image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format,compress&q=70&w=1200&fm=webp'
        }
      ];

      const matchedStatic = staticList.find(p => p.slug === slug || p.slug.toLowerCase() === slug.toLowerCase());
      if (matchedStatic) {
        postMeta = matchedStatic;
      }

      // 2. If not found in static list, query Firestore REST API
      if (!postMeta) {
        try {
          const projectId = "ai-studio-39fdbe7e-0650-402d-8291-ceb99e0322a0";
          const firestoreUrl = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/content`;
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 2000);
          
          const fsRes = await fetch(firestoreUrl, { signal: controller.signal });
          clearTimeout(timeoutId);

          if (fsRes.ok) {
            const fsData = await fsRes.json();
            if (Array.isArray(fsData.documents)) {
              for (const doc of fsData.documents) {
                const fields = doc.fields || {};
                const title = fields.title?.stringValue || "";
                const metaTitle = fields.metaTitle?.stringValue || title;
                const excerpt = fields.excerpt?.stringValue || fields.metaDescription?.stringValue || fields.description?.stringValue || "";
                const thumbnail = fields.thumbnail?.stringValue || "";
                const ogImage = fields.ogImage?.stringValue || thumbnail;
                const canonicalUrl = fields.canonicalUrl?.stringValue || "";
                const url = fields.url?.stringValue || "";

                let postSlug = canonicalUrl ? canonicalUrl.replace(/^.*\/blog\//, "") : "";
                if (!postSlug) {
                  postSlug = url ? url.replace(/^.*\/blog\//, "") : title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");
                }

                if (postSlug.toLowerCase() === slug.toLowerCase()) {
                  postMeta = {
                    title: metaTitle || title,
                    excerpt: (excerpt || "").replace(/<[^>]*>/g, "").substring(0, 180),
                    image: ogImage || thumbnail || "https://images.unsplash.com/photo-1507925921958-8a62f3d1a50d?auto=format,compress&q=80&w=1200&fm=webp",
                    slug: postSlug
                  };
                  break;
                }
              }
            }
          }
        } catch (fsErr) {
          console.warn("[SSR Meta] Firestore query skipped:", fsErr);
        }
      }

      const indexPath = process.env.NODE_ENV !== "production"
        ? path.join(process.cwd(), "index.html")
        : path.join(process.cwd(), "dist", "index.html");

      const fs = await import("fs");
      let html = await fs.promises.readFile(indexPath, "utf-8");

      if (postMeta) {
        const escape = (s: string) => (s || "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
        const pageTitle = `${escape(postMeta.title)} | G. Hari Kiran`;
        const desc = escape(postMeta.excerpt);
        const img = postMeta.image;
        const pageUrl = `https://harikiran-portfolio.netlify.app/blog/${postMeta.slug}`;

        html = html.replace(/<title[^>]*>[\s\S]*?<\/title>/i, `<title data-react-helmet="true">${pageTitle}</title>`);
        html = html.replace(/<meta\s+data-react-helmet="true"\s+name="description"\s+content="[^"]*"\s*\/?>/i, `<meta data-react-helmet="true" name="description" content="${desc}" />`);
        html = html.replace(/<meta\s+data-react-helmet="true"\s+property="og:title"\s+content="[^"]*"\s*\/?>/i, `<meta data-react-helmet="true" property="og:title" content="${escape(postMeta.title)}" />`);
        html = html.replace(/<meta\s+data-react-helmet="true"\s+property="og:description"\s+content="[^"]*"\s*\/?>/i, `<meta data-react-helmet="true" property="og:description" content="${desc}" />`);
        html = html.replace(/<meta\s+data-react-helmet="true"\s+property="og:image"\s+content="[^"]*"\s*\/?>/i, `<meta data-react-helmet="true" property="og:image" content="${img}" />`);
        html = html.replace(/<meta\s+data-react-helmet="true"\s+property="og:image:secure_url"\s+content="[^"]*"\s*\/?>/i, `<meta data-react-helmet="true" property="og:image:secure_url" content="${img}" />`);
        html = html.replace(/<meta\s+data-react-helmet="true"\s+property="og:url"\s+content="[^"]*"\s*\/?>/i, `<meta data-react-helmet="true" property="og:url" content="${pageUrl}" />`);

        const twitterTags = `
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:site" content="@GHariKiran29" />
    <meta name="twitter:creator" content="@GHariKiran29" />
    <meta name="twitter:title" content="${escape(postMeta.title)}" />
    <meta name="twitter:description" content="${desc}" />
    <meta name="twitter:image" content="${img}" />
    <meta name="twitter:url" content="${pageUrl}" />`;

        html = html.replace("</head>", `${twitterTags}\n  </head>`);
      }

      res.setHeader("Content-Type", "text/html; charset=utf-8");
      res.send(html);
    } catch (e) {
      next();
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
