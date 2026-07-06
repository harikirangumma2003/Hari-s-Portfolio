import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../../lib/firebase";

export class DuplicateDetector {
  /**
   * Checks if an item from a platform already exists in Firestore by looking up its external ID.
   * Returns the existing document's ID if found, or null if it's a new document.
   */
  static async check(platformKey: string, externalId: string): Promise<string | null> {
    const contentRef = collection(db, "content");
    const q = query(contentRef, where(`externalIds.${platformKey}`, "==", externalId));
    
    try {
      const snapshot = await getDocs(q);
      if (!snapshot.empty) {
        // Return the ID of the first match
        return snapshot.docs[0].id;
      }
    } catch (err) {
      console.error(`Error checking duplicates for ${platformKey}:${externalId}`, err);
    }
    
    return null;
  }
}
