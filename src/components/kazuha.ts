import { createOpenAPI, createWebsocket, IMember } from 'qq-guild-bot';
import { createClient } from 'redis';
import schedule from "node-schedule";
import fs from 'fs';
import chalk from 'chalk';
import { taskPushNews } from "src/plugins/NewYuanShen";
import { bbbtaskPushNews } from "src/plugins/NewBBB";
import { bbtaskPushNews } from "src/plugins/NewBB";
import { srtaskPushNews } from "src/plugins/NewStarRail";
import { zzztaskPushNews } from "src/plugins/NewZZZ";
import { wdtaskPushNews } from "src/plugins/NewWeiDing";
import { dbytaskPushNews } from "src/plugins/NewDBY";
import { init, loadGuildTree } from 'src/init';
import kazuha from "../../package.json";
import config from "../../config/config.json"

export { 
    createOpenAPI,
    createWebsocket,
    createClient,
    schedule,
    fs,
    chalk,
    IMember,
    taskPushNews,
    bbbtaskPushNews,
    bbtaskPushNews,
    srtaskPushNews,
    zzztaskPushNews,
    wdtaskPushNews,
    dbytaskPushNews,
    init,
    loadGuildTree,
    kazuha,
    config
}