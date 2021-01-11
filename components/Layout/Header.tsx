import { gql } from 'apollo-boost'
import Link from 'next/link'
import React from 'react'
import { Query } from 'react-apollo'
import Dropdown from '../Dropdown'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import clsx from 'clsx'
const Header = () => {
  const dropdownItemClass =
    'rounded-md p-2 dark:hover:bg-gray-600 cursor-pointer transition-all hover:bg-gray-100'

  return (
    <div
      className="mx-auto py-2 dark:bg-discord-black dark:text-white fixed top-0 left-0 w-full"
      style={{ alignItems: 'center' }}
    >
      <div className="flex container mx-auto">
        <div
          className="text-2xl f-jalnan flex-grow flex pl-2"
          style={{ alignItems: 'center' }}
        >
          <Link href="/">UNIQUEBOTS</Link>
        </div>
        <div style={{ alignItems: 'center' }} className="flex pr-2">
          <Query
            ssr
            query={gql`
              query {
                user: me {
                  id
                  tag
                  avatarURL
                  admin
                }
                loginURL
              }
            `}
          >
            {({ data }: any) => {
              if (typeof window === 'undefined') return null
              const user = data?.user
              if (user)
                return (
                  <Dropdown
                    leftOffset={-20}
                    button={({ opened }) => (
                      <div
                        className="inline-flex select-none cursor-pointer"
                        style={{ alignItems: 'center' }}
                      >
                        <img
                          src={user.avatarURL}
                          className="h-6 w-6 rounded-full mr-2"
                          alt="Avatar"
                        />
                        <span className="md:block hidden">{user.tag}</span>
                        <FontAwesomeIcon
                          icon={['fas', 'angle-down']}
                          size="2x"
                          className={clsx('ml-2 transition-transform', {
                            'fa-rotate-180': opened,
                          })}
                        />
                      </div>
                    )}
                  >
                    {({ close }) => (
                      <div className="flex flex-col gap-1" onClick={close}>
                        <Link href="/profile/[id]" as={`/profile/${user.id}`}>
                          <div className={dropdownItemClass}>프로필</div>
                        </Link>
                        {user.admin && (
                          <>
                            <Link href="/admin">
                              <div className={dropdownItemClass}>관리</div>
                            </Link>
                          </>
                        )}
                        <Link href="/addbot">
                          <div className={dropdownItemClass}>봇 추가하기</div>
                        </Link>
                        <Link href="/logout">
                          <div className={dropdownItemClass}>로그아웃</div>
                        </Link>
                      </div>
                    )}
                  </Dropdown>
                )
              return (data && <a href={data.loginURL}>로그인</a>) || null
            }}
          </Query>
        </div>
      </div>
    </div>
  )
}

export default Header
