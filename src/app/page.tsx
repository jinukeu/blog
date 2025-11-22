'use client';

import Link from "next/link";
import Image from "next/image";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useEffect, useState } from "react";
import { Category } from "@/types/blog";
import { WebsiteJsonLd } from "@/components/JsonLd";
import { CategoryTabs, CategoryPills } from "@/components/ui/CategoryTabs";
import { PostCardSkeleton } from "@/components/ui/Skeleton";

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
        {/* Medium-style Header */}
        <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50 backdrop-blur-sm bg-white/90 dark:bg-gray-900/90">
        <div className="max-w-content mx-auto px-8 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center">
              <span className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">jinukeu</span>
            </Link>
            <div className="flex items-center gap-6">
              {/* 로컬 환경에서만 Draft 관리 버튼 표시 */}
              {process.env.NODE_ENV === 'development' && (
                <Link
                  href="/admin/drafts"
                  className="text-base text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                >
                  Draft
                </Link>
              )}
              <Link href="https://github.com/jinukeu" target="_blank" rel="noopener noreferrer" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors" aria-label="GitHub">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                </svg>
              </Link>
              <Link href="https://linkedin.com/in/jinukeu" target="_blank" rel="noopener noreferrer" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors" aria-label="LinkedIn">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </Link>
              <ThemeToggle />
            </div>
          </div>
        </div>
      </header>

      {/* Medium-style Main Content */}
      <main className="max-w-content mx-auto px-8 py-12">
        {/* Medium-style Category Tabs */}
        <div className="mb-10">
          <CategoryTabs
            categories={mainCategories}
            selectedCategory={selectedMainCategory}
            onSelect={(categoryId) => {
              setSelectedMainCategory(categoryId);
              setSelectedSubCategory('all');
            }}
          />
        </div>

        {/* Sub-category Pills */}
        {subCategories.length > 0 && (
          <div className="mb-10">
            <CategoryPills
              categories={subCategories}
              selectedCategory={selectedSubCategory}
              onSelect={setSelectedSubCategory}
            />
          </div>
        )}

        {/* Medium-style Article List */}
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {loading ? (
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {[1, 2, 3].map((i) => (
                <PostCardSkeleton key={i} />
              ))}
            </div>
          ) : filteredPosts.length > 0 ? (
            filteredPosts.map((post) => (
              <article key={post.slug} className="group py-10 first:pt-0">
                <Link href={`/blog/${post.slug}`} className="block">
                  <div className="flex gap-8 items-start">
                    {/* 콘텐츠 */}
                    <div className="flex-1 min-w-0">
                      <div className="space-y-3">
                        <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors leading-tight tracking-tight">
                          {post.title}
                        </h2>

                        <p className="text-base text-gray-600 dark:text-gray-400 line-clamp-2 leading-relaxed">
                          {post.excerpt}
                        </p>

                        <div className="flex items-center gap-3 text-sm text-gray-500 dark:text-gray-500">
                          <span>{post.author || '이진욱'}</span>
                          <span>·</span>
                          <time dateTime={post.date}>
                            {new Date(post.date).toLocaleDateString('ko-KR', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </time>
                          {post.readTime && (
                            <>
                              <span>·</span>
                              <span>{post.readTime}</span>
                            </>
                          )}
                        </div>

                        {(post.mainCategories || post.subCategories) && (
                          <div className="flex flex-wrap gap-2 pt-2">
                            {post.mainCategories?.slice(0, 2).map((catId) => {
                              const category = mainCategories.find((c) => c.id === catId);
                              return category ? (
                                <span
                                  key={catId}
                                  className="px-3 py-1 text-xs bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full"
                                >
                                  {category.name}
                                </span>
                              ) : null;
                            })}
                            {post.subCategories?.slice(0, 2).map((catId) => {
                              const category = subCategories.find((c) => c.id === catId);
                              return category ? (
                                <span
                                  key={catId}
                                  className="px-3 py-1 text-xs bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full"
                                >
                                  {category.name}
                                </span>
                              ) : null;
                            })}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* 썸네일 이미지 (오른쪽, Medium 스타일) */}
                    {post.thumbnail && (
                      <div className="hidden sm:block w-28 h-28 flex-shrink-0">
                        <Image
                          src={post.thumbnail}
                          alt={post.title}
                          width={112}
                          height={112}
                          className="object-cover w-full h-full"
                          quality={85}
                        />
                      </div>
                    )}
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
      <footer className="border-t border-gray-200 dark:border-gray-700 mt-20">
        <div className="max-w-content mx-auto px-8 py-12">
          <div className="text-center text-sm text-gray-500 dark:text-gray-400">
            © jinukeu
          </div>
        </div>
      </footer>
    </div>
    </>
  );
}
