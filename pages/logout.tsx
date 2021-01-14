import React from 'react'
import Cookies from 'cookies'
import { NextPageContext } from 'next'

const logout = () => {
  if (typeof window !== 'undefined') {
    window.location.assign('/')
  }
  return <div />
}

export default logout

export const getServerSideProps = (ctx: NextPageContext) => {
  const cookie = Cookies(ctx.req!, ctx.res!)
  cookie.set('token', null)
  return { props: {} }
}
