import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';

interface SEOProps {
  title: string;
  description: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'profile';
  articleData?: {
    publishedTime: string;
    modifiedTime?: string;
    author?: string;
    section?: string;
    tags?: string[];
  };
  schemaData?: object;
  noindex?: boolean;
  canonical?: string;
}

export const SEO: React.FC<SEOProps> = ({ 
  title, 
  description, 
  image, 
  url, 
  type = 'website',
  articleData,
  schemaData,
  noindex = false,
  canonical
}) => {
  const location = useLocation();
  const siteName = "G. Hari Kiran";
  
  // Format title without over-extending length beyond 60 chars
  let fullTitle = title.trim();
  if (!fullTitle.includes("Hari Kiran") && !fullTitle.includes("G. Hari Kiran")) {
    if (fullTitle.length <= 42) {
      fullTitle = `${fullTitle} | ${siteName}`;
    }
  }
  
  const defaultImage = "https://harikiran-portfolio.netlify.app/og-image.jpg";
  const siteUrl = "https://harikiran-portfolio.netlify.app";

  // Determine absolute image URL with strict social platform compatibility (JPEG/PNG, 1200x630, <300KB)
  let rawImage = image || defaultImage;
  let ogImage = rawImage.startsWith('http') 
    ? rawImage 
    : `${siteUrl}${rawImage.startsWith('/') ? '' : '/'}${rawImage}`;

  // Optimize Unsplash images for social crawlers (force JPEG and 1200x630 aspect ratio)
  if (ogImage.includes('images.unsplash.com')) {
    ogImage = ogImage.replace(/[?&]fm=webp/g, '').replace(/fm=webp&?/g, '');
    if (!ogImage.includes('fm=jpg') && !ogImage.includes('fm=png')) {
      ogImage += (ogImage.includes('?') ? '&' : '?') + 'fm=jpg';
    }
    if (!ogImage.includes('w=1200')) {
      ogImage += '&fit=crop&w=1200&h=630&q=82';
    }
  }

  // Clean trailing dots or trailing punctuation from CDN urls (e.g. Medium CDN edge cases)
  ogImage = ogImage.replace(/\.+$/, '');

  // Determine image mime type - strictly prioritize image/jpeg or image/png for universal WhatsApp/LinkedIn/Twitter support
  let imageType = "image/jpeg";
  if (ogImage.toLowerCase().endsWith(".png")) {
    imageType = "image/png";
  } else if (ogImage.toLowerCase().endsWith(".gif")) {
    imageType = "image/gif";
  } else {
    imageType = "image/jpeg";
  }

  // Determine precise canonical URL dynamically matching Netlify server canonical format
  const path = url !== undefined ? url : location.pathname;
  let cleanPath = path.toLowerCase();
  if (cleanPath.includes('://')) {
    try {
      cleanPath = new URL(cleanPath).pathname;
    } catch (e) {
      const index = cleanPath.indexOf('/', cleanPath.indexOf('://') + 3);
      cleanPath = index !== -1 ? cleanPath.substring(index) : '/';
    }
  }
  if (!cleanPath.startsWith('/')) {
    cleanPath = `/${cleanPath}`;
  }
  // Enforce canonical trailing slash to prevent Netlify 301 canonical redirects
  const normalizedPath = cleanPath.endsWith('/') ? cleanPath : `${cleanPath}/`;
  const pageUrl = `${siteUrl}${normalizedPath === '//' ? '/' : normalizedPath}`;
  const canonicalUrl = canonical || pageUrl;

  // Medium CDN and third-party URLs block social scrapers (returning 405 Method Not Allowed)
  // For blog posts, route through our pre-optimized 1200x630 local assets or proxy endpoint
  const blogMatch = cleanPath.match(/^\/blog\/([^/]+)/);
  if (blogMatch && blogMatch[1]) {
    const postSlug = blogMatch[1];
    if (ogImage.includes('medium.com') || ogImage.includes('cdn-images-1.medium.com') || ogImage === defaultImage) {
      ogImage = `${siteUrl}/assets/blog-covers/${postSlug}.jpg`;
    }
  } else if (ogImage.includes('medium.com') || ogImage.includes('cdn-images-1.medium.com')) {
    ogImage = `${siteUrl}/api/proxy/image?url=${encodeURIComponent(ogImage)}`;
  }

  return (
    <Helmet>
      {/* Robots Directive */}
      {noindex ? (
        <meta name="robots" content="noindex, nofollow" />
      ) : (
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
      )}

      {/* Basic Metadata */}
      <title>{fullTitle}</title>
      <meta name="description" content={description.trim()} />
      <meta name="author" content="G. Hari Kiran" />
      <meta name="application-name" content="G. Hari Kiran Portfolio" />
      <meta name="apple-mobile-web-app-title" content="G. Hari Kiran" />
      <link rel="canonical" href={canonicalUrl} />

      {/* AI Bot & LLM Autodiscovery Standards */}
      <link rel="alternate" type="text/plain" title="LLM Knowledge Graph Summary" href="/llms.txt" />
      <link rel="alternate" type="text/plain" title="Full LLM Knowledge Base" href="/llms-full.txt" />

      {/* AI & Citation Metadata */}
      <meta name="citation_author" content="G. Hari Kiran" />
      <meta name="citation_title" content={fullTitle} />
      <meta name="ai-content-declaration" content="human-authored-expert-verified" />

      {/* Geotagging / GEO & Local SEO Visibility */}
      <meta name="geo.region" content="IN-JH" />
      <meta name="geo.placename" content="Jamshedpur, Jharkhand, India" />
      <meta name="geo.position" content="22.804566;86.202875" />
      <meta name="ICBM" content="22.804566, 86.202875" />

      {/* Dublin Core Metadata */}
      <meta name="DC.title" content={fullTitle} />
      <meta name="DC.creator" content="G. Hari Kiran" />
      <meta name="DC.description" content={description} />
      <meta name="DC.publisher" content="G. Hari Kiran" />
      <meta name="DC.language" content="en" />
      <meta name="DC.coverage" content="Jamshedpur, Jharkhand, India" />

      {/* Complete Open Graph / Facebook / LinkedIn / WhatsApp */}
      <meta name="image" content={ogImage} />
      <meta name="thumbnail" content={ogImage} />
      <link rel="image_src" href={ogImage} />
      <meta property="og:type" content={type} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:image:secure_url" content={ogImage} />
      <meta property="og:image:type" content={imageType} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content={fullTitle} />
      <meta property="og:url" content={pageUrl} />
      <meta property="og:site_name" content={siteName} />
      <meta property="og:locale" content="en_IN" />
      <meta property="og:locale:alternate" content="en_US" />
      <meta property="og:updated_time" content={articleData?.modifiedTime || articleData?.publishedTime || "2026-07-30T00:00:00Z"} />

      {/* Profile Open Graph Attributes */}
      <meta property="profile:first_name" content="Hari Kiran" />
      <meta property="profile:last_name" content="Gumma" />
      <meta property="profile:username" content="GHariKiran29" />

      {/* Twitter / X Meta Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@GHariKiran29" />
      <meta name="twitter:creator" content="@GHariKiran29" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
      <meta name="twitter:image:src" content={ogImage} />
      <meta name="twitter:image:alt" content={fullTitle} />
      <meta name="twitter:domain" content="harikiran-portfolio.netlify.app" />
      <meta name="twitter:url" content={pageUrl} />

      {/* Article Specific Open Graph Attributes */}
      {type === 'article' && articleData && (
        <>
          <meta property="article:published_time" content={articleData.publishedTime} />
          {articleData.modifiedTime && <meta property="article:modified_time" content={articleData.modifiedTime} />}
          <meta property="article:author" content={articleData.author || "G. Hari Kiran"} />
          <meta property="article:publisher" content="https://harikiran-portfolio.netlify.app" />
          {articleData.section && <meta property="article:section" content={articleData.section} />}
          {articleData.tags && articleData.tags.map(tag => (
            <meta key={tag} property="article:tag" content={tag} />
          ))}
        </>
      )}

      {/* JSON-LD Schema Markup */}
      {schemaData && (
        <script type="application/ld+json">
          {JSON.stringify(schemaData)}
        </script>
      )}
    </Helmet>
  );
};
