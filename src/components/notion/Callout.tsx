import classnames from 'classnames';
import { ReactNode } from 'react';
import { Color, NotionBlock, IGetNotion } from 'src/types/notion';
import NotionBlockRender from './BlockRender';
import NotionSecureImage from './NotionSecureImage';
import Paragraph, { notionColorClasses } from './Paragraph';

interface CalloutBlockContainerProps {
  color: Color;
  children: ReactNode;
}

const CalloutBlockContainer = ({ color, children }: CalloutBlockContainerProps) => {
  return (
    <div
      className={classnames(
        'py-1.5 pr-3 pl-1.5',
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
  blocks: IGetNotion;
  chilrenBlockDepth?: number;
}

const Callout: React.FC<CalloutProps> = ({ block, blocks, chilrenBlockDepth }) => {
  return (
    <CalloutBlockContainer color={block.callout.color}>
      <NotionBlockRender block={block} blocks={blocks} chilrenBlockDepth={chilrenBlockDepth}>
        <div className='flex'>
          <div className='pt-0.5 basis-6 flex justify-center'>
            <div className='text-xl leading-6 font-emoji'>
              {block.callout?.icon?.file && block.callout?.icon?.type === 'file' && (
                <NotionSecureImage blockId={block.id} src={block.callout?.icon.file.url} />
              )}
              {block.callout?.icon?.emoji &&
                block.callout?.icon?.type === 'emoji' &&
                block.callout?.icon?.emoji}
            </div>
          </div>
          <Paragraph blockId={block.id} richText={block.callout.rich_text} />
        </div>
      </NotionBlockRender>
    </CalloutBlockContainer>
  );
};

export default Callout;
