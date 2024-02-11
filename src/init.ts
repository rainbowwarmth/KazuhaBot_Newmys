import { initGlobals } from './lib/Bot';
import kazuha from './kazuha';

export async function init() {
    kazuha._log.mark(`-------(≡^∇^≡)-------`);
    kazuha._log.mark(kazuha.chalk.cyan(kazuha.Bot.name + ' v' + kazuha.Bot.version + '启动中...'))
    kazuha._log.mark(kazuha.chalk.greenBright('https://github.com/rainbowwarmth/KazuhaBot_Newmys.git'))
    process.title = kazuha.Bot.name + ' v' + kazuha.Bot.version + ' © 2023-2024 ' + '@' + kazuha.Bot.author;
    process.env.TZ = "Asia/Shanghai";

    await initGlobals(); 

}