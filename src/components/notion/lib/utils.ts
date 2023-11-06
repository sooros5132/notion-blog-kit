import { FileObject, IconObject, RichText } from '@/types/notion';

export type NotionImageFetcherParams = {
  blockId: string;
  blockType: 'page' | 'database' | 'video' | 'image' | 'callout' | 'file';
  useType: 'image' | 'video' | 'cover' | 'icon' | 'file';
  initialFileObject?: FileObject | IconObject;
  autoRefresh?: boolean;
  refreshInterval?: number;
};

export function isExpired({ expiry_time, url }: NonNullable<FileObject['file']>) {
  const now = Date.now();
  if (url && expiry_time && new Date(expiry_time).getTime() < now) {
    return true;
  }
  return false;
}

export function richTextToPlainText(richText?: Array<RichText>) {
  if (!Array.isArray(richText)) {
    return '';
  }
  return richText?.map((text) => text.plain_text.trim()).join('') || '';
}
