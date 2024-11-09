"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chalk_1 = __importDefault(require("chalk"));
const IMessageEx_1 = require("./lib/IMessageEx");
const logger_1 = __importStar(require("./lib/logger"));
const findOpts_1 = require("./lib/findOpts");
const render_1 = require("./lib/render");
const NewYuanShen_1 = require("./plugins/NewYuanShen");
const NewBBB_1 = require("./plugins/NewBBB");
const NewBB_1 = require("./plugins/NewBB");
const NewStarRail_1 = require("./plugins/NewStarRail");
const NewZZZ_1 = require("./plugins/NewZZZ");
const NewWeiDing_1 = require("./plugins/NewWeiDing");
const NewDBY_1 = require("./plugins/NewDBY");
const BBBAPI_1 = require("./models/BBBAPI");
const BBAPI_1 = require("./models/BBAPI");
const DBYAPI_1 = require("./models/DBYAPI");
const StarRailAPI_1 = require("./models/StarRailAPI");
const WeiDingAPI_1 = require("./models/WeiDingAPI");
const YuanShenAPI_1 = require("./models/YuanShenAPI");
const ZZZAPI_1 = require("./models/ZZZAPI");
const package_json_1 = __importDefault(require("../package.json"));
const config_json_1 = __importDefault(require("../config/config.json"));
const NewAPI_1 = require("./plugins/NewAPI");
let kazuha = {
    chalk: chalk_1.default,
    taskPushNews: NewYuanShen_1.taskPushNews,
    bbbtaskPushNews: NewBBB_1.bbbtaskPushNews,
    bbtaskPushNews: NewBB_1.bbtaskPushNews,
    srtaskPushNews: NewStarRail_1.srtaskPushNews,
    zzztaskPushNews: NewZZZ_1.zzztaskPushNews,
    wdtaskPushNews: NewWeiDing_1.wdtaskPushNews,
    dbytaskPushNews: NewDBY_1.dbytaskPushNews,
    findOpts: findOpts_1.findOpts,
    Bot: package_json_1.default,
    config: config_json_1.default,
    sendImage: IMessageEx_1.sendImage,
    _log: logger_1.default,
    setDevLog: logger_1.setDevLog,
    render: render_1.render,
    bbbmiGetNewsList: BBBAPI_1.bbbmiGetNewsList,
    bbbmiGetPostFull: BBBAPI_1.bbbmiGetPostFull,
    bbmiGetNewsList: BBAPI_1.bbmiGetNewsList,
    bbmiGetPostFull: BBAPI_1.bbmiGetPostFull,
    DBYmiGetNewsList: DBYAPI_1.DBYmiGetNewsList,
    DBYmiGetPostFull: DBYAPI_1.DBYmiGetPostFull,
    srmiGetNewsList: StarRailAPI_1.srmiGetNewsList,
    srmiGetPostFull: StarRailAPI_1.srmiGetPostFull,
    wdmiGetNewsList: WeiDingAPI_1.wdmiGetNewsList,
    wdmiGetPostFull: WeiDingAPI_1.wdmiGetPostFull,
    ysmiGetNewsList: YuanShenAPI_1.ysmiGetNewsList,
    ysmiGetPostFull: YuanShenAPI_1.ysmiGetPostFull,
    zzzmiGetNewsList: ZZZAPI_1.zzzmiGetNewsList,
    zzzmiGetPostFull: ZZZAPI_1.zzzmiGetPostFull,
    detalData: NewAPI_1.detalData
};
exports.default = kazuha;
//# sourceMappingURL=kazuha.js.map