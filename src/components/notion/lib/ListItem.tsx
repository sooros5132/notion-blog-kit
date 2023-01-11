import classNames from 'classnames';
import type React from 'react';
import type { IGetNotion, NotionBlock } from 'src/types/notion';
import { NotionBlockRender, NotionParagraphBlock } from '.';

interface NumberedListItemProps extends IGetNotion {
  block: NotionBlock;
  startIndexForResultBlocks: number;
  chilrenBlockDepth: number;
  children?: React.ReactNode;
}

const NumberedListItem: React.FC<NumberedListItemProps> = ({
  block,
  blocks,
  childrenBlocks,
  databaseBlocks,
  chilrenBlockDepth: chilrenBlockDepthProps,
  startIndexForResultBlocks
}) => {
  const LIST_TYPE = block.type as 'bulleted_list_item' | 'numbered_list_item';
  const chilrenBlockDepth = block.has_children
    ? chilrenBlockDepthProps + 1
    : chilrenBlockDepthProps;
  const prevIndexForResultBlocks = startIndexForResultBlocks - 1;
  const nextIndexForResultBlocks = startIndexForResultBlocks + 1;

  if (blocks?.results?.[prevIndexForResultBlocks]?.type !== block.type) {
    return (
      <ul
        className={classNames(
          //? 0번째 depth는 백의 자리부터 공간이 부족해 보임. 추가 공간 주기
          chilrenBlockDepth ? 'pl-8' : 'pl-6',
          LIST_TYPE === 'numbered_list_item' ? 'list-decimal' : 'list-disc'
        )}
      >
        <li>
          <NotionBlockRender
            block={blocks?.results?.[startIndexForResultBlocks]}
            blocks={blocks}
            databaseBlocks={databaseBlocks}
            childrenBlocks={childrenBlocks}
            chilrenBlockDepth={chilrenBlockDepth}
            parentBlockType={block.type}
          >
            <NotionParagraphBlock
              blockId={block.id}
              richText={block[LIST_TYPE]?.rich_text}
              color={block[LIST_TYPE]?.color}
            />
          </NotionBlockRender>
        </li>
        {block.type === blocks?.results?.[nextIndexForResultBlocks]?.type && (
          <NumberedListItem
            block={blocks?.results?.[nextIndexForResultBlocks]}
            blocks={blocks}
            databaseBlocks={databaseBlocks}
            childrenBlocks={childrenBlocks}
            startIndexForResultBlocks={nextIndexForResultBlocks}
            chilrenBlockDepth={chilrenBlockDepth}
          />
        )}
      </ul>
    );
  } else {
    return (
      <>
        <li>
          <NotionBlockRender
            block={blocks?.results?.[startIndexForResultBlocks]}
            blocks={blocks}
            databaseBlocks={databaseBlocks}
            childrenBlocks={childrenBlocks}
            chilrenBlockDepth={chilrenBlockDepth}
            parentBlockType={block.type}
          >
            <NotionParagraphBlock
              blockId={block.id}
              richText={block[LIST_TYPE]?.rich_text}
              color={block[LIST_TYPE]?.color}
            />
          </NotionBlockRender>
        </li>
        {block?.type === blocks?.results?.[nextIndexForResultBlocks]?.type && (
          <NumberedListItem
            block={blocks?.results?.[nextIndexForResultBlocks]}
            blocks={blocks}
            databaseBlocks={databaseBlocks}
            childrenBlocks={childrenBlocks}
            startIndexForResultBlocks={nextIndexForResultBlocks}
            chilrenBlockDepth={chilrenBlockDepth}
          />
        )}
      </>
    );
  }
};

export default NumberedListItem;
