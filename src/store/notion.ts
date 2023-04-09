import { BlogProperties, ChildrensRecord, DatabasesRecord, GetNotionBlock } from 'src/types/notion';
import create from 'zustand';

export interface NotionState {
  slug?: string;
  baseBlock?: GetNotionBlock['block'];
  userInfo?: GetNotionBlock['userInfo'];
  pageInfo?: GetNotionBlock['pageInfo'];
  databasesRecord: DatabasesRecord;
  childrensRecord: ChildrensRecord;
  blogProperties?: BlogProperties;
}

export interface NotionStore extends NotionState {
  // setSlug: (slug: string) => void;
  // setBaseBlock: (block: NotionState['baseBlock']) => void;
  // setDatabasesRecord: (databaseRecord: NotionState['databasesRecord']) => void;
  // setChildrensRecord: (childrenRecord: NotionState['childrensRecord']) => void;
  init: (params: NotionState) => void;
}

const defaultState: NotionState = {
  childrensRecord: {},
  databasesRecord: {}
};

const initialState = { ...defaultState };

export const useNotionStore = create<NotionStore>((set, get) => ({
  ...initialState,
  init(params) {
    set({
      ...params
    });
  }
}));
