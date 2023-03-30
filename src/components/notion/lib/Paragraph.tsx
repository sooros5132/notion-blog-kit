import type React from 'react';
import classnames from 'classnames';
import type { ReactNode } from 'react';
import { Fragment } from 'react';
import { notionBlockUrlToRelativePath } from 'src/lib/notion';
import type { Color, RichText } from 'src/types/notion';
import { NotionCopyHeadingLink } from '.';
import Link from 'next/link';

export interface ParagraphTextProps {
  bold?: string;
  italic?: string;
  strikethrough?: string;
  underline?: string;
  code?: 'once' | 'first' | 'last' | 'middle';
  color?: Color;
  children?: ReactNode;
}

export const notionTagColorClasses = {
  gray: 'text-notion-tag-gray dark:text-notion-tag-gray/80',
  default: 'text-notion-tag-default dark:text-notion-tag-default/80',
  brown: 'text-notion-tag-brown dark:text-notion-tag-brown/80',
  orange: 'text-notion-tag-orange dark:text-notion-tag-orange/80',
  yellow: 'text-notion-tag-yellow dark:text-notion-tag-yellow/80',
  green: 'text-notion-tag-green dark:text-notion-tag-green/80',
  blue: 'text-notion-tag-blue dark:text-notion-tag-blue/80',
  purple: 'text-notion-tag-purple dark:text-notion-tag-purple/80',
  pink: 'text-notion-tag-pink dark:text-notion-tag-pink/80',
  red: 'text-notion-tag-red dark:text-notion-tag-red/80',
  gray_background: 'bg-notion-tag-gray',
  default_background: 'bg-notion-tag-default/50 dark:bg-notion-tag-default',
  brown_background: 'bg-notion-tag-brown',
  orange_background: 'bg-notion-tag-orange',
  yellow_background: 'bg-notion-tag-yellow',
  green_background: 'bg-notion-tag-green',
  blue_background: 'bg-notion-tag-blue',
  purple_background: 'bg-notion-tag-purple',
  pink_background: 'bg-notion-tag-pink',
  red_background: 'bg-notion-tag-red'
} as const;

export const notionColorClasses = {
  default: 'text-notion-default',
  gray: 'text-notion-gray',
  brown: 'text-notion-brown',
  orange: 'text-notion-orange',
  yellow: 'text-notion-yellow',
  green: 'text-notion-green',
  blue: 'text-notion-blue',
  purple: 'text-notion-purple',
  pink: 'text-notion-pink',
  red: 'text-notion-red',
  gray_background: 'bg-notion-gray',
  brown_background: 'bg-notion-brown',
  orange_background: 'bg-notion-orange',
  yellow_background: 'bg-notion-yellow',
  green_background: 'bg-notion-green',
  blue_background: 'bg-notion-blue',
  purple_background: 'bg-notion-purple',
  pink_background: 'bg-notion-pink',
  red_background: 'bg-notion-red',
  code: 'text-notion-code',
  code_background: 'bg-notion-code'
} as const;

const paragraphTextClasses = {
  code: {
    once: `py-[0.0625rem] px-1 font-mono rounded-l rounded-r`,
    first: `py-[0.0625rem] pl-1 font-mono rounded-l`,
    last: `py-[0.0625rem] pr-1 font-mono rounded-r`,
    middle: `py-[0.0625rem] font-mono`
  }
} as const;

export const ParagraphText: React.FC<ParagraphTextProps> = ({
  bold,
  code,
  color,
  italic,
  strikethrough,
  underline,
  children
}) => {
  const colorClass =
    color && color !== 'default' && !color.match(/_background$/) && notionColorClasses[color];
  const backgroundClass = color && color.match(/_background$/) && notionColorClasses[color];
  return (
    <span
      className={classnames(
        bold && 'font-bold',
        italic && 'italic',
        strikethrough && 'line-through',
        underline && 'underline',
        code && paragraphTextClasses.code[code],
        code && !colorClass && notionColorClasses['code'],
        code && !backgroundClass && notionColorClasses['code_background'],
        colorClass,
        backgroundClass
      )}
    >
      {children}
    </span>
  );
};

interface ParagraphProps {
  blockId: string;
  richText: Array<RichText>;
  color?: Color;
  annotations?: Partial<RichText['annotations']>;
  headingLink?: string;
}

const Paragraph: React.FC<ParagraphProps> = ({
  blockId,
  richText,
  color,
  annotations: annotationsProps,
  headingLink
}) => {
  if (!Array.isArray(richText)) {
    return null;
  }

  return (
    <div
      className={classnames(
        'break-all',
        'min-h-[1.25em]',
        'p-0.5',
        color && color !== 'default' && !color.match(/_background$/)
          ? notionColorClasses[color]
          : annotationsProps?.color
          ? notionColorClasses['gray']
          : '',
        color && color.match(/_background$/) ? notionColorClasses[color] : ''
      )}
    >
      {richText.map((text, i) => {
        if (text.type === 'mention') {
          return (
            <Fragment key={`block-mention-${blockId}-${i}`}></Fragment>
            // <ParagraphText key={`block-${block.id}-${block.type}-${text.type}-${i}`}>
            //   mention
            // </ParagraphText>
          );
        }

        const {
          type,
          plain_text,
          href,
          annotations: { bold, code, italic, strikethrough, underline, color }
        } = text;

        const prevTextIsCode = code && richText[i - 1]?.annotations.code;
        const nextTextIsCode = code && richText[i + 1]?.annotations.code;

        const annotations: Partial<ParagraphTextProps> = {
          bold: annotationsProps?.bold || bold ? 'bold' : undefined,
          italic: annotationsProps?.italic || italic ? 'italic' : undefined,
          strikethrough:
            annotationsProps?.strikethrough || strikethrough ? 'line-through' : undefined,
          underline: annotationsProps?.underline || underline ? 'underline' : undefined,
          color: color ? color : undefined,
          code: code
            ? !prevTextIsCode && !nextTextIsCode
              ? 'once'
              : !prevTextIsCode && nextTextIsCode
              ? 'first'
              : nextTextIsCode
              ? 'middle'
              : 'last'
            : undefined
        };

        if (href) {
          return (
            <a
              key={`block-anchor-${blockId}-${i}`}
              href={notionBlockUrlToRelativePath(href)}
              rel='noreferrer'
              target='_blank'
            >
              <ParagraphText {...annotations} underline={'underline'}>
                {plain_text}
              </ParagraphText>
            </a>
          );
        }
        return (
          <ParagraphText key={`block-${blockId}-${i}`} {...annotations}>
            {plain_text}
          </ParagraphText>
        );
      })}
      {headingLink && (
        <NotionCopyHeadingLink href={headingLink}>
          <Link href={headingLink}>&nbsp;🔗</Link>
        </NotionCopyHeadingLink>
      )}
    </div>
  );
};

export default Paragraph;
