import { NextRequest, NextResponse } from 'next/server';
import { publishDraft } from '@/lib/draft';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    publishDraft(slug);
    return NextResponse.json({ success: true, slug });
  } catch (error) {
    console.error('Error publishing draft:', error);
    return NextResponse.json({ error: 'Failed to publish draft' }, { status: 500 });
  }
}
