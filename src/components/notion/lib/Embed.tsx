'use client';

import type { NotionBlocksRetrieve } from '@/types/notion';
import { NotionParagraphBlock } from '.';
import { NoSsrWrapper } from '@/components/modules/NoSsrWrapper';

interface EmbedProps {
  block: NotionBlocksRetrieve;
}

export function Embed({ block }: EmbedProps) {
  return (
    <div className='my-2'>
      <NoSsrWrapper>
        <EmbedInner block={block} />
      </NoSsrWrapper>
      <div>
        <NotionParagraphBlock blockId={block.id} richText={block.embed.caption} color={'gray'} />
      </div>
    </div>
  );
}

function EmbedInner({ block }: EmbedProps) {
  try {
    const embed = block.embed;
    const url = new URL(embed.url);
    const domain = url.hostname.replace(/^www./i, '');

    switch (domain) {
      case 'open.spotify.com': {
        return <SpotifyEmbed url={url} />;
      }
      case 'google.com': {
        if (url?.search && url.pathname.startsWith('/maps')) {
          return <GoogleMapsEmbed url={url} />;
        }
        throw 'not supported';
      }
      case 'x.com':
      case 'twitter.com': {
        return (
          <div className='flex justify-center'>
            <TwitterEmbed url={url} />
          </div>
        );
      }
      case 'iframely.typeform.com':
      case 'template.typeform.com':
      case 'form.typeform.com':
      case 'typeform.com': {
        return <TypeformEmbed url={url} />;
      }
      default: {
        throw 'not supported';
      }
    }
  } catch (e) {
    return (
      <div className='p-3 border border-foreground/10 rounded-md'>
        <a className='text-sm hover:underline' href={block.embed.url}>
          {block.embed.url}
        </a>
        <div className='text-right text-xs text-foreground/70'>
          This URL does not support embed.
        </div>
      </div>
    );
  }
}

function SpotifyEmbed({ url }: { url: URL }) {
  return (
    <iframe
      className='rounded-xl'
      width='100%'
      height='352'
      src={`https://open.spotify.com/embed${url.pathname}${url.search}`}
      allow='autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture'
      loading='lazy'
    />
  );
}

function GoogleMapsEmbed({ url }: { url: URL }) {
  return (
    <iframe
      className='w-full h-72 sm:h-96'
      src={`https://maps.google.com${url.pathname}${url.search}${
        url.search ? '&output=embed' : '?output=embed'
      }`}
      width='100%'
      loading='lazy'
    />
  );
}

function TwitterEmbed({ url: _url }: { url: URL }) {
  const url = new URL(_url, 'https://twitter.com/');

  return (
    <>
      <blockquote className='twitter-tweet'>
        <a target='_blank' href={url.href} />
      </blockquote>
      <script async src='https://platform.twitter.com/widgets.js'></script>
    </>
  );
}

function TypeformEmbed({ url: _url }: { url: URL }) {
  const newURL = new URL(_url, 'https://form.typeform.com');

  return (
    <iframe
      className='w-full min-h-[500px]'
      src={newURL.href}
      allowFullScreen
      allow='encrypted-media;'
      loading='lazy'
    />
  );
}
