import type React from 'react';
import classnames from 'classnames';
import type { ReactNode } from 'react';
import type { Color, FileObject, NotionBlock } from 'src/types/notion';
import {
  NotionHasChildrenRender,
  NotionParagraphBlock,
  NotionSecureImage,
  notionColorClasses
} from '.';

interface CalloutBlockContainerProps {
  color: Color;
  children: ReactNode;
}

const CalloutBlockContainer = ({ color, children }: CalloutBlockContainerProps) => {
  return (
    <div
      className={classnames(
        'py-1.5 pr-3 pl-1.5 shadow-md',
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

const Callout: React.FC<CalloutProps> = ({ block }) => {
  return (
    <CalloutBlockContainer color={block.callout.color}>
      <NotionHasChildrenRender block={block}>
        <div className='flex'>
          <div className='pt-0.5 basis-6 flex justify-center'>
            <div className='text-xl leading-6 font-emoji'>
              {block.callout.icon.file && block.callout.icon.type === 'file' && (
                <NotionSecureImage
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
          <NotionParagraphBlock blockId={block.id} richText={block.callout.rich_text} />
        </div>
      </NotionHasChildrenRender>
    </CalloutBlockContainer>
  );
};

export default Callout;
