import { library } from '@fortawesome/fontawesome-svg-core'
import { fas } from '@fortawesome/free-solid-svg-icons'
import { fab } from '@fortawesome/free-brands-svg-icons'
import React from 'react'
import Layout from '../components/Layout'
import '../styles/global.css'
import Router from 'next/router'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import withApolloClient from '../lib/apollo'
import { ApolloProvider } from 'react-apollo'
import { SnackbarProvider } from 'notistack'
import Error from 'next/error'
// import 'tippy.js/dist/tippy.css'

Router.events.on('routeChangeStart', () => NProgress.start())
Router.events.on('routeChangeComplete', () => NProgress.done())
Router.events.on('routeChangeError', () => NProgress.done())

library.add(fas, fab)

function MyApp({ Component, pageProps, apollo }: any) {
  if (typeof localStorage !== 'undefined') {
    const dark = !!localStorage.getItem('dark')
    if (dark) {
      document.querySelector('html')!.classList.add('dark')
    } else {
      document.querySelector('html')!.classList.remove('dark')
    }
  }
  return (
    <ApolloProvider client={apollo}>
      {pageProps.error ? (
        <Error statusCode={pageProps.error} />
      ) : (
        <SnackbarProvider
          maxSnack={6}
          anchorOrigin={{ horizontal: 'center', vertical: 'top' }}
        >
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </SnackbarProvider>
      )}
    </ApolloProvider>
  )
}

export default withApolloClient(MyApp)
