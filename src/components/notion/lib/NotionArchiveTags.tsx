'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import type { BlogProperties } from '@/types/notion';
import { HiOutlineBarsArrowDown, HiOutlineBarsArrowUp } from 'react-icons/hi2';
import { notionTagColorClasses } from '@/lib/notion';
import { throttle } from 'lodash';
import { createWithEqualityFn as create } from 'zustand/traditional';
import { ARCHIVE_PATH, TAG_PATH } from '@/lib/constants';

type Store = {
  showAllTags: boolean | null;
  setShowAllTags: (showAllTags: boolean) => void;
};

const useStore = create<Store>((set, get) => ({
  showAllTags: null,
  setShowAllTags(showAllTags) {
    set({ showAllTags });
  }
}));

export function NotionArchiveTags({
  blogProperties,
  selectedTag
}: {
  selectedTag?: string;
  blogProperties?: BlogProperties;
}) {
  const tags = blogProperties?.tags || [];
  // 페이지를 이동해도 목록 펼친 효과를 유지하기 위해 zustand사용
  const { showAllTags, setShowAllTags } = useStore();
  const [isTagsOverflow, setIsTagsOverflow] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const tagsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const containerEl = containerRef.current;
    const tagsEl = tagsRef.current;

    if (!containerEl || !tagsEl) {
      return;
    }

    function handleResizeEvent() {
      if (!containerEl || !tagsEl) {
        return;
      }

      const containerWidth = containerEl.scrollWidth;
      const tagsWidth = tagsEl.scrollWidth;

      if (tagsWidth >= containerWidth) {
        setIsTagsOverflow(true);
      } else {
        setIsTagsOverflow(false);
      }
    }
    handleResizeEvent();

    const throddleResizeEvent = throttle(handleResizeEvent, 200);
    window.addEventListener('resize', throddleResizeEvent);

    return function () {
      window.removeEventListener('resize', throddleResizeEvent);
    };
  }, [showAllTags, containerRef, tagsRef]);

  const handleClickShowAllTags = () => {
    setShowAllTags(true);
  };
  const handleClickHideAllTags = () => {
    setShowAllTags(false);
  };

  if (!tags) {
    return <></>;
  }

  return (
    <div
      ref={containerRef}
      className={cn(
        'flex my-2 py-1 gap-x-1',
        isTagsOverflow && showAllTags ? 'flex-wrap gap-y-1' : 'justify-center'
      )}
    >
      <div
        ref={tagsRef}
        className={cn(
          'flex flex-auto grow-0 gap-1 items-center whitespace-nowrap overflow-x-auto overflow-y-hidden scrollbar-hidden',
          isTagsOverflow && showAllTags ? 'flex-wrap' : 'flex-nowrap'
        )}
      >
        {tags.map((tag) => {
          const isSelected = tag.name === selectedTag;
          return (
            <Link key={tag.id} href={isSelected ? ARCHIVE_PATH : `${TAG_PATH}/${tag.name}`} shallow>
              <Button
                variant='ghost'
                size='sm'
                className={cn(
                  'h-auto w-auto p-0.5 px-1 text-sm',
                  isSelected ? 'font-bold' : 'bg-opacity-60 text-opacity-50',
                  notionTagColorClasses[tag.color],
                  `${
                    notionTagColorClasses[
                      `${tag.color}_background` as keyof typeof notionTagColorClasses
                    ]
                  }`,
                  `hover:${
                    notionTagColorClasses[
                      `${tag.color}_background` as keyof typeof notionTagColorClasses
                    ]
                  }`
                )}
              >
                {tag.name}
              </Button>
            </Link>
          );
        })}
      </div>
      {isTagsOverflow &&
        (showAllTags ? (
          <Button
            variant='ghost'
            size='sm'
            className='flex-auto max-h-6 grow-0 shrink-0 gap-x-1'
            onClick={handleClickHideAllTags}
          >
            <HiOutlineBarsArrowUp /> Reduce
          </Button>
        ) : (
          <Button
            variant='ghost'
            size='sm'
            className='flex-auto max-h-6 grow-0 shrink-0 gap-x-1'
            onClick={handleClickShowAllTags}
          >
            <HiOutlineBarsArrowDown /> Expand
          </Button>
        ))}
    </div>
  );
}
