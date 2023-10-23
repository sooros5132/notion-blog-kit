import { NotionClient } from '@/server/notion/Notion';
import { type NotionDatabasesRetrieve } from '@/types/notion';
import { Client, LogLevel } from '@notionhq/client';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request: Request, { params }: { params: { databaseId: string } }) {
  const { databaseId } = params;

  try {
    if (typeof databaseId !== 'string') {
      throw 'type error "databaseId"';
    }

    const notion = new Client({
      auth: process.env.NOTION_API_SECRET_KEY,
      logLevel: process.env.DEBUG_LOGS ? LogLevel.DEBUG : undefined
    });

    const result = (await notion.databases.retrieve({
      database_id: databaseId
    })) as NotionDatabasesRetrieve;

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
