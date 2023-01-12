// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import nc from 'next-connect';
import { Error } from 'lib/Error';
import { IResponseSuccess } from 'lib/types/response';
import { Client, LogLevel } from '@notionhq/client';

const handler = nc<NextApiRequest, NextApiResponse>({
  onError: Error.handleError,
  onNoMatch: Error.handleNoMatch
}).get(async (req: NextApiRequest, res: NextApiResponse<IResponseSuccess<any>>) => {
  const { blockId } = req.query;
  if (typeof blockId !== 'string') {
    throw 'type error "blockId"';
  }
  const notion = new Client({
    auth: process.env.NOTION_API_SECRET_KEY,
    logLevel: process.env.NODE_ENV === 'development' ? LogLevel.DEBUG : undefined
  });

  const result = await notion.blocks.retrieve({
    block_id: blockId
  });

  res.status(200).json({ success: true, result });
});

export default handler;
