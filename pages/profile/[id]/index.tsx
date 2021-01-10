import React, { Component } from 'react'
import { NextPageContext } from 'next'
import { getApolloClient } from '../../../lib/apollo'
import { gql } from 'apollo-boost'
import { NextSeo } from 'next-seo'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Tippy from '@tippyjs/react'

class Profile extends Component<any> {
  render() {
    console.log(this.props.user)
    return (
      <>
        <NextSeo
          title={this.props.user.tag}
          openGraph={{
            images: [
              {
                url: this.props.user.avatarURL,
              },
            ],
            title: this.props.user.tag,
            description: `${this.props.user.tag}님의 프로필입니다.`,
          }}
          description={`${this.props.user.tag}님의 프로필입니다.`}
        />
        <div className="grid gap-2 pt-4">
          <div className="lg:flex">
            <div className="lg:w-1/2 flex text-center justify-center lg:justify-end">
              <div className="lg:w-1/2 w-3/4">
                <img
                  src={this.props.user.avatarURL}
                  alt="Avatar"
                  className="w-full rounded-3xl shadow-xl"
                />
              </div>
            </div>
            <div className="lg:w-1/2 lg:pl-2 text-center lg:text-left pt-2 lg:pt-0">
              <div className="text-3xl">{this.props.user.tag}</div>
              <div>
                {this.props.user.admin && (
                  <Tippy content="관리자">
                    <div className="inline-block">
                      <FontAwesomeIcon icon={['fas', 'user-cog']} size="2x" />
                    </div>
                  </Tippy>
                )}
              </div>
            </div>
          </div>
        </div>
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
          }
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
  return { props: { user: data.data.profile } }
}

export default Profile
