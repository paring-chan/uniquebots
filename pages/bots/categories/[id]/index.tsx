import { NextPage, NextPageContext } from 'next'
import React from 'react'
import { getApolloClient } from '../../../../lib/apollo'
import { gql } from 'apollo-boost'
import { Category } from '../../../../types'
import { NextSeo } from 'next-seo'
import BotCard from '../../../../components/BotCard'
import Paginator from '../../../../components/Paginator'
import Router from 'next/router'

const CategoryPage: NextPage<{ category: Category; page: number }> = ({
  category,
  page,
}) => {
  const [currentPage] = React.useState(page || 1)

  return (
    <div>
      <NextSeo
        title={`카테고리 - ${category.name}`}
        description={`카테고리 ${category.name}의 봇 목록입니다.`}
      />
      <div className="text-3xl">카테고리 - {category.name}</div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-2 grid-cols-1">
        {(category as any).botList.map((it, key) => (
          <BotCard bot={it} key={key} />
        ))}
      </div>
      <Paginator
        items={category.bots.length}
        itemsPerPage={18}
        current={currentPage}
        onChange={(v) => {
          Router.push(
            '/categories/[id]/[page]',
            `/categories/${category.id}/${v}`,
          )
        }}
      />
    </div>
  )
}

export const getServerSideProps = async (ctx: NextPageContext) => {
  const client = getApolloClient(ctx)
  const data = await client.query({
    query: gql`
      query($id: String!) {
        category(id: $id) {
          bots {
            id
            name
            avatarURL
            guilds
            status
            brief
            invite
            trusted
            categories {
              id
              name
            }
          }
          name
          id
        }
      }
    `,
    variables: {
      id: ctx.query.id,
    },
  })
  if (!data.data.category)
    return {
      props: {
        error: 404,
      },
    }
  let page = 0
  if (ctx.query.page) {
    const n = Number(ctx.query.page)
    if (isNaN(n)) {
      page = 0
    } else {
      page = n - 1
    }
  }
  return {
    props: {
      category: {
        ...data.data.category,
        botList: data.data.category.bots.slice(18 * page, 18 * page + 18),
        page: ctx.query.page || 1,
      },
    },
  }
}

export default CategoryPage
