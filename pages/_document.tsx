import type React from 'react';
import Document, { Html, Main, Head, NextScript } from 'next/document';

class CustomDocument extends Document {
  render() {
    return (
      <Html lang='ko'>
        <Head></Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default CustomDocument;
