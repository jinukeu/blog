import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { LoadingBar } from "@/components/LoadingBar";
import { Suspense } from "react";
import { Analytics } from "@vercel/analytics/react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Jinukeu Blog",
    template: "%s | Jinukeu Blog"
  },
  description: "안드로이드 개발자 이진욱의 기술 블로그. Kotlin, Java, Android 개발 경험과 인사이트를 공유합니다.",
  keywords: ["블로그", "개발", "안드로이드", "Android", "Kotlin", "Java", "모바일", "이진욱", "기술블로그"],
  authors: [{ name: "이진욱", url: "https://github.com/jinukeu" }],
  creator: "이진욱",
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || "https://yourdomain.com"),
  openGraph: {
    type: "website",
    locale: "ko_KR",
    url: process.env.NEXT_PUBLIC_BASE_URL || "https://yourdomain.com",
    title: "Jinukeu Blog",
    description: "안드로이드 개발자 이진욱의 기술 블로그",
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
    title: "Jinukeu Blog",
    description: "안드로이드 개발자 이진욱의 기술 블로그",
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <head>
        <link href="https://cdn.jsdelivr.net/gh/sun-typeface/SUIT@2/fonts/variable/woff2/SUIT-Variable.css" rel="stylesheet" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        style={{ fontFamily: "'SUIT Variable', sans-serif" }}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Suspense fallback={null}>
            <LoadingBar />
          </Suspense>
          {children}
          <Analytics />
        </ThemeProvider>
      </body>
    </html>
  );
}
