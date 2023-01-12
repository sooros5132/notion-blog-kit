'use client';

import React from 'react';
import { Fragment, useRef } from 'react';
import { NotionBlock, NotionBlocks } from 'src/types/notion';
import {
  NotionHasChildrenRender,
  NotionCalloutBlock,
  NotionChildDatabaseBlock,
  NotionColumnListBlock,
  NotionHeadingBlock,
  NotionImageBlock,
  NotionLinkPreviewBlock,
  NotionListItemBlock,
  NotionParagraphBlock,
  NotionQuoteBlock,
  NotionTableBlock,
  NotionTodoBlock,
  NotionToggleBlock,
  NotionVideoBlock,
  NotionParagraphText,
  NotionCodeBlock
} from '.';

export type NotionBlocksProps = {
  blocks: NotionBlock[];
  baseBlock: NotionBlocks;
};

export const BlocksRender: React.FC<NotionBlocksProps> = ({ blocks, baseBlock }) => {
  const numberOfSameTag = useRef(0);
  const childrenDepth = useRef(0);

  return (
    <>
      {blocks?.map((block, i) => {
        numberOfSameTag.current =
          blocks?.[i - 1]?.type === block.type ? numberOfSameTag.current + 1 : 0;
        childrenDepth.current = block?.has_children ? childrenDepth.current + 1 : 0;

        switch (block.type) {
          case 'bookmark': {
            return (
              <NotionHasChildrenRender
                key={`block-${block.id}-${i}`}
                block={block}
                chilrenBlockDepth={childrenDepth.current}
              >
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
            return (
              <NotionCalloutBlock
                key={`block-${block.id}-${i}`}
                block={block}
                chilrenBlockDepth={childrenDepth.current}
              />
            );
          }
          case 'child_database': {
            return <NotionChildDatabaseBlock key={`block-${block.id}-${i}`} block={block} />;
          }
          case 'code': {
            return (
              <NotionHasChildrenRender
                key={`block-${block.id}-${i}`}
                block={block}
                chilrenBlockDepth={childrenDepth.current}
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
                baseBlock={baseBlock}
              />
            );
          }
          case 'column': {
            return (
              <NotionHasChildrenRender
                key={`block-${block.id}-${i}`}
                block={block}
                chilrenBlockDepth={childrenDepth.current}
              />
            );
          }
          case 'divider': {
            return (
              <NotionHasChildrenRender
                key={`block-${block.id}-${i}`}
                block={block}
                chilrenBlockDepth={childrenDepth.current}
              >
                <hr className='border-gray-500' />
              </NotionHasChildrenRender>
            );
          }
          case 'heading_1':
          case 'heading_2':
          case 'heading_3': {
            return (
              <NotionHasChildrenRender
                key={`block-${block.id}-${i}`}
                block={block}
                chilrenBlockDepth={childrenDepth.current}
              >
                <NotionHeadingBlock block={block} />
              </NotionHasChildrenRender>
            );
          }
          case 'image': {
            return (
              <NotionHasChildrenRender
                key={`block-${block.id}-${i}`}
                block={block}
                chilrenBlockDepth={childrenDepth.current}
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
                chilrenBlockDepth={childrenDepth.current}
              >
                <NotionLinkPreviewBlock url={url} />
              </NotionHasChildrenRender>
            );
          }
          case 'bulleted_list_item':
          case 'numbered_list_item': {
            // NotionListItemBlock안에서 재귀함수식으로 ul태그 안에 li중첩. 첫번째로 나온게 아니라면 return
            if (blocks?.[i - 1]?.type === blocks?.[i]?.type) {
              return <React.Fragment key={`block-${block.id}-${i}`} />;
            }

            return (
              <NotionListItemBlock
                key={`block-${block.id}-${i}`}
                block={block}
                baseBlock={baseBlock}
                startIndexForResultBlocks={i}
                chilrenBlockDepth={childrenDepth.current}
              />
            );
          }
          case 'paragraph': {
            return (
              <NotionHasChildrenRender
                key={`block-${block.id}-${i}`}
                block={block}
                chilrenBlockDepth={childrenDepth.current}
              >
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
                <NotionHasChildrenRender
                  block={block}
                  chilrenBlockDepth={childrenDepth.current}
                ></NotionHasChildrenRender>
              </NotionQuoteBlock>
            );
          }
          case 'table': {
            return (
              <NotionTableBlock
                key={`block-${block.id}-${i}`}
                block={block}
                chilrenBlockDepth={childrenDepth.current}
              />
            );
          }
          case 'to_do': {
            return (
              <NotionHasChildrenRender
                key={`block-${block.id}-${i}`}
                block={block}
                chilrenBlockDepth={childrenDepth.current}
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
                chilrenBlockDepth={childrenDepth.current}
              />
            );
          }
          case 'video': {
            return (
              <NotionHasChildrenRender
                key={`block-${block.id}-${i}`}
                block={block}
                chilrenBlockDepth={childrenDepth.current}
              >
                <NotionVideoBlock block={block} />
              </NotionHasChildrenRender>
            );
          }
          default: {
            return <Fragment key={`block-${block.id}-${i}`}></Fragment>;
          }
        }
      })}
    </>
  );
};
