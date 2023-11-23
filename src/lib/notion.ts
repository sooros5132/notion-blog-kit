import { richTextToPlainText } from '@/components/notion/lib/utils';
import { siteConfig } from '@/lib/site-config';
import { NotionDatabasesRetrieve } from '@/types/notion';

export const AWS_PUBLIC_NOTION_STATIC =
  'https://s3-us-west-2.amazonaws.com/public.notion-static.com/';
export const PROXY_PUBLIC_NOTION_STATIC = '/aws-public-notion-static';
export const AWS_SECURE_NOTION_STATIC =
  'https://s3.us-west-2.amazonaws.com/secure.notion-static.com';
export const PROXY_SECURE_NOTION_STATIC = '/aws-secure-notion-static';
export const AWS_FILES_SECURE_NOTION_STATIC =
  'https://prod-files-secure.s3.us-west-2.amazonaws.com';
export const PROXY_FILES_SECURE_NOTION_STATIC = '/aws-files-secure-notion-static';
export const REVALIDATE = 120;

export function notionBlockUrlToRelativePath(url: string): string {
  if (!siteConfig?.notion) {
    return url;
  }

  const { customDomain, notionSoRegExp, notionSiteRegExp } = siteConfig.notion;

  if (!url || !customDomain || !notionSoRegExp || !notionSiteRegExp) {
    return url;
  }
  if (notionSoRegExp.test(url)) {
    return url.replace(notionSoRegExp, '/');
  }
  if (notionSiteRegExp.test(url)) {
    return url.replace(notionSiteRegExp, '/');
  }
  return url;
}

