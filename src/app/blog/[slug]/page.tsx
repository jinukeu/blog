import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getPostBySlug, getAllSlugs } from '@/lib/markdown';
import { Metadata } from 'next';

interface Props {
  params: { slug: string };
}

export async function generateStaticParams() {
  const slugs = getAllSlugs();
  return slugs.map((slug) => ({
    slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const post = await getPostBySlug(params.slug);
    return {
      title: post.title,
      description: post.excerpt,
      openGraph: {
        title: post.title,
        description: post.excerpt,
        type: 'article',
        publishedTime: post.date,
        authors: post.author ? [post.author] : undefined,
        tags: post.tags,
      },
    };
  } catch {
    return {
      title: 'Post Not Found',
    };
  }
}

export default async function BlogPost({ params }: Props) {
  let post;
  try {
    post = await getPostBySlug(params.slug);
  } catch {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-slate-950 dark:via-black dark:to-blue-950">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 backdrop-blur-xl bg-white/80 dark:bg-black/80 border-b border-black/[0.06] dark:border-white/[0.08]">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="text-2xl font-bold text-black dark:text-white tracking-tight">
              Modern Blog
            </Link>
            <div className="flex items-center gap-6">
              <Link 
                href="/blog" 
                className="text-black/80 dark:text-white/80 hover:text-black dark:hover:text-white font-medium transition-colors duration-200"
              >
                모든 글
              </Link>
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

      <main className="max-w-4xl mx-auto px-6 lg:px-8 py-12">
        {/* Back Button */}
        <div className="mb-8">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-black/70 dark:text-white/70 hover:text-black dark:hover:text-white font-medium transition-colors duration-200"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            모든 글로 돌아가기
          </Link>
        </div>

        <article>
          {/* Article Header */}
          <header className="mb-12">
            <h1 className="text-4xl lg:text-5xl font-bold text-black dark:text-white mb-6 tracking-tight leading-tight">
              {post.title}
            </h1>
            
            <div className="flex flex-wrap items-center gap-4 text-black/60 dark:text-white/60 mb-6">
              <time dateTime={post.date} className="font-medium">
                {new Date(post.date).toLocaleDateString('ko-KR', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </time>
              {post.author && (
                <>
                  <span className="text-black/30 dark:text-white/30">•</span>
                  <span className="font-medium">{post.author}</span>
                </>
              )}
              {post.readTime && (
                <>
                  <span className="text-black/30 dark:text-white/30">•</span>
                  <span className="font-medium">{post.readTime}</span>
                </>
              )}
            </div>

            {post.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1.5 text-sm font-medium bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-full border border-blue-100 dark:border-blue-800/30"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </header>

          {/* Article Content */}
          <div className="bg-white/50 dark:bg-white/[0.02] backdrop-blur-sm border border-black/[0.06] dark:border-white/[0.08] rounded-2xl p-8 lg:p-12">
            <div
              className="prose prose-lg max-w-none prose-headings:text-black dark:prose-headings:text-white prose-p:text-black/80 dark:prose-p:text-white/80 prose-strong:text-black dark:prose-strong:text-white prose-a:text-blue-600 dark:prose-a:text-blue-400 hover:prose-a:text-blue-700 dark:hover:prose-a:text-blue-300 prose-code:bg-black/5 dark:prose-code:bg-white/10 prose-code:text-black dark:prose-code:text-white prose-code:rounded prose-code:px-1 prose-code:py-0.5 prose-pre:bg-black/5 dark:prose-pre:bg-white/5 prose-pre:border prose-pre:border-black/10 dark:prose-pre:border-white/10 prose-pre:rounded-xl prose-blockquote:border-l-blue-600 dark:prose-blockquote:border-l-blue-400 prose-blockquote:text-black/70 dark:prose-blockquote:text-white/70 prose-li:text-black/80 dark:prose-li:text-white/80"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          </div>
        </article>

        {/* Navigation */}
        <div className="mt-12 pt-8 border-t border-black/[0.06] dark:border-white/[0.08]">
          <div className="flex flex-col sm:flex-row gap-4 justify-between">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 px-6 py-3 bg-white/50 dark:bg-white/[0.02] border border-black/[0.06] dark:border-white/[0.08] text-black dark:text-white rounded-xl font-semibold hover:bg-white/80 dark:hover:bg-white/[0.04] hover:border-black/[0.12] dark:hover:border-white/[0.16] transition-all duration-300"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              모든 글 보기
            </Link>
            
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 dark:bg-blue-500 text-white rounded-xl font-semibold hover:bg-blue-700 dark:hover:bg-blue-600 transition-all duration-300"
            >
              홈으로 가기
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                />
              </svg>
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-black/[0.06] dark:border-white/[0.08] bg-white/30 dark:bg-white/[0.02] backdrop-blur-sm mt-20">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 py-12">
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