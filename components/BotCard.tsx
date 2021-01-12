import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Tippy from '@tippyjs/react'
import clsx from 'clsx'
import Link from 'next/link'
import React from 'react'
import { Bot, Status, StatusColors } from '../types'

const BotCard = ({ bot }: { bot: Bot }) => {
  return (
    <div className="rounded-xl bg-white dark:bg-discord-black shadow-xl w-full mt-3 flex">
      <div className="w-32">
        <img
          className="rounded-tl-xl w-32 h-32 rounded-br-xl"
          src={bot.avatarURL}
          alt="avatar"
        />
        <div className="p-2">
          <div className="whitespace-nowrap p-2">
            <div
              className={clsx(
                'w-4 h-4 inline-block rounded-full mr-2',
                StatusColors[bot.status],
              )}
            />
            <span>{Status[bot.status]}</span>
          </div>
          <div className="whitespace-nowrap px-2 pb-2">
            <span>{bot.guilds} 서버</span>
          </div>
        </div>
      </div>
      <div className="p-2 flex flex-col pb-0 flex-grow pr-0 gap-1">
        <div className="text-2xl">
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
        <div className="text-lg text-gray-500">{bot.brief}</div>
        <div className="flex-grow" />
        <div className="flex flex-wrap gap-1">
          {bot.categories.map((it, key) => (
            <Link
              key={key}
              href="/bots/categories/[id]"
              as={`/bots/categories/${it.id}`}
            >
              <span className="rounded-md bg-gray-500 cursor-pointer text-white py-1 px-3 whitespace-nowrap">
                {it.name}
              </span>
            </Link>
          ))}
        </div>
        <div className="flex w-full">
          {bot.invite ? (
            <a
              href={bot.invite}
              target="_blank"
              className="cursor-pointer p-3 hover:bg-blue-400 hover:text-white transition-colors w-1/2 text-center whitespace-nowrap"
            >
              초대하기
            </a>
          ) : (
            <Tippy content="봇 초대 링크를 가져올 수 없습니다. 잠금 처리된 봇일 수 있습니다">
              <a className="cursor-default p-3 w-1/2 text-center hover:bg-blue-400 hover:text-white transition-colors whitespace-nowrap">
                초대하기
              </a>
            </Tippy>
          )}
          <Link href="/bots/info/[id]" as={`/bots/info/${bot.id}`}>
            <a
              href={bot.invite}
              className="cursor-pointer p-3 w-1/2 text-center hover:bg-blue-400 hover:text-white transition-colors rounded-br-xl whitespace-nowrap"
            >
              더보기
            </a>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default BotCard
