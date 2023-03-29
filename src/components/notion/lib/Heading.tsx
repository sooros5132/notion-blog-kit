import type React from 'react';
import classnames from 'classnames';
import { usePathname } from 'next/navigation';
import { useMemo } from 'react';
import type { ReactNode } from 'react';
import { copyTextAtClipBoard } from 'src/lib/utils';
import type { NotionBlock } from 'src/types/notion';
import { NotionParagraphBlock } from '.';

export interface HeadingContainerProps {
  id: string;
  children: ReactNode;
}

export const HeadingContainer = ({ id, children }: HeadingContainerProps) => {
  return (
    <div id={id} className='pt-[3.1em] mb-1'>
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
        'font-bold flex break-all leading-[1.2em]',
        type === 'heading_1'
          ? 'text-[2em]'
          : type === 'heading_2' || type === 'child_database'
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
    const href = new URL(location.origin + url).href;

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
  const pathname = usePathname();

  const type = block.type as 'heading_1' | 'heading_2' | 'heading_3';
  const hash = block.id.replaceAll('-', '');
  const href = useMemo(() => `${pathname?.replace(/#.*/, '')}#${hash}`, [hash, pathname]);
  return (
    <HeadingContainer id={hash}>
      <HeadingInner type={type}>
        <NotionParagraphBlock
          blockId={block.id}
          richText={block[type].rich_text}
          color={block[type].color}
          headingLink={href}
        />
      </HeadingInner>
    </HeadingContainer>
  );
};

export default Heading;
