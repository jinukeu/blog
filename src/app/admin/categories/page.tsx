'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Category } from '@/types/blog';

export default function CategoriesPage() {
  const [mainCategories, setMainCategories] = useState<Category[]>([]);
  const [subCategories, setSubCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingMain, setEditingMain] = useState<{ id: string; name: string } | null>(null);
  const [editingSub, setEditingSub] = useState<{ id: string; name: string } | null>(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories');
      const data = await response.json();
      setMainCategories(data.mainCategories || []);
      setSubCategories(data.subCategories || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateMain = async (id: string, name: string) => {
    if (!name.trim()) {
      alert('카테고리 이름을 입력해주세요.');
      return;
    }

    try {
      const response = await fetch(`/api/categories/main/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim() }),
      });

      if (response.ok) {
        setEditingMain(null);
        fetchCategories();
        alert('카테고리가 수정되었습니다.');
      } else {
        const error = await response.json();
        alert(error.error || '수정에 실패했습니다.');
      }
    } catch (error) {
      console.error('Error updating category:', error);
      alert('수정 중 오류가 발생했습니다.');
    }
  };

  const handleUpdateSub = async (id: string, name: string) => {
    if (!name.trim()) {
      alert('카테고리 이름을 입력해주세요.');
      return;
    }

    try {
      const response = await fetch(`/api/categories/sub/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim() }),
      });

      if (response.ok) {
        setEditingSub(null);
        fetchCategories();
        alert('카테고리가 수정되었습니다.');
      } else {
        const error = await response.json();
        alert(error.error || '수정에 실패했습니다.');
      }
    } catch (error) {
      console.error('Error updating category:', error);
      alert('수정 중 오류가 발생했습니다.');
    }
  };

  const handleDeleteMain = async (id: string, name: string) => {
    try {
      const response = await fetch(`/api/categories/main/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        fetchCategories();
        alert('카테고리가 삭제되었습니다.');
      } else if (response.status === 409) {
        const error = await response.json();
        const confirmForce = confirm(
          `${error.error}\n\n사용 중인 글: ${error.usedIn?.join(', ')}\n\n해당 글들의 카테고리가 제거됩니다. 계속하시겠습니까?`
        );

        if (confirmForce) {
          // 강제 삭제
          const forceResponse = await fetch(`/api/categories/main/${id}?force=true`, {
            method: 'DELETE',
          });

          if (forceResponse.ok) {
            fetchCategories();
            alert('카테고리가 삭제되었습니다.');
          } else {
            alert('삭제에 실패했습니다.');
          }
        }
      } else {
        alert('삭제에 실패했습니다.');
      }
    } catch (error) {
      console.error('Error deleting category:', error);
      alert('삭제 중 오류가 발생했습니다.');
    }
  };

  const handleDeleteSub = async (id: string, name: string) => {
    try {
      const response = await fetch(`/api/categories/sub/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        fetchCategories();
        alert('카테고리가 삭제되었습니다.');
      } else if (response.status === 409) {
        const error = await response.json();
        const confirmForce = confirm(
          `${error.error}\n\n사용 중인 글: ${error.usedIn?.join(', ')}\n\n해당 글들의 카테고리가 제거됩니다. 계속하시겠습니까?`
        );

        if (confirmForce) {
          // 강제 삭제
          const forceResponse = await fetch(`/api/categories/sub/${id}?force=true`, {
            method: 'DELETE',
          });

          if (forceResponse.ok) {
            fetchCategories();
            alert('카테고리가 삭제되었습니다.');
          } else {
            alert('삭제에 실패했습니다.');
          }
        }
      } else {
        alert('삭제에 실패했습니다.');
      }
    } catch (error) {
      console.error('Error deleting category:', error);
      alert('삭제 중 오류가 발생했습니다.');
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* 헤더 */}
      <header className="bg-white dark:bg-gray-900 border-b border-neutral-100 dark:border-gray-800 sticky top-0 z-50">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="flex items-center justify-between h-[59px]">
            <div className="flex items-center space-x-4">
              <Link href="/" className="text-xl font-bold text-neutral-900 dark:text-white">
                jinukeu.log
              </Link>
              <span className="text-neutral-400 dark:text-gray-600">|</span>
              <span className="text-neutral-600 dark:text-gray-400">카테고리 관리</span>
            </div>
            <div className="flex items-center gap-4">
              <Link
                href="/admin/drafts"
                className="px-4 py-2 text-sm font-medium text-neutral-600 dark:text-gray-400 hover:text-neutral-900 dark:hover:text-white transition-colors"
              >
                Draft 관리
              </Link>
              <ThemeToggle />
            </div>
          </div>
        </div>
      </header>

      {/* 메인 콘텐츠 */}
      <main className="max-w-[1200px] mx-auto px-6 py-8">
        <h1 className="text-3xl font-bold text-neutral-900 dark:text-white mb-8">카테고리 관리</h1>

        {loading ? (
          <div className="text-center py-20">
            {/* 로딩 상태 - 빈 공간으로 유지 */}
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* 대카테고리 */}
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-100 dark:border-gray-700 p-6">
              <h2 className="text-xl font-bold text-neutral-900 dark:text-white mb-4">대카테고리</h2>

              {mainCategories.length > 0 ? (
                <div className="space-y-2">
                  {mainCategories.map((category) => (
                    <div
                      key={category.id}
                      className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                    >
                      {editingMain?.id === category.id ? (
                        <>
                          <input
                            type="text"
                            value={editingMain.name}
                            onChange={(e) =>
                              setEditingMain({ ...editingMain, name: e.target.value })
                            }
                            className="flex-1 px-3 py-1 border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-800 dark:text-white"
                            autoFocus
                          />
                          <div className="flex items-center gap-2 ml-3">
                            <button
                              onClick={() => handleUpdateMain(editingMain.id, editingMain.name)}
                              className="px-3 py-1 text-sm bg-primary-500 text-white rounded hover:bg-primary-600 transition-colors"
                            >
                              저장
                            </button>
                            <button
                              onClick={() => setEditingMain(null)}
                              className="px-3 py-1 text-sm bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-200 rounded hover:bg-gray-400 dark:hover:bg-gray-500 transition-colors"
                            >
                              취소
                            </button>
                          </div>
                        </>
                      ) : (
                        <>
                          <span className="font-medium text-neutral-900 dark:text-white">
                            {category.name}
                          </span>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => setEditingMain({ id: category.id, name: category.name })}
                              className="px-3 py-1 text-sm text-primary-600 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded transition-colors"
                            >
                              수정
                            </button>
                            <button
                              onClick={() => handleDeleteMain(category.id, category.name)}
                              className="px-3 py-1 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"
                            >
                              삭제
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-neutral-500 dark:text-gray-400 text-center py-8">
                  등록된 대카테고리가 없습니다.
                </p>
              )}
            </div>

            {/* 소카테고리 */}
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-100 dark:border-gray-700 p-6">
              <h2 className="text-xl font-bold text-neutral-900 dark:text-white mb-4">
                소카테고리 (태그)
              </h2>

              {subCategories.length > 0 ? (
                <div className="space-y-2">
                  {subCategories.map((category) => (
                    <div
                      key={category.id}
                      className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                    >
                      {editingSub?.id === category.id ? (
                        <>
                          <input
                            type="text"
                            value={editingSub.name}
                            onChange={(e) => setEditingSub({ ...editingSub, name: e.target.value })}
                            className="flex-1 px-3 py-1 border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-800 dark:text-white"
                            autoFocus
                          />
                          <div className="flex items-center gap-2 ml-3">
                            <button
                              onClick={() => handleUpdateSub(editingSub.id, editingSub.name)}
                              className="px-3 py-1 text-sm bg-primary-500 text-white rounded hover:bg-primary-600 transition-colors"
                            >
                              저장
                            </button>
                            <button
                              onClick={() => setEditingSub(null)}
                              className="px-3 py-1 text-sm bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-200 rounded hover:bg-gray-400 dark:hover:bg-gray-500 transition-colors"
                            >
                              취소
                            </button>
                          </div>
                        </>
                      ) : (
                        <>
                          <span className="font-medium text-neutral-900 dark:text-white">
                            {category.name}
                          </span>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => setEditingSub({ id: category.id, name: category.name })}
                              className="px-3 py-1 text-sm text-primary-600 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded transition-colors"
                            >
                              수정
                            </button>
                            <button
                              onClick={() => handleDeleteSub(category.id, category.name)}
                              className="px-3 py-1 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"
                            >
                              삭제
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-neutral-500 dark:text-gray-400 text-center py-8">
                  등록된 소카테고리가 없습니다.
                </p>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
