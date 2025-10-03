import fs from 'fs';
import path from 'path';
import { Category, CategoriesData } from '@/types/blog';
import matter from 'gray-matter';

const categoriesFilePath = path.join(process.cwd(), 'data', 'categories.json');
const postsDirectory = path.join(process.cwd(), 'posts');
const draftsDirectory = path.join(process.cwd(), 'drafts');

// categories.json 파일 읽기
function readCategoriesFile(): CategoriesData {
  if (!fs.existsSync(categoriesFilePath)) {
    const defaultData: CategoriesData = {
      mainCategories: [],
      subCategories: [],
    };
    // data 디렉토리가 없으면 생성
    const dataDir = path.dirname(categoriesFilePath);
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    fs.writeFileSync(categoriesFilePath, JSON.stringify(defaultData, null, 2), 'utf8');
    return defaultData;
  }

  const fileContents = fs.readFileSync(categoriesFilePath, 'utf8');
  return JSON.parse(fileContents);
}

// categories.json 파일 쓰기
function writeCategoriesFile(data: CategoriesData): void {
  fs.writeFileSync(categoriesFilePath, JSON.stringify(data, null, 2), 'utf8');
}

// 전체 카테고리 조회
export function getAllCategories(): CategoriesData {
  return readCategoriesFile();
}

// 대카테고리 목록
export function getMainCategories(): Category[] {
  const data = readCategoriesFile();
  return data.mainCategories;
}

// 소카테고리 목록
export function getSubCategories(): Category[] {
  const data = readCategoriesFile();
  return data.subCategories;
}

