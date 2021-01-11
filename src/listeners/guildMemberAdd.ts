import { Listener } from 'discord-akairo'
import { GuildMember } from 'discord.js'
// @ts-ignore
import config from '../../config.json'

export default class extends Listener {
  constructor() {
    super('guildMemberAdd', {
      event: 'guildMemberAdd',
      emitter: 'client',
    })
  }
  async exec(member: GuildMember) {
    if (member.user.bot) {
      await member.roles.add(config.pendingRole)
    }
  }
}
