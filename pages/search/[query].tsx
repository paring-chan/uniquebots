import { NextPageContext } from 'next'
import React, { Component } from 'react'
import SearchResult from '../../components/SearchResult'
import { getApolloClient } from '../../lib/apollo'
import { Bot } from '../../types'

const sample: Bot[] = []

class Search extends Component<any> {
  render() {
    return <SearchResult keyword={this.props.keyword} results={sample} />
  }
}

export async function getServerSideProps(ctx: NextPageContext) {
  const client = getApolloClient(ctx)
  return { props: { keyword: ctx.query.query } }
}

export default Search
