import { POST_LIMIT } from '@/lib/constants';
import { NotionClient } from '@/server/notion/Notion';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request: Request, { params }: { params: { databaseId: string } }) {
  const { databaseId } = params;
  const urlObject = new URL(request.url);
  const searchParams = urlObject.searchParams;
  const nextCursor = searchParams.get('nextCursor')?.trim?.();
  const filterType = searchParams.get('filterType')?.trim?.();
  const filterValue = searchParams.get('filterValue')?.trim?.();
  const havePublishedAt = searchParams.get('havePublishedAt')?.trim?.() === 'true';
  const size = Number(searchParams.get('size')?.trim?.()) || 20;

  try {
    if (typeof databaseId !== 'string') {
      throw 'type error "databaseId"';
    }
    const isFilter = filterType && filterValue;

    if ((filterType && filterValue) || (!filterType && !filterValue)) {
      const notionClient = new NotionClient();
      const result = await notionClient.getAllPublishedPageInDatabase({
        databaseId: databaseId,
        nextCursor: nextCursor ? nextCursor : undefined,
        totalPageSize: size || POST_LIMIT,
        filter: isFilter
          ? {
              [filterType]: filterValue
            }
          : undefined,
        havePublishedAt
      });

      return NextResponse.json(result);
    }
    throw 'not found';
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
