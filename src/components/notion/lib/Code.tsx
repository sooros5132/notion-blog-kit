'use client';

import type { NotionBlocksRetrieve } from '@/types/notion';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { prism, vscDarkPlus } from 'react-syntax-highlighter/dist/cjs/styles/prism';
import { NotionParagraphBlock } from '.';
import { useEffect, useState } from 'react';
import { FaCircle } from 'react-icons/fa';
import { CopyButtonWrapper } from '@/components/modules/CopyButtonWrapper';
import { useTheme } from 'next-themes';

interface CodeProps {
  block: NotionBlocksRetrieve;
}

export const Code: React.FC<CodeProps> = ({ block }) => {
  const language = block?.code?.language;
  const cantion = block?.code?.caption;
  const { resolvedTheme } = useTheme();

  const [isHydrated, setIsHydrated] = useState(false);

  const codes = block?.code?.rich_text?.map((text) => text?.plain_text ?? '').join('') || '';

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  return (
    <>
      <div className='shadow-md rounded-lg overflow-hidden mt-[0.5em]'>
        <div className='flex justify-between items-center gap-x-2 py-2 px-3 bg-foreground/10 text-xs'>
          <div className='flex items-center gap-x-2'>
            <FaCircle className='text-[#FF5F57]' />
            <FaCircle className='text-[#FFBC2E]' />
            <FaCircle className='text-[#29C841]' />
          </div>
          <div className='text-foreground/70 select-none capitalize'>{language}</div>
        </div>
        <CopyButtonWrapper content={codes}>
          <div className='bg-foreground/5 [&>pre]:scrollbar-hidden'>
            <SyntaxHighlighter
              language={language}
              style={!isHydrated || resolvedTheme === 'dark' ? vscDarkPlus : prism}
              customStyle={{
                fontSize: '1em',
                lineHeight: '1.25em',
                margin: 0,
                fontFamily:
                  'Menlo, Monaco, Consolas, "Andale Mono", "Ubuntu Mono", "Courier New", monospace',
                background: 'none'
              }}
              lineProps={{
                style: { wordBreak: 'break-word', whiteSpace: 'pre-wrap' }
              }}
              codeTagProps={{
                style: {
                  fontSize: '1em',
                  lineHeight: '1.25em'
                }
              }}
            >
              {codes}
            </SyntaxHighlighter>
          </div>
        </CopyButtonWrapper>
      </div>
      {Array.isArray(cantion) && cantion.length > 0 && (
        <div className='w-full'>
          <NotionParagraphBlock blockId={block.id} richText={cantion} color='gray' />
        </div>
      )}
    </>
  );
};
