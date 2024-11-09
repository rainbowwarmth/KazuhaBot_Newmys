"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.init = init;
const Bot_1 = require("./lib/Bot");
const kazuha_1 = __importDefault(require("./kazuha"));
async function init() {
    kazuha_1.default._log.mark(`-------(≡^∇^≡)-------`);
    kazuha_1.default._log.mark(kazuha_1.default.chalk.cyan(kazuha_1.default.Bot.name + ' v' + kazuha_1.default.Bot.version + '启动中...'));
    kazuha_1.default._log.mark(kazuha_1.default.chalk.greenBright('https://github.com/rainbowwarmth/KazuhaBot_Newmys.git'));
    process.title = kazuha_1.default.Bot.name + ' v' + kazuha_1.default.Bot.version + ' © 2023-2024 ' + '@' + kazuha_1.default.Bot.author;
    process.env.TZ = "Asia/Shanghai";
    await (0, Bot_1.initGlobals)();
}
//# sourceMappingURL=init.js.map