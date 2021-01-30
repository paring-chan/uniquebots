import { library } from '@fortawesome/fontawesome-svg-core'
import { fas } from '@fortawesome/free-solid-svg-icons'
import { fab } from '@fortawesome/free-brands-svg-icons'
import React from 'react'
import Layout from '../components/Layout'
import '../styles/global.css'
import Router from 'next/router'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import { SnackbarProvider } from 'notistack'
import Error from 'next/error'
import { getApolloClient } from '../lib/apollo'
import { gql } from 'apollo-boost'
import { AppContext } from 'next/app'
// import 'tippy.js/dist/tippy.css'

Router.events.on('routeChangeStart', () => NProgress.start())
Router.events.on('routeChangeComplete', () => NProgress.done())
Router.events.on('routeChangeError', () => NProgress.done())
Router.events.on('routeChangeComplete', () => {
  document.querySelector('html').scrollTo(0, 0)
})

library.add(fas, fab)

declare var fuckAdBlock: any
declare var FuckAdBlock: any

function MyApp({ Component, pageProps }: any) {
  const [adblock, setAdblock] = React.useState(false)
  React.useEffect(() => {
    function adBlockDetected() {
      setAdblock(true)
    }

    if (
      typeof fuckAdBlock !== 'undefined' ||
      typeof FuckAdBlock !== 'undefined'
    ) {
      adBlockDetected()
    } else {
      var importFAB = document.createElement('script')
      importFAB.onload = function () {
        fuckAdBlock.onDetected(adBlockDetected)
      }
      importFAB.onerror = function () {
        adBlockDetected()
      }
      importFAB.integrity =
        'sha256-xjwKUY/NgkPjZZBOtOxRYtK20GaqTwUCf7WYCJ1z69w='
      importFAB.crossOrigin = 'anonymous'
      importFAB.src =
        'https://cdnjs.cloudflare.com/ajax/libs/fuckadblock/3.2.1/fuckadblock.min.js'
      document.head.appendChild(importFAB)
    }
  }, [])

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
      <Layout
        adblock={adblock}
        user={pageProps.__user}
        loginURL={pageProps.loginURL}
      >
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
        __user: me {
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
