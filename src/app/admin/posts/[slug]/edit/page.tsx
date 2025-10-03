'use client';

import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { MarkdownEditor } from '@/components/MarkdownEditor';
import { ThemeToggle } from '@/components/ThemeToggle';
import { CategorySelector } from '@/components/CategorySelector';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default function EditPostPage({ params }: PageProps) {
  const router = useRouter();
  const resolvedParams = use(params);
  const { slug } = resolvedParams;

  const [title, setTitle] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [mainCategories, setMainCategories] = useState<string[]>([]);
  const [subCategories, setSubCategories] = useState<string[]>([]);
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchPost();
  }, [slug]);

  const fetchPost = async () => {
    try {
      const response = await fetch(`/api/posts/${slug}`);
      if (!response.ok) {
        alert('글을 찾을 수 없습니다.');
        router.push('/admin/posts');
        return;
      }

      const data = await response.json();
      setTitle(data.frontmatter.title || '');
      setExcerpt(data.frontmatter.excerpt || '');
      setMainCategories(data.frontmatter.mainCategories || []);
      setSubCategories(data.frontmatter.subCategories || []);
      setContent(data.content || '');
    } catch (error) {
      console.error('Error fetching post:', error);
      alert('글을 불러오는 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

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
      const frontmatter = {
        title,
        date: new Date().toISOString().split('T')[0],
        excerpt: excerpt || content.slice(0, 100) + '...',
        mainCategories,
        subCategories,
        author: '이진욱',
      };

      const response = await fetch(`/api/posts/${slug}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content,
          frontmatter,
        }),
      });

      if (response.ok) {
        router.push('/admin/posts');
      } else {
        alert('글 저장에 실패했습니다.');
      }
    } catch (error) {
      console.error('Error saving post:', error);
      alert('글 저장 중 오류가 발생했습니다.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900">
        {/* 로딩 상태 - 빈 페이지로 유지 */}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 flex flex-col">
      {/* 헤더 */}
      <header className="bg-white dark:bg-gray-900 border-b border-neutral-100 dark:border-gray-800">
        <div className="max-w-[1400px] mx-auto px-6">
          <div className="flex items-center justify-between h-[59px]">
            <div className="flex items-center space-x-4">
              <Link href="/" className="text-xl font-bold text-neutral-900 dark:text-white">
                jinukeu.log
              </Link>
              <span className="text-neutral-400 dark:text-gray-600">|</span>
              <span className="text-neutral-600 dark:text-gray-400">발행된 글 편집</span>
            </div>
            <div className="flex items-center gap-4">
              <ThemeToggle />
              <Link
                href="/admin/posts"
                className="px-4 py-2 text-sm font-medium text-neutral-600 dark:text-gray-400 hover:text-neutral-900 dark:hover:text-white transition-colors"
              >
                취소
              </Link>
              <button
                onClick={handleSave}
                disabled={saving}
                className="px-6 py-2 bg-primary-500 text-white font-semibold rounded-lg hover:bg-primary-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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

          {/* 카테고리 선택 */}
          <CategorySelector
            selectedMainCategories={mainCategories}
            selectedSubCategories={subCategories}
            onMainCategoriesChange={setMainCategories}
            onSubCategoriesChange={setSubCategories}
          />
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
