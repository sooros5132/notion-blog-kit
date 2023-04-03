'use client';

import type React from 'react';
import { sortBy } from 'lodash';
import { usePathname } from 'next/navigation';
import { useState, useMemo } from 'react';
import { BsArrowUpShort, BsArrowDownShort } from 'react-icons/bs';
import { NotionBlock, PropertyType, URL_PAGE_TITLE_MAX_LENGTH } from 'src/types/notion';
import { CopyHeadingLink, HeadingContainer, HeadingInner } from './Heading';
import { ChildDatabaseItem } from './ChildDatabaseItem';
import { useNotionStore } from 'src/store/notion';
import Link from 'next/link';

export interface ChildDatabaseProps {
  block: NotionBlock;
}

type SortKeys = 'title' | 'created_time' | 'last_edited_time';

const sortablePropertyTypes: Array<PropertyType | string> = [
  'title',
  'rich_text',
  'text',
  'date',
  'select',
  'number'
];
const defaultSortRecord = {
  title: 'title',
  created_time: 'created time',
  last_edited_time: 'edited time'
} as const;
const orderKeys = Object.keys(defaultSortRecord) as Array<keyof typeof defaultSortRecord>;

export const ChildDatabase: React.FC<ChildDatabaseProps> = ({ block }) => {
  const database = useNotionStore.getState().databaseRecord?.[block.id];

  // const sortKeyRecord = {
  //   ...defaultSortRecord
  // };

  // Object.keys(database?.results?.[0]?.properties || {}).forEach((key) => {
  //   const property = database?.results?.[0]?.properties[key];
  //   if (sortablePropertyTypes.includes(property?.type)) {
  //     sortKeyRecord[key] = {
  //       name: key,
  //       type: property?.type
  //     };
  //   }
  // });

  const pathname = usePathname();

  const [blocks, setBlocks] = useState(
    sortBy(
      database?.results?.[0]?.properties?.isPublished?.type === 'checkbox'
        ? database?.results.map((databaseBlock) => {
            const title =
              databaseBlock?.properties?.title?.title?.map((title) => title.plain_text).join('') ??
              '제목 없음';
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
              <p className='break-all'>
                {block?.child_database?.title || '제목 없음'}
                <CopyHeadingLink href={href}>
                  <Link href={'#' + encodeURIComponent(hash)}>&nbsp;🔗</Link>
                </CopyHeadingLink>
              </p>
              <div className='dropdown dropdown-left'>
                <label
                  tabIndex={0}
                  className='text-xl btn btn-ghost btn-sm text-inherit flex-nowrap whitespace-nowrap capitalize'
                >
                  {defaultSortRecord[sortKey]}
                  {isOrderAsc ? <BsArrowUpShort /> : <BsArrowDownShort />}
                </label>
                <ul
                  tabIndex={0}
                  className='p-2 text-lg shadow dropdown-content menu bg-base-100 rounded-box w-52'
                >
                  {orderKeys.map((key) => {
                    return (
                      <li key={key} onClick={handleCloseSortMenu(key)}>
                        <div className='gap-x-0.5 px-3 py-2 capitalize'>
                          {defaultSortRecord[key]}
                          {sortKey === key ? (
                            isOrderAsc ? (
                              <BsArrowUpShort />
                            ) : (
                              <BsArrowDownShort />
                            )
                          ) : null}
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </div>
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
