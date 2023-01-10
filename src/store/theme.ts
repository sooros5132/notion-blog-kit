import create from 'zustand';
import { persist } from 'zustand/middleware';

export interface ThemeState {
  mode: 'light' | 'dark';
}

export interface ThemeStore extends ThemeState {
  changeTheme: (mode: ThemeState['mode']) => void;
}

const defaultState: ThemeState = {
  mode: 'dark'
};

const initialState = { ...defaultState };

export const useThemeStore = create(
  persist<ThemeStore>(
    (set, get) => ({
      ...initialState,
      changeTheme(mode) {
        switch (mode) {
          case 'dark':
          case 'light': {
            set(() => ({
              mode
            }));
            break;
          }
          default: {
            set(() => ({
              mode: 'dark'
            }));
            break;
          }
        }
      }
    }),
    {
      name: 'theme', // unique name
      getStorage: () => localStorage, // (optional) by default, 'localStorage' is used
      version: 0.4
    }
  )
);
