import { Field, ID, ObjectType } from "type-graphql";

@ObjectType()
class User {
    @Field(type => ID)
    id: string

    @Field()
    tag: string

    @Field()
    avatarURL: string
}

export default User