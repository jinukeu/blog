import Link from "next/link";
import { getAllPosts } from "@/lib/markdown";
import { BlogPostMeta } from "@/types/blog";

// Blog post card component with modern design
function BlogPostCard({ post }: { post: BlogPostMeta & { slug: string } }) {
  return (
    <article className="group relative">
      <Link href={`/blog/${post.slug}`}>
        <div className="relative p-6 bg-white/50 dark:bg-white/[0.02] border border-black/[0.06] dark:border-white/[0.08] rounded-2xl backdrop-blur-sm transition-all duration-300 hover:bg-white/80 dark:hover:bg-white/[0.04] hover:border-black/[0.12] dark:hover:border-white/[0.16] hover:shadow-lg hover:shadow-black/[0.04] dark:hover:shadow-black/[0.2] hover:-translate-y-1">
          <div className="flex flex-col gap-3">
            {/* Post metadata */}
            <div className="flex items-center justify-between text-sm">
              <time 
                dateTime={post.date}
                className="text-black/60 dark:text-white/60 font-medium"
              >
                {new Date(post.date).toLocaleDateString('ko-KR', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </time>
              {post.author && (
                <span className="text-black/60 dark:text-white/60 font-medium">
                  {post.author}
                </span>
              )}
            </div>

            {/* Title */}
            <h2 className="text-xl font-bold text-black dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200 line-clamp-2">
              {post.title}
            </h2>

            {/* Excerpt */}
            <p className="text-black/80 dark:text-white/80 leading-relaxed line-clamp-2 text-sm">
              {post.excerpt}
            </p>

            {/* Tags */}
            {post.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {post.tags.slice(0, 3).map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-1 text-xs font-medium bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-full border border-blue-100 dark:border-blue-800/30"
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
            <div className="flex items-center text-sm font-medium text-blue-600 dark:text-blue-400 group-hover:text-blue-700 dark:group-hover:text-blue-300 transition-colors duration-200">
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-slate-950 dark:via-black dark:to-blue-950">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 backdrop-blur-xl bg-white/80 dark:bg-black/80 border-b border-black/[0.06] dark:border-white/[0.08]">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="text-2xl font-bold text-black dark:text-white tracking-tight">
              Modern Blog
            </Link>
            <div className="flex items-center gap-6">
              <Link 
                href="/" 
                className="text-black/80 dark:text-white/80 hover:text-black dark:hover:text-white font-medium transition-colors duration-200"
              >
                홈으로
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl lg:text-5xl font-bold text-black dark:text-white mb-4 tracking-tight">
            모든 게시글
          </h1>
          <p className="text-lg text-black/70 dark:text-white/70">
            지금까지 작성한 모든 글들을 한눈에 보실 수 있습니다
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="text-center p-4 bg-white/30 dark:bg-white/[0.02] backdrop-blur-sm rounded-xl border border-black/[0.06] dark:border-white/[0.08]">
            <div className="text-2xl font-bold text-black dark:text-white mb-1">
              {posts.length}
            </div>
            <div className="text-sm text-black/70 dark:text-white/70 font-medium">
              전체 글
            </div>
          </div>
          <div className="text-center p-4 bg-white/30 dark:bg-white/[0.02] backdrop-blur-sm rounded-xl border border-black/[0.06] dark:border-white/[0.08]">
            <div className="text-2xl font-bold text-black dark:text-white mb-1">
              {Array.from(new Set(posts.flatMap(post => post.tags || []))).length}
            </div>
            <div className="text-sm text-black/70 dark:text-white/70 font-medium">
              주제 수
            </div>
          </div>
          <div className="text-center p-4 bg-white/30 dark:bg-white/[0.02] backdrop-blur-sm rounded-xl border border-black/[0.06] dark:border-white/[0.08]">
            <div className="text-2xl font-bold text-black dark:text-white mb-1">
              {posts.filter(post => post.author).length}
            </div>
            <div className="text-sm text-black/70 dark:text-white/70 font-medium">
              작성자별 글
            </div>
          </div>
          <div className="text-center p-4 bg-white/30 dark:bg-white/[0.02] backdrop-blur-sm rounded-xl border border-black/[0.06] dark:border-white/[0.08]">
            <div className="text-2xl font-bold text-black dark:text-white mb-1">
              2024
            </div>
            <div className="text-sm text-black/70 dark:text-white/70 font-medium">
              시작 연도
            </div>
          </div>
        </div>

        {/* Blog Posts Grid */}
        {posts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {posts.map((post) => (
              <BlogPostCard key={post.slug} post={post} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="text-6xl mb-6">📝</div>
            <h2 className="text-3xl font-bold text-black dark:text-white mb-4">
              첫 번째 글을 기다리고 있어요
            </h2>
            <p className="text-black/70 dark:text-white/70 max-w-md mx-auto mb-8">
              아직 게시된 글이 없습니다. 곧 흥미로운 콘텐츠로 채워질 예정이에요!
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 dark:bg-blue-500 text-white rounded-xl font-semibold hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors duration-300"
            >
              홈으로 돌아가기
            </Link>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-black/[0.06] dark:border-white/[0.08] bg-white/30 dark:bg-white/[0.02] backdrop-blur-sm mt-20">
        <div className="max-w-6xl mx-auto px-6 lg:px-8 py-12">
          <div className="text-center">
            <h3 className="text-2xl font-bold text-black dark:text-white mb-4">
              Modern Blog
            </h3>
            <p className="text-black/70 dark:text-white/70 mb-6 max-w-md mx-auto">
              현대적인 디자인과 깔끔한 사용자 경험을 제공하는 개발 블로그
            </p>
            <div className="text-sm text-black/50 dark:text-white/50">
              © 2024 Modern Blog. Made with Next.js and ❤️
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}