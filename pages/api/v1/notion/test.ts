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
      const pageId = req.query.pageId;
      if (typeof pageId !== "string") {
        throw 'type error "pageId"';
      }
      const { results } = await notion.databases.query({
        database_id: pageId,
      }); //https://www.notion.so/sooros/6d57a24bf5cf4709a27aa52d7217856c?v=dba0999856514136a4d81330ff4ded33

      res.status(200).json({ success: true, result: results });
    } catch (e) {
      throw e;
    }
  }
);
export default handler;
