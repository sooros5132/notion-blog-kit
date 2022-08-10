import { Fragment, useRef } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/cjs/styles/prism';
import { IGetNotion } from 'src/types/notion';
import ChildDatabase from './ChildDatabase';
import Heading from './Heading';
import NotionBlockRender from './BlockRender';
import Paragraph, { ParagraphText } from './Paragraph';
import LinkPreview from './LinkPreview';
import Toggle from './Toggle';
import Video from './Video';
import NotionSecureImage from './NotionSecureImage';
import Callout from './Callout';
import Table from './Table';

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
              <ChildDatabase
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
                <Heading block={block} />
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
                <Paragraph
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
                <LinkPreview key={`block-${block.id}`} url={url} />
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
                <LinkPreview key={`block-${block.id}`} url={url} />
                {Array.isArray(block?.bookmark?.caption) && block?.bookmark?.caption?.length > 0 && (
                  <div className='w-full'>
                    <Paragraph
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
              <Toggle
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
                <div className='flex'>
                  <div className='flex-initial pt-0.5 basis-6 text-right'>
                    {numberOfSameTag.current + 1}.
                  </div>
                  <div className='flex-auto'>
                    <Paragraph
                      blockId={block.id}
                      richText={block.numbered_list_item.rich_text}
                      color={block.numbered_list_item.color}
                    />
                  </div>
                </div>
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
                <Video block={block} />
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
                <div className='flex justify-center'>
                  <div>
                    <NotionSecureImage
                      blockId={block.id}
                      src={block.image?.file?.url ?? block.image?.external?.url ?? ''}
                    />
                    {Array.isArray(block?.image?.caption) && block?.image?.caption?.length > 0 && (
                      <div className='w-full'>
                        <Paragraph
                          blockId={block.id}
                          richText={block.image.caption}
                          color={'gray'}
                        />
                      </div>
                    )}
                  </div>
                </div>
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
                <div className='flex'>
                  <div className='flex-initial pt-1 pr-1 text-right basis-6'>
                    <input
                      type='checkbox'
                      defaultChecked={block?.to_do?.checked ?? false}
                      className='w-4 h-4 rounded-sm checkbox'
                    />
                  </div>
                  <div className='flex-auto'>
                    <Paragraph
                      blockId={block.id}
                      richText={block.to_do.rich_text}
                      color={block.to_do.color}
                      annotations={{
                        color: block?.to_do?.checked ? 'gray' : undefined,
                        strikethrough: block?.to_do?.checked ? true : undefined
                      }}
                    />
                  </div>
                </div>
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
              >
                <SyntaxHighlighter
                  language={block?.code?.language || undefined}
                  style={vscDarkPlus}
                  lineProps={{ style: { wordBreak: 'break-all', whiteSpace: 'pre-wrap' } }}
                >
                  {block?.code?.rich_text?.map((text) => text?.plain_text ?? '').join('')}
                </SyntaxHighlighter>
                {Array.isArray(block?.code?.caption) && block?.code?.caption?.length > 0 && (
                  <div className='w-full'>
                    <Paragraph blockId={block.id} richText={block.code.caption} color={'gray'} />
                  </div>
                )}
              </NotionBlockRender>
            );
          }
          case 'callout': {
            return (
              <Callout
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
                <div className='p-0.5 bg-notionColor-gray_background'>
                  <div className='bg-[rgb(46 46 46 / 8%)] py-1.5 px-3 border-l-[0.3125rem] border-solid border-base-content'>
                    <Paragraph
                      blockId={block.id}
                      richText={block.quote.rich_text}
                      color={block.quote.color}
                    />
                  </div>
                </div>
              </NotionBlockRender>
            );
          }
          case 'bulleted_list_item': {
            const dots = ['•', '◦', '▪'];
            return (
              <NotionBlockRender
                key={`block-${block.id}-${i}`}
                block={block}
                blocks={blocks}
                chilrenBlockDepth={childrenDepth.current}
              >
                <div className='flex'>
                  <div className='flex-initial text-2xl flex-center max-h-7 basis-6 shrink-0'>
                    {dots[0]}
                  </div>
                  <div className='flex-auto'>
                    <Paragraph
                      blockId={block.id}
                      richText={block.bulleted_list_item.rich_text}
                      color={block.bulleted_list_item.color}
                    />
                  </div>
                </div>
              </NotionBlockRender>
            );
          }
          case 'column_list': {
            return (
              <div
                key={`block-${block.id}-${i}`}
                className='grid gap-x-2 [&>*]:overflow-x-auto'
                style={{
                  gridTemplateColumns: `repeat(${
                    blocks['childrenBlocks'][block.id]?.results.length ?? 1
                  }, 1fr)`
                }}
              >
                {blocks['childrenBlocks'][block.id]?.results.map((block, i) => {
                  return (
                    <div className='mx-0.5' key={`block-${block.id}-${i}`}>
                      <BlocksRender
                        blocks={{
                          blocks: blocks['childrenBlocks'][block.id],
                          childrenBlocks: blocks.childrenBlocks,
                          databaseBlocks: blocks.databaseBlocks
                        }}
                      />
                    </div>
                  );
                })}
              </div>
            );
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
              <Table
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
