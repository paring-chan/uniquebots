import express = require('express')
import 'reflect-metadata'
import { buildSchema } from "type-graphql"
import QueryResolver from "./resolvers/DefaultResolver"
import cors from 'cors'
// @ts-ignore
import * as config from '../config.json'
import { ApolloServer } from 'apollo-server-express'

(async () => {
    const schema = await buildSchema({
        resolvers: [QueryResolver]
    })

    const app = express()

    app.use(cors())

    const apollo = new ApolloServer({
        schema
    })

    apollo.applyMiddleware({app})

    app.listen(config.port, () => console.log('Listening'))
})()