import express from 'express'
import 'reflect-metadata'
import { buildSchema } from 'type-graphql'
import QueryResolver from './resolvers/DefaultResolver'
import cors from 'cors'
// @ts-ignore
import * as config from '../config.json'
import { ApolloServer } from 'apollo-server-express'
import jwt from 'jsonwebtoken'
import UserResolver from './resolvers/UserResolver'
import Util from './Util'
import BotResolver from './resolvers/BotResolver'
import { parse, print, printSchema } from 'graphql'
import fs from 'fs'
import * as path from 'path'
import http from 'http'
import chalk from 'chalk'
import next from 'next'
;(async () => {
  const schema = await buildSchema({
    resolvers: [QueryResolver, UserResolver, BotResolver],
  })

  // For webstorm intellisense
  fs.writeFileSync(path.join(process.cwd(), 'schema.gql'), printSchema(schema))

  const nextApp = next({ dev: process.env.NODE_ENV !== 'production' })

  await nextApp.prepare()

  const nextHandle = nextApp.getRequestHandler()

  const app = express()

  Util.app = app

  app.use(cors())

  const apollo = new ApolloServer({
    schema,
    context: async ({ req }) => {
      let result = {} as any
      if (req.headers.authorization) {
        if (req.headers.authorization.startsWith('Bearer ')) {
          const token = req.headers.authorization.slice('Bearer '.length)
          try {
            result.user = jwt.verify(token, config.jwtSecret)
          } catch {
            result.user = null
          }
          if (result.user) {
            const data = await Util.getUser(result.user.id)
            if (!data) result.user = null
          }
        }
      }
      return result
    },
    logger: {
      warn(message?: any) {
        console.warn(message)
      },
      debug(message?: any) {
        console.debug(message)
      },
      error(message?: any) {
        console.error(message)
      },
      info(message?: any) {
        console.info(message)
      },
    },
    plugins: [
      {
        requestDidStart(op) {
          if (op.request.operationName === 'IntrospectionQuery') return
          console.log(
            chalk.blue(
              `GQL:${op.request.http.method}${
                op.request.operationName ? `:${op.request.operationName}` : ''
              }`,
            ),
            print(parse(op.request.query))
              .replace(/  /g, '')
              .replace(/\n/g, ' '),
          )
        },
      },
    ],
  })

  apollo.applyMiddleware({ app })

  Util.http = http.createServer(app)

  Util.io = require('socket.io')(Util.http)

  Util.io.use(async (socket, next) => {
    if ((socket.handshake.query as any).auth !== config.IPCSecret)
      return socket.disconnect(true)
    if ((await Util.io.allSockets()).size) return socket.disconnect(true)
    next()
  })
  Util.io.on('connection', async (socket) => {
    console.log(`${chalk.green('IPC:CONNECTED')} IPC CONNECTED TO THIS SERVER.`)
    socket.on('response', (data: { id: string; data: any }) => {
      Util.evalMap.get(data.id)?.(data.data)
    })
  })

  app.use((req, res) => {
    nextHandle(req, res)
  })

  Util.http.listen(config.port, () => console.log('Listening'))
})()
