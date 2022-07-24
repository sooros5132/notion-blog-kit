// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import nc from 'next-connect';
import { notion } from 'src-server/lib/notion';
import { Error } from 'src-server/middleware/Error';
import { IResponseSuccess } from 'src-server/types/response';
import { IGetNotion } from 'src/types/notion';

const handler = nc<NextApiRequest, NextApiResponse>({
  onError: Error.handleError,
  onNoMatch: Error.handleNoMatch
}).get(async (req: NextApiRequest, res: NextApiResponse<IResponseSuccess<IGetNotion>>) => {
  try {
    const databaseId = req.query.databaseId;
    if (typeof databaseId !== 'string') {
      throw 'type error "databaseId"';
    }
    const response = await notion.databases.query({
      database_id: databaseId
    });

    res.status(200).json({
      success: true,
      result: {
        blocks: response
      } as unknown as IGetNotion
    });
  } catch (e) {
    throw e;
  }
});
export default handler;
