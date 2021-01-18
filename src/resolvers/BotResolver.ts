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
import User from '../types/User'
import Library from '../types/Library'
import BotUpdateInfo from '../inputs/BotUpdateInfo'
import crypto from 'crypto'
import Heart from '../types/Heart'

@Resolver(Bot)
export default class {
  @Mutation((returns) => Boolean)
  async editBot(@Ctx() ctx, @Arg('data') data: BotUpdateInfo) {
    const schema = yup.object().shape({
      id: yup.string().required(),
      brief: yup.string().required(),
      description: yup.string().required(),
      git: yup.string().url(),
      library: yup
        .string()
        .required()
        .test({
          test: async (value) => {
            const lib = await Util.prisma.library.findUnique({
              where: { id: value },
            })
            return Boolean(lib)
          },
        }),
      prefix: yup.string().required(),
      website: yup.string().url(),
      category: yup.array().min(1).required().of(yup.string()),
      invite: yup.string().url().required(),
      owners: yup
        .array()
        .min(1)
        .of(yup.string())
        .test({
          test: async (value) => {
            for (const i of value) {
              if (!(await Util.prisma.user.findUnique({ where: { id: i } }))) {
                return false
              }
            }
            return true
          },
        }),
    })
    await schema.validate(data)
    const bot = await Util.prisma.bot.findUnique({
      where: {
        id: data.id,
      },
      include: {
        owner: true,
      },
    })
    if (!bot) throw new ApolloError('Bot not found.', 'ERR_UNKNOWN_BOT')
    if (!bot.owner.find((r) => r.id === ctx.user?.id))
      throw new ApolloError(
        'You must be an owner of the bot',
        'ERR_UAUTHORIZED',
      )
    const {
      id,
      library,
      brief,
      category,
      description,
      git,
      invite,
      owners,
      prefix,
      support,
      website,
    } = data

    await Util.prisma.bot.update({
      where: {
        id,
      },
      data: {
        library: {
          connect: {
            id: library,
          },
        },
        brief,
        categories: {
          connect: category.map((r) => ({ id: r })),
        },
        description: description,
        git,
        invite,
        owner: {
          connect: owners.map((r) => ({ id: r })),
        },
        prefix,
        support,
        website,
      },
    })
    return true
  }

  @Mutation((returns) => Boolean)
  async addBot(@Ctx() ctx, @Arg('data') data: BotAddInfo) {
    if (!ctx.user)
      throw new ApolloError(
        'Login is required to add bot',
        'ERR_LOGIN_REQUIRED',
      )
    const urlValidator = yup.string().url().notRequired()

    const {
      id,
      brief,
      description,
      git,
      library,
      prefix,
      website,
      category,
      support,
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
          {
            name: '신청자',
            value: `<@${ctx.user.id}>`,
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
      Util.getBotQuery(bot.id) + '.avatarURL?.({size: 4096, format: "png"}) || ""',
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

  @Query((returns) => Bot)
  async bot(@Arg('id') id: string, @Ctx() ctx) {
    if (id === 'me' && ctx.bot) id = ctx.bot.id
    const data = await Util.prisma.bot.findUnique({
      where: {
        id,
      },
    })
    if (!data) return null
    return data
  }

  @FieldResolver((returns) => [User])
  async owners(@Root() bot: Bot) {
    return Util.prisma.user.findMany({
      where: {
        bots: {
          some: {
            id: bot.id,
          },
        },
      },
    })
  }

  @FieldResolver((returns) => Boolean)
  async isOwner(@Root() bot: Bot, @Ctx() ctx: any) {
    return Util.prisma.user
      .findMany({
        where: {
          bots: {
            some: {
              id: bot.id,
            },
          },
        },
      })
      .then((r) => Boolean(r.find((r) => r.id === ctx.user?.id)))
  }

  @FieldResolver((returns) => Library)
  async library(@Root() bot: Bot) {
    return Util.prisma.bot
      .findFirst({
        where: {
          id: bot.id,
        },
        include: {
          library: true,
        },
      })
      .then((r) => r.library)
  }

  @FieldResolver((type) => String, { nullable: true })
  async token(
    @Root() parent: Bot,
    @Ctx() ctx,
    @Arg('regenerate', (type) => Boolean, {
      nullable: true,
    })
    regenerate: boolean,
  ) {
    const bot = await Util.prisma.bot.findUnique({
      where: {
        id: parent.id,
      },
      include: {
        owner: true,
      },
    })
    if (!bot.owner.find((r) => ctx.user?.id === r.id)) return null
    if (!bot.token || regenerate) {
      const salt = crypto.randomBytes(1024).toString('base64')
      const str = bot.id + salt
      const token = crypto
        .createHash('sha512')
        .update(str)
        .digest('base64')
        .toString()
      await Util.prisma.bot.update({
        data: {
          token,
        },
        where: {
          id: bot.id,
        },
      })
      return token
    }
    if (bot.token) return bot.token
  }

  @FieldResolver()
  async guilds(
    @Root() bot: Bot,
    @Ctx() ctx: any,
    @Arg('patch', (type) => Number, {
      nullable: true,
    })
    patch?: number,
  ): Promise<number> {
    if (ctx.bot && ctx.bot.id === bot.id && typeof patch === 'number') {
      await Util.prisma.bot.update({
        data: {
          guilds: patch,
        },
        where: {
          id: bot.id,
        },
      })
      return patch
    }
    return bot.guilds
  }

  @FieldResolver((returns) => [Heart])
  async hearts(@Root() bot: Bot) {
    return Util.prisma.heart.findMany({
      where: {
        toID: bot.id,
      }
    })
  }

  @FieldResolver((returns) => Boolean)
  async heartClicked(
    @Root() bot: Bot,
    @Arg('patch', (type) => Boolean, { nullable: true }) patch: boolean,
    @Ctx() ctx,
    @Arg('user', { nullable: true }) user: string,
  ) {
    if (user) {
      return Boolean(
        await Util.prisma.heart.findFirst({
          where: {
            fromID: user,
            toID: bot.id
          },
        }),
      )
    }
    if (!ctx.user) {
      return false
    }
    if (typeof patch === 'boolean') {
      const h = await Util.prisma.heart.findFirst({
        where: {
          fromID: ctx.user.id,
          toID: bot.id
        },
      })
      if (patch && h) return patch
      if (!patch && h) {
        await Util.prisma.heart.delete({
          where: {
            id: h.id,
          },
        })
      } else {
        await Util.prisma.heart.create({
          data: {
            from: {
              connect: {
                id: ctx.user.id,
              },
            },
            to: {
              connect: {
                id: bot.id,
              },
            },
          },
        })
      }
      return patch
    }
    return Boolean(
      await Util.prisma.heart.findFirst({
        where: {
          fromID: ctx.user.id,
          toID: bot.id
        },
      }),
    )
  }
}
