import React, { Component } from 'react'
import { NextPageContext } from 'next'
import { getApolloClient } from '../../../lib/apollo'
import { gql } from 'apollo-boost'
import { NextSeo } from 'next-seo'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Tippy from '@tippyjs/react'
import Link from 'next/link'
import BotCard from '../../../components/BotCard'
import { Bot } from '../../../types'

class Profile extends Component<any> {
  render() {
    const { user } = this.props
    return (
      <>
        <NextSeo
          title={user.tag}
          openGraph={{
            images: [
              {
                url: user.avatarURL,
              },
            ],
            title: user.tag,
            description: `${user.tag}님의 프로필입니다.`,
          }}
          description={`${user.tag}님의 프로필입니다.`}
        />
        {/* <div className="grid gap-2 pt-4">
          <div className="lg:flex">
            <div className="lg:w-1/2 flex text-center justify-center lg:justify-end">
              <div className="lg:w-1/2 w-3/4">
                <img
                  src={user.avatarURL}
                  alt="Avatar"
                  className="w-full rounded-3xl shadow-xl"
                />
              </div>
            </div>
            <div className="lg:w-1/2 lg:pl-2 text-center lg:text-left pt-2 lg:pt-0">
              <div className="text-3xl">{user.tag}</div>
              <div>
                {user.admin && (
                  <Tippy content="관리자">
                    <div className="inline-block">
                      <FontAwesomeIcon
                        icon={['fas', 'user-cog']}
                        className="text-2xl"
                      />
                    </div>
                  </Tippy>
                )}
              </div>
            </div>
          </div>
        </div> */}
        <div className="bg-white shadow-xl max-w-xl rounded-xl md:flex mx-auto text-black mt-6 dark:bg-discord-black dark:text-white pt-8 md:p-0">
          <img
            src={user.avatarURL}
            alt="avatar"
            className="w-32 h-32 md:w-48 md:h-auto mx-auto md:rounded-l-xl rounded-full md:rounded-none"
          />
          <div className="md:flex-grow flex flex-col p-2 px-8 md:px-2">
            <div className="text-2xl mx-auto md:mx-0 pb-2">{user.tag}</div>
            <div className="flex-grow mx-auto md:mx-0 pb-2">
              {user.admin && (
                <Tippy content="관리자">
                  <div className="inline-block">
                    <FontAwesomeIcon
                      icon={['fas', 'user-cog']}
                      className="text-2xl"
                    />
                  </div>
                </Tippy>
              )}
            </div>
            <div className="md:ml-auto mx-auto md:mx-0">
              {user.me && (
                <Link href="/editProfile">
                  <div className="p-2 dark:bg-discord-dark rounded-lg cursor-pointer">
                    프로필 수정
                  </div>
                </Link>
              )}
            </div>
          </div>
        </div>
        {(user.bots.length && (
          <div className="mt-6">
            <div className="text-3xl">제작한 봇</div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-2 grid-cols-1">
              {user.bots.map((it: Bot) => (
                <BotCard bot={it} />
              ))}
            </div>
          </div>
        )) ||
          null}
      </>
    )
  }
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

export default Profile
