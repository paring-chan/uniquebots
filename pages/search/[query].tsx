import { gql } from 'apollo-boost'
import { NextPageContext } from 'next'
import React, { Component } from 'react'
import SearchResult from '../../components/SearchResult'
import { getApolloClient } from '../../lib/apollo'

class Search extends Component<any> {
  render() {
    return (
      <SearchResult keyword={this.props.keyword} results={this.props.results} />
    )
  }
}

export async function getServerSideProps(ctx: NextPageContext) {
  const client = getApolloClient(ctx)
  const data = await client.query({
    query: gql`
      query {
        bots {
          id
          name
          avatarURL
          guilds
          status
          brief
          trusted
          website
          git
          description
          support
          invite
          isOwner
          owners {
            id
            tag
          }
          discordVerified
          categories {
            id
            name
          }
        }
      }
    `,
  })
  const m = new RegExp(ctx.query.query as string, 'i')
  return {
    props: {
      keyword: ctx.query.query,
      results: data.data.bots.filter(
        (r) => m.test(r.name) || m.test(r.description) || m.test(r.brief),
      ),
    },
  }
}

export default Search
