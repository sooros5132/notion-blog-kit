import type React from 'react';
import classnames from 'classnames';
import type { NotionBlock } from 'src/types/notion';
import { NotionParagraphBlock } from '.';
import { useNotionStore } from 'src/store/notion';

interface TableProps {
  block: NotionBlock;
}

const Table: React.FC<TableProps> = ({ block }) => {
  const childrenRecord = useNotionStore.getState().childrenRecord;
  // ((state) => state.childrenRecord, shallow);
  const tbodyBlock = childrenRecord[block.id];

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
          '[&>tbody>tr>td]:border-notionColor-gray',
          '[&>tbody>tr>td]:py-1',
          '[&>tbody>tr>td]:px-2',
          Boolean(block.table.has_row_header) === true &&
            '[&>tbody>tr>td:first-of-type]:bg-notionColor-gray/30',
          Boolean(block.table.has_column_header) === true &&
            '[&>tbody>tr:first-of-type]:bg-notionColor-gray/30'
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
