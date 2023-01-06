import classnames from 'classnames';
import type { ReactNode } from 'react';
import { Fragment } from 'react';
import { notionBlockUrlToRelativePath } from 'src/lib/notion';
import type { Color, RichText } from 'src/types/notion';
import { NotionCopyHeadingLink } from '.';

export interface ParagraphTextProps {
  bold?: string;
  italic?: string;
  strikethrough?: string;
  underline?: string;
  code?: 'once' | 'first' | 'last' | 'middle';
  color?: Color;
  children?: ReactNode;
}

const paragraphTextClasses = {
  code: {
    once: 'rounded-l rounded-r py-[0.0625rem] px-1 bg-notionColor-red_background font-mono',
    first: 'rounded-l py-[0.0625rem] pl-1 bg-notionColor-red_background font-mono',
    last: 'rounded-r py-[0.0625rem] pr-1 bg-notionColor-red_background font-mono',
    middle: 'py-[0.0625rem] bg-notionColor-red_background font-mono'
  }
} as const;

export const notionColorClasses = {
  default: 'text-notionColor-default',
  gray: 'text-notionColor-gray',
  brown: 'text-notionColor-brown',
  orange: 'text-notionColor-orange',
  yellow: 'text-notionColor-yellow',
  green: 'text-notionColor-green',
  blue: 'text-notionColor-blue',
  purple: 'text-notionColor-purple',
  pink: 'text-notionColor-pink',
  red: 'text-notionColor-red',
  gray_background: 'bg-notionColor-gray_background',
  brown_background: 'bg-notionColor-brown_background',
  orange_background: 'bg-notionColor-orange_background',
  yellow_background: 'bg-notionColor-yellow_background',
  green_background: 'bg-notionColor-green_background',
  blue_background: 'bg-notionColor-blue_background',
  purple_background: 'bg-notionColor-purple_background',
  pink_background: 'bg-notionColor-pink_background',
  red_background: 'bg-notionColor-red_background'
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
  return (
    <span
      className={classnames(
        bold && 'font-bold',
        italic && 'italic',
        strikethrough && 'line-through',
        underline && 'underline',
        code && paragraphTextClasses.code[code],
        color && color !== 'default' && !color.match(/_background$/) && notionColorClasses[color],
        color && color.match(/_background$/) && notionColorClasses[color]
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
              className='underline'
              key={`block-anchor-${blockId}-${i}`}
              href={notionBlockUrlToRelativePath(href)}
              rel='noreferrer'
              target='_blank'
            >
              <ParagraphText {...annotations}>{plain_text}</ParagraphText>
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
          <a href={headingLink}>&nbsp;🔗</a>
        </NotionCopyHeadingLink>
      )}
    </div>
  );
};

export default Paragraph;
