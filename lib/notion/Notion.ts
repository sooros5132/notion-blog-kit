import { Client, LogLevel } from '@notionhq/client';
import type { QueryDatabaseParameters } from '@notionhq/client/build/src/api-endpoints';
import { sortBy } from 'lodash';
import { siteConfig } from 'site-config';
import { REVALIDATE } from 'src/lib/notion';
import {
  CachedNotionBlogProperties,
  Color,
  INotionPage,
  INotionSearch,
  INotionSearchDatabase,
  INotionSearchObject,
  INotionUserInfo,
  NotionBlockAndChilrens,
  NotionBlocks,
  NotionBlogProperties,
  NotionDatabasesQuery,
  PropertiesForDatabasePageInfo
} from 'src/types/notion';
import * as notionCache from './cache';

type BlocksParams = {
  blockId: string;
  pageSize?: number;
  startCursor?: string;
};

type SearchParams = {
  searchValue: string;
  filter?: 'page' | 'database';
  direction?: 'ascending' | 'descending';
};

export class NotionClient {
  protected notion;

  constructor() {
    const NOTION_API_SECRET_KEY = process.env.NOTION_API_SECRET_KEY;
    if (!NOTION_API_SECRET_KEY) {
      throw '`NOTION_API_SECRET_KEY` environment variable setting missing';
    }

    this.notion = new Client({
      auth: process.env.NOTION_API_SECRET_KEY,
      logLevel: process.env.DEBUG_LOGS ? LogLevel.DEBUG : undefined
    });
  }

  private async getBlocksByBlockId({ blockId, pageSize, startCursor }: BlocksParams) {
    const blocks = (await this.notion.blocks.children.list({
      block_id: blockId,
      page_size: pageSize,
      start_cursor: startCursor
    })) as unknown as NotionBlocks;

    return blocks;
  }

  // 모든 Children 반환
  private async getAllChildrenRecordByBlockId(params: BlocksParams) {
    let childrenRecord: Record<string, NotionBlocks> = {};

    let hasMore = false;
    let startCursor: string | null = null;
    do {
      const childrens = await this.notion.blocks.children.list({
        block_id: params.blockId,
        page_size: params.pageSize,
        start_cursor: params.startCursor
      });

      hasMore = childrens.has_more;
      startCursor = childrens.next_cursor;

      childrenRecord[params.blockId] = {
        ...childrens,
        results: [...(childrenRecord[params.blockId]?.results ?? []), ...childrens.results]
      } as NotionBlocks;
    } while (hasMore && startCursor);

    for await (const block of childrenRecord[params.blockId].results) {
      const { has_children } = block as NotionBlocks['results'][number];
      if (has_children) {
        await this.getAllChildrenRecordByBlockId({
          blockId: block.id
        }).then((children) => {
          childrenRecord = { ...childrenRecord, ...children };
        });
      }
    }

    return childrenRecord;
  }

  async getAllBlocksAndChildrens(blockId: string) {
    const databaseRecord: Record<string, NotionDatabasesQuery> = {};
    let childrenRecord: Record<string, NotionBlocks> = {};
    const moreFetch: Array<any> = [];

    const blocks = (await this.getBlocksByBlockId({
      blockId
    })) as NotionBlockAndChilrens;

    // 모든 블럭들 가져오기
    let hasMore = blocks.has_more;
    let startCursor = blocks.next_cursor;
    while (hasMore && startCursor) {
      const moreBlocks = await this.getBlocksByBlockId({
        blockId,
        startCursor: startCursor || undefined
      });

      blocks.results.push(...moreBlocks.results);

      hasMore = moreBlocks.has_more;
      startCursor = moreBlocks.next_cursor;
    }

    // has_children 블럭들 가져오기
    for (const block of blocks.results) {
      if (block.has_children) {
        // 재귀함수
        moreFetch.push(
          this.getAllChildrenRecordByBlockId({ blockId: block.id }).then((result) => {
            childrenRecord = { ...childrenRecord, ...result };
          })
        );
      }
      switch (block.type) {
        case 'child_database': {
          moreFetch.push(
            this.getPagesInDatabaseByDatabaseId({
              id: block.id
            })
              .then((database) => {
                databaseRecord[block.id] = database as NotionDatabasesQuery;
              })
              .catch(() => {
                // TODO 링크 데이터베이스 지원하면 수정하기.
                console.warn('Linked Database is not supported.');
              })
          );
          continue;
        }
      }
    }

    await Promise.all(moreFetch);

    const childDatabaseFetching: Array<any> = [];
    const childrens = Object.values(childrenRecord);
    for (const children of childrens) {
      if (!Array.isArray(children.results)) {
        continue;
      }
      for (const block of children.results) {
        if (block.type === 'child_database') {
          childDatabaseFetching.push(
            this.getPagesInDatabaseByDatabaseId({
              id: block.id
            })
              .then((database) => {
                databaseRecord[block.id] = database as NotionDatabasesQuery;
              })
              .catch(() => {
                // TODO 링크 데이터베이스 지원하면 수정하기.
                console.warn('Linked Database is not supported.');
              })
          );
        }
      }
    }
    await Promise.all(childDatabaseFetching);

    blocks.childrenRecord = childrenRecord;
    blocks.databaseRecord = databaseRecord;

    return blocks;
  }

