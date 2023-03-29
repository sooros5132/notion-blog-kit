import classNames from 'classnames';
import formatInTimeZone from 'date-fns-tz/formatInTimeZone';
import type React from 'react';
import { useMemo, useState } from 'react';
import { SiNotion } from 'react-icons/si';
import {
  FileObject,
  INotionSearchObject,
  NotionDatabase,
  NotionDatabasesQuery,
  URL_PAGE_TITLE_MAX_LENGTH
} from 'src/types/notion';
import { NotionSecureImage } from '.';
import config from 'site-config';
import Link from 'next/link';
import { AiOutlineSearch } from 'react-icons/ai';

type NotionDatabasePageViewProps = {
  baseBlock: NotionDatabasesQuery;
  pageInfo: INotionSearchObject;
};

export const NotionDatabasePageView: React.FC<NotionDatabasePageViewProps> = ({
  baseBlock,
  pageInfo
}) => {
  const [searchValue, setSearchValue] = useState<string>('');
  const [filterKey, setFilterKey] = useState<string | null>(null);
  const [filterdBlocks, setFilterdBlocks] = useState<Array<NotionDatabase>>(
    baseBlock.results as unknown as Array<NotionDatabase>
  );
  const haveTitleProperty = Boolean(pageInfo.properties.title?.title);

  const handleClickCategoryItem = (key: string | null) => () => {
    if (pageInfo.properties.category?.type !== 'select') {
      return;
    }
    if (!key) {
      setFilterKey(null);
      setFilterdBlocks(baseBlock.results);
      return;
    }
    if (key === filterKey) {
      setFilterKey(null);
      setFilterdBlocks(baseBlock.results);
      return;
    }
    setFilterKey(key);
    const newFilterdBlocks = baseBlock.results.filter(
      (block) => block.properties.category?.select.name === key
    );
    setFilterdBlocks(newFilterdBlocks);
  };

  const handleChangeSearchValue = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!haveTitleProperty) {
      return;
    }
    const value = event.target.value;
    setSearchValue(value);
    if (!value) {
      handleClickCategoryItem(filterKey)();
      return;
    }
    setFilterKey(null);
    const newFilterdBlocks = baseBlock.results.filter((block) => {
      const title = block.properties.title?.title
        ? block.properties.title.title.map((text) => text?.plain_text).join('') || null
        : null;
      if (title) return title.match(new RegExp(value, 'igm'));
      return false;
    });
    setFilterdBlocks(newFilterdBlocks);
  };

  const categorys = useMemo(() => {
    if (pageInfo.properties.category?.type !== 'select') {
      return null;
    }
    const categorys = baseBlock.results.reduce<Record<string, number>>((prev, current) => {
      const name = current.properties.category?.select.name;
      if (!name) {
        return prev;
      }
      return {
        ...prev,
        [name]: prev[name] ? prev[name] + 1 : 1
      };
    }, {});
    return categorys;
  }, [baseBlock.results, pageInfo.properties.category?.type]);

  return (
    <div className='w-full flex flex-col gap-y-4 sm:gap-x-4 sm:flex-row min-h-screen'>
      {categorys && (
        <aside className='sticky top-[var(--header-height)] left-0 p-2 gap-x-2 z-10 bg-base-100 flex grow-0 shrink-0 sm:z-0 sm:p-0 sm:mb-0 sm:flex-col sm:w-[200px] sm:gap-y-4 md:w-[220px]'>
          <ul className='flex gap-x-2 overflow-x-auto scrollbar-hidden text-sm sm:flex-col sm:px-2 sm:overflow-hidden sm:gap-y-1 sm:order-2'>
            {Object.keys(categorys)
              .sort()
              .map((category) => (
                <li
                  key={category}
                  className={classNames(
                    'flex items-center cursor-pointer py-[0.2em] px-[0.7em] rounded-full bg-base-content/10 sm:p-0 sm:bg-[initial] sm:rounded-none sm:hover:bg-base-content/5 sm:border-l-[3px] sm:pl-2 sm:py-0.5 border-base-content/10',
                    filterKey === category ? 'bg-success/50 sm:font-bold sm:border-success' : null
                  )}
                  onClick={handleClickCategoryItem(category)}
                >
                  <span className='flex-auto grow-0 overflow-hidden text-ellipsis'>{category}</span>
                  <span className='flex-auto grow-0 shrink-0'>({categorys[category]})</span>
                </li>
              ))}
          </ul>
          <div className='self-center input-group min-w-[180px] bg-base-100 rounded-md shadow-md dark:bg-base-content/5 sm:order-1'>
            <input
              className={classNames(
                'input input-sm w-full bg-transparent focus:outline-none placeholder:text-base-content/60'
              )}
              value={searchValue}
              type='text'
              name='search'
              placeholder='Article Title'
              onChange={handleChangeSearchValue}
            />
            <button className='btn btn-sm btn-ghost btn-circle sm:btn-square text-lg'>
              <AiOutlineSearch />
            </button>
          </div>
        </aside>
      )}
      {haveTitleProperty && (
        <div className='flex-auto flex flex-col px-3 gap-y-4 sm:p-0 sm:gap-y-3'>
          {filterdBlocks.map((block) => (
            <ArticleSummary key={block.id} article={block} />
          ))}
        </div>
      )}
    </div>
  );
};

