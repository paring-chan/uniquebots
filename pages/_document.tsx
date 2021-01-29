import Document, { Html, Head, Main, NextScript } from 'next/document'
import React from 'react'

class MyDocument extends Document {
  static async getInitialProps(ctx: any) {
    const initialProps = await Document.getInitialProps(ctx)
    return { ...initialProps }
  }

  render() {
    return (
      <Html style={{ scrollBehavior: 'smooth' }}>
        <Head>
          <script
            async
            src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"
          ></script>
          <ins
            class="kakao_ad_area"
            style="display:none;"
            data-ad-unit="DAN-cg3Y6eju0wg9GWlA"
            data-ad-width="320"
            data-ad-height="100"
          ></ins>
          <script
            type="text/javascript"
            src="//t1.daumcdn.net/kas/static/ba.min.js"
            async
          ></script>
        </Head>
        <body className="dark:bg-discord-dark dark:text-white">
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

export default MyDocument
