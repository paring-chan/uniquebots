import { Field, ID, ObjectType } from 'type-graphql'

@ObjectType()
class Bot {
  @Field((type) => ID)
  id: string

  @Field()
  name: string

  @Field()
  avatarURL: string
}

export default Bot
