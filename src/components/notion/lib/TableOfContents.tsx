'use client';

import Link from 'next/link';
import { notionColorClasses } from '@/lib/notion';
import type { NotionBlocksRetrieve, RichText, RichTextObject } from '@/types/notion';
import { richTextToPlainText } from './utils';

interface TableOfContentsProps {
  blocks: Array<NotionBlocksRetrieve>;
  block: NotionBlocksRetrieve;
}

export const TableOfContents: React.FC<TableOfContentsProps> = ({ blocks, block }) => {
  const headers = blocks.filter((block) => /^heading_(1|2|3)/i.test(block.type));

  return (
    <div className={notionColorClasses[block.table_of_contents.color]}>
      {headers.map((header) => {
        const headerBlock = header?.[header?.type] as RichTextObject;
        const title = richTextToPlainText(headerBlock?.rich_text);
        const headingLevel = Number(header.type.match(/^heading_(1|2|3)/)?.[1] || 1);

        return (
          <div
            className='my-1'
            key={header.id}
            style={
              headingLevel !== 1
                ? {
                    paddingLeft: `${(headingLevel - 1) * 1.5}rem`
                  }
                : undefined
            }
          >
            <Link className='underline' href={`#${title}`} prefetch={false} shallow>
              {title}
            </Link>
          </div>
        );
      })}
    </div>
  );
};
