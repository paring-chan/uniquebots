import express = require("express")
import "reflect-metadata"
import { buildSchema } from "type-graphql"
import QueryResolver from "./resolvers/DefaultResolver"
import cors from "cors"
// @ts-ignore
import * as config from "../config.json"
import { ApolloServer } from "apollo-server-express"
import jwt from "jsonwebtoken"
import UserResolver from "./resolvers/UserResolver"
import Util from "./Util"
import BotResolver from "./resolvers/BotResolver"
;(async () => {
  const schema = await buildSchema({
    resolvers: [QueryResolver, UserResolver, BotResolver],
  })

  const app = express()

  app.use(cors())

  const apollo = new ApolloServer({
    schema,
    context: async ({ req }) => {
      let result = {} as any
      if (req.headers.authorization) {
        if (req.headers.authorization.startsWith("Bearer ")) {
          const token = req.headers.authorization.slice("Bearer ".length)
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
  })

  apollo.applyMiddleware({ app })

  app.listen(config.port, () => console.log("Listening"))
})()
