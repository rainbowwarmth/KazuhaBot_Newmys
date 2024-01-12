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
    chalk,
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