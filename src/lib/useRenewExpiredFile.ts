'use client';

import { type NotionImageFetcherParams, isExpired } from '@/components/notion/lib/utils';
import type {
  NotionDatabasesRetrieve,
  NotionPagesRetrieve,
  NotionBlocksRetrieve,
  FileObject,
  IconObject
} from '@/types/notion';
import axios from 'axios';
import useSWR from 'swr';
import { awsImageObjectUrlToNotionUrl } from './notion';
import { siteConfig } from './site-config';

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
    `${siteConfig.path}/notion/${blockType}/${blockId}?useType=${useType}`,
    async (): Promise<FileObject | IconObject> => {
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
              .get<NotionDatabasesRetrieve | NotionPagesRetrieve>(
                `${siteConfig.path}/notion/${blockType}s/${blockId}`
              )
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
            if (!['image', 'video', 'icon', 'file'].includes(useType)) {
              throw 'not support use type';
            }
            const block = await axios
              .get<NotionBlocksRetrieve>(`${siteConfig.path}/notion/blocks/${blockId}`)
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
  );
};
