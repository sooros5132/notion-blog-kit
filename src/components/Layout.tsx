import { useEffect } from 'react';
import { useRouter } from 'next/router';
import _ from 'lodash';
import { useThemeStore } from 'src/store/theme';
import Header from './header/Header';
import Footer from './footer/Footer';
import NextNProgress from 'nextjs-progressbar';
import shallow from 'zustand/shallow';

export const introductionPathnameList = [
  '/'
  // '/introduction/jobseeker',
  // '/introduction/interviewer',
  // '/introduction/mou'
];

function Layout({ children }: any) {
  const router = useRouter();
  const themeStore = useThemeStore((state) => state, shallow);

  // React.useEffect(() => {
  //   const handleRouteChangeStart = (url: string) => {

  //   };
  //   router.events.on('routeChangeStart', handleRouteChangeStart);
  //   return () => router.events.off('routeChangeStart', handleRouteChangeStart);
  // }, [router.events, router]);

  useEffect(() => {
    if (themeStore.mode) {
      document.documentElement.dataset.theme = themeStore.mode;
    }
  }, [themeStore]);

  return (
    <div className='flex flex-col min-h-screen bg-zinc-100 dark:bg-zinc-900 text-zinc-800 dark:text-zinc-300'>
      <NextNProgress startPosition={0.2} />
      <Header />
      <main className='flex flex-col mb-auto'>{children}</main>
      <Footer />
    </div>
  );
}

export default Layout;
