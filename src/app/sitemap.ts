import { MetadataRoute } from 'next';
import { getAllPosts } from '@/lib/markdown';
import { locales, Locale } from '@/i18n/config';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://blog.jinukeu.com';

  const entries: MetadataRoute.Sitemap = [];

  // Homepage for each locale
  for (const locale of locales) {
    entries.push({
      url: `${baseUrl}/${locale}`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
      alternates: {
        languages: Object.fromEntries(
          locales.map((loc) => [loc, `${baseUrl}/${loc}`])
        ),
      },
    });
  }

  // Blog posts for each locale
  for (const locale of locales) {
    const posts = getAllPosts(locale as Locale);
    for (const post of posts) {
      entries.push({
        url: `${baseUrl}/${locale}/blog/${post.slug}`,
        lastModified: new Date(post.date),
        changeFrequency: 'monthly',
        priority: 0.8,
        alternates: {
          languages: Object.fromEntries(
            (post.availableLocales || [locale]).map((loc) => [
              loc,
              `${baseUrl}/${loc}/blog/${post.slug}`,
            ])
          ),
        },
      });
    }
  }

  return entries;
}
