import chalk from 'chalk';
import { sendImage } from "./lib/IMessageEx";
import _log, { setDevLog } from "./lib/logger";
import { findOpts } from "./lib/findOpts" 
import { render } from "./lib/render";
import { taskPushNews } from "./plugins/NewYuanShen";
import { bbbtaskPushNews } from "./plugins/NewBBB";
import { bbtaskPushNews } from "./plugins/NewBB";
import { srtaskPushNews } from "./plugins/NewStarRail";
import { zzztaskPushNews } from "./plugins/NewZZZ";
import { wdtaskPushNews } from "./plugins/NewWeiDing";
import { dbytaskPushNews } from "./plugins/NewDBY";
import { bbbmiGetNewsList, bbbmiGetPostFull, bbbmiSearchPosts, bbbmiGetEmoticon } from "./models/BBBAPI";
import { bbmiGetNewsList, bbmiGetPostFull, bbmiSearchPosts, bbmiGetEmoticon } from "./models/BBAPI";
import { DBYmiGetNewsList, DBYmiGetPostFull, DBYmiSearchPosts, DBYmiGetEmoticon } from "./models/DBYAPI";
import { srmiGetNewsList, srmiGetPostFull, srmiSearchPosts, srmiGetEmoticon } from "./models/StarRailAPI";
import { wdmiGetNewsList, wdmiGetPostFull, wdmiSearchPosts, wdmiGetEmoticon } from "./models/WeiDingAPI";
import { ysmiGetNewsList, ysmiGetPostFull, ysmiSearchPosts, ysmiGetEmoticon } from "./models/YuanShenAPI";
import { zzzmiGetNewsList, zzzmiGetPostFull, zzzmiSearchPosts, zzzmiGetEmoticon } from "./models/ZZZAPI";
import Bot from "../package.json";
import config from "../config/config.json"


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
    bbbmiSearchPosts,
    bbbmiGetEmoticon,
    bbmiGetNewsList,
    bbmiGetPostFull,
    bbmiSearchPosts,
    bbmiGetEmoticon,
    DBYmiGetNewsList,
    DBYmiGetPostFull,
    DBYmiSearchPosts,
    DBYmiGetEmoticon,
    srmiGetNewsList,
    srmiGetPostFull,
    srmiSearchPosts,
    srmiGetEmoticon,
    wdmiGetNewsList,
    wdmiGetPostFull,
    wdmiSearchPosts,
    wdmiGetEmoticon,
    ysmiGetNewsList,
    ysmiGetPostFull,
    ysmiSearchPosts,
    ysmiGetEmoticon,
    zzzmiGetNewsList,
    zzzmiGetPostFull,
    zzzmiSearchPosts,
    zzzmiGetEmoticon
}

export default kazuha