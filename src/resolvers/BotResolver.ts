import { ApolloError } from "apollo-server-express"
import { Arg, Ctx, Mutation, Resolver } from "type-graphql"
import Util from "../Util"

@Resolver()
export default class {
  @Mutation((returns) => Boolean)
  async addBot(
    @Ctx() ctx,
    @Arg("id") id: string,
    @Arg("category", (type) => [String]) category: string[],
    @Arg("brief") brief: string,
    @Arg("description") description: string
  ) {
    if (!ctx.user) return false
    const categories = await Util.prisma.category.findMany()
    for (const c of category) {
      if (!categories.find((r) => r.id === c))
        throw new ApolloError(`Category '${c}' not found`)
    }
    return true
  }
}
