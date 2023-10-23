'use client';

import type { NotionBlocksRetrieve } from '@/types/notion';
import katex from 'katex';
import { CopyButtonWrapper } from '@/components/modules/CopyButtonWrapper';

interface EquationProps {
  block: NotionBlocksRetrieve;
}

export const Equation: React.FC<EquationProps> = ({ block }) => {
  const expression = block.equation.expression;
  let katexRendered: string | undefined;
  let katexError = false;
  try {
    katexRendered = katex.renderToString(expression, {
      displayMode: true,
      output: 'mathml'
    });
  } catch (e) {
    katexError = true;
  }

  if (katexError || !katexRendered) {
    return <div>{expression}</div>;
  }

  return (
    <CopyButtonWrapper content={expression}>
      <div className='py-3 rounded-md text-lg group-hover:bg-foreground/5'>
        <div dangerouslySetInnerHTML={{ __html: katexRendered }} />
      </div>
    </CopyButtonWrapper>
  );
};
