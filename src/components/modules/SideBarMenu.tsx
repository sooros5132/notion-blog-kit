'use client';

import { memo } from 'react';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import { useSiteSettingStore } from '@/store/siteSetting';
import isEqual from 'react-fast-compare';
import Link from 'next/link';
import { useNotionStore } from '@/store/notion';
import { notionTagColorClasses } from '@/lib/notion';
import { SearchForm } from '@/components/search/SearchForm';
import type { BlogProperties } from '@/types/notion';
import { cn } from '@/lib/utils';
import { ThemeToggle } from '../ThemeToggle';
import { Button } from '../ui/button';
import { HiOutlineLibrary } from 'react-icons/hi';
import { AiFillTags } from 'react-icons/ai';
import { BiCategoryAlt } from 'react-icons/bi';
import { ARCHIVE_PATH, CATEGORY_PATH, TAG_PATH } from '@/lib/constants';
import { Separator } from '../ui/separator';

export const SideBarMenu: React.FC = memo(() => {
  const blogProperties = useNotionStore((state) => state.blogProperties);

  if (!blogProperties) {
    return <></>;
  }

  return <SideBarMenuInner blogProperties={blogProperties}></SideBarMenuInner>;
}, isEqual);

type SideBarMenuInnerProps = {
  blogProperties: BlogProperties;
};

const SideBarMenuInner: React.FC<SideBarMenuInnerProps> = ({
  blogProperties: { categories, tags }
}) => {
  const { enableSideBarMenu, openSideBarMenu, closeSideBarMenu } = useSiteSettingStore();

  const handleClose = () => {
    closeSideBarMenu();
  };
  const handleClickSideBarMenuButton = () => {
    if (enableSideBarMenu) {
      closeSideBarMenu();
    } else {
      openSideBarMenu();
    }
  };

  return (
    <div
      className={cn(
        'fixed top-0 left-0 w-full bg-card/10 z-20 transition-all duration-300 transform-gpu isolate',
        enableSideBarMenu
          ? 'h-full opacity-100 backdrop-blur-lg'
          : 'h-0 opacity-0 invisible pointer-events-none backdrop-blur-none'
      )}
    >
      <div className='absolute top-0 left-0 w-full h-full ' onClick={handleClose} />
      <div
        className={cn(
          'absolute right-0 top-0 w-full h-full flex flex-col bg-background overflow-hidden sm:w-[400px]'
        )}
      >
        <div className='flex-auto grow-0 shrink-0 bg-card'>
          <div className='flex items-center justify-end px-2 h-[var(--header-height)]'>
            <ThemeToggle />
            <Button
              variant='ghost'
              size='icon'
              className='text-xl rounded-full'
              onClick={handleClickSideBarMenuButton}
            >
              {enableSideBarMenu ? <FaArrowRight /> : <FaArrowLeft />}
            </Button>
          </div>
          <div className='m-2 p-2 rounded-md'>
            <SearchForm />
          </div>
          <Separator />
          <div className='m-2 p-2 text-xl font-semibold'>
            <Link
              className='flex items-center gap-x-2 hover:underline'
              href={ARCHIVE_PATH}
              onClick={handleClose}
            >
              <HiOutlineLibrary /> Archive
            </Link>
          </div>
          <Separator />
        </div>
        <div className='flex-auto grow shrink bg-card overflow-y-auto'>
          <div className='m-2 p-2 rounded-md'>
            <h1 className='flex items-center gap-x-2 text-xl mb-2 font-semibold'>
              <BiCategoryAlt />
              Categories
            </h1>
            <ul className='whitespace-nowrap'>
              {categories.map((category) => (
                <Link
                  key={category.id}
                  href={`${CATEGORY_PATH}/${category.name}`}
                  scroll={false}
                  prefetch={false}
                  onClick={handleClose}
                >
                  <li
                    className={cn(
                      'flex items-center cursor-pointer pl-4 pr-1 py-1 my-1 rounded-md hover:bg-foreground/10'
                    )}
                  >
                    <span className='flex-auto grow-0 shrink overflow-hidden text-ellipsis'>
                      {category.name}
                    </span>
                  </li>
                </Link>
              ))}
            </ul>
          </div>
          <Separator />
          <div className='m-2 p-2 bg-card rounded-md'>
            <h1 className='flex items-center gap-x-2 text-xl mb-4 font-semibold'>
              <AiFillTags />
              Tags
            </h1>
            <ul className='flex flex-wrap gap-1.5 text-sm whitespace-nowrap sm:px-2'>
              {tags.map((tag) => (
                <Link
                  key={tag.id}
                  className={cn(
                    'cursor-pointer px-1.5 rounded-md opacity-70 hover:opacity-100',
                    notionTagColorClasses[tag.color],
                    `${
                      notionTagColorClasses[
                        `${tag.color}_background` as keyof typeof notionTagColorClasses
                      ]
                    }`
                  )}
                  href={`${TAG_PATH}/${tag.name}`}
                  scroll={false}
                  prefetch={false}
                  onClick={handleClose}
                >
                  {tag.name}
                </Link>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

SideBarMenu.displayName = 'SideBarMenu';
