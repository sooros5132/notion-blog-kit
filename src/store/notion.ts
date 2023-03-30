import { INotionPage, NotionBlocks, NotionDatabasesQuery } from 'src/types/notion';
import create from 'zustand';

export interface NotionState {
  slug?: string;
  baseBlock?: INotionPage['block'];
  databaseRecord: Record<string, NotionDatabasesQuery>;
  childrenRecord: Record<string, NotionBlocks>;
}

export interface NotionStore extends NotionState {
  setSlug: (slug: string) => void;
  setBaseBlock: (block: NotionState['baseBlock']) => void;
  setDatabaseRecord: (databaseRecord: NotionState['databaseRecord']) => void;
  setChildrenRecord: (childrenRecord: NotionState['childrenRecord']) => void;
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
  }
}));
