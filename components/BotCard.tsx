import Tippy from '@tippyjs/react'
import clsx from 'clsx'
import Link from 'next/link'
import React from 'react'
import { Bot, Status, StatusColors } from '../types'

const BotCard = ({ bot }: { bot: Bot }) => {
  return (
    <div className="container mt-5">
      <div className="relative">
        <img
          src={bot.avatarURL}
          className="absolute w-32 h-32 -left-2 shadow-lg top-2 rounded-xl z-50"
          alt="Avatar"
        />
      </div>
      <div className="rounded-xl p-4 lg:p-0 relative shadow-lg w-full transition-shadow border-black border lg:flex lg:min-h-56">
        {/* <img
          src={bot.avatarURL}
          className="rounded-full w-16 h-16 lg:h-32 lg:w-full lg:rounded-none lg:rounded-tl-xl"
          alt="AVATAR"
        /> */}
        <div className="mt-32 pl-2 w-28 absolute">
          <div className="whitespace-nowrap mt-3 p-2">
            <div
              className={clsx(
                'w-4 h-4 inline-block rounded-full mr-2',
                'bg-' + StatusColors[bot.status],
              )}
            />
            <span>{Status[bot.status]}</span>
          </div>
          <div className="whitespace-nowrap px-2 pb-2">
            <span>{bot.guilds} 서버</span>
          </div>
        </div>
        <div className="p-2 lg:pb-0 lg:pr-0 pl-32 flex-col flex flex-grow">
          <div className="text-2xl">{bot.name}</div>
          <div>{bot.brief}</div>
          <div className="flex flex-wrap gap-1">
            {bot.categories.map((it, key) => (
              <span
                key={key}
                className="rounded-md bg-gray-500 text-white p-1 whitespace-nowrap"
              >
                <Link href="/categories/[id]" as={`/categories/${it.id}`}>
                  {it.name}
                </Link>
              </span>
            ))}
          </div>
          <div className="flex-grow" />
          <div className="flex w-full">
            {bot.invite ? (
              <a
                href={bot.invite}
                className="cursor-pointer p-3 hover:bg-blue-400 hover:text-white transition-colors w-1/2 text-center"
              >
                초대하기
              </a>
            ) : (
              <Tippy content="봇 초대 링크를 가져올 수 없습니다. 잠금 처리된 봇일 수 있습니다">
                <a
                  href={bot.invite}
                  className="cursor-default p-3 w-1/2 text-center hover:bg-blue-400 hover:text-white transition-colors"
                >
                  초대하기
                </a>
              </Tippy>
            )}
            <Link href="/bots/[id]" as={`/bots/${bot.id}`}>
              <a
                href={bot.invite}
                className="cursor-pointer p-3 w-1/2 text-center hover:bg-blue-400 hover:text-white transition-colors lg:rounded-br-xl"
              >
                더보기
              </a>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BotCard
