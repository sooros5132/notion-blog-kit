import axios from 'axios';
import { parse } from 'node-html-parser';
import type { HTMLElement as ParsedHTMLElement } from 'node-html-parser';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const urlObject = new URL(request.url);
  const searchParams = urlObject.searchParams;
  const _link = searchParams.get('link')?.trim?.();

  if (typeof _link !== 'string') {
    throw 'type error "link"';
  }

  const link = decodeURIComponent(_link);

  const head = await axios
    .get(link)
    .then((res) => {
      const head = parse(res.data).querySelector('head');
      if (typeof res.data === 'string' && head) return head;

      throw `request error "${link}"`;
    })
    .catch(() => {
      throw `request error "${link}"`;
    });

  const icon = getIcon(head);
  const title = getTitle(head);
  const description = getDescription(head);
  const image = getOpenGraphImage(head);
  const username = getUserName(head);
  const type = getOpenGraphType(head);
  const media = getOpenGraphMedia(head);

  return NextResponse.json({
    success: true,
    result: {
      icon,
      title,
      description,
      type,
      image,
      media,
      username
    }
  });
}

function getIcon(html: ParsedHTMLElement) {
  {
    const iconHref = html.querySelector('link[rel~=icon]')?.getAttribute('href');
    if (iconHref) {
      return iconHref;
    }
  }
  {
    const metaContent = html.querySelector('meta[property=og:icon]')?.getAttribute('content');
    if (metaContent) {
      return metaContent;
    }
  }

  return null;
}

function getTitle(html: ParsedHTMLElement) {
  {
    const title = html.querySelector('title')?.textContent;
    if (title) {
      return title;
    }
  }
  {
    const metaContent = html.querySelector('meta[property=og:title]')?.getAttribute('content');
    if (metaContent) {
      return metaContent;
    }
  }

  return null;
}

function getDescription(html: ParsedHTMLElement) {
  {
    const metaDescriptionContent = html
      .querySelector('meta[name=description]')
      ?.getAttribute('content');
    if (metaDescriptionContent) {
      return metaDescriptionContent;
    }
  }
  {
    const metaContent = html
      .querySelector('meta[property=og:description]')
      ?.getAttribute('content');
    if (metaContent) {
      return metaContent;
    }
  }

  return null;
}

function getOpenGraphImage(html: ParsedHTMLElement) {
  return {
    url: html.querySelector('meta[property=og:image]')?.getAttribute('content') ?? null,
    alt: html.querySelector('meta[property=og:image:alt]')?.getAttribute('content') ?? null
  };
}

function getOpenGraphType(html: ParsedHTMLElement) {
  return html.querySelector('meta[property=og:type]')?.getAttribute('content') ?? null;
}

function getUserName(html: ParsedHTMLElement) {
  return html.querySelector('meta[property=profile:username]')?.getAttribute('content') ?? null;
}

function getOpenGraphMedia(html: ParsedHTMLElement) {
  return html.querySelector('meta[property=og:media:url]')?.getAttribute('content') ?? null;
}
