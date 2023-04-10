import type React from 'react';
import { useLayoutEffect } from 'react';
import {
  BlogArticleRelation,
  BlogProperties,
  ChildrensRecord,
  DatabasesRecord,
  GetNotionBlock
} from 'src/types/notion';
import create, { StoreApi } from 'zustand';
import createContext from 'zustand/context';

export interface NotionState {
  slug?: string;
  baseBlock?: GetNotionBlock['block'];
  userInfo?: GetNotionBlock['userInfo'];
  pageInfo?: GetNotionBlock['pageInfo'];
  databasesRecord: DatabasesRecord;
  childrensRecord: ChildrensRecord;
  blogProperties?: BlogProperties;
  blogArticleRelation?: BlogArticleRelation;
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

export const initializeNotionStore = (preloadedState = {}) =>
  create<NotionStore>((set) => ({
    ...initialState,
    ...preloadedState,
    init(params) {
      set({
        ...params
      });
    }
  }));

/** Dashboard Store with zustand and context api */
let store: ReturnType<typeof initializeNotionStore>;

export const useCreateNotionStore = (initialState: NotionState) => {
  if (typeof window === 'undefined') {
    return () => initializeNotionStore(initialState);
  }

  store = store ?? initializeNotionStore(initialState);

  // eslint-disable-next-line react-hooks/rules-of-hooks
  useLayoutEffect(() => {
    if (initialState && store) {
      store.setState({
        ...store.getState(),
        ...initialState
      });
    }
  }, [initialState]);

  return () => store;
};

export const NotionZustandContext = createContext<StoreApi<NotionState>>();

const useNotionStore = NotionZustandContext.useStore;
export { useNotionStore };
