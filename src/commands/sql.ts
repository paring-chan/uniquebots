import { Command } from 'discord-akairo'
import { Message } from 'discord.js'
import { ProcessManager } from 'dokdo'

export default class extends Command {
  constructor() {
    super('sql', {
      aliases: ['sql'],
      ownerOnly: true,
      args: [
        {
          id: 'operation',
          default: null,
          type: 'string',
        },
        {
          id: 'query',
          default: null,
          type: 'string',
        },
      ],
    })
  }
  async exec(
    msg: Message,
    { query, operation }: { query: string; operation: string },
  ) {
    if (!['query', 'execute'].includes(operation) || !query)
      return msg.reply('사용법: !sql <query|execute> <쿼리>')
    if (operation === 'query') {
      const data = await global.prisma.$queryRaw(query)
      const pm = new (ProcessManager as any)(
        msg,
        require('util').inspect(data),
        this.client.dokdo,
        {
          lang: 'json',
          secrets: (
            await global.prisma.bot.findMany({ select: { token: true } })
          ).map((r) => r.token),
        },
      )
      await pm.init()
      await pm.addAction([
        {
          emoji: '⏹️',
          action: ({ manager }) => manager.destroy(),
          requirePage: true,
        },
        {
          emoji: '◀️',
          action: ({ manager }) => manager.previousPage(),
          requirePage: true,
        },
        {
          emoji: '▶️',
          action: ({ manager }) => manager.nextPage(),
          requirePage: true,
        },
      ])
    } else {
    }
  }
}
