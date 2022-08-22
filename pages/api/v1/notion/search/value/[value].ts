import type { NextApiRequest, NextApiResponse } from 'next';
import nc from 'next-connect';
import { notion } from 'src-server/lib/notion';
import { Error } from 'src-server/middleware/Error';
import { IResponseSuccess } from 'src-server/types/response';
import { INotionSearch, INotionSearchObject } from 'src/types/notion';

const handler = nc<NextApiRequest, NextApiResponse>({
  onError: Error.handleError,
  onNoMatch: Error.handleNoMatch
}).get(async (req: NextApiRequest, res: NextApiResponse<IResponseSuccess<any>>) => {
  try {
    const { value: searchValue, filterType, direction, page_size, start_cursor } = req.query;
    try {
      if (!searchValue || typeof searchValue !== 'string') {
        throw '"value" is only available in the "string" type';
      }
      if (
        !filterType ||
        (filterType !== 'page' && filterType !== 'database' && filterType !== 'notion')
      ) {
        throw 'For "filterType", please select either "page" or "database"';
      }
      if (
        typeof direction !== 'undefined' &&
        direction !== 'ascending' &&
        direction !== 'descending'
      ) {
        throw '"direction" is optional, but please select either "ascending" or "descending".';
      }
      if (typeof page_size !== 'undefined' && typeof page_size !== 'number') {
        throw '"page_size" is optional, but only accepts number type.';
      }
      if (typeof start_cursor !== 'undefined' && typeof start_cursor !== 'string') {
        throw '"start_cursor" is optional, but only accepts string type.';
      }
    } catch (e) {
      throw {
        error: e,
        status: 403
      };
    }

    const response =
      filterType === 'notion'
        ? await notion.search({
            sort: direction
              ? {
                  direction: direction,
                  timestamp: 'last_edited_time'
                }
              : undefined
          })
        : await getSearchAllByValue({
            searchValue,
            direction,
            filterType,
            page_size,
            start_cursor
          });

    res.status(200).json({ success: true, result: response });
  } catch (e) {
    throw e;
  }
});

async function getSearchAllByValue({
  direction,
  filterType,
  searchValue,
  ...args
}: {
  searchValue: string;
  direction?: 'ascending' | 'descending';
  filterType?: 'page' | 'database';
} & Parameters<typeof notion.search>[0]) {
  return await getSearchAll({ ...args, direction, filterType }).then((results) => {
    return results.filter((search) => {
      if (search?.properties?.isPublished?.checkbox === false) {
        return false;
      }
      const title = search?.properties.title?.title?.map((t) => t?.plain_text)?.join();

      if (title) {
        return new RegExp(searchValue, 'mgi').test(title);
      }
      return false;
    });
  });
}

async function getSearchAll({
  direction,
  filterType,
  ...args
}: {
  direction?: 'ascending' | 'descending';
  filterType?: 'page' | 'database';
} & Parameters<typeof notion.search>[0]) {
  const results: INotionSearch['results'] = [];
  let start_cursor: undefined | string = args.start_cursor;

  do {
    await notion
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
        start_cursor,
        page_size: args.page_size
      })
      .then(async (res) => {
        if (Array.isArray(res?.results) && res.results.length > 0) {
          results.push(...(res.results as INotionSearchObject[]));
        }
        start_cursor = res.next_cursor ? res.next_cursor : undefined;
      });
  } while (start_cursor);

  return results;
}

export default handler;
