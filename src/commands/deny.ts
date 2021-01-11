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
          type: 'member',
        },
        {
          id: 'reason',
          type: 'string',
          match: 'rest',
        },
      ],
      userPermissions: 'ADMINISTRATOR',
    })
  }
  async exec(
    msg: Message,
    { bot, reason }: { bot: GuildMember; reason: string },
  ) {
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
        approved: false,
        denyReason: reason,
      },
    })
    await bot.kick('봇이 승인 거부되었습니다')
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
    await o.send(
      `신청하신 봇 ${bot.user.tag}이(가) 거부되었습니다.\n사유: ${reason}`,
    )
    return msg.reply('denied.')
  }
}
