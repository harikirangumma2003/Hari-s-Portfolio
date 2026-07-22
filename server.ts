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
