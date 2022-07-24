import { NextApiRequest, NextApiResponse } from 'next';
import { NextHandler } from 'next-connect';
import { IErrorResponse } from 'src-server/types/response';

export class Error {
  constructor() {}

  static handleError(
    err: IErrorResponse,
    req: NextApiRequest,
    res: NextApiResponse<IErrorResponse>,
    next?: NextHandler
  ) {
    console.error(err);
    if (typeof err === 'string') {
      res.status(400).json({
        status: 400,
        error: err || 'Something broke!',
        success: false
      });
      res.end();
      return;
    }
    res.status(err.status || 400).json({
      status: err?.status || 400,
      error: err.error || 'Something broke!',
      success: err?.success || false,
      code: err?.code
    });
    res.end();
    return;
  }

  static handleNoMatch(req: NextApiRequest, res: NextApiResponse) {
    res.status(404).end('Page is not found');

    return;
  }
}
