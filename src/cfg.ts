import config from "../config/config.json";
import pack from "../package.json";
import { render } from "./lib/render";
import { IMessageEx,sendImage } from "./lib/IMessageEx";
import { bbtaskPushNews } from "./plugins/NewBB";
import { bbbtaskPushNews } from "./plugins/NewBBB";
import { taskPushNews } from "./plugins/NewYuanShen";
import { dbytaskPushNews } from "./plugins/NewDBY";
import { wdtaskPushNews } from "./plugins/NewWeiDing";
import { zzztaskPushNews } from "./plugins/NewZZZ";
import { srtaskPushNews } from "./plugins/NewStarRail";
import chalk from 'chalk'

let c = { config, pack, render, IMessageEx, sendImage, bbtaskPushNews, bbbtaskPushNews, taskPushNews, dbytaskPushNews, wdtaskPushNews, zzztaskPushNews, srtaskPushNews, chalk }
export default c