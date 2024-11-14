"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.newsContentBBS = newsContentBBS;
exports.newsListBBS = newsListBBS;
exports.changePushTask = changePushTask;
exports.taskPushNews = taskPushNews;
exports.detalData = detalData;
const kazuha_1 = __importDefault(require("../../../kazuha"));
const IMessageEx_1 = require("../../../lib/IMessageEx");
const logger_1 = __importDefault(require("../../../lib/logger"));
const global_1 = require("../../../lib/global");
const mysNew_1 = require("../models/mysNew");
var emoticon = null;
const gameIds = {
    1: '崩坏三',
    2: '原神',
    3: '崩坏二',
    4: '未定事件簿',
    5: '大别野',
    6: '崩坏星穹铁道',
    8: '绝区零'
};
async function newsContentBBS(msg) {
    let gid = 2;
    if (msg.content.includes("崩三") && msg.content.includes("崩坏三"))
        gid = 1;
    if (msg.content.includes("原神"))
        gid = 2;
    if (msg.content.includes("崩坏二") && msg.content.includes("崩坏学院二") && msg.content.includes("崩二"))
        gid = 3;
    if (msg.content.includes("未定事件簿") && msg.content.includes("未定"))
        gid = 4;
    if (msg.content.includes("大别野") && msg.content.includes("别野"))
        gid = 5;
    if (msg.content.includes("崩坏星穹铁道") && msg.content.includes("星铁") && msg.content.includes("星穹铁道") && msg.content.includes("铁道"))
        gid = 6;
    if (msg.content.includes("绝区零"))
        gid = 8;
    let type = 1;
    if (msg.content.includes("资讯"))
        type = 3;
    if (msg.content.includes("活动"))
        type = 2;
    const pagesData = await (0, mysNew_1.miGetNewsList)(gid, type);
    const _page = msg.content.match(/[0-9]+/);
    const page = _page ? parseInt(_page[0]) : 1;
    if (!pagesData)
        return;
    if (page <= 0 || page > pagesData.list.length) {
        msg.sendMsgEx({ content: "目前只查前10条最新的公告，请输入1-10之间的整数。" });
        return true;
    }
    const postFull = await (0, mysNew_1.miGetPostFull)(gid, pagesData.list[page - 1].post.post_id);
    if (!postFull)
        return;
    const data = await detalData(postFull.post);
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
        logger_1.default.mark(kazuha_1.default.chalk.blueBright(`[${gameIds[gid]}公告] newsContentBBS/NewBBB.ts`));
    }).catch((err) => {
        logger_1.default.error(err);
    });
}
async function newsListBBS(msg) {
    let gid = 2;
    if (msg.content.includes("崩三") && msg.content.includes("崩坏三"))
        gid = 1;
    if (msg.content.includes("原神"))
        gid = 2;
    if (msg.content.includes("崩坏二") && msg.content.includes("崩坏学院二") && msg.content.includes("崩二"))
        gid = 3;
    if (msg.content.includes("未定事件簿") && msg.content.includes("未定"))
        gid = 4;
    if (msg.content.includes("大别野") && msg.content.includes("别野"))
        gid = 5;
    if (msg.content.includes("崩坏星穹铁道") && msg.content.includes("星铁") && msg.content.includes("星穹铁道") && msg.content.includes("铁道"))
        gid = 6;
    if (msg.content.includes("绝区零"))
        gid = 8;
    let type = 1, typeName = "公告";
    if (msg.content.includes("资讯"))
        type = 3, typeName = "资讯";
    if (msg.content.includes("活动"))
        type = 2, typeName = "活动";
    const data = await (0, mysNew_1.miGetNewsList)(gid, type);
    if (!data)
        return;
    const datas = data.list;
    if (datas.length === 0)
        return true;
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
        logger_1.default.mark(kazuha_1.default.chalk.blueBright(`[${gameIds[gid]}公告列表] newListBBS/NewBBB.ts`));
    }).catch((err) => {
        logger_1.default.error(err);
    });
}
async function changePushTask(msg) {
    if (msg.messageType !== "GUILD")
        return true;
    let gid = 1; // 默认值
    // 输出收到的消息内容
    logger_1.default.debug(`消息内容: ${msg.content}`);
    // 优先检查每个关键词，确保顺序正确
    if (msg.content.includes("崩坏星穹铁道") || msg.content.includes("星铁")) {
        gid = 6; // 崩坏星穹铁道
        logger_1.default.debug("匹配到 崩坏星穹铁道 -> gid = 6");
    }
    else if (msg.content.includes("崩三") && msg.content.includes("崩坏三")) {
        gid = 1; // 崩坏三
        logger_1.default.debug("匹配到 崩坏三 -> gid = 1");
    }
    else if (msg.content.includes("原神")) {
        gid = 2; // 原神
        logger_1.default.debug("匹配到 原神 -> gid = 2");
    }
    else if (msg.content.includes("崩坏二") && msg.content.includes("崩坏学院二") && msg.content.includes("崩二")) {
        gid = 3; // 崩坏二
        logger_1.default.debug("匹配到 崩坏二 -> gid = 3");
    }
    else if (msg.content.includes("未定事件簿")) {
        gid = 4; // 未定事件簿
        logger_1.default.debug("匹配到 未定事件簿 -> gid = 4");
    }
    else if (msg.content.includes("大别野") && msg.content.includes("别野")) {
        gid = 5; // 大别野
        logger_1.default.debug("匹配到 大别野 -> gid = 5");
    }
    else if (msg.content.includes("绝区零")) {
        gid = 8; // 绝区零
        logger_1.default.debug("匹配到 绝区零 -> gid = 8");
    }
    // 记录最终的gid值
    logger_1.default.debug(`最终匹配的gid值: ${gid}`);
    // 游戏前缀处理
    const gamePrefix = gid === 1 ? 'bbb' :
        gid === 2 ? 'ys' :
            gid === 3 ? 'bb' :
                gid === 4 ? 'wd' : // 确保未定事件簿匹配到 wd
                    gid === 5 ? 'dby' :
                        gid === 6 ? 'sr' : // 崩坏星穹铁道 xq
                            gid === 8 ? 'zzz' :
                                'unknown';
    logger_1.default.debug(`设置的gamePrefix: ${gamePrefix}`);
    const value = msg.content.includes("开启");
    await global_1.redis.hSet(`config:${gamePrefix}newsPush`, parseInt(msg.channel_id), `${value}`)
        .then(() => {
        const gameName = gameIds[gid] || "未知游戏";
        const statusMessage = value
            ? `${gameName}米游社公告推送已开启\n每1分钟自动检测一次是否存在新更新公告\n如有更新自动发送公告内容至此。`
            : `${gameName}米游社公告推送已关闭`;
        // 发送状态信息
        msg.sendMsgEx({ content: statusMessage });
    })
        .catch(err => logger_1.default.error(err));
}
async function taskPushNews() {
    // List of all available game IDs (gid)
    const allGameIds = [1, 2, 3, 4, 5, 6, 8]; // Add or remove game IDs as needed
    const msgId = await global_1.redis.get("lastestMsgId");
    if (!msgId)
        return;
    // Loop through each game ID
    for (const gid of allGameIds) {
        const _newsPushChannels = await global_1.redis.hGetAll(`config:${getGamePrefix(gid)}newsPush`).catch(err => { logger_1.default.error(err); });
        if (!_newsPushChannels)
            continue;
        const sendChannels = []; // 每次开始时清空 sendChannels
        // 获取当前游戏的所有频道推送设置
        for (const channel in _newsPushChannels) {
            if (_newsPushChannels[channel] == "true") {
                sendChannels.push(channel); // 如果开启了公告推送，将频道添加到 sendChannels
            }
        }
        if (sendChannels.length == 0)
            continue; // 如果没有频道开启推送，则跳过
        const gameName = getGameName(gid);
        logger_1.default.mark(`${gameName} 官方公告检查中`);
        const ignoreReg = getIgnoreReg(gid);
        const pagesData = [
            { type: "公告", list: (await (0, mysNew_1.miGetNewsList)(gid, 1))?.list },
            { type: "资讯", list: (await (0, mysNew_1.miGetNewsList)(gid, 3))?.list }
        ];
        const postIds = [];
        // Process each page for the game
        for (const pageData of pagesData) {
            if (!pageData.list)
                continue;
            for (const page of pageData.list) {
                if (ignoreReg.test(page.post.subject))
                    continue;
                if (new Date().getTime() / 1000 - page.post.created_at > 43200)
                    continue;
                if (await global_1.redis.get(`mysNews:${page.post.post_id}`) == `${true}`)
                    continue;
                await global_1.redis.set(`mysNews:${page.post.post_id}`, `${true}`, { EX: 3600 * 2 });
                postIds.push(page.post.post_id);
            }
        }
        // Process posts for the game
        for (const postId of postIds) {
            const postFull = await (0, mysNew_1.miGetPostFull)(gid, postId);
            if (!postFull)
                continue;
            const data = await detalData(postFull.post);
            await kazuha_1.default.render({
                app: "mys",
                type: "mysNew",
                imgType: "jpeg",
                render: { saveId: "NewBB" },
                data: {
                    dataConent: data.post.content,
                    data,
                }
            }).then((savePath) => {
                if (savePath) {
                    const _sendQueue = [];
                    for (const sendChannel of sendChannels) {
                        _sendQueue.push((0, IMessageEx_1.sendImage)({
                            msgId,
                            imagePath: savePath,
                            channelId: sendChannel,
                            messageType: "GUILD"
                        }));
                    }
                    logger_1.default.mark(kazuha_1.default.chalk.blueBright(`[${gameName}公告推送] taskPushNews/NewBBB.ts`));
                    return Promise.all(_sendQueue).catch(err => {
                        logger_1.default.error(err);
                    });
                }
            }).catch((err) => {
                logger_1.default.error(err);
            });
        }
        logger_1.default.mark(`${gameName} 官方公告检查完成`);
    }
}
async function detalData(data) {
    var json;
    try {
        json = JSON.parse(data.post.content);
    }
    catch (error) {
    }
    if (typeof json == "object") {
        if (json.imgs && json.imgs.length > 0) {
            for (const val of json.imgs) {
                data.post.content = ` <div class="ql-image-box"><img src="${val}?x-oss-process=image//resize,s_300/quality,q_40/auto-orient,0/interlace,1/format,jpg"></div>`;
            }
        }
    }
    else {
        for (const img of data.post.images) {
            data.post.content = data.post.content.replace(img, img + "?x-oss-process=image//resize,s_300/quality,q_40/auto-orient,0/interlace,1/format,jpg");
        }
        data.post.content = data.post.content.replace(/_\([^)]*\)/g, function (t, e) {
            t = t.replace(/_\(|\)/g, "");
            if (emoticon?.has(t)) {
                return `<img class="emoticon-image" src="${emoticon.get(t)}"/>`;
            }
            else {
                return "";
            }
        });
        var arrEntities = { 'lt': '<', 'gt': '>', 'nbsp': ' ', 'amp': '&', 'quot': '"' };
        data.post.content = data.post.content.replace(/&(lt|gt|nbsp|amp|quot);/ig, function (all, t) {
            return arrEntities[t];
        });
    }
    data.post.created_time = new Date(data.post.created_at * 1000).toLocaleString();
    for (const i in data.stat) {
        data.stat[i] = data.stat[i] > 10000 ? (data.stat[i] / 10000).toFixed(2) + "万" : data.stat[i];
    }
    return data;
}
function getGameName(gid) {
    const gameNames = {
        1: '崩坏三',
        2: '原神',
        3: '崩坏二',
        4: '未定事件簿',
        5: '大别野',
        6: '崩坏星穹铁道',
        8: '绝区零'
    };
    return gameNames[gid] || "未知游戏";
}
// Helper function to get ignore regex based on gid
function getIgnoreReg(gid) {
    const ignoreRegs = {
        1: /封禁名单|大别野/,
        2: /封禁名单|大别野/,
        3: /已开奖|大别野/,
        4: /大别野/,
        5: /大别野/,
        6: /星铁/,
        8: /绝区零/
    };
    return ignoreRegs[gid] || /大别野/;
}
function getGamePrefix(gid) {
    const gamePrefixes = {
        1: "bbb", // 崩坏3
        2: "ys", // 原神
        3: "bb", // 崩坏学园2
        4: "wd", // 未定
        5: "dby", // 大别野
        6: "sr", // 星铁
        8: "zzz" // 绝区零
    };
    return gamePrefixes[gid] || "unknown"; // Default to "unknown" if gid doesn't match
}
//# sourceMappingURL=mysNew.js.map