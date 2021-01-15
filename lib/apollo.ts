import { ApolloClient, DocumentNode, InMemoryCache } from 'apollo-boost'
import withApollo from 'next-with-apollo'
import Cookies from 'cookies'
import jsCookie from 'js-cookie'
import { createHttpLink } from 'apollo-link-http'
import { setContext } from 'apollo-link-context'
import { NextPageContext } from 'next'
import Axios from 'axios'

export let apolloClient: ApolloClient<any>

const URL = 'https://beta.uniquebots.kr/graphql'

export function getApolloClient(ctx?: NextPageContext) {
  if (apolloClient) return apolloClient
  let cookie: any
  if (typeof window === 'undefined') {
    cookie = new Cookies(ctx.req, ctx.res)
  } else {
    cookie = jsCookie
  }

  const token = cookie.get('token')

  return {
    query: async (params: { query: DocumentNode; variables?: any }) => {
      return Axios.post<any>(
        URL,
        {
          ...params,
          query: params.query.loc.source.body,
        },
        {
          headers: {
            Authorization: token ? 'Bearer ' + token : '',
          },
        },
      )
        .catch((e) => e.response)
        .then((r) => r.data)
    },
    mutate: async (params: { mutation: DocumentNode; variables?: any }) => {
      return Axios.post<any>(
        URL,
        {
          ...params,
          mutation: params.mutation.loc.source.body,
        },
        {
          headers: {
            Authorization: token ? 'Bearer ' + token : '',
          },
        },
      )
        .catch((e) => e.response)
        .then((r) => r.data)
    },
  }
}
