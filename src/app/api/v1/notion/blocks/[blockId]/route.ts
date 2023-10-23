import { type NotionBlocksRetrieve } from '@/types/notion';
import { Client, LogLevel, APIErrorCode } from '@notionhq/client';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request: Request, { params }: { params: { blockId: string } }) {
  const { blockId } = params;

  try {
    if (typeof blockId !== 'string') {
      throw 'type error "blockId"';
    }
    const notion = new Client({
      auth: process.env.NOTION_API_SECRET_KEY,
      logLevel: process.env.DEBUG_LOGS ? LogLevel.DEBUG : undefined
    });

    const result = (await notion.blocks.retrieve({
      block_id: blockId
    })) as NotionBlocksRetrieve;

    return NextResponse.json(result);
  } catch (e: any) {
    return NextResponse.json(
      {
        error: typeof e === 'object' ? e?.code || 'error' : e
      },
      {
        status: typeof e === 'object' ? e.status || 400 : 400
      }
    );
  }
}
