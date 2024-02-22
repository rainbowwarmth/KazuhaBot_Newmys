import { createClient } from 'redis';
import { createOpenAPI, createWebsocket } from 'qq-guild-bot';
import schedule from "node-schedule";
import fs from 'fs';
import kazuha from '../kazuha';
import { HeartbeatParam } from './qq-guild-bot';

export async function initGlobals() {
    global.adminId = ["2492083538938174755"];
    global._path = process.cwd();
    global.log = kazuha._log;
    global.botStatus = {
        startTime: new Date(),
        msgSendNum: 0,
        imageRenderNum: 0,
    };

    if (process.argv.includes("--dev")) {
        log.mark("当前环境处于开发环境，请注意！");
        global.devEnv = true;
        kazuha.setDevLog();
    } else {
        global.devEnv = false;
    }

    log.info(`初始化：正在创建定时任务`);
    schedule.scheduleJob("0/1 * * * * ?  ", () => kazuha.bbtaskPushNews());
    schedule.scheduleJob("0/1 * * * * ?  ", () => kazuha.bbbtaskPushNews();
    schedule.scheduleJob("0/1 * * * * ?  ", () => kazuha.taskPushNews();
    schedule.scheduleJob("0/1 * * * * ?  ", () => kazuha.srtaskPushNews();
    schedule.scheduleJob("0/1 * * * * ?  ", () => kazuha.zzztaskPushNews();
    schedule.scheduleJob("0/1 * * * * ?  ", () => kazuha.wdtaskPushNews();
    schedule.scheduleJob("0/1 * * * * ?  ", () => kazuha.dbytaskPushNews();
    // 其他定时任务省略...

    log.info(`初始化：正在创建热加载监听`);
    fs.watch(`${global._path}/src/plugins/`, (event, filename) => {
        // 热加载监听操作省略...
    });

    const optFile = `${global._path}/config/opts.json`;
    fs.watchFile(optFile, () => {
        // 文件变化操作省略...
    });

    log.info(`初始化：正在连接数据库`);
    global.redis = createClient({
        socket: { host: "127.0.0.1", port: 6379, },
        database: 1,
    });
    await global.redis.connect().then(() => {
        log.info(`初始化：redis数据库连接成功`);
    }).catch(err => {
        log.error(`初始化：redis数据库连接失败，正在退出程序\n${err}`);
        process.exit();
    });

    log.info(`初始化：正在创建client与ws`);
    global.client = createOpenAPI(kazuha.config.initConfig);
    global.ws = createWebsocket(kazuha.config.initConfig as any);

    log.info(`初始化：正在创建频道树`);
    global.saveGuildsTree = [];
    await loadGuildTree(true);
}

export async function loadGuildTree(init = false) {
    global.saveGuildsTree = [];
    for (const guild of (await global.client.meApi.meGuilds()).data) {
        if (init) log.info(`${guild.name}(${guild.id})`);
        var _guild: SaveChannel[] = [];
        for (const channel of (await global.client.channelApi.channels(guild.id)).data) {
            if (init) log.info(`${guild.name}(${guild.id})-${channel.name}(${channel.id})-father:${channel.parent_id}`);
            _guild.push({ name: channel.name, id: channel.id });
        }
        global.saveGuildsTree.push({ name: guild.name, id: guild.id, channel: _guild });
    }
}
