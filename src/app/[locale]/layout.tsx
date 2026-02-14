import { Metadata } from "next";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import { Locale } from '@/i18n/config';

interface LocaleLayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: LocaleLayoutProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'meta' });

  const ogLocaleMap: Record<string, string> = {
    ko: 'ko_KR',
    en: 'en_US',
    ja: 'ja_JP',
  };

  return {
    description: t('siteDescription'),
    keywords: locale === 'ko'
      ? ["블로그", "개발", "안드로이드", "Android", "Kotlin", "Java", "모바일", "이진욱", "기술블로그"]
      : locale === 'ja'
        ? ["ブログ", "開発", "Android", "Kotlin", "Java", "モバイル", "技術ブログ"]
        : ["blog", "development", "Android", "Kotlin", "Java", "mobile", "tech blog"],
    authors: [{ name: locale === 'ko' ? '이진욱' : locale === 'ja' ? 'イ・ジヌク' : 'Jinwook Lee', url: "https://github.com/jinukeu" }],
    creator: locale === 'ko' ? '이진욱' : locale === 'ja' ? 'イ・ジヌク' : 'Jinwook Lee',
    openGraph: {
      type: "website",
      locale: ogLocaleMap[locale] || 'ko_KR',
      url: process.env.NEXT_PUBLIC_BASE_URL || "https://yourdomain.com",
      title: t('siteTitle'),
      description: t('ogDescription'),
      siteName: "Jinukeu Blog",
      images: [
        {
          url: "/og-default.png",
          width: 1200,
          height: 630,
          alt: "Jinukeu Blog",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: t('siteTitle'),
      description: t('ogDescription'),
      images: ["/og-default.png"],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: LocaleLayoutProps) {
  const { locale } = await params;

  // Validate locale
  if (!routing.locales.includes(locale as Locale)) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <NextIntlClientProvider messages={messages}>
      {children}
    </NextIntlClientProvider>
  );
}
