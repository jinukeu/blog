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
