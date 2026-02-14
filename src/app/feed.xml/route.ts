import { getAllPosts } from '@/lib/markdown';
import { NextRequest, NextResponse } from 'next/server';
import { Locale, locales, defaultLocale } from '@/i18n/config';

const langMap: Record<string, string> = {
  ko: 'ko-KR',
  en: 'en-US',
  ja: 'ja-JP',
};

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const localeParam = searchParams.get('locale') || defaultLocale;
  const locale = locales.includes(localeParam as Locale) ? (localeParam as Locale) : defaultLocale;

  const posts = getAllPosts(locale);
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://yourdomain.com';

  const rssXml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Jinukeu Blog</title>
    <description>Tech blog by Jinwook Lee</description>
    <link>${baseUrl}/${locale}</link>
    <atom:link href="${baseUrl}/feed.xml?locale=${locale}" rel="self" type="application/rss+xml"/>
    <language>${langMap[locale] || 'ko-KR'}</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    ${posts
      .map(
        (post) => `
    <item>
      <title><![CDATA[${post.title}]]></title>
      <description><![CDATA[${post.excerpt}]]></description>
      <link>${baseUrl}/${locale}/blog/${post.slug}</link>
      <guid isPermaLink="true">${baseUrl}/${locale}/blog/${post.slug}</guid>
      <pubDate>${new Date(post.date).toUTCString()}</pubDate>
      ${post.author ? `<author>${post.author}</author>` : ''}
      ${post.subCategories ? post.subCategories.map(cat => `<category>${cat}</category>`).join('') : ''}
    </item>`
      )
      .join('')}
  </channel>
</rss>`;

  return new NextResponse(rssXml, {
    headers: {
      'Content-Type': 'application/rss+xml',
    },
  });
}
