'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { throttle } from 'lodash';
import { SearchForm } from '@/components/search/SearchForm';
import { useSiteSettingStore } from '@/store/siteSetting';
import { FaArrowRight } from 'react-icons/fa';
import { HiMenu } from 'react-icons/hi';
import { useNotionStore } from '@/store/notion';
import { siteConfig } from '@/lib/site-config';
import { cn } from '@/lib/utils';
import { ThemeToggle } from '../ThemeToggle';
import { NoSsrWrapper } from '../modules/NoSsrWrapper';
import { Button } from '../ui/button';
import { ARCHIVE_PATH } from '@/lib/constants';

const Header: React.FC = (): JSX.Element => {
  const [visibleHeader, setVisibleHeader] = useState(true);
  const { enableSideBarMenu, closeSideBarMenu, openSideBarMenu } = useSiteSettingStore();
  const blogProperties = useNotionStore(({ blogProperties }) => blogProperties);

  const handleClickSideBarMenuButton = () => {
    if (enableSideBarMenu) {
      closeSideBarMenu();
    } else {
      openSideBarMenu();
    }
  };

  useEffect(() => {
    let prevYOffset = window.pageYOffset || 0;

    const scrollEvent = () => {
      const nextYOffset = window.pageYOffset;
      if (
        nextYOffset === 0 ||
        Math.round(window.innerHeight + window.pageYOffset) >
          Math.round(document.body.scrollHeight - 44)
      ) {
        prevYOffset = nextYOffset;
        setVisibleHeader(true);
        return;
      }
      if (prevYOffset > nextYOffset) {
        setVisibleHeader(true);
      } else if (prevYOffset < nextYOffset) {
        setVisibleHeader(false);
      }
      prevYOffset = nextYOffset;
    };

    const throttleScrollEvent = throttle(scrollEvent, 300);

    window.addEventListener('scroll', throttleScrollEvent);
    return () => window.removeEventListener('scroll', throttleScrollEvent);
  }, []);

  return (
    <nav
      className={cn(
        'sticky left-0 h-[var(--header-height)] bg-background/70 backdrop-blur-xl transition-[top] duration-300 z-10',
        visibleHeader && !enableSideBarMenu ? 'top-0' : '-top-[var(--header-height)]'
      )}
    >
      <div className='max-w-7xl h-full flex justify-between items-center mx-auto p-2 gap-x-1'>
        <div className='flex-1 whitespace-nowrap'>
          <Link className='font-bold text-xl px-2' href='/'>
            {siteConfig.infomation.blogname}
          </Link>
        </div>
        {/* 
          Header Menu
          <div className='flex gap-1 md:gap-2 whitespace-nowrap overflow-x-auto overflow-y-hidden scrollbar-hidden'>
          <ul className='gap-1 p-0 md:gap-2 menu menu-horizontal'>
            {Array.isArray(siteConfig.headerNav) &&
              siteConfig.headerNav.length > 0 &&
              siteConfig.headerNav.map((item, i) => (
                <li key={`header-nav-item-${i}`}>
                  <Link
                    href={`/${item.slug}`}
                    className='btn-sm rounded-lg h-full py-1 px-2'
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
          </ul>
        </div> */}
        <Link href={ARCHIVE_PATH}>
          <Button variant='ghost'>Archive</Button>
        </Link>
        <div className='hidden sm:block max-w-[150px] sm:max-w-[200px]'>
          <SearchForm />
        </div>
        <div className='flex items-center'>
          <ThemeToggle />
          <NoSsrWrapper>
            {blogProperties && (
              <button
                className='btn btn-circle btn-sm btn-ghost text-xl'
                onClick={handleClickSideBarMenuButton}
              >
                {enableSideBarMenu ? <FaArrowRight /> : <HiMenu />}
              </button>
            )}
          </NoSsrWrapper>
        </div>
      </div>
      {/* <ScrollProgressBar /> */}
    </nav>
  );
};
Header.displayName = 'Header';

const ScrollProgressBar = () => {
  const [progress, setProgress] = useState('0');

  useEffect(() => {
    const scrollEvent = () => {
      const gap = document.body.scrollHeight - window.innerHeight;
      const progress = 100 * (window.scrollY / gap);
      const correctProgress = Math.max(0, Math.min(progress || 0, 100));

      if (typeof correctProgress === 'number') {
        setProgress(correctProgress.toFixed(1));
      } else {
        setProgress('0');
      }
    };
    scrollEvent();
    const throttleScrollEvent = throttle(scrollEvent, 150);

    window.addEventListener('scroll', throttleScrollEvent);
    return () => window.removeEventListener('scroll', throttleScrollEvent);
  }, []);

  return (
    <div
      className='h-0.5 bg-foreground/30'
      // style={{
      //   background: `linear-gradient(90deg, hsl(var(--bc)) 0%, hsl(var(--bc)) ${progress}%, rgba(255, 255, 255, 0.15) ${progress}%)`
      // }}
    >
      <div
        className='h-0.5 transition-[width] duration-100 ease-linear bg-foreground/70'
        style={{
          width: `${progress}%`
        }}
      />
    </div>
  );
};

export default Header;
