"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.tasks = void 0;
const NewBB_1 = require("./apps/NewBB");
const NewBBB_1 = require("./apps/NewBBB");
const NewYuanShen_1 = require("./apps/NewYuanShen");
const NewStarRail_1 = require("./apps/NewStarRail");
const NewZZZ_1 = require("./apps/NewZZZ");
const NewWeiDing_1 = require("./apps/NewWeiDing");
const NewDBY_1 = require("./apps/NewDBY");
const logger_1 = __importDefault(require("../../lib/logger"));
// 定义任务列表，每个任务包含函数和 cron 表达式
exports.tasks = [
    { taskFunction: NewBB_1.bbtaskPushNews, cronExpression: '0/1 * * * * ?' },
    { taskFunction: NewBBB_1.bbbtaskPushNews, cronExpression: '0/2 * * * * ?' },
    { taskFunction: NewYuanShen_1.taskPushNews, cronExpression: '0/3 * * * * ?' },
    { taskFunction: NewStarRail_1.srtaskPushNews, cronExpression: '0/4 * * * * ?' },
    { taskFunction: NewZZZ_1.zzztaskPushNews, cronExpression: '0/5 * * * * ?' },
    { taskFunction: NewWeiDing_1.wdtaskPushNews, cronExpression: '0/6 * * * * ?' },
    { taskFunction: NewDBY_1.dbytaskPushNews, cronExpression: '0/7 * * * * ?' },
];
logger_1.default.info('mihoyo 插件中的所有推送任务已定义');
//# sourceMappingURL=index.js.map