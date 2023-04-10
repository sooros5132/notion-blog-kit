export const URL_PAGE_TITLE_MAX_LENGTH = 100;

export declare type ID = string;

export declare type Code =
  | 'abap'
  | 'arduino'
  | 'bash'
  | 'basic'
  | 'c'
  | 'clojure'
  | 'coffeescript'
  | 'c++'
  | 'c#'
  | 'css'
  | 'dart'
  | 'diff'
  | 'docker'
  | 'elixir'
  | 'elm'
  | 'erlang'
  | 'flow'
  | 'fortran'
  | 'f#'
  | 'gherkin'
  | 'glsl'
  | 'go'
  | 'graphql'
  | 'groovy'
  | 'haskell'
  | 'html'
  | 'java'
  | 'javascript'
  | 'json'
  | 'julia'
  | 'kotlin'
  | 'latex'
  | 'less'
  | 'lisp'
  | 'livescript'
  | 'lua'
  | 'makefile'
  | 'markdown'
  | 'markup'
  | 'matlab'
  | 'mermaid'
  | 'nix'
  | 'objective-c'
  | 'ocaml'
  | 'pascal'
  | 'perl'
  | 'php'
  | 'plain text'
  | 'powershell'
  | 'prolog'
  | 'protobuf'
  | 'python'
  | 'r'
  | 'reason'
  | 'ruby'
  | 'rust'
  | 'sass'
  | 'scala'
  | 'scheme'
  | 'scss'
  | 'shell'
  | 'sql'
  | 'swift'
  | 'typescript'
  | 'vb.net'
  | 'verilog'
  | 'vhdl'
  | 'visual basic'
  | 'webassembly'
  | 'xml'
  | 'yaml'
  | 'java/c/c++/c#';

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
  | 'code'
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

export declare type NotionBlockTypes =
  | 'block'
  | 'page'
  | 'user'
  | 'database'
  | 'property_item'
  | 'page_or_database';

export declare type RichTextType = 'text' | 'mention' | 'equation';

export declare type RichTextAnnotations = {
  bold: boolean;
  italic: boolean;
  strikethrough: boolean;
  underline: boolean;
  code: boolean;
  color: Color;
};

export declare type ChildDatabaseObject = {
  title: string;
};

export declare type RichText = {
  plain_text: string;
  href?: string | null;
  text: {
    content: string;
    link: string | null;
  };
  annotations: RichTextAnnotations;
  type: RichTextType;
};

export declare type RichTextObject = {
  rich_text: Array<RichText>;
  color: Color;
};

export declare type MentionObject = {
  type: 'user' | 'page' | 'database' | 'date' | 'link_preview';
};

export type DateObject = {
  end: string | null;
  start: string | null;
  time_zone: string | null;
};

export type FileObject = {
  type: 'external' | 'file';
  external?: {
    url: string;
  };
  file?: {
    url: string;
    expiry_time: string;
  };
};

export type CaptionObject = {
  caption: Array<RichText>;
};

export type BookmarkObject = {
  caption: Array<RichText>;
  url: string;
};

export type TableObject = {
  table_width: number;
  has_column_header: boolean;
  has_row_header: boolean;
};

export type TableRowObject = {
  cells: Array<Array<RichText>>;
};

export type TodoObject = {
  rich_text: Array<RichText>;
  checked: boolean;
  color: Color;
};

export type CodeBlock = RichTextObject & CaptionObject & { language: Code };
export type CalloutBlock = RichTextObject & { icon: IconObject };
export type EquationBlock = { expression: string };
export type LinkPreviewBlock = { url: string };
export type ImageBlock = FileObject & CaptionObject;
export type VideoBlock = FileObject & CaptionObject;

export interface NotionBlockRetrieveItem extends Record<BlockType, any> {
  paragraph: RichTextObject;
  heading_1: RichTextObject;
  heading_2: RichTextObject;
  heading_3: RichTextObject;
  bulleted_list_item: RichTextObject;
  numbered_list_item: RichTextObject;
  to_do: TodoObject;
  toggle: RichTextObject;
  child_page: RichTextObject;
  child_database: ChildDatabaseObject;
  code: CodeBlock;
  embed: RichTextObject;
  image: ImageBlock;
  video: VideoBlock;
  file: FileObject;
  pdf: RichTextObject;
  bookmark: BookmarkObject;
  callout: CalloutBlock;
  quote: RichTextObject;
  equation: EquationBlock;
  divider: RichTextObject;
  table_of_contents: RichTextObject;
  column: RichTextObject;
  column_list: RichTextObject;
  link_preview: LinkPreviewBlock;
  synced_block: RichTextObject;
  template: RichTextObject;
  link_to_page: RichTextObject;
  table: TableObject;
  table_row: TableRowObject;
  unsupported: RichTextObject;
}

export type Select = {
  id: string;
  name: string;
  color: Color;
};

export type MultiSelect = Array<Select>;

export type UserObject = {
  object: 'user';
  id: string;
};

export type TimeObject = {
  object: string;
  id: string;
};

export type EmojiObject = {
  type: 'emoji';
  emoji: string;
};

export type ParentObject = {
  type: 'workspace' | 'database_id' | 'page_id' | 'block_id';
  workspace?: boolean; // workspace의 경우 Always true.
  database_id?: string;
  page_id?: string;
};

export type IconObject = {
  type: 'emoji' | 'file' | 'external';
  file?: FileObject['file'];
  external?: FileObject['external'];
  emoji?: EmojiObject['emoji'];
};

export type Property = {
  id: string;
  type: PropertyType;
};

