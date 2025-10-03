import { NextRequest, NextResponse } from 'next/server';
import { getAllCategories, addMainCategory, addSubCategory } from '@/lib/category';

// GET: 모든 카테고리 조회
export async function GET() {
  try {
    const categories = getAllCategories();
    return NextResponse.json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 });
  }
}

// POST: 카테고리 생성
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, name } = body;

    if (!type || !name) {
      return NextResponse.json({ error: 'Type and name are required' }, { status: 400 });
    }

    if (!name.trim()) {
      return NextResponse.json({ error: '카테고리 이름을 입력해주세요' }, { status: 400 });
    }

    let newCategory;
    if (type === 'main') {
      newCategory = addMainCategory(name.trim());
    } else if (type === 'sub') {
      newCategory = addSubCategory(name.trim());
    } else {
      return NextResponse.json({ error: 'Invalid type. Use "main" or "sub"' }, { status: 400 });
    }

    return NextResponse.json(newCategory, { status: 201 });
  } catch (error) {
    console.error('Error creating category:', error);
    if (error instanceof Error && error.message === '이미 존재하는 카테고리입니다.') {
      return NextResponse.json({ error: error.message }, { status: 409 });
    }
    return NextResponse.json({ error: 'Failed to create category' }, { status: 500 });
  }
}
