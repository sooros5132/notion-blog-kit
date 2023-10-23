import { NotionClient } from '@/server/notion/Notion';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const notion = new NotionClient();

    const result = await notion.getAllBlocksAndChildrens('c7cdc7a6652543da83f5ece86de96d6a');

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