  async getPagesInDatabaseByDatabaseId(querys: {
    id: string;
    pageSize?: number;
    startCursor?: string;
  }) {
    const database = (await this.notion.databases.query({
      database_id: querys.id,
      start_cursor: querys.startCursor,
      page_size: querys.pageSize
    })) as NotionDatabasesQuery;

    return database;
  }

  async getAllPageInDatabase(querys: {
    databaseId: string;
    filter?: QueryDatabaseParameters['filter'];
    sorts?: QueryDatabaseParameters['sorts'];
  }) {
    let database = {} as NotionDatabasesQuery;
    const blocks: NotionDatabasesQuery['results'] = [];

    do {
      const getDatabase = (await this.notion.databases.query({
        database_id: querys.databaseId,
        sorts: querys.sorts,
        filter: querys.filter,
        start_cursor: database?.next_cursor || undefined
      })) as NotionDatabasesQuery;

      if (!getDatabase) {
        break;
      }
      database = getDatabase;
      if (getDatabase.results?.length) {
        blocks.push(...getDatabase.results);
      }
    } while (database.has_more && database.next_cursor);

    return database;
  }

  async getDatabaseInfo(querys: { databaseId: string }) {
    const blockInfo = (await this.notion.databases
      .retrieve({
        database_id: querys.databaseId
      })
      .catch(() => null)) as INotionSearchDatabase;

    return blockInfo;
  }
  async getBlockInfoByBlockId(blockId: string) {
    const blockInfo = await this.notion.blocks
      .retrieve({
        block_id: blockId
      })
      .catch(() => null);

    return blockInfo;
  }

  async getSearchPagesByDatabase({ searchValue, direction }: SearchParams) {
    const results: INotionSearch['results'] = [];
    let start_cursor: undefined | string;

    do {
      const search = await this.notion.databases.query({
        database_id: siteConfig.notion.baseBlock,
        filter: {
          property: 'title',
          title: {
            contains: searchValue
          }
        },
        sorts: direction
          ? [
              {
                direction,
                timestamp: 'created_time'
              }
            ]
          : undefined,
        start_cursor
      });

      if (Array.isArray(search?.results) && search.results.length > 0) {
        results.push(...(search.results as INotionSearchObject[]));
      }
      start_cursor = search.next_cursor || undefined;
    } while (start_cursor);

    const filteredResults = results.filter(
      (search) =>
        search?.properties?.publishedAt?.type !== 'date' ||
        (search?.properties?.publishedAt?.type === 'date' &&
          search?.properties?.publishedAt?.date?.start)
    );

    return filteredResults;
  }

  async getSearchPagesByWorkspace({ searchValue, filter, direction }: SearchParams) {
    const results: INotionSearch['results'] = [];
    let start_cursor: undefined | string;

    do {
      const search = await this.notion.search({
        query: searchValue,
        filter: filter
          ? {
              property: 'object',
              value: filter
            }
          : undefined,
        sort: direction
          ? {
              direction,
              timestamp: 'last_edited_time'
            }
          : undefined,
        start_cursor
      });

      if (Array.isArray(search?.results) && search.results.length > 0) {
        results.push(...(search.results as INotionSearchObject[]));
      }
      start_cursor = search.next_cursor || undefined;
    } while (start_cursor);

    const filteredResults = results.filter(
      (search) =>
        search?.properties?.publishedAt?.type !== 'date' ||
        (search?.properties?.publishedAt?.type === 'date' &&
          search?.properties?.publishedAt?.date?.start)
    );

    return filteredResults;
  }

