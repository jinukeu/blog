'use client';

import { useEffect, useState } from 'react';

interface TocItem {
  id: string;
  text: string;
  level: number;
}

interface TableOfContentsProps {
  contentSelector?: string;
}

export function TableOfContents({ contentSelector = '.prose-blog' }: TableOfContentsProps) {
  const [headings, setHeadings] = useState<TocItem[]>([]);
  const [activeId, setActiveId] = useState<string>('');

  useEffect(() => {
    const contentElement = document.querySelector(contentSelector);
    if (!contentElement) return;

    const headingElements = contentElement.querySelectorAll('h2, h3');
    const items: TocItem[] = [];
    const idCount: Record<string, number> = {};

    headingElements.forEach((heading) => {
      const text = heading.textContent || '';
      let baseId = heading.id || text.toLowerCase().replace(/\s+/g, '-');

      // 중복 ID 처리
      if (idCount[baseId] !== undefined) {
        idCount[baseId]++;
        baseId = `${baseId}-${idCount[baseId]}`;
      } else {
        idCount[baseId] = 0;
      }

      if (!heading.id) {
        heading.id = baseId;
      }

      items.push({
        id: heading.id,
        text,
        level: parseInt(heading.tagName.charAt(1)),
      });
    });

    setHeadings(items);
  }, [contentSelector]);

  useEffect(() => {
    if (headings.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      {
        rootMargin: '-80px 0px -80% 0px',
        threshold: 0,
      }
    );

    headings.forEach(({ id }) => {
      const element = document.getElementById(id);
      if (element) {
        observer.observe(element);
      }
    });

    return () => observer.disconnect();
  }, [headings]);

  const handleClick = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const yOffset = -100;
      const y = element.getBoundingClientRect().top + window.scrollY + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  if (headings.length === 0) {
    return null;
  }

  return (
    <nav className="max-h-[calc(100vh-8rem)] overflow-y-auto scrollbar-hide" aria-label="목차">
      <h2 className="text-sm font-semibold text-foreground mb-4 tracking-wide uppercase">
        목차
      </h2>
      <ul className="space-y-2 pb-8">
          {headings.map((heading) => (
            <li
              key={heading.id}
              style={{ paddingLeft: heading.level === 3 ? '1rem' : '0' }}
            >
              <button
                onClick={() => handleClick(heading.id)}
                className={`
                  block text-left text-sm leading-relaxed transition-all duration-200
                  ${
                    activeId === heading.id
                      ? 'text-foreground font-medium translate-x-1'
                      : 'text-muted-foreground hover:text-foreground'
                  }
                `}
              >
                {heading.text}
              </button>
            </li>
          ))}
      </ul>
    </nav>
  );
}
