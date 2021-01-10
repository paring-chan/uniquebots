import UBClient from './client'
// @ts-ignore
import config from '../config.json'

const client = new UBClient()

client.login(config.botToken).then(() => console.log('Logged in'))
