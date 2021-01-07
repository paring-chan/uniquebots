import { Field, ID, ObjectType } from "type-graphql";

@ObjectType()
class Library {
    @Field(type => ID)
    id: string

    @Field()
    name: string
}

export default Library