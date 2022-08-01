import Document, { Html, Main, Head, NextScript } from 'next/document';

class CustomDocument extends Document {
  render() {
    return (
      <Html lang='ko' data-theme='forest'>
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
