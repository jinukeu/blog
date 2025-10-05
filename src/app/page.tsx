'use client';

import Link from "next/link";
import Image from "next/image";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useEffect, useState } from "react";
import { Category } from "@/types/blog";
import { WebsiteJsonLd } from "@/components/JsonLd";

interface Post {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  mainCategories?: string[];
  subCategories?: string[];
  author?: string;
  readTime?: string;
  thumbnail?: string;
}

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [mainCategories, setMainCategories] = useState<Category[]>([]);
  const [subCategories, setSubCategories] = useState<Category[]>([]);
  const [selectedMainCategory, setSelectedMainCategory] = useState<string>('recommended');
  const [selectedSubCategory, setSelectedSubCategory] = useState<string>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [postsRes, categoriesRes] = await Promise.all([
        fetch('/api/posts'),
        fetch('/api/categories'),
      ]);

      const postsData = await postsRes.json();
      const categoriesData = await categoriesRes.json();

      setPosts(postsData);
      setMainCategories(categoriesData.mainCategories || []);
      setSubCategories(categoriesData.subCategories || []);

      // 추천 카테고리가 존재하는지 확인
      const hasRecommended = categoriesData.mainCategories?.some(
        (cat: Category) => cat.id === 'recommended'
      );

      // 추천 카테고리가 없으면 'all'로 설정
      if (!hasRecommended) {
        setSelectedMainCategory('all');
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  // 필터링된 포스트
  const filteredPosts = posts.filter((post) => {
    // 대카테고리 필터
    if (selectedMainCategory !== 'all') {
      if (!post.mainCategories?.includes(selectedMainCategory)) {
        return false;
      }
    }

    // 소카테고리 필터
    if (selectedSubCategory !== 'all') {
      if (!post.subCategories?.includes(selectedSubCategory)) {
        return false;
      }
    }

    return true;
  });

  return (
    <>
      <WebsiteJsonLd
        name="Jinukeu Blog"
        description="안드로이드 개발자 이진욱의 기술 블로그. Kotlin, Java, Android 개발 경험과 인사이트를 공유합니다."
        url={process.env.NEXT_PUBLIC_BASE_URL || "https://yourdomain.com"}
      />

      <div className="min-h-screen bg-white dark:bg-gray-900">
        {/* Toss Tech 스타일 헤더 */}
        <header className="bg-white dark:bg-gray-900 border-b border-neutral-100 dark:border-gray-800 sticky top-0 z-50">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="flex items-center justify-between h-[59px]">
            <Link href="/" className="flex items-center">
              <span className="text-xl font-bold text-neutral-900 dark:text-white">jinukeu.log</span>
            </Link>
            <div className="flex items-center space-x-8">
              <div className="flex items-center space-x-4">
                {/* 로컬 환경에서만 Draft 관리 버튼 표시 */}
                {process.env.NODE_ENV === 'development' && (
                  <Link
                    href="/admin/drafts"
                    className="px-3 py-1.5 text-sm font-medium text-primary-600 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg transition-colors"
                  >
                    Draft 관리
                  </Link>
                )}
                <Link href="https://github.com/jinukeu" target="_blank" rel="noopener noreferrer" className="text-neutral-700 dark:text-gray-300 hover:text-primary-500 dark:hover:text-primary-400 transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                  </svg>
                </Link>
                <Link href="https://linkedin.com/in/jinukeu" target="_blank" rel="noopener noreferrer" className="text-neutral-700 dark:text-gray-300 hover:text-primary-500 dark:hover:text-primary-400 transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </Link>
                <ThemeToggle />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Toss Tech 스타일 메인 콘텐츠 */}
      <main className="max-w-[1200px] mx-auto px-6 py-8">
        {/* 대카테고리 필터 */}
        <div className="mb-6">
          <div className="flex items-center space-x-6 pb-4 border-b border-neutral-100 dark:border-gray-800 overflow-x-auto">
            <button
              onClick={() => {
                setSelectedMainCategory('all');
                setSelectedSubCategory('all');
              }}
              className={`whitespace-nowrap font-medium pb-2 transition-colors ${
                selectedMainCategory === 'all'
                  ? 'text-neutral-900 dark:text-white font-semibold border-b-2 border-primary-500'
                  : 'text-neutral-500 dark:text-gray-400 hover:text-neutral-900 dark:hover:text-white'
              }`}
            >
              전체
            </button>
            {mainCategories.map((category) => (
              <button
                key={category.id}
                onClick={() => {
                  setSelectedMainCategory(category.id);
                  setSelectedSubCategory('all');
                }}
                className={`whitespace-nowrap font-medium pb-2 transition-colors ${
                  selectedMainCategory === category.id
                    ? 'text-neutral-900 dark:text-white font-semibold border-b-2 border-primary-500'
                    : 'text-neutral-500 dark:text-gray-400 hover:text-neutral-900 dark:hover:text-white'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>

        {/* 소카테고리 필터 */}
        {subCategories.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={() => setSelectedSubCategory('all')}
                className={`px-4 py-2 text-sm rounded-full transition-colors ${
                  selectedSubCategory === 'all'
                    ? 'bg-primary-500 text-white font-medium'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                전체
              </button>
              {subCategories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedSubCategory(category.id)}
                  className={`px-4 py-2 text-sm rounded-full transition-colors ${
                    selectedSubCategory === category.id
                      ? 'bg-primary-500 text-white font-medium'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* 아티클 리스트 */}
        <div className="space-y-4">
          {loading ? (
            <div className="text-center py-20">
              {/* 로딩 상태 - 빈 공간으로 유지 */}
            </div>
          ) : filteredPosts.length > 0 ? (
            filteredPosts.map((post) => (
              <article key={post.slug} className="group">
                <Link href={`/blog/${post.slug}`}>
                  <div className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden border border-gray-100 dark:border-gray-700 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                    <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 p-4 sm:p-6">
                      {/* 썸네일 이미지 */}
                      <div className="w-full sm:w-48 h-48 sm:h-32 flex-shrink-0 bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-900 dark:to-emerald-800 rounded-lg overflow-hidden relative">
                        {post.thumbnail ? (
                          <Image
                            src={post.thumbnail}
                            alt={post.title}
                            fill
                            sizes="(max-width: 640px) 100vw, 192px"
                            className="object-cover"
                            quality={85}
                            priority={false}
                          />
                        ) : (
                          <div className="flex items-center justify-center w-full h-full text-3xl">🧩</div>
                        )}
                      </div>

                      {/* 콘텐츠 */}
                      <div className="flex-1 flex flex-col justify-between min-w-0">
                        <div className="space-y-2">
                          <h2 className="text-lg sm:text-xl font-bold text-neutral-900 dark:text-white group-hover:text-primary-500 dark:group-hover:text-primary-400 transition-colors line-clamp-2 leading-tight">
                            {post.title}
                          </h2>

                          <p className="text-neutral-600 dark:text-gray-300 text-sm line-clamp-2 leading-relaxed">
                            {post.excerpt}
                          </p>
                        </div>

                        <div className="space-y-3 mt-4">
                          <div className="flex items-center gap-2 sm:gap-3 text-xs text-neutral-400 dark:text-gray-500 flex-wrap">
                            <span>{post.author || '이진욱'}</span>
                            <span className="hidden sm:inline">•</span>
                            <time dateTime={post.date}>
                              {new Date(post.date).toLocaleDateString('ko-KR', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                              })}
                            </time>
                            {post.readTime && (
                              <>
                                <span className="hidden sm:inline">•</span>
                                <span>{post.readTime}</span>
                              </>
                            )}
                          </div>

                          {(post.mainCategories || post.subCategories) && (
                            <div className="flex flex-wrap gap-2">
                              {post.mainCategories?.slice(0, 2).map((catId) => {
                                const category = mainCategories.find((c) => c.id === catId);
                                return category ? (
                                  <span
                                    key={catId}
                                    className="px-3 sm:px-4 py-1 sm:py-1.5 text-xs font-semibold bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded-lg"
                                  >
                                    {category.name}
                                  </span>
                                ) : null;
                              })}
                              {post.subCategories?.slice(0, 3).map((catId) => {
                                const category = subCategories.find((c) => c.id === catId);
                                return category ? (
                                  <span
                                    key={catId}
                                    className="px-3 sm:px-4 py-1 sm:py-1.5 text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-lg"
                                  >
                                    {category.name}
                                  </span>
                                ) : null;
                              })}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </article>
            ))
          ) : (
            <div className="text-center py-20">
              <div className="text-6xl mb-6">🔍</div>
              <h3 className="text-2xl font-bold text-neutral-900 dark:text-white mb-4">
                {selectedMainCategory !== 'all' || selectedSubCategory !== 'all'
                  ? '해당 카테고리에 글이 없습니다'
                  : '첫 번째 글을 기다리고 있어요'}
              </h3>
              <p className="text-neutral-600 dark:text-gray-400 text-lg max-w-md mx-auto leading-relaxed">
                {selectedMainCategory !== 'all' || selectedSubCategory !== 'all'
                  ? '다른 카테고리를 선택해보세요.'
                  : '아직 게시된 글이 없습니다. 곧 흥미로운 콘텐츠로 채워질 예정이에요!'}
              </p>
            </div>
          )}
        </div>
      </main>
      <footer className="bg-neutral-50 dark:bg-gray-800 mt-20">
        <div className="max-w-[1200px] mx-auto px-6 py-12">
          <div className="text-center text-sm text-neutral-500 dark:text-gray-400">
            © jinukeu
          </div>
        </div>
      </footer>
    </div>
    </>
  );
}
