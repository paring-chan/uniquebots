import React from 'react'
import { NextPage, NextPageContext } from 'next'
import { getApolloClient } from '../lib/apollo'
import { gql } from 'apollo-boost'
import { useSnackbar } from 'notistack'
import Router from 'next/router'

const EditProfile: NextPage = ({ user }: any) => {
  const [desc, setDesc] = React.useState(user.description as string)
  const { enqueueSnackbar } = useSnackbar()
  return (
    <div>
      <div className="text-2xl">프로필 수정하기</div>
      <div>
        <label className="block mt-4">
          <span>소개</span>
          <input
            type="text"
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            placeholder="소개를 입력해주세요(최대 50자)"
            maxLength={50}
            className="w-full p-2 rounded-md border-gray-300 dark:bg-discord-black border dark:border-white focus:border-blue-600 transition-colors"
          />
        </label>
      </div>
      <button
        className="bg-purple-600 w-full p-2 rounded-md mt-2"
        onClick={async () => {
          const apollo = getApolloClient()
          apollo.query({
            query: gql`
              query($description: String!) {
                me {
                  id
                  description(update: $description)
                }
              }
            `,
            variables: {
              description: desc,
            },
          })
          enqueueSnackbar('프로필이 저장되었습니다!', {
            variant: 'success',
          })
          await Router.push('/profile/[id]', `/profile/${user.id}`)
        }}
      >
        저장하기
      </button>
    </div>
  )
}

export const getServerSideProps = async (ctx: NextPageContext) => {
  const apollo = getApolloClient(ctx)
  const data = await apollo.query({
    query: gql`
      query {
        me {
          id
          description
        }
      }
    `,
  })
  if (!data.data.me)
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    }
  return { props: { user: data.data.me } }
}

export default EditProfile
