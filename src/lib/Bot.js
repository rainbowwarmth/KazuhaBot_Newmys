"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initGlobals = initGlobals;
exports.loadGuildTree = loadGuildTree;
const global_1 = require("../models/global");
const node_schedule_1 = __importDefault(require("node-schedule"));
const fs_1 = __importDefault(require("fs"));
const kazuha_1 = __importDefault(require("../kazuha"));
const logger_1 = __importDefault(require("./logger"));
async function initGlobals() {
    logger_1.default.info('初始化：正在创建定时任务');
    // 将相同的调度计划合并为一个通用任务调用
    const taskList = [
        kazuha_1.default.bbtaskPushNews,
        kazuha_1.default.bbbtaskPushNews,
        kazuha_1.default.taskPushNews,
        kazuha_1.default.srtaskPushNews,
        kazuha_1.default.zzztaskPushNews,
        kazuha_1.default.wdtaskPushNews,
        kazuha_1.default.dbytaskPushNews
    ];
    taskList.forEach(task => node_schedule_1.default.scheduleJob('0/1 * * * * ?', task));
    logger_1.default.info(`初始化：正在创建热加载监听`);
    fs_1.default.watch(`${global_1._path}/src/plugins/`, (event, filename) => {
        //log.debug(event, filename);
        if (event != "change")
            return;
        if (require.cache[`${global_1._path}/src/plugins/${filename}`]) {
            logger_1.default.mark(`文件${global_1._path}/src/plugins/${filename}已修改，正在执行热更新`);
            delete require.cache[`${global_1._path}/src/plugins/${filename}`];
        }
    });
    const optFile = `${global_1._path}/config/opts.json`;
    fs_1.default.watchFile(optFile, () => {
        if (require.cache[optFile]) {
            logger_1.default.mark(`指令配置文件正在进行热更新`);
            delete require.cache[optFile];
        }
    });
    logger_1.default.info(`初始化：正在连接数据库`);
    await global_1.redis.connect().then(() => {
        logger_1.default.info(`初始化：redis数据库连接成功`);
    }).catch(err => {
        logger_1.default.error(`初始化：redis数据库连接失败，正在退出程序\n${err}`);
        process.exit();
    });
    logger_1.default.info(`初始化：正在创建client与ws`);
    global_1.client;
    global_1.ws;
    logger_1.default.info(`初始化：正在创建频道树`);
    global.saveGuildsTree = [];
    await loadGuildTree(true);
}
async function loadGuildTree(init = false) {
    global.saveGuildsTree = [];
    for (const guild of (await global_1.client.meApi.meGuilds()).data) {
        if (init)
            logger_1.default.info(`${guild.name}(${guild.id})`);
        var _guild = [];
        for (const channel of (await global_1.client.channelApi.channels(guild.id)).data) {
            if (init)
                logger_1.default.info(`${guild.name}(${guild.id})-${channel.name}(${channel.id})-father:${channel.parent_id}`);
            _guild.push({ name: channel.name, id: channel.id });
        }
        global.saveGuildsTree.push({ name: guild.name, id: guild.id, channel: _guild });
    }
}
//# sourceMappingURL=Bot.js.map