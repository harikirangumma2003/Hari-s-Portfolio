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
  const siteName = "G. Hari Kiran Portfolio";
  const fullTitle = title.includes("G. Hari Kiran") ? title : `${title} | ${siteName}`;
  const defaultImage = "https://harikiran-portfolio.netlify.app/og-image.jpg";
  const siteUrl = "https://harikiran-portfolio.netlify.app";

  // Determine absolute image URL
  const ogImage = image 
    ? (image.startsWith('http') ? image : `${siteUrl}${image.startsWith('/') ? '' : '/'}${image}`) 
    : defaultImage;

  // Determine image mime type
  let imageType = "image/jpeg";
  if (ogImage.endsWith(".png")) {
    imageType = "image/png";
  } else if (ogImage.endsWith(".webp")) {
    imageType = "image/webp";
  } else if (ogImage.endsWith(".svg")) {
    imageType = "image/svg+xml";
  }

  // Determine precise canonical URL dynamically
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
  if (cleanPath.endsWith('/') && cleanPath.length > 1) {
    cleanPath = cleanPath.slice(0, -1);
  }
  const canonicalUrl = canonical || (cleanPath === '/' ? siteUrl : `${siteUrl}${cleanPath}`);

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
      <meta name="description" content={description} />
      <meta name="author" content="G. Hari Kiran" />
      <meta name="application-name" content={siteName} />
      <meta name="apple-mobile-web-app-title" content={siteName} />
      <link rel="canonical" href={canonicalUrl} />

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
      <meta property="og:type" content={type} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:image:secure_url" content={ogImage} />
      <meta property="og:image:type" content={imageType} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content={fullTitle} />
      <meta property="og:url" content={canonicalUrl} />
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
      <meta name="twitter:url" content={canonicalUrl} />

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
