import { PrismaClient } from '@prisma/client'
import { Collection, Message, MessageEmbed, WebhookClient } from 'discord.js'
import fetch, { RequestInfo, RequestInit, Response } from 'node-fetch'
// @ts-ignore
import config from '../config.json'
import http from 'http'
import SocketIO from 'socket.io'
import { v4 } from 'uuid'

export default class Util {
  static async safeFetch(
    info: RequestInfo,
    init: RequestInit,
  ): Promise<Response> {
    return new Promise(async (resolve, reject) => {
      let rejected = false
      const data = (await fetch(info, init).catch(() => {
        rejected = true
        return reject()
      })) as Response
      if (rejected) return
      if (data.status === 429) {
        // @ts-ignore
        return new Promise(async (resolve1) =>
          setTimeout(
            await data.json().then((r) => r.retry_after),
            resolve1 as any,
          ),
        ).then(() => resolve(this.safeFetch(info, init)))
      }

      resolve(data)
    })
  }

  static getBotQuery(id: string) {
    return `this.guilds.cache.get(config.guild).members.cache.get(${JSON.stringify(
      id,
    )})?.user`
  }

  static DISCORD_API_ENDPOINT = 'https://discord.com/api/v8'

  static prisma = new PrismaClient({
    log: ['info', 'error', 'query', 'warn'],
  })

  static async getUser(id: string) {
    return await Util.prisma.user.findUnique({
      where: {
        id,
      },
    })
  }

  static webhook = new WebhookClient(
    ...(config.webhook.split('/') as [string, string]),
  )

  static sendOperator(embed: MessageEmbed): Promise<Message | Message[]> {
    return this.webhook.send(`<@&${config.operatorRole}>`, embed)
  }

  static app: Express.Application

  static http: http.Server

  static io: SocketIO.Server

  static evalMap = new Collection<string, Function>()

  static evaluate(code: string) {
    return new Promise((resolve) => {
      const id = v4()
      this.evalMap.set(id, resolve)
      this.io.sockets.emit('eval', {
        id,
        code,
      })
    })
  }
}
