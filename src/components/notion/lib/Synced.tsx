import type React from 'react';
import type { NotionBlock } from 'src/types/notion';
import { NotionHasChildrenRender } from '.';

export interface SyncedProps {
  block: NotionBlock;
}

export const Synced: React.FC<SyncedProps> = ({ block }) => {
  return <NotionHasChildrenRender block={block} noLeftPadding />;
};
