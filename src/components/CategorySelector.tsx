'use client';

import { useState, useEffect } from 'react';
import { Category } from '@/types/blog';

interface CategorySelectorProps {
  selectedMainCategories: string[];
  selectedSubCategories: string[];
  onMainCategoriesChange: (categories: string[]) => void;
  onSubCategoriesChange: (categories: string[]) => void;
}

export function CategorySelector({
  selectedMainCategories,
  selectedSubCategories,
  onMainCategoriesChange,
  onSubCategoriesChange,
}: CategorySelectorProps) {
  const [mainCategories, setMainCategories] = useState<Category[]>([]);
  const [subCategories, setSubCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [newMainCategory, setNewMainCategory] = useState('');
  const [newSubCategory, setNewSubCategory] = useState('');
  const [addingMain, setAddingMain] = useState(false);
  const [addingSub, setAddingSub] = useState(false);

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

  const handleMainCategoryToggle = (categoryId: string) => {
    if (selectedMainCategories.includes(categoryId)) {
      onMainCategoriesChange(selectedMainCategories.filter((id) => id !== categoryId));
    } else {
      onMainCategoriesChange([...selectedMainCategories, categoryId]);
    }
  };

  const handleSubCategoryToggle = (categoryId: string) => {
    if (selectedSubCategories.includes(categoryId)) {
      onSubCategoriesChange(selectedSubCategories.filter((id) => id !== categoryId));
    } else {
      onSubCategoriesChange([...selectedSubCategories, categoryId]);
    }
  };

  const handleAddMainCategory = async () => {
    if (!newMainCategory.trim()) return;

    setAddingMain(true);
    try {
      const response = await fetch('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'main', name: newMainCategory.trim() }),
      });

      if (response.ok) {
        const newCat = await response.json();
        setMainCategories([...mainCategories, newCat]);
        setNewMainCategory('');
        alert('대카테고리가 추가되었습니다.');
      } else {
        const error = await response.json();
        alert(error.error || '카테고리 추가에 실패했습니다.');
      }
    } catch (error) {
      console.error('Error adding main category:', error);
      alert('카테고리 추가 중 오류가 발생했습니다.');
    } finally {
      setAddingMain(false);
    }
  };

  const handleAddSubCategory = async () => {
    if (!newSubCategory.trim()) return;

    setAddingSub(true);
    try {
      const response = await fetch('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'sub', name: newSubCategory.trim() }),
      });

      if (response.ok) {
        const newCat = await response.json();
        setSubCategories([...subCategories, newCat]);
        setNewSubCategory('');
        alert('소카테고리가 추가되었습니다.');
      } else {
        const error = await response.json();
        alert(error.error || '카테고리 추가에 실패했습니다.');
      }
    } catch (error) {
      console.error('Error adding sub category:', error);
      alert('카테고리 추가 중 오류가 발생했습니다.');
    } finally {
      setAddingSub(false);
    }
  };

  if (loading) {
    return <div className="text-neutral-600 dark:text-gray-400">카테고리 로딩 중...</div>;
  }

  return (
    <div className="space-y-6">
      {/* 대카테고리 */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <label className="block text-sm font-semibold text-neutral-900 dark:text-white">
            대카테고리 <span className="text-red-500">*</span>
          </label>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-3">
          {mainCategories.map((category) => (
            <label
              key={category.id}
              className="flex items-center space-x-2 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <input
                type="checkbox"
                checked={selectedMainCategories.includes(category.id)}
                onChange={() => handleMainCategoryToggle(category.id)}
                className="w-4 h-4 text-primary-500 border-gray-300 rounded focus:ring-primary-500"
              />
              <span className="text-sm text-neutral-900 dark:text-white">{category.name}</span>
            </label>
          ))}
        </div>

        {/* 빠른 추가 */}
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={newMainCategory}
            onChange={(e) => setNewMainCategory(e.target.value)}
            placeholder="새 대카테고리 추가..."
            className="flex-1 px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleAddMainCategory();
              }
            }}
          />
          <button
            onClick={handleAddMainCategory}
            disabled={addingMain || !newMainCategory.trim()}
            className="px-4 py-2 text-sm bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {addingMain ? '추가 중...' : '추가'}
          </button>
        </div>
      </div>

      {/* 소카테고리 */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <label className="block text-sm font-semibold text-neutral-900 dark:text-white">
            소카테고리 (태그)
          </label>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-3">
          {subCategories.map((category) => (
            <label
              key={category.id}
              className="flex items-center space-x-2 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <input
                type="checkbox"
                checked={selectedSubCategories.includes(category.id)}
                onChange={() => handleSubCategoryToggle(category.id)}
                className="w-4 h-4 text-primary-500 border-gray-300 rounded focus:ring-primary-500"
              />
              <span className="text-sm text-neutral-900 dark:text-white">{category.name}</span>
            </label>
          ))}
        </div>

        {/* 빠른 추가 */}
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={newSubCategory}
            onChange={(e) => setNewSubCategory(e.target.value)}
            placeholder="새 소카테고리 추가..."
            className="flex-1 px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleAddSubCategory();
              }
            }}
          />
          <button
            onClick={handleAddSubCategory}
            disabled={addingSub || !newSubCategory.trim()}
            className="px-4 py-2 text-sm bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {addingSub ? '추가 중...' : '추가'}
          </button>
        </div>
      </div>
    </div>
  );
}
