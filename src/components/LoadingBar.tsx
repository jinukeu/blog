'use client';

import { useEffect, useState } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import NProgress from 'nprogress';

NProgress.configure({
  showSpinner: false,
  trickleSpeed: 200,
  minimum: 0.08,
  easing: 'ease',
  speed: 500,
});

export function LoadingBar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // 페이지 전환 시작
    setIsLoading(true);
    NProgress.start();

    // 짧은 지연 후 로딩 완료
    const timer = setTimeout(() => {
      setIsLoading(false);
      NProgress.done();
    }, 300);

    return () => {
      clearTimeout(timer);
      setIsLoading(false);
      NProgress.done();
    };
  }, [pathname, searchParams]);

  return (
    <>
      {/* 로딩 오버레이 */}
      <div className={`loading-overlay ${isLoading ? 'active' : ''}`} />

      {/* 상단 스피너 */}
      {isLoading && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-[9999]">
          <div className="flex items-center gap-3 bg-white/90 dark:bg-gray-900/90 backdrop-blur-lg px-6 py-3 rounded-full shadow-lg border border-gray-200/50 dark:border-gray-700/50">
            <div className="w-5 h-5 border-3 border-primary-500 border-t-transparent rounded-full animate-spin" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              로딩 중
            </span>
          </div>
        </div>
      )}
    </>
  );
}
