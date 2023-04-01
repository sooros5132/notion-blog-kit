import type React from 'react';
import { BsLink45Deg } from 'react-icons/bs';
import { AWS_SECURE_NOTION_STATIC, PROXY_SECURE_NOTION_STATIC } from 'src/lib/notion';
import type { NotionBlock } from 'src/types/notion';

interface FileProps {
  block: NotionBlock;
}

export const File: React.FC<FileProps> = ({ block }) => {
  const file = block.file;
  const fileType = file.type;
  const fileUrl = file.file?.url || file.external?.url;
  const filename =
    fileType === 'file'
      ? file.file?.url?.match(/(notion-static.com\/[-0-9a-z]+\/)(.+)(\?)/)?.[2] || null
      : null;
  const proxyFileUrl =
    fileUrl && fileUrl?.includes(AWS_SECURE_NOTION_STATIC)
      ? fileUrl.replace(AWS_SECURE_NOTION_STATIC, PROXY_SECURE_NOTION_STATIC)
      : null;

  return (
    <div>
      <a
        href={proxyFileUrl || fileUrl}
        rel='noreferrer'
        target='_blank'
        download={fileType === 'file' ? filename || undefined : undefined}
        className='inline-flex items-center gap-x-0.5 px-1.5 rounded-md bg-base-content/10 hover:bg-base-content/20'
      >
        <BsLink45Deg className='text-[1.2em]' />
        {decodeURIComponent(filename || 'File')}
      </a>
    </div>
  );
};
