import { NextPage, NextPageContext } from 'next'
import React from 'react'
import { getApolloClient } from '../../lib/apollo'
import { gql } from 'apollo-boost'
import { Category } from '../../types'
import { NextSeo } from 'next-seo'
import BotCard from '../../components/BotCard'
import clsx from 'clsx'

const CategoryPage: NextPage<{ category: Category }> = ({ category }) => {
  const [currentPage, setCurrentPage] = React.useState(3)
  const [pages] = React.useState(4)

  return (
    <div>
      <NextSeo
        title={`카테고리 - ${category.name}`}
        description={`카테고리 ${category.name}의 봇 목록입니다.`}
      />
      <div className="text-3xl">카테고리 - {category.name}</div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-2 grid-cols-1">
        {category.bots.map((it, key) => (
          <BotCard bot={it} key={key} />
        ))}
      </div>
      <div className="flex justify-center gap-1">
        {(() => {
          const items = new Array(pages).fill(null).map((it, idx) => idx + 1)
          return items
            .slice(
              pages <= 3
                ? 0
                : currentPage === 1
                ? 0
                : currentPage === pages
                ? currentPage - 3
                : currentPage - 2,
              pages <= 3
                ? items.length
                : currentPage === 1
                ? currentPage + 2
                : currentPage === pages
                ? currentPage
                : currentPage + 1,
            )
            .map((it, key) => (
              <div
                key={key}
                className={clsx(
                  'p-2 rounded-full w-8 h-8 flex justify-center cursor-pointer transition-colors',
                  {
                    'bg-blue-500': currentPage === it,
                    'bg-discord-black': currentPage !== it,
                  },
                )}
                style={{ alignItems: 'center' }}
                onClick={() => setCurrentPage(it)}
              >
                {it}
              </div>
            ))
        })()}
      </div>
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
