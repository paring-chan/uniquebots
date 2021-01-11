import { Arg, FieldResolver, Query, Resolver, Root } from 'type-graphql'
import Bot from '../types/Bot'
import Category from '../types/Category'
import Util from '../Util'

@Resolver(Category)
export default class {
  @FieldResolver((type) => [Bot])
  async bots(@Root() category: Category) {
    const data = await Util.prisma.bot.findMany({
      where: {
        categories: {
          some: {
            id: category.id,
          },
        },
      },
    })
    return data
  }

  @FieldResolver((returns) => Number)
  async botCount(@Root() category: Category) {
    return Util.prisma.bot.count({
      where: {
        categories: {
          some: {
            id: category.id,
          },
        },
      },
    })
  }

  @Query((returns) => Category, { nullable: true })
  async category(@Arg('id') id: string) {
    const data = await Util.prisma.category.findUnique({
      where: {
        id,
      },
    })
    return data
  }
}
