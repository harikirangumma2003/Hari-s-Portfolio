import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";

async function startServer() {
  const app = express();
  const PORT = 3000;

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
