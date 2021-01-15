import { library } from '@fortawesome/fontawesome-svg-core'
import { fas } from '@fortawesome/free-solid-svg-icons'
import { fab } from '@fortawesome/free-brands-svg-icons'
import React from 'react'
import Layout from '../components/Layout'
import '../styles/global.css'
import Router from 'next/router'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import { ApolloProvider } from 'react-apollo'
import { SnackbarProvider } from 'notistack'
import Error from 'next/error'
import { NextPageContext } from 'next'
import { getApolloClient } from '../lib/apollo'
import { gql } from 'apollo-boost'
import { AppContext } from 'next/app'
// import 'tippy.js/dist/tippy.css'

Router.events.on('routeChangeStart', () => NProgress.start())
Router.events.on('routeChangeComplete', () => NProgress.done())
Router.events.on('routeChangeError', () => NProgress.done())

library.add(fas, fab)

function MyApp({ Component, pageProps }: any) {
  if (typeof localStorage !== 'undefined') {
    const dark = !!localStorage.getItem('dark')
    if (dark) {
      document.querySelector('html')!.classList.add('dark')
    } else {
      document.querySelector('html')!.classList.remove('dark')
    }
  }
  return pageProps.error ? (
    <Error statusCode={pageProps.error} />
  ) : (
    <SnackbarProvider
      maxSnack={6}
      anchorOrigin={{ horizontal: 'center', vertical: 'top' }}
    >
      <Layout user={pageProps.me} loginURL={pageProps.loginURL}>
        <Component {...pageProps} />
      </Layout>
    </SnackbarProvider>
  )
}

MyApp.getInitialProps = async (ctx: AppContext) => {
  /*query {
                user: me {
                  id
                  tag
                  avatarURL
                  admin
                }
                loginURL
              } */
  const data = await getApolloClient(ctx.ctx).query({
    query: gql`
      query {
        me {
          id
          tag
          avatarURL
        }
        loginURL
      }
    `,
  })
  return {
    pageProps: {
      ...(await ctx.Component.getInitialProps?.(ctx.ctx)),
      ...data.data,
    },
  }
}

export default MyApp
