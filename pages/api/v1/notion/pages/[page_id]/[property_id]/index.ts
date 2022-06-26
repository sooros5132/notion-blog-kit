// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
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
    const { page_id, property_id, start_cursor } = req.query;
    if (typeof page_id !== 'string') {
      throw 'type error "page_id"';
    }
    if (typeof property_id !== 'string') {
      throw 'type error "property_id"';
    }
    let page_size: number | undefined;
    if (typeof req.query.page_size !== 'undefined') {
      if (typeof req.query.page_size !== 'string') {
        throw 'type error "page_size"';
      }
      page_size = parseInt(req.query.page_size);
      if (isNaN(page_size)) {
        throw 'type error "page_size"';
      }
    }
    if (typeof start_cursor !== 'undefined') {
      if (typeof start_cursor !== 'string') {
        throw 'type error "start_cursor"';
      }
    }
    const response = await notion.pages.properties.retrieve({
      page_id,
      property_id,
      page_size,
      start_cursor
    });

    res.status(200).json({ success: true, result: response });
  } catch (e) {
    throw e;
  }
});
export default handler;
