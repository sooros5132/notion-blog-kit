import { Client, LogLevel } from '@notionhq/client';
import {
  INotionPage,
  INotionSearch,
  INotionSearchObject,
  INotionUserInfo,
  NotionBlockAndChilrens,
  NotionBlocks,
  NotionDatabasesQuery
} from 'src/types/notion';
import * as notionCache from './cache';

type BlocksParams = {
  blockId: string;
  pageSize?: number;
  startCursor?: string;
};

type SearchParams = {
  searchValue: string;
  filterType: 'page' | 'database';
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
      logLevel: process.env.NODE_ENV === 'development' ? LogLevel.DEBUG : undefined
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
            this.getPagesInDatabaseByDatabaseId(block.id).then((database) => {
              databaseRecord[block.id] = database as NotionDatabasesQuery;
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
            this.getPagesInDatabaseByDatabaseId(block.id).then((database) => {
              databaseRecord[block.id] = database as NotionDatabasesQuery;
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

  async getPagesInDatabaseByDatabaseId(id: string) {
    const database = (await this.notion.databases.query({
      database_id: id
    })) as NotionDatabasesQuery;

    // checkbox 속성이 없거나 checkbox가 true인 경우.
    const filterdBlocks = database.results.filter(
      (block) =>
        block.properties?.isPublished?.type !== 'checkbox' ||
        block.properties?.isPublished?.checkbox === true
    );
    database.results = filterdBlocks;

    return database;
  }

  async getDatabaseInfoByBlockId(databaseId: string) {
    const blockInfo = (await this.notion.databases
      .retrieve({
        database_id: databaseId
      })
      .catch(() => null)) as INotionSearchObject;

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

  async getSearchPagesByPageId({ searchValue, filterType, direction }: SearchParams) {
    const search = await this.notion.search({
      query: searchValue,
      sort: direction
        ? {
            direction: direction,
            timestamp: 'last_edited_time'
          }
        : undefined,
      filter: {
        value: filterType,
        property: 'object'
      }
    });

    return search as unknown as INotionSearch;
  }

  async getSearchPagesByPageTitle({ searchValue, filterType, direction }: SearchParams) {
    const results: INotionSearch['results'] = [];
    let start_cursor: undefined | string;

    do {
      await this.notion
        .search({
          sort: direction
            ? {
                direction: direction,
                timestamp: 'last_edited_time'
              }
            : undefined,
          filter: filterType
            ? {
                value: filterType,
                property: 'object'
              }
            : undefined,
          start_cursor
        })
        .then(async (res) => {
          if (Array.isArray(res?.results) && res.results.length > 0) {
            results.push(...(res.results as INotionSearchObject[]));
          }
          start_cursor = res.next_cursor || undefined;
        });
    } while (start_cursor);

    const filteredResults = results.filter((search) => {
      if (search?.properties?.isPublished?.checkbox === false) {
        return false;
      }
      const title = search?.properties.title?.title?.map((t) => t?.plain_text)?.join('');

      if (title) {
        return new RegExp(searchValue, 'mgi').test(title);
      }
      return false;
    });

    return filteredResults;
  }

  async getPageInfoByPageId(pageId: string) {
    const pageInfo = await this.notion.pages
      .retrieve({
        page_id: pageId
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
      if (!notionCache.exists(blockId)) {
        throw NO_CACHED;
      }
      const cachePage = notionCache.get(blockId) as INotionPage;
      if (!cachePage) {
        throw NO_CACHED;
      }

      const page = cachePage;
      if (!page?.pageInfo?.last_edited_time) {
        throw NO_CACHED;
      }

      const newestPageInfo = await this.getPageInfoByPageId(blockId);

      if (page.pageInfo.last_edited_time === newestPageInfo.last_edited_time) {
        if (process.env.NODE_ENV === 'development') {
          console.log('\x1b[37m\x1b[42m');
          console.log(`is cached post \`${blockId}\``, '\x1b[0m');
        }
        return page;
      }
      throw NO_CACHED;
    } catch (e) {
      const [blocksAndChildrens, pageInfo] = await Promise.all([
        this.getAllBlocksAndChildrens(blockId),
        this.getPageInfoByPageId(blockId)
      ]);
      const userInfo = await this.getUserInfoByUserId(pageInfo.created_by.id);

      const page: INotionPage = {
        block: blocksAndChildrens,
        pageInfo,
        userInfo
      };
      if (e === 'NO_CACHED') {
        notionCache.set(blockId, page);
      }

      return page;
    }
  }
  async getDatabaseByDatabaseId(blockId: string): Promise<INotionPage> {
    const NO_CACHED = 'no cached';
    try {
      if (!notionCache.exists(blockId)) {
        throw NO_CACHED;
      }
      const cachePage = notionCache.get(blockId) as INotionPage;
      if (!cachePage) {
        throw NO_CACHED;
      }

      const page = cachePage;
      if (!page?.pageInfo?.last_edited_time) {
        throw NO_CACHED;
      }

      const newestPageInfo = await this.getDatabaseInfoByBlockId(blockId);

      if (page.pageInfo.last_edited_time === newestPageInfo.last_edited_time) {
        if (process.env.NODE_ENV === 'development') {
          console.log('\x1b[37m\x1b[42m');
          console.log(`is cached database \`${blockId}\``, '\x1b[0m');
        }
        return page;
      }
      throw NO_CACHED;
    } catch (e) {
      const [blocksAndChildrens, pageInfo] = await Promise.all([
        this.getPagesInDatabaseByDatabaseId(blockId),
        this.getDatabaseInfoByBlockId(blockId)
      ]);
      const userInfo = await this.getUserInfoByUserId(pageInfo.created_by.id);

      const page: INotionPage = {
        block: {
          ...blocksAndChildrens,
          childrenRecord: {},
          databaseRecord: { [pageInfo.id]: blocksAndChildrens }
        } as unknown as NotionBlockAndChilrens,
        pageInfo,
        userInfo
      };

      if (e === 'NO_CACHED') {
        notionCache.set(blockId, page);
      }

      return page;
    }
  }
}
