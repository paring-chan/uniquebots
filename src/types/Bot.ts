import { Field, ID, ObjectType, Resolver } from 'type-graphql'

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
}

export default Bot
