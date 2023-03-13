// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import axios from 'axios';
import type { NextApiRequest, NextApiResponse } from 'next';
import nc from 'next-connect';
import { Error } from 'lib/Error';
import { IResponseSuccess } from 'lib/types/response';
import { parse } from 'node-html-parser';
import type { HTMLElement as ParsedHTMLElement } from 'node-html-parser';
import { LinkPreview } from 'src/types/types';

const handler = nc<NextApiRequest, NextApiResponse>({
  onError: Error.handleError,
  onNoMatch: Error.handleNoMatch
}).get(async (req: NextApiRequest, res: NextApiResponse<IResponseSuccess<LinkPreview>>) => {
  if (typeof req.query.link !== 'string') {
    throw 'type error "link"';
  }

  const link = decodeURIComponent(req.query.link);

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

  res.status(200).json({
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
});

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

export default handler;
