'use client';

import type { ReactNode } from 'react';
import {
  notionBlockUrlToRelativePath,
  notionColorClasses,
  paragraphTextClasses
} from '@/lib/notion';
import type { Color, RichText } from '@/types/notion';
import { NotionCopyHeadingLink } from '.';
import Link from 'next/link';
import { FiArrowUpRight } from 'react-icons/fi';
import { cn } from '@/lib/utils';

export interface ParagraphTextProps {
  bold?: string;
  italic?: string;
  strikethrough?: string;
  underline?: string;
  code?: 'once' | 'first' | 'last' | 'middle';
  color?: Color;
  children?: ReactNode;
}

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

  const decorationClass = [];
  if (strikethrough) decorationClass.push('line-through');
  if (underline) decorationClass.push('underline');

  return (
    <span
      style={
        // line-through, underline를 동시에 쓰기 위해 style로 변경
        decorationClass.length > 0
          ? {
              textDecorationLine: decorationClass.join(' ')
            }
          : undefined
      }
      className={cn(
        bold && 'font-bold',
        italic && 'italic',
        // strikethrough && 'line-through',
        // underline && 'underline',
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

export const Paragraph: React.FC<ParagraphProps> = ({
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
      className={cn(
        'break-words',
        color && color !== 'default' && !color.match(/_background$/)
          ? notionColorClasses[color]
          : annotationsProps?.color
          ? notionColorClasses['gray']
          : '',
        color && color.match(/_background$/) ? notionColorClasses[color] : ''
      )}
    >
      {richText.map((text, i) => {
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
        if (text.type === 'mention') {
          return (
            <a
              key={`block-anchor-${blockId}-${i}`}
              className='inline-flex items-center bg-foreground/5 rounded-md px-1'
              href={href ? notionBlockUrlToRelativePath(href) : undefined}
              rel='noreferrer'
              target='_blank'
            >
              <FiArrowUpRight />
              <ParagraphText {...annotations} underline={'underline'}>
                {plain_text}
              </ParagraphText>
            </a>
          );
        }
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
          <Link href={headingLink} shallow>
            &nbsp;🔗
          </Link>
        </NotionCopyHeadingLink>
      )}
    </div>
  );
};
