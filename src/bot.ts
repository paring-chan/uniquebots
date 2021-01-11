import UBClient from './client'
// @ts-ignore
import config from '../config.json'

// @ts-ignore
global.config = config

const client = new UBClient()

client.login(config.botToken).then(() => console.log('Logged in'))
