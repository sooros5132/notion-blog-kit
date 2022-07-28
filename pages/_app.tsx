import type { AppProps } from 'next/app';
import axios from 'axios';
import { NextSeo } from 'next-seo';
import Head from 'next/head';
import Layout from 'src/components/Layout';
import { CommonCustomTheme } from 'src/styles/CommomTheme';
import Script from 'next/script';
import config from 'site-setting';

declare module '@mui/material/styles' {
  interface Theme {
    font: typeof CommonCustomTheme.font;
    size: typeof CommonCustomTheme.size;
    color: typeof CommonCustomTheme.color;
    mediaQuery: typeof CommonCustomTheme.mediaQuery;
  }
  interface ThemeOptions {
    font?: typeof CommonCustomTheme.font;
    size?: typeof CommonCustomTheme.size;
    color?: typeof CommonCustomTheme.color;
    mediaQuery?: typeof CommonCustomTheme.mediaQuery;
  }
}

axios.defaults.baseURL = config.origin;
axios.defaults.withCredentials = true;

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <NextSeo
        title='soolog'
        defaultTitle='soolog'
        openGraph={{
          site_name: 'soolog',
          title: 'soolog',
          locale: 'ko_KR',
          type: 'website',
          url: config.origin,
          description: 'sooros 블로그입니다.'
        }}
        description='sooros 블로그입니다.'
      />
      <Head>
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        {/* <link rel='apple-touch-icon' sizes='57x57' href='/apple-icon-57x57.png' />
        <link rel='apple-touch-icon' sizes='60x60' href='/apple-icon-60x60.png' />
        <link rel='apple-touch-icon' sizes='72x72' href='/apple-icon-72x72.png' />
        <link rel='apple-touch-icon' sizes='76x76' href='/apple-icon-76x76.png' />
        <link rel='apple-touch-icon' sizes='114x114' href='/apple-icon-114x114.png' />
        <link rel='apple-touch-icon' sizes='120x120' href='/apple-icon-120x120.png' />
        <link rel='apple-touch-icon' sizes='144x144' href='/apple-icon-144x144.png' />
        <link rel='apple-touch-icon' sizes='152x152' href='/apple-icon-152x152.png' />
        <link rel='apple-touch-icon' sizes='180x180' href='/apple-icon-180x180.png' />
        <link rel='icon' type='image/png' sizes='192x192' href='/android-icon-192x192.png' />
        <link rel='icon' type='image/png' sizes='32x32' href='/favicon-32x32.png' />
        <link rel='icon' type='image/png' sizes='96x96' href='/favicon-96x96.png' />
        <link rel='icon' type='image/png' sizes='16x16' href='/favicon-16x16.png' />
        <meta name='msapplication-TileImage' content='/ms-icon-144x144.png' /> */}
        <link rel='manifest' href='/manifest.json' />
        <meta name='msapplication-TileColor' content='#151a19' />
        <meta name='theme-color' content='#151a19' />
      </Head>
      <Script
        src='https://www.googletagmanager.com/gtag/js?id=G-ERREE02BX9'
        strategy='beforeInteractive'
      />
      <Script id='google-analytics' strategy='afterInteractive'>
        {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());

gtag('config', 'G-ERREE02BX9');`}
      </Script>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </>
  );
}

export default MyApp;
