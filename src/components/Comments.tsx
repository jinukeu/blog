'use client';

import Giscus from '@giscus/react';
import { useTheme } from 'next-themes';

export default function Comments() {
  const { theme, resolvedTheme } = useTheme();
  const giscusTheme = resolvedTheme === 'dark' ? 'dark' : 'light';

  return (
    <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-800">
      <Giscus
        repo="jinukeu/blog"
        repoId="R_kgDOPjAfTQ"
        category="General"
        categoryId="DIC_kwDOPjAfTc4CwNAq"
        mapping="pathname"
        reactionsEnabled="1"
        emitMetadata="0"
        inputPosition="top"
        theme={giscusTheme}
        lang="ko"
        loading="lazy"
      />
    </div>
  );
}
