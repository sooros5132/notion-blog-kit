// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import nc from "next-connect";
import { notion } from "src-server/lib/notion";
import { Error } from "src-server/middleware/Error";
import { IResponseSuccess } from "src-server/types/response";

const handler = nc<NextApiRequest, NextApiResponse>({
  onError: Error.handleError,
  onNoMatch: Error.handleNoMatch,
}).get(
  async (req: NextApiRequest, res: NextApiResponse<IResponseSuccess<any>>) => {
    try {
      const databaseId = req.query.databaseId;
      if (typeof databaseId !== "string") {
        throw 'type error "databaseId"';
      }
      const response = await notion.databases.query({
        database_id: databaseId,
      });

      res.status(200).json({ success: true, result: response });
    } catch (e) {
      throw e;
    }
  }
);
export default handler;
