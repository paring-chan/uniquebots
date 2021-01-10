import React from 'react'
import SearchBar from '../components/SearchBar'
import { NextSeo } from 'next-seo'
import { Query } from 'react-apollo'
import { gql } from 'apollo-boost'
import { Bot } from '../types'
import BotCard from '../components/BotCard'

const Home = () => {
  return (
    <>
      <NextSeo
        title="홈 - UniqueBots"
        description="UNIQUEBOTS, 디스코드 봇 리스트"
      />
      <SearchBar />
      <Query
        query={gql`
          query {
            bots {
              id
              name
              avatarURL
              guilds
              status
              brief
              categories {
                id
                name
              }
            }
          }
        `}
        ssr
      >
        {({ data, loading }: any) => (
          <div>
            {(typeof window !== 'undefined' &&
              (loading ? (
                'Loading...'
              ) : data ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-2 grid-cols-1">
                  {data.bots.map((bot: Bot) => (
                    <BotCard bot={bot} key={bot.id} />
                  ))}
                </div>
              ) : (
                ''
              ))) ||
              'Loading...'}
          </div>
        )}
      </Query>
    </>
  )
}

export default Home
