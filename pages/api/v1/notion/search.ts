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
      const response = await notion.search({
        query: "task",
        sort: {
          direction: "ascending",
          timestamp: "last_edited_time",
        },
      });

      res.status(200).json({ success: true, result: response });
    } catch (e) {
      throw e;
    }
  }
);
export default handler;
