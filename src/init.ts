import chalk from 'chalk';
import { createOpenAPI, createWebsocket } from 'qq-guild-bot';
import { createClient } from 'redis';
import schedule from "node-schedule";
import fs from 'fs';
import _log, { setDevLog } from './lib/logger';
import kazuha from '../package.json';
import config from '../config/config.json';
import { taskPushNews } from './plugins/announcementManager';

export async function init() {
    console.log(`机器人准备运行，正在初始化`);
    _log.mark(`-------(≡^∇^≡)-------`);
    _log.mark(chalk.cyan(kazuha.name + ' v' + kazuha.version + '启动中...'))
    _log.mark(chalk.greenBright('https://github.com/rainbowwarmth/KazuhaBot_Newmys.git'))
    process.title = kazuha.name + ' v' + kazuha.version + ' © 2023-2024 ' + '@' + kazuha.author;
    process.env.TZ = "Asia/Shanghai";
    global.adminId = ["7681074728704576201", "9540810258706627170"];
    global._path = process.cwd();
    global.log = _log;
    global.botStatus = {
        startTime: new Date(),
        msgSendNum: 0,
        imageRenderNum: 0,
    }
    if (process.argv.includes("--dev")) {
        log.mark("当前环境处于开发环境，请注意！");
        global.devEnv = true;
        setDevLog();
    } else global.devEnv = false;

    log.info(`初始化：正在创建定时任务`);
    ////官方公告推送
    schedule.scheduleJob("0 0/30 * * * ? ", () => taskPushNews());
    ////原石统计推送
    //schedule.scheduleJob("0 0 10 L * ? ", () => YunzaiApps.dailyNote.ledgerTask());


    log.info(`初始化：正在创建热加载监听`);
    fs.watch(`${global._path}/src/plugins/`, (event, filename) => {
        //log.debug(event, filename);
        if (event != "change") return;
        if (require.cache[`${global._path}/src/plugins/${filename}`]) {
            log.mark(`文件${global._path}/src/plugins/${filename}已修改，正在执行热更新`);
            delete require.cache[`${global._path}/src/plugins/${filename}`];
        }
    });

    const optFile = `${global._path}/config/opts.json`;
    fs.watchFile(optFile, () => {
        if (require.cache[optFile]) {
            log.mark(`指令配置文件正在进行热更新`);
            delete require.cache[optFile];
        }
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
    global.client = createOpenAPI(config.initConfig);
    global.ws = createWebsocket(config.initConfig as any);

    log.info(`初始化：正在创建频道树`);
    global.saveGuildsTree = [];
    await loadGuildTree(true);
}

export async function loadGuildTree(init = false) {
    global.saveGuildsTree = [];
    for (const guild of (await global.client.meApi.meGuilds()).data) {
        if (init) log.mark(`${guild.name}(${guild.id})`);
        var _guild: SaveChannel[] = [];
        for (const channel of (await global.client.channelApi.channels(guild.id)).data) {
            if (init) log.mark(`${guild.name}(${guild.id})-${channel.name}(${channel.id})-father:${channel.parent_id}`);
            _guild.push({ name: channel.name, id: channel.id });
        }
        global.saveGuildsTree.push({ name: guild.name, id: guild.id, channel: _guild });
    }
}