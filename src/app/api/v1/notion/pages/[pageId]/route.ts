import { type NotionPagesRetrieve } from '@/types/notion';
import { Client, LogLevel } from '@notionhq/client';
import { NextResponse } from 'next/server';

export async function GET(request: Request, { params }: { params: { pageId: string } }) {
  const { pageId } = params;

  try {
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

    return NextResponse.json(result);
  } catch (e: any) {
    return NextResponse.json(
      {
        error: typeof e === 'object' ? e?.code || 'error' : e
      },
      {
        status: typeof e === 'object' ? e?.status || 400 : 400
      }
    );
  }
}
