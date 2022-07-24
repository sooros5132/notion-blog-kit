// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { isNotionClientError } from '@notionhq/client';
import type { NextApiRequest, NextApiResponse } from 'next';
import nc from 'next-connect';
import { notion } from 'src-server/lib/notion';
import { Error } from 'src-server/middleware/Error';
import { IResponseSuccess } from 'src-server/types/response';

const handler = nc<NextApiRequest, NextApiResponse>({
  onError: Error.handleError,
  onNoMatch: Error.handleNoMatch
}).get(async (req: NextApiRequest, res: NextApiResponse<IResponseSuccess<any>>) => {
  try {
    const { query, filterType, direction } = req.query;
    try {
      if (!query || typeof query !== 'string') {
        throw '"query" is only available in the "string" type';
      }
      if (!filterType || (filterType !== 'page' && filterType !== 'database')) {
        throw 'For "filterType", please select either "page" or "database"';
      }
      if (
        typeof direction !== 'undefined' &&
        direction !== 'ascending' &&
        direction !== 'descending'
      ) {
        throw '"direction" is optional, but please select either "ascending" or "descending".';
      }
    } catch (e) {
      throw {
        error: e,
        status: 403
      };
    }

    const response = await notion.search({
      query: query,
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

    res.status(200).json({ success: true, result: response });
  } catch (e) {
    throw e;
  }
});
export default handler;
