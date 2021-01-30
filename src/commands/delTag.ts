import { Command } from 'discord-akairo'
import { Message } from 'discord.js'

export default class extends Command {
  constructor() {
    super('deltag', {
      aliases: ['deltag'],
      args: [
        {
          id: 'q',
          type: 'string',
          prompt: {
            start: '태그를 입력해주세요',
          },
        },
      ],
      ownerOnly: true
    })
  }
  async exec(msg: Message, { q }: { q: string }) {
    const t = await global.prisma.tag.findUnique({
      where: {
        id: q,
      },
    })
    if (!t) return msg.reply('unknown tag')
    await global.prisma.tag.delete({
      where: {
        id: q,
      },
    })
    return msg.reply('deleted tag.')
  }
}
