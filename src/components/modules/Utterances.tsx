'use client';

import { siteConfig } from '@/lib/site-config';
import { useTheme } from 'next-themes';
import { useEffect, useRef, useState } from 'react';

export function UtterancesComments() {
  const haveRepository = Boolean(siteConfig.utterances.repo);
  const { resolvedTheme } = useTheme();
  const [status, setStatus] = useState<'pending' | 'success' | 'failed'>('pending');
  const theme = resolvedTheme === 'dark' ? 'github-dark' : 'github-light';
  const utterancesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const utterancesEl = utterancesRef.current;
    if (!haveRepository || !utterancesEl || utterancesEl.children.length > 0) return;

    const scriptEl = document.createElement('script');
    scriptEl.onload = () => setStatus('success');
    scriptEl.onerror = () => setStatus('failed');
    scriptEl.setAttribute('src', 'https://utteranc.es/client.js');
    scriptEl.setAttribute('repo', siteConfig.utterances.repo);
    scriptEl.setAttribute('issue-term', 'pathname');
    scriptEl.setAttribute('theme', theme);
    scriptEl.setAttribute('crossorigin', 'anonymous');
    scriptEl.setAttribute('async', 'true');
    if (siteConfig.utterances.label) {
      scriptEl.setAttribute('label', siteConfig.utterances.label);
    }

    utterancesEl?.insertAdjacentElement('beforeend', scriptEl);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [haveRepository]);

  useEffect(() => {
    const utterancesEl = utterancesRef.current;
    if (!haveRepository || !utterancesEl || utterancesEl.children.length < 1) return;

    try {
      const iframe = utterancesEl.querySelector('iframe.utterances-frame') as
        | HTMLIFrameElement
        | undefined;
      iframe?.contentWindow?.postMessage?.(
        {
          type: 'set-theme',
          theme: theme
        },
        'https://utteranc.es'
      );
    } catch (e) {
      console.error(e);
    }
  }, [haveRepository, theme]);

  if (!haveRepository) {
    return null;
  }

  return (
    <section>
      {status === 'pending' ? (
        <div>Loading comments...</div>
      ) : status === 'failed' ? (
        <div>Failed to load comments</div>
      ) : null}
      <div ref={utterancesRef} />
    </section>
  );
}
