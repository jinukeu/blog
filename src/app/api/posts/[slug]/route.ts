import { NextRequest, NextResponse } from 'next/server';
import { getPostContent, savePost, deletePost } from '@/lib/markdown';

interface Params {
  params: Promise<{
    slug: string;
  }>;
}

// GET: 발행된 글 조회
export async function GET(request: NextRequest, { params }: Params) {
  try {
    const { slug } = await params;
    const post = getPostContent(slug);
    return NextResponse.json(post);
  } catch (error) {
    console.error('Error fetching post:', error);
    return NextResponse.json({ error: 'Post not found' }, { status: 404 });
  }
}

// PUT: 발행된 글 수정
export async function PUT(request: NextRequest, { params }: Params) {
  try {
    const { slug } = await params;
    const body = await request.json();
    const { content, frontmatter } = body;

    if (!content) {
      return NextResponse.json({ error: 'Content is required' }, { status: 400 });
    }

    savePost(slug, content, frontmatter || {});

    return NextResponse.json({ success: true, slug });
  } catch (error) {
    console.error('Error updating post:', error);
    return NextResponse.json({ error: 'Failed to update post' }, { status: 500 });
  }
}

// DELETE: 발행된 글 삭제
export async function DELETE(request: NextRequest, { params }: Params) {
  try {
    const { slug } = await params;
    deletePost(slug);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting post:', error);
    return NextResponse.json({ error: 'Failed to delete post' }, { status: 500 });
  }
}