type ArticleSummaryProps = {
  article: NotionDatabase;
};

const ArticleSummary: React.FC<ArticleSummaryProps> = ({ article }) => {
  const { id, created_time, properties, icon, cover } = article;
  const { tags, title: titleProperty } = properties;
  const haveTagProperty = tags?.type === 'multi_select';

  const title = titleProperty?.title
    ? titleProperty.title.map((text) => text?.plain_text).join('') || null
    : null;

  return (
    <Link
      href={
        title
          ? `/${encodeURIComponent(title.slice(0, URL_PAGE_TITLE_MAX_LENGTH))}-${id.replaceAll(
              '-',
              ''
            )}`
          : `/${id.replaceAll('-', '')}`
      }
    >
      <div className='w-full flex flex-col bg-base-content/5 shadow-md rounded-md transition-transform overflow-hidden sm:hover:-translate-y-0.5 sm:flex-row'>
        <div className='h-[200px] grow-0 shrink-0 bg-base-content/5 [&>div]:h-full [&>div>img]:w-full [&>div>img]:h-full sm:w-[100px] md:w-[150px] lg:w-[200px] sm:h-[84px]'>
          {cover ? (
            <NotionSecureImage
              blockId={id}
              blockType={'page'}
              useType={'cover'}
              initialFileObject={cover}
              alt={'page-cover'}
            />
          ) : icon ? (
            icon?.emoji ? (
              <div className='notion-database-item-empty-cover'>{icon?.emoji}</div>
            ) : icon?.file ? (
              <NotionSecureImage
                blockId={id}
                blockType={'page'}
                useType={'icon'}
                initialFileObject={icon as FileObject}
                alt={'page-icon'}
              />
            ) : (
              <div className='notion-database-item-empty-cover text-base-content/10'>
                <SiNotion />
              </div>
            )
          ) : (
            <div className='notion-database-item-empty-cover text-base-content/10'>
              <SiNotion />
            </div>
          )}
        </div>
        <div className='flex-auto flex flex-col justify-between p-4 py-3 sm:py-2'>
          <div className='line-clamp-2 break-all'>{title}</div>
          <div className='mt-auto flex items-end justify-between gap-x-2 break-all'>
            <div className='flex-1 text-zinc-500 text-sm line-clamp-1'>
              {haveTagProperty &&
                tags.multi_select?.map((tag) => <span key={tag.name}>#{tag.name}&nbsp;</span>)}
            </div>
            <div>
              {created_time && (
                <div className='flex-auto grow-0 shrink-0 text-zinc-500 text-sm sm:self-end'>
                  {formatInTimeZone(new Date(created_time), config.TZ, 'yyyy-MM-dd')}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};
