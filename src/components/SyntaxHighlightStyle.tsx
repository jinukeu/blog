'use client';

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

export function SyntaxHighlightStyle() {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const href = resolvedTheme === 'dark'
    ? 'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/github-dark.min.css'
    : 'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/nord.min.css';

  return (
    <link rel="stylesheet" href={href} />
  );
}
