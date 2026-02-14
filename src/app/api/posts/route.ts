import { NextRequest, NextResponse } from 'next/server';
import { getAllPosts } from '@/lib/markdown';
import { Locale, locales, defaultLocale } from '@/i18n/config';

// GET: 발행된 모든 글 조회
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const localeParam = searchParams.get('locale') || defaultLocale;
    const locale = locales.includes(localeParam as Locale) ? (localeParam as Locale) : defaultLocale;

    const posts = getAllPosts(locale);
    return NextResponse.json(posts);
  } catch (error) {
    console.error('Error fetching posts:', error);
    return NextResponse.json({ error: 'Failed to fetch posts' }, { status: 500 });
  }
}
