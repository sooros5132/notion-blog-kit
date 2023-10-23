import { createWithEqualityFn } from 'zustand/traditional';
interface ISiteSettingState {
  hydrated: boolean;
  enableSideBarMenu: boolean;
}

const defaultState: ISiteSettingState = {
  hydrated: false,
  enableSideBarMenu: false
};

interface ISiteSettingStore extends ISiteSettingState {
  setHydrated: () => void;
  openSideBarMenu: () => void;
  closeSideBarMenu: () => void;
}

export const useSiteSettingStore = createWithEqualityFn<ISiteSettingStore>(
  (set, get) => ({
    ...defaultState,
    setHydrated() {
      set({
        hydrated: true
      });
    },
    openSideBarMenu() {
      set({
        enableSideBarMenu: true
      });
    },
    closeSideBarMenu() {
      set({
        enableSideBarMenu: false
      });
    }
  }),
  Object.is
);
