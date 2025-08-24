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
    <div className="min-h-screen bg-white">
      {/* Toss Tech 스타일 심플한 내비게이션 */}
      <nav className="bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-3xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <Link href="/" className="text-lg font-semibold text-gray-900 hover:text-primary-600 transition-colors">
              Modern Blog
            </Link>
            <Link 
              href="/" 
              className="text-gray-600 hover:text-gray-900 text-sm font-medium transition-colors"
            >
              홈으로
            </Link>
          </div>
        </div>
      </nav>

      <main className="max-w-3xl mx-auto px-6 py-12 md:py-16">
        {/* Toss Tech 스타일 백 버튼 */}
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-900 text-sm font-medium transition-colors"
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
                strokeWidth={1.5}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            홈으로 돌아가기
          </Link>
        </div>

        <article>
          {/* Toss Tech 스타일 아티클 헤더 */}
          <header className="mb-12">
            {post.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 text-sm font-medium bg-primary-50 text-primary-700 rounded-md"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
            
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight">
              {post.title}
            </h1>
            
            <div className="flex flex-wrap items-center gap-3 text-gray-500 text-sm">
              <time dateTime={post.date} className="font-medium">
                {new Date(post.date).toLocaleDateString('ko-KR', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </time>
              {post.author && (
                <>
                  <span className="text-gray-300">•</span>
                  <span className="font-medium">{post.author}</span>
                </>
              )}
              {post.readTime && (
                <>
                  <span className="text-gray-300">•</span>
                  <span className="font-medium">{post.readTime}</span>
                </>
              )}
            </div>
          </header>

          {/* Toss Tech 스타일 아티클 콘텐츠 */}
          <div
            className="prose prose-lg max-w-none
            prose-headings:font-bold prose-headings:text-gray-900 prose-headings:leading-tight
            prose-h1:text-3xl prose-h1:mt-12 prose-h1:mb-6
            prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-5
            prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-4
            prose-p:text-gray-700 prose-p:leading-relaxed prose-p:mb-6
            prose-strong:text-gray-900 prose-strong:font-semibold
            prose-a:text-primary-600 prose-a:font-medium prose-a:no-underline hover:prose-a:text-primary-700
            prose-blockquote:border-l-4 prose-blockquote:border-primary-200 prose-blockquote:bg-primary-50/50 
            prose-blockquote:py-4 prose-blockquote:px-6 prose-blockquote:text-gray-700 prose-blockquote:not-italic
            prose-code:bg-gray-100 prose-code:text-gray-800 prose-code:px-2 prose-code:py-1 prose-code:rounded prose-code:text-sm prose-code:font-medium prose-code:before:content-none prose-code:after:content-none
            prose-pre:bg-gray-50 prose-pre:border prose-pre:border-gray-200 prose-pre:rounded-lg prose-pre:p-4 prose-pre:overflow-x-auto
            prose-ul:my-6 prose-ol:my-6 prose-li:text-gray-700 prose-li:leading-relaxed prose-li:mb-2
            prose-img:rounded-lg prose-img:shadow-sm
            prose-hr:border-gray-200 prose-hr:my-8"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </article>

        {/* Toss Tech 스타일 하단 내비게이션 */}
        <div className="mt-16 pt-8 border-t border-gray-100">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 text-sm font-medium transition-colors"
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
                strokeWidth={1.5}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            홈으로 가기
          </Link>
        </div>
      </main>

      {/* Toss Tech 스타일 미니멀 푸터 */}
      <footer className="border-t border-gray-100 mt-20">
        <div className="max-w-3xl mx-auto px-6 py-8">
          <div className="text-center">
            <div className="text-sm text-gray-500 font-medium">
              © 2024 Modern Blog
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}