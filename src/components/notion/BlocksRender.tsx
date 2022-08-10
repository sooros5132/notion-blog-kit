import { Fragment, useRef } from 'react';
import { IGetNotion } from 'src/types/notion';
import {
  NotionBlockRender,
  NotionBulletedListItemBlock,
  NotionCalloutBlock,
  NotionChildDatabaseBlock,
  NotionColumnListBlock,
  NotionHeadingBlock,
  NotionImageBlock,
  NotionLinkPreviewBlock,
  NotionNumberedListItemBlock,
  NotionParagraphBlock,
  NotionQuoteBlock,
  NotionSecureImage,
  NotionTableBlock,
  NotionTodoBlock,
  NotionToggleBlock,
  NotionVideoBlock
} from '.';
import { ParagraphText } from './Paragraph';

export interface NotionBlocksProps {
  blocks: IGetNotion;
}

const BlocksRender: React.FC<NotionBlocksProps> = ({ blocks }) => {
  const numberOfSameTag = useRef(0);
  const childrenDepth = useRef(0);

  return (
    <>
      {blocks.blocks?.results.map((block, i) => {
        numberOfSameTag.current =
          blocks.blocks.results?.[i - 1]?.type === block.type ? numberOfSameTag.current + 1 : 0;

        childrenDepth.current = block?.has_children ? childrenDepth.current + 1 : 0;

        switch (block.type) {
          case 'child_database': {
            return (
              <NotionChildDatabaseBlock
                key={`block-${block.id}-${i}`}
                block={block}
                databases={blocks.databaseBlocks}
              />
            );
          }
          case 'heading_1':
          case 'heading_2':
          case 'heading_3': {
            return (
              <NotionBlockRender
                key={`block-${block.id}-${i}`}
                block={block}
                blocks={blocks}
                chilrenBlockDepth={childrenDepth.current}
              >
                <NotionHeadingBlock block={block} />
              </NotionBlockRender>
            );
          }
          case 'paragraph': {
            return (
              <NotionBlockRender
                key={`block-${block.id}-${i}`}
                block={block}
                blocks={blocks}
                chilrenBlockDepth={childrenDepth.current}
              >
                <NotionParagraphBlock
                  blockId={block.id}
                  richText={block.paragraph.rich_text}
                  color={block.paragraph.color}
                />
              </NotionBlockRender>
            );
          }
          case 'link_preview': {
            const url = block.link_preview.url;
            if (!url) {
              return <ParagraphText></ParagraphText>;
            }

            return (
              <NotionBlockRender
                key={`block-${block.id}-${i}`}
                block={block}
                blocks={blocks}
                chilrenBlockDepth={childrenDepth.current}
              >
                <NotionLinkPreviewBlock key={`block-${block.id}`} url={url} />
              </NotionBlockRender>
            );
          }
          case 'bookmark': {
            const url = block.bookmark.url;
            if (!url) {
              return <ParagraphText></ParagraphText>;
            }

            return (
              <NotionBlockRender
                key={`block-${block.id}-${i}`}
                block={block}
                blocks={blocks}
                chilrenBlockDepth={childrenDepth.current}
              >
                <NotionLinkPreviewBlock key={`block-${block.id}`} url={url} />
                {Array.isArray(block?.bookmark?.caption) && block?.bookmark?.caption?.length > 0 && (
                  <div className='w-full'>
                    <NotionParagraphBlock
                      blockId={block.id}
                      richText={block.bookmark.caption}
                      color={'gray'}
                    />
                  </div>
                )}
              </NotionBlockRender>
            );
          }
          case 'divider': {
            return (
              <NotionBlockRender
                key={`block-${block.id}-${i}`}
                block={block}
                blocks={blocks}
                chilrenBlockDepth={childrenDepth.current}
              >
                <hr className='border-gray-500' />
              </NotionBlockRender>
            );
          }
          case 'toggle': {
            // 토글은 안에서 BlockRender시킴.
            return (
              <NotionToggleBlock
                key={`block-${block.id}-${i}`}
                blocks={blocks}
                block={block}
                chilrenBlockDepth={childrenDepth.current}
              />
            );
          }
          case 'numbered_list_item': {
            return (
              <NotionBlockRender
                key={`block-${block.id}-${i}`}
                block={block}
                blocks={blocks}
                chilrenBlockDepth={childrenDepth.current}
              >
                <NotionNumberedListItemBlock
                  block={block}
                  numberOfSameTag={numberOfSameTag.current}
                />
              </NotionBlockRender>
            );
          }
          case 'video': {
            return (
              <NotionBlockRender
                key={`block-${block.id}-${i}`}
                block={block}
                blocks={blocks}
                chilrenBlockDepth={childrenDepth.current}
              >
                <NotionVideoBlock block={block} />
              </NotionBlockRender>
            );
          }
          case 'image': {
            return (
              <NotionBlockRender
                key={`block-${block.id}-${i}`}
                block={block}
                blocks={blocks}
                chilrenBlockDepth={childrenDepth.current}
              >
                <NotionImageBlock block={block} />
              </NotionBlockRender>
            );
          }
          case 'to_do': {
            return (
              <NotionBlockRender
                key={`block-${block.id}-${i}`}
                block={block}
                blocks={blocks}
                chilrenBlockDepth={childrenDepth.current}
              >
                <NotionTodoBlock block={block} />
              </NotionBlockRender>
            );
          }
          case 'code': {
            return (
              <NotionBlockRender
                key={`block-${block.id}-${i}`}
                block={block}
                blocks={blocks}
                chilrenBlockDepth={childrenDepth.current}
              ></NotionBlockRender>
            );
          }
          case 'callout': {
            return (
              <NotionCalloutBlock
                key={`block-${block.id}-${i}`}
                block={block}
                blocks={blocks}
                chilrenBlockDepth={childrenDepth.current}
              />
            );
          }
          case 'quote': {
            return (
              <NotionBlockRender
                key={`block-${block.id}-${i}`}
                block={block}
                blocks={blocks}
                chilrenBlockDepth={childrenDepth.current}
              >
                <NotionQuoteBlock block={block} />
              </NotionBlockRender>
            );
          }
          case 'bulleted_list_item': {
            return (
              <NotionBlockRender
                key={`block-${block.id}-${i}`}
                block={block}
                blocks={blocks}
                chilrenBlockDepth={childrenDepth.current}
              >
                <NotionBulletedListItemBlock block={block} />
              </NotionBlockRender>
            );
          }
          case 'column_list': {
            return <NotionColumnListBlock blocks={blocks} block={block} />;
          }
          case 'column': {
            return (
              <NotionBlockRender
                key={`block-${block.id}`}
                block={block}
                blocks={blocks}
                chilrenBlockDepth={childrenDepth.current}
              />
            );
          }
          case 'table': {
            return (
              <NotionTableBlock
                key={`block-${block.id}-${i}`}
                block={block}
                blocks={blocks}
                chilrenBlockDepth={childrenDepth.current}
              />
            );
          }
        }

        return <Fragment key={`block-${block.id}-${i}`}></Fragment>;
      })}
    </>
  );
};

export default BlocksRender;
