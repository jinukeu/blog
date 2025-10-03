import { NextRequest, NextResponse } from 'next/server';
import { getDraftContent, saveDraft, deleteDraft } from '@/lib/draft';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const draft = getDraftContent(slug);
    return NextResponse.json(draft);
  } catch (error) {
    console.error('Error fetching draft:', error);
    return NextResponse.json({ error: 'Draft not found' }, { status: 404 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const body = await request.json();
    const { content, frontmatter } = body;

    if (!content) {
      return NextResponse.json({ error: 'Content is required' }, { status: 400 });
    }

    saveDraft(slug, content, frontmatter || {});

    return NextResponse.json({ success: true, slug });
  } catch (error) {
    console.error('Error updating draft:', error);
    return NextResponse.json({ error: 'Failed to update draft' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    deleteDraft(slug);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting draft:', error);
    return NextResponse.json({ error: 'Failed to delete draft' }, { status: 500 });
  }
}
