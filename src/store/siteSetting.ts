import create from 'zustand';

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

export const useSiteSettingStore = create<ISiteSettingStore>((set, get) => ({
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
}));
