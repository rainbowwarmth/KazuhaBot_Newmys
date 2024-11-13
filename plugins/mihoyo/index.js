"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.tasks = void 0;
const mysNew_1 = require("./apps/mysNew");
const logger_1 = __importDefault(require("../../lib/logger"));
exports.tasks = [
    { taskFunction: mysNew_1.taskPushNews, cronExpression: '0/1 * * * * ?' },
];
logger_1.default.info('mihoyo 插件中的所有推送任务已注册');
//# sourceMappingURL=index.js.map