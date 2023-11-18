'use client';

import { useTheme } from 'next-themes';
import { siteConfig } from '@/lib/site-config';
import GiscusApp from '@giscus/react';

export function GiscusComments() {
  const { resolvedTheme } = useTheme();

  let browserLang = '';

  for (const lang of supportedLangs) {
    if (siteConfig.language.startsWith(lang)) {
      browserLang = lang.slice(0, 2);
      break;
    }
  }

  if (!browserLang) {
    for (const lang of supportedZhLangs) {
      if (siteConfig.language.includes(lang)) {
        browserLang = lang;
        break;
      }
    }
  }

  return (
    <GiscusApp
      repo={siteConfig.giscus.repo as `${string}/${string}`}
      repoId={siteConfig.giscus.repoId}
      category={siteConfig.giscus.category}
      categoryId={siteConfig.giscus.categoryId}
      mapping='pathname'
      reactionsEnabled='1'
      emitMetadata='0'
      inputPosition='top'
      theme={resolvedTheme === 'dark' ? 'dark' : 'light'}
      lang={browserLang || 'en'}
      // loading='lazy'
    />
  );
}

const supportedLangs = [
  'ar',
  'ca',
  'de',
  'en',
  'es',
  'fa',
  'fr',
  'he',
  'id',
  'it',
  'ja',
  'ko',
  'nl',
  'pl',
  'pt',
  'ro',
  'ru',
  'th',
  'tr',
  'uk',
  'vi'
] as const;

const supportedZhLangs = ['zh-CN', 'zh-TW'] as const;
