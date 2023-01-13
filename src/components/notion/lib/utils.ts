import axios from 'axios';
import config from 'site-config';
import { awsImageObjectUrlToNotionUrl } from 'src/lib/notion';
import { BlockType, FileObject, INotionSearchObject, NotionBlock } from 'src/types/notion';
import useSWR from 'swr';

export type NotionImageFetcherParams = {
  blockId: string;
  blockType: 'page' | 'database' | 'video' | 'image' | 'callout';
  useType: 'image' | 'video' | 'cover' | 'icon';
  initialFileObject?: FileObject;
};

function isExpired({ expiry_time, url }: NonNullable<FileObject['file']>) {
  const now = Date.now();
  if (!url && !expiry_time && Date.parse(expiry_time) < now) {
    return true;
  }
  return false;
}

export const useRenewExpiredFile = ({
  blockId,
  blockType,
  useType,
  initialFileObject
}: NotionImageFetcherParams): FileObject | undefined => {
  const fileObject = useSWR(
    `${config.path}/notion/${blockType}/${blockId}?useType=${useType}`,
    async () => {
      try {
        if (initialFileObject?.external?.url) {
          throw 'external is available.';
        }

        if (
          initialFileObject?.file?.url &&
          initialFileObject?.file?.expiry_time &&
          !isExpired(initialFileObject.file)
        ) {
          return initialFileObject;
        }
        switch (blockType) {
          case 'database':
          case 'page': {
            if (useType !== 'cover' && useType !== 'icon') {
              throw 'not support use type';
            }
            const page = await axios
              .get<INotionSearchObject>(`${config.path}/notion/${blockType}s/${blockId}`)
              .then((res) => res?.data);

            if (!page[useType]) {
              throw 'not support use type';
            }
            return page[useType];
          }
          case 'video':
          case 'callout':
          case 'image': {
            if (useType !== 'image' && useType !== 'video' && useType !== 'icon') {
              throw 'not support use type';
            }
            const block = await axios
              .get<NotionBlock>(`${config.path}/notion/blocks/${blockId}`)
              .then((res) => res?.data);

            if (blockType === 'callout') {
              return block.callout.icon;
            }
            return block?.[blockType];
          }
        }
      } catch (e) {
        const fileObject = initialFileObject as any;
        return {
          file: {
            url: awsImageObjectUrlToNotionUrl({
              blockId: blockId,
              s3ObjectUrl:
                fileObject?.file?.url ||
                fileObject?.external?.url ||
                fileObject?.icon?.file?.url ||
                fileObject?.icon?.url ||
                ''
            }),
            expiry_time: ''
          }
        };
      }
    },
    {
      fallbackData: initialFileObject,
      revalidateOnFocus: false,
      refreshInterval: 5 * 60 * 1000 // 5분
    }
  );
  return fileObject.data as FileObject;
};
