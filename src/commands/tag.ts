import { Command } from 'discord-akairo'
import { Message } from 'discord.js'

export default class extends Command {
  constructor() {
    super('tag', {
      aliases: ['tag'],
      args: [
        {
          id: 'tag',
          type: 'string',
          default: null,
        },
      ],
    })
  }
  async exec(msg: Message, { tag }: { tag: string }) {
    if (!tag) {
      return msg.reply(
        `available tags: ${(await global.prisma.tag.findMany())
          .map((r) => '`' + r.id + '`')
          .join(', ')}`,
      )
    }
    const t = await global.prisma.tag.findUnique({
      where: {
        id: tag,
      },
    })
    if (!t) return msg.reply('Unknown tag.')
    return msg.reply(t.res)
  }
}
