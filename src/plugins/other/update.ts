import { existsSync } from 'fs';
import { execSync } from 'child_process';
import { join } from 'path';
import { readFileSync } from 'fs';
import logger from '../../lib/logger';
import { IMessageEx } from '../../lib/IMessageEx';

export async function update(msg: IMessageEx) {
    const projectRoot = process.cwd();
    const packageJsonPath = join(projectRoot, 'package.json');

    if (!existsSync(packageJsonPath)) {
        logger.error('package.json 项目根目录中找不到');
        msg.sendMsgEx({ content: '未找到更新文件' });
        process.exit(1);
    }

    const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf-8'));
    const installedVersion = packageJson.version;

    if (installedVersion) {
        try {
            const latestVersion = execSync('pnpm info kazuha-bot version', { encoding: 'utf-8' }).trim();
            
            if (installedVersion !== latestVersion) {
                logger.info(`新版本的 kazuha-bot 可用，Updating from ${installedVersion} to ${latestVersion}...`);
                execSync('pnpm i kazuha-bot --registry=https://registry.npmmirror.com', { stdio: 'inherit' });
                msg.sendMsgEx({ content: `更新完成，当前版本 ${latestVersion}` });
            } else {
                logger.info('kazuha-bot 已经是最新版本。');
                msg.sendMsgEx({ content: `kazuha-bot 已经是最新版本。` });
            }
        } catch (error) {
            logger.error('检查最新版本的 kazuha-bot 时出错：', error);
            msg.sendMsgEx({ content: `检查最新版本的 kazuha-bot 时出错：` + error });
        }
    }

    const gitDir = join(projectRoot, '.git');

    if (existsSync(gitDir)) {
        logger.info('找到 .git 目录。运行 git pull...');
        try {
            const pullResult = execSync('git pull', { encoding: 'utf-8' }).trim();
            
            if (pullResult.includes('Already up to date.')) {
                logger.info('当前存储库已是最新的。');
                msg.sendMsgEx({ content: '当前为最新版本' });
            } else {
                logger.info('Git 拉取成功。最新提交：');
                const commits = execSync('git log --oneline -n 5', { encoding: 'utf-8' }).trim();
                logger.info(commits);
                msg.sendMsgEx({ content: '更新完成，重启中...' });
                restartBot();  // 调用前台重启函数
            }
        } catch (error) {
            logger.error('执行 git pull 时出错:', error);
            msg.sendMsgEx({ content: `执行 git pull 时出错：${error}` });
        }
    } else {
        logger.info('未找到 .git 目录。运行 pnpm i 并初始化...');
        execSync('pnpm i kazuha-bot --registry=https://registry.npmmirror.com', { stdio: 'inherit' });
        execSync('node node_modules/kazuha-bot/init.js', { stdio: 'inherit' });
        msg.sendMsgEx({ content: '初始化完成，重启中...' });
        restartBot();  // 调用前台重启函数
    }
}

// 前台重启函数
function restartBot() {
    logger.info('重启前台服务...');
    try {
        // 使用 execSync 以当前进程参数重新运行 node 命令
        execSync(`node ${process.argv.join(' ')}`, { stdio: 'inherit' });
        process.exit(0);  // 退出当前进程
    } catch (error) {
        logger.error('重启 Bot 时出错:', error);
    }
}
