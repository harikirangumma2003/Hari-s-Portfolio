import React from "react";
import { Link } from "react-router-dom";
import { ChevronRight, Home } from "lucide-react";
import { Helmet } from "react-helmet-async";

export interface BreadcrumbItem {
  name: string;
  path?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items }) => {
  const siteUrl = "https://harikiran-portfolio.netlify.app";

  // Create schema objects for JSON-LD BreadcrumbList
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": siteUrl
      },
      ...items.map((item, index) => ({
        "@type": "ListItem",
        "position": index + 2,
        "name": item.name,
        "item": item.path ? `${siteUrl}${item.path}` : undefined
      }))
    ]
  };

  return (
    <nav aria-label="Breadcrumb" className="mb-8" id="structured-breadcrumbs">
      <Helmet>
        <script type="application/ld+json">
          {JSON.stringify(breadcrumbSchema)}
        </script>
      </Helmet>

      <ol className="flex flex-wrap items-center gap-2 text-xs font-mono uppercase tracking-widest text-muted/65">
        <li className="flex items-center">
          <Link 
            to="/" 
            className="flex items-center gap-1.5 hover:text-accent transition-colors py-1"
            title="G. Hari Kiran Portfolio Home"
          >
            <Home size={12} />
            <span>Home</span>
          </Link>
        </li>

        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <React.Fragment key={index}>
              <ChevronRight size={10} className="opacity-40" />
              <li className="flex items-center">
                {isLast || !item.path ? (
                  <span className="text-primary font-black truncate max-w-[200px] sm:max-w-[300px]">
                    {item.name}
                  </span>
                ) : (
                  <Link 
                    to={item.path} 
                    className="hover:text-accent transition-colors py-1"
                    title={`Go back to ${item.name}`}
                  >
                    {item.name}
                  </Link>
                )}
              </li>
            </React.Fragment>
          );
        })}
      </ol>
    </nav>
  );
};
