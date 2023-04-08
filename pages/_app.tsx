import type React from 'react';
import type { AppProps } from 'next/app';
import { NextSeo } from 'next-seo';
import Head from 'next/head';
import Layout from 'src/components/Layout';
import Script from 'next/script';
import { siteConfig } from 'site-config';
import 'src/styles/globals.css';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <NextSeo
        title={siteConfig.infomation.blogname}
        defaultTitle={siteConfig.infomation.blogname}
        openGraph={{
          site_name: siteConfig.infomation.blogname,
          title: siteConfig.infomation.blogname,
          locale: 'ko_KR',
          type: 'website',
          description: siteConfig.infomation.blogname
            ? `${siteConfig.infomation.blogname}의 블로그입니다.`
            : 'notion blog 플랫폼입니다.'
        }}
        description={
          siteConfig.infomation.blogname
            ? `${siteConfig.infomation.blogname}의 블로그입니다.`
            : 'notion blog 플랫폼입니다.'
        }
      />
      <Head>
        <meta
          name='viewport'
          content='width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0'
        />
        <link rel='manifest' href='/manifest.json' />
      </Head>
      {siteConfig.googleGTag && (
        <Script src={`https://www.googletagmanager.com/gtag/js?id=${siteConfig.googleGTag}`} />
      )}
      {siteConfig.googleGTag && (
        <Script id='google-analytics' strategy='afterInteractive'>
          {`window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  
  gtag('config', '${siteConfig.googleGTag}');`}
        </Script>
      )}
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </>
  );
}

export default MyApp;
