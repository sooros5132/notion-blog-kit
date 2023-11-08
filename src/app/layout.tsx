import './globals.css';

import type { Metadata, ResolvingMetadata } from 'next';
import { Inter } from 'next/font/google';
import Header from '@/components/header/Header';
import Footer from '@/components/footer/Footer';
import { ThemeProvider } from '@/components/ThemeProvider';
import { ScrollTopButton } from '@/components/modules/ScrollTopButton';
import { NextNProgressProvider } from '@/components/NextNProgressProvider';
import { siteConfig } from '@/lib/site-config';
import { SideBarMenu } from '@/components/modules/SideBarMenu';
import { NoSsrWrapper } from '@/components/modules/NoSsrWrapper';
import { NotionClient } from '@/server/notion/Notion';
import { NotionDatabasesRetrieve } from '@/types/notion';
import { getMetadataInPageInfo } from '@/lib/notion';
import { HtmlLangAttrProvider } from '@/components/HtmlLangAttrProvider';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html suppressHydrationWarning>
      <head>
        <link rel='manifest' href='/manifest.webmanifest' />
        {siteConfig.googleAnalyticsId && (
          <script
            src={`https://www.googletagmanager.com/gtag/js?id=${siteConfig.googleAnalyticsId}`}
            async
          />
        )}
        {siteConfig.googleAnalyticsId && (
          <script
            id='google-analytics'
            dangerouslySetInnerHTML={{
              __html: `window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());

gtag('config', '${siteConfig.googleAnalyticsId}');
`
            }}
          />
        )}
      </head>
      <body className={inter.className}>
        <HtmlLangAttrProvider />
        <ThemeProvider
          attribute='class'
          defaultTheme='system'
          enableSystem
          disableTransitionOnChange
        >
          <div className='relative flex flex-col min-w-[300px] min-h-full text-foreground break-words'>
            <NextNProgressProvider
              shallowRouting
              height='4px'
              color='#39c2ff'
              options={{
                showSpinner: false
              }}
            />
            {siteConfig.showSourceCodeLink && <CodeDescription />}
            <Header />
            <main className='grow'>{children}</main>
            <Footer />
            <NoSsrWrapper>
              <SideBarMenu />
              <ScrollTopButton />
            </NoSsrWrapper>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}

function CodeDescription() {
  return (
    <div className='p-1.5 text-center text-sm border-b'>
      The source code for this blog is{' '}
      <a
        className='underline'
        href='https://github.com/sooros5132/notion-blog-kit'
        rel='noreferrer'
        target='_blank'
      >
        available on GitHub
      </a>
      .
    </div>
  );
}

const initMetadata: Metadata = {
  title: {
    default: siteConfig.infomation.blogname,
    template: '%s'
  },
  metadataBase: new URL(siteConfig.infomation.origin),
  keywords: ['blog', 'notion', siteConfig.infomation.blogname || ''],
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f3f4f6' },
    { media: '(prefers-color-scheme: dark)', color: '#313335' }
  ],
  viewport: {
    width: 'device-width',
    initialScale: 1
    // maximumScale: 1,
    // userScalable: false
  },
  robots: {
    index: true,
    follow: true
  }
};

export async function generateMetadata(params: any, _parent: ResolvingMetadata): Promise<Metadata> {
  const parent = await _parent;
  try {
    const notionClient = new NotionClient();
    const pageInfo = (await notionClient
      .getDatabaseInfo({
        databaseId: siteConfig.notion.baseBlock
      })
      .catch(async () => {
        return await notionClient
          .getPageInfo({
            pageId: siteConfig.notion.baseBlock
          })
          .catch(() => {
            throw 'notFound';
          });
      })) as NotionDatabasesRetrieve;

    if (!pageInfo) throw 'notFound';

    const { title, cover, description, icon } = getMetadataInPageInfo(pageInfo);

    return {
      ...initMetadata,
      title: title || siteConfig.infomation.blogname || parent.title?.absolute,
      description: description,
      icons: icon || parent.icons?.icon,
      openGraph: {
        images: cover || parent.openGraph?.images
      }
    };
  } catch (e) {
    return {
      ...initMetadata
    };
  }
}
