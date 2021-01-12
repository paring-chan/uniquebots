import { gql } from 'apollo-boost'
import React, { Component } from 'react'
import UBSelect from '../components/Select/UBSelect'
import { Category } from '../types'
import { getApolloClient } from '../lib/apollo'
import { getMarkdown } from '../lib/markdown'
import NProgress from 'nprogress'
import { NextPageContext } from 'next'
import { ProviderContext, withSnackbar } from 'notistack'
import Router from 'next/router'
import { NextSeo } from 'next-seo'

class AddBot extends Component<ProviderContext> {
  state = {
    category: [],
    brief: '',
    description: '',
    library: '',
    clientID: '',
    website: '',
    prefix: '',
    git: '',
    support: '',
    processing: false,
    invite: '',
  }

  render() {
    return (
      <div className="pt-4">
        <NextSeo
          title="봇 추가하기"
          description="자신이 만든 봇을 추가해보세요!"
        />
        <div className="text-2xl">봇 추가하기</div>
        <form
          onSubmit={async (e) => {
            e.preventDefault()
            if (this.state.processing) return
            NProgress.start()
            this.setState({ processing: true })
            const apollo = getApolloClient()
            let data

            try {
              data = await apollo.mutate({
                mutation: gql`
                  mutation($data: BotAddInfo!) {
                    addBot(data: $data)
                  }
                `,
                variables: {
                  data: {
                    id: this.state.clientID,
                    brief: this.state.brief,
                    description: this.state.description,
                    category: this.state.category.map((it: any) => it.value),
                    library: (this.state.library as any).value,
                    website: this.state.website,
                    git: this.state.git,
                    prefix: this.state.prefix,
                    support: this.state.support,
                    invite: this.state.invite,
                  },
                },
              })
            } catch (e) {
              return [
                NProgress.done(),
                this.props.enqueueSnackbar(e.message, { variant: 'error' }),
                this.setState({ processing: false }),
              ]
            }

            if (data.errors) {
              return [
                NProgress.done(),
                data.errors
                  .map((it) => it.message)
                  .forEach((r) =>
                    this.props.enqueueSnackbar(r, { variant: 'error' }),
                  ),
                this.setState({ processing: false }),
              ]
            }

            this.props.enqueueSnackbar('봇이 추가되었습니다.', {
              variant: 'success',
            }),
              this.setState({ processing: false })
            await Router.push('/')
          }}
        >
          <div className="grid gap-2">
            <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
              <label className="block mt-4">
                <span>봇 ID</span>
                <input
                  value={this.state.clientID}
                  onChange={(e) => this.setState({ clientID: e.target.value })}
                  required
                  type="text"
                  className="w-full p-2 rounded-md border-gray-300 dark:bg-discord-black border dark:border-white focus:border-blue-600 transition-colors"
                  placeholder="봇 클라이언트 ID를 입력해주세요"
                />
              </label>
              <label className="block mt-4">
                <span>카테고리</span>
                <UBSelect
                  value={this.state.category}
                  onChange={(category) => this.setState({ category })}
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
                  onChange={(library) => this.setState({ library })}
                  value={this.state.library}
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
                  value={this.state.brief}
                  onChange={(e) => this.setState({ brief: e.target.value })}
                  className="w-full p-2 rounded-md border-gray-300 dark:bg-discord-black border dark:border-white focus:border-blue-600 transition-colors"
                  placeholder="봇의 간단한 소개를 적어주세요.(최대 50자)"
                  maxLength={50}
                />
              </label>
              <label className="block mt-4">
                <span>봇 웹사이트</span>
                <input
                  value={this.state.website}
                  onChange={(e) => this.setState({ website: e.target.value })}
                  type="url"
                  placeholder="봇 웹사이트 주소를 입력해주세요"
                  className="w-full p-2 rounded-md border-gray-300 dark:bg-discord-black border dark:border-white focus:border-blue-600 transition-colors"
                />
              </label>
              <label className="block mt-4">
                <span>GIT</span>
                <input
                  value={this.state.git}
                  onChange={(e) => this.setState({ git: e.target.value })}
                  type="url"
                  placeholder="git 주소를 입력해주세요"
                  className="w-full p-2 rounded-md border-gray-300 dark:bg-discord-black border dark:border-white focus:border-blue-600 transition-colors"
                />
              </label>
              <label className="block mt-4">
                <span>서포트 서버</span>
                <input
                  value={this.state.support}
                  onChange={(e) => this.setState({ support: e.target.value })}
                  type="url"
                  placeholder="서포트 서버 주소를 입력해주세요"
                  className="w-full p-2 rounded-md border-gray-300 dark:bg-discord-black border dark:border-white focus:border-blue-600 transition-colors"
                />
              </label>
              <label className="block mt-4">
                <span>프리픽스</span>
                <input
                  type="text"
                  value={this.state.prefix}
                  onChange={(e) => this.setState({ prefix: e.target.value })}
                  required
                  placeholder="봇의 접두사를 입력해주세요(최대 10자)"
                  className="w-full p-2 rounded-md border-gray-300 dark:bg-discord-black border dark:border-white focus:border-blue-600 transition-colors"
                  maxLength={10}
                />
              </label>
              <label className="block mt-4">
                <span>봇 초대 링크</span>
                <input
                  type="text"
                  value={this.state.invite}
                  onChange={(e) => this.setState({ invite: e.target.value })}
                  placeholder="봇 초대 링크를 입력해주세요(비어있을 시 자동생성)"
                  className="w-full p-2 rounded-md border-gray-300 dark:bg-discord-black border dark:border-white focus:border-blue-600 transition-colors"
                />
              </label>
            </div>
            <label className="block mt-4">
              <span>봇 설명</span>
              <div className="grid gap-2 grid-cols-1 md:grid-cols-2">
                <textarea
                  onChange={(e) =>
                    this.setState({ description: e.target.value })
                  }
                  required
                  value={this.state.description}
                  className="w-full p-2 rounded-md border-gray-300 dark:bg-discord-black border resize-y dark:border-white focus:border-blue-600 transition-colors"
                  placeholder="봇이 어떤 기능을 하는지 적어주세요.(최대 5000자)"
                  maxLength={5000}
                />
                <div
                  className="shadow-xl rounded-lg dark:bg-discord-black p-2 markdown"
                  dangerouslySetInnerHTML={{
                    __html: getMarkdown().render(this.state.description),
                  }}
                ></div>
              </div>
            </label>
            <div>
              <button
                className="p-2 bg-purple-700 shadow-lg rounded-md text-white"
                type="submit"
              >
                봇 추가하기
              </button>
            </div>
          </div>
        </form>
      </div>
    )
  }
}

export async function getServerSideProps(ctx: NextPageContext) {
  const client = getApolloClient(ctx)
  const data = await client.query({
    query: gql`
      query {
        me {
          id
        }
      }
    `,
  })
  if (data.data.me) {
    return { props: {} }
  }
  return {
    redirect: {
      permanent: false,
      destination: '/',
    },
  }
}

export default withSnackbar(AddBot)
