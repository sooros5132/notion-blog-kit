import type React from 'react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { throttle } from 'lodash';
import { siteConfig } from 'site-config';
import { SearchForm } from 'src/components/search/SearchForm';
import classNames from 'classnames';
import { ThemeChangeButton } from '../modules/ThemeChangeButton';
import { useSiteSettingStore } from 'src/store/siteSetting';
import { FaArrowRight } from 'react-icons/fa';
import { HiMenu } from 'react-icons/hi';
import { useNotionStore } from 'src/store/notion';
import shallow from 'zustand/shallow';

const Header: React.FC = (): JSX.Element => {
  const [visibleHeader, setVisibleHeader] = useState(true);
  const { hydrated, enableSideBarMenu, closeSideBarMenu, openSideBarMenu } = useSiteSettingStore();
  const blogProperties = useNotionStore(({ blogProperties }) => blogProperties, shallow);

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
      className={classNames(
        'sticky left-0 h-[var(--header-height)] bg-base-200/50 backdrop-blur-xl transition-[top] duration-300 z-10',
        visibleHeader && !enableSideBarMenu ? 'top-0' : '-top-[var(--header-height)]'
      )}
    >
      <div className='h-full flex justify-between items-center mx-auto p-2 gap-x-1'>
        <div className='flex-1 whitespace-nowrap'>
          <Link
            className='text-xl rounded-md btn btn-ghost btn-sm h-full normal-case px-2'
            href='/'
          >
            {/* <AiFillThunderbolt />&nbsp; */}
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
                    href={`/${encodeURIComponent(item.slug)}`}
                    className='btn-sm rounded-lg h-full py-1 px-2'
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
          </ul>
        </div> */}
        <div className='max-w-[150px] sm:max-w-[200px]'>
          <SearchForm />
        </div>
        <div className='flex items-center'>
          <ThemeChangeButton />
          {hydrated ? (
            blogProperties && (
              <button
                className='btn btn-circle btn-sm btn-ghost text-xl'
                onClick={handleClickSideBarMenuButton}
              >
                {enableSideBarMenu ? <FaArrowRight /> : <HiMenu />}
              </button>
            )
          ) : (
            <div className='w-8' />
          )}
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
      className='h-0.5 bg-base-content/30'
      // style={{
      //   background: `linear-gradient(90deg, hsl(var(--bc)) 0%, hsl(var(--bc)) ${progress}%, rgba(255, 255, 255, 0.15) ${progress}%)`
      // }}
    >
      <div
        className='h-0.5 transition-[width] duration-100 ease-linear bg-base-content/70'
        style={{
          width: `${progress}%`
        }}
      />
    </div>
  );
};

export default Header;
