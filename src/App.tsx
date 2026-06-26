/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, Suspense } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "motion/react";
import { HelmetProvider } from "react-helmet-async";
import { Layout } from "./components/Layout";

// Lazily load pages for code-splitting and drastically reduced initial JS bundle size
const HomePage = React.lazy(() => import("./pages/HomePage"));
const WorkPage = React.lazy(() => import("./pages/WorkPage"));
const AboutPage = React.lazy(() => import("./pages/AboutPage"));
const ExperiencePage = React.lazy(() => import("./pages/ExperiencePage"));
const BlogPage = React.lazy(() => import("./pages/BlogPage"));
const BlogPostPage = React.lazy(() => import("./pages/BlogPostPage"));
const ProjectDetailPage = React.lazy(() => import("./pages/ProjectDetailPage"));
const ContactPage = React.lazy(() => import("./pages/ContactPage"));
const PartnersPage = React.lazy(() => import("./pages/PartnersPage"));
const SEODashboardPage = React.lazy(() => import("./pages/SEODashboardPage"));
const NotFoundPage = React.lazy(() => import("./pages/NotFoundPage"));

// Ultra-lightweight loading skeleton/spinner to minimize main-thread work during loads
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-[60vh]" id="page-loader">
    <div className="w-8 h-8 border-2 border-primary/20 border-t-primary rounded-full animate-spin" />
  </div>
);

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

const PageTransition = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};

export default function App() {
  return (
    <HelmetProvider>
      <Router>
        <div className="noise-overlay" />
        <ScrollToTop />
        <Layout>
          <PageTransition>
            <Suspense fallback={<PageLoader />}>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/work" element={<WorkPage />} />
                <Route path="/work/:slug" element={<ProjectDetailPage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/experience" element={<ExperiencePage />} />
                <Route path="/blog" element={<BlogPage />} />
                <Route path="/blog/:slug" element={<BlogPostPage />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="/partners" element={<PartnersPage />} />
                <Route path="/seo-audit" element={<SEODashboardPage />} />
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </Suspense>
          </PageTransition>
        </Layout>
      </Router>
    </HelmetProvider>
  );
}
