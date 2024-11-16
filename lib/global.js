"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ws = exports.client = exports.redis = exports.botStatus = exports._path = exports.adminId = void 0;
const redis_1 = require("redis");
const qq_bot_sdk_1 = require("qq-bot-sdk");
const kazuha_1 = require("../kazuha");
const logger_1 = __importDefault(require("./logger"));
exports.adminId = kazuha_1.config.initConfig.adminId;
exports._path = process.cwd();
exports.botStatus = {
    startTime: new Date(),
    msgSendNum: 0,
    imageRenderNum: 0,
};
exports.redis = (0, redis_1.createClient)({
    socket: { host: "127.0.0.1", port: 6379, },
    database: 1,
});
const initConfig = {
    appID: kazuha_1.config.initConfig.appID,
    token: kazuha_1.config.initConfig.token,
    intents: kazuha_1.config.initConfig.intents,
    sandbox: kazuha_1.config.initConfig.sandbox,
    logger: logger_1.default
};
exports.client = (0, qq_bot_sdk_1.createOpenAPI)(initConfig);
exports.ws = (0, qq_bot_sdk_1.createWebsocket)(initConfig);
//# sourceMappingURL=global.js.map