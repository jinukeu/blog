import Link from "next/link";
import { getAllPosts } from "@/lib/markdown";
import { BlogPostMeta } from "@/types/blog";

// Blog post card component with modern design
function BlogPostCard({ post }: { post: BlogPostMeta & { slug: string } }) {
  return (
    <article className="group relative">
      <Link href={`/blog/${post.slug}`}>
        <div className="bg-white rounded-xl shadow-card p-6 h-full hover:shadow-soft transition-all duration-200 hover:-translate-y-1">
          <div className="flex flex-col gap-3">
            {/* Post metadata */}
            <div className="flex items-center justify-between text-sm">
              <time 
                dateTime={post.date}
                className="text-neutral-500 font-medium"
              >
                {new Date(post.date).toLocaleDateString('ko-KR', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </time>
              {post.author && (
                <span className="text-neutral-500 font-medium">
                  {post.author}
                </span>
              )}
            </div>

            {/* Title */}
            <h2 className="text-xl font-bold text-neutral-900 group-hover:text-primary-500 transition-colors duration-200 line-clamp-2">
              {post.title}
            </h2>

            {/* Excerpt */}
            <p className="text-neutral-600 leading-relaxed line-clamp-2 text-sm">
              {post.excerpt}
            </p>

            {/* Tags */}
            {post.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {post.tags.slice(0, 3).map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 text-sm font-medium bg-primary-50 text-primary-700 rounded-full"
                  >
                    {tag}
                  </span>
                ))}
                {post.tags.length > 3 && (
                  <span className="px-2 py-1 text-xs font-medium text-black/50 dark:text-white/50">
                    +{post.tags.length - 3}
                  </span>
                )}
              </div>
            )}

            {/* Read more indicator */}
            <div className="flex items-center text-sm font-medium text-primary-500 group-hover:text-primary-600 transition-colors duration-200">
              읽어보기
              <svg
                className="ml-1 w-4 h-4 transition-transform duration-200 group-hover:translate-x-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </div>
          </div>
        </div>
      </Link>
    </article>
  );
}

export default async function BlogPage() {
  const posts = getAllPosts();

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Toss 스타일 내비게이션 */}
      <nav className="bg-white shadow-card sticky top-0 z-50 backdrop-blur-sm bg-white/95">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="text-xl font-bold text-neutral-900 hover:text-primary-500 transition-colors">
              Modern Blog
            </Link>
            <div className="flex items-center space-x-6">
              <Link 
                href="/" 
                className="text-neutral-600 hover:text-primary-500 font-medium transition-colors"
              >
                홈으로
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-6 py-16">
        {/* Toss 스타일 헤더 */}
        <div className="mb-16">
          <h1 className="text-5xl font-bold text-neutral-900 mb-6 leading-tight">
            모든 게시글
          </h1>
          <p className="text-xl text-neutral-600 max-w-2xl leading-relaxed">
            지금까지 작성한 모든 글들을 한눈에 보실 수 있습니다
          </p>
        </div>

        {/* Toss 스타일 통계 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          <div className="text-center p-6 bg-white rounded-xl shadow-card hover:shadow-soft transition-all duration-200 hover:-translate-y-1">
            <div className="text-3xl font-bold text-neutral-900 mb-2">
              {posts.length}
            </div>
            <div className="text-neutral-600 font-medium">
              전체 글
            </div>
          </div>
          <div className="text-center p-6 bg-white rounded-xl shadow-card hover:shadow-soft transition-all duration-200 hover:-translate-y-1">
            <div className="text-3xl font-bold text-neutral-900 mb-2">
              {Array.from(new Set(posts.flatMap(post => post.tags || []))).length}
            </div>
            <div className="text-neutral-600 font-medium">
              주제 수
            </div>
          </div>
          <div className="text-center p-6 bg-white rounded-xl shadow-card hover:shadow-soft transition-all duration-200 hover:-translate-y-1">
            <div className="text-3xl font-bold text-neutral-900 mb-2">
              {posts.filter(post => post.author).length}
            </div>
            <div className="text-neutral-600 font-medium">
              작성자별 글
            </div>
          </div>
          <div className="text-center p-6 bg-white rounded-xl shadow-card hover:shadow-soft transition-all duration-200 hover:-translate-y-1">
            <div className="text-3xl font-bold text-neutral-900 mb-2">
              2024
            </div>
            <div className="text-neutral-600 font-medium">
              시작 연도
            </div>
          </div>
        </div>

        {/* Toss 스타일 블로그 포스트 그리드 */}
        {posts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {posts.map((post) => (
              <BlogPostCard key={post.slug} post={post} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="text-6xl mb-6">📝</div>
            <h2 className="text-3xl font-bold text-neutral-900 mb-4">
              첫 번째 글을 기다리고 있어요
            </h2>
            <p className="text-neutral-600 max-w-md mx-auto mb-8 leading-relaxed">
              아직 게시된 글이 없습니다. 곧 흥미로운 콘텐츠로 채워질 예정이에요!
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-8 py-4 bg-primary-500 text-white rounded-xl font-semibold hover:bg-primary-600 transition-all duration-200 hover:shadow-soft hover:-translate-y-0.5"
            >
              홈으로 돌아가기
            </Link>
          </div>
        )}
      </main>

      {/* Toss 스타일 푸터 */}
      <footer className="bg-white border-t border-neutral-100 mt-20">
        <div className="max-w-6xl mx-auto px-6 py-12">
          <div className="text-center">
            <h3 className="text-xl font-bold text-neutral-900 mb-4">
              Modern Blog
            </h3>
            <p className="text-neutral-600 mb-6 max-w-md mx-auto leading-relaxed">
              현대적인 디자인과 깔끔한 사용자 경험을 제공하는 개발 블로그
            </p>
            <div className="text-sm text-neutral-500 font-medium">
              © 2024 Modern Blog. Made with Next.js
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}