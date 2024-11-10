import { _path, redis, client, ws } from '../models/global';
import schedule from "node-schedule";
import fs from 'fs';
import kazuha from '../kazuha';
import log from './logger';
import path from 'path';

// 读取 plugins 目录下的所有子文件夹名称
function getPluginFolders() {
    const pluginsDir = path.join(_path, 'plugins');
    const pluginFolders = fs.readdirSync(pluginsDir).filter(file => {
        const filePath = path.join(pluginsDir, file);
        return fs.statSync(filePath).isDirectory();
    });
    return pluginFolders;
}

// 加载插件配置文件
function loadPluginConfig(pluginName: string) {
    const configPath = path.join(_path, 'config', 'command', `${pluginName}.json`);
    try {
        const config = require(configPath);
        return config;
    } catch (err) {
        log.error(`加载插件配置文件失败: ${configPath}`, err);
        return null;
    }
}

export async function initGlobals() {
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

    // 监听 plugins 目录下的文件变化，实现插件配置的热更新
    const pluginFolders = getPluginFolders();
    pluginFolders.forEach(pluginName => {
        const pluginConfigPath = path.join(_path, 'config', 'command', `${pluginName}.json`);
        fs.watchFile(pluginConfigPath, () => {
            log.mark(`插件配置文件 ${pluginConfigPath} 发生变化，正在进行热更新`);
            delete require.cache[require.resolve(pluginConfigPath)];
            loadPluginConfig(pluginName);  // 重新加载配置文件
        });
    });

    const optFile = path.join(_path, 'config', 'opts.json');
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
    client;
    ws;

    log.info(`初始化：正在创建频道树`);
    global.saveGuildsTree = [];
    await loadGuildTree(true);
}

export async function loadGuildTree(init = false) {
    global.saveGuildsTree = [];
    for (const guild of (await client.meApi.meGuilds()).data) {
        if (init) log.info(`${guild.name}(${guild.id})`);
        var _guild = [];
        for (const channel of (await client.channelApi.channels(guild.id)).data) {
            if (init) log.info(`${guild.name}(${guild.id})-${channel.name}(${channel.id})-father:${channel.parent_id}`);
            _guild.push({ name: channel.name, id: channel.id });
        }
        global.saveGuildsTree.push({ name: guild.name, id: guild.id, channel: _guild });
    }
}
