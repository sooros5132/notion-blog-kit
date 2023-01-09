import type React from 'react';
import type { NotionBlock } from 'src/types/notion';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/cjs/styles/prism';
import { NotionParagraphBlock } from '.';

interface CodeProps {
  block: NotionBlock;
}

export const Code: React.FC<CodeProps> = ({ block }) => {
  return (
    <>
      <SyntaxHighlighter
        language={block?.code?.language || undefined}
        style={vscDarkPlus}
        lineProps={{ style: { wordBreak: 'break-all', whiteSpace: 'pre-wrap' } }}
      >
        {block?.code?.rich_text?.map((text) => text?.plain_text ?? '').join('')}
      </SyntaxHighlighter>
      {Array.isArray(block?.code?.caption) && block?.code?.caption?.length > 0 && (
        <div className='w-full'>
          <NotionParagraphBlock blockId={block.id} richText={block.code.caption} color={'gray'} />
        </div>
      )}
    </>
  );
};
