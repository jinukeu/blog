import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getPostBySlug } from '@/lib/markdown';
import BlurredNavigation from './BlurredNavigation';

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function BlogPost({ params }: Props) {
  const { slug } = await params;
  let post;
  
  try {
    post = await getPostBySlug(slug);
  } catch {
    notFound();
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Modern Blurred Navigation */}
      <BlurredNavigation />

      <main className="max-w-3xl mx-auto px-6 pt-20 pb-12 md:pt-24 md:pb-16">

        <article>
          {/* Modern Article Header with Enhanced Glassmorphism */}
          <header className="mb-12">
            {post.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-4 py-2 text-sm font-medium 
                             backdrop-blur-sm bg-primary-50/80 text-primary-700 
                             border border-primary-200/50 rounded-full
                             hover:bg-primary-100/80 hover:border-primary-300/50
                             transition-all duration-300 hover:scale-105"
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
              <time dateTime={post.date} 
                    className="font-medium px-3 py-1 backdrop-blur-sm bg-gray-50/80 rounded-full
                             border border-gray-200/50 hover:bg-gray-100/80 transition-all duration-300">
                {new Date(post.date).toLocaleDateString('ko-KR', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </time>
              {post.author && (
                <>
                  <span className="text-gray-300">•</span>
                  <span className="font-medium px-3 py-1 backdrop-blur-sm bg-gray-50/80 rounded-full
                               border border-gray-200/50 hover:bg-gray-100/80 transition-all duration-300">
                    {post.author}
                  </span>
                </>
              )}
              {post.readTime && (
                <>
                  <span className="text-gray-300">•</span>
                  <span className="font-medium px-3 py-1 backdrop-blur-sm bg-gray-50/80 rounded-full
                               border border-gray-200/50 hover:bg-gray-100/80 transition-all duration-300">
                    {post.readTime}
                  </span>
                </>
              )}
            </div>
          </header>

          {/* Modern Article Content with Enhanced Styling */}
          <div
            className="prose prose-lg max-w-none
            prose-headings:font-bold prose-headings:text-gray-900 prose-headings:leading-tight
            prose-h1:text-3xl prose-h1:mt-12 prose-h1:mb-6
            prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-5
            prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-4
            prose-p:text-gray-700 prose-p:leading-relaxed prose-p:mb-6
            prose-strong:text-gray-900 prose-strong:font-semibold
            prose-a:text-primary-600 prose-a:font-medium prose-a:no-underline hover:prose-a:text-primary-700 prose-a:transition-colors
            prose-blockquote:border-l-4 prose-blockquote:border-primary-200 prose-blockquote:bg-primary-50/50 
            prose-blockquote:py-4 prose-blockquote:px-6 prose-blockquote:text-gray-700 prose-blockquote:not-italic
            prose-blockquote:backdrop-blur-sm prose-blockquote:rounded-r-lg
            prose-code:bg-gray-100/80 prose-code:text-gray-800 prose-code:px-2 prose-code:py-1 prose-code:rounded prose-code:text-sm prose-code:font-medium prose-code:before:content-none prose-code:after:content-none
            prose-code:backdrop-blur-sm prose-code:border prose-code:border-gray-200/50
            prose-pre:bg-gray-50/80 prose-pre:border prose-pre:border-gray-200/50 prose-pre:rounded-lg prose-pre:p-4 prose-pre:overflow-x-auto
            prose-pre:backdrop-blur-sm prose-pre:shadow-sm
            prose-ul:my-6 prose-ol:my-6 prose-li:text-gray-700 prose-li:leading-relaxed prose-li:mb-2
            prose-img:rounded-lg prose-img:shadow-lg prose-img:border prose-img:border-gray-200/50
            prose-hr:border-gray-200 prose-hr:my-8"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </article>

      </main>

      {/* Modern Glassmorphism Footer */}
      <footer className="border-t border-gray-200/50 mt-20 backdrop-blur-sm bg-gray-50/30">
        <div className="max-w-3xl mx-auto px-6 py-8">
          <div className="text-center">
            <div className="text-sm text-gray-500 font-medium 
                          px-4 py-2 backdrop-blur-sm bg-white/50 rounded-full 
                          border border-gray-200/50 inline-block">
              © 2024 Jinukeu Blog
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}