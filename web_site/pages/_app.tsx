import '../styles/globals.css'
import type { AppProps } from 'next/app'
import Layout from './utils/layout'
import { SessionProvider } from 'next-auth/react'
import Head from 'next/head'
function MyApp({ Component, pageProps }: AppProps) {

  return (
    <SessionProvider session={pageProps.session}>
      <Head>
        <title>Fake Commic Store</title>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/icon?family=Material+Icons"
        />
      </Head>
      <Layout>
        <Component {...pageProps} />

      </Layout>
    </SessionProvider>
  )
}
export default MyApp
