import { NextRequest, NextResponse } from 'next/server';
import { getAllDrafts, saveDraft } from '@/lib/draft';

export async function GET() {
  try {
    const drafts = getAllDrafts();
    return NextResponse.json(drafts);
  } catch (error) {
    console.error('Error fetching drafts:', error);
    return NextResponse.json({ error: 'Failed to fetch drafts' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { slug, content, frontmatter } = body;

    if (!slug || !content) {
      return NextResponse.json({ error: 'Slug and content are required' }, { status: 400 });
    }

    saveDraft(slug, content, frontmatter || {});

    return NextResponse.json({ success: true, slug });
  } catch (error) {
    console.error('Error saving draft:', error);
    return NextResponse.json({ error: 'Failed to save draft' }, { status: 500 });
  }
}
