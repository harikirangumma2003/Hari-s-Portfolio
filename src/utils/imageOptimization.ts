/**
 * Automated WebP/AVIF Image Optimization Pipeline
 * Converts PNG, JPEG, and external URLs to modern high-performance WebP formats
 * with aspect-ratio preservation, metadata reduction, and compression metrics.
 */

export interface ImageOptimizationResult {
  dataUrl: string;
  blob: Blob;
  originalSize: number; // in bytes
  optimizedSize: number; // in bytes
  savingsPercentage: number; // e.g. 84.5%
  width: number;
  height: number;
  format: 'image/webp' | 'image/avif' | 'image/jpeg';
  fileName: string;
}

export interface ImageOptimizationOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number; // 0.1 to 1.0, default 0.82
  targetFormat?: 'image/webp' | 'image/avif' | 'image/jpeg';
  forceOgAspect?: boolean; // 1200x630 OpenGraph ratio
}

/**
 * Optimizes a File object into compressed modern WebP
 */
export async function optimizeImageFile(
  file: File,
  options: ImageOptimizationOptions = {}
): Promise<ImageOptimizationResult> {
  const {
    maxWidth = 1600,
    maxHeight = 1200,
    quality = 0.82,
    targetFormat = 'image/webp',
    forceOgAspect = false
  } = options;

  const originalSize = file.size;

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("Failed to read image file"));
    reader.onload = (e) => {
      const img = new window.Image();
      img.onerror = () => reject(new Error("Invalid image format or corrupted file"));
      img.onload = () => {
        try {
          const result = processCanvasOptimization(img, originalSize, file.name, {
            maxWidth,
            maxHeight,
            quality,
            targetFormat,
            forceOgAspect
          });
          resolve(result);
        } catch (err) {
          reject(err);
        }
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  });
}

/**
 * Optimizes an image from a URL by loading into an HTML Image element
 */
export async function optimizeImageUrl(
  imageUrl: string,
  options: ImageOptimizationOptions = {}
): Promise<ImageOptimizationResult> {
  const {
    maxWidth = 1600,
    maxHeight = 1200,
    quality = 0.82,
    targetFormat = 'image/webp',
    forceOgAspect = false
  } = options;

  return new Promise((resolve, reject) => {
    const img = new window.Image();
    img.crossOrigin = "anonymous";
    img.onerror = () => reject(new Error("Failed to fetch or load external image. CORS restrictions may apply."));
    img.onload = () => {
      try {
        const estimatedOriginalSize = 1024 * 1024; // fallback estimate 1MB
        const cleanName = imageUrl.split('/').pop()?.split('?')[0] || "optimized-image.webp";
        const result = processCanvasOptimization(img, estimatedOriginalSize, cleanName, {
          maxWidth,
          maxHeight,
          quality,
          targetFormat,
          forceOgAspect
        });
        resolve(result);
      } catch (err) {
        reject(err);
      }
    };
    img.src = imageUrl;
  });
}

/**
 * Internal canvas processor for WebP compression
 */
function processCanvasOptimization(
  img: HTMLImageElement,
  originalSize: number,
  sourceName: string,
  options: ImageOptimizationOptions
): ImageOptimizationResult {
  const {
    maxWidth = 1600,
    maxHeight = 1200,
    quality = 0.82,
    targetFormat = 'image/webp',
    forceOgAspect = false
  } = options;

  let targetWidth = img.naturalWidth || img.width;
  let targetHeight = img.naturalHeight || img.height;

  if (forceOgAspect) {
    targetWidth = 1200;
    targetHeight = 630;
  } else {
    // Proportional resize if exceeds limits
    if (targetWidth > maxWidth) {
      targetHeight = Math.round((targetHeight * maxWidth) / targetWidth);
      targetWidth = maxWidth;
    }
    if (targetHeight > maxHeight) {
      targetWidth = Math.round((targetWidth * maxHeight) / targetHeight);
      targetHeight = maxHeight;
    }
  }

  const canvas = document.createElement("canvas");
  canvas.width = targetWidth;
  canvas.height = targetHeight;
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    throw new Error("Unable to create HTML5 canvas 2D rendering context");
  }

  // Smooth image scaling
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";

  if (forceOgAspect) {
    // Fill background neutral and draw cover center
    ctx.fillStyle = "#09090b";
    ctx.fillRect(0, 0, targetWidth, targetHeight);

    const hRatio = targetWidth / img.width;
    const vRatio = targetHeight / img.height;
    const ratio = Math.max(hRatio, vRatio);
    const centerShiftX = (targetWidth - img.width * ratio) / 2;
    const centerShiftY = (targetHeight - img.height * ratio) / 2;

    ctx.drawImage(
      img,
      0, 0, img.width, img.height,
      centerShiftX, centerShiftY, img.width * ratio, img.height * ratio
    );
  } else {
    ctx.drawImage(img, 0, 0, targetWidth, targetHeight);
  }

  const format = targetFormat;
  const dataUrl = canvas.toDataURL(format, quality);

  // Calculate binary size from Base64
  const base64Data = dataUrl.split(',')[1] || "";
  const optimizedSize = Math.round((base64Data.length * 3) / 4);

  const savingsPercentage = originalSize > 0
    ? Math.max(0, Number((((originalSize - optimizedSize) / originalSize) * 100).toFixed(1)))
    : 0;

  const cleanBaseName = sourceName.replace(/\.[^/.]+$/, "");
  const outputFileName = `${cleanBaseName}.webp`;

  // Create Blob
  const byteString = atob(base64Data);
  const ab = new ArrayBuffer(byteString.length);
  const ia = new Uint8Array(ab);
  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }
  const blob = new Blob([ab], { type: format });

  return {
    dataUrl,
    blob,
    originalSize,
    optimizedSize,
    savingsPercentage,
    width: targetWidth,
    height: targetHeight,
    format,
    fileName: outputFileName
  };
}

/**
 * Format bytes into human readable string (KB / MB)
 */
export function formatBytes(bytes: number, decimals: number = 1): string {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
}
