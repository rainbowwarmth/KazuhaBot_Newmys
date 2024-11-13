"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.findOpts = findOpts;
const admin_1 = require("../plugins/other/admin");
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
async function findOpts(msg) {
    if (!msg.content)
        return null; // 如果内容为空，返回 null
    // 动态获取 plugins 文件夹下的所有子文件夹名称
    const pluginsDir = path_1.default.resolve(__dirname, '../plugins');
    const pluginPaths = fs_1.default.readdirSync(pluginsDir).filter((file) => {
        const filePath = path_1.default.join(pluginsDir, file);
        return fs_1.default.statSync(filePath).isDirectory();
    });
    // 动态加载 config/command 文件夹下的每个插件对应的配置文件
    const configDir = path_1.default.resolve(__dirname, '../config/command');
    for (const plugin of pluginPaths) {
        // 构造每个插件对应的配置文件路径
        const configPath = path_1.default.resolve(configDir, `${plugin}.json`);
        try {
            // 确保配置文件存在
            if (!fs_1.default.existsSync(configPath)) {
                console.warn(`Config file for plugin ${plugin} not found: ${configPath}`);
                continue;
            }
            // 动态导入插件的配置文件
            const fnc = await Promise.resolve(`${configPath}`).then(s => __importStar(require(s)));
            const command = fnc.command;
            // 遍历插件命令配置
            for (const mainKey in command) {
                const group = command[mainKey];
                const groupDir = group.directory; // 使用插件组的 directory 字段
                for (const key in group) {
                    if (key === "directory")
                        continue; // 跳过 directory 字段
                    const opt = group[key];
                    // 检查消息类型是否匹配
                    if (!opt.type?.includes(msg.messageType))
                        continue;
                    // 检查正则表达式是否匹配消息内容
                    const regex = opt.reg ? new RegExp(opt.reg) : null;
                    if (!regex || !regex.test(msg.content))
                        continue;
                    // 权限检查
                    if (opt.permission !== "anyone") {
                        const isUserAdmin = await (0, admin_1.isAdmin)(msg.author.id, msg.messageType === "GUILD" ? msg.member : undefined, msg.messageType === "DIRECT" ? msg.src_guild_id : undefined);
                        if (!isUserAdmin)
                            continue;
                    }
                    // 返回匹配的指令配置
                    return {
                        directory: groupDir,
                        file: mainKey,
                        fnc: opt.fnc,
                    };
                }
            }
        }
        catch (error) {
            console.error(`Error loading config for plugin ${plugin}:`, error);
        }
    }
    // 如果没有匹配项，返回 null
    return null;
}
//# sourceMappingURL=findOpts.js.map