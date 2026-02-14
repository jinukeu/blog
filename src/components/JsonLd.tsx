import Script from 'next/script';

interface BlogPostJsonLdProps {
  title: string;
  description: string;
  datePublished: string;
  dateModified?: string;
  author: string;
  url: string;
  image?: string;
  summary?: string;
  keyTakeaways?: string[];
  inLanguage?: string;
}

export function BlogPostJsonLd({
  title,
  description,
  datePublished,
  dateModified,
  author,
  url,
  image,
  summary,
  keyTakeaways,
  inLanguage = 'ko',
}: BlogPostJsonLdProps) {
  const jsonLd: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: title,
    description: description,
    inLanguage: inLanguage,
    author: {
      '@type': 'Person',
      name: author,
      url: 'https://github.com/jinukeu',
    },
    datePublished: datePublished,
    dateModified: dateModified || datePublished,
    image: image || 'https://yourdomain.com/og-default.png',
    url: url,
    publisher: {
      '@type': 'Organization',
      name: 'Jinukeu Blog',
      logo: {
        '@type': 'ImageObject',
        url: 'https://yourdomain.com/logo.png',
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': url,
    },
  };

  // GEO: summary
  if (summary) {
    jsonLd.abstract = summary;
  }

  // GEO: keyTakeaways
  if (keyTakeaways && keyTakeaways.length > 0) {
    jsonLd.keywords = keyTakeaways.join(', ');
    jsonLd.about = keyTakeaways.map((takeaway) => ({
      '@type': 'Thing',
      name: takeaway,
    }));
  }

  return (
    <Script
      id="blog-post-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

interface WebsiteJsonLdProps {
  name: string;
  description: string;
  url: string;
}

export function WebsiteJsonLd({ name, description, url }: WebsiteJsonLdProps) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: name,
    description: description,
    url: url,
    author: {
      '@type': 'Person',
      name: '이진욱',
      url: 'https://github.com/jinukeu',
    },
  };

  return (
    <Script
      id="website-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
