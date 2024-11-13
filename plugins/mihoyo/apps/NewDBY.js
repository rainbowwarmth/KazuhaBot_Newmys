"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.dbynewsContentBBS = dbynewsContentBBS;
exports.dbynewsListBBS = dbynewsListBBS;
exports.dbychangePushTask = dbychangePushTask;
exports.dbytaskPushNews = dbytaskPushNews;
const kazuha_1 = __importDefault(require("../../../kazuha"));
const logger_1 = __importDefault(require("../../../lib/logger"));
const global_1 = require("../../../lib/global");
async function dbynewsContentBBS(msg) {
    var type = 1;
    if (msg.content.includes("资讯"))
        type = 3;
    if (msg.content.includes("活动"))
        type = 2;
    const pagesData = await kazuha_1.default.DBYmiGetNewsList(type);
    const _page = msg.content.match(/[0-9]+/);
    const page = _page ? parseInt(_page[0]) : 1;
    if (!pagesData)
        return;
    if (page <= 0 || page > pagesData.list.length) {
        msg.sendMsgEx({ content: "目前只查前10条最新的公告，请输入1-10之间的整数。" });
        return true;
    }
    const postFull = await kazuha_1.default.DBYmiGetPostFull(pagesData.list[page - 1].post.post_id);
    if (!postFull)
        return;
    const data = await kazuha_1.default.detalData(postFull.post);
    //log.debug(data);
    kazuha_1.default.render({
        app: "mys",
        type: "mysNew",
        imgType: "jpeg",
        render: { saveId: msg.author.id },
        data: {
            dataConent: data.post.content,
            data,
        }
    }).then((savePath) => {
        if (savePath)
            msg.sendMsgEx({ imagePath: savePath });
        logger_1.default.mark(kazuha_1.default.chalk.blueBright(`[大别野公告] newsContentBBS/NewDBY.ts`));
    }).catch((err) => {
        logger_1.default.error(err);
    });
}
async function dbynewsListBBS(msg) {
    var type = 1, typeName = "公告";
    if (msg.content.includes("资讯"))
        type = 3, typeName = "资讯";
    if (msg.content.includes("活动"))
        type = 2, typeName = "活动";
    const data = await kazuha_1.default.DBYmiGetNewsList(type, 5);
    if (!data)
        return;
    var datas = data.list;
    if (datas.length == 0) {
        return true;
    }
    datas.forEach((element) => {
        element.post.created_at = new Date(element.post.created_at * 1000).toLocaleString();
    });
    await kazuha_1.default.render({
        app: "mys",
        type: "mysNewList",
        imgType: "jpeg",
        render: { saveId: msg.author.id },
        data: {
            datas,
            typeName
        }
    }).then((savePath) => {
        if (savePath)
            msg.sendMsgEx({ imagePath: savePath });
        logger_1.default.mark(kazuha_1.default.chalk.blueBright(`[崩坏学园2公告列表] newListBBS/NewDBY.ts`));
    }).catch((err) => {
        logger_1.default.error(err);
    });
}
async function dbychangePushTask(msg) {
    if (msg.messageType != "GUILD")
        return true;
    const value = msg.content.includes("开启") ? true : false;
    await global_1.redis.hSet("config:dbynewsPush", parseInt(msg.channel_id), `${value}`).then((v) => {
        if (value)
            return msg.sendMsgEx({
                content: `大别野米游社公告推送已开启` + `\n每1分钟自动检测一次是否存在新更新公告` + `\n如有更新自动发送公告内容至此。`
            });
        else {
            return msg.sendMsgEx({ content: `大别野米游社公告推送已关闭` });
        }
    }).catch(err => {
        logger_1.default.error(err);
    });
}
async function dbytaskPushNews() {
    const msgId = await global_1.redis.get("lastestMsgId");
    if (!msgId)
        return;
    const sendChannels = [];
    const _newsPushChannels = await global_1.redis.hGetAll("config:dbynewsPush").catch((err) => { logger_1.default.error(err); });
    if (!_newsPushChannels)
        return;
    for (const channel in _newsPushChannels) {
        if (_newsPushChannels[channel] == "true")
            sendChannels.push(channel);
    }
    if (sendChannels.length == 0)
        return;
    const ignoreReg = /冒险助力礼包|纪行|预下载|脚本外挂|集中反馈|作品展示|同人|已开奖|一图流|云·原神||OST/;
    const pagesData = [{ type: "公告", list: (await kazuha_1.default.DBYmiGetNewsList(1))?.list }, { type: "资讯", list: (await kazuha_1.default.DBYmiGetNewsList(3))?.list }];
    const postIds = [];
    for (const pageData of pagesData) {
        if (!pageData.list)
            continue;
        for (const page of pageData.list) {
            if (ignoreReg.test(page.post.subject))
                continue;
            if (new Date().getTime() / 1000 - page.post.created_at > 3600)
                continue;
            if (await global_1.redis.get(`mysNews:${page.post.post_id}`) == `${true}`)
                continue;
            await global_1.redis.set(`mysNews:${page.post.post_id}`, `${true}`, { EX: 3600 * 2 });
            postIds.push(page.post.post_id);
        }
    }
    for (const postId of postIds) {
        const postFull = await kazuha_1.default.DBYmiGetPostFull(postId);
        if (!postFull)
            return;
        const data = await kazuha_1.default.detalData(postFull.post);
        //log.debug(data);
        await kazuha_1.default.render({
            app: "mys",
            type: "mysNew",
            imgType: "jpeg",
            render: { saveId: "NewDBY" },
            data: {
                dataConent: data.post.content,
                data,
            }
        }).then((savePath) => {
            if (savePath) {
                const _sendQueue = [];
                for (const sendChannel of sendChannels) {
                    _sendQueue.push(kazuha_1.default.sendImage({
                        msgId,
                        imagePath: savePath,
                        channelId: sendChannel,
                        messageType: "GUILD"
                    }));
                }
                logger_1.default.mark(kazuha_1.default.chalk.blueBright(`[大别野公告推送] taskPushNews/NewDBY.ts`));
                return Promise.all(_sendQueue).catch(err => {
                    logger_1.default.error(err);
                });
            }
        }).catch((err) => {
            logger_1.default.error(err);
        });
    }
}
//# sourceMappingURL=NewDBY.js.map