# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Next.js 15 blog built with TypeScript, focused on Android development content. The blog features:
- Markdown-based content management
- Dark/light theme support with system preference detection
- Modern design system with reusable UI components
- Toss Tech-inspired design aesthetics

## Commands

```bash
# Development
npm run dev          # Start dev server at http://localhost:3000

# Production
npm run build        # Build for production
npm run start        # Start production server

# Linting
npm run lint         # Run ESLint
```

## Architecture

### Content Management
- **Posts location**: `/posts/*.md`
- **Post processor**: `src/lib/markdown.ts`
  - Uses `gray-matter` for frontmatter parsing
  - Uses `remark` + `remark-html` for markdown → HTML conversion
  - Blog posts are read from filesystem at build time (SSG)

**Post frontmatter structure**:
```yaml
title: string
date: string (YYYY-MM-DD)
excerpt: string
tags: string[]
author: string
readTime: string
thumbnail: string (optional)

# SEO 전용 필드 (optional)
seoTitle: string (검색 엔진 최적화용 제목)
seoDescription: string (검색 엔진 최적화용 설명)
seoKeywords: string[] (검색 키워드 배열)

# GEO 전용 필드 (optional, 유저에게는 안 보임)
summary: string (핵심 요약 1줄, AI 검색 엔진용)
keyTakeaways: string[] (핵심 인사이트 배열, AI가 인용하기 좋은 형태)
```

### Routing Structure
- `/` - Homepage with post grid (추천/전체 filters)
- `/blog/[slug]` - Individual post pages with blurred navigation

### Theme System
- **Provider**: `next-themes` with system preference support
- **Configuration**: `ThemeProvider` in `layout.tsx` with `defaultTheme="system"`
- **Toggle**: `ThemeToggle` component in navigation headers
- **CSS Variables**: Defined in `globals.css` under `:root` and `.dark` selectors
- **Tailwind**: Design tokens in `tailwind.config.js` use `hsl(var(--*))` pattern

### Design System
Located in `src/components/ui/`:
- **Button**: 4 variants (default, outline, ghost, link), 3 sizes (sm, md, lg)
- **Card**: Compound component with Header, Title, Description, Content, Footer
- **Badge**: 3 variants (default, secondary, outline)

All components use CSS variable-based theming for automatic dark mode support.

### Styling Approach
- **Framework**: Tailwind CSS with `@tailwindcss/typography` for blog content
- **Font**: SUIT Variable (Korean web font from CDN in `layout.tsx`)
- **Color Palette**: Emerald/green (`primary-*`) as primary brand color
- **Dark Mode**: Class-based (`darkMode: 'class'` in Tailwind config)

### Key Files
- `src/lib/markdown.ts` - Core blog post data fetching logic
- `src/types/blog.ts` - TypeScript interfaces for blog posts
- `src/app/layout.tsx` - Root layout with theme provider and metadata
- `tailwind.config.js` - Design token definitions
- `src/app/globals.css` - CSS variables for theming

## Content Guidelines

When creating new blog posts:
1. Create `.md` file in `/posts/` directory
2. Include required frontmatter (title, date, excerpt)
3. Posts are automatically sorted by date (newest first)
4. Use standard markdown syntax
5. Focus on Android development topics (Kotlin, Java, mobile development)

## SEO/GEO Optimization

### Automated SEO/GEO Optimization
When the user requests optimization for a blog post (e.g., "cmc-10기-회고.md 포스트를 SEO 최적화해줘" or "SEO/GEO 최적화해줘"), perform the following steps:

#### Step 1: SEO Optimization
1. **포스트 내용 분석**: Read and analyze the blog post content to understand the main topics and key points
2. **주요 키워드 추출**: Extract relevant keywords from the content (technologies, concepts, tools mentioned)
3. **검색 친화적인 제목/설명 생성**:
   - Create SEO-friendly title that includes main keywords (longer and more descriptive than display title)
   - Generate detailed description that includes key terms and value proposition
   - Compile keyword array with all relevant search terms
4. **frontmatter에 SEO 필드 추가**: Add `seoTitle`, `seoDescription`, and `seoKeywords` fields to the post's frontmatter

#### Step 2: GEO Optimization (AI 검색 엔진용)
5. **핵심 요약 생성**: Create a 1-2 sentence summary capturing the main takeaways
6. **Key Takeaways 추출**: Extract 3-5 actionable insights or key points from the content
7. **frontmatter에 GEO 필드 추가**: Add `summary` and `keyTakeaways` fields to the post's frontmatter

**Complete Example**:
```yaml
---
title: CMC 10기 회고
excerpt: Central Makeus Challenge 10기 활동이 끝났다...

# SEO fields (검색 엔진용)
seoTitle: "CMC 10기 PM & 안드로이드 개발 회고 | MOSCOW 기법과 칸반보드 실전 활용"
seoDescription: "대외활동 CMC 10기에서 개발 PM과 안드로이드 개발자로 활동하며 배운 MOSCOW 우선순위 설정, 칸반보드 관리, Custom View 활용 등 실전 경험을 공유합니다."
seoKeywords: ["CMC", "대외활동", "PM", "안드로이드", "MOSCOW", "칸반보드", "프로젝트관리", "커스텀뷰"]

# GEO fields (AI 검색 엔진용, 유저에게 안 보임)
summary: "CMC 10기에서 개발 PM과 안드로이드 개발자로 활동하며 배운 핵심 교훈 - MOSCOW 우선순위 기법으로 프로젝트 범위 관리, 칸반보드로 팀 진행상황 추적, Custom View로 재사용 가능한 UI 컴포넌트 작성"
keyTakeaways:
  - "MOSCOW 기법으로 프로젝트 시작 전 기능 우선순위를 명확히 설정"
  - "칸반보드는 팀원들에게 상세 작성을 요청해야 효과적"
  - "Custom View는 재사용되는 레이아웃에 필수적으로 활용"
---
```

**Field Priority & Usage**:
- **SEO fields**: Used for meta tags, Open Graph, Twitter Cards (Google, Naver search)
  - `seoTitle` → used instead of `title` in meta tags
  - `seoDescription` → used instead of `excerpt` in meta description
  - `seoKeywords` → used instead of auto-generated keywords from categories

- **GEO fields**: Used for AI search engines (ChatGPT, Perplexity, Gemini)
  - `summary` → included in JSON-LD as `abstract` field
  - `keyTakeaways` → included in JSON-LD as `keywords` and `about` fields
  - **Not rendered in post content** (invisible to users, only for AI)

**Important**: When user requests "SEO 최적화" or "GEO 최적화" or "SEO/GEO 최적화", perform BOTH SEO and GEO optimization automatically.
