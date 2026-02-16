'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { MarkdownEditor } from '@/components/MarkdownEditor';
import { ThemeToggle } from '@/components/ThemeToggle';
import { CategorySelector } from '@/components/CategorySelector';
import { ThumbnailUpload } from '@/components/ThumbnailUpload';

export default function NewDraftPage() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [publishDate, setPublishDate] = useState(new Date().toISOString().split('T')[0]);
  const [thumbnail, setThumbnail] = useState('');
  const [mainCategories, setMainCategories] = useState<string[]>([]);
  const [subCategories, setSubCategories] = useState<string[]>([]);
  const [content, setContent] = useState('');
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!title.trim()) {
      alert('제목을 입력해주세요.');
      return;
    }

    if (!content.trim()) {
      alert('내용을 입력해주세요.');
      return;
    }

    if (mainCategories.length === 0) {
      alert('최소 하나의 대카테고리를 선택해주세요.');
      return;
    }

    setSaving(true);

    try {
      // slug 생성 (제목을 kebab-case로 변환)
      const slug = title
        .toLowerCase()
        .replace(/[^\w\s가-힣-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/--+/g, '-')
        .trim();

      const frontmatter = {
        title,
        date: publishDate,
        excerpt: excerpt || content.slice(0, 100) + '...',
        mainCategories,
        subCategories,
        author: '이진욱',
        thumbnail: thumbnail || undefined,
      };

      const response = await fetch('/api/drafts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          slug,
          content,
          frontmatter,
        }),
      });

      if (response.ok) {
        router.push('/admin/drafts');
      } else {
        alert('Draft 저장에 실패했습니다.');
      }
    } catch (error) {
      console.error('Error saving draft:', error);
      alert('Draft 저장 중 오류가 발생했습니다.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 flex flex-col">
      {/* 헤더 */}
      <header className="sticky top-0 z-50 bg-white dark:bg-gray-900 border-b border-neutral-100 dark:border-gray-800">
        <div className="max-w-[1400px] mx-auto px-6">
          <div className="flex items-center justify-between h-[59px]">
            <div className="flex items-center space-x-4">
              <Link href="/" className="text-xl font-bold text-neutral-900 dark:text-white">
                jinukeu.log
              </Link>
              <span className="text-neutral-400 dark:text-gray-600">|</span>
              <span className="text-neutral-600 dark:text-gray-400">새 Draft 작성</span>
            </div>
            <div className="flex items-center gap-4">
              <ThemeToggle />
              <Link
                href="/admin/drafts"
                className="px-4 py-2 text-sm font-medium text-neutral-600 dark:text-gray-400 hover:text-neutral-900 dark:hover:text-white transition-colors"
              >
                취소
              </Link>
              <button
                onClick={handleSave}
                disabled={saving}
                className="px-6 py-2 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 font-semibold rounded-lg hover:bg-neutral-800 dark:hover:bg-neutral-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? '저장 중...' : '저장'}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* 메타데이터 입력 */}
      <div className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-[1400px] mx-auto px-6 py-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="제목"
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
            />
            <input
              type="text"
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              placeholder="요약 (선택사항)"
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              발행일
            </label>
            <input
              type="date"
              value={publishDate}
              onChange={(e) => setPublishDate(e.target.value)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
            />
          </div>

          {/* 카테고리 선택 */}
          <CategorySelector
            selectedMainCategories={mainCategories}
            selectedSubCategories={subCategories}
            onMainCategoriesChange={setMainCategories}
            onSubCategoriesChange={setSubCategories}
          />

          {/* 썸네일 업로드 */}
          <ThumbnailUpload value={thumbnail} onChange={setThumbnail} />
        </div>
      </div>

      {/* 에디터 */}
      <div className="flex-1 max-w-[1400px] mx-auto px-6 py-6 w-full">
        <div className="h-[calc(100vh-200px)]">
          <MarkdownEditor value={content} onChange={setContent} />
        </div>
      </div>
    </div>
  );
}
