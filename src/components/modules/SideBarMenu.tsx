import type React from 'react';
import { memo } from 'react';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import classNames from 'classnames';
import { useSiteSettingStore } from 'src/store/siteSetting';
import isEqual from 'react-fast-compare';
import Link from 'next/link';
import { useNotionStore } from 'src/store/notion';
import { notionTagColorClasses } from 'src/lib/notion';
import { ThemeChangeButton } from 'src/components/modules/ThemeChangeButton';
import { SearchForm } from 'src/components/search/SearchForm';
import type { BlogProperties } from 'src/types/notion';

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
      className={classNames(
        'fixed top-0 left-0 w-full bg-base-content/10 z-20 transition-all duration-300 transform-gpu isolate',
        enableSideBarMenu
          ? 'h-full opacity-100 backdrop-blur-3xl'
          : 'h-0 opacity-0 backdrop-blur-none invisible pointer-events-none'
      )}
    >
      <div className='absolute top-0 left-0 w-full h-full ' onClick={handleClose} />
      <div
        className={classNames(
          'absolute right-0 top-0 w-full h-full flex flex-col bg-base-100/60 shadow-2xl overflow-hidden sm:w-[400px]'
        )}
      >
        <div className='flex-auto grow-0 shrink-0'>
          <div className='flex items-center justify-end px-2 h-[var(--header-height)] bg-base-200/50 shadow-md'>
            <ThemeChangeButton />
            <button
              className='btn btn-circle btn-sm btn-ghost text-xl'
              onClick={handleClickSideBarMenuButton}
            >
              {enableSideBarMenu ? <FaArrowRight /> : <FaArrowLeft />}
            </button>
          </div>
          <div className='m-2 p-4 py-3 sm:py-2 sm:px-3 bg-base-100/60 rounded-md shadow-xl'>
            <SearchForm />
          </div>
        </div>
        <div className='flex-auto grow shrink overflow-y-auto'>
          <div className='m-2 mt-0 p-4 sm:py-2 sm:px-3 bg-base-100/60 rounded-md shadow-xl'>
            <h1 className='text-xl mb-2 font-bold'>Categories</h1>
            <ul className='whitespace-nowrap sm:px-2'>
              {categories.map((category) => (
                <Link
                  key={category.id}
                  href={`/category/${category.name}`}
                  scroll={false}
                  prefetch={false}
                  onClick={handleClose}
                >
                  <li
                    className={classNames(
                      'flex items-center cursor-pointer pl-2 pr-1 py-1 my-1 rounded-md hover:bg-base-content/10'
                    )}
                  >
                    <span className='flex-auto grow-0 shrink overflow-hidden text-ellipsis'>
                      {category.name}
                    </span>
                    <span className='flex-auto grow-0 shrink-0'>({category.count})</span>
                  </li>
                </Link>
              ))}
            </ul>
          </div>
          <div className='m-2 p-4 sm:pt-2 sm:pb-4 sm:px-3 bg-base-100/60 rounded-md shadow-xl'>
            <h1 className='text-xl mb-2 font-bold'>Tags</h1>
            <ul className='flex flex-wrap gap-1.5 text-sm whitespace-nowrap sm:px-2'>
              {tags.map((tag) => (
                <Link
                  key={tag.id}
                  className={classNames(
                    'cursor-pointer px-1.5 rounded-md opacity-70 hover:opacity-100',
                    notionTagColorClasses[tag.color],
                    `${
                      notionTagColorClasses[
                        `${tag.color}_background` as keyof typeof notionTagColorClasses
                      ]
                    }`
                  )}
                  href={`/tag/${tag.name}`}
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
