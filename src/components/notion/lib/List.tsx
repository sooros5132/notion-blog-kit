import type { ChildrensRecord, DatabasesRecord, NotionBlocksRetrieve } from '@/types/notion';
import { NotionHasChildrenRender, NotionParagraphBlock } from '.';

interface ListProps {
  block: NotionBlocksRetrieve;
  children?: React.ReactNode;
  startValue?: number;
  childrensRecord: ChildrensRecord;
  databasesRecord: DatabasesRecord;
}

export const List: React.FC<ListProps> = ({
  block,
  startValue,
  childrensRecord,
  databasesRecord
}) => {
  const LIST_TYPE = block.type as 'bulleted_list_item' | 'numbered_list_item';
  const ListTagName = LIST_TYPE === 'numbered_list_item' ? 'ol' : 'ul';

  return (
    <ListTagName className='list-style-type pl-6'>
      <li value={startValue}>
        <NotionHasChildrenRender
          noLeftPadding
          block={block}
          childrensRecord={childrensRecord}
          databasesRecord={databasesRecord}
        >
          <NotionParagraphBlock
            blockId={block.id}
            richText={block[LIST_TYPE]?.rich_text}
            color={block[LIST_TYPE]?.color}
          />
        </NotionHasChildrenRender>
      </li>
    </ListTagName>
  );
};
