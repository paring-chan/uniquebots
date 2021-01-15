import { Field, InputType } from 'type-graphql'

@InputType()
export default class BotUpdateInfo {
  @Field()
  id: string

  @Field((type) => [String])
  category: string[]

  @Field()
  brief: string

  @Field()
  description: string

  @Field()
  library: string

  @Field({ nullable: true })
  website: string

  @Field({ nullable: true })
  git: string

  @Field()
  prefix: string

  @Field({ nullable: true })
  support: string

  @Field()
  invite: string

  @Field((type) => [String], { nullable: true })
  owners: string[]
}
