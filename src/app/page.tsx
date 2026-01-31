'use client';

import Link from "next/link";
import Image from "next/image";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useEffect, useState } from "react";
import { Category } from "@/types/blog";
import { WebsiteJsonLd } from "@/components/JsonLd";
import { CategoryTabs, CategoryPills } from "@/components/ui/CategoryTabs";
import { PostCardSkeleton } from "@/components/ui/Skeleton";
import { HeroSection } from "@/components/HeroSection";
import { Footer } from "@/components/Footer";

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

      const hasRecommended = categoriesData.mainCategories?.some(
        (cat: Category) => cat.id === 'recommended'
      );

      if (!hasRecommended) {
        setSelectedMainCategory('all');
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredPosts = posts.filter((post) => {
    if (selectedMainCategory !== 'all') {
      if (!post.mainCategories?.includes(selectedMainCategory)) {
        return false;
      }
    }

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

      <div className="min-h-screen bg-background">
        {/* Monochrome Header */}
        <header className="border-b border-border sticky top-0 z-50 nav-blur">
          <div className="max-w-content mx-auto px-6 md:px-8 py-4">
            <div className="flex items-center justify-between">
              <Link href="/" className="flex items-center">
                <span className="text-2xl font-bold text-foreground tracking-tighter">jinukeu</span>
              </Link>
              <div className="flex items-center gap-5">
                {process.env.NODE_ENV === 'development' && (
                  <Link
                    href="/admin/drafts"
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Draft
                  </Link>
                )}
                <Link
                  href="https://github.com/jinukeu"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                  aria-label="GitHub"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                  </svg>
                </Link>
                <ThemeToggle />
              </div>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <HeroSection
          title="이진욱의 기술 블로그"
          subtitle="Android 개발 경험과 인사이트를 공유합니다"
        />

        {/* Main Content */}
        <main className="max-w-content mx-auto px-6 md:px-8 pb-12">
          {/* Category Tabs */}
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

          {/* Article Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {loading ? (
              <>
                {[1, 2, 3, 4].map((i) => (
                  <PostCardSkeleton key={i} />
                ))}
              </>
            ) : filteredPosts.length > 0 ? (
              filteredPosts.map((post) => (
                <article
                  key={post.slug}
                  className="group border border-border rounded-lg overflow-hidden card-hover bg-card"
                >
                  <Link href={`/blog/${post.slug}`} className="block">
                    {/* Thumbnail */}
                    {post.thumbnail ? (
                      <div className="aspect-[16/9] relative bg-muted overflow-hidden">
                        <Image
                          src={post.thumbnail}
                          alt={post.title}
                          fill
                          className="object-cover transition-transform duration-300 group-hover:scale-105"
                          quality={85}
                        />
                      </div>
                    ) : (
                      <div className="aspect-[16/9] bg-muted flex items-center justify-center">
                        <span className="text-muted-foreground text-4xl">
                          {post.title.charAt(0)}
                        </span>
                      </div>
                    )}

                    {/* Content */}
                    <div className="p-5">
                      {/* Categories */}
                      {(post.mainCategories || post.subCategories) && (
                        <div className="flex flex-wrap gap-2 mb-3">
                          {post.mainCategories?.slice(0, 1).map((catId) => {
                            const category = mainCategories.find((c) => c.id === catId);
                            return category ? (
                              <span
                                key={catId}
                                className="px-2 py-0.5 text-xs bg-foreground/10 text-foreground rounded"
                              >
                                {category.name}
                              </span>
                            ) : null;
                          })}
                        </div>
                      )}

                      {/* Title */}
                      <h2 className="text-lg font-semibold text-foreground mb-2 line-clamp-2 leading-snug tracking-tight group-hover:text-foreground/80 transition-colors">
                        {post.title}
                      </h2>

                      {/* Excerpt */}
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                        {post.excerpt}
                      </p>

                      {/* Meta */}
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <time dateTime={post.date}>
                          {new Date(post.date).toLocaleDateString('ko-KR', {
                            year: 'numeric',
                            month: 'short',
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
                    </div>
                  </Link>
                </article>
              ))
            ) : (
              <div className="col-span-full text-center py-20">
                <div className="text-5xl mb-6 opacity-50">∅</div>
                <h3 className="text-xl font-semibold text-foreground mb-3">
                  {selectedMainCategory !== 'all' || selectedSubCategory !== 'all'
                    ? '해당 카테고리에 글이 없습니다'
                    : '첫 번째 글을 기다리고 있어요'}
                </h3>
                <p className="text-muted-foreground max-w-md mx-auto">
                  {selectedMainCategory !== 'all' || selectedSubCategory !== 'all'
                    ? '다른 카테고리를 선택해보세요.'
                    : '아직 게시된 글이 없습니다. 곧 흥미로운 콘텐츠로 채워질 예정이에요!'}
                </p>
              </div>
            )}
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
}
