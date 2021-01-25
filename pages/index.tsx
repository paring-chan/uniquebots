import React from 'react'
import SearchBar from '../components/SearchBar'
import { NextSeo } from 'next-seo'
import { gql } from 'apollo-boost'
import { Bot } from '../types'
import BotCard from '../components/BotCard'
import { NextPageContext } from 'next'
import { getApolloClient } from '../lib/apollo'
import Paginator from '../components/Paginator'
import Router from 'next/router'
import Advertisement from '../components/Advertisement'

const Home = ({
  bots,
  botCount,
  page,
}: {
  bots: Bot[]
  botCount: number
  page: number
}) => {
  return (
    <>
      <NextSeo
        title="홈 - UniqueBots"
        description="UNIQUEBOTS, 디스코드 봇 리스트"
      />
      <SearchBar />
      <Advertisement />
      <div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 grid-cols-1 mb-4">
          {bots.map((bot: Bot) => (
            <BotCard bot={bot} key={bot.id} />
          ))}
        </div>
        <Paginator
          onChange={(v) => Router.push('/bots/all/[page]', `/bots/all/${v}`)}
          items={botCount}
          itemsPerPage={18}
          current={page}
        />
      </div>
      <Advertisement />
    </>
  )
}

export const getServerSideProps = async (ctx: NextPageContext) => {
  let page = 0

  if (ctx.query.page) {
    if (!isNaN(Number(ctx.query.page))) {
      page = Number(ctx.query.page) - 1
    }
  }

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
          slug
          premium
          trusted
          invite
          categories {
            id
            name
          }
          hearts {
            from {
              id
            }
          }
        }
      }
    `,
  })
  data.data.bots.sort((a, b) => {
    if (b.hearts.length !== a.hearts.length)
      return b.hearts.length - a.hearts.length
    if (b.guilds > a.guilds) {
      return 1
    }
    return -1
  })
  return {
    props: {
      bots: data.data.bots.slice(18 * page, 18 * page + 18),
      botCount: data.data.bots.length,
      page: page + 1,
    },
  }
}

export default Home