  async getPageInfo(querys: { pageId: string }) {
    const pageInfo = await this.notion.pages
      .retrieve({
        page_id: querys.pageId
      })
      .catch(() => null);

    return pageInfo as INotionSearchObject;
  }

  async getUserInfoByUserId(userId: string) {
    const profile = (await this.notion.users
      .retrieve({ user_id: userId })
      .catch(() => null)) as INotionUserInfo | null;

    return profile;
  }

  async getPageByPageId(blockId: string): Promise<INotionPage> {
    const NO_CACHED = 'no cached';
    try {
      const exists = await this.accessCache(blockId);

      if (!exists) {
        throw NO_CACHED;
      }

      const cachePage = await this.getCache<
        INotionPage & {
          cachedTime: string;
        }
      >(blockId);
      if (!cachePage) {
        throw NO_CACHED;
      }

      const { cachedTime, ...page } = cachePage;
      if (!page?.pageInfo?.last_edited_time) {
        throw NO_CACHED;
      }

      const timeDiff = Date.now() - new Date(cachedTime).getTime();

      // 캐시된 시간이 55분이 지났으면 다시
      if (!cachedTime || timeDiff > 55 * 60 * 1000) {
        throw NO_CACHED;
      }

      // REVALIDATE 안이면 리턴
      if (timeDiff <= REVALIDATE * 1000) {
        return page;
      }

      const newestPageInfo = await this.getPageInfo({ pageId: blockId });

      if (page.pageInfo.last_edited_time === newestPageInfo.last_edited_time) {
        return page;
      }
      throw NO_CACHED;
    } catch (e) {
      const [blocksAndChildrens, pageInfo] = await Promise.all([
        this.getAllBlocksAndChildrens(blockId),
        this.getPageInfo({ pageId: blockId })
      ]);
      const userInfo = await this.getUserInfoByUserId(pageInfo.created_by.id);

      const page: INotionPage = {
        block: blocksAndChildrens,
        pageInfo,
        userInfo
      };

      await this.setCache(blockId, {
        cachedTime: Date.now(),
        ...page
      });

      return page;
    }
  }

  async getAllPublishedPageInDatabase(querys: {
    databaseId: string;
    filter?: {
      category?: string;
      tag?: string;
    };
    pageProperties?: PropertiesForDatabasePageInfo;
  }) {
    const filter = [] as Array<QueryDatabaseParameters['filter']>;
    if (querys.filter?.category) {
      filter.push({
        property: 'category',
        select: {
          equals: querys.filter.category
        }
      });
    }
    if (querys.filter?.tag) {
      filter.push({
        property: 'tags',
        multi_select: {
          contains: querys.filter.tag
        }
      });
    }

    const havePublishedAt = querys.pageProperties?.publishedAt?.type === 'date';

    const databaseId = querys.databaseId;
    const database = await this.getAllPageInDatabase({
      databaseId,
      filter: havePublishedAt
        ? {
            and: [
              {
                property: 'publishedAt',
                date: {
                  is_not_empty: true
                }
              },
              ...(filter as any)
            ]
          }
        : undefined,
      sorts: havePublishedAt
        ? [
            {
              property: 'publishedAt',
              direction: 'descending'
            }
          ]
        : undefined
    });

    return database;
  }

  async getDatabaseByDatabaseId(querys: {
    databaseId: string;
    filter?: {
      category?: string;
      tag?: string;
    };
  }): Promise<INotionPage> {
    const databaseId = querys.databaseId;
    const NO_CACHED = 'no cached';
    try {
      if (querys.filter) {
        throw NO_CACHED;
      }

      const exists = await this.accessCache(databaseId);
      if (!exists) {
        throw NO_CACHED;
      }

      const cachePage = await this.getCache<
        INotionPage & {
          cachedTime: string;
        }
      >(databaseId);
      if (!cachePage) {
        throw NO_CACHED;
      }

      const { cachedTime, ...page } = cachePage;
      if (!page?.pageInfo?.last_edited_time) {
        throw NO_CACHED;
      }

      const timeDiff = Date.now() - new Date(cachedTime).getTime();

      // 캐시된 시간이 55분이 지났으면 다시
      if (!cachedTime || timeDiff > 55 * 60 * 1000) {
        throw NO_CACHED;
      }

      // REVALIDATE 안이면 리턴
      if (timeDiff <= REVALIDATE * 1000) {
        return page;
      }

      const newestPageInfo = await this.getDatabaseInfo({ databaseId: databaseId });

      if (page.pageInfo.last_edited_time === newestPageInfo.last_edited_time) {
        return page;
      }
      throw NO_CACHED;
    } catch (e) {
      const pageInfo = await this.getDatabaseInfo({ databaseId });
      const database = await this.getAllPublishedPageInDatabase({
        databaseId,
        filter: querys.filter,
        pageProperties: pageInfo.properties
      });
      const userInfo = await this.getUserInfoByUserId(pageInfo.created_by.id);

      const page = {
        block: {
          ...database,
          childrenRecord: {},
          databaseRecord: { [databaseId]: database }
        } as unknown as NotionBlockAndChilrens,
        pageInfo,
        userInfo
      };

      if (!querys.filter) {
        await this.setCache(databaseId, {
          cachedTime: Date.now(),
          ...page
        });
      }

      return page as INotionPage;
    }
  }
  async getMainDatabase(): Promise<INotionPage> {
    const databaseId = siteConfig.notion.baseBlock;

    const database = await this.getDatabaseByDatabaseId({
      databaseId
    });

    return database;
  }

