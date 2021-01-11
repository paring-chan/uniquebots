import { NextPage, NextPageContext } from 'next'
import React from 'react'
import { getApolloClient } from '../../lib/apollo'
import { gql } from 'apollo-boost'
import { Category } from '../../types'
import { NextSeo } from 'next-seo'

const CategoryPage: NextPage<{ category: Category }> = ({ category }) => {
  return (
    <div>
      <NextSeo
        title={`카테고리 - ${category.name}`}
        description={`카테고리 ${category.name}의 봇 목록입니다.`}
      />
      <div className="text-3xl">카테고리 - {category.name}</div>
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
            trusted
            categories {
              id
              name
            }
          }
          name
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
  return { props: { category: data.data.category } }
}

export default CategoryPage
