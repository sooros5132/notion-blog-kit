'use client';

import React from 'react';
import { Fragment } from 'react';
import { NotionBlock, NotionBlocks } from 'src/types/notion';
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
  NotionSyncedBlock
} from '.';

export type NotionBlocksProps = {
  blocks: NotionBlock[];
  baseBlock: NotionBlocks;
  depthOfNestedList?: number;
};

export const BlocksRender: React.FC<NotionBlocksProps> = ({
  blocks,
  depthOfNestedList,
  baseBlock
}) => {
  // useRef를 쓰면 children 렌더링 할 때 다음 block이 리스트 타입이여도
  // children에 다른 타입의 블록이 있다면 렌더링 중 초기화 시켜서 일반 변수로 사용.
  let newDepthOfNestedList = depthOfNestedList;

  return (
    <>
      {blocks?.map((block, i) => {
        switch (block.type) {
          case 'bookmark': {
            return (
              <NotionHasChildrenRender key={`block-${block.id}-${i}`} block={block}>
                <NotionLinkPreviewBlock url={block.bookmark.url} />
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
            return <NotionCalloutBlock key={`block-${block.id}-${i}`} block={block} />;
          }
          case 'child_database': {
            return <NotionChildDatabaseBlock key={`block-${block.id}-${i}`} block={block} />;
          }
          case 'code': {
            return (
              <NotionHasChildrenRender key={`block-${block.id}-${i}`} block={block}>
                <NotionCodeBlock block={block} />
              </NotionHasChildrenRender>
            );
          }
          case 'column_list': {
            return (
              <NotionColumnListBlock
                key={`block-${block.id}-${i}`}
                block={block}
                baseBlock={baseBlock}
              />
            );
          }
          case 'column': {
            return <NotionHasChildrenRender key={`block-${block.id}-${i}`} block={block} />;
          }
          case 'divider': {
            return (
              <NotionHasChildrenRender key={`block-${block.id}-${i}`} block={block}>
                <hr className='border-gray-500' />
              </NotionHasChildrenRender>
            );
          }
          case 'heading_1':
          case 'heading_2':
          case 'heading_3': {
            return (
              <NotionHasChildrenRender key={`block-${block.id}-${i}`} block={block}>
                <NotionHeadingBlock block={block} />
              </NotionHasChildrenRender>
            );
          }
          case 'image': {
            return (
              <NotionHasChildrenRender key={`block-${block.id}-${i}`} block={block}>
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
              <NotionHasChildrenRender key={`block-${block.id}-${i}`} block={block}>
                <NotionLinkPreviewBlock url={url} />
              </NotionHasChildrenRender>
            );
          }
          case 'bulleted_list_item':
          case 'numbered_list_item': {
            const prevBlockIsListItem = blocks?.[i - 1]?.type === blocks?.[i]?.type;
            const nextBlockIsListItem = blocks?.[i]?.type === blocks?.[i + 1]?.type;
            if (
              // 첫번째 블록이 아니고, 이전 블록은 있지만 리스트가 아니거나 다음 블록은 있지만 리스트가 아니면 초기화
              i !== 0 &&
              ((Boolean(blocks?.[i - 1]) && !prevBlockIsListItem) ||
                (Boolean(blocks?.[i + 1]) && !nextBlockIsListItem))
            ) {
              newDepthOfNestedList = 0;
            }

            // NotionListBlock안에서 재귀함수식으로 ul태그 안에 li중첩 시킨다.
            // 제일 처음 나온 list item이 렌더링 하는 방식
            if (prevBlockIsListItem) {
              return <React.Fragment key={`block-${block.id}-${i}`} />;
            }

            return (
              <NotionListBlock
                key={`block-${block.id}-${i}`}
                block={block}
                baseBlock={baseBlock}
                startIndexForResultBlocks={i}
                depthOfNestedList={newDepthOfNestedList}
              />
            );
          }
          case 'paragraph': {
            return (
              <NotionHasChildrenRender key={`block-${block.id}-${i}`} block={block}>
                <NotionParagraphBlock
                  blockId={block.id}
                  richText={block.paragraph.rich_text}
                  color={block.paragraph.color}
                />
              </NotionHasChildrenRender>
            );
          }
          case 'quote': {
            return (
              <NotionQuoteBlock key={`block-${block.id}-${i}`} block={block}>
                <NotionHasChildrenRender block={block}></NotionHasChildrenRender>
              </NotionQuoteBlock>
            );
          }
          case 'table': {
            return <NotionTableBlock key={`block-${block.id}-${i}`} block={block} />;
          }
          case 'to_do': {
            return (
              <NotionHasChildrenRender key={`block-${block.id}-${i}`} block={block}>
                <NotionTodoBlock block={block} />
              </NotionHasChildrenRender>
            );
          }
          case 'toggle': {
            // 토글은 안에서 BlockRender시킴.
            return <NotionToggleBlock key={`block-${block.id}-${i}`} block={block} />;
          }
          case 'video': {
            return (
              <NotionHasChildrenRender key={`block-${block.id}-${i}`} block={block}>
                <NotionVideoBlock block={block} />
              </NotionHasChildrenRender>
            );
          }
          case 'synced_block': {
            return <NotionSyncedBlock key={`block-${block.id}`} block={block} />;
          }
          default: {
            return <Fragment key={`block-${block.id}-${i}`}></Fragment>;
          }
        }
      })}
    </>
  );
};
