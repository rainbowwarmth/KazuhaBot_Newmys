import { IMessageEx, sendImage, render } from "#kazuha.lib";
import { bbbmiGetEmoticon, bbbmiGetNewsList, bbbmiGetPostFull, PostFullPost } from "#kazuha.models";


var emoticon: Map<any, any> | null = null;

export async function bbbnewsContentBBS(msg: IMessageEx) {
    var type = 1;
    if (msg.content.includes("资讯")) type = 3;
    if (msg.content.includes("活动")) type = 2;

    const pagesData = await bbbmiGetNewsList(type);
    const _page = msg.content.match(/[0-9]+/);
    const page = _page ? parseInt(_page[0]) : 1;
    if (!pagesData) return;

    if (page <= 0 || page > pagesData.list.length) {
        msg.sendMsgEx({ content: "目前只查前10条最新的公告，请输入1-10之间的整数。" });
        return true;
    }
    const postFull = await bbbmiGetPostFull(pagesData.list[page - 1].post.post_id);
    if (!postFull) return;
    const data = await detalData(postFull.post);
    //log.debug(data);
    render({
        app: "New",
        type: "NewBBB",
        imgType: "jpeg",
        render: { saveId: msg.author.id },
        data: {
            dataConent: data.post.content,
            data,
        }
    }).then(savePath => {
        if (savePath)
            msg.sendMsgEx({ imagePath: savePath });
            log.mark(`[崩坏3公告] newsContentBBS/NewBBB.ts`);
    }).catch(err => {
        log.error(err);
    });

}

export async function bbbnewsListBBS(msg: IMessageEx) {

    var type = 1, typeName = "公告";
    if (msg.content.includes("资讯")) type = 3, typeName = "资讯";
    if (msg.content.includes("活动")) type = 2, typeName = "活动";

    const data = await bbbmiGetNewsList(type, 5);
    if (!data) return;

    var datas = data.list;
    if (datas.length == 0) {
        return true;
    }

    datas.forEach(element => {
        (element.post as any).created_at = new Date(element.post.created_at * 1000).toLocaleString();
    });

    await render({
        app: "New",
        type: "NewBBBList",
        imgType: "jpeg",
        render: { saveId: msg.author.id },
        data: {
            datas,
            typeName
        }
    }).then(savePath => {
        if (savePath) msg.sendMsgEx({ imagePath: savePath });
        log.mark(`[崩坏3公告列表] newListBBS/NewBBB.ts`);
    }).catch(err => {
        log.error(err);
    });

}

export async function bbbchangePushTask(msg: IMessageEx) {
    if (msg.messageType != "GUILD") return true;
    const value = msg.content.includes("开启") ? true : false;
    await global.redis.hSet("config:bbbnewsPush", parseInt(msg.channel_id), `${value}`).then((v) => {
        if (value) return msg.sendMsgEx({
            content: `崩坏3米游社公告推送已开启` + `\n每1分钟自动检测一次是否存在新更新公告` + `\n如有更新自动发送公告内容至此。`
        });
        else {
            return msg.sendMsgEx({ content: `崩坏3米游社公告推送已关闭` });
        }
    }).catch(err => {
        log.error(err);
    });
}

export async function bbbtaskPushNews() {
    const msgId = await global.redis.get("lastestMsgId");
    if (!msgId) return;

    const sendChannels: string[] = [];
    const _newsPushChannels = await global.redis.hGetAll("config:bbbnewsPush").catch(err => { log.error(err); });
    if (!_newsPushChannels) return;

    for (const channel in _newsPushChannels) {
        if (_newsPushChannels[channel] == "true")
            sendChannels.push(channel);
    }
    if (sendChannels.length == 0) return;
    const ignoreReg = /封禁名单|大别野/;
    const pagesData = [{ type: "公告", list: (await bbbmiGetNewsList(1))?.list }, { type: "资讯", list: (await bbbmiGetNewsList(3))?.list }];
    const postIds: string[] = [];

    for (const pageData of pagesData) {
        if (!pageData.list) continue;
        for (const page of pageData.list) {
            if (ignoreReg.test(page.post.subject)) continue;
            if (new Date().getTime() / 1000 - page.post.created_at > 3600) continue;
            if (await global.redis.get(`mysNews:${page.post.post_id}`) == `${true}`) continue;
            await global.redis.set(`mysNews:${page.post.post_id}`, `${true}`, { EX: 3600 * 2 });
            postIds.push(page.post.post_id);
        }
    }
    for (const postId of postIds) {
        const postFull = await bbbmiGetPostFull(postId);
        if (!postFull) return;
        const data = await detalData(postFull.post);
        //log.debug(data);
        await render({
            app: "New",
            type: "NewBBB",
            imgType: "jpeg",
            render: { saveId: "NewBB" },
            data: {
                dataConent: data.post.content,
                data,
            }
        }).then(savePath => {
            if (savePath) {
                const _sendQueue: Promise<any>[] = [];
                for (const sendChannel of sendChannels) {
                    _sendQueue.push(sendImage({
                        msgId,
                        imagePath: savePath,
                        channelId: sendChannel,
                        messageType: "GUILD"
                    }));
                }
            log.mark(`[崩坏学园2公告推送] taskPushNews/NewBBB.ts`);
                return Promise.all(_sendQueue).catch(err => {
                    log.error(err);
                });
            }
        }).catch(err => {
            log.error(err);
        });
    }
}

async function detalData(data: PostFullPost) {
    var json;
    try {
        json = JSON.parse(data.post.content);
    } catch (error) {

    }
    if (typeof json == "object") {
        if (json.imgs && json.imgs.length > 0) {
            for (const val of json.imgs) {
                data.post.content = ` <div class="ql-image-box"><img src="${val}?x-oss-process=image//resize,s_600/quality,q_80/auto-orient,0/interlace,1/format,png"></div>`;
            }
        }
    } else {
        for (const img of data.post.images) {
            data.post.content = data.post.content.replace(img, img + "?x-oss-process=image//resize,s_600/quality,q_80/auto-orient,0/interlace,1/format,jpg");
        }
        if (!emoticon) {
            emoticon = await mysEmoticon();
        }
        data.post.content = data.post.content.replace(/_\([^)]*\)/g, function (t, e) {
            t = t.replace(/_\(|\)/g, "");
            if (emoticon?.has(t)) {
                return `<img class="emoticon-image" src="${emoticon.get(t)}"/>`;
            } else {
                return "";
            }
        });
        var arrEntities: { [key: string]: string } = { 'lt': '<', 'gt': '>', 'nbsp': ' ', 'amp': '&', 'quot': '"' };
        data.post.content = data.post.content.replace(/&(lt|gt|nbsp|amp|quot);/ig, function (all, t) {
            return arrEntities[t];
        });
    }
    (data.post as any).created_time = new Date(data.post.created_at * 1000).toLocaleString();
    for (const i in data.stat) {
        (data as any).stat[i] = data.stat[i] > 10000 ? (data.stat[i] / 10000).toFixed(2) + "万" : data.stat[i];
    }

    return data;
}

async function mysEmoticon() {
    const emp = new Map();
    const res = await bbbmiGetEmoticon();
    if (!res) return null;
    for (const val of res.list) {
        if (!val.icon) continue;
        for (const list of val.list) {
            if (!list.icon) continue;
            emp.set(list.name, list.icon);
        }
    }
    return emp;
}
