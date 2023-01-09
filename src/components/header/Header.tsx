import type React from 'react';
import { useRef, useState } from 'react';
import Link from 'next/link';
import { useEffect } from 'react';
import { throttle } from 'lodash';
import config from 'site-config';
import { SearchForm } from '../search/SearchForm';

const Header: React.FC = (): JSX.Element => {
  return (
    <nav className='sticky top-0 left-0 z-10 bg-base-100/80 backdrop-blur-xl'>
      <div className='max-w-screen-lg mx-auto flex justify-between p-2'>
        <div className='flex-1'>
          <Link className='text-xl rounded-md btn btn-ghost btn-sm h-full normal-case' href='/'>
            {/* <AiFillThunderbolt />&nbsp; */}
            {config.infomation.blogname}
          </Link>
        </div>
        <div className='flex gap-1 md:gap-2 whitespace-nowrap overflow-x-auto scrollbar-hidden'>
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
          <div className='max-w-[150px] sm:max-w-[200px]'>
            <SearchForm autoInputHidden={true} />
          </div>
        </div>
        {/* <FlexAlignItemsCenterBox>
          <Box
            sx={
              mode === 'dark'
                ? {
                    color: theme.color.textDefaultWhite
                  }
                : {
                    color: theme.color.textDefaultBlack
                  }
            }
          >
            {mode === 'dark' ? (
              <IconButton color='inherit' onClick={() => useLightTheme()}>
                <MdDarkMode />
              </IconButton>
            ) : (
              <IconButton color='inherit' onClick={() => useDarkTheme()}>
                <MdLightMode />
              </IconButton>
            )}
          </Box>
        </FlexAlignItemsCenterBox> */}
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
        background: `linear-gradient(90deg, rgba(255, 255, 255, 1) 0%, rgba(255, 255, 255, 1) ${progress}%, rgba(255, 255, 255, 0.15) ${progress}%)`
      }}
    />
  );
};

export default Header;
