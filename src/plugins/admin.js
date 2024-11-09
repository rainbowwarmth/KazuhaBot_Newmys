"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.status = status;
exports.ping = ping;
exports.msgconnnet = msgconnnet;
exports.isAdmin = isAdmin;
const global_1 = require("../models/global");
const logger_1 = __importDefault(require("../lib/logger"));
async function status(msg) {
    return msg.sendMsgEx({
        content: `------状态------` +
            `\n运行时间：${timeConver(new Date().getTime() - global_1.botStatus.startTime.getTime())}` +
            `\n发送消息：${global_1.botStatus.msgSendNum}条` +
            `\n生成图片：${global_1.botStatus.imageRenderNum}次` +
            `\n内存使用：${(process.memoryUsage().rss / 1024 / 1024).toFixed(2)}MB`
    });
}
async function ping(msg) {
    msg.sendMsgEx({ content: await global_1.redis.ping() });
}
async function msgconnnet(msg) {
    return msg.sendMsgEx({
        content: msg.content
    });
}
async function isAdmin(uid, iMember, srcGuild) {
    if (global_1.adminId.includes(uid))
        return true;
    if (srcGuild) {
        iMember = await global_1.client.guildApi.guildMember(srcGuild, uid).then(d => {
            return d.data;
        }).catch(err => {
            logger_1.default.error(err);
            return undefined;
        });
    }
    if (iMember && (iMember.roles.includes("2") || iMember.roles.includes("4")))
        return true;
    return await global_1.redis.hGet("auth", uid).then(auth => {
        if (auth == "admin")
            return true;
        return false;
    });
}
function timeConver(time) {
    time /= 1000;
    if (time < 60) {
        return "不足1分钟";
    }
    time /= 60;
    time = parseInt(time.toFixed(0));
    const m = time % 60;
    if (time < 60)
        return `${m}分钟`;
    time /= 60;
    time = parseInt(time.toFixed(0));
    return `${time}小时${m}分钟`;
}
//# sourceMappingURL=admin.js.map