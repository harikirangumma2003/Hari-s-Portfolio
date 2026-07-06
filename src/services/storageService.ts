import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../lib/firebase";

/**
 * Uploads a file to Firebase Storage under the 'content-images' directory
 * and returns the public download URL.
 * Includes a graceful fallback to a Base64 data URL if the Storage bucket is not yet
 * provisioned or throws permission errors.
 */
export async function uploadImage(file: File): Promise<string> {
  try {
    // 1. Clean the filename to prevent spaces or weird character issues in Firebase URLs
    const cleanFileName = file.name.replace(/[^a-zA-Z0-9.]/g, "_");
    const uniquePath = `content-images/${Date.now()}_${cleanFileName}`;
    const imageRef = ref(storage, uniquePath);
    
    // 2. Perform the upload
    const snapshot = await uploadBytes(imageRef, file);
    
    // 3. Get download URL
    const downloadURL = await getDownloadURL(snapshot.ref);
    return downloadURL;
  } catch (error: any) {
    console.warn("Firebase Storage upload failed, falling back to Base64 file reader:", error);
    
    // Safe robust fallback: Read as Base64 data URL so the CMS can still work offline
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === "string") {
          resolve(reader.result);
        } else {
          reject(new Error("Failed to convert image to Base64"));
        }
      };
      reader.onerror = (err) => reject(err);
      reader.readAsDataURL(file);
    });
  }
}
