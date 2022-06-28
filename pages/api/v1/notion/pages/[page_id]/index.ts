// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import nc from 'next-connect';
import { notion } from 'src-server/lib/notion';
import { Error } from 'src-server/middleware/Error';
import { IResponseSuccess } from 'src-server/types/response';
import { NotionPagesRetrieve } from 'src/types/notion';

const handler = nc<NextApiRequest, NextApiResponse>({
  onError: Error.handleError,
  onNoMatch: Error.handleNoMatch
}).get(async (req: NextApiRequest, res: NextApiResponse<IResponseSuccess<NotionPagesRetrieve>>) => {
  try {
    const { page_id } = req.query;
    if (typeof page_id !== 'string') {
      throw 'type error "page_id"';
    }
    const response = (await notion.pages.retrieve({
      page_id
    })) as NotionPagesRetrieve;

    res.status(200).json({ success: true, result: response });
  } catch (e) {
    throw e;
  }
});
export default handler;
