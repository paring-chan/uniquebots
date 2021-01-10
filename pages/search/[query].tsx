import { NextPageContext } from 'next'
import React, { Component } from 'react'
import SearchResult from '../../components/SearchResult'
import { Bot } from '../../types'

const sample: Bot[] = []

class Search extends Component<any> {
  render() {
    return <SearchResult keyword={this.props.keyword} results={sample} />
  }
}

export async function getServerSideProps(ctx: NextPageContext) {
  return { props: { keyword: ctx.query.query } }
}

export default Search
