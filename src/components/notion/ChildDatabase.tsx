import { formatDistance } from 'date-fns';
import { formatInTimeZone, utcToZonedTime } from 'date-fns-tz';
import { sortBy } from 'lodash';
import config from 'site-setting';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState, useMemo, memo, useEffect } from 'react';
import { BsArrowUpShort, BsArrowDownShort } from 'react-icons/bs';
import { SiNotion } from 'react-icons/si';
import type { NotionBlock, IGetNotion, NotionDatabase } from 'src/types/notion';
import isEqual from 'react-fast-compare';
import { CopyHeadingLink, HeadingContainer, HeadingInner } from './Heading';
import { ko as koLocale } from 'date-fns/locale';
import { awsImageObjectUrlToNotionUrl } from 'src/lib/notion';
import { NotionParagraphBlock, NotionSecureImage } from '.';

export type NotionChildrenRenderProps = { block: NotionBlock };

export interface ChildDatabaseProps extends NotionChildrenRenderProps {
  databases: IGetNotion['databaseBlocks'];
}

const ChildDatabase: React.FC<ChildDatabaseProps> = ({ block, databases }) => {
  const router = useRouter();
  const [blocks, setBlocks] = useState(
    sortBy(
      databases[block.id]?.results?.[0]?.properties?.isPublished?.type === 'checkbox'
        ? databases[block.id]?.results
            .filter((b) => b.properties?.['isPublished']?.checkbox)
            .map((databaseBlock) => {
              const title =
                databaseBlock.properties?.title?.title?.map((title) => title.plain_text).join() ??
                '제목 없음';
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
  const hash = `${block?.child_database?.title.slice(0, 50) || ''}-${block.id.replaceAll('-', '')}`;
  const href = useMemo(() => `${router.asPath.replace(/\#.*/, '')}#${hash}`, [router]);

  return (
    <div>
      <HeadingContainer id={hash}>
        <HeadingInner type={block.type as 'child_database'}>
          <div className='flex-auto'>
            <div className='flex items-center justify-between'>
              <p className='break-words break-all'>
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
          <ChildDatabaseBlock key={`database-${block.id}`} block={block} />
        ))}
      </div>
    </div>
  );
};

const ChildDatabaseBlock: React.FC<{ block: NotionDatabase }> = memo(({ block }) => {
  const [createdAt, setCreatedAt] = useState(
    block?.created_time
      ? formatInTimeZone(new Date(block.created_time), config.TZ, 'yyyy-MM-dd', {
          locale: koLocale
        })
      : undefined
  );
  const title = useMemo(
    () => block?.properties?.title?.title?.map((t) => t?.plain_text).join('') || null,
    []
  );

  useEffect(() => {
    if (block?.created_time) {
      setCreatedAt(
        formatDistance(
          utcToZonedTime(new Date(block.created_time), config.TZ),
          utcToZonedTime(new Date(), config.TZ),
          {
            locale: koLocale,
            addSuffix: true
          }
        )
      );
    }
  }, []);

  return (
    // borderRadius: theme.size.px10,
    // minWidth: 100,
    // backgroundColor: theme.color.cardBackground,
    // /**
    //  * Safari 브라우저 borderRadius 오류.
    //  * 쌓임 맥락에 추가 https://www.sungikchoi.com/blog/safari-overflow-border-radius/
    //  * isolation: isolate
    //  * will-change: transform;
    //  * 추가하기
    //  */
    // isolation: 'isolate',
    // overflow: 'hidden',
    // '& .page-cover': {
    //   filter: 'brightness(0.75)'
    // },
    // '&:hover .page-cover': {
    //   filter: 'brightness(1)',
    //   '& .image': {
    //     transform: 'scale(1.05)'
    //   }
    // }
    <div>
      <div className='rounded-xl min-w-[100px] bg-white/5 isolate overflow-hidden [&>a>.page-cover]:brightness-90 [&:hover>a>.page-cover]:brightness-100 [&:hover>a>.page-cover>div>img]:scale-[1.05] [&:hover>a>.page-cover>.notion-database-item-empty-cover]:scale-[1.05]'>
        <Link href={title ? `/${title}-${block.id.replaceAll('-', '')}` : `/${block.id}`}>
          <a>
            <div className='page-cover h-48 transition-[filter] duration-200 ease-linear bg-white/5 [&>div]:h-full [&>div>img]:w-full [&>div>img]:h-full [&>div>img]:trasnition-transform [&>div>img]:duration-200 [&>div>img]:ease-linear '>
              {block?.cover ? (
                <NotionSecureImage
                  src={block?.cover?.file?.url ?? block?.cover?.external?.url ?? ''}
                  blockId={block.id}
                  layout='fill'
                  objectFit='cover'
                />
              ) : block?.icon ? (
                block?.icon?.emoji ? (
                  <div className='notion-database-item-empty-cover'>{block?.icon?.emoji}</div>
                ) : block?.icon?.file ? (
                  <NotionSecureImage
                    src={
                      awsImageObjectUrlToNotionUrl({
                        blockId: block.id,
                        s3ObjectUrl: block?.icon.file?.url
                      }) ?? ''
                    }
                    layout='fill'
                    objectFit='cover'
                    blockId={block.id}
                  />
                ) : (
                  <div className='notion-database-item-empty-cover'>
                    <SiNotion />
                  </div>
                )
              ) : (
                <div className='notion-database-item-empty-cover'>
                  <SiNotion />
                </div>
              )}
            </div>
            <div className='flex items-center justify-between px-3 py-2 gap-x-2'>
              <div className='overflow-hidden max-h-[3.3em] [&>div>p]:line-clamp-2 [&>div>a]:line-clamp-2 [&>div>span]:line-clamp-2'>
                {block?.properties?.title?.title && (
                  <NotionParagraphBlock
                    blockId={block.id}
                    richText={block?.properties?.title?.title}
                  />
                )}
              </div>
              <div className='whitespace-nowrap'>
                <p>{createdAt}</p>
              </div>
            </div>
          </a>
        </Link>
      </div>
    </div>
  );
}, isEqual);

ChildDatabaseBlock.displayName = 'ChildDatabaseBlock';

export default ChildDatabase;
