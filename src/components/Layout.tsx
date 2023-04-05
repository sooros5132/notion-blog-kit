import type React from 'react';
import { useThemeStore } from 'src/store/theme';
import Header from './header/Header';
import Footer from './footer/Footer';
import NextNProgress from 'nextjs-progressbar';
import { PropsWithChildren, useEffect } from 'react';
import Head from 'next/head';

export const introductionPathnameList = ['/'];

function Layout({ children }: PropsWithChildren) {
  const mode = useThemeStore((state) => state.mode);

  // React.useEffect(() => {
  //   const handleRouteChangeStart = (url: string) => {

  //   };
  //   router.events.on('routeChangeStart', handleRouteChangeStart);
  //   return () => router.events.off('routeChangeStart', handleRouteChangeStart);
  // }, [router.events, router]);

  useEffect(() => {
    document.documentElement.dataset.theme = mode;
    document.documentElement.classList.add(mode);
    return () => {
      document.documentElement.classList.remove(mode);
    };
  }, [mode]);

  return (
    <div className='flex flex-col bg-base-100 min-h-screen supports-[height:100dvh]:min-h-dvh-100'>
      <Head>
        <meta name='msapplication-TileColor' content={mode === 'dark' ? '#313335' : '#f3f4f6'} />
        <meta name='theme-color' content={mode === 'dark' ? '#313335' : '#f3f4f6'} />
      </Head>
      <NextNProgress startPosition={0.2} />
      <Header />
      <main className='flex flex-col mb-auto text-base-content'>{children}</main>
      <Footer />
    </div>
  );
}

export default Layout;
