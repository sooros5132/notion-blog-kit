import classNames from 'classnames';
import type React from 'react';
import { useNotionStore } from 'src/store/notion';
import type { NotionBlocksRetrieve } from 'src/types/notion';
import { NotionBlocksRender } from '.';

interface HasChildrenRenderProps {
  block: NotionBlocksRetrieve;
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
  const childrensRecord = useNotionStore().childrensRecord;

  return (
    <>
      {children}
      {block?.has_children && (
        <div className={classNames(className ? className : '', noLeftPadding ? '' : 'pl-6')}>
          <NotionBlocksRender
            blocks={childrensRecord[block.id]?.results}
            // baseBlock={childrensRecord[block.id] as unknown as NotionBlocksRetrieve}
          />
        </div>
      )}
    </>
  );
};