export interface DatabasesRetrieveProperties extends Partial<Record<PropertyType | string, any>> {
  title?: Property & {
    title?: Array<RichText>;
  };
  category?: Property & {
    select?: {
      options: Array<Select>;
    };
  };
  tags?: Property & {
    multi_select?: {
      options: MultiSelect;
    };
  };
  publishedAt?: Property & {
    date?: DateObject;
  };
  rank?: Property & {
    number?: number;
  };
  slug?: Property & {
    rich_text?: Array<RichText>;
  };
  // thumbnail?: Property & {
  //   files?: Array<FileObject>;
  // };
  editedAt?: Property & {
    date?: DateObject;
  };
}

export interface PagesRetrieveProperties extends Partial<Record<PropertyType | string, any>> {
  title?: Property & {
    title?: Array<RichText>;
  };
  category?: Property & {
    type?: 'select';
    select?: Select;
  };
  tags?: Property & {
    multi_select?: MultiSelect;
  };
  publishedAt?: Property & {
    date?: DateObject;
  };
  rank?: Property & {
    number?: number;
  };
  slug?: Property & {
    rich_text?: Array<RichText>;
  };
  // thumbnail?: Property & {
  //   files?: Array<FileObject>;
  // };
  editedAt?: Property & {
    date?: DateObject;
  };
}

export type NotionBlocksRetrieve = NotionBlockRetrieveItem & {
  archived: false;
  created_by: UserObject;
  created_time: string;
  has_children: boolean;
  id: ID;
  last_edited_by: UserObject;
  last_edited_time: string;
  object: 'block';
  parent: ParentObject;
  type: BlockType;
};

export type NotionPagesRetrieve = {
  archived: false;
  cover: FileObject;
  created_by: UserObject;
  created_time: string;
  icon: IconObject;
  id: ID;
  last_edited_by: UserObject;
  last_edited_time: string;
  object: 'page';
  parent: ParentObject;
  properties: PagesRetrieveProperties;
  url: string;
};

export type NotionDatabasesRetrieve = {
  archived: false;
  cover: FileObject;
  created_by: UserObject;
  created_time: string;
  description: Array<RichText>;
  icon: IconObject;
  id: ID;
  is_inline?: boolean;
  last_edited_by: UserObject;
  last_edited_time: string;
  object: 'database';
  parent: ParentObject;
  properties: DatabasesRetrieveProperties;
  title: Array<RichText>;
  url: string;
};

export type NotionDatabasesQuery = {
  object: 'list'; // Always "list".
  results: Array<NotionPagesRetrieve>;
  next_cursor?: string | null; // Only available when "has_more" is true.
  has_more: boolean;
  type: NotionBlockTypes;
  page: Record<string, any>;
};

export type NotionUser = {
  object: string;
  id: ID;
  type?: 'person' | 'bot';
  name?: string | null;
  avatar_url?: string | null;
  person?: Record<string, any>;
};

export type NotionBlocksChildren = {
  object: 'list'; // Always "list".
  results: Array<NotionBlocksRetrieve>;
  next_cursor?: string | null; // Only available when "has_more" is true.
  has_more: boolean;
  type: NotionBlockTypes;
  block: Record<string, any>;
};

export type DatabasesRecord = Record<string, NotionDatabasesQuery>;
export type ChildrensRecord = Record<string, NotionBlocksChildren>;

export type NotionPageBlocks = NotionBlocksChildren & {
  databasesRecord: DatabasesRecord;
  childrensRecord: ChildrensRecord;
};

export type NotionDatabaseBlocks = NotionDatabasesQuery & {
  databasesRecord: DatabasesRecord;
  childrensRecord: ChildrensRecord;
};

export type NotionPage = {
  pageInfo: NotionPagesRetrieve;
  block: NotionPageBlocks;
  userInfo?: NotionUser | null;
};

export type NotionDatabase = {
  pageInfo: NotionDatabasesRetrieve;
  block: NotionDatabaseBlocks;
  userInfo?: NotionUser | null;
};

export type GetNotionBlock = {
  pageInfo: NotionPagesRetrieve | NotionDatabasesRetrieve;
  block: NotionPageBlocks | NotionDatabaseBlocks;
  userInfo?: NotionUser | null;
};

export type NotionSearch = {
  object: 'list';
  results: Array<NotionPagesRetrieve | NotionDatabasesRetrieve>;
  next_cursor: string | null;
  has_more: boolean;
  type: 'child_database' | 'child_page' | 'page_or_database';
  page_or_database: Record<string, any>;
  child_database?: {
    title: string;
  };
  child_page?: {
    title: string;
  };
};

export type BlogProperties = {
  categories: Array<{
    id: string;
    name: string;
    color: Color;
    count: number;
  }>;
  tags: Array<{
    id: string;
    color: Color;
    name: string;
  }>;
};

export type BlogArticle = {
  id: string;
  slug: string;
  title: string;
  publishedAt?: DateObject;
  url: string;
};

export type BlogArticleRelation = {
  id: string;
  next: BlogArticle | null;
  prev: BlogArticle | null;
};

export type BlogArticleRelationRecord = Record<ID, BlogArticleRelation>;

export type CachedObject = {
  cachedTime: number;
};

export type CachedNotionPage = CachedObject & NotionPage;

export type CachedNotionDatabase = CachedObject & NotionDatabase;

export type CachedBlogProperties = BlogProperties &
  CachedObject & {
    databaseId: string;
    lastEditedTime: string;
  };

export type CachedBlogArticleRelationRecord = CachedObject & {
  relationRecord: BlogArticleRelationRecord;
  databaseId: string;
  lastEditedTime: string;
};
