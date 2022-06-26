import type { AppProps } from 'next/app';
import axios from 'axios';
import { NextSeo } from 'next-seo';
import Head from 'next/head';
import Layout from 'src/components/Layout';
import { CommonCustomTheme } from 'src/styles/CommomTheme';

declare module '@mui/material/styles' {
  interface Theme {
    size: typeof CommonCustomTheme.size;
    color: typeof CommonCustomTheme.color;
    mediaQuery: typeof CommonCustomTheme.mediaQuery;
  }
  interface ThemeOptions {
    size?: typeof CommonCustomTheme.size;
    color?: typeof CommonCustomTheme.color;
    mediaQuery?: typeof CommonCustomTheme.mediaQuery;
  }
}
declare module '@mui/material/Button' {
  interface ButtonPropsVariantOverrides {
    containedGray: true;
    outlinedGray: true;
    textGray: true;
    containedDisable: true;
    outlinedDisable: true;
    textDisable: true;
  }
}
declare global {
  interface Window {
    TradingView?: any;
  }
}

axios.defaults.baseURL = process.env.NEXT_PUBLIC_BASE_API_ORIGIN;
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
          url: 'https://blog.sooros.com',
          description: 'sooros 블로그입니다.'
        }}
        description='sooros 블로그입니다.'
      />
      <Head>
        <meta name='viewport' content='width=device-width, initial-scale=1' />
      </Head>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </>
  );
}

export default MyApp;
