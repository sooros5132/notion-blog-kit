import type React from 'react';
import type { NotionBlocksRetrieve } from 'src/types/notion';
import { NotionHasChildrenRender } from '.';

export interface SyncedProps {
  block: NotionBlocksRetrieve;
}

export const Synced: React.FC<SyncedProps> = ({ block }) => {
  return <NotionHasChildrenRender block={block} noLeftPadding />;
};
