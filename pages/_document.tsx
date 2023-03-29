import type React from 'react';
import Document, { Html, Main, Head, NextScript } from 'next/document';

class CustomDocument extends Document {
  render() {
    return (
      <Html lang='ko'>
        <Head>
          <script
            dangerouslySetInnerHTML={{
              __html: `
(function(){
  const themeStore = localStorage.getItem('theme');

  if(typeof themeStore === 'string') {
    const theme = JSON.parse(themeStore);
    const mode = theme?.state?.mode || null;
    
    if(mode){
      document.documentElement.dataset.theme = mode;
      document.documentElement.classList.add(mode);
      return;
    }
  }
  document.documentElement.classList.remove('light');
  document.documentElement.classList.add('dark');
  document.documentElement.dataset.theme = 'dark';
})()
`
            }}
          />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default CustomDocument;
