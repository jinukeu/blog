'use client';

import { useLocale, useTranslations } from 'next-intl';
import { useRouter, usePathname } from '@/i18n/navigation';
import { useState, useRef, useEffect } from 'react';
import { Locale, locales } from '@/i18n/config';

const localeLabels: Record<Locale, string> = {
  ko: 'KO',
  en: 'EN',
  ja: 'JA',
};

export function LanguageSelector() {
  const locale = useLocale() as Locale;
  const router = useRouter();
  const pathname = usePathname();
  const t = useTranslations('language');
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLocaleChange = (newLocale: Locale) => {
    router.replace(pathname, { locale: newLocale });
    setOpen(false);
  };

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="w-10 h-10 rounded-lg bg-foreground/5 hover:bg-foreground/10 transition-colors duration-200 flex items-center justify-center text-xs font-semibold text-foreground btn-press"
        aria-label={t('label')}
      >
        {localeLabels[locale]}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-36 rounded-lg border border-border bg-background shadow-lg overflow-hidden z-50">
          {locales.map((loc) => (
            <button
              key={loc}
              onClick={() => handleLocaleChange(loc)}
              className={`w-full px-4 py-2.5 text-left text-sm transition-colors ${
                loc === locale
                  ? 'bg-foreground/10 text-foreground font-medium'
                  : 'text-muted-foreground hover:bg-foreground/5 hover:text-foreground'
              }`}
            >
              {t(loc)}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