// 대카테고리 추가
export function addMainCategory(name: string): Category {
  const data = readCategoriesFile();

  // 중복 체크
  if (data.mainCategories.some((cat) => cat.name === name)) {
    throw new Error('이미 존재하는 카테고리입니다.');
  }

  const slug = name
    .toLowerCase()
    .replace(/[^\w\sㄱ-ㅎㅏ-ㅣ가-힣-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/--+/g, '-')
    .trim();

  const newCategory: Category = {
    id: `main_${Date.now()}`,
    name,
    slug,
  };

  data.mainCategories.push(newCategory);
  writeCategoriesFile(data);

  return newCategory;
}

// 소카테고리 추가
export function addSubCategory(name: string): Category {
  const data = readCategoriesFile();

  // 중복 체크
  if (data.subCategories.some((cat) => cat.name === name)) {
    throw new Error('이미 존재하는 카테고리입니다.');
  }

  const slug = name
    .toLowerCase()
    .replace(/[^\w\sㄱ-ㅎㅏ-ㅣ가-힣-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/--+/g, '-')
    .trim();

  const newCategory: Category = {
    id: `sub_${Date.now()}`,
    name,
    slug,
  };

  data.subCategories.push(newCategory);
  writeCategoriesFile(data);

  return newCategory;
}

// 대카테고리 수정
export function updateMainCategory(id: string, name: string): void {
  const data = readCategoriesFile();
  const index = data.mainCategories.findIndex((cat) => cat.id === id);

  if (index === -1) {
    throw new Error('카테고리를 찾을 수 없습니다.');
  }

  const slug = name
    .toLowerCase()
    .replace(/[^\w\sㄱ-ㅎㅏ-ㅣ가-힣-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/--+/g, '-')
    .trim();

  data.mainCategories[index] = {
    ...data.mainCategories[index],
    name,
    slug,
  };

  writeCategoriesFile(data);
}

// 소카테고리 수정
export function updateSubCategory(id: string, name: string): void {
  const data = readCategoriesFile();
  const index = data.subCategories.findIndex((cat) => cat.id === id);

  if (index === -1) {
    throw new Error('카테고리를 찾을 수 없습니다.');
  }

  const slug = name
    .toLowerCase()
    .replace(/[^\w\sㄱ-ㅎㅏ-ㅣ가-힣-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/--+/g, '-')
    .trim();

  data.subCategories[index] = {
    ...data.subCategories[index],
    name,
    slug,
  };

  writeCategoriesFile(data);
}

// 카테고리를 사용 중인 글 검사
function getPostsUsingCategory(categoryId: string, type: 'main' | 'sub'): string[] {
  const fieldName = type === 'main' ? 'mainCategories' : 'subCategories';
  const usedIn: string[] = [];

  // posts 디렉토리 검사
  if (fs.existsSync(postsDirectory)) {
    const postFiles = fs.readdirSync(postsDirectory).filter((file) => file.endsWith('.md'));
    for (const file of postFiles) {
      const fullPath = path.join(postsDirectory, file);
      const fileContents = fs.readFileSync(fullPath, 'utf8');
      const { data } = matter(fileContents);

      if (data[fieldName] && Array.isArray(data[fieldName]) && data[fieldName].includes(categoryId)) {
        usedIn.push(file.replace('.md', ''));
      }
    }
  }

  // drafts 디렉토리 검사
  if (fs.existsSync(draftsDirectory)) {
    const draftFiles = fs.readdirSync(draftsDirectory).filter((file) => file.endsWith('.md'));
    for (const file of draftFiles) {
      const fullPath = path.join(draftsDirectory, file);
      const fileContents = fs.readFileSync(fullPath, 'utf8');
      const { data } = matter(fileContents);

      if (data[fieldName] && Array.isArray(data[fieldName]) && data[fieldName].includes(categoryId)) {
        usedIn.push(`draft: ${file.replace('.md', '')}`);
      }
    }
  }

  return usedIn;
}

// 카테고리 삭제 시 해당 카테고리 제거 (글에서)
function removeCategoryFromPosts(categoryId: string, type: 'main' | 'sub'): void {
  const fieldName = type === 'main' ? 'mainCategories' : 'subCategories';

  // posts 디렉토리 처리
  if (fs.existsSync(postsDirectory)) {
    const postFiles = fs.readdirSync(postsDirectory).filter((file) => file.endsWith('.md'));
    for (const file of postFiles) {
      const fullPath = path.join(postsDirectory, file);
      const fileContents = fs.readFileSync(fullPath, 'utf8');
      const { data, content } = matter(fileContents);

      if (data[fieldName] && Array.isArray(data[fieldName]) && data[fieldName].includes(categoryId)) {
        data[fieldName] = data[fieldName].filter((id: string) => id !== categoryId);

        // 빈 배열이면 빈 배열로 유지 (미분류)
        const newContent = matter.stringify(content, data);
        fs.writeFileSync(fullPath, newContent, 'utf8');
      }
    }
  }

  // drafts 디렉토리 처리
  if (fs.existsSync(draftsDirectory)) {
    const draftFiles = fs.readdirSync(draftsDirectory).filter((file) => file.endsWith('.md'));
    for (const file of draftFiles) {
      const fullPath = path.join(draftsDirectory, file);
      const fileContents = fs.readFileSync(fullPath, 'utf8');
      const { data, content } = matter(fileContents);

      if (data[fieldName] && Array.isArray(data[fieldName]) && data[fieldName].includes(categoryId)) {
        data[fieldName] = data[fieldName].filter((id: string) => id !== categoryId);

        const newContent = matter.stringify(content, data);
        fs.writeFileSync(fullPath, newContent, 'utf8');
      }
    }
  }
}

// 대카테고리 삭제
export function deleteMainCategory(id: string): { success: boolean; usedIn?: string[] } {
  const usedIn = getPostsUsingCategory(id, 'main');

  if (usedIn.length > 0) {
    return { success: false, usedIn };
  }

  const data = readCategoriesFile();
  data.mainCategories = data.mainCategories.filter((cat) => cat.id !== id);
  writeCategoriesFile(data);

  return { success: true };
}

// 소카테고리 삭제
export function deleteSubCategory(id: string): { success: boolean; usedIn?: string[] } {
  const usedIn = getPostsUsingCategory(id, 'sub');

  if (usedIn.length > 0) {
    return { success: false, usedIn };
  }

  const data = readCategoriesFile();
  data.subCategories = data.subCategories.filter((cat) => cat.id !== id);
  writeCategoriesFile(data);

  return { success: true };
}

// 강제 삭제 (경고 후 사용)
export function forceDeleteMainCategory(id: string): void {
  removeCategoryFromPosts(id, 'main');

  const data = readCategoriesFile();
  data.mainCategories = data.mainCategories.filter((cat) => cat.id !== id);
  writeCategoriesFile(data);
}

export function forceDeleteSubCategory(id: string): void {
  removeCategoryFromPosts(id, 'sub');

  const data = readCategoriesFile();
  data.subCategories = data.subCategories.filter((cat) => cat.id !== id);
  writeCategoriesFile(data);
}

// 카테고리 유효성 검증
export function validateCategories(mainIds?: string[], subIds?: string[]): { valid: boolean; message?: string } {
  const data = readCategoriesFile();

  if (mainIds && mainIds.length > 0) {
    const validMainIds = data.mainCategories.map((cat) => cat.id);
    const invalidIds = mainIds.filter((id) => !validMainIds.includes(id));

    if (invalidIds.length > 0) {
      return {
        valid: false,
        message: `존재하지 않는 대카테고리: ${invalidIds.join(', ')}`,
      };
    }
  }

  if (subIds && subIds.length > 0) {
    const validSubIds = data.subCategories.map((cat) => cat.id);
    const invalidIds = subIds.filter((id) => !validSubIds.includes(id));

    if (invalidIds.length > 0) {
      return {
        valid: false,
        message: `존재하지 않는 소카테고리: ${invalidIds.join(', ')}`,
      };
    }
  }

  return { valid: true };
}
