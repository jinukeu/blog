import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const draftImagesDirectory = path.join(process.cwd(), 'public', 'images', 'drafts');

// drafts 이미지 디렉토리가 없으면 생성
if (!fs.existsSync(draftImagesDirectory)) {
  fs.mkdirSync(draftImagesDirectory, { recursive: true });
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // 파일 타입 검증
    const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: 'Invalid file type' }, { status: 400 });
    }

    // 파일 크기 제한 (5MB)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      return NextResponse.json({ error: 'File size exceeds 5MB' }, { status: 400 });
    }

    // 고유한 파일명 생성
    const timestamp = Date.now();
    const originalName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const fileName = `${timestamp}-${originalName}`;
    const filePath = path.join(draftImagesDirectory, fileName);

    // 파일 저장
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    fs.writeFileSync(filePath, buffer);

    // 이미지 URL 반환
    const imageUrl = `/images/drafts/${fileName}`;

    return NextResponse.json({ url: imageUrl });
  } catch (error) {
    console.error('Error uploading image:', error);
    return NextResponse.json({ error: 'Failed to upload image' }, { status: 500 });
  }
}
