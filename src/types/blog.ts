export interface BlogPost {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  content: string;
  tags?: string[];
  author?: string;
  readTime?: string;
  thumbnail?: string;
}

export interface BlogPostMeta {
  title: string;
  date: string;
  excerpt: string;
  tags?: string[];
  author?: string;
  thumbnail?: string;
}