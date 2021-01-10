import {
  Field,
  FieldResolver,
  ID,
  ObjectType,
  Resolver,
  Root,
} from 'type-graphql'
import Util from '../Util'

@ObjectType()
@Resolver(Bot)
class Bot {
  @Field((type) => ID)
  id: string

  @Field()
  name: string

  @Field()
  avatarURL: string
}

export default Bot
