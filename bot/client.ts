import chalk from 'chalk'
import { AkairoClient, CommandHandler, ListenerHandler } from 'discord-akairo'
import Dokdo from 'dokdo'
import path from 'path'
import ioc from 'socket.io-client'
// @ts-ignore
import config from '../config.json'

declare module 'discord.js' {
  interface Client {
    commandHandler: CommandHandler
    listenerHandler: ListenerHandler
    socket: SocketIOClient.Socket
    dokdo: Dokdo
  }
}

export default class UBClient extends AkairoClient {
  constructor() {
    super({
      restTimeOffset: 0,
    })
    this.listenerHandler = new ListenerHandler(this, {
      directory: path.join(__dirname, 'listeners'),
      automateCategories: true,
    })
    this.commandHandler = new CommandHandler(this, {
      directory: path.join(__dirname, 'commands'),
      automateCategories: true,
      commandUtil: true,
      prefix: '!',
    })
    this.listenerHandler.loadAll()
    this.commandHandler.loadAll()
    this.socket = ioc(`http://localhost:${config.port}`, {
      query: {
        auth: config.IPCSecret,
      },
      autoConnect: false,
    })
    this.socket.on('eval', ({ id, code }: { id: string; code: string }) => {
      console.log(
        chalk.blue('BACKEND:EVAL'),
        `Job ID: ${id}, code: ${code.replace('    ', ' ').replace('\n', ' ')}`,
      )
      new Promise((resolve) => resolve(eval(code)))
        .catch((e) => {
          console.log(e)
          return { error: e }
        })
        .then((res) => {
          console.log(chalk.green('EVAL:END'), res)
          this.socket.emit('response', {
            data: res,
            id,
          })
        })
    })
    this.socket.on('connect', () => {
      console.log('Connected to IPC.')
    })
  }
}
