import type React from 'react';
import classnames from 'classnames';
import type { ReactNode } from 'react';
import type { Color, FileObject, NotionBlock } from 'src/types/notion';
import { NotionHasChildrenRender, NotionParagraphBlock, NotionSecureImage } from '.';
import { notionColorClasses } from 'src/lib/notion';

interface CalloutBlockContainerProps {
  color: Color;
  children: ReactNode;
}

const CalloutBlockContainer = ({ color, children }: CalloutBlockContainerProps) => {
  return (
    <div
      className={classnames(
        'my-1 p-2',
        color && color !== 'default' && !color.match(/_background$/) && notionColorClasses[color],
        color && color.match(/_background$/) && notionColorClasses[color]
      )}
    >
      {children}
    </div>
  );
};

interface CalloutProps {
  block: NotionBlock;
}

export const Callout: React.FC<CalloutProps> = ({ block }) => {
  return (
    <CalloutBlockContainer color={block.callout.color}>
      <NotionHasChildrenRender block={block} className='pl-8 mt-2' noLeftPadding>
        <div className='flex gap-x-2'>
          <div className='w-6 h-6 shrink-0 flex justify-center'>
            <div className='text-xl font-emoji'>
              {block.callout.icon.file && block.callout.icon.type === 'file' && (
                <NotionSecureImage
                  useNextImage
                  alt='callout-icon'
                  blockId={block.id}
                  blockType={'callout'}
                  useType={'icon'}
                  initialFileObject={block.callout.icon as FileObject}
                />
              )}
              {block.callout?.icon?.emoji &&
                block.callout?.icon?.type === 'emoji' &&
                block.callout?.icon?.emoji}
            </div>
          </div>
          <div className='self-center'>
            <NotionParagraphBlock blockId={block.id} richText={block.callout.rich_text} />
          </div>
        </div>
      </NotionHasChildrenRender>
    </CalloutBlockContainer>
  );
};
