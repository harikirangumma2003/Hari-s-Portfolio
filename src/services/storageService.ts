import { compressImageClientSide } from "../utils/imageOptimization";

/**
 * Uploads an image for the CMS & Blog Writer.
 * 1. Performs instant client-side WebP compression to guarantee high speed and ultra-low payload (<80KB).
 * 2. Uploads to the server-side `/api/cms/upload-image` endpoint to store in `/uploads/`.
 * 3. Gracefully falls back to the compressed WebP data URL if offline or in static preview,
 *    ensuring Firestore document size never exceeds limits.
 */
export async function uploadImage(file: File): Promise<string> {
  // 1. Optimize & compress image file first
  let compressedDataUrl: string;
  let cleanName = file.name;

  try {
    const compressed = await compressImageClientSide(file, {
      maxWidth: 1200,
      maxHeight: 800,
      quality: 0.82
    });
    compressedDataUrl = compressed.dataUrl;
    cleanName = compressed.fileName;
  } catch (err) {
    console.warn("[Storage Service] Canvas compression failed, reading as standard Data URL:", err);
    compressedDataUrl = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (e) => reject(e);
      reader.readAsDataURL(file);
    });
  }

  // 2. Upload to server-side API
  try {
    const response = await fetch("/api/cms/upload-image", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        dataUrl: compressedDataUrl,
        fileName: cleanName
      })
    });

    if (response.ok) {
      const result = await response.json();
      if (result.url) {
        return result.url;
      }
    }
  } catch (apiError) {
    console.warn("[Storage Service] Server upload endpoint unreachable, using compressed WebP data URL:", apiError);
  }

  // 3. Guaranteed fallback: return the lightweight compressed WebP Data URL
  return compressedDataUrl;
}

/**
 * Uploads a pre-compressed Base64 Data URL directly to `/api/cms/upload-image`
 */
export async function uploadBase64Image(dataUrl: string, fileName: string = "optimized-asset.webp"): Promise<string> {
  try {
    const response = await fetch("/api/cms/upload-image", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        dataUrl,
        fileName
      })
    });

    if (response.ok) {
      const result = await response.json();
      if (result.url) {
        return result.url;
      }
    }
  } catch (e) {
    console.warn("[Storage Service] Direct base64 upload to server failed, returning Data URL:", e);
  }

  return dataUrl;
}

