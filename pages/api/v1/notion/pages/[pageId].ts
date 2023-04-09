// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import nc from 'next-connect';
import { Error } from 'lib/Error';
import { Client, LogLevel } from '@notionhq/client';
import { NotionPagesRetrieve } from 'src/types/notion';

const handler = nc<NextApiRequest, NextApiResponse>({
  onError: Error.handleError,
  onNoMatch: Error.handleNoMatch
}).get(async (req: NextApiRequest, res: NextApiResponse<NotionPagesRetrieve>) => {
  const { pageId } = req.query;
  if (typeof pageId !== 'string') {
    throw 'type error "pageId"';
  }
  const notion = new Client({
    auth: process.env.NOTION_API_SECRET_KEY,
    logLevel: process.env.DEBUG_LOGS ? LogLevel.DEBUG : undefined
  });

  const result = (await notion.pages.retrieve({
    page_id: pageId
  })) as NotionPagesRetrieve;

  res.status(200).json(result);
});

export default handler;
