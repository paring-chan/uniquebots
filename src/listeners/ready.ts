import { Listener } from 'discord-akairo'
import { Team } from 'discord.js'
import Dokdo from 'dokdo'

export default class extends Listener {
  constructor() {
    super('ready', {
      event: 'ready',
      emitter: 'client',
    })
  }
  async exec() {
    const users = await global.prisma.user.findMany()
    const owners = users.filter((r) => r.permissions & 1).map((r) => r.id)
    this.client.ownerID = owners
    this.client.dokdo = new Dokdo(this.client, {
      noPerm(msg) {
        return msg.react('❌')
      },
      owners,
      prefix: '!',
    })
    this.client.on('message', (msg) => this.client.dokdo.run(msg))
    this.client.socket.connect()
    console.log('Bot Ready!')
  }
}
