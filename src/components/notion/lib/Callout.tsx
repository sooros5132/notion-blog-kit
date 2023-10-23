'use client';

import type { PropsWithChildren } from 'react';
import type {
  ChildrensRecord,
  Color,
  DatabasesRecord,
  FileObject,
  NotionBlocksRetrieve
} from '@/types/notion';
import { NotionHasChildrenRender, NotionParagraphBlock, NotionSecureImage } from '.';
import { notionColorClasses } from '@/lib/notion';
import { cn } from '@/lib/utils';

interface CalloutProps {
  block: NotionBlocksRetrieve;
  childrensRecord: ChildrensRecord;
  databasesRecord: DatabasesRecord;
}

export const Callout: React.FC<CalloutProps> = ({ block, childrensRecord, databasesRecord }) => {
  const callout = block.callout;
  const { color, icon, rich_text } = callout;

  return (
    <CalloutBlockStyleWapper color={color}>
      <NotionHasChildrenRender
        block={block}
        className='pl-8 mt-2'
        noLeftPadding
        childrensRecord={childrensRecord}
        databasesRecord={databasesRecord}
      >
        <div className='flex gap-x-2'>
          <div className='w-6 h-6 shrink-0 flex justify-center'>
            <div className='text-xl font-emoji'>
              {icon.file && icon.type === 'file' && (
                <NotionSecureImage
                  useNextImage
                  alt='callout-icon'
                  blockId={block.id}
                  blockType={'callout'}
                  useType={'icon'}
                  initialFileObject={icon as FileObject}
                />
              )}
              {icon?.emoji && icon?.type === 'emoji' && icon?.emoji}
            </div>
          </div>
          <div className='self-center'>
            <NotionParagraphBlock blockId={block.id} richText={rich_text} />
          </div>
        </div>
      </NotionHasChildrenRender>
    </CalloutBlockStyleWapper>
  );
};

interface CalloutBlockStyleWapperProps extends PropsWithChildren {
  color: Color;
}

const CalloutBlockStyleWapper = ({ color, children }: CalloutBlockStyleWapperProps) => {
  return (
    <div
      className={cn(
        'my-1 p-2',
        color && color !== 'default' && !color.match(/_background$/) && notionColorClasses[color],
        color && color.match(/_background$/) && notionColorClasses[color]
      )}
    >
      {children}
    </div>
  );
};
