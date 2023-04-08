import { siteConfig } from 'site-config';

export const AWS_PUBLIC_NOTION_STATIC =
  'https://s3-us-west-2.amazonaws.com/public.notion-static.com';
export const PROXY_PUBLIC_NOTION_STATIC = '/aws-public-notion-static/';
export const AWS_SECURE_NOTION_STATIC =
  'https://s3.us-west-2.amazonaws.com/secure.notion-static.com/';
export const PROXY_SECURE_NOTION_STATIC = '/aws-secure-notion-static/';

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
  // pageId: 12345678-abcd-1234-abcd-123456789012
  try {
    if (!table || !blockId || !s3ObjectUrl) {
      return s3ObjectUrl;
    }
    const s3Url = new URL(s3ObjectUrl);

    if (
      !s3Url?.origin?.includes('amazonaws.com') ||
      !s3Url?.pathname?.includes('secure.notion-static.com')
    ) {
      return s3ObjectUrl;
    }

    const s3FileUuid = s3Url.pathname.replace(/^\/secure\.notion-static\.com\//, '');

    if (!s3FileUuid) {
      return s3ObjectUrl;
    }

    return `https://www.notion.so/image/${encodeURIComponent(
      AWS_SECURE_NOTION_STATIC + s3FileUuid
    )}?table=${table}&id=${blockId}`;
  } catch (e) {
    return s3ObjectUrl;
  }
}
