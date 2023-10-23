'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import type { BlogProperties } from '@/types/notion';
import { HiOutlineBarsArrowDown, HiOutlineBarsArrowUp } from 'react-icons/hi2';
import { throttle } from 'lodash';
import { createWithEqualityFn as create } from 'zustand/traditional';
import { ARCHIVE_PATH, CATEGORY_PATH } from '@/lib/constants';

type Store = {
  showAllCategories: boolean | null;
  setShowAllCategories: (showAllCategories: boolean) => void;
};

const useStore = create<Store>((set, get) => ({
  showAllCategories: null,
  setShowAllCategories(showAllCategories) {
    set({ showAllCategories });
  }
}));

export function NotionArchiveCategories({
  blogProperties,
  selectedCategory
}: {
  selectedCategory?: string;
  blogProperties?: BlogProperties;
}) {
  const categories = blogProperties?.categories || [];
  const { showAllCategories, setShowAllCategories } = useStore();
  const [isCategoriesOverflow, setIsCategoriesOverflow] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const categoriesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const containerEl = containerRef.current;
    const categoriesEl = categoriesRef.current;

    if (!containerEl || !categoriesEl) {
      return;
    }

    function handleResizeEvent() {
      if (!containerEl || !categoriesEl) {
        return;
      }

      const containerWidth = containerEl.scrollWidth;
      const categoriesWidth = categoriesEl.scrollWidth;

      if (categoriesWidth >= containerWidth) {
        setIsCategoriesOverflow(true);
      } else {
        setIsCategoriesOverflow(false);
      }
    }
    handleResizeEvent();

    const throddleResizeEvent = throttle(handleResizeEvent, 200);
    window.addEventListener('resize', throddleResizeEvent);

    return function () {
      window.removeEventListener('resize', throddleResizeEvent);
    };
  }, [showAllCategories, containerRef, categoriesRef]);

  const handleClickShowAllCategories = () => {
    setShowAllCategories(true);
  };
  const handleClickHideAllCategories = () => {
    setShowAllCategories(false);
  };
  if (!categories) {
    return <></>;
  }

  return (
    <div
      ref={containerRef}
      className={cn(
        'flex my-2 py-1 gap-x-1',
        isCategoriesOverflow && showAllCategories ? 'flex-wrap gap-y-1' : 'justify-center'
      )}
    >
      <div
        ref={categoriesRef}
        className={cn(
          'flex flex-auto grow-0 gap-1 items-center whitespace-nowrap overflow-x-auto overflow-y-hidden scrollbar-hidden',
          isCategoriesOverflow && showAllCategories ? 'flex-wrap' : 'flex-nowrap'
        )}
      >
        {categories.map((category) => {
          const isSelected = category.name === selectedCategory;
          return (
            <Link
              key={category.id}
              href={isSelected ? ARCHIVE_PATH : `${CATEGORY_PATH}/${category.name}`}
              shallow
            >
              <Button
                variant='ghost'
                className={cn(
                  'text-base',
                  isSelected
                    ? 'text-foreground font-bold bg-foreground/5'
                    : 'text-foreground/90 hover:text-foreground'
                )}
              >
                {category.name}
              </Button>
            </Link>
          );
        })}
      </div>
      {isCategoriesOverflow &&
        (showAllCategories ? (
          <Button
            variant='ghost'
            className='flex-auto grow-0 shrink-0 gap-x-1'
            onClick={handleClickHideAllCategories}
          >
            <HiOutlineBarsArrowUp /> Reduce
          </Button>
        ) : (
          <Button
            variant='ghost'
            className='flex-auto grow-0 shrink-0 gap-x-1'
            onClick={handleClickShowAllCategories}
          >
            <HiOutlineBarsArrowDown /> Expand
          </Button>
        ))}
    </div>
  );
}
