import { Command } from 'discord-akairo'
import { Message } from 'discord.js'

export default class extends Command {
  constructor() {
    super('addtag', {
      aliases: ['addtag'],
      args: [
        {
          id: 'q',
          type: 'string',
          prompt: {
            start: '태그를 입력해주세요',
          },
        },
        {
          id: 'a',
          type: 'string',
          prompt: {
            start: '내용을 입력해주세요',
          },
          match: 'rest',
        },
      ],
      userPermissions: 'ADMINISTRATOR',
    })
  }
  async exec(msg: Message, { q, a }: { q: string; a: string }) {
    if (
      await global.prisma.tag.findUnique({
        where: {
          id: q,
        },
      })
    )
      return msg.reply('tag already exists')
    await global.prisma.tag.create({
      data: {
        id: q,
        res: a,
      },
    })
    return msg.reply('created tag.')
  }
}
