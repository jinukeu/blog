import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { getPostBySlug, getAllSlugs } from '@/lib/markdown';
import { getAllCategories } from '@/lib/category';
import BlurredNavigation from './BlurredNavigation';
import Comments from '@/components/Comments';
import { BlogPostJsonLd } from '@/components/JsonLd';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const slugs = getAllSlugs();
  return slugs.map((slug) => ({
    slug: slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug: rawSlug } = await params;
  const slug = decodeURIComponent(rawSlug);

  try {
    const post = await getPostBySlug(slug);
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://yourdomain.com';
    const url = `${baseUrl}/blog/${slug}`;
    const imageUrl = post.thumbnail ? `${baseUrl}${post.thumbnail}` : `${baseUrl}/og-default.png`;

    return {
      title: post.seoTitle || post.title,
      description: post.seoDescription || post.excerpt,
      keywords: post.seoKeywords || [...(post.mainCategories || []), ...(post.subCategories || [])],
      authors: [{ name: post.author || '이진욱' }],
      openGraph: {
        type: 'article',
        locale: 'ko_KR',
        url: url,
        title: post.seoTitle || post.title,
        description: post.seoDescription || post.excerpt,
        siteName: 'Jinukeu Blog',
        images: [
          {
            url: imageUrl,
            width: 1200,
            height: 630,
            alt: post.title,
          },
        ],
        publishedTime: post.date,
        authors: [post.author || '이진욱'],
      },
      twitter: {
        card: 'summary_large_image',
        title: post.seoTitle || post.title,
        description: post.seoDescription || post.excerpt,
        images: [imageUrl],
      },
      alternates: {
        canonical: url,
      },
    };
  } catch (error) {
    return {
      title: '포스트를 찾을 수 없습니다',
    };
  }
}

export default async function BlogPost({ params }: PageProps) {
  const { slug: rawSlug } = await params;
  const slug = decodeURIComponent(rawSlug);

  let post;
  try {
    post = await getPostBySlug(slug);
  } catch (error) {
    notFound();
  }

  const { mainCategories, subCategories } = await getAllCategories();
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://yourdomain.com';
  const url = `${baseUrl}/blog/${slug}`;
  const imageUrl = post.thumbnail ? `${baseUrl}${post.thumbnail}` : undefined;

  return (
    <>
      <BlogPostJsonLd
        title={post.seoTitle || post.title}
        description={post.seoDescription || post.excerpt}
        datePublished={post.date}
        author={post.author || '이진욱'}
        url={url}
        image={imageUrl}
        summary={post.summary}
        keyTakeaways={post.keyTakeaways}
      />

      <div className="min-h-screen bg-white dark:bg-gray-900">
        {/* Modern Blurred Navigation */}
        <BlurredNavigation />

      <main className="max-w-prose mx-auto px-8 pt-20 pb-12 md:pt-24 md:pb-16">

        <article>
          {/* Medium-style Article Header */}
          <header className="mb-12">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6 leading-tight tracking-tight">
              {post.title}
            </h1>

            <div className="space-y-4">
              <div className="flex items-center gap-2 text-base text-gray-600 dark:text-gray-400">
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
                <div className="flex flex-wrap gap-2">
                  {post.mainCategories?.map((catId) => {
                    const category = mainCategories.find((c) => c.id === catId);
                    return category ? (
                      <span
                        key={catId}
                        className="px-3 py-1 text-sm font-semibold bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 rounded-lg"
                      >
                        {category.name}
                      </span>
                    ) : null;
                  })}
                  {post.subCategories?.map((catId) => {
                    const category = subCategories.find((c) => c.id === catId);
                    return category ? (
                      <span
                        key={catId}
                        className="px-3 py-1 text-sm font-medium bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-lg"
                      >
                        {category.name}
                      </span>
                    ) : null;
                  })}
                </div>
              )}
            </div>
          </header>

          {/* Medium-style Article Content - Optimized for Readability */}
          <div
            className="prose-blog"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          {/* Medium-style Author Card */}
          <div className="mt-16 pt-12 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-start gap-6">
              <img
                src="https://github.com/jinukeu.png"
                alt="이진욱"
                className="w-20 h-20 rounded-full"
              />
              <div className="flex-1">
                <div className="mb-4">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">이진욱</h3>
                  <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed mb-4">안드로이드 개발자</p>
                  <div className="flex items-center gap-5">
                    <a
                      href="https://github.com/jinukeu"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-base text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors flex items-center gap-2"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                      </svg>
                      GitHub
                    </a>
                    <a
                      href="https://linkedin.com/in/jinukeu"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-base text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors flex items-center gap-2"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                      </svg>
                      LinkedIn
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </article>

        {/* Comments Section */}
        <Comments />

      </main>

      {/* Medium-style Footer */}
      <footer className="border-t border-gray-200 dark:border-gray-700 mt-20">
        <div className="max-w-prose mx-auto px-8 py-8">
          <div className="text-center text-sm text-gray-500 dark:text-gray-400">
            © jinukeu
          </div>
        </div>
      </footer>
    </div>
    </>
  );
}