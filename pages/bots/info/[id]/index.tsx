import { gql } from 'apollo-boost'
import { NextPage, NextPageContext } from 'next'
import React from 'react'
import { getApolloClient } from '../../../../lib/apollo'

const BotInfo: NextPage<any> = () => {
  return <div>bot info</div>
}

export async function getServerSideProps(ctx: NextPageContext) {
  const apollo = getApolloClient(ctx)
  const data = await apollo.query({
    query: gql`
      query($id: String!) {
        profile(id: $id) {
          id
          tag
          avatarURL
          admin
          description
          bots {
            id
            name
            avatarURL
            guilds
            status
            brief
            trusted
            invite
            categories {
              id
              name
            }
          }
        }
        me {
          id
        }
      }
    `,
    variables: {
      id: ctx.query.id,
    },
  })
  if (!data.data.profile) {
    return {
      props: {
        error: 404,
      },
    }
  }
  if (data.data.profile.id === data.data.me?.id) {
    data.data.profile.me = true
  }
  return { props: { user: data.data.profile } }
}

export default BotInfo
