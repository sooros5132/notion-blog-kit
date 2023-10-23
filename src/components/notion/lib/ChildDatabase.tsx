'use client';

import type { DatabasesRecord, NotionBlocksRetrieve, PropertyType } from '@/types/notion';
import { sortBy } from 'lodash';
import { usePathname } from 'next/navigation';
import { useState, useMemo } from 'react';
import { BsArrowUpShort, BsArrowDownShort } from 'react-icons/bs';
import { URL_PAGE_TITLE_MAX_LENGTH } from '@/types/notion';
import { CopyHeadingLink, HeadingContainer, HeadingInner } from './Heading';
import { ChildDatabaseItem } from './ChildDatabaseItem';
import Link from 'next/link';
import { richTextToPlainText } from './utils';

export interface ChildDatabaseProps {
  block: NotionBlocksRetrieve;
  databasesRecord: DatabasesRecord;
}

type SortKeys = 'title' | 'created_time' | 'last_edited_time';

const defaultSortRecord = {
  title: 'title',
  created_time: 'created time',
  last_edited_time: 'edited time'
} as const;

const orderKeys = Object.keys(defaultSortRecord) as Array<keyof typeof defaultSortRecord>;

export const ChildDatabase: React.FC<ChildDatabaseProps> = ({ block, databasesRecord }) => {
  const database = databasesRecord?.[block.id];

  const pathname = usePathname();

  const [blocks, setBlocks] = useState(
    sortBy(
      database?.results?.[0]?.properties?.title?.type === 'title'
        ? database?.results.map((databaseBlock) => {
            const title =
              richTextToPlainText(databaseBlock?.properties?.title?.title) || 'Untitled';
            const newBlock = {
              ...databaseBlock,
              title
            };
            return newBlock;
          }) || []
        : database?.results || [],
      'created_time'
    ).reverse()
  );
  const [sortKey, setSortKey] = useState<SortKeys>('created_time');
  const [isOrderAsc, setIsOrderAsc] = useState(true);

  const handleCloseSortMenu = (newSortKey: SortKeys) => () => {
    switch (newSortKey) {
      // 시간은 반대 나머지는 정상
      case 'last_edited_time':
      case 'created_time': {
        if (newSortKey === sortKey) {
          const newIsOrderAsc = !isOrderAsc;
          setBlocks((prevBlocks) =>
            newIsOrderAsc
              ? sortBy(prevBlocks, newSortKey).reverse()
              : sortBy(prevBlocks, newSortKey)
          );
          setSortKey(newSortKey);
          setIsOrderAsc(newIsOrderAsc);
        } else {
          setBlocks((prevBlocks) => sortBy(prevBlocks, newSortKey).reverse());
          setSortKey(newSortKey);
          setIsOrderAsc(true);
        }
        break;
      }
      case 'title': {
        if (newSortKey === sortKey) {
          const newIsOrderAsc = !isOrderAsc;
          setBlocks((prevBlocks) =>
            newIsOrderAsc
              ? sortBy(prevBlocks, newSortKey)
              : sortBy(prevBlocks, newSortKey).reverse()
          );
          setSortKey(newSortKey);
          setIsOrderAsc(newIsOrderAsc);
        } else {
          setBlocks((prevBlocks) => sortBy(prevBlocks, newSortKey));
          setSortKey(newSortKey);
          setIsOrderAsc(true);
        }
        break;
      }
    }
  };
  const type = block.type as 'child_database';
  const hash = `${block?.child_database?.title.trim().slice(0, URL_PAGE_TITLE_MAX_LENGTH) || ''}`;
  const href = useMemo(() => `${pathname?.replace(/#.*/, '')}#${hash}`, [hash, pathname]);

  return (
    <div>
      <HeadingContainer id={hash} type={type}>
        <HeadingInner type={type}>
          <div className='flex-auto mb-1'>
            <div className='flex items-center justify-between'>
              <p>
                {block?.child_database?.title || 'Untitled'}
                <CopyHeadingLink href={href}>
                  <Link href={'#' + hash}>&nbsp;🔗</Link>
                </CopyHeadingLink>
              </p>
            </div>
          </div>
        </HeadingInner>
      </HeadingContainer>
      <div className='grid grid-cols-1 gap-5 mb-5 sm:grid-cols-2 lg:grid-cols-3'>
        {blocks.map((block) => (
          <ChildDatabaseItem key={`database-${block.id}`} block={block} sortKey={sortKey} />
        ))}
      </div>
    </div>
  );
};
