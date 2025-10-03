import { NextRequest, NextResponse } from 'next/server';
import { getPostBySlug } from '@/lib/markdown';

interface Params {
  params: Promise<{
    slug: string;
  }>;
}

// GET: 발행된 글의 HTML 콘텐츠 조회
export async function GET(request: NextRequest, { params }: Params) {
  try {
    const { slug } = await params;
    const post = await getPostBySlug(slug);
    return NextResponse.json(post);
  } catch (error) {
    console.error('Error fetching post HTML:', error);
    return NextResponse.json({ error: 'Post not found' }, { status: 404 });
  }
}
