import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';
import { DraftPost, DraftPostMeta } from '@/types/blog';

const draftsDirectory = path.join(process.cwd(), 'drafts');
const postsDirectory = path.join(process.cwd(), 'posts');
const draftImagesDirectory = path.join(process.cwd(), 'public', 'images', 'drafts');
const postImagesDirectory = path.join(process.cwd(), 'public', 'images', 'posts');

// drafts 디렉토리가 없으면 생성
if (!fs.existsSync(draftsDirectory)) {
  fs.mkdirSync(draftsDirectory, { recursive: true });
}

// draft 이미지 디렉토리가 없으면 생성
if (!fs.existsSync(draftImagesDirectory)) {
  fs.mkdirSync(draftImagesDirectory, { recursive: true });
}

export async function getDraftBySlug(slug: string): Promise<DraftPost> {
  const fullPath = path.join(draftsDirectory, `${slug}.md`);
  const fileContents = fs.readFileSync(fullPath, 'utf8');
  const { data, content } = matter(fileContents);
  const stats = fs.statSync(fullPath);

  const processedContent = await remark().use(html).process(content);
  const contentHtml = processedContent.toString();

  return {
    slug,
    title: data.title,
    date: data.date,
    excerpt: data.excerpt,
    content: contentHtml,
    tags: data.tags,
    author: data.author,
    readTime: data.readTime,
    thumbnail: data.thumbnail,
    updatedAt: stats.mtime.toISOString(),
  };
}

export function getAllDrafts(): (DraftPostMeta & { slug: string })[] {
  if (!fs.existsSync(draftsDirectory)) {
    return [];
  }

  const fileNames = fs.readdirSync(draftsDirectory);
  const allDraftsData = fileNames
    .filter((fileName) => fileName.endsWith('.md'))
    .map((fileName) => {
      const slug = fileName.replace(/\.md$/, '');
      const fullPath = path.join(draftsDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, 'utf8');
      const { data } = matter(fileContents);
      const stats = fs.statSync(fullPath);

      return {
        slug,
        title: data.title,
        date: data.date,
        excerpt: data.excerpt,
        tags: data.tags,
        author: data.author,
        thumbnail: data.thumbnail,
        updatedAt: stats.mtime.toISOString(),
      };
    });

  return allDraftsData.sort((a, b) =>
    new Date(b.updatedAt || b.date).getTime() - new Date(a.updatedAt || a.date).getTime()
  );
}

export function saveDraft(slug: string, content: string, frontmatter: Record<string, unknown>): void {
  const fullPath = path.join(draftsDirectory, `${slug}.md`);
  const fileContent = matter.stringify(content, frontmatter);
  fs.writeFileSync(fullPath, fileContent, 'utf8');
}

export function deleteDraft(slug: string): void {
  const fullPath = path.join(draftsDirectory, `${slug}.md`);
  if (fs.existsSync(fullPath)) {
    fs.unlinkSync(fullPath);
  }
}

export function publishDraft(slug: string): void {
  const draftPath = path.join(draftsDirectory, `${slug}.md`);
  const postPath = path.join(postsDirectory, `${slug}.md`);

  if (!fs.existsSync(draftPath)) {
    throw new Error('Draft not found');
  }

  // 마크다운 파일 읽기
  const fileContents = fs.readFileSync(draftPath, 'utf8');
  const { data, content } = matter(fileContents);

  // 이미지 경로 변경 (/images/drafts/ -> /images/posts/)
  const updatedContent = content.replace(
    /\/images\/drafts\//g,
    '/images/posts/'
  );

  // 이미지 파일 이동
  const imageRegex = /!\[.*?\]\((\/images\/drafts\/[^)]+)\)/g;
  let match;
  while ((match = imageRegex.exec(content)) !== null) {
    const imagePath = match[1];
    const imageName = path.basename(imagePath);
    const sourcePath = path.join(process.cwd(), 'public', imagePath);
    const targetPath = path.join(postImagesDirectory, imageName);

    if (fs.existsSync(sourcePath)) {
      // posts 이미지 디렉토리가 없으면 생성
      if (!fs.existsSync(postImagesDirectory)) {
        fs.mkdirSync(postImagesDirectory, { recursive: true });
      }
      fs.copyFileSync(sourcePath, targetPath);
    }
  }

  // thumbnail 이미지도 이동
  if (data.thumbnail && data.thumbnail.startsWith('/images/drafts/')) {
    const thumbnailName = path.basename(data.thumbnail);
    const sourcePath = path.join(process.cwd(), 'public', data.thumbnail);
    const targetPath = path.join(postImagesDirectory, thumbnailName);

    if (fs.existsSync(sourcePath)) {
      if (!fs.existsSync(postImagesDirectory)) {
        fs.mkdirSync(postImagesDirectory, { recursive: true });
      }
      fs.copyFileSync(sourcePath, targetPath);
      data.thumbnail = `/images/posts/${thumbnailName}`;
    }
  }

  // posts 디렉토리에 저장
  const newFileContent = matter.stringify(updatedContent, data);
  fs.writeFileSync(postPath, newFileContent, 'utf8');

  // draft 파일 삭제
  fs.unlinkSync(draftPath);
}

export function getDraftContent(slug: string): { content: string; frontmatter: Record<string, unknown> } {
  const fullPath = path.join(draftsDirectory, `${slug}.md`);
  const fileContents = fs.readFileSync(fullPath, 'utf8');
  const { data, content } = matter(fileContents);

  return {
    content,
    frontmatter: data,
  };
}
