import { _path, redis, client, ws } from './global'
import fs from 'fs';
import kazuha from '../kazuha';
import schedule from 'node-schedule'
import path from 'path';
import { IntentMessage } from '../lib/type'
import { IMessageEx } from '../lib/IMessageEx';
import log from './logger';

type PluginFnc = (msg: IMessageEx) => Promise<any>;

interface Task {
    taskFunction: () => void;
    cronExpression: string;
}

export async function init() {
    kazuha._log.mark(`-------(≡^∇^≡)-------`);
    kazuha._log.mark(kazuha.chalk.cyan(kazuha.Bot.name + ' v' + kazuha.Bot.version + '启动中...'));
    kazuha._log.mark(kazuha.chalk.greenBright('https://github.com/rainbowwarmth/KazuhaBot_Newmys.git'));
    process.title = 'kazuhaBot' + ' v' + kazuha.Bot.version + ' © 2023-2024 ' + '@' + kazuha.Bot.author;
    process.env.TZ = "Asia/Shanghai";
    
    await initGlobals(); 
}

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

    function getPluginFolders(): string[] {
        const pluginsDir = path.join(_path, 'plugins');
        return fs.readdirSync(pluginsDir).filter(folder => {
            const fullPath = path.join(pluginsDir, folder);
            return fs.statSync(fullPath).isDirectory() && !['other', 'example', 'system'].includes(folder);
        });
    }
    
    const pluginFolders = getPluginFolders();
    
    function registerPluginTasks() {
        const pluginsDir = path.join(_path, 'plugins');
        const pluginFolders = fs.readdirSync(pluginsDir).filter(folder => {
            const fullPath = path.join(pluginsDir, folder);
            return fs.statSync(fullPath).isDirectory();
        });
    
        pluginFolders.forEach(pluginName => {
            const pluginPath = path.join(_path, 'plugins', pluginName, 'index.js');
            // 检查插件文件是否存在
            if (!fs.existsSync(pluginPath)) {
                return;
            }
            try {
                const plugin = require(pluginPath);
                // 检查插件是否包含任务数组
                if (Array.isArray(plugin.tasks)) {
                    (plugin.tasks as Task[]).forEach(({ taskFunction, cronExpression }) => {
                        // 验证 taskFunction 和 cronExpression 是否有效
                        if (typeof taskFunction === 'function' && typeof cronExpression === 'string') {
                            schedule.scheduleJob(cronExpression, taskFunction);
                        } else {
                            log.warn(`初始化：插件 ${pluginName} 的任务缺少有效的函数或 cron 表达式`);
                        }
                    });
                } else {
                    log.warn(`初始化：插件 ${pluginName} 缺少任务列表`);
                }
            } catch (err) {
                log.error(`初始化：加载插件 ${pluginName} 的定时任务失败：${(err as Error).message}`);
            }
        });
        log.info('所有插件的定时任务已成功注册');
    }
    
    // 调用任务注册函数
    registerPluginTasks();

    log.info('初始化：正在创建热加载监听');
    pluginFolders.forEach(pluginName => {
        const pluginConfigPath = path.join(_path, 'config', 'command', `${pluginName}.json`);
        fs.watchFile(pluginConfigPath, () => {
            log.mark(`插件配置文件 ${pluginConfigPath} 发生变化，正在进行热更新`);
            delete require.cache[require.resolve(pluginConfigPath)];
            loadPluginConfig(pluginName);
        });
    });

    const optFile = path.join(_path, 'config', 'opts.json');
    fs.watchFile(optFile, () => {
        if (require.cache[optFile]) {
            log.mark('指令配置文件正在进行热更新');
            delete require.cache[optFile];
        }
    });

    log.info('初始化：正在连接数据库');
    await redis.connect().then(() => {
        log.info('初始化：redis数据库连接成功');
    }).catch(err => {
        log.error(`初始化：redis数据库连接失败，正在退出程序\n${err}`);
        process.exit();
    });

    log.info('初始化：正在创建client与ws');
    client;
    ws;

    log.info('初始化：正在创建频道树');
    global.saveGuildsTree = [];
    await loadGuildTree(true);
}

export async function loadGuildTree(init = false) {
    global.saveGuildsTree = [];
    for (const guild of (await client.meApi.meGuilds()).data) {
        if (init) log.info(`${guild.name}(${guild.id})`);
        const _guild = [];
        for (const channel of (await client.channelApi.channels(guild.id)).data) {
            if (init) log.info(`${guild.name}(${guild.id})-${channel.name}(${channel.id})-father:${channel.parent_id}`);
            _guild.push({ name: channel.name, id: channel.id });
        }
        global.saveGuildsTree.push({ name: guild.name, id: guild.id, channel: _guild });
    }
}
