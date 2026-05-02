import React from "react";
import Navbar from "./Navbar";
import { Footer } from "./ContactFooter";
import { BackToTop } from "./BackToTop";

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="flex flex-col min-h-screen">
      <a 
        href="#main-content" 
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:px-6 focus:py-3 focus:bg-accent focus:text-white focus:rounded-xl focus:font-black focus:uppercase focus:text-xs focus:tracking-widest shadow-2xl"
      >
        Skip to content
      </a>
      <Navbar />
      <main id="main-content" className="flex-grow">
        {children}
      </main>
      <Footer />
      <BackToTop />
    </div>
  );
};
