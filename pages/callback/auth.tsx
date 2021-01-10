import { gql } from 'apollo-boost'
import { NextPageContext } from 'next'
import React from 'react'
import { getApolloClient } from '../../lib/apollo'
import Cookies from 'cookies'

const AuthCallback = () => {
  return <div></div>
}

export const getServerSideProps = async (ctx: NextPageContext) => {
  const client = getApolloClient(ctx)
  const data = await client
    .mutate({
      mutation: gql`
        mutation($code: String!) {
          login(code: $code)
        }
      `,
      variables: {
        code: ctx.query.code,
      },
    })
    .catch(() => null)
  if (data?.data?.login) {
    const cookies = new Cookies(ctx.req!, ctx.res!)
    cookies.set('token', data.data.login, {
      httpOnly: false,
    })
  }
  return {
    redirect: {
      permanent: false,
      destination: '/',
    },
  }
}

export default AuthCallback
