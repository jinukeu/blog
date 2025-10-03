'use client';

import { useEffect } from 'react';
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

  useEffect(() => {
    // 모든 링크에 클릭 이벤트 리스너 추가
    const handleLinkClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const link = target.closest('a');

      if (link && link.href && !link.target && !link.download) {
        const url = new URL(link.href);
        // 같은 도메인의 링크만 처리
        if (url.origin === window.location.origin && url.pathname !== window.location.pathname) {
          NProgress.start();
        }
      }
    };

    document.addEventListener('click', handleLinkClick);

    return () => {
      document.removeEventListener('click', handleLinkClick);
    };
  }, []);

  useEffect(() => {
    // 페이지 전환 완료
    NProgress.done();
  }, [pathname, searchParams]);

  return null;
}
