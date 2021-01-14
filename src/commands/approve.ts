import { Command } from 'discord-akairo'
import { GuildMember } from 'discord.js'
import { Message } from 'discord.js'
// @ts-ignore
import config from '../../config.json'

export default class extends Command {
  constructor() {
    super('approve', {
      aliases: ['approve'],
      args: [
        {
          id: 'bot',
          type: 'member',
        },
      ],
      userPermissions: 'ADMINISTRATOR',
    })
  }
  async exec(msg: Message, { bot }: { bot: GuildMember }) {
    const { prisma } = global
    const d = await prisma.bot.findUnique({
      where: {
        id: bot.id,
      },
    })
    if (!d) return msg.reply('unknown bot')
    const j = await prisma.judge.findFirst({
      where: {
        pending: true,
        AND: {
          bot: {
            id: d.id,
          },
        },
      },
    })
    if (!j) return msg.reply('unknown judge')
    await prisma.judge.update({
      where: {
        id: j.id,
      },
      data: {
        approved: true,
        pending: false,
        bot: {
          update: {
            pending: false,
          },
        },
      },
    })
    await bot.roles.remove(config.pendingRole)
    await bot.roles.add(config.botRole)
    const owner = await prisma.user.findFirst({
      where: {
        bots: {
          some: {
            id: bot.id,
          },
        },
      },
    })
    const o = msg.guild.members.cache.get(owner.id)
    o.roles.add(config.devRole)
    await o
      .send(`신청하신 봇 ${bot.user.tag}이(가) 승인되었습니다.`)
      .catch((e) => null)
    return msg.reply('approved.')
  }
}
