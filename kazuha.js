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
exports.Bot = exports.config = void 0;
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const chalk_1 = __importDefault(require("chalk"));
const IMessageEx_1 = require("./lib/IMessageEx");
const logger_1 = __importStar(require("./lib/logger"));
const findOpts_1 = require("./lib/findOpts");
const render_1 = require("./lib/render");
const BBBAPI_1 = require("./plugins/mihoyo/models/BBBAPI");
const BBAPI_1 = require("./plugins/mihoyo/models/BBAPI");
const DBYAPI_1 = require("./plugins/mihoyo/models/DBYAPI");
const StarRailAPI_1 = require("./plugins/mihoyo/models/StarRailAPI");
const WeiDingAPI_1 = require("./plugins/mihoyo/models/WeiDingAPI");
const YuanShenAPI_1 = require("./plugins/mihoyo/models/YuanShenAPI");
const ZZZAPI_1 = require("./plugins/mihoyo/models/ZZZAPI");
const NewAPI_1 = require("./plugins/mihoyo/apps/NewAPI");
const configFilePath = path.resolve(process.cwd(), 'config', 'config.json');
const botFilePath = path.resolve(process.cwd(), 'package.json');
if (!fs.existsSync(configFilePath)) {
    process.exit(1);
}
if (!fs.existsSync(botFilePath)) {
    process.exit(1);
}
const config = JSON.parse(fs.readFileSync(configFilePath, 'utf8'));
exports.config = config;
const Bot = JSON.parse(fs.readFileSync(botFilePath, 'utf8'));
exports.Bot = Bot;
// 导出读取的配置数据
let kazuha = {
    chalk: chalk_1.default,
    findOpts: findOpts_1.findOpts,
    Bot,
    config,
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