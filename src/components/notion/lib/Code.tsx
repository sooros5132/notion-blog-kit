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
  const { mode } = useThemeStore();

  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  return (
    <>
      <div className='shadow-md rounded-lg overflow-hidden mt-[0.5em]'>
        <div className='flex gap-x-2 items-center p-2 bg-base-content/10 text-[0.8em]'>
          <div className='text-[#FF5F57]'>
            <FaCircle />
          </div>
          <div className='text-[#FFBC2E]'>
            <FaCircle />
          </div>
          <div className='text-[#29C841]'>
            <FaCircle />
          </div>
        </div>
        <div className=' bg-base-content/5'>
          <SyntaxHighlighter
            language={block?.code?.language || undefined}
            style={!isHydrated || mode === 'light' ? prism : vscDarkPlus}
            // style={vscDarkPlus}
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
              },
              className: 'scroll'
            }}
          >
            {block?.code?.rich_text?.map((text) => text?.plain_text ?? '').join('')}
          </SyntaxHighlighter>
        </div>
      </div>
      {Array.isArray(block?.code?.caption) && block?.code?.caption?.length > 0 && (
        <div className='w-full'>
          <NotionParagraphBlock blockId={block.id} richText={block.code.caption} color={'gray'} />
        </div>
      )}
    </>
  );
};
