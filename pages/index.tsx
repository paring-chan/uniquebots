import React from 'react'
import SearchBar from '../components/SearchBar'
import { NextSeo } from 'next-seo'
import { gql } from 'apollo-boost'
import { Bot } from '../types'
import BotCard from '../components/BotCard'
import { NextPageContext } from 'next'
import { getApolloClient } from '../lib/apollo'

const Home = ({ bots }: { bots: Bot[] }) => {
  return (
    <>
      <NextSeo
        title="홈 - UniqueBots"
        description="UNIQUEBOTS, 디스코드 봇 리스트"
      />
      <SearchBar />
      <div>
        {
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-2 grid-cols-1">
            {bots.map((bot: Bot) => (
              <BotCard bot={bot} key={bot.id} />
            ))}
          </div>
        }
      </div>
    </>
  )
}

export const getServerSideProps = async (ctx: NextPageContext) => {
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
          categories {
            id
            name
          }
        }
      }
    `,
  })
  return { props: { bots: data.data.bots } }
}

export default Home
