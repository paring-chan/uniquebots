import { ApolloError } from 'apollo-server-express'
import { Arg, Ctx, FieldResolver, Resolver, Root } from 'type-graphql'
import Permissions, { Permission } from '../Permisisons'
import Bot from '../types/Bot'
import User from '../types/User'
import Util from '../Util'

@Resolver(User)
export default class {
  @FieldResolver()
  async tag(@Root() parent: User) {
    const data = await Util.getUser(parent.id)
    return data.username + '#' + data.discriminator
  }

  @FieldResolver()
  async avatarURL(@Root() parent: User) {
    const data = await Util.getUser(parent.id)
    return data.avatar
      ? `https://cdn.discordapp.com/avatars/${data.id}/${data.avatar}.png?size=4096`
      : `https://cdn.discordapp.com/embed/avatars/${
          Number(data.discriminator) % 5
        }.png`
  }

  @FieldResolver((returns) => Boolean)
  async admin(@Root() parent: User) {
    const data = await Util.getUser(parent.id)
    return Permissions.has(data.permissions, Permission.ADMIN)
  }

  @FieldResolver((returns) => Boolean)
  async hasPermission(
    @Root() parent: User,
    @Arg('perm', (type) => Permission) perm: Permission,
  ) {
    const data = await Util.getUser(parent.id)
    return (
      Permissions.has(data.permissions, perm) ||
      Permissions.has(data.permissions, Permission.ADMIN)
    )
  }

  @FieldResolver((returns) => [Bot])
  async bots(@Root() user: User) {
    const data = await Util.getUser(user.id)
    return Util.prisma.bot.findMany({
      where: {
        pending: false,
        owner: {
          some: {
            id: data.id,
          },
        },
      },
    })
  }

  @FieldResolver((returns) => String)
  async description(
    @Ctx() ctx,
    @Root() user: User,
    @Arg('update', { nullable: true }) update?: string,
  ) {
    const data = await Util.getUser(user.id)
    if (typeof update !== 'string' || ctx.user?.id !== data.id)
      return data.description
    if (update.length > 50)
      throw new ApolloError(
        '유저 설명은 50자를 넘을 수 없습니다.',
        'ERR_TEXT_TOO_LONG',
      )
    await Util.prisma.user.update({
      data: {
        description: update,
      },
      where: {
        id: data.id,
      },
    })
    return update
  }
}
