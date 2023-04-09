import type React from 'react';
import { FC, PropsWithChildren } from 'react';
import { BiCopy } from 'react-icons/bi';
import { copyTextAtClipBoard } from '../../lib/utils';

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
      <button
        className='btn btn-xs absolute top-1 right-1 bg-base-content/10 border-none text-base-content cursor-pointer invisible hover:bg-base-content/20 group-hover:visible'
        onClick={handleClickCopyButton}
      >
        <BiCopy />
      </button>
    </div>
  );
};
