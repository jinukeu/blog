import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { getPostBySlug, getAllSlugs, getAvailableLocales } from '@/lib/markdown';
import { getAllCategories } from '@/lib/category';
import BlurredNavigation from './BlurredNavigation';
import Comments from '@/components/Comments';
import { BlogPostJsonLd } from '@/components/JsonLd';
import { ReadingProgress } from '@/components/ReadingProgress';
import { TableOfContents } from '@/components/TableOfContents';
import { Footer } from '@/components/Footer';
import { locales, Locale } from '@/i18n/config';
import { getTranslations } from 'next-intl/server';

interface PageProps {
  params: Promise<{ slug: string; locale: string }>;
}

export async function generateStaticParams() {
  const params: { locale: string; slug: string }[] = [];
  for (const locale of locales) {
    const slugs = getAllSlugs(locale);
    for (const slug of slugs) {
      params.push({ locale, slug });
    }
  }
  return params;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug: rawSlug, locale } = await params;
  const slug = decodeURIComponent(rawSlug);

  const ogLocaleMap: Record<string, string> = {
    ko: 'ko_KR',
    en: 'en_US',
    ja: 'ja_JP',
  };

  try {
    const post = await getPostBySlug(slug, locale as Locale);
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://yourdomain.com';
    const url = `${baseUrl}/${locale}/blog/${slug}`;
    const imageUrl = post.thumbnail ? `${baseUrl}${post.thumbnail}` : `${baseUrl}/og-default.png`;

    // Build hreflang alternates
    const availableLocales = getAvailableLocales(slug);
    const languages: Record<string, string> = {};
    for (const loc of availableLocales) {
      languages[loc] = `${baseUrl}/${loc}/blog/${slug}`;
    }
    languages['x-default'] = `${baseUrl}/ko/blog/${slug}`;

    return {
      title: post.seoTitle || post.title,
      description: post.seoDescription || post.excerpt,
      keywords: post.seoKeywords || [...(post.mainCategories || []), ...(post.subCategories || [])],
      authors: [{ name: post.author || (locale === 'ko' ? '이진욱' : locale === 'ja' ? 'イ・ジヌク' : 'Jinwook Lee') }],
      openGraph: {
        type: 'article',
        locale: ogLocaleMap[locale] || 'ko_KR',
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
        authors: [post.author || (locale === 'ko' ? '이진욱' : locale === 'ja' ? 'イ・ジヌク' : 'Jinwook Lee')],
      },
      twitter: {
        card: 'summary_large_image',
        title: post.seoTitle || post.title,
        description: post.seoDescription || post.excerpt,
        images: [imageUrl],
      },
      alternates: {
        canonical: url,
        languages,
      },
    };
  } catch {
    const t = await getTranslations({ locale, namespace: 'posts' });
    return {
      title: t('notFound'),
    };
  }
}

export default async function BlogPost({ params }: PageProps) {
  const { slug: rawSlug, locale } = await params;
  const slug = decodeURIComponent(rawSlug);

  let post;
  try {
    post = await getPostBySlug(slug, locale as Locale);
  } catch {
    notFound();
  }

  const { mainCategories, subCategories } = await getAllCategories();
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://yourdomain.com';
  const url = `${baseUrl}/${locale}/blog/${slug}`;
  const imageUrl = post.thumbnail ? `${baseUrl}${post.thumbnail}` : undefined;

  const t = await getTranslations({ locale, namespace: 'author' });

  const dateLocaleMap: Record<string, string> = {
    ko: 'ko-KR',
    en: 'en-US',
    ja: 'ja-JP',
  };

  return (
    <>
      <BlogPostJsonLd
        title={post.seoTitle || post.title}
        description={post.seoDescription || post.excerpt}
        datePublished={post.date}
        author={post.author || t('name')}
        url={url}
        image={imageUrl}
        summary={post.summary}
        keyTakeaways={post.keyTakeaways}
        inLanguage={locale}
      />

      <div className="min-h-screen bg-background">
        {/* Reading Progress Bar */}
        <ReadingProgress />

        {/* Modern Blurred Navigation */}
        <BlurredNavigation />

        {/* Table of Contents - Fixed Position */}
        <aside
          className="hidden xl:block fixed top-24 w-48 max-h-[calc(100vh-8rem)] overflow-y-auto scrollbar-hide z-30"
          style={{ left: 'max(2rem, calc(50% - 28rem - 12rem))' }}
        >
          <TableOfContents />
        </aside>

        {/* Main Content */}
        <div className="max-w-prose mx-auto px-6 md:px-8 pt-20 pb-12 md:pt-24 md:pb-16">
          <main className="w-full">
              <article className="animate-fade-in-up">
                {/* Article Header */}
                <header className="mb-12">
                  <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6 leading-tight tracking-tighter">
                    {post.title}
                  </h1>

                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-base text-muted-foreground">
                      <span>{post.author || t('name')}</span>
                      <span>·</span>
                      <time dateTime={post.date}>
                        {new Date(post.date).toLocaleDateString(dateLocaleMap[locale] || 'ko-KR', {
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
                              className="px-3 py-1 text-sm font-medium bg-foreground text-background rounded-lg"
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
                              className="px-3 py-1 text-sm bg-foreground/5 text-muted-foreground rounded-lg"
                            >
                              {category.name}
                            </span>
                          ) : null;
                        })}
                      </div>
                    )}
                  </div>
                </header>

                {/* Article Content */}
                <div
                  className="prose-blog"
                  dangerouslySetInnerHTML={{ __html: post.content }}
                />

                {/* Author Card */}
                <div className="mt-16 pt-12 border-t border-border">
                  <div className="flex items-start gap-6">
                    <img
                      src="https://github.com/jinukeu.png"
                      alt={t('name')}
                      className="w-16 h-16 rounded-full"
                    />
                    <div className="flex-1">
                      <div className="mb-4">
                        <h3 className="text-lg font-bold text-foreground mb-2">{t('name')}</h3>
                        <p className="text-muted-foreground mb-4">{t('role')}</p>
                        <div className="flex items-center gap-4">
                          <a
                            href="https://github.com/jinukeu"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2"
                          >
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                              <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                            </svg>
                            GitHub
                          </a>
                          <a
                            href="https://linkedin.com/in/jinukeu"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2"
                          >
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
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
            <Comments locale={locale} />
          </main>
        </div>

        <Footer />
      </div>
    </>
  );
}
