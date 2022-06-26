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
    const { blockId, start_cursor } = req.query;
    if (typeof blockId !== 'string') {
      throw 'type error "blockId"';
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

    const result = await notion.blocks.children.list({
      block_id: blockId,
      page_size: page_size ?? undefined, // Default: 100, Maximum: 100
      start_cursor: start_cursor
    });

    res.status(200).json({ success: true, result });
  } catch (e) {
    throw e;
  }
});

export default handler;
