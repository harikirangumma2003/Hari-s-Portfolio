import { useState, useEffect } from "react";
import { 
  User, 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  signOut,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider
} from "firebase/auth";
import { auth } from "../lib/firebase";

export interface UseAdminAuthResult {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<User>;
  loginWithGoogle: () => Promise<User>;
  loginAsAdminDirect: (password?: string) => Promise<User>;
  logout: () => Promise<void>;
  registerTemp: (email: string, password: string) => Promise<User>;
}

export function useAdminAuth(): UseAdminAuthResult {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check if there's an active verified admin session with password
    const savedAdminToken = sessionStorage.getItem("admin_cms_password_token") || localStorage.getItem("admin_cms_password_token");
    if (savedAdminToken === "Hari2026") {
      setUser({
        uid: "admin-fallback-id",
        email: "harikirangumma2003@gmail.com",
        displayName: "G. Hari Kiran",
        photoURL: "https://i.postimg.cc/d1MxW0j1/Hari-Portfolio.png"
      } as unknown as User);
      setLoading(false);
      return;
    } else {
      // Clear legacy or unverified fallback tokens
      localStorage.removeItem("portfolio_admin_fallback");
      localStorage.removeItem("admin_cms_password_token");
      sessionStorage.removeItem("admin_cms_password_token");
    }

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      // If we have a real Firebase user, prioritize it
      if (currentUser) {
        setUser(currentUser);
      }
      setLoading(false);
    }, (err) => {
      console.error("Auth state change error:", err);
      setError(err.message);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const loginWithGoogle = async (): Promise<User> => {
    setError(null);
    try {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: 'select_account' });
      const credential = await signInWithPopup(auth, provider);
      localStorage.removeItem("portfolio_admin_fallback");
      setUser(credential.user);
      return credential.user;
    } catch (err: any) {
      console.error("Google sign-in failed:", err);
      const msg = err.code === "auth/popup-closed-by-user"
        ? "Sign-in popup was closed. Please try again or use direct admin access."
        : err.message || "Google sign-in failed.";
      setError(msg);
      throw new Error(msg);
    }
  };

  const loginAsAdminDirect = async (password?: string): Promise<User> => {
    setError(null);
    if (!password || password.trim() !== "Hari2026") {
      const msg = "Incorrect administrator password. Access denied.";
      setError(msg);
      throw new Error(msg);
    }
    sessionStorage.setItem("admin_cms_password_token", "Hari2026");
    localStorage.setItem("admin_cms_password_token", "Hari2026");
    localStorage.setItem("portfolio_admin_fallback", "true");
    const fallbackUser = {
      uid: "admin-fallback-id",
      email: "harikirangumma2003@gmail.com",
      displayName: "G. Hari Kiran",
      photoURL: "https://i.postimg.cc/d1MxW0j1/Hari-Portfolio.png"
    } as unknown as User;
    setUser(fallbackUser);
    return fallbackUser;
  };

  const login = async (email: string, password: string): Promise<User> => {
    setError(null);
    // If the provided password matches the master admin password
    if (password.trim() === "Hari2026") {
      return loginAsAdminDirect("Hari2026");
    }

    try {
      const credential = await signInWithEmailAndPassword(auth, email, password);
      sessionStorage.setItem("admin_cms_password_token", "Hari2026");
      localStorage.setItem("admin_cms_password_token", "Hari2026");
      localStorage.removeItem("portfolio_admin_fallback");
      return credential.user;
    } catch (err: any) {
      console.error("Firebase Login failed:", err);
      const msg = "Incorrect password or credentials. Access denied.";
      setError(msg);
      throw new Error(msg);
    }
  };

  const logout = async (): Promise<void> => {
    setError(null);
    try {
      sessionStorage.removeItem("admin_cms_password_token");
      localStorage.removeItem("admin_cms_password_token");
      localStorage.removeItem("portfolio_admin_fallback");
      await signOut(auth);
      setUser(null);
    } catch (err: any) {
      console.error("Logout failed:", err);
      setError(err.message || "Failed to log out.");
      throw err;
    }
  };

  const registerTemp = async (email: string, password: string): Promise<User> => {
    setError(null);
    if (password.trim() === "Hari2026") {
      return loginAsAdminDirect("Hari2026");
    }

    try {
      const credential = await createUserWithEmailAndPassword(auth, email, password);
      sessionStorage.setItem("admin_cms_password_token", "Hari2026");
      localStorage.setItem("admin_cms_password_token", "Hari2026");
      return credential.user;
    } catch (err: any) {
      console.error("Registration failed:", err);
      const msg = "Failed to create account. Please ensure correct administrator password is provided.";
      setError(msg);
      throw new Error(msg);
    }
  };

  return {
    user,
    loading,
    error,
    login,
    loginWithGoogle,
    loginAsAdminDirect,
    logout,
    registerTemp
  };
}
