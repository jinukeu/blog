import { NextRequest, NextResponse } from 'next/server';
import {
  updateMainCategory,
  updateSubCategory,
  deleteMainCategory,
  deleteSubCategory,
  forceDeleteMainCategory,
  forceDeleteSubCategory,
} from '@/lib/category';

interface Params {
  params: Promise<{
    type: string;
    id: string;
  }>;
}

// PUT: 카테고리 수정
export async function PUT(request: NextRequest, { params }: Params) {
  try {
    const { type, id } = await params;
    const body = await request.json();
    const { name } = body;

    if (!name || !name.trim()) {
      return NextResponse.json({ error: '카테고리 이름을 입력해주세요' }, { status: 400 });
    }

    if (type === 'main') {
      updateMainCategory(id, name.trim());
    } else if (type === 'sub') {
      updateSubCategory(id, name.trim());
    } else {
      return NextResponse.json({ error: 'Invalid type' }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating category:', error);
    if (error instanceof Error && error.message === '카테고리를 찾을 수 없습니다.') {
      return NextResponse.json({ error: error.message }, { status: 404 });
    }
    return NextResponse.json({ error: 'Failed to update category' }, { status: 500 });
  }
}

// DELETE: 카테고리 삭제
export async function DELETE(request: NextRequest, { params }: Params) {
  try {
    const { type, id } = await params;
    const url = new URL(request.url);
    const force = url.searchParams.get('force') === 'true';

    let result;

    if (force) {
      // 강제 삭제
      if (type === 'main') {
        forceDeleteMainCategory(id);
      } else if (type === 'sub') {
        forceDeleteSubCategory(id);
      } else {
        return NextResponse.json({ error: 'Invalid type' }, { status: 400 });
      }
      return NextResponse.json({ success: true });
    } else {
      // 일반 삭제 (사용 중이면 실패)
      if (type === 'main') {
        result = deleteMainCategory(id);
      } else if (type === 'sub') {
        result = deleteSubCategory(id);
      } else {
        return NextResponse.json({ error: 'Invalid type' }, { status: 400 });
      }

      if (!result.success) {
        return NextResponse.json(
          {
            error: '이 카테고리를 사용 중인 글이 있습니다.',
            usedIn: result.usedIn,
          },
          { status: 409 }
        );
      }

      return NextResponse.json({ success: true });
    }
  } catch (error) {
    console.error('Error deleting category:', error);
    return NextResponse.json({ error: 'Failed to delete category' }, { status: 500 });
  }
}
