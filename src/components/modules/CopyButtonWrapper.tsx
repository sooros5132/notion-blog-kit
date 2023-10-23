'use client';

import { FC, PropsWithChildren } from 'react';
import { BiCopy } from 'react-icons/bi';
import { copyTextAtClipBoard } from '@/lib/utils';
import { Button } from '@/components/ui/button';

export const CopyButtonWrapper: FC<PropsWithChildren<{ content?: string }>> = ({
  content,
  children
}) => {
  const handleClickCopyButton = () => {
    if (content) copyTextAtClipBoard(content);
  };
  return (
    <div className='group relative'>
      {children}
      <Button
        variant='ghost'
        size='icon'
        className='absolute top-1 right-1 bg-background border-none text-foreground cursor-pointer invisible hover:bg-background/90 group-hover:visible'
        onClick={handleClickCopyButton}
      >
        <BiCopy />
      </Button>
    </div>
  );
};
