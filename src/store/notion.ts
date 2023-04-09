import {
  INotionPage,
  NotionBlocks,
  NotionBlogProperties,
  NotionDatabasesQuery
} from 'src/types/notion';
import create from 'zustand';

export interface NotionState {
  slug?: string;
  baseBlock?: INotionPage['block'];
  userInfo?: INotionPage['userInfo'];
  pageInfo?: INotionPage['pageInfo'];
  databaseRecord?: Record<string, NotionDatabasesQuery>;
  childrenRecord?: Record<string, NotionBlocks>;
  blogProperties?: NotionBlogProperties;
}

export interface NotionStore extends NotionState {
  setSlug: (slug: string) => void;
  setBaseBlock: (block: NotionState['baseBlock']) => void;
  setDatabaseRecord: (databaseRecord: NotionState['databaseRecord']) => void;
  setChildrenRecord: (childrenRecord: NotionState['childrenRecord']) => void;
  init: (params: NotionState) => void;
}

const defaultState: NotionState = {
  childrenRecord: {},
  databaseRecord: {}
};

const initialState = { ...defaultState };

export const useNotionStore = create<NotionStore>((set, get) => ({
  ...initialState,
  setSlug(slug) {
    set({ slug });
  },
  setBaseBlock(block) {
    set({ baseBlock: block });
  },
  setDatabaseRecord(databaseRecord) {
    set({ databaseRecord });
  },
  setChildrenRecord(childrenRecord) {
    set({ childrenRecord });
  },
  init(params) {
    set({
      ...params
    });
  }
}));
