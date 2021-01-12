import { Arg, FieldResolver, Resolver, Root } from 'type-graphql'
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
      ? `https://cdn.discordapp.com/avatars/${data.id}/${data.avatar}`
      : `https://cdn.discordapp.com/embed/avatars/${
          Number(data.discriminator) % 5
        }`
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
    return await Util.prisma.bot.findMany({
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
}
