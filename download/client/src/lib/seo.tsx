import { ReactNode } from "react";
import { Helmet } from "react-helmet";

interface SEOProps {
  title: string;
  description: string;
  canonical?: string;
  image?: string;
  type?: "website" | "article" | "event" | "product";
  children?: ReactNode;
}

/**
 * SEO component to handle all meta tags and structured data
 */
export const SEO = ({
  title,
  description,
  canonical = "",
  image = "https://images.unsplash.com/photo-1570639224010-04962102a37a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80",
  type = "website",
  children,
}: SEOProps) => {
  // Construct the full canonical URL
  const domain = typeof window !== 'undefined' ? window.location.origin : '';
  const fullCanonical = `${domain}${canonical}`;
  
  return (
    <Helmet>
      {/* Basic meta tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={fullCanonical} />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={fullCanonical} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={fullCanonical} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      
      {/* Additional structured data for specific page types */}
      {type === "event" && (
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Event",
            "name": title,
            "description": description,
            "image": image,
            "url": fullCanonical,
            "organizer": {
              "@type": "Organization",
              "name": "Texas Hill Country Guide",
              "url": domain
            },
            "location": {
              "@type": "Place",
              "name": "Texas Hill Country",
              "address": {
                "@type": "PostalAddress",
                "addressRegion": "TX",
                "addressCountry": "US"
              }
            }
          })}
        </script>
      )}
      
      {type === "product" && (
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Product",
            "name": title,
            "description": description,
            "image": image,
            "brand": {
              "@type": "Brand",
              "name": "Cabins at Flite Acres"
            },
            "offers": {
              "@type": "Offer",
              "availability": "https://schema.org/InStock",
              "priceCurrency": "USD",
              "seller": {
                "@type": "Organization",
                "name": "Texas Hill Country Guide"
              }
            }
          })}
        </script>
      )}
      
      {type === "article" && (
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            "headline": title,
            "description": description,
            "image": image,
            "author": {
              "@type": "Organization",
              "name": "Texas Hill Country Guide"
            },
            "publisher": {
              "@type": "Organization",
              "name": "Texas Hill Country Guide",
              "logo": {
                "@type": "ImageObject",
                "url": `${domain}/logo.png`
              }
            },
            "datePublished": new Date().toISOString(),
            "dateModified": new Date().toISOString()
          })}
        </script>
      )}
      
      {type === "website" && (
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "TouristInformation",
            "name": "Texas Hill Country Guide",
            "description": "Comprehensive guide to the Texas Hill Country with events, activities, and cabin rentals.",
            "url": fullCanonical,
            "areaServed": {
              "@type": "Place",
              "name": "Texas Hill Country"
            },
            "subjectOf": {
              "@type": "LodgingBusiness",
              "name": "Cabins at Flite Acres",
              "description": "Luxurious cabin rentals in Wimberley, Texas.",
              "telephone": "512-551-0939",
              "address": {
                "@type": "PostalAddress",
                "streetAddress": "3 Palos Verdes Drive",
                "addressLocality": "Wimberley",
                "addressRegion": "TX",
                "postalCode": "78676"
              }
            }
          })}
        </script>
      )}
      
      {children}
    </Helmet>
  );
};
