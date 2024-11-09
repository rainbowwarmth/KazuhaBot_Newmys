import { init } from "./init"
import { loadGuildTree } from "./lib/Bot"
import kazuha from "./kazuha";
import { IMessageEx } from "./lib/IMessageEx";
import { ws, redis, _path } from "./models/global"; 
import { IntentMessage } from "./lib/type";
import log from "./lib/logger";


export async function initialize(){
    init().then(() => {

        ws.on('READY', (data) =>{
            log.mark('[READY] 事件接收 :', data)
        });
        ws.on('ERROR', (data) => {
            log.mark('[ERROR] 事件接收 :', data);
          });
        ws.on('GUILD_MESSAGES', async (data: IntentMessage) => {
            if (data.eventType != "MESSAGE_CREATE") return;
            const msg = new IMessageEx(data.msg, "GUILD");
            execute(msg);
    
        });
    
        ws.on("DIRECT_MESSAGE", async (data: IntentMessage) => {
            if (data.eventType != 'DIRECT_MESSAGE_CREATE') return;
            const msg = new IMessageEx(data.msg, "DIRECT");
            redis.hSet(`genshin:config:${msg.author.id}`, "guildId", msg.guild_id);
            execute(msg);
        });
    
    
        ws.on("GUILDS", (data) => {
            log.mark(`重新加载频道树中`);
            loadGuildTree().then(() => {
                log.mark(`频道树加载完毕`);
            }).catch((err: any) => {
                log.error(`频道树加载失败`, err);
            });
        });
    });
}

async function execute(msg: IMessageEx) {
    try {
        redis.set("lastestMsgId", msg.id, { EX: 4 * 60 });
        if (msg && msg.content) {
            msg.content = msg.content.trim().replace(/^\//, "#");
        } else {
            log.error('检查消息为空，可能是图片和GIF导致的');
        }
        const opt = await kazuha.findOpts(msg);
        if (opt.path != "err") {
            if (kazuha.config.devEnv) log.debug(`./plugins/${opt.path}:${opt.fnc}`);
            const plugin = await import(`./plugins/${opt.path}.js`);
            if (typeof plugin[opt.fnc] == "function") {
                return (plugin[opt.fnc] as PluginFnc)(msg).catch(err => {
                    log.error(err);
                });
            } else log.error(`not found function ${opt.fnc}() at "${_path}/src/plugins/${opt.path}.js"`);
        }
    } catch (err) {
        log.error(err);
    }

}

type PluginFnc = (msg: IMessageEx) => Promise<any>
