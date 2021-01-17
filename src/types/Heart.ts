import { Field, ID, ObjectType } from 'type-graphql'
import Bot from './Bot'
import User from './User'

@ObjectType()
class Heart {
  fromID: string
  toID: string

  @Field((type) => User)
  from: User

  @Field((type) => Bot)
  to: Bot
}

export default Heart
