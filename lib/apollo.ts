import { ApolloClient, InMemoryCache } from 'apollo-boost'
import withApollo from 'next-with-apollo'
import Cookies from 'cookies'
import jsCookie from 'js-cookie'
import { createHttpLink } from 'apollo-link-http'
import { setContext } from 'apollo-link-context'
import { NextPageContext } from 'next'

export let apolloClient: ApolloClient<any>

export function getApolloClient(
  ctx?: NextPageContext | undefined,
  initialState: any = null,
) {
  if (apolloClient) return apolloClient
  let cookie: any
  if (ctx?.req && ctx.res) {
    cookie = new Cookies(ctx.req, ctx.res)
  } else {
    cookie = jsCookie
  }

  const authLink = setContext((_, { headers }) => {
    const token = cookie.get('token')
    return {
      headers: {
        ...headers,
        authorization: token ? 'Bearer ' + token : '',
      },
    }
  })

  apolloClient = new ApolloClient({
    cache: new InMemoryCache().restore(initialState || {}),
    link: authLink.concat(
      createHttpLink({
        uri: 'https://beta.uniquebots.kr/graphql',
      }),
    ),
  })

  return apolloClient
}

export default withApollo(({ initialState, ctx }) => {
  return getApolloClient(ctx, initialState)
})
