import React, { useRef } from 'react';
import Link from 'next/link';
import { useEffect } from 'react';
import { throttle } from 'lodash';
import config from 'site-config';
import Search from '../search/Search';

interface HeaderProps {}

const Header: React.FC<HeaderProps> = (): JSX.Element => {
  // const { mode, useDarkTheme, useLightTheme } = useThemeStore(
  //   ({ mode, useDarkTheme, useLightTheme }) => ({ mode, useDarkTheme, useLightTheme }),
  //   shallow
  // );
  // const { data, error } = useSWR("/key", fetch);
  const ref = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const scrollEvent = (e: Event) => {
      const headerBarRef = ref.current;
      if (!headerBarRef) {
        return;
      }
      const gap = document.body.scrollHeight - window.innerHeight;
      const left = 100 * (window.scrollY / gap);
      const right = 100 - left;

      if (gap === 0) {
        headerBarRef.style.background = 'none';
        return;
      }
      headerBarRef.style.background = `linear-gradient(to right, rgba(255, 255, 255, 1) ${left}%, rgba(255, 255, 255, 0.15) ${left}% ${right}%)`;
    };

    window.addEventListener('scroll', throttle(scrollEvent, 1000 / 60));
    return () => window.removeEventListener('scroll', scrollEvent);
  }, []);

  return (
    <nav className='sticky top-0 left-0 z-10 bg-base-100/80 backdrop-blur-xl'>
      <div className='max-w-screen-lg mx-auto navbar'>
        <div className='flex-1'>
          <Link href='/'>
            <a className='text-xl normal-case rounded-md btn btn-ghost'>
              {/* <AiFillThunderbolt />&nbsp; */}
              soolog
            </a>
          </Link>
        </div>
        <div className='flex-none gap-1 md:gap-2'>
          <div className='max-w-[150px] sm:max-w-[200px]'>
            <Search autoInputHidden={true} />
          </div>
          <ul className='gap-1 p-0 md:gap-2 menu menu-horizontal'>
            {Array.isArray(config.headerNav) &&
              config.headerNav.length > 0 &&
              config.headerNav.map((item, i) => (
                <li key={`header-nav-item-${i}`}>
                  <Link href={`/${item.slug}`}>
                    <a>{item.name}</a>
                  </Link>
                </li>
              ))}
          </ul>
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
      <div
        ref={ref}
        className='h-0.5 bg-white opacity-50 transition-[background] duration-100'
      ></div>
    </nav>
  );
};
Header.displayName = 'Header';

export default Header;
