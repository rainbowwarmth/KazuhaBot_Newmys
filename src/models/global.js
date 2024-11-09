"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ws = exports.client = exports.redis = exports.botStatus = exports._path = exports.adminId = void 0;
const redis_1 = require("redis");
const qq_guild_bot_1 = require("qq-guild-bot");
const kazuha_1 = __importDefault(require("../kazuha"));
exports.adminId = ["2492083538938174755"];
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
exports.client = (0, qq_guild_bot_1.createOpenAPI)(kazuha_1.default.config.initConfig);
exports.ws = (0, qq_guild_bot_1.createWebsocket)(kazuha_1.default.config.initConfig);
//# sourceMappingURL=global.js.map