import { Arg, Mutation, Query, Resolver } from "type-graphql";

@Resolver()
export default class {
    @Query(returns => String)
    test() {
        return 'asdf'
    }

    @Mutation(returns => String, {nullable: true})
    async login(@Arg('code') code: string) {
        console.log(code)
    }
}