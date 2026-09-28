import Document, { DocumentContext, Head, Html, Main, NextScript, DocumentInitialProps } from 'next/document'
import React from 'react'
import { googleTagManagerId } from '../lib/gtm'
import { staticPath } from '../lib/$path'

export default class CustomDocument extends Document {
  static async getInitialProps(ctx: DocumentContext): Promise<DocumentInitialProps> {
    const initialProps = await Document.getInitialProps(ctx)

    return {
      ...initialProps,
    }
  }

  render(): JSX.Element {
    return (
      <Html prefix="og: https://ogp.me/ns#">
        <Head>
          {/* 全ページ共通のファビコン */}
          <link rel="icon" href={staticPath.images.index.logo_mark_svg} />
        </Head>
        <body>
          <noscript
            dangerouslySetInnerHTML={{
              __html: `
              <iframe
                src="https://www.googletagmanager.com/ns.html?id=${googleTagManagerId}"
                height="0"
                width="0"
                style="display:none;visibility:hidden"
              />`,
            }}
          />
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}
