import { NextResponse } from 'next/server';
import { getAllPosts } from '@/lib/markdown';

// GET: 발행된 모든 글 조회
export async function GET() {
  try {
    const posts = getAllPosts();
    return NextResponse.json(posts);
  } catch (error) {
    console.error('Error fetching posts:', error);
    return NextResponse.json({ error: 'Failed to fetch posts' }, { status: 500 });
  }
}
