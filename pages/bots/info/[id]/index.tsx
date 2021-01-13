import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Tippy from '@tippyjs/react'
import { gql } from 'apollo-boost'
import { NextPage, NextPageContext } from 'next'
import React from 'react'
import { getApolloClient } from '../../../../lib/apollo'
import { Bot } from '../../../../types'

const BotInfo: NextPage<{ bot: Bot }> = ({ bot }) => {
  return (
    <div>
      <div className="flex flex-col md:flex-row gap-2">
        <img src={bot.avatarURL} alt="avatar" className="md:w-56 md:h-56" />
        <div className="flex-grow">
          <div className="text-3xl">
            {bot.name}
            {bot.trusted ? (
              <div className="ml-2 inline-block">
                <Tippy content="UniqueBots에서 인증받은 봇입니다.">
                  <div>
                    <FontAwesomeIcon
                      className="text-blue-500"
                      icon={['fas', 'check']}
                    />
                  </div>
                </Tippy>
              </div>
            ) : null}
          </div>
          <div className="text-xl">{bot.brief}</div>
        </div>
        <div className="md:w-1/4 lg:w-1/5 flex flex-col gap-2">
          <div>
            {bot.invite ? (
              <a
                href={bot.invite}
                target="_blank"
                className="bg-discord-black p-2 flex hover:bg-dark-hover transition-colors"
                style={{ alignItems: 'center' }}
              >
                <FontAwesomeIcon
                  icon={['fas', 'plus-circle']}
                  className="mr-2"
                  size="2x"
                />
                초대하기
              </a>
            ) : (
              <Tippy content="초대링크를 가져올 수 없습니다. 잠금처리된 봇일 수 있습니다.">
                <a
                  className="bg-discord-black p-2 flex hover:bg-dark-hover transition-colors cursor-pointer"
                  style={{ alignItems: 'center' }}
                >
                  <FontAwesomeIcon
                    icon={['fas', 'plus-circle']}
                    className="mr-2"
                    size="2x"
                  />
                  초대하기
                </a>
              </Tippy>
            )}
          </div>
          <div className="bg-discord-black">
            <div className="p-2"></div>
          </div>
        </div>
      </div>
    </div>
  )
}

export async function getServerSideProps(ctx: NextPageContext) {
  const apollo = getApolloClient(ctx)
  const data = await apollo.query({
    query: gql`
      query($id: String!) {
        bot(id: $id) {
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
        me {
          id
        }
      }
    `,
    variables: {
      id: ctx.query.id,
    },
  })
  if (!data.data.bot) {
    return {
      props: {
        error: 404,
      },
    }
  }
  return { props: { bot: data.data.bot } }
}

export default BotInfo
