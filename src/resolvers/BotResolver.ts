import { ApolloError } from 'apollo-server-express'
import {
  Arg,
  Ctx,
  FieldResolver,
  Mutation,
  Query,
  Resolver,
  Root,
} from 'type-graphql'
import Util from '../Util'
import BotAddInfo from '../inputs/BotAddInfo'
import * as yup from 'yup'
import { MessageEmbed } from 'discord.js'
import Bot from '../types/Bot'
// @ts-ignore
import config from '../../config.json'

@Resolver(Bot)
export default class {
  @Mutation((returns) => Boolean)
  async addBot(@Ctx() ctx, @Arg('data') data: BotAddInfo) {
    if (!ctx.user)
      throw new ApolloError(
        'Login is required to add bot',
        'ERR_LOGIN_REQUIRED',
      )
    const urlValidator = yup.string().url().notRequired()

    const {
      brief,
      category,
      description,
      git,
      id,
      library,
      prefix,
      support,
      website,
      invite,
    } = data

    await Promise.all(
      [support, website, website, invite].map((it) =>
        urlValidator.validate(it),
      ),
    )

    if (!id) throw new ApolloError('ID is required.', 'VALIDATION_ERROR')
    if (!brief) throw new ApolloError('Brief is required.', 'VALIDATION_ERROR')
    if (!description)
      throw new ApolloError('Description is required.', 'VALIDATION_ERROR')

    if (
      await Util.prisma.judge.findFirst({
        where: {
          bot: {
            owner: {
              some: {
                id: ctx.user.id,
              },
            },
          },
          pending: true,
        },
      })
    )
      throw new ApolloError(
        '심사 대기중인 봇이 있습니다.',
        'ERR_BOT_ALREADY_EXISTS',
      )

    if (
      await Util.prisma.bot.findUnique({
        where: {
          id,
        },
      })
    )
      throw new ApolloError('봇이 이미 존재합니다..', 'ERR_BOT_ALREADY_EXISTS')

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
    const b = await Util.prisma.judge.create({
      data: {
        bot: {
          create: {
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
            brief,
            description,
            invite:
              invite ||
              `${Util.DISCORD_API_ENDPOINT}/oauth2/authorize?client_id=${id}&scope=bot&perimssions=0`,
          },
        },
        botID: id,
      },
    })

    await Util.sendOperator(
      new MessageEmbed({
        title: '새로운 봇이 등록되었습니다.',
        fields: [
          {
            name: '심사 ID',
            value: b.id,
            inline: true,
          },
          {
            name: '봇 ID',
            value: id,
            inline: true,
          },
          {
            name: '초대 링크',
            value: `[클릭](${Util.DISCORD_API_ENDPOINT}/oauth2/authorize?client_id=${b.botID}&scope=bot&permissions=0&guild_id=${config.guild})`,
            inline: true,
          },
          {
            name: '접두사',
            value: prefix,
            inline: true,
          },
        ],
      }),
    )

    return true
  }

  @Query((returns) => [Bot])
  async bots() {
    return Util.prisma.bot.findMany({
      where: {
        pending: false,
      },
    })
  }

  @FieldResolver()
  async avatarURL(@Root() bot: Bot) {
    let data = (await Util.evaluate(
      Util.getBotQuery(bot.id) + '.avatarURL?.() || ""',
    )) as string
    if (data) {
      await Util.prisma.bot.update({
        data: {
          avatarURL: data,
        },
        where: {
          id: bot.id,
        },
      })
    } else {
      data = await Util.prisma.bot
        .findUnique({
          where: {
            id: bot.id,
          },
        })
        .then((r) => r.avatarURL)
    }
    return data
  }

  @FieldResolver()
  async name(@Root() bot: Bot) {
    let data = (await Util.evaluate(
      Util.getBotQuery(bot.id) + '.username || ""',
    )) as string
    if (data) {
      await Util.prisma.bot.update({
        data: {
          username: data,
        },
        where: {
          id: bot.id,
        },
      })
    } else {
      data = await Util.prisma.bot
        .findUnique({
          where: {
            id: bot.id,
          },
        })
        .then((r) => r.username)
    }
    return data
  }

  @FieldResolver()
  async discordVerified(@Root() bot: Bot) {
    let data = (await Util.evaluate(
      Util.getBotQuery(bot.id) + '.flags?.has?.("VERIFIED_BOT") || false',
    )) as boolean
    if (data) {
      await Util.prisma.bot.update({
        data: {
          discordVerified: data,
        },
        where: {
          id: bot.id,
        },
      })
    } else {
      data = await Util.prisma.bot
        .findUnique({
          where: {
            id: bot.id,
          },
        })
        .then((r) => r.discordVerified)
    }
    return data
  }
  @FieldResolver()
  async status(@Root() bot: Bot) {
    let data = (await Util.evaluate(
      Util.getBotQuery(bot.id) + '.presence?.status || "offline"',
    )) as string
    if (data) {
      await Util.prisma.bot.update({
        data: {
          status: data,
        },
        where: {
          id: bot.id,
        },
      })
    } else {
      data = await Util.prisma.bot
        .findUnique({
          where: {
            id: bot.id,
          },
        })
        .then((r) => r.status)
    }
    return data
  }

  @FieldResolver()
  async categories(@Root() bot: Bot) {
    return Util.prisma.category.findMany({
      where: {
        bots: {
          some: {
            id: bot.id,
          },
        },
      },
    })
  }
}
