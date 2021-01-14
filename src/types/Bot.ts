import { Field, ID, ObjectType, Resolver } from 'type-graphql'
import Category from './Category'

@ObjectType()
@Resolver(Bot)
class Bot {
  @Field((type) => ID)
  id: string

  @Field()
  name: string

  @Field()
  avatarURL: string

  @Field()
  trusted: boolean

  @Field()
  discordVerified: boolean

  @Field()
  guilds: number

  @Field()
  status: string

  @Field()
  brief: string

  @Field()
  description: string

  @Field((type) => [Category])
  categories: Category[]

  @Field()
  invite: string

  @Field()
  website: string

  @Field()
  git: string

  @Field()
  support: string

  @Field()
  prefix: string
}

export default Bot
