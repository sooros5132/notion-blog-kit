'use client';

import { Suspense, type ReactNode } from 'react';
import { copyTextAtClipBoard } from '@/lib/utils';
import type { ChildrensRecord, DatabasesRecord, NotionBlocksRetrieve } from '@/types/notion';
import { NotionHasChildrenRender, NotionParagraphBlock } from '.';
import { richTextToPlainText } from './utils';
import { usePathname, useSearchParams } from 'next/navigation';
import { cn } from '@/lib/utils';

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
      className={cn(
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
    className: 'notion-heading-link-copy flex mb-1 font-bold'
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
  block: NotionBlocksRetrieve;
  childrensRecord: ChildrensRecord;
  databasesRecord: DatabasesRecord;
}

export const Heading: React.FC<HeadingProps> = ({ block, childrensRecord, databasesRecord }) => {
  const type = block.type as 'heading_1' | 'heading_2' | 'heading_3';
  const isToggleableHeading = block?.[type]?.is_toggleable;
  const hash = richTextToPlainText(block[type].rich_text);

  const heading = (
    <NotionParagraphBlock
      blockId={block.id}
      richText={block[type].rich_text}
      color={block[type].color}
    />
  );
  const headingEl = (
    // useSearchParams 사용으로 인한 코드 분리
    <Suspense fallback={heading}>
      <HeadingWithLink block={block} />
    </Suspense>
  );

  if (isToggleableHeading) {
    return (
      <HeadingContainer id={hash} type={type}>
        <details>
          <summary className='cursor-pointer [&>*]:inline [&>*>*]:inline'>
            <HeadingInner type={type}>{headingEl}</HeadingInner>
          </summary>
          <div className='pl-[0.9em]'>
            <div className='text-base'>
              <NotionHasChildrenRender
                block={block}
                noLeftPadding
                childrensRecord={childrensRecord}
                databasesRecord={databasesRecord}
              />
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

function HeadingWithLink({ block }: { block: NotionBlocksRetrieve }) {
  const type = block.type as 'heading_1' | 'heading_2' | 'heading_3';
  const pathname = usePathname();
  const searchParams = useSearchParams().toString();
  const hash = richTextToPlainText(block[type].rich_text);
  const path = `${pathname}${searchParams ? '?' : ''}${searchParams}`; //router.asPath.replace(/#.*$/, '');
  const href = `${path}#${hash}`;

  return (
    <NotionParagraphBlock
      blockId={block.id}
      richText={block[type].rich_text}
      color={block[type].color}
      headingLink={href}
    />
  );
}