  async searchSlug(querys: { slug: string; property: string }) {
    const search = await this.notion.databases
      .query({
        database_id: siteConfig.notion.baseBlock,
        filter: {
          property: querys.property,
          rich_text: {
            equals: querys.slug
          }
        },
        sorts: [
          {
            property: 'publishedAt',
            direction: 'descending'
          }
        ]
      })
      .then((res) => res.results?.[0] || null);

    return search;
  }

  async getBlogProperties(): Promise<NotionBlogProperties> {
    const databaseId = siteConfig.notion.baseBlock;
    const cacheKey = 'blog-properties';
    const NO_CACHED = 'no cached';
    try {
      const exists = await this.accessCache(cacheKey);
      if (!exists) {
        throw NO_CACHED;
      }

      const cacheData = await this.getCache<CachedNotionBlogProperties>(cacheKey);
      if (!cacheData) {
        throw NO_CACHED;
      }

      const { cachedTime, lastEditedTime, categories, tags } = cacheData;
      if (!lastEditedTime || cacheData.databaseId !== databaseId) {
        throw NO_CACHED;
      }

      const timeDiff = Date.now() - new Date(cachedTime).getTime();

      // 캐시된 시간이 55분이 지났으면 다시
      if (!cachedTime || timeDiff > 55 * 60 * 1000) {
        throw NO_CACHED;
      }

      // REVALIDATE 안이면 리턴
      if (timeDiff <= REVALIDATE * 1000) {
        return { categories, tags };
      }

      const newestDatabaseInfo = await this.getDatabaseInfo({ databaseId: databaseId });

      if (lastEditedTime === newestDatabaseInfo.last_edited_time) {
        return { categories, tags };
      }
      throw NO_CACHED;
    } catch (e) {
      const database = await this.getDatabaseByDatabaseId({ databaseId });
      const blocks = database.block as unknown as NotionDatabasesQuery;
      const databaseInfo = database.pageInfo as INotionSearchDatabase;

      const tags: NotionBlogProperties['tags'] = sortBy(
        databaseInfo?.properties?.tags?.multi_select?.options || [],
        'name'
      );

      const categories: NotionBlogProperties['categories'] = [];
      if (databaseInfo?.properties.category?.type === 'select') {
        const categoriesRecord = blocks.results.reduce<Record<string, typeof categories[number]>>(
          (prev, current) => {
            const category = current?.properties?.category?.select;
            if (!category) {
              return prev;
            }

            const newCategory: typeof categories[number] = {
              ...category,
              count: prev[category.name]?.count ? prev[category.name]?.count + 1 : 1
            };

            return {
              ...prev,
              [category.name]: newCategory
            };
          },
          {}
        );

        Object.keys(categoriesRecord).forEach((category) =>
          categories.push(categoriesRecord[category])
        );
      }

      const blogProperties = {
        categories,
        tags
      };

      const cacheBlogProperties: CachedNotionBlogProperties = {
        ...blogProperties,
        databaseId,
        lastEditedTime: database.pageInfo.last_edited_time,
        cachedTime: Date.now()
      };

      await this.setCache(cacheKey, cacheBlogProperties);

      return blogProperties;
    }
  }

  async accessCache(blockId: string) {
    return await notionCache.accessCache(blockId);
  }

  async getCache<T>(blockId: string) {
    return await notionCache.get<T>(blockId);
  }

  async setCache(blockId: string, content: any) {
    return await notionCache.set(blockId, content);
  }
}
