export declare type ID = string;

export declare type Color =
  | 'default'
  | 'gray'
  | 'brown'
  | 'orange'
  | 'yellow'
  | 'green'
  | 'blue'
  | 'purple'
  | 'pink'
  | 'red'
  | 'gray_background'
  | 'brown_background'
  | 'orange_background'
  | 'yellow_background'
  | 'green_background'
  | 'blue_background'
  | 'purple_background'
  | 'pink_background'
  | 'red_background';
export declare type PropertyType =
  | 'title'
  | 'text'
  | 'number'
  | 'select'
  | 'multi_select'
  | 'date'
  | 'person'
  | 'file'
  | 'checkbox'
  | 'url'
  | 'email'
  | 'phone_number'
  | 'formula'
  | 'relation'
  | 'created_time'
  | 'created_by'
  | 'last_edited_time'
  | 'last_edited_by';
export declare type NumberFormat =
  | 'number_with_commas'
  | 'percent'
  | 'dollar'
  | 'euro'
  | 'pound'
  | 'yen'
  | 'rupee'
  | 'won'
  | 'yuan';
export declare type Role = 'editor' | 'reader' | 'none' | 'read_and_write';
export declare type NotionUser = {
  object: string;
  id: ID;
  type?: 'person' | 'bot';
  name?: string | null;
  avatar_url?: string | null;
};

export declare type BlockType =
  | 'paragraph'
  | 'heading_1'
  | 'heading_2'
  | 'heading_3'
  | 'bulleted_list_item'
  | 'numbered_list_item'
  | 'to_do'
  | 'toggle'
  | 'child_page'
  | 'child_database'
  | 'embed'
  | 'image'
  | 'video'
  | 'file'
  | 'pdf'
  | 'bookmark'
  | 'callout'
  | 'quote'
  | 'equation'
  | 'divider'
  | 'table_of_contents'
  | 'column'
  | 'column_list'
  | 'link_preview'
  | 'synced_block'
  | 'template'
  | 'link_to_page'
  | 'table'
  | 'table_row'
  | 'unsupported';

export declare type RichTextType = 'text' | 'mention' | 'equation';

export declare type RichTextAnnotation = {
  bold: boolean;
  italic: boolean;
  strikethrough: boolean;
  underline: boolean;
  code: boolean;
  color: Color;
};

export declare type RichTextObject = {
  rich_text: Array<RichText>;
  color: Color;
};

export declare type RichTextTitle = {
  title: string;
};

export declare type RichText = {
  plain_text: string;
  href?: string | null;
  text: {
    content: string;
    link: string | null;
  };
  annotations: RichTextAnnotation;
  type: RichTextType;
};
export declare type MentionObject = {
  type: 'user' | 'page' | 'database' | 'date' | 'link_preview';
};

export interface NotionBlockItem extends Record<BlockType, RichTextObject | RichTextTitle> {
  paragraph: RichTextObject;
  heading_1: RichTextObject;
  heading_2: RichTextObject;
  heading_3: RichTextObject;
  bulleted_list_item: RichTextObject;
  numbered_list_item: RichTextObject;
  to_do: RichTextObject;
  toggle: RichTextObject;
  child_page: RichTextObject;
  child_database: RichTextTitle;
  embed: RichTextObject;
  image: RichTextObject;
  video: RichTextObject;
  file: RichTextObject;
  pdf: RichTextObject;
  bookmark: RichTextObject;
  callout: RichTextObject;
  quote: RichTextObject;
  equation: RichTextObject;
  divider: RichTextObject;
  table_of_contents: RichTextObject;
  column: RichTextObject;
  column_list: RichTextObject;
  link_preview: RichTextObject;
  synced_block: RichTextObject;
  template: RichTextObject;
  link_to_page: RichTextObject;
  table: RichTextObject;
  table_row: RichTextObject;
  unsupported: RichTextObject;
}

export interface NotionBlock extends NotionBlockItem {
  object: string;
  id: ID;
  created_time: string;
  last_edited_time: string;
  created_by: NotionUser;
  last_edited_by: NotionUser;
  has_children: boolean;
  archived: boolean;
  type: BlockType;
}

export declare type NotionBlockTypes =
  | 'block'
  | 'page'
  | 'user'
  | 'database'
  | 'property_item'
  | 'page_or_database';

export interface NotionBlocksChildrenList {
  blocksChildrenList: {
    object: 'list'; // Always "list".
    results: Array<NotionBlock>;
    next_cursor?: string | null; // Only available when "has_more" is true.
    has_more: boolean;
    type: NotionBlockTypes;
    block: {};
  };
  databaseBlocks: Record<string, NotionDatabasesQuery>;
}

export interface FileObject {
  type: 'file';
  file: {
    url: string;
    expiry_time: string;
  };
}

export interface ExternalObject {
  type: 'external';
  external: {
    url: string | null;
  };
}

export interface TimeObject {
  object: string;
  id: string;
}

export interface Properties extends Partial<Record<PropertyType | string, any>> {
  id: string;
  type: string;
}

export interface NotionDatabases {
  object: string; // Always "database"
  id: string; // uuid
  created_time: string;
  created_by: TimeObject;
  last_edited_time: string;
  last_edited_by: TimeObject;
  // title?: RichText;
  // description?: RichText;
  icon?: FileObject | null;
  cover?: FileObject | null;
  properties: Properties & {
    created_time?: string;
    multi_select?: any;
    title?: Array<RichText>;
  };
  parent?: {
    type: 'database_id' | string;
    database_id: string;
  };
  url?: string | null;
  archived?: boolean | null;
  is_inline?: boolean | null;
}
export interface NotionDatabasesQuery {
  object: 'list'; // Always "list".
  results: Array<NotionDatabases>;
  next_cursor?: string | null; // Only available when "has_more" is true.
  has_more: boolean;
  type: NotionBlockTypes;
  page: {};
}
export interface EmojiObject {
  type: 'emoji';
  emoji: string;
}

export interface ParentObject {
  type: 'workspace' | 'database_id' | 'page_id';
  workspace?: boolean; // workspace의 경우 Always true.
  database_id?: string;
  page_id?: string;
}

export interface NotionPagesRetrieve {
  object: 'page'; // Always "page"
  id: string;
  created_time: string;
  last_edited_time: string;
  created_by: TimeObject;
  last_edited_by: TimeObject;
  cover: ExternalObject;
  icon: EmojiObject;
  parent: ParentObject;
  archived: false;
  properties: Properties & {
    title: {
      id: 'title';
      type: 'title';
      title: Array<RichText>;
    };
  };
  url: string;
}
