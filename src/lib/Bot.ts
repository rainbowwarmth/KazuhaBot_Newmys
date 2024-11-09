import {_path, redis, saveGuildsTree, client, ws} from '../models/global'
import schedule from "node-schedule";
import fs from 'fs';
import kazuha from '../kazuha';

export async function initGlobals() {
    global.log = kazuha._log

    log.info('初始化：正在创建定时任务');

    // 将相同的调度计划合并为一个通用任务调用
    const taskList = [
        kazuha.bbtaskPushNews,
        kazuha.bbbtaskPushNews,
        kazuha.taskPushNews,
        kazuha.srtaskPushNews,
        kazuha.zzztaskPushNews,
        kazuha.wdtaskPushNews,
        kazuha.dbytaskPushNews
    ];

    taskList.forEach(task => schedule.scheduleJob('0/1 * * * * ?', task));

    log.info(`初始化：正在创建热加载监听`);
    fs.watch(`${_path}/src/plugins/`, (event, filename) => {
        //log.debug(event, filename);
        if (event != "change") return;
        if (require.cache[`${_path}/src/plugins/${filename}`]) {
            log.mark(`文件${_path}/src/plugins/${filename}已修改，正在执行热更新`);
            delete require.cache[`${_path}/src/plugins/${filename}`];
        }
    });

    const optFile = `${_path}/config/opts.json`;
    fs.watchFile(optFile, () => {
        if (require.cache[optFile]) {
            log.mark(`指令配置文件正在进行热更新`);
            delete require.cache[optFile];
        }
    });

    log.info(`初始化：正在连接数据库`);
    await redis.connect().then(() => {
        log.info(`初始化：redis数据库连接成功`);
    }).catch(err => {
        log.error(`初始化：redis数据库连接失败，正在退出程序\n${err}`);
        process.exit();
    });

    log.info(`初始化：正在创建client与ws`);
    client
    ws

    log.info(`初始化：正在创建频道树`);
    global.saveGuildsTree = [];
    await loadGuildTree(true);
}

export async function loadGuildTree(init = false) {
    global.saveGuildsTree = [];
    for (const guild of (await client.meApi.meGuilds()).data) {
        if (init) log.info(`${guild.name}(${guild.id})`);
        var _guild: SaveChannel[] = [];
        for (const channel of (await client.channelApi.channels(guild.id)).data) {
            if (init) log.info(`${guild.name}(${guild.id})-${channel.name}(${channel.id})-father:${channel.parent_id}`);
            _guild.push({ name: channel.name, id: channel.id });
        }
        global.saveGuildsTree.push({ name: guild.name, id: guild.id, channel: _guild });
    }
}
