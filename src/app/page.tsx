import Link from "next/link";
import { getAllPosts } from "@/lib/markdown";

export default async function Home() {
  const posts = getAllPosts();

  return (
    <div className="min-h-screen bg-white">
      {/* Toss Tech 스타일 헤더 */}
      <header className="bg-white border-b border-neutral-100 sticky top-0 z-50">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="flex items-center justify-between h-[59px]">
            <Link href="/" className="flex items-center">
              <span className="text-2xl font-bold text-neutral-900">Jinukeu Blog</span>
            </Link>
            <nav className="flex items-center space-x-8">
              <Link href="/" className="text-neutral-700 hover:text-primary-500 font-medium text-sm transition-colors">
                전체
              </Link>
              <Link href="/" className="text-neutral-700 hover:text-primary-500 font-medium text-sm transition-colors">
                개발
              </Link>
              <Link href="/" className="text-neutral-700 hover:text-primary-500 font-medium text-sm transition-colors">
                디자인
              </Link>
              <Link href="/" className="text-neutral-700 hover:text-primary-500 font-medium text-sm transition-colors">
                비즈니스
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Toss Tech 스타일 메인 콘텐츠 */}
      <main className="max-w-[1200px] mx-auto px-6 py-8">
        {/* 카테고리 필터 */}
        <div className="flex items-center space-x-8 mb-12 pb-4 border-b border-neutral-100">
          <button className="text-neutral-900 font-semibold border-b-2 border-primary-500 pb-2">
            전체
          </button>
          <button className="text-neutral-500 hover:text-neutral-900 font-medium pb-2 transition-colors">
            개발
          </button>
          <button className="text-neutral-500 hover:text-neutral-900 font-medium pb-2 transition-colors">
            디자인
          </button>
          <button className="text-neutral-500 hover:text-neutral-900 font-medium pb-2 transition-colors">
            비즈니스
          </button>
        </div>

        {/* 아티클 그리드 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.length > 0 ? (
            posts.map((post) => (
              <article key={post.slug} className="group">
                <Link href={`/blog/${post.slug}`}>
                  <div className="bg-white hover:bg-neutral-50 transition-all duration-200">
                    {/* 썸네일 이미지 */}
                    <div className="w-full h-48 bg-gradient-to-br from-primary-100 to-primary-200 rounded-lg mb-4 flex items-center justify-center">
                      <div className="text-4xl">🧩</div>
                    </div>
                    
                    {/* 콘텐츠 */}
                    <div className="space-y-3">
                      <h2 className="text-xl font-bold text-neutral-900 group-hover:text-primary-500 transition-colors line-clamp-2 leading-tight">
                        {post.title}
                      </h2>
                      
                      <p className="text-neutral-600 text-sm line-clamp-2 leading-relaxed">
                        {post.excerpt}
                      </p>
                      
                      <div className="flex items-center justify-between text-xs text-neutral-400">
                        <span>{post.author || 'Jinukeu'}</span>
                        <time dateTime={post.date}>
                          {new Date(post.date).toLocaleDateString('ko-KR', {
                            month: 'long',
                            day: 'numeric'
                          })}
                        </time>
                      </div>
                      
                      {post.tags && post.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {post.tags.slice(0, 2).map((tag) => (
                            <span
                              key={tag}
                              className="px-2 py-1 text-xs font-medium bg-neutral-100 text-neutral-600 rounded"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </Link>
              </article>
            ))
          ) : (
            <div className="col-span-full text-center py-20">
              <div className="text-6xl mb-6">📝</div>
              <h3 className="text-2xl font-bold text-neutral-900 mb-4">
                첫 번째 글을 기다리고 있어요
              </h3>
              <p className="text-neutral-600 text-lg max-w-md mx-auto leading-relaxed">
                아직 게시된 글이 없습니다. 곧 흥미로운 콘텐츠로 채워질 예정이에요!
              </p>
            </div>
          )}
        </div>
      </main>
      {/* Toss Tech 스타일 푸터 */}
      <footer className="bg-neutral-50 mt-20">
        <div className="max-w-[1200px] mx-auto px-6 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-bold text-neutral-900 mb-4">Jinukeu Blog</h3>
              <p className="text-sm text-neutral-600">
                개발과 디자인 인사이트를 공유하는 블로그
              </p>
            </div>
            <div>
              <h4 className="font-medium text-neutral-900 mb-3">콘텐츠</h4>
              <ul className="space-y-2 text-sm text-neutral-600">
                <li><Link href="/" className="hover:text-primary-500">전체 글</Link></li>
                <li><Link href="/" className="hover:text-primary-500">개발</Link></li>
                <li><Link href="/" className="hover:text-primary-500">디자인</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-neutral-900 mb-3">정보</h4>
              <ul className="space-y-2 text-sm text-neutral-600">
                <li><Link href="#" className="hover:text-primary-500">소개</Link></li>
                <li><Link href="#" className="hover:text-primary-500">연락처</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-neutral-900 mb-3">링크</h4>
              <ul className="space-y-2 text-sm text-neutral-600">
                <li><Link href="#" className="hover:text-primary-500">GitHub</Link></li>
                <li><Link href="#" className="hover:text-primary-500">LinkedIn</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-neutral-200 mt-8 pt-8 text-center text-sm text-neutral-500">
            © 2024 Jinukeu Blog. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
