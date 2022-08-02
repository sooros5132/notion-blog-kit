import React, { useRef } from 'react';
import { AiFillThunderbolt } from 'react-icons/ai';
import Link from 'next/link';
import { useEffect } from 'react';
import { throttle } from 'lodash';

interface HeaderProps {}

const Header: React.FC = (): JSX.Element => {
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
    <nav className='sticky top-0 left-0 z-10 bg-stone-900 backdrop-blur-xl backdrop-brightness-120 bg-opacity-60'>
      <div className='flex justify-between max-w-screen-xl px-2 mx-auto text-xl'>
        <div className='py-1.5'>
          <Link href='/'>
            <a className='btn btn-ghost normal-case rounded-md btn-sm text-xl px-1.5'>
              <AiFillThunderbolt />
              &nbsp;soolog
            </a>
          </Link>
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
