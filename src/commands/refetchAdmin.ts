import { Command } from 'discord-akairo'
import { Message } from 'discord.js'

export default class extends Command {
  constructor() {
    super('refetchAdmin', {
      aliases: ['refetchAdmin'],
      ownerOnly: true,
    })
  }
  async exec(msg: Message) {
    const users = await global.prisma.user.findMany()
    const owners = users.filter((r) => r.permissions & 1).map((r) => r.id)
    this.client.ownerID = owners
    this.client.dokdo.options.owners = owners
    return msg.reply(`스태프 목록을 다시 불러왔습니다(${owners.length}명)`)
  }
}
