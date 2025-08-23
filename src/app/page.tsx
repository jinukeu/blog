import Link from "next/link";
import { getAllPosts } from "@/lib/markdown";

export default async function Home() {
  const posts = getAllPosts();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 테스트용 간단한 네비게이션 */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <Link href="/" className="text-xl font-bold text-gray-900">
              Modern Blog
            </Link>
            <Link 
              href="/blog" 
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              모든 글
            </Link>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* 히어로 섹션 */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            생각을 담는 <span className="text-blue-600">디지털 공간</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            개발과 디자인, 그리고 일상의 인사이트를 공유하는 현대적인 블로그입니다.
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              href="/blog"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              최신 글 보기
            </Link>
            <Link
              href="/blog"
              className="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
            >
              모든 글 둘러보기
            </Link>
          </div>
        </div>

        {/* 통계 섹션 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="text-center p-6 bg-white rounded-lg shadow-sm">
            <div className="text-3xl font-bold text-gray-900 mb-2">
              {posts.length}+
            </div>
            <div className="text-gray-600">게시된 글</div>
          </div>
          <div className="text-center p-6 bg-white rounded-lg shadow-sm">
            <div className="text-3xl font-bold text-gray-900 mb-2">
              {Array.from(new Set(posts.flatMap(post => post.tags || []))).length}+
            </div>
            <div className="text-gray-600">다양한 주제</div>
          </div>
          <div className="text-center p-6 bg-white rounded-lg shadow-sm">
            <div className="text-3xl font-bold text-gray-900 mb-2">2024+</div>
            <div className="text-gray-600">시작 연도</div>
          </div>
        </div>

        {/* 최근 게시글 */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            최근 게시글
          </h2>
          {posts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {posts.slice(0, 4).map((post) => (
                <article key={post.slug} className="bg-white rounded-lg shadow-sm p-6">
                  <Link href={`/blog/${post.slug}`}>
                    <div className="block hover:bg-gray-50 transition-colors rounded-lg p-2 -m-2">
                      <div className="flex items-center justify-between text-sm text-gray-500 mb-2">
                        <time dateTime={post.date}>
                          {new Date(post.date).toLocaleDateString('ko-KR')}
                        </time>
                        {post.author && <span>{post.author}</span>}
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-3 hover:text-blue-600 transition-colors">
                        {post.title}
                      </h3>
                      <p className="text-gray-600 mb-4 line-clamp-3">
                        {post.excerpt}
                      </p>
                      {post.tags && post.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {post.tags.slice(0, 3).map((tag) => (
                            <span
                              key={tag}
                              className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </Link>
                </article>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-4xl mb-4">📝</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                첫 번째 글을 기다리고 있어요
              </h3>
              <p className="text-gray-600">
                아직 게시된 글이 없습니다. 곧 흥미로운 콘텐츠로 채워질 예정이에요!
              </p>
            </div>
          )}
        </div>
      </main>

      {/* 푸터 */}
      <footer className="bg-white border-t">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h3 className="text-lg font-bold text-gray-900 mb-2">Modern Blog</h3>
            <p className="text-gray-600 mb-4">
              현대적인 디자인과 깔끔한 사용자 경험을 제공하는 개발 블로그
            </p>
            <div className="text-sm text-gray-500">
              © 2024 Modern Blog. Made with Next.js
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
