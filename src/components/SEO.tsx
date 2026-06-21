import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';

interface SEOProps {
  title: string;
  description: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article';
  articleData?: {
    publishedTime: string;
    modifiedTime?: string;
    author: string;
    tags: string[];
  };
  schemaData?: object;
  noindex?: boolean;
}

export const SEO: React.FC<SEOProps> = ({ 
  title, 
  description, 
  image, 
  url, 
  type = 'website',
  articleData,
  schemaData,
  noindex = false
}) => {
  const location = useLocation();
  const siteName = "G. Hari Kiran";
  const fullTitle = title.includes("G. Hari Kiran") ? title : `${title} | ${siteName}`;
  const defaultImage = "https://harikiran-portfolio.netlify.app/og-image.jpg"; // Placeholder
  const siteUrl = "https://harikiran-portfolio.netlify.app";

  // Determine precise canonical URL dynamically and strip trailing slashes (except apex /) to ensure sitemap matches
  const path = url !== undefined ? url : location.pathname;
  let cleanPath = path.startsWith('/') ? path : `/${path}`;
  if (cleanPath.endsWith('/') && cleanPath.length > 1) {
    cleanPath = cleanPath.slice(0, -1);
  }
  const canonicalUrl = cleanPath === '/' ? siteUrl : `${siteUrl}${cleanPath}`;

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

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image || defaultImage} />
      <meta property="og:image:alt" content={fullTitle} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:site_name" content={siteName} />
      <meta property="og:locale" content="en_IN" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@GHariKiran29" />
      <meta name="twitter:creator" content="@GHariKiran29" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image || defaultImage} />
      <meta name="twitter:image:alt" content={fullTitle} />

      {/* Article Specifics */}
      {type === 'article' && articleData && (
        <>
          <meta property="article:published_time" content={articleData.publishedTime} />
          {articleData.modifiedTime && <meta property="article:modified_time" content={articleData.modifiedTime} />}
          <meta property="article:author" content={articleData.author} />
          {articleData.tags.map(tag => (
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
