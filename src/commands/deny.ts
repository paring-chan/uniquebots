import { Command } from 'discord-akairo'
import { GuildMember } from 'discord.js'
import { Message } from 'discord.js'

export default class extends Command {
  constructor() {
    super('deny', {
      aliases: ['deny'],
      args: [
        {
          id: 'bot',
          type: 'member|string',
        },
        {
          id: 'reason',
          type: 'string',
          match: 'rest',
        },
      ],
      ownerOnly: true,
    })
  }
  async exec(
    msg: Message,
    { bot, reason }: { bot: GuildMember | string; reason: string },
  ) {
    const { prisma } = global
    const d = await prisma.bot.findUnique({
      where: {
        id: typeof bot === 'string' ? bot : bot.id,
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
        approved: false,
        pending: false,
        denyReason: reason,
      },
    })
    const b = msg.guild.members.cache.get(
      typeof bot === 'string' ? bot : bot.id,
    )
    if (b) {
      await b.kick('봇이 승인 거부되었습니다')
    }
    const owner = await prisma.user.findFirst({
      where: {
        bots: {
          some: {
            id: typeof bot === 'string' ? bot : bot.id,
          },
        },
      },
    })
    await prisma.bot.delete({
      where: {
        id: typeof bot === 'string' ? bot : bot.id,
      },
    })
    const o = msg.guild.members.cache.get(owner.id)
    await o
      .send(
        `신청하신 봇 ${
          typeof bot === 'string' ? bot : bot.user.tag
        }이(가) 거부되었습니다.\n사유: ${reason}`,
      )
      .catch(() => null)
    return msg.reply('denied.')
  }
}
