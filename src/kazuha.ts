import chalk from 'chalk';
import { sendImage } from "./lib/IMessageEx";
import _log, { setDevLog } from "./lib/logger";
import { findOpts } from "./lib/findOpts" 
import { render } from "./lib/render";
import { taskPushNews } from "./plugins/mihoyo/NewYuanShen";
import { bbbtaskPushNews } from "./plugins/mihoyo/NewBBB";
import { bbtaskPushNews } from "./plugins/mihoyo/NewBB";
import { srtaskPushNews } from "./plugins/mihoyo/NewStarRail";
import { zzztaskPushNews } from "./plugins/mihoyo/NewZZZ";
import { wdtaskPushNews } from "./plugins/mihoyo/NewWeiDing";
import { dbytaskPushNews } from "./plugins/mihoyo/NewDBY";
import { bbbmiGetNewsList, bbbmiGetPostFull } from "./models/BBBAPI";
import { bbmiGetNewsList, bbmiGetPostFull } from "./models/BBAPI";
import { DBYmiGetNewsList, DBYmiGetPostFull } from "./models/DBYAPI";
import { srmiGetNewsList, srmiGetPostFull } from "./models/StarRailAPI";
import { wdmiGetNewsList, wdmiGetPostFull } from "./models/WeiDingAPI";
import { ysmiGetNewsList, ysmiGetPostFull } from "./models/YuanShenAPI";
import { zzzmiGetNewsList, zzzmiGetPostFull } from "./models/ZZZAPI";
import Bot from "../package.json";
import config from "../config/config.json"
import { detalData } from "./plugins/mihoyo/NewAPI"



let kazuha: any = { 
    chalk,
    taskPushNews,
    bbbtaskPushNews,
    bbtaskPushNews,
    srtaskPushNews,
    zzztaskPushNews,
    wdtaskPushNews,
    dbytaskPushNews,
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