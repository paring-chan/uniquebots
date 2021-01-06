import { PrismaClient } from "@prisma/client";
import fetch, {RequestInfo, RequestInit, Response} from "node-fetch";

export default class Util {
    static async safeFetch(info: RequestInfo, init: RequestInit): Promise<Response> {
        return new Promise(async (resolve, reject) => {
            let rejected = false
            const data = await fetch(info, init).catch(() => {
                rejected = true
                return reject()
            }) as Response
            if (rejected) return
            if (data.status === 429) { // @ts-ignore
                return new Promise(async resolve1 => setTimeout(await data.json().then(r=>r.retry_after), resolve1)).then(() => resolve(this.safeFetch(info, init)))
            }
            resolve(data)
        })
    }

    static DISCORD_API_ENDPOINT = 'https://discord.com/api/v8'

    static prisma = new PrismaClient()
}
