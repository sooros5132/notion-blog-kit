'use client';

import type { NotionBlocksRetrieve } from '@/types/notion';
import { NotionParagraphBlock } from '.';
import { NoSsrWrapper } from '@/components/modules/NoSsrWrapper';
import { memo } from 'react';
import isEqual from 'react-fast-compare';

interface EmbedProps {
  block: NotionBlocksRetrieve;
}

export function Embed({ block }: EmbedProps) {
  return (
    <div className='my-2'>
      <NoSsrWrapper>
        <EmbedInner block={block} />
      </NoSsrWrapper>
      <NotionParagraphBlock blockId={block.id} richText={block.embed.caption} color={'gray'} />
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
          <div className='flex justify-center [&>.twitter-tweet>iframe]:rounded-xl'>
            <TwitterEmbed href={url.href} />
          </div>
        );
      }
      case 'iframely.typeform.com':
      case 'template.typeform.com':
      case 'form.typeform.com':
      case 'typeform.com': {
        return <TypeformEmbed url={url} />;
      }
      case 'instagram.com': {
        return (
          <div className='flex justify-center'>
            <InstagramEmbed href={url.href} />
          </div>
        );
      }
      case 'maps.app.goo.gl':
      default: {
        throw 'not supported';
      }
    }
  } catch (e) {
    if (!block?.embed?.url) {
      return <></>;
    }

    return (
      <a className='text-sm group' href={block.embed.url}>
        <div className='p-3 border border-foreground/10 rounded-md'>
          <span className='group-hover:underline'>{block.embed.url}</span>
          <div className='text-right text-xs text-foreground/70'>
            This URL does not support embed.
          </div>
        </div>
      </a>
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

const TwitterEmbed = memo(function ({ href: _href }: { href: string }) {
  const url = new URL(_href, 'https://twitter.com/');

  return (
    <>
      <blockquote className='twitter-tweet' data-dnt='true'>
        <a target='_blank' rel='noreferrer' href={url.href} />
      </blockquote>
      <script async src='https://platform.twitter.com/widgets.js'></script>
    </>
  );
}, isEqual);
TwitterEmbed.displayName = 'TwitterEmbed';

const InstagramEmbed = memo(function ({ href }: { href: string }) {
  return (
    <>
      <blockquote
        className='instagram-media'
        data-instgrm-captioned
        data-instgrm-permalink={href}
        data-instgrm-version='14'
      />
      <script async src='https://www.instagram.com/embed.js' />
    </>
  );
}, isEqual);
InstagramEmbed.displayName = 'InstagramEmbed';
