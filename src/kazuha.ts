import * as fs from 'fs';
import * as path from 'path';
import chalk from 'chalk';
import { sendImage } from "./lib/IMessageEx";
import _log, { setDevLog } from "./lib/logger";
import { findOpts } from "./lib/findOpts" 
import { render } from "./lib/render";
import { bbbmiGetNewsList, bbbmiGetPostFull } from "./plugins/mihoyo/models/BBBAPI";
import { bbmiGetNewsList, bbmiGetPostFull } from "./plugins/mihoyo/models/BBAPI";
import { DBYmiGetNewsList, DBYmiGetPostFull } from "./plugins/mihoyo/models/DBYAPI";
import { srmiGetNewsList, srmiGetPostFull } from "./plugins/mihoyo/models/StarRailAPI";
import { wdmiGetNewsList, wdmiGetPostFull } from "./plugins/mihoyo/models/WeiDingAPI";
import { ysmiGetNewsList, ysmiGetPostFull } from "./plugins/mihoyo/models/YuanShenAPI";
import { zzzmiGetNewsList, zzzmiGetPostFull } from "./plugins/mihoyo/models/ZZZAPI";
import { detalData } from "./plugins/mihoyo/apps/NewAPI"

const configFilePath = path.resolve(process.cwd(), 'config', 'config.json');
const botFilePath = path.resolve(process.cwd(), 'package.json');
if (!fs.existsSync(configFilePath)) {
  process.exit(1);
}
if (!fs.existsSync(botFilePath)) {
  process.exit(1);
}
const config = JSON.parse(fs.readFileSync(configFilePath, 'utf8'));
const Bot = JSON.parse(fs.readFileSync(botFilePath, 'utf8'));
export { config, Bot };

// 导出读取的配置数据

let kazuha: any = { 
    chalk,
    findOpts,
    Bot,
    config,
    sendImage,
    _log,
    setDevLog,
    render,
    bbbmiGetNewsList,
    bbbmiGetPostFull,
    bbmiGetNewsList,
    bbmiGetPostFull,
    DBYmiGetNewsList,
    DBYmiGetPostFull,
    srmiGetNewsList,
    srmiGetPostFull,
    wdmiGetNewsList,
    wdmiGetPostFull,
    ysmiGetNewsList,
    ysmiGetPostFull,
    zzzmiGetNewsList,
    zzzmiGetPostFull,
    detalData
}

export default kazuha