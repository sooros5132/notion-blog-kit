// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { ListBlockChildrenResponse } from '@notionhq/client/build/src/api-endpoints';
import type { NextApiRequest, NextApiResponse } from 'next';
import nc from 'next-connect';
import { notion } from 'src-server/lib/notion';
import { Error } from 'src-server/middleware/Error';
import { IResponseSuccess } from 'src-server/types/response';
import { IGetNotion, NotionDatabasesQuery, NotionBlocksChildrenList } from 'src/types/notion';

type IGetResponse = IResponseSuccess<IGetNotion>;

const handler = nc<NextApiRequest, NextApiResponse>({
  onError: Error.handleError,
  onNoMatch: Error.handleNoMatch
}).get(async (req: NextApiRequest, res: NextApiResponse<IGetResponse>) => {
  try {
    const { blockId, start_cursor } = req.query;
    if (typeof blockId !== 'string') {
      throw 'type error "blockId"';
    }
    let page_size: number | undefined;
    if (typeof req.query.page_size !== 'undefined') {
      if (typeof req.query.page_size !== 'string') {
        throw 'type error "page_size"';
      }
      page_size = parseInt(req.query.page_size);
      if (isNaN(page_size)) {
        throw 'type error "page_size"';
      }
    }
    if (typeof start_cursor !== 'undefined') {
      if (typeof start_cursor !== 'string') {
        throw 'type error "start_cursor"';
      }
    }

    const result = await fetchBlocks({ block_id: blockId, page_size, start_cursor });

    res.status(200).json({
      success: true,
      result
    });
  } catch (e) {
    throw e;
  }
});

async function fetchBlocks({
  block_id,
  page_size,
  start_cursor
}: Parameters<typeof notion.blocks.children.list>[0]) {
  const blocks = (await notion.blocks.children.list({
    block_id,
    page_size: page_size ?? undefined, // Default: 100, Maximum: 100
    start_cursor: start_cursor
  })) as NotionBlocksChildrenList;
  const databaseBlocks: Record<string, NotionDatabasesQuery> = {};
  let childrenBlocks: Record<string, NotionBlocksChildrenList> = {};
  const moreFetch: Array<any> = [];

  if (blocks.has_more && blocks.next_cursor) {
    // 재귀함수
    await fetchBlocks({ block_id, start_cursor: blocks.next_cursor! }).then((res) => {
      blocks.results.push(...res.blocks.results);
    });
    blocks.has_more = false;
    blocks.next_cursor = null;
  }
  for (const block of blocks.results) {
    if (block.has_children) {
      // 재귀함수
      moreFetch.push(
        hasChildrenFetch({ block_id: block.id }).then((result) => {
          childrenBlocks = { ...childrenBlocks, ...result };
        })
      );
      continue;
    }
    switch (block.type) {
      case 'child_database': {
        moreFetch.push(
          notion.databases
            .query({
              database_id: block.id
            })
            .then((database) => {
              databaseBlocks[block.id] = database as NotionDatabasesQuery;
            })
        );
        continue;
      }
    }
  }
  await Promise.all(moreFetch);

  return {
    blocks,
    databaseBlocks,
    childrenBlocks
  };
}

async function hasChildrenFetch({ ...args }: Parameters<typeof notion.blocks.children.list>[0]) {
  let result: Record<string, NotionBlocksChildrenList> = {};

  await notion.blocks.children.list(args).then(async (res) => {
    for (const block of res.results) {
      const { has_children } = block as NotionBlocksChildrenList['results'][number];
      if (has_children) {
        await hasChildrenFetch({ block_id: block.id }).then((children) => {
          result = { ...result, ...children };
        });
      }
    }
    result[args.block_id] = res as NotionBlocksChildrenList;
  });

  return result;
}

export default handler;
