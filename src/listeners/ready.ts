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
    const app = await this.client.fetchApplication()
    let owners
    if (app.owner instanceof Team) {
      owners = app.owner.members.map((i) => i.id)
    } else {
      owners = [app.owner.id]
    }
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
