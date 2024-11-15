"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.update = update;
const fs_1 = require("fs");
const child_process_1 = require("child_process");
const path_1 = require("path");
const fs_2 = require("fs");
const logger_1 = __importDefault(require("../../lib/logger"));
async function update(msg) {
    const projectRoot = process.cwd();
    const packageJsonPath = (0, path_1.join)(projectRoot, 'package.json');
    if (!(0, fs_1.existsSync)(packageJsonPath)) {
        logger_1.default.error('package.json 项目根目录中找不到');
        msg.sendMsgEx({ content: '未找到更新文件' });
        process.exit(1);
    }
    const packageJson = JSON.parse((0, fs_2.readFileSync)(packageJsonPath, 'utf-8'));
    const installedVersion = packageJson.version;
    if (installedVersion) {
        try {
            const latestVersion = (0, child_process_1.execSync)('pnpm info kazuha-bot version', { encoding: 'utf-8' }).trim();
            if (installedVersion !== latestVersion) {
                logger_1.default.info(`新版本的 kazuha-bot 可用，Updating from ${installedVersion} to ${latestVersion}...`);
                (0, child_process_1.execSync)('pnpm i kazuha-bot --registry=https://registry.npmmirror.com', { stdio: 'inherit' });
                msg.sendMsgEx({ content: `更新完成，当前版本 ${latestVersion}` });
            }
            else {
                logger_1.default.info('kazuha-bot 已经是最新版本。');
                msg.sendMsgEx({ content: `kazuha-bot 已经是最新版本。` });
            }
        }
        catch (error) {
            logger_1.default.error('检查最新版本的 kazuha-bot 时出错：', error);
            msg.sendMsgEx({ content: `检查最新版本的 kazuha-bot 时出错：` + error });
        }
    }
    const gitDir = (0, path_1.join)(projectRoot, '.git');
    if ((0, fs_1.existsSync)(gitDir)) {
        logger_1.default.info('找到 .git 目录。运行 git pull...');
        try {
            const pullResult = (0, child_process_1.execSync)('git pull', { encoding: 'utf-8' }).trim();
            if (pullResult.includes('Already up to date.')) {
                logger_1.default.info('当前存储库已是最新的。');
                msg.sendMsgEx({ content: '当前为最新版本' });
            }
            else {
                logger_1.default.info('Git 拉取成功。最新提交：');
                const commits = (0, child_process_1.execSync)('git log --oneline -n 5', { encoding: 'utf-8' }).trim();
                logger_1.default.info(commits);
                msg.sendMsgEx({ content: '更新完成，重启中...' });
                restartBot(); // 调用前台重启函数
            }
        }
        catch (error) {
            logger_1.default.error('执行 git pull 时出错:', error);
            msg.sendMsgEx({ content: `执行 git pull 时出错：${error}` });
        }
    }
    else {
        logger_1.default.info('未找到 .git 目录。运行 pnpm i 并初始化...');
        (0, child_process_1.execSync)('pnpm i kazuha-bot --registry=https://registry.npmmirror.com', { stdio: 'inherit' });
        (0, child_process_1.execSync)('node node_modules/kazuha-bot/init.js', { stdio: 'inherit' });
        msg.sendMsgEx({ content: '初始化完成，重启中...' });
        restartBot(); // 调用前台重启函数
    }
}
// 前台重启函数
function restartBot() {
    logger_1.default.info('重启前台服务...');
    try {
        // 使用 execSync 以当前进程参数重新运行 node 命令
        (0, child_process_1.execSync)(`node ${process.argv.join(' ')}`, { stdio: 'inherit' });
        process.exit(0); // 退出当前进程
    }
    catch (error) {
        logger_1.default.error('重启 Bot 时出错:', error);
    }
}
//# sourceMappingURL=update.js.map