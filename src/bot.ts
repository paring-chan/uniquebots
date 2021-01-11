import UBClient from './client'
// @ts-ignore
import config from '../config.json'
import { PrismaClient } from '@prisma/client'

// @ts-ignore
global.config = config

declare global {
  namespace NodeJS {
    interface Global {
      prisma: PrismaClient
    }
  }
}

global.prisma = new PrismaClient()

const client = new UBClient()

client.login(config.botToken).then(() => console.log('Logged in'))
