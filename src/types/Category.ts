import { Field, ID, ObjectType } from 'type-graphql'
import Bot from './Bot'

@ObjectType()
class Category {
  @Field((type) => ID)
  id: string

  @Field()
  name: string

  @Field((type) => [Bot])
  bots: Bot[]
}

export default Category
