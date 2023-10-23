'use client';

import { siteConfig } from '@/lib/site-config';
import { useLayoutEffect } from 'react';

export function HtmlLangAttrProvider() {
  useLayoutEffect(() => {
    const lang = siteConfig.language || 'en';

    document.documentElement.lang = lang;
  });

  return null;
}
