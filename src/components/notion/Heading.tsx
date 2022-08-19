import classnames from 'classnames';
import { useRouter } from 'next/router';
import { useMemo } from 'react';
import type { ReactNode } from 'react';
import config from 'site-setting';
import { copyTextAtClipBoard } from 'src/lib/utils';
import type { NotionBlock } from 'src/types/notion';
import { NotionParagraphBlock } from '.';

export interface HeadingContainerProps {
  id: string;
  children: ReactNode;
}

export const HeadingContainer = ({ id, children }: HeadingContainerProps) => {
  return (
    <div id={id} className='pt-[2.1em] mb-1'>
      {children}
    </div>
  );
};
export interface HeadingInnerProps {
  type: 'heading_1' | 'heading_2' | 'heading_3' | 'child_database' | 'normal';
  children: ReactNode;
}

export const HeadingInner: React.FC<HeadingInnerProps> = ({ type, children }) => {
  return (
    <div
      className={classnames(
        'font-bold flex break-words leading-[1.2em]',
        type === 'heading_1' || type === 'child_database'
          ? 'text-[2em]'
          : type === 'heading_2'
          ? 'text-[1.5em]'
          : type === 'normal'
          ? undefined
          : 'text-[1.2em]',
        'notion-heading-link-copy'
      )}
    >
      {children}
    </div>
  );
};

export const CopyHeadingLink: React.FC<{ href: string; children: React.ReactNode }> = ({
  href,
  children
}) => {
  const handleClick = (url: string) => () => {
    const href = new URL(url, config.origin).href;

    href && copyTextAtClipBoard(href);
  };
  return (
    <span className='heading-link' onClick={handleClick(href)}>
      {children}
    </span>
  );
};

interface HeadingProps {
  block: NotionBlock;
}

const Heading: React.FC<HeadingProps> = ({ block }) => {
  const router = useRouter();
  const type = block.type as 'heading_1' | 'heading_2' | 'heading_3';
  const hash = block.id.replaceAll('-', '');
  const href = useMemo(() => `${router.asPath.replace(/\#.*/, '')}#${hash}`, [router]);
  return (
    <HeadingContainer id={hash}>
      <HeadingInner type={type}>
        <NotionParagraphBlock
          blockId={block.id}
          richText={block[type].rich_text}
          color={block[type].color}
          headingLink={'#' + hash}
        />
      </HeadingInner>
    </HeadingContainer>
  );
};

export default Heading;
