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
    <div className="min-h-screen bg-neutral-50">
      {/* Toss 스타일 내비게이션 */}
      <nav className="bg-white shadow-card sticky top-0 z-50 backdrop-blur-sm bg-white/95">
        <div className="max-w-4xl mx-auto px-6">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="text-xl font-bold text-neutral-900 hover:text-primary-500 transition-colors">
              Modern Blog
            </Link>
            <div className="flex items-center space-x-6">
              <Link 
                href="/blog" 
                className="text-neutral-600 hover:text-primary-500 font-medium transition-colors"
              >
                모든 글
              </Link>
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

      <main className="max-w-4xl mx-auto px-6 py-16">
        {/* Toss 스타일 백 버튼 */}
        <div className="mb-12">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-neutral-600 hover:text-primary-500 font-medium transition-colors duration-200"
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
          {/* Toss 스타일 아티클 헤더 */}
          <header className="mb-16">
            <h1 className="text-5xl lg:text-6xl font-bold text-neutral-900 mb-8 leading-tight">
              {post.title}
            </h1>
            
            <div className="flex flex-wrap items-center gap-4 text-neutral-500 mb-8">
              <time dateTime={post.date} className="font-medium">
                {new Date(post.date).toLocaleDateString('ko-KR', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </time>
              {post.author && (
                <>
                  <span className="text-neutral-300">•</span>
                  <span className="font-medium">{post.author}</span>
                </>
              )}
              {post.readTime && (
                <>
                  <span className="text-neutral-300">•</span>
                  <span className="font-medium">{post.readTime}</span>
                </>
              )}
            </div>

            {post.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1.5 text-sm font-medium bg-primary-50 text-primary-700 rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </header>

          {/* Toss 스타일 아티클 콘텐츠 */}
          <div className="bg-white rounded-xl shadow-card p-8 lg:p-12">
            <div
              className="prose prose-lg max-w-none prose-headings:text-neutral-900 prose-p:text-neutral-700 prose-strong:text-neutral-900 prose-a:text-primary-500 hover:prose-a:text-primary-600 prose-code:bg-neutral-100 prose-code:text-neutral-800 prose-code:rounded prose-code:px-2 prose-code:py-0.5 prose-pre:bg-neutral-100 prose-pre:border prose-pre:border-neutral-200 prose-pre:rounded-xl prose-blockquote:border-l-primary-500 prose-blockquote:text-neutral-600 prose-li:text-neutral-700"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          </div>
        </article>

        {/* Toss 스타일 내비게이션 */}
        <div className="mt-16 pt-8 border-t border-neutral-200">
          <div className="flex flex-col sm:flex-row gap-4 justify-between">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 px-6 py-3 border border-neutral-200 text-neutral-700 rounded-xl font-semibold hover:bg-neutral-50 transition-all duration-200 hover:shadow-card hover:-translate-y-0.5"
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
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary-500 text-white rounded-xl font-semibold hover:bg-primary-600 transition-all duration-200 hover:shadow-soft hover:-translate-y-0.5"
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

      {/* Toss 스타일 푸터 */}
      <footer className="bg-white border-t border-neutral-100 mt-20">
        <div className="max-w-4xl mx-auto px-6 py-12">
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