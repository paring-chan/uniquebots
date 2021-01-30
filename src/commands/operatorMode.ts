import { Command } from 'discord-akairo'
import { Message } from 'discord.js'
// @ts-ignore
import config from '../../config.json'

export default class extends Command {
  constructor() {
    super('opMode', {
      aliases: ['op'],
      args: [
        {
          default: null,
          id: 'operation',
          type: 'string',
        },
      ],
      ownerOnly: true,
    })
  }
  async exec(msg: Message, { operation }: { operation: string }) {
    if (!['on', 'off'].includes(operation))
      return msg.reply('Usage: !op <on/off>')
    const guild = msg.guild
    if (!guild) return
    if (operation === 'on') {
      await msg.member.roles.add(config.operatorRole)
      return msg.reply('Operator mode enabled.')
    } else {
      await msg.member.roles.remove(config.operatorRole)
      return msg.reply('Operator mode disabled.')
    }
  }
}
