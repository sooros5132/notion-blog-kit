import { Client as NotionClient, LogLevel } from '@notionhq/client';
import {
  INotionSearch,
  INotionSearchObject,
  INotionUserInfo,
  NotionBlock,
  NotionBlocksChildrenList,
  NotionDatabasesQuery
} from 'src/types/notion';

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

export class NotionService {
  protected notion;

  constructor() {
    const NOTION_API_SECRET_KEY = process.env.NOTION_API_SECRET_KEY;
    if (!NOTION_API_SECRET_KEY) {
      throw '`NOTION_API_SECRET_KEY` environment variable setting missing';
    }

    this.notion = new NotionClient({
      auth: process.env.NOTION_API_SECRET_KEY,
      logLevel: process.env.NODE_ENV === 'development' ? LogLevel.DEBUG : undefined
    });
  }

  public async getPageInfoByPageId(pageId: string) {
    const pageInfo = await this.notion.pages.retrieve({
      page_id: pageId
    });

    return pageInfo as INotionSearchObject;
  }

  public async getBlocksByBlockId({ blockId, pageSize, startCursor }: BlocksParams) {
    const blocks = (await this.notion.blocks.children.list({
      block_id: blockId,
      page_size: pageSize,
      start_cursor: startCursor
    })) as unknown as NotionBlocksChildrenList;

    return blocks;
  }

  // 모든 Children 반환
  private async getAllChildrenRecordByBlockId(params: BlocksParams) {
    let childrenRecord: Record<string, NotionBlocksChildrenList> = {};

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
      } as NotionBlocksChildrenList;
    } while (hasMore && startCursor);

    for await (const block of childrenRecord[params.blockId].results) {
      const { has_children } = block as NotionBlocksChildrenList['results'][number];
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

  public async getAllBlocksAndChildrens(blockId: string) {
    const databaseBlocks: Record<string, NotionDatabasesQuery> = {};
    let childrenBlocks: Record<string, NotionBlocksChildrenList> = {};
    const moreFetch: Array<any> = [];

    const blocks = await this.getBlocksByBlockId({
      blockId
    });

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
            childrenBlocks = { ...childrenBlocks, ...result };
          })
        );
        continue;
      }
      switch (block.type) {
        case 'child_database': {
          moreFetch.push(
            this.getDatabasesById(block.id).then((database) => {
              databaseBlocks[block.id] = database as NotionDatabasesQuery;
            })
          );
          continue;
        }
      }
    }

    await Promise.all(moreFetch);

    return {
      blocks,
      childrenBlocks,
      databaseBlocks
    };
  }

  public async getDatabasesById(id: string) {
    const databases = (await this.notion.databases.query({
      database_id: id
    })) as NotionDatabasesQuery;

    return databases;
  }

  public async getSearchPagesByPageId({ searchValue, filterType, direction }: SearchParams) {
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

    return search as INotionSearch;
  }

  public async getSearchPagesByPageTitle({ searchValue, filterType, direction }: SearchParams) {
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

  async getUserProfile(userId: string) {
    const profile = (await this.notion.users
      .retrieve({ user_id: userId })
      .catch(() => null)) as INotionUserInfo | null;

    return profile;
  }
}
