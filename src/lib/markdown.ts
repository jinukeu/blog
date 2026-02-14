import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import remarkRehype from 'remark-rehype';
import rehypeHighlight from 'rehype-highlight';
import rehypeExternalLinks from 'rehype-external-links';
import rehypeStringify from 'rehype-stringify';
import { BlogPost, BlogPostMeta } from '@/types/blog';
import { Locale, defaultLocale, locales } from '@/i18n/config';

const postsDirectory = path.join(process.cwd(), 'posts');

function getPostsDir(locale: Locale = defaultLocale): string {
  if (locale === 'ko') {
    return postsDirectory;
  }
  return path.join(postsDirectory, locale);
}

export async function getPostBySlug(slug: string, locale: Locale = defaultLocale): Promise<BlogPost> {
  const dir = getPostsDir(locale);
  const fullPath = path.join(dir, `${slug}.md`);
  const fileContents = fs.readFileSync(fullPath, 'utf8');
  const { data, content } = matter(fileContents);

  const processedContent = await remark()
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeExternalLinks, { target: '_blank', rel: ['noopener', 'noreferrer'] })
    .use(rehypeHighlight)
    .use(rehypeStringify, { allowDangerousHtml: true })
    .process(content);
  const contentHtml = processedContent.toString();

  return {
    slug,
    title: data.title,
    date: data.date,
    excerpt: data.excerpt,
    content: contentHtml,
    mainCategories: data.mainCategories,
    subCategories: data.subCategories,
    author: data.author,
    readTime: data.readTime,
    thumbnail: data.thumbnail,
    seoTitle: data.seoTitle,
    seoDescription: data.seoDescription,
    seoKeywords: data.seoKeywords,
    summary: data.summary,
    keyTakeaways: data.keyTakeaways,
    locale,
    availableLocales: getAvailableLocales(slug),
  };
}

export function getAllPosts(locale: Locale = defaultLocale): (BlogPostMeta & { slug: string })[] {
  const dir = getPostsDir(locale);

  if (!fs.existsSync(dir)) {
    return [];
  }

  const fileNames = fs.readdirSync(dir);
  const allPostsData = fileNames
    .filter((fileName) => fileName.endsWith('.md'))
    .map((fileName) => {
      const slug = fileName.replace(/\.md$/, '');
      const fullPath = path.join(dir, fileName);
      const fileContents = fs.readFileSync(fullPath, 'utf8');
      const { data } = matter(fileContents);

      return {
        slug,
        title: data.title,
        date: data.date,
        excerpt: data.excerpt,
        mainCategories: data.mainCategories,
        subCategories: data.subCategories,
        author: data.author,
        thumbnail: data.thumbnail,
        seoTitle: data.seoTitle,
        seoDescription: data.seoDescription,
        seoKeywords: data.seoKeywords,
        summary: data.summary,
        keyTakeaways: data.keyTakeaways,
        locale,
        availableLocales: getAvailableLocales(slug),
      };
    });

  return allPostsData.sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getPostContent(slug: string, locale: Locale = defaultLocale): { content: string; frontmatter: Record<string, unknown> } {
  const dir = getPostsDir(locale);
  const fullPath = path.join(dir, `${slug}.md`);
  const fileContents = fs.readFileSync(fullPath, 'utf8');
  const { data, content } = matter(fileContents);

  return {
    content,
    frontmatter: data,
  };
}

export function savePost(slug: string, content: string, frontmatter: Record<string, unknown>, locale: Locale = defaultLocale): void {
  const dir = getPostsDir(locale);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  const fullPath = path.join(dir, `${slug}.md`);
  const fileContent = matter.stringify(content, frontmatter);
  fs.writeFileSync(fullPath, fileContent, 'utf8');
}

export function deletePost(slug: string, locale: Locale = defaultLocale): void {
  const dir = getPostsDir(locale);
  const fullPath = path.join(dir, `${slug}.md`);
  if (fs.existsSync(fullPath)) {
    fs.unlinkSync(fullPath);
  }
}

export function getAllSlugs(locale: Locale = defaultLocale): string[] {
  const dir = getPostsDir(locale);

  if (!fs.existsSync(dir)) {
    return [];
  }

  const fileNames = fs.readdirSync(dir);
  return fileNames
    .filter((fileName) => fileName.endsWith('.md'))
    .map((fileName) => fileName.replace(/\.md$/, ''));
}

export function getAvailableLocales(slug: string): string[] {
  const available: string[] = [];
  for (const locale of locales) {
    const dir = getPostsDir(locale);
    const fullPath = path.join(dir, `${slug}.md`);
    if (fs.existsSync(fullPath)) {
      available.push(locale);
    }
  }
  return available;
}