export function awsImageObjectUrlToNotionUrl({
  blockId,
  s3ObjectUrl,
  table = 'block'
}: {
  s3ObjectUrl: string;
  blockId: string;
  table?: string;
}) {
  // s3ObjectUrl: https://s3.us-west-2.amazonaws.com/secure.notion-static.com/8f7f9f31-56f7-49c3-a05f-d15ac4a722ca/qemu.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45EIPT3X45%2F20220702%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20220702T053925Z&X-Amz-Expires=3600&X-Amz-Signature=050701d9bc05ec877366b066584240a31a4b5d2459fe6b7f39243e90d479addd&X-Amz-SignedHeaders=host&x-id=GetObject
  // new s3ObjectUrl: https://prod-files-secure.s3.us-west-2.amazonaws.com/bc54e308-b555-4004-9ba3-ac0d3c344f76/66ddaa37-c87a-4c27-8e25-29546f8cd0f3/NJ_GetUp_7.jpeg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45EIPT3X45%2F20231118%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20231118T002025Z&X-Amz-Expires=3600&X-Amz-Signature=cf069020f58ae8f332b6899a53bcce13172ce588e3c176651e2a0fabefa2e5ea&X-Amz-SignedHeaders=host&x-id=GetObject&width=24
  // pageId: 12345678-abcd-1234-abcd-123456789012
  try {
    if (!table || !blockId || !s3ObjectUrl) {
      return s3ObjectUrl;
    }
    const s3Url = new URL(s3ObjectUrl);

    if (!s3Url?.origin?.includes('amazonaws.com')) {
      return s3ObjectUrl;
    }

    let s3Pathname = '';

    if (s3Url?.pathname?.startsWith('/secure.notion-static.com')) {
      s3Pathname =
        AWS_SECURE_NOTION_STATIC + s3Url.pathname.replace(/^\/secure\.notion-static\.com\//, '/');
    }
    if (s3Url?.hostname?.startsWith('prod-files-secure.s3.us-west-2.amazonaws.com')) {
      s3Pathname = AWS_FILES_SECURE_NOTION_STATIC + s3Url.pathname;
    }

    if (!s3Pathname) {
      return s3ObjectUrl;
    }

    return `https://www.notion.so/image/${encodeURIComponent(
      s3Pathname
    )}?table=${table}&id=${blockId}`;
  } catch (e) {
    return s3ObjectUrl;
  }
}

export function getMetadataInPageInfo(pageInfo: NotionDatabasesRetrieve) {
  const title = richTextToPlainText(pageInfo?.title || pageInfo.properties.title?.title)?.trim();
  const description =
    richTextToPlainText(pageInfo?.description?.slice(0, 20))
      ?.replace?.(/\n/gm, '')
      ?.trim?.()
      ?.slice?.(0, 155) || '';

  const icon =
    pageInfo?.icon?.file && pageInfo?.icon?.type === 'file'
      ? awsImageObjectUrlToNotionUrl({
          blockId: pageInfo.id,
          s3ObjectUrl: pageInfo.icon.file.url
        }) + '&width=128'
      : pageInfo?.icon?.emoji && pageInfo?.icon?.type === 'emoji'
      ? `data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>${pageInfo.icon.emoji}</text></svg>`
      : undefined;
  const cover = pageInfo?.cover
    ? pageInfo?.cover?.type === 'external'
      ? pageInfo.cover.external?.url ?? undefined
      : pageInfo?.cover?.type === 'file'
      ? awsImageObjectUrlToNotionUrl({
          blockId: pageInfo.id,
          s3ObjectUrl: pageInfo.cover.file?.url || ''
        }) + '&width=1200'
      : undefined
    : undefined;

  return {
    title,
    description,
    icon,
    cover
  };
}

export const notionTagColorClasses = {
  gray: 'text-notion-tag-gray',
  default: 'text-notion-tag-default',
  brown: 'text-notion-tag-brown',
  orange: 'text-notion-tag-orange',
  yellow: 'text-notion-tag-yellow',
  green: 'text-notion-tag-green',
  blue: 'text-notion-tag-blue',
  purple: 'text-notion-tag-purple',
  pink: 'text-notion-tag-pink',
  red: 'text-notion-tag-red',
  gray_background: 'bg-notion-tag-gray',
  default_background: 'bg-notion-tag-default',
  brown_background: 'bg-notion-tag-brown',
  orange_background: 'bg-notion-tag-orange',
  yellow_background: 'bg-notion-tag-yellow',
  green_background: 'bg-notion-tag-green',
  blue_background: 'bg-notion-tag-blue',
  purple_background: 'bg-notion-tag-purple',
  pink_background: 'bg-notion-tag-pink',
  red_background: 'bg-notion-tag-red'
} as const;

export const notionColorClasses = {
  default: 'text-notion-default',
  gray: 'text-notion-gray',
  brown: 'text-notion-brown',
  orange: 'text-notion-orange',
  yellow: 'text-notion-yellow',
  green: 'text-notion-green',
  blue: 'text-notion-blue',
  purple: 'text-notion-purple',
  pink: 'text-notion-pink',
  red: 'text-notion-red',
  gray_background: 'bg-notion-gray',
  brown_background: 'bg-notion-brown',
  orange_background: 'bg-notion-orange',
  yellow_background: 'bg-notion-yellow',
  green_background: 'bg-notion-green',
  blue_background: 'bg-notion-blue',
  purple_background: 'bg-notion-purple',
  pink_background: 'bg-notion-pink',
  red_background: 'bg-notion-red',
  code: 'text-notion-code',
  code_background: 'bg-notion-code'
} as const;

export const paragraphTextClasses = {
  code: {
    once: `py-[0.0625rem] px-1 font-mono rounded-l rounded-r`,
    first: `py-[0.0625rem] pl-1 font-mono rounded-l`,
    last: `py-[0.0625rem] pr-1 font-mono rounded-r`,
    middle: `py-[0.0625rem] font-mono`
  }
} as const;

export const NEXT_IMAGE_DOMAINS: readonly string[] = [
  'www.notion.so',
  'notion.so',
  's3.us-west-2.amazonaws.com',
  's3-us-west-2.amazonaws.com',
  'prod-files-secure.s3.us-west-2.amazonaws.com'
];
