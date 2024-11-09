import { createClient } from 'redis'
import { createOpenAPI, createWebsocket } from 'qq-guild-bot'
import kazuha from '../kazuha'

export const adminId = ["2492083538938174755"]
export const _path = process.cwd()
export const botStatus = {
    startTime: new Date(),
    msgSendNum: 0,
    imageRenderNum: 0,
}

export const redis = createClient({
    socket: { host: "127.0.0.1", port: 6379, },
    database: 1,
});

export const client = createOpenAPI(kazuha.config.initConfig)
export const ws = createWebsocket(kazuha.config.initConfig as any)