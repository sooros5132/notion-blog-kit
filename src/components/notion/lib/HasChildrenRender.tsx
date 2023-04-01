import classNames from 'classnames';
import type React from 'react';
import { useNotionStore } from 'src/store/notion';
import type { NotionBlock, BlockType } from 'src/types/notion';
import { NotionBlocksRender } from '.';

interface HasChildrenRenderProps {
  block: NotionBlock;
  children?: React.ReactNode;
  noLeftPadding?: boolean;
  className?: string;
}

export const HasChildrenRender: React.FC<HasChildrenRenderProps> = ({
  block,
  children,
  noLeftPadding,
  className
}) => {
  const childrenRecord = useNotionStore.getState().childrenRecord;

  return (
    <>
      {children}
      {block?.has_children && (
        <div className={classNames(className ? className : '', noLeftPadding ? '' : 'pl-6')}>
          <NotionBlocksRender
            blocks={childrenRecord[block.id]?.results}
            baseBlock={childrenRecord[block.id]}
          />
        </div>
      )}
    </>
  );
};
