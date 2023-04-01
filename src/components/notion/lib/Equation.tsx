import type React from 'react';
import type { NotionBlock } from 'src/types/notion';
import katex from 'katex';
import { BiCopy } from 'react-icons/bi';
import { copyTextAtClipBoard } from 'src/lib/utils';

interface EquationProps {
  block: NotionBlock;
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
  const handleClickCopyButton = () => {
    copyTextAtClipBoard(expression);
  };

  if (katexError || !katexRendered) {
    return <div>{expression}</div>;
  }

  return (
    <div className='group relative py-3 rounded-md hover:bg-base-content/10'>
      <div dangerouslySetInnerHTML={{ __html: katexRendered }} />
      <button
        className='btn btn-xs absolute top-1 right-1 bg-base-content/20 border-none text-base-content cursor-pointer invisible hover:bg-base-content/30 group-hover:visible'
        onClick={handleClickCopyButton}
      >
        <BiCopy />
      </button>
    </div>
  );
};
