import type React from 'react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { throttle } from 'lodash';
import config from 'site-config';
import { SearchForm } from '../search/SearchForm';
import { useThemeStore } from 'src/store/theme';
import { HiSun, HiMoon } from 'react-icons/hi';
import classNames from 'classnames';

const Header: React.FC = (): JSX.Element => {
  const { mode, changeTheme } = useThemeStore();
  const [isHydrated, setIsHydrated] = useState(false);

  const handleClickThemeSwap = (event: React.MouseEvent<HTMLLabelElement>) => {
    event.stopPropagation();
    event.preventDefault();
    switch (mode) {
      case 'light': {
        changeTheme('dark');
        break;
      }
      case 'dark': {
        changeTheme('light');
        break;
      }
    }
  };

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  return (
    <nav className='sticky top-0 left-0 z-10 bg-base-200/50 backdrop-blur-xl'>
      <div className='flex justify-between items-center max-w-screen-lg mx-auto p-2 gap-x-1'>
        <div className='flex-1'>
          <Link className='text-xl rounded-md btn btn-ghost btn-sm h-full normal-case' href='/'>
            {/* <AiFillThunderbolt />&nbsp; */}
            {config.infomation.blogname}
          </Link>
        </div>
        <div className='flex gap-1 md:gap-2 whitespace-nowrap overflow-x-auto overflow-y-hidden scrollbar-hidden'>
          <ul className='gap-1 p-0 md:gap-2 menu menu-horizontal'>
            {Array.isArray(config.headerNav) &&
              config.headerNav.length > 0 &&
              config.headerNav.map((item, i) => (
                <li key={`header-nav-item-${i}`}>
                  <Link href={`/${item.slug}`} className='btn-sm rounded-lg h-full py-1 px-2'>
                    {item.name}
                  </Link>
                </li>
              ))}
          </ul>
        </div>
        <div className='max-w-[150px] sm:max-w-[200px]'>
          <SearchForm autoInputHidden={true} />
        </div>
        {isHydrated && (
          <label
            className='swap swap-rotate btn btn-circle btn-ghost btn-sm text-lg items-center'
            onClickCapture={handleClickThemeSwap}
          >
            <input type='checkbox' />
            <HiSun key='light' className={classNames(mode === 'dark' ? 'swap-on' : 'swap-off')} />
            <HiMoon key='dark' className={classNames(mode === 'light' ? 'swap-on' : 'swap-off')} />
          </label>
        )}
      </div>
      <ScrollProgressBar />
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
    const throttleScrollEvent = throttle(scrollEvent, 1000 / 60); // 1초당 최대 60프레임으로 설정

    window.addEventListener('scroll', throttleScrollEvent);
    return () => window.removeEventListener('scroll', throttleScrollEvent);
  }, []);

  return (
    <div
      className='h-0.5 bg-white opacity-50 transition-[background] duration-100'
      style={{
        background: `linear-gradient(90deg, hsl(var(--bc)) 0%, hsl(var(--bc)) ${progress}%, rgba(255, 255, 255, 0.15) ${progress}%)`
      }}
    />
  );
};

export default Header;
