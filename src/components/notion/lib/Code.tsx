import type React from 'react';
import type { NotionBlock } from 'src/types/notion';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { prism, vscDarkPlus } from 'react-syntax-highlighter/dist/cjs/styles/prism';
import { NotionParagraphBlock } from '.';
import { useThemeStore } from 'src/store/theme';
import { useEffect, useState } from 'react';
import { FaCircle } from 'react-icons/fa';

interface CodeProps {
  block: NotionBlock;
}

export const Code: React.FC<CodeProps> = ({ block }) => {
  const language = block?.code?.language;
  const cantion = block?.code?.caption;
  const codes = block?.code?.rich_text;
  const { mode } = useThemeStore();

  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  return (
    <>
      <div className='shadow-md rounded-lg overflow-hidden mt-[0.5em]'>
        <div className='flex justify-between items-center gap-x-2 py-2 px-3 bg-base-content/10 text-xs'>
          <div className='flex items-center gap-x-2'>
            <FaCircle className='text-[#FF5F57]' />
            <FaCircle className='text-[#FFBC2E]' />
            <FaCircle className='text-[#29C841]' />
          </div>
          <div className='text-base-content/70 select-none'>{language}</div>
        </div>
        <div className=' bg-base-content/5 [&>pre]:scrollbar-hidden'>
          <SyntaxHighlighter
            language={language}
            style={!isHydrated || mode === 'dark' ? vscDarkPlus : prism}
            customStyle={{
              fontSize: '1em',
              lineHeight: '1.25em',
              margin: 0,
              fontFamily:
                'Menlo, Monaco, Consolas, "Andale Mono", "Ubuntu Mono", "Courier New", monospace',
              background: 'none'
            }}
            lineProps={{
              style: { wordBreak: 'break-all', whiteSpace: 'pre-wrap' }
            }}
            codeTagProps={{
              style: {
                fontSize: '1em',
                lineHeight: '1.25em'
              }
            }}
          >
            {codes?.map((text) => text?.plain_text ?? '').join('')}
          </SyntaxHighlighter>
        </div>
      </div>
      {Array.isArray(cantion) && cantion.length > 0 && (
        <div className='w-full'>
          <NotionParagraphBlock blockId={block.id} richText={cantion} color='gray' />
        </div>
      )}
    </>
  );
};
