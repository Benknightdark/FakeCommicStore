import '../styles/globals.css'
import type { AppProps } from 'next/app'
import Layout from './utils/layout'
import { SessionProvider } from 'next-auth/react'
import Head from 'next/head'
import { NextPage } from 'next'
import { ReactElement, ReactNode } from 'react'

// function MyApp({ Component, pageProps }: AppProps) {
//   return (
//     <SessionProvider session={pageProps.session} basePath={"/api/no/body/know"}>
//       <Head>
//         <meta charSet="utf-8" />
//         <meta name="viewport" content="width=device-width, initial-scale=1" />
//         <title>Fake Commic Store</title>
//       </Head>
//       <Layout>
//         <Component {...pageProps} />
//       </Layout>
//     </SessionProvider>
//   )
// }
// export default MyApp


type NextPageWithLayout = NextPage & {
  getLayout?: (page: ReactElement) => ReactNode
}

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout
}

export default function MyApp({ Component, pageProps }: AppPropsWithLayout) {
  // Use the layout defined at the page level, if available
  const getLayout = Component.getLayout ?? ((page) => page)

  return getLayout(<SessionProvider session={pageProps.session} basePath={"/api/no/body/know"}>
    <Head>
      <meta charSet="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <title>Fake Commic Store</title>
    </Head>
    <Layout>
      <Component {...pageProps} />
    </Layout>
  </SessionProvider>)
}
