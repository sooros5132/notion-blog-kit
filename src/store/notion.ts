'use client';

import { createWithEqualityFn as create } from 'zustand/traditional';
import type {
  BlogArticleRelation,
  BlogProperties,
  ChildrensRecord,
  DatabasesRecord,
  GetNotionBlock
} from '@/types/notion';
import { useEffect, type PropsWithChildren } from 'react';

export interface NotionState {
  slug?: string;
  baseBlock?: GetNotionBlock['block'];
  userInfo?: GetNotionBlock['userInfo'];
  pageInfo?: GetNotionBlock['pageInfo'];
  databasesRecord?: DatabasesRecord;
  childrensRecord?: ChildrensRecord;
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

export const useNotionStore = create<NotionStore>(
  (set) => ({
    ...initialState,
    init(params) {
      set({
        ...params
      });
    }
  }),
  Object.is
);

type NotionStoreProviderProps = {
  store?: Partial<NotionState>;
} & PropsWithChildren;

export const NotionStoreProvider: React.FC<NotionStoreProviderProps> = ({ store, children }) => {
  useEffect(() => {
    if (typeof store !== 'undefined') useNotionStore.getState().init(store);
  }, [store]);

  return typeof children !== 'undefined' ? children : null;
};
