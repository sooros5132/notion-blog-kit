import axios from 'axios';
import config from 'site-config';
import { awsImageObjectUrlToNotionUrl } from 'src/lib/notion';
import { FileObject, IconObject, INotionSearchObject, NotionBlock } from 'src/types/notion';
import useSWR, { SWRResponse } from 'swr';

export type NotionImageFetcherParams = {
  blockId: string;
  blockType: 'page' | 'database' | 'video' | 'image' | 'callout' | 'file';
  useType: 'image' | 'video' | 'cover' | 'icon' | 'file';
  initialFileObject?: FileObject;
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

export const useRenewExpiredFile = ({
  blockId,
  blockType,
  useType,
  initialFileObject,
  autoRefresh = true,
  refreshInterval = 5 * 60 * 1000 // 5분
}: NotionImageFetcherParams) => {
  // const EXTERNAL_IS_AVAILABLE = 'external is available.';

  return useSWR(
    `${config.path}/notion/${blockType}/${blockId}?useType=${useType}`,
    async () => {
      try {
        if (initialFileObject?.external?.url) {
          return initialFileObject;
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
          case 'file':
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
        // switch (e) {
        //   case EXTERNAL_IS_AVAILABLE: {
        //     return initialFileObject;
        //   }
        // }
        if (blockType === 'video') {
          throw e;
        }

        return {
          type: 'file',
          file: {
            url: awsImageObjectUrlToNotionUrl({
              s3ObjectUrl: initialFileObject?.file?.url || initialFileObject?.external?.url || '',
              blockId,
              table: 'block'
            }),
            expiry_time: ''
          }
        };
      }
    },
    {
      errorRetryCount: 1,
      fallbackData: initialFileObject,
      revalidateOnFocus: false,
      refreshInterval: autoRefresh ? refreshInterval : undefined
    }
  ) as SWRResponse<FileObject & IconObject>;
};
