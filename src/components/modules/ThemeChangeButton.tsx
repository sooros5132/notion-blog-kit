import type React from 'react';
import classNames from 'classnames';
import { useState, useEffect } from 'react';
import { HiSun, HiMoon } from 'react-icons/hi';
import { useThemeStore } from 'src/store/theme';

export const ThemeChangeButton: React.FC = () => {
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

  return isHydrated ? (
    <label
      className='swap swap-rotate btn btn-circle btn-ghost btn-sm text-lg items-center'
      onClickCapture={handleClickThemeSwap}
    >
      <input type='checkbox' aria-label='theme-mode-change-button' />
      <HiSun key='light' className={classNames(mode === 'dark' ? 'swap-on' : 'swap-off')} />
      <HiMoon key='dark' className={classNames(mode === 'light' ? 'swap-on' : 'swap-off')} />
    </label>
  ) : (
    <div className='w-8'></div>
  );
};
