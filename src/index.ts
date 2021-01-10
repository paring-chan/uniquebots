import express = require('express')
import 'reflect-metadata'
import { buildSchema } from 'type-graphql'
import QueryResolver from './resolvers/DefaultResolver'
import cors from 'cors'
// @ts-ignore
import * as config from '../config.json'
import { ApolloServer, GraphQLExtension } from 'apollo-server-express'
import jwt from 'jsonwebtoken'
import UserResolver from './resolvers/UserResolver'
import Util from './Util'
import BotResolver from './resolvers/BotResolver'
import { DocumentNode, parse, print, printSchema } from 'graphql'
import fs from 'fs'
import * as path from 'path'
import { Request } from 'express'
import { Client } from 'discord.js'
import chalk = require('chalk')
;(async () => {
  const schema = await buildSchema({
    resolvers: [QueryResolver, UserResolver, BotResolver],
  })

  // For webstorm intellisense
  fs.writeFileSync(path.join(process.cwd(), 'schema.gql'), printSchema(schema))

  const app = express()

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

  app.listen(config.port, () => console.log('Listening'))
})()
