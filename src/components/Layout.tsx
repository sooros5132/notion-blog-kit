import type React from 'react';
import { useThemeStore } from 'src/store/theme';
import Header from './header/Header';
import Footer from './footer/Footer';
import NextNProgress from 'nextjs-progressbar';
import { PropsWithChildren, useEffect, useRef, useState } from 'react';
import Head from 'next/head';
import { throttle } from 'lodash';
import { FaArrowUp } from 'react-icons/fa';
import classNames from 'classnames';
import { useSiteSettingStore } from 'src/store/siteSetting';
import { SideBarMenu } from './modules/SideBarMenu';

function Layout({ children }: PropsWithChildren) {
  const mode = useThemeStore((state) => state.mode);

  // React.useEffect(() => {
  //   const handleRouteChangeStart = (url: string) => {

  //   };
  //   router.events.on('routeChangeStart', handleRouteChangeStart);
  //   return () => router.events.off('routeChangeStart', handleRouteChangeStart);
  // }, [router.events, router]);

  useEffect(() => {
    useSiteSettingStore.subscribe(({ enableSideBarMenu }) => {
      if (enableSideBarMenu) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = '';
      }
    });
  }, []);

  useEffect(() => {
    document.documentElement.dataset.theme = mode;
    document.documentElement.classList.add(mode);
    return () => {
      document.documentElement.classList.remove(mode);
    };
  }, [mode]);

  return (
    <div className='flex flex-col min-h-screen supports-[height:100dvh]:min-h-dvh-100 bg-base-100 text-base-content'>
      <Head>
        <meta name='msapplication-TileColor' content={mode === 'dark' ? '#313335' : '#f3f4f6'} />
        <meta name='theme-color' content={mode === 'dark' ? '#313335' : '#f3f4f6'} />
      </Head>
      <NextNProgress startPosition={0.2} />
      <Header />
      <main className='grow'>{children}</main>
      <Footer />
      <SideBarMenu />
      <ScrollTopButton />
    </div>
  );
}

const ScrollTopButton = () => {
  const [visibleScrollTopButton, setVisibleScrollTopButton] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const SvgBorderRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    let prevYOffset = window.pageYOffset || 0;
    const circumference = 87.9;

    const scrollEvent = () => {
      const gap = document.body.scrollHeight - window.innerHeight;
      const progress = 100 * (window.scrollY / gap);
      const correctProgress = Math.max(0, Math.min(progress || 0, 100));

      const dashoffset = (correctProgress / 100) * circumference;

      const svgBorderEl = SvgBorderRef.current;
      if (svgBorderEl) {
        svgBorderEl.style.strokeDashoffset = (circumference - dashoffset).toFixed(1);
        svgBorderEl.style.strokeDasharray = circumference.toFixed(1);
      }
      const nextYOffset = window.pageYOffset;
      if (
        window.pageYOffset < 100 ||
        Math.round(window.innerHeight + window.pageYOffset) >
          Math.round(document.body.scrollHeight - 50)
      ) {
        setVisibleScrollTopButton(false);
        return;
      } else {
        setVisibleScrollTopButton(true);
      }
      prevYOffset = nextYOffset;
    };

    const throttleScrollEvent = throttle(scrollEvent, 100);

    scrollEvent();
    window.addEventListener('scroll', throttleScrollEvent);
    return () => window.removeEventListener('scroll', throttleScrollEvent);
  }, []);

  const handleClickScrollTopButton = () => {
    if (window && window.scrollTo) {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
      const buttonEl = buttonRef.current;
      if (buttonEl) {
        // .focus() is safari support
        buttonEl.focus();
        setTimeout(() => {
          buttonEl.blur();
        }, 1000);
      }
    }
  };

  return (
    <div
      className={classNames(
        'fixed bottom-3 right-3 z-10 transition-[opacity_scale] duration-300 rounded-full bg-base-100 hover:scale-110',
        visibleScrollTopButton ? 'opacity-100' : 'pointer-events-none opacity-0'
      )}
    >
      <button
        ref={buttonRef}
        tabIndex={-1}
        className='relative btn btn-circle btn-ghost min-w-0 min-h-0 w-[30px] h-[30px] btn-sm bg-base-100 border-none p-0 shadow-md overflow-hidden hover:bg-base-200/10 !outline-none group'
        onClick={handleClickScrollTopButton}
      >
        <FaArrowUp className='transition-transform duration-1000 group-focus:-translate-y-[200%] group-active:-translate-y-[200%]' />
        <svg
          ref={SvgBorderRef}
          className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[inherit] h-[inherit] stroke-primary fill-transparent stroke-2 -rotate-90 transition-all'
          viewBox='0 0 30 30'
        >
          <circle cx='15' cy='15' r='14' />
        </svg>
      </button>
    </div>
  );
};

export default Layout;
