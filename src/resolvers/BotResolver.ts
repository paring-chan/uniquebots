import { ApolloError } from 'apollo-server-express'
import { Arg, Ctx, Mutation, Resolver } from 'type-graphql'
import Util, { URL } from '../Util'

@Resolver()
export default class {
  @Mutation((returns) => Boolean)
  async addBot(
    @Ctx() ctx,
    @Arg('id') id: string,
    @Arg('category', (type) => [String], { validate: false })
    category: string[],
    @Arg('brief') brief: string,
    @Arg('description') description: string,
    @Arg('library', { nullable: true }) library: string,
    @Arg('website', { nullable: true }) website: URL,
    @Arg('git', { nullable: true }) git: URL,
    @Arg('prefix') prefix: string,
    @Arg('support', { nullable: true }) support: URL,
  ) {
    if (!ctx.user)
      throw new ApolloError(
        'Login is required to add bot',
        'ERR_LOGIN_REQUIRED',
      )

    if (!id) throw new ApolloError('ID is required.', 'VALIDATION_ERROR')
    if (!brief) throw new ApolloError('Brief is required.', 'VALIDATION_ERROR')
    if (!description)
      throw new ApolloError('Description is required.', 'VALIDATION_ERROR')

    if (
      await Util.prisma.bot.findUnique({
        where: {
          id,
        },
      })
    )
      throw new ApolloError('Bot already exists.', 'ERR_BOT_ALREADY_EXISTS')

    if (brief.length > 50)
      throw new ApolloError(
        'Max length of brief is 50 characters.',
        'VALIDATION_ERRROR',
      )
    if (description.length > 5000)
      throw new ApolloError(
        'Max length of description is 5000 characters.',
        'VALIDATION_ERRROR',
      )
    if (prefix.length > 10)
      throw new ApolloError(
        'Max length of prefix is 10 characters.',
        'VALIDATION_ERRROR',
      )

    const lib = await Util.prisma.library.findUnique({
      where: {
        id: library,
      },
    })

    if (!lib) throw new ApolloError('Library Not Found', 'VALIDATION_ERROR')

    if (category.length === 0)
      throw new ApolloError('Category must be at least 1.', 'VALIDATION_ERROR')

    const categories = await Util.prisma.category.findMany()

    for (const c of category) {
      if (!categories.find((r) => r.id === c))
        throw new ApolloError(`Category '${c}' not found`, 'VALIDATION_ERROR')
    }
    await Util.prisma.bot.create({
      data: {
        id,
        prefix,
        avatarURL: 'https://cdn.discordapp.com/embed/avatars/0.png',
        library: {
          connect: {
            id: lib.id,
          },
        },
        username: '',
        git: git as string,
        website: website as string,
        support: support as string,
        owner: {
          connect: {
            id: ctx.user.id,
          },
        },
        categories: {
          connect: category.map((r) => ({ id: r })),
        },
      },
    })

    return true
  }
}
