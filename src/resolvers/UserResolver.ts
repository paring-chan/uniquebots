import { FieldResolver, Resolver, Root } from "type-graphql"
import User from "../types/User"
import Util from "../Util"

@Resolver(User)
export default class {
  @FieldResolver()
  async tag(@Root() parent: User) {
    const data = await Util.getUser(parent.id)
    return data.username + "#" + data.discriminator
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

  @FieldResolver()
  async admin(@Root() parent: User) {
    const data = await Util.getUser(parent.id)
    return data.admin
  }
}
