import type { AppProps } from 'next/app';
import { NextSeo } from 'next-seo';
import Head from 'next/head';
import Layout from 'src/components/Layout';
import Script from 'next/script';
import config from 'site-config';
import 'src/styles/globals.css';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <NextSeo
        title={config.infomation.nickname}
        defaultTitle={config.infomation.nickname}
        openGraph={{
          site_name: config.infomation.nickname,
          title: config.infomation.nickname,
          locale: 'ko_KR',
          type: 'website',
          url: config.origin,
          description: 'notion blog 플랫폼입니다.'
        }}
        description='notion blog 플랫폼입니다.'
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
      {config.googleGTag && (
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${config.googleGTag}`}
          strategy='beforeInteractive'
        />
      )}
      {config.googleGTag && (
        <Script id='google-analytics' strategy='afterInteractive'>
          {`window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  
  gtag('config', '${config.googleGTag}');`}
        </Script>
      )}
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </>
  );
}

export default MyApp;
