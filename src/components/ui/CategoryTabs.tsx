'use client';

import * as React from 'react';

interface Category {
  id: string;
  name: string;
}

interface CategoryTabsProps {
  categories: Category[];
  selectedCategory: string;
  onSelect: (categoryId: string) => void;
  allLabel?: string;
  className?: string;
}

// 메인 카테고리 탭 (하단 보더 스타일)
function CategoryTabs({
  categories,
  selectedCategory,
  onSelect,
  allLabel = '전체',
  className = '',
}: CategoryTabsProps) {
  return (
    <div className={`flex items-center gap-8 pb-5 border-b border-gray-200 dark:border-gray-700 overflow-x-auto scrollbar-hide ${className}`}>
      <button
        onClick={() => onSelect('all')}
        className={`relative whitespace-nowrap text-base pb-4 transition-all duration-200 ${
          selectedCategory === 'all'
            ? 'text-gray-900 dark:text-white font-semibold'
            : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
        }`}
      >
        {allLabel}
        {selectedCategory === 'all' && (
          <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-900 dark:bg-white rounded-full" />
        )}
      </button>
      {categories.map((category) => (
        <button
          key={category.id}
          onClick={() => onSelect(category.id)}
          className={`relative whitespace-nowrap text-base pb-4 transition-all duration-200 ${
            selectedCategory === category.id
              ? 'text-gray-900 dark:text-white font-semibold'
              : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          {category.name}
          {selectedCategory === category.id && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-900 dark:bg-white rounded-full" />
          )}
        </button>
      ))}
    </div>
  );
}

// 서브 카테고리 필 (둥근 버튼 스타일)
interface CategoryPillsProps {
  categories: Category[];
  selectedCategory: string;
  onSelect: (categoryId: string) => void;
  allLabel?: string;
  className?: string;
}

function CategoryPills({
  categories,
  selectedCategory,
  onSelect,
  allLabel = '전체',
  className = '',
}: CategoryPillsProps) {
  return (
    <div className={`flex items-center gap-2 flex-wrap ${className}`}>
      <button
        onClick={() => onSelect('all')}
        className={`px-4 py-1.5 text-sm rounded-full transition-all duration-200 ${
          selectedCategory === 'all'
            ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900 shadow-sm'
            : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
        }`}
      >
        {allLabel}
      </button>
      {categories.map((category) => (
        <button
          key={category.id}
          onClick={() => onSelect(category.id)}
          className={`px-4 py-1.5 text-sm rounded-full transition-all duration-200 ${
            selectedCategory === category.id
              ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900 shadow-sm'
              : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
          }`}
        >
          {category.name}
        </button>
      ))}
    </div>
  );
}

// 뱃지 스타일 카테고리 (인라인 표시용)
interface CategoryBadgeProps {
  category: Category;
  variant?: 'primary' | 'secondary';
  className?: string;
}

function CategoryBadge({
  category,
  variant = 'secondary',
  className = ''
}: CategoryBadgeProps) {
  const variants = {
    primary: 'bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 font-semibold',
    secondary: 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300',
  };

  return (
    <span className={`px-3 py-1 text-sm rounded-lg ${variants[variant]} ${className}`}>
      {category.name}
    </span>
  );
}

export { CategoryTabs, CategoryPills, CategoryBadge };
export type { Category, CategoryTabsProps, CategoryPillsProps, CategoryBadgeProps };
