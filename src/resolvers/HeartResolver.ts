import { FieldResolver, Resolver, Root } from 'type-graphql'
import Heart from '../types/Heart'
import Util from '../Util'

@Resolver(Heart)
export default class {
  @FieldResolver()
  from(@Root() heart: Heart) {
    return Util.prisma.user.findUnique({
      where: {
        id: heart.fromID,
      },
    })
  }

  @FieldResolver()
  to(@Root() heart: Heart) {
    return Util.prisma.bot.findUnique({
      where: {
        id: heart.toID,
      },
    })
  }
}
