import React from 'react'
import { NextPage, NextPageContext } from 'next'
import { getApolloClient } from '../../../lib/apollo'
import { gql } from 'apollo-boost'
import { Bot, Category } from '../../../types'
import { NextSeo } from 'next-seo'
import { getMarkdown } from '../../../lib/markdown'
import UBSelect from '../../../components/Select/UBSelect'
import { ProviderContext, withSnackbar } from 'notistack'
import Router from 'next/router'
import CopyToClipboard from 'react-copy-to-clipboard'

const BotEdit: NextPage<{ bot: Bot; me: string } & ProviderContext> = ({
  bot,
  enqueueSnackbar,
  me,
}) => {
  const [category, setCategory] = React.useState(
    bot.categories.map((r) => ({ value: r.id, label: r.name })),
  )
  const [library, setLibrary] = React.useState({
    value: bot.library.id,
    label: bot.library.name,
  })
  const [brief, setBrief] = React.useState(bot.brief)
  const [description, setDescription] = React.useState(bot.description)
  const [git, setGit] = React.useState(bot.git)
  const [website, setWebsite] = React.useState(bot.website)
  const [support, setSupport] = React.useState(bot.support)
  const [invite, setInvite] = React.useState(bot.invite)
  const [prefix, setPrefix] = React.useState(bot.prefix)
  const [token, setToken] = React.useState(bot.token)

  return (
    <div>
      <NextSeo title="봇 수정하기" description="봇을 수정해보세요!" />
      <div className="text-2xl">
        봇{' '}
        <code className="bg-gray-100 dark:bg-discord-black p-1 rounded-md">
          {bot.name}
        </code>{' '}
        관리
      </div>
      <div className="mt-2">
        <CopyToClipboard text={token} onCopy={() => alert('복사되었습니다.')}>
          <button className="bg-blue-500 text-white p-2 rounded-md">
            토큰 복사
          </button>
        </CopyToClipboard>
        <button
          className="bg-blue-500 p-2 rounded-md ml-1 text-white"
          onClick={async () => {
            const client = getApolloClient()
            const data = await client.query({
              query: gql`
                query($id: String!) {
                  bot(id: $id) {
                    token(regenerate: true)
                  }
                }
              `,
              variables: {
                id: bot.id,
              },
            })
            if (data?.data?.bot?.token) {
              setToken(data.data.bot.token)
              return alert('토큰이 재발급 되었습니다.')
            }
          }}
        >
          토큰 재발급
        </button>
      </div>
      <form
        onSubmit={async (e) => {
          e.preventDefault()
          const apollo = getApolloClient()
          const data = await apollo.mutate({
            mutation: gql`
              mutation(
                $id: String!
                $category: [String!]!
                $brief: String!
                $description: String!
                $library: String!
                $website: String
                $git: String
                $prefix: String!
                $support: String
                $invite: String!
                $owners: [String!]!
              ) {
                editBot(
                  data: {
                    id: $id
                    category: $category
                    brief: $brief
                    description: $description
                    library: $library
                    website: $website
                    git: $git
                    prefix: $prefix
                    support: $support
                    invite: $invite
                    owners: $owners
                  }
                )
              }
            `,
            variables: {
              id: bot.id,
              category: category.map((r) => r.value),
              brief: brief,
              description: description,
              library: library.value,
              website: website,
              git: git,
              prefix: prefix,
              invite: invite,
              owners: Array.from(new Set([me])),
            },
          })
          if (data.errors) {
            data.errors.forEach((r) =>
              enqueueSnackbar(r.message, {
                variant: 'error',
              }),
            )
            return
          }
          if (data.data?.editBot) {
            enqueueSnackbar(
              '봇 정보가 저장되었습니다. 적용되기까지 시간이 걸릴 수 있습니다.',
              {
                variant: 'success',
              },
            )
          }
          return Router.push('/bots/info/[id]', `/bots/info/${bot.id}`)
        }}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          <label className="block mt-4">
            <span>카테고리</span>
            <UBSelect
              value={category}
              onChange={(category) => setCategory(category)}
              isSearchable
              isMulti
              instanceId="addbot__category"
              async
              defaultOptions
              loadOptions={async (value) => {
                const client = getApolloClient()
                const res = await client.query({
                  query: gql`
                    query {
                      categories {
                        id
                        name
                      }
                    }
                  `,
                })
                return res.data.categories
                  .filter((r: Category) => r.name.includes(value))
                  .map((it: Category) => ({
                    value: it.id,
                    label: it.name,
                  }))
              }}
            />
          </label>
          <label className="block mt-4">
            <span>라이브러리</span>
            <UBSelect
              onChange={(library) => setLibrary(library)}
              value={library}
              isSearchable
              instanceId="addbot__library"
              async
              defaultOptions
              loadOptions={async (value) => {
                const client = getApolloClient()
                const res = await client.query({
                  query: gql`
                    query {
                      libraries {
                        id
                        name
                      }
                    }
                  `,
                })
                return (res.data.libraries as Category[])
                  .filter((r: Category) => r.name.includes(value))
                  .map((it: Category) => ({
                    value: it.id,
                    label: it.name,
                  }))
              }}
            />
          </label>
          <label className="block mt-4">
            <span>짧은 설명</span>
            <input
              type="text"
              required
              value={brief}
              onChange={(e) => setBrief(e.target.value)}
              className="w-full p-2 rounded-md border-gray-300 dark:bg-discord-black border dark:border-white focus:border-blue-600 transition-colors"
              placeholder="봇의 간단한 소개를 적어주세요.(최대 50자)"
              maxLength={50}
            />
          </label>
          <label className="block mt-4">
            <span>봇 웹사이트</span>
            <input
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              type="url"
              placeholder="봇 웹사이트 주소를 입력해주세요"
              className="w-full p-2 rounded-md border-gray-300 dark:bg-discord-black border dark:border-white focus:border-blue-600 transition-colors"
            />
          </label>
          <label className="block mt-4">
            <span>GIT</span>
            <input
              value={git}
              onChange={(e) => setGit(e.target.value)}
              type="url"
              placeholder="git 주소를 입력해주세요"
              className="w-full p-2 rounded-md border-gray-300 dark:bg-discord-black border dark:border-white focus:border-blue-600 transition-colors"
            />
          </label>
          <label className="block mt-4">
            <span>서포트 서버</span>
            <input
              value={support}
              onChange={(e) => setSupport(e.target.value)}
              type="url"
              placeholder="서포트 서버 주소를 입력해주세요"
              className="w-full p-2 rounded-md border-gray-300 dark:bg-discord-black border dark:border-white focus:border-blue-600 transition-colors"
            />
          </label>
          <label className="block mt-4">
            <span>프리픽스</span>
            <input
              type="text"
              value={prefix}
              onChange={(e) => setPrefix(e.target.value)}
              required
              placeholder="봇의 접두사를 입력해주세요(최대 10자)"
              className="w-full p-2 rounded-md border-gray-300 dark:bg-discord-black border dark:border-white focus:border-blue-600 transition-colors"
              maxLength={10}
            />
          </label>
          <label className="block mt-4">
            <span>봇 초대 링크</span>
            <input
              type="url"
              value={invite}
              required
              onChange={(e) => setInvite(e.target.value)}
              placeholder="봇 초대 링크를 입력해주세요"
              className="w-full p-2 rounded-md border-gray-300 dark:bg-discord-black border dark:border-white focus:border-blue-600 transition-colors"
            />
          </label>
        </div>
        <label className="block mt-4">
          <span>봇 설명</span>
          <div className="grid gap-2 grid-cols-1 md:grid-cols-2">
            <textarea
              onChange={(e) => setDescription(e.target.value)}
              required
              value={description}
              className="w-full p-2 rounded-md border-gray-300 dark:bg-discord-black border resize-y dark:border-white focus:border-blue-600 transition-colors"
              placeholder="봇이 어떤 기능을 하는지 적어주세요.(최대 5000자)"
              maxLength={5000}
            />
            <div
              className="shadow-xl rounded-lg dark:bg-discord-black p-2 markdown"
              dangerouslySetInnerHTML={{
                __html: getMarkdown().render(description),
              }}
            ></div>
          </div>
        </label>
        <button
          className="p-2 bg-purple-700 shadow-lg rounded-md text-white"
          type="submit"
        >
          봇 수정하기
        </button>
      </form>
    </div>
  )
}

export const getServerSideProps = async (ctx: NextPageContext) => {
  const apollo = getApolloClient(ctx)
  const { data, errors } = await apollo.query({
    query: gql`
      query($id: String!) {
        bot(id: $id) {
          id
          isOwner
          brief
          description
          token
          library {
            id
            name
          }
          categories {
            id
            name
          }
          website
          prefix
          git
          support
          invite
          name
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
  if (!data?.bot?.isOwner) {
    if (!data?.bot) {
      return {
        redirect: {
          destination: '/',
          permanent: false,
        },
      }
    }
    return {
      redirect: {
        destination: `/bots/info/${ctx.query.id}`,
        permanent: false,
      },
    }
  }
  return {
    props: { bot: data.bot, me: data.me.id },
  }
}

export default withSnackbar(BotEdit)
