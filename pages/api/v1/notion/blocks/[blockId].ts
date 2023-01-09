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
  const { blockId } = req.query;
  if (typeof blockId !== 'string') {
    throw 'type error "blockId"';
  }

  const result = await notion.blocks.retrieve({
    block_id: blockId
  });

  res.status(200).json({ success: true, result });
});

export default handler;
