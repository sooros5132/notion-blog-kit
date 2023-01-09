'use client';

import type React from 'react';
import { sortBy } from 'lodash';
import { usePathname } from 'next/navigation';
import { useState, useMemo } from 'react';
import { BsArrowUpShort, BsArrowDownShort } from 'react-icons/bs';
import { NotionBlock, IGetNotion, URL_PAGE_TITLE_MAX_LENGTH } from 'src/types/notion';
import { CopyHeadingLink, HeadingContainer, HeadingInner } from './Heading';
import { ChildDatabaseItem } from './ChildDatabaseItem';

export type NotionChildrenRenderProps = { block: NotionBlock };

export interface ChildDatabaseProps extends NotionChildrenRenderProps {
  databases: IGetNotion['databaseBlocks'];
}

const ChildDatabase: React.FC<ChildDatabaseProps> = ({ block, databases }) => {
  const pathname = usePathname();
  const [blocks, setBlocks] = useState(
    sortBy(
      databases[block.id]?.results?.[0]?.properties?.isPublished?.type === 'checkbox'
        ? databases[block.id]?.results
            .filter((b) => b?.properties?.['isPublished']?.checkbox)
            .map((databaseBlock) => {
              const title =
                databaseBlock?.properties?.title?.title
                  ?.map((title) => title.plain_text)
                  .join('') ?? '제목 없음';
              const newBlock = {
                ...databaseBlock,
                title
              };
              return newBlock;
            }) || []
        : databases[block.id]?.results || [],
      'created_time'
    ).reverse()
  );
  const [sortKey, setSortKey] = useState<'created_time' | 'last_edited_time' | 'title'>(
    'created_time'
  );
  const [isOrderAsc, setIsOrderAsc] = useState(true);
  const KorKeyRecord = useMemo<Record<typeof sortKey, string>>(
    () => ({
      created_time: '생성일',
      last_edited_time: '수정일',
      title: '이름'
    }),
    []
  );

  const handleCloseSortMenu = (prop?: typeof sortKey) => () => {
    switch (prop) {
      // 시간은 반대 개념 나머지는 정상
      case 'last_edited_time':
      case 'created_time': {
        if (prop === sortKey) {
          const newIsOrderAsc = !isOrderAsc;
          setBlocks((prevBlocks) =>
            newIsOrderAsc ? sortBy(prevBlocks, prop) : sortBy(prevBlocks, prop).reverse()
          );
          setSortKey(prop);
          setIsOrderAsc(newIsOrderAsc);
        } else {
          setBlocks((prevBlocks) => sortBy(prevBlocks, prop));
          setSortKey(prop);
          setIsOrderAsc(true);
        }
        break;
      }
      case 'title': {
        if (prop === sortKey) {
          const newIsOrderAsc = !isOrderAsc;
          setBlocks((prevBlocks) =>
            newIsOrderAsc ? sortBy(prevBlocks, prop).reverse() : sortBy(prevBlocks, prop)
          );
          setSortKey(prop);
          setIsOrderAsc(newIsOrderAsc);
        } else {
          setBlocks((prevBlocks) => sortBy(prevBlocks, prop).reverse());
          setSortKey(prop);
          setIsOrderAsc(true);
        }
        break;
      }
    }
  };
  const hash = `${
    block?.child_database?.title.slice(0, URL_PAGE_TITLE_MAX_LENGTH) || ''
  }-${block.id.replaceAll('-', '')}`;
  const href = useMemo(() => `${pathname?.replace(/#.*/, '')}#${hash}`, [hash, pathname]);

  return (
    <div>
      <HeadingContainer id={hash}>
        <HeadingInner type={block.type as 'child_database'}>
          <div className='flex-auto'>
            <div className='flex items-center justify-between'>
              <p className='break-all'>
                {block?.child_database?.title || '제목 없음'}
                <CopyHeadingLink href={href}>
                  <a href={'#' + hash}>&nbsp;🔗</a>
                </CopyHeadingLink>
              </p>
              <div className='dropdown dropdown-left'>
                <label
                  tabIndex={0}
                  className='m-1 text-xl whitespace-nowrap flex-nowrap btn btn-ghost btn-sm text-inherit'
                >
                  {KorKeyRecord[sortKey]}
                  {isOrderAsc ? <BsArrowUpShort /> : <BsArrowDownShort />}
                </label>
                <ul
                  tabIndex={0}
                  className='p-2 text-xl shadow dropdown-content menu bg-base-300 rounded-box w-52'
                >
                  <li onClick={handleCloseSortMenu('title')}>
                    <a>이름</a>
                  </li>
                  <li onClick={handleCloseSortMenu('created_time')}>
                    <a>생성일</a>
                  </li>
                  <li onClick={handleCloseSortMenu('last_edited_time')}>
                    <a>수정일</a>
                  </li>
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

export default ChildDatabase;
