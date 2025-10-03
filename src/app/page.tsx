import Link from "next/link";
import { getAllPosts } from "@/lib/markdown";
import { ThemeToggle } from "@/components/ThemeToggle";

export default async function Home() {
  const posts = getAllPosts();

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Toss Tech 스타일 헤더 */}
      <header className="bg-white dark:bg-gray-900 border-b border-neutral-100 dark:border-gray-800 sticky top-0 z-50">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="flex items-center justify-between h-[59px]">
            <Link href="/" className="flex items-center">
              <span className="text-xl font-bold text-neutral-900 dark:text-white">jinukeu.log</span>
            </Link>
            <div className="flex items-center space-x-8">
              <nav className="flex items-center space-x-8">
                <Link href="/" className="text-neutral-700 dark:text-gray-300 hover:text-primary-500 dark:hover:text-primary-400 font-medium text-sm transition-colors">
                  추천
                </Link>
                <Link href="/" className="text-neutral-700 dark:text-gray-300 hover:text-primary-500 dark:hover:text-primary-400 font-medium text-sm transition-colors">
                  전체
                </Link>
                <Link href="/" className="text-neutral-700 dark:text-gray-300 hover:text-primary-500 dark:hover:text-primary-400 font-medium text-sm transition-colors">
                  개발
                </Link>
                <Link href="/" className="text-neutral-700 dark:text-gray-300 hover:text-primary-500 dark:hover:text-primary-400 font-medium text-sm transition-colors">
                  일상
                </Link>
              </nav>
              <ThemeToggle />
            </div>
          </div>
        </div>
      </header>

      {/* Toss Tech 스타일 메인 콘텐츠 */}
      <main className="max-w-[1200px] mx-auto px-6 py-8">
        {/* 카테고리 필터 */}
        <div className="flex items-center space-x-8 mb-12 pb-4 border-b border-neutral-100 dark:border-gray-800">
          <button className="text-neutral-900 dark:text-white font-semibold border-b-2 border-primary-500 pb-2">
            추천
          </button>
          <button className="text-neutral-500 dark:text-gray-400 hover:text-neutral-900 dark:hover:text-white font-medium pb-2 transition-colors">
            전체
          </button>
                    <button className="text-neutral-500 dark:text-gray-400 hover:text-neutral-900 dark:hover:text-white font-medium pb-2 transition-colors">
            개발
          </button>
                    <button className="text-neutral-500 dark:text-gray-400 hover:text-neutral-900 dark:hover:text-white font-medium pb-2 transition-colors">
            일상
          </button>
        </div>

        {/* 아티클 그리드 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.length > 0 ? (
            posts.map((post) => (
              <article key={post.slug} className="group">
                <Link href={`/blog/${post.slug}`}>
                  <div className="bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 rounded-lg overflow-hidden border border-gray-100 dark:border-gray-700">
                    {/* 썸네일 이미지 */}
                    <div className="w-full h-48 bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-900 dark:to-emerald-800 flex items-center justify-center overflow-hidden">
                      {post.thumbnail ? (
                        <img
                          src={post.thumbnail}
                          alt={post.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="text-4xl">🧩</div>
                      )}
                    </div>

                    {/* 콘텐츠 */}
                    <div className="space-y-3 p-4">
                      <h2 className="text-xl font-bold text-neutral-900 dark:text-white group-hover:text-primary-500 dark:group-hover:text-primary-400 transition-colors line-clamp-2 leading-tight">
                        {post.title}
                      </h2>

                      <p className="text-neutral-600 dark:text-gray-300 text-sm line-clamp-2 leading-relaxed">
                        {post.excerpt}
                      </p>

                      <div className="flex items-center justify-between text-xs text-neutral-400 dark:text-gray-500">
                        <span>{post.author || '이진욱'}</span>
                        <time dateTime={post.date}>
                          {new Date(post.date).toLocaleDateString('ko-KR', {
                            month: 'long',
                            day: 'numeric'
                          })}
                        </time>
                      </div>

                      {post.tags && post.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {post.tags.slice(0, 2).map((tag) => (
                            <span
                              key={tag}
                              className="px-2 py-1 text-xs font-medium bg-neutral-100 dark:bg-gray-700 text-neutral-600 dark:text-gray-300 rounded"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </Link>
              </article>
            ))
          ) : (
            <div className="col-span-full text-center py-20">
              <div className="text-6xl mb-6">📝</div>
              <h3 className="text-2xl font-bold text-neutral-900 dark:text-white mb-4">
                첫 번째 글을 기다리고 있어요
              </h3>
              <p className="text-neutral-600 dark:text-gray-400 text-lg max-w-md mx-auto leading-relaxed">
                아직 게시된 글이 없습니다. 곧 흥미로운 콘텐츠로 채워질 예정이에요!
              </p>
            </div>
          )}
        </div>
      </main>
      <footer className="bg-neutral-50 dark:bg-gray-800 mt-20">
        <div className="max-w-[1200px] mx-auto px-6 py-12">
          <div className="text-center text-sm text-neutral-500 dark:text-gray-400">
            © Jinukeu Blog. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
