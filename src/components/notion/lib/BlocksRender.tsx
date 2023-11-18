'use client';

import { Fragment } from 'react';
import type { ChildrensRecord, DatabasesRecord, NotionBlocksRetrieve } from '@/types/notion';
import {
  NotionHasChildrenRender,
  NotionCalloutBlock,
  NotionChildDatabaseBlock,
  NotionColumnListBlock,
  NotionHeadingBlock,
  NotionImageBlock,
  NotionLinkPreviewBlock,
  NotionListBlock,
  NotionParagraphBlock,
  NotionQuoteBlock,
  NotionTableBlock,
  NotionTodoBlock,
  NotionToggleBlock,
  NotionVideoBlock,
  NotionParagraphText,
  NotionCodeBlock,
  NotionSyncedBlock,
  NotionEquationBlock,
  NotionFileBlock,
  NotionTableOfContents,
  NotionEmbedBlock
} from '.';

export type NotionBlocksProps = {
  blocks: Array<NotionBlocksRetrieve>;
  childrensRecord: ChildrensRecord;
  databasesRecord: DatabasesRecord;
};

export function BlocksRender({ blocks, childrensRecord, databasesRecord }: NotionBlocksProps) {
  // useRef를 쓰면 children 렌더링 할 때 다음 block이 리스트 타입이여도
  // children에 다른 타입의 블록이 있다면 렌더링 중 초기화 시켜서 일반 변수로 사용.
  let repeatedSameTagName = 0;

  return (
    <>
      {blocks?.map((block, i) => {
        const prevBlockIsListItem = blocks?.[i - 1]?.type === blocks?.[i]?.type;
        if (prevBlockIsListItem) {
          repeatedSameTagName++;
        } else {
          repeatedSameTagName = 0;
        }
        switch (block.type) {
          case 'bookmark': {
            return (
              <NotionHasChildrenRender
                key={`block-${block.id}-${i}`}
                block={block}
                childrensRecord={childrensRecord}
                databasesRecord={databasesRecord}
              >
                <NotionLinkPreviewBlock linkPreview={block.bookmark} />
                {Array.isArray(block?.bookmark?.caption) &&
                  block?.bookmark?.caption?.length > 0 && (
                    <div className='w-full'>
                      <NotionParagraphBlock
                        blockId={block.id}
                        richText={block.bookmark.caption}
                        color={'gray'}
                      />
                    </div>
                  )}
              </NotionHasChildrenRender>
            );
          }
          case 'callout': {
            return (
              <NotionCalloutBlock
                key={`block-${block.id}-${i}`}
                block={block}
                childrensRecord={childrensRecord}
                databasesRecord={databasesRecord}
              />
            );
          }
          case 'child_database': {
            return (
              <NotionChildDatabaseBlock
                key={`block-${block.id}-${i}`}
                block={block}
                databasesRecord={databasesRecord}
              />
            );
          }
          case 'code': {
            return (
              <NotionHasChildrenRender
                key={`block-${block.id}-${i}`}
                block={block}
                childrensRecord={childrensRecord}
                databasesRecord={databasesRecord}
              >
                <NotionCodeBlock block={block} />
              </NotionHasChildrenRender>
            );
          }
          case 'column_list': {
            return (
              <NotionColumnListBlock
                key={`block-${block.id}-${i}`}
                block={block}
                childrensRecord={childrensRecord}
                databasesRecord={databasesRecord}
              />
            );
          }
          case 'column': {
            return (
              <NotionHasChildrenRender
                key={`block-${block.id}-${i}`}
                block={block}
                childrensRecord={childrensRecord}
                databasesRecord={databasesRecord}
              />
            );
          }
          case 'divider': {
            return (
              <NotionHasChildrenRender
                key={`block-${block.id}-${i}`}
                block={block}
                childrensRecord={childrensRecord}
                databasesRecord={databasesRecord}
              >
                <hr className='my-2 border-foreground/40' />
              </NotionHasChildrenRender>
            );
          }
          case 'embed': {
            return (
              <NotionHasChildrenRender
                key={`block-${block.id}-${i}`}
                block={block}
                childrensRecord={childrensRecord}
                databasesRecord={databasesRecord}
              >
                <NotionEmbedBlock block={block} />
              </NotionHasChildrenRender>
            );
          }
          case 'equation': {
            return (
              <NotionHasChildrenRender
                key={`block-${block.id}-${i}`}
                block={block}
                childrensRecord={childrensRecord}
                databasesRecord={databasesRecord}
              >
                <NotionEquationBlock block={block} />
              </NotionHasChildrenRender>
            );
          }
          case 'file': {
            return (
              <NotionHasChildrenRender
                key={`block-${block.id}-${i}`}
                block={block}
                childrensRecord={childrensRecord}
                databasesRecord={databasesRecord}
              >
                <NotionFileBlock block={block} />
              </NotionHasChildrenRender>
            );
          }
          case 'heading_1':
          case 'heading_2':
          case 'heading_3': {
            return (
              <NotionHeadingBlock
                key={`block-${block.id}-${i}`}
                block={block}
                childrensRecord={childrensRecord}
                databasesRecord={databasesRecord}
              />
            );
          }
          case 'image': {
            return (
              <NotionHasChildrenRender
                key={`block-${block.id}-${i}`}
                block={block}
                childrensRecord={childrensRecord}
                databasesRecord={databasesRecord}
              >
                <NotionImageBlock block={block} />
              </NotionHasChildrenRender>
            );
          }
          case 'link_preview': {
            const url = block.link_preview.url;
            if (!url) {
              return <NotionParagraphText key={`block-${block.id}-${i}`}></NotionParagraphText>;
            }

            return (
              <NotionHasChildrenRender
                key={`block-${block.id}-${i}`}
                block={block}
                childrensRecord={childrensRecord}
                databasesRecord={databasesRecord}
              >
                <NotionLinkPreviewBlock linkPreview={block.link_preview} />
              </NotionHasChildrenRender>
            );
          }
          case 'bulleted_list_item':
          case 'numbered_list_item': {
            return (
              <NotionListBlock
                key={`block-${block.id}-${i}`}
                block={block}
                startValue={repeatedSameTagName + 1}
                childrensRecord={childrensRecord}
                databasesRecord={databasesRecord}
              />
            );
          }
          case 'paragraph': {
            return (
              <NotionHasChildrenRender
                key={`block-${block.id}-${i}`}
                block={block}
                childrensRecord={childrensRecord}
                databasesRecord={databasesRecord}
              >
                <div className='my-1.5 min-h-[1.5rem]'>
                  <NotionParagraphBlock
                    blockId={block.id}
                    richText={block.paragraph.rich_text}
                    color={block.paragraph.color}
                  />
                </div>
              </NotionHasChildrenRender>
            );
          }
          case 'quote': {
            return (
              <NotionQuoteBlock
                key={`block-${block.id}-${i}`}
                block={block}
                childrensRecord={childrensRecord}
                databasesRecord={databasesRecord}
              />
            );
          }
          case 'table': {
            return (
              <NotionTableBlock
                key={`block-${block.id}-${i}`}
                block={block}
                childrensRecord={childrensRecord}
              />
            );
          }
          case 'table_of_contents': {
            return (
              <NotionTableOfContents key={`block-${block.id}-${i}`} blocks={blocks} block={block} />
            );
          }
          case 'to_do': {
            return (
              <NotionHasChildrenRender
                key={`block-${block.id}-${i}`}
                block={block}
                childrensRecord={childrensRecord}
                databasesRecord={databasesRecord}
              >
                <NotionTodoBlock block={block} />
              </NotionHasChildrenRender>
            );
          }
          case 'toggle': {
            // 토글은 안에서 BlockRender시킴.
            return (
              <NotionToggleBlock
                key={`block-${block.id}-${i}`}
                block={block}
                childrensRecord={childrensRecord}
                databasesRecord={databasesRecord}
              />
            );
          }
          case 'video': {
            return (
              <NotionHasChildrenRender
                key={`block-${block.id}-${i}`}
                block={block}
                childrensRecord={childrensRecord}
                databasesRecord={databasesRecord}
              >
                <NotionVideoBlock block={block} />
              </NotionHasChildrenRender>
            );
          }
          case 'synced_block': {
            return (
              <NotionSyncedBlock
                key={`block-${block.id}`}
                block={block}
                childrensRecord={childrensRecord}
                databasesRecord={databasesRecord}
              />
            );
          }
          default: {
            return <Fragment key={`block-${block.id}-${i}`}></Fragment>;
          }
        }
      })}
    </>
  );
}
