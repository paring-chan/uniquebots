import { Field, ID, ObjectType } from "type-graphql"

@ObjectType()
class Category {
  @Field((type) => ID)
  id: string

  @Field()
  name: string
}

export default Category
