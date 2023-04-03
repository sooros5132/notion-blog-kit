import type React from 'react';
import classnames from 'classnames';
import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';
import { copyTextAtClipBoard } from 'src/lib/utils';
import type { NotionBlock } from 'src/types/notion';
import { NotionHasChildrenRender, NotionParagraphBlock } from '.';
import { richTextToPlainText } from './utils';

export type HeadingType = 'heading_1' | 'heading_2' | 'heading_3' | 'child_database' | 'normal';
export interface HeadingContainerProps {
  id?: string;
  type?: HeadingType;
  children: ReactNode;
}
export const HeadingContainer: React.FC<HeadingContainerProps> = ({ id, type, children }) => {
  return (
    <section
      id={id}
      className={classnames(
        'pt-[1.2em]',
        type === 'heading_1'
          ? 'text-[2rem]'
          : type === 'heading_2' || type === 'child_database'
          ? 'text-[1.5rem]'
          : type === 'normal'
          ? undefined
          : 'text-[1.2rem]'
      )}
    >
      {children}
    </section>
  );
};

export const HeadingInner: React.FC<HeadingInnerProps> = ({ type, children }) => {
  const props = {
    className: 'notion-heading-link-copy flex mb-1 font-bold break-all'
  };

  switch (type) {
    case 'heading_1': {
      return <h1 {...props}>{children}</h1>;
    }
    case 'heading_2': {
      return <h2 {...props}>{children}</h2>;
    }
    case 'heading_3': {
      return <h3 {...props}>{children}</h3>;
    }
    case 'child_database':
    case 'normal':
    default: {
      return <div {...props}>{children}</div>;
    }
  }
};
export interface HeadingInnerProps {
  type: 'heading_1' | 'heading_2' | 'heading_3' | 'child_database' | 'normal';
  children: ReactNode;
}

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

export const Heading: React.FC<HeadingProps> = ({ block }) => {
  const pathname = usePathname();

  const type = block.type as 'heading_1' | 'heading_2' | 'heading_3';
  const hash = richTextToPlainText(block[type].rich_text) + '-' + block.id.slice(0, 6);
  const href = encodeURIComponent(hash);
  const toggleableHeading = block.has_children;

  const headingEl = (
    <NotionParagraphBlock
      blockId={block.id}
      richText={block[type].rich_text}
      color={block[type].color}
      headingLink={`#${href}`}
    />
  );

  if (toggleableHeading) {
    return (
      <HeadingContainer id={href} type={type}>
        <details>
          <summary className='[&>*]:inline [&>*>*]:inline'>
            <HeadingInner type={type}>{headingEl}</HeadingInner>
          </summary>
          <div className='pl-[0.9em]'>
            <div className='text-base'>
              <NotionHasChildrenRender block={block} noLeftPadding />
            </div>
          </div>
        </details>
      </HeadingContainer>
    );
  }

  return (
    <HeadingContainer id={hash} type={type}>
      <HeadingInner type={type}>{headingEl}</HeadingInner>
    </HeadingContainer>
  );
};
