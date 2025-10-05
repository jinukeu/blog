export interface Category {
  id: string;
  name: string;
  slug: string;
}

export interface CategoriesData {
  mainCategories: Category[];
  subCategories: Category[];
}

export interface BlogPost {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  content: string;
  mainCategories?: string[];
  subCategories?: string[];
  author?: string;
  readTime?: string;
  thumbnail?: string;
  // SEO 전용 필드
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string[];
  // GEO 전용 필드
  summary?: string;
  keyTakeaways?: string[];
}

export interface BlogPostMeta {
  title: string;
  date: string;
  excerpt: string;
  mainCategories?: string[];
  subCategories?: string[];
  author?: string;
  readTime?: string;
  thumbnail?: string;
  // SEO 전용 필드
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string[];
  // GEO 전용 필드
  summary?: string;
  keyTakeaways?: string[];
}

export interface DraftPost {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  content: string;
  mainCategories?: string[];
  subCategories?: string[];
  author?: string;
  readTime?: string;
  thumbnail?: string;
  updatedAt?: string;
  // SEO 전용 필드
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string[];
  // GEO 전용 필드
  summary?: string;
  keyTakeaways?: string[];
}

export interface DraftPostMeta {
  title: string;
  date: string;
  excerpt: string;
  mainCategories?: string[];
  subCategories?: string[];
  author?: string;
  readTime?: string;
  thumbnail?: string;
  updatedAt?: string;
  // SEO 전용 필드
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string[];
  // GEO 전용 필드
  summary?: string;
  keyTakeaways?: string[];
}