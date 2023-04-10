import type React from 'react';
import type { NotionBlocksRetrieve } from 'src/types/notion';
import classnames from 'classnames';
import { NotionParagraphBlock } from '.';
import { useNotionStore } from 'src/store/notion';

interface TableProps {
  block: NotionBlocksRetrieve;
}

export const Table: React.FC<TableProps> = ({ block }) => {
  const childrensRecord = useNotionStore().childrensRecord;
  // ((state) => state.childrenRecord, shallow);
  const tbodyBlock = childrensRecord?.[block.id];

  if (!block?.table || !tbodyBlock) {
    return null;
  }

  return (
    <div>
      <table
        className={classnames(
          'border-collapse',
          '[&>tbody>tr>td]:border',
          '[&>tbody>tr>td]:border-solid',
          '[&>tbody>tr>td]:border-notion-gray/30',
          '[&>tbody>tr>td]:py-1',
          '[&>tbody>tr>td]:px-2',
          Boolean(block.table.has_row_header) === true &&
            '[&>tbody>tr>td:first-of-type]:bg-notion-gray/50',
          Boolean(block.table.has_column_header) === true &&
            '[&>tbody>tr:first-of-type]:bg-notion-gray/50'
        )}
      >
        {/* <thead>
          <tr>
            {[...new Array(block.table.table_width)].map((i) => (
              <th key={`table-head-th-${i}`}></th>
            ))}
          </tr>
        </thead> */}
        <tbody>
          {tbodyBlock.results.map((rowBlock, rowIdx) => (
            <tr key={`table-row-${rowBlock.id}`}>
              {rowBlock.table_row.cells.map((cellBlocks, cellIdx) => (
                <td key={`table-row-${rowBlock.id}-cell-${cellIdx}`}>
                  <NotionParagraphBlock blockId={rowBlock.id} richText={cellBlocks} />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
