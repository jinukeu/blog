import { getAllPosts } from '@/lib/markdown';
import { NextResponse } from 'next/server';

export async function GET() {
  const posts = getAllPosts();
  
  const rssXml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Modern Blog</title>
    <description>현대적이고 트렌디한 개발 블로그입니다.</description>
    <link>https://yourdomain.com</link>
    <atom:link href="https://yourdomain.com/feed.xml" rel="self" type="application/rss+xml"/>
    <language>ko-KR</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    ${posts
      .map(
        (post) => `
    <item>
      <title><![CDATA[${post.title}]]></title>
      <description><![CDATA[${post.excerpt}]]></description>
      <link>https://yourdomain.com/blog/${post.slug}</link>
      <guid isPermaLink="true">https://yourdomain.com/blog/${post.slug}</guid>
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