import kazuha from "../../../kazuha"; 
import { IMessageEx, sendImage } from "../../../lib/IMessageEx";
import log from "../../../lib/logger";
import { redis } from '../../../lib/global';
import { miGetNewsList, miGetPostFull } from "../models/mysNew";
import { PostFullPost } from "../models/mysNew";

var emoticon: Map<any, any> | null = null;

const gameIds: { [key: number]: string } = {
    1: '崩坏三',
    2: '原神',
    3: '崩坏二',
    4: '未定事件簿',
    5: '大别野',
    6: '崩坏星穹铁道',
    8: '绝区零'
};

export async function newsContentBBS(msg: IMessageEx) {
    let gid = 2
    if (msg.content.includes("崩三") && msg.content.includes("崩坏三")) gid = 1;
    if (msg.content.includes("原神")) gid = 2;
    if (msg.content.includes("崩坏二") && msg.content.includes("崩坏学院二") && msg.content.includes("崩二")) gid = 3;
    if (msg.content.includes("未定事件簿") && msg.content.includes("未定")) gid = 4;
    if (msg.content.includes("大别野") && msg.content.includes("别野")) gid = 5;
    if (msg.content.includes("崩坏星穹铁道") && msg.content.includes("星铁") && msg.content.includes("星穹铁道") && msg.content.includes("铁道")) gid = 6;
    if (msg.content.includes("绝区零")) gid = 8;

    let type = 1;
    if (msg.content.includes("资讯")) type = 3;
    if (msg.content.includes("活动")) type = 2;

    const pagesData = await miGetNewsList(gid, type);
    const _page = msg.content.match(/[0-9]+/);
    const page = _page ? parseInt(_page[0]) : 1;
    if (!pagesData) return;

    if (page <= 0 || page > pagesData.list.length) {
        msg.sendMsgEx({ content: "目前只查前10条最新的公告，请输入1-10之间的整数。" });
        return true;
    }
    const postFull = await miGetPostFull(gid, pagesData.list[page - 1].post.post_id);
    if (!postFull) return;
    const data = await detalData(postFull.post);
    kazuha.render({
        app: "mys",
        type: "mysNew",
        imgType: "jpeg",
        render: { saveId: msg.author.id },
        data: {
            dataConent: data.post.content,
            data,
        }
    }).then((savePath: any) => {
        if (savePath) msg.sendMsgEx({ imagePath: savePath });
        log.mark(kazuha.chalk.blueBright(`[${gameIds[gid]}公告] newsContentBBS/NewBBB.ts`));
    }).catch((err: any) => {
        log.error(err);
    });
}

export async function newsListBBS(msg: IMessageEx) {
    let gid = 2
    if (msg.content.includes("崩三") && msg.content.includes("崩坏三")) gid = 1;
    if (msg.content.includes("原神")) gid = 2;
    if (msg.content.includes("崩坏二") && msg.content.includes("崩坏学院二") && msg.content.includes("崩二")) gid = 3;
    if (msg.content.includes("未定事件簿") && msg.content.includes("未定")) gid = 4;
    if (msg.content.includes("大别野") && msg.content.includes("别野")) gid = 5;
    if (msg.content.includes("崩坏星穹铁道") && msg.content.includes("星铁") && msg.content.includes("星穹铁道") && msg.content.includes("铁道")) gid = 6;
    if (msg.content.includes("绝区零")) gid = 8;

    let type = 1, typeName = "公告";
    if (msg.content.includes("资讯")) type = 3, typeName = "资讯";
    if (msg.content.includes("活动")) type = 2, typeName = "活动";

    const data = await miGetNewsList(gid, type);
    if (!data) return;

    const datas = data.list;
    if (datas.length === 0) return true;

    datas.forEach((element: { post: { created_at: number; }; }) => {
        (element.post as any).created_at = new Date(element.post.created_at * 1000).toLocaleString();
    });

    await kazuha.render({
        app: "mys",
        type: "mysNewList",
        imgType: "jpeg",
        render: { saveId: msg.author.id },
        data: {
            datas,
            typeName
        }
    }).then((savePath: any) => {
        if (savePath) msg.sendMsgEx({ imagePath: savePath });
        log.mark(kazuha.chalk.blueBright(`[${gameIds[gid]}公告列表] newListBBS/NewBBB.ts`));
    }).catch((err: any) => {
        log.error(err);
    });
}

export async function changePushTask(msg: IMessageEx) { 
    if (msg.messageType !== "GUILD") return true;

    let gid = 2
    if (msg.content.includes("崩三") && msg.content.includes("崩坏三")) gid = 1;
    if (msg.content.includes("原神")) gid = 2;
    if (msg.content.includes("崩坏二") && msg.content.includes("崩坏学院二") && msg.content.includes("崩二")) gid = 3;
    if (msg.content.includes("未定事件簿") && msg.content.includes("未定")) gid = 4;
    if (msg.content.includes("大别野") && msg.content.includes("别野")) gid = 5;
    if (msg.content.includes("崩坏星穹铁道") && msg.content.includes("星铁") && msg.content.includes("星穹铁道") && msg.content.includes("铁道")) gid = 6;
    if (msg.content.includes("绝区零")) gid = 8;

    const value = msg.content.includes("开启");
    await redis.hSet(`config:bbbnewsPush:${gid}`, parseInt(msg.channel_id), `${value}`)
        .then(() => {
            const gameName = gameIds[gid] || "未知游戏";
            const statusMessage = value ? `${gameName}米游社公告推送已开启\n每1分钟自动检测一次是否存在新更新公告\n如有更新自动发送公告内容至此。` 
                                        : `${gameName}米游社公告推送已关闭`;
            msg.sendMsgEx({ content: statusMessage });
        })
        .catch(err => log.error(err));
}

export async function taskPushNews() {
    const gameGids = [1, 2, 3, 4, 6, 8]; 

    const msgId = await redis.get("lastestMsgId");
    if (!msgId) return;

    const sendChannels: string[] = [];
    const _newsPushChannels = await redis.hGetAll(`config:newsPush:${gameGids}`).catch(err => log.error(err));
    if (!_newsPushChannels) return;

    for (const channel in _newsPushChannels) {
        if (_newsPushChannels[channel] === "true") sendChannels.push(channel);
    }
    if (sendChannels.length === 0) return;

    const ignoreReg = /封禁名单|大别野/;
    for (const gid of gameGids) {
        const pagesData = [
            { type: "公告", list: (await miGetNewsList(gid, 1))?.list },
            { type: "资讯", list: (await miGetNewsList(gid, 3))?.list }
        ];
    
    const postIds: string[] = [];

    for (const pageData of pagesData) {
        if (!pageData.list) continue;
        for (const page of pageData.list) {
            if (ignoreReg.test(page.post.subject)) continue;
            if (Date.now() / 1000 - page.post.created_at > 3600) continue;
            if (await redis.get(`mysNews:${gid}:${page.post.post_id}`) === "true") continue;

            await redis.set(`mysNews:${gid}:${page.post.post_id}`, "true", { EX: 3600 * 2 });
            postIds.push(page.post.post_id);
        }
    }

        for (const postId of postIds) {
            const postFull = await miGetPostFull(gid, postId);
            if (!postFull) continue;

            const data = await detalData(postFull.post);
            await kazuha.render({
                app: "mys",
                type: "mysNew",
                imgType: "jpeg",
                render: { saveId: "NewBB" },
                data: {
                    dataConent: data.post.content,
                    data,
                }
            }).then((savePath: any) => {
                if (savePath) {
                    const _sendQueue = sendChannels.map(channel => 
                        sendImage({
                            msgId,
                            imagePath: savePath,
                            channelId: channel,
                            messageType: "GUILD"
                        })
                    );
                    log.mark(kazuha.chalk.blueBright(`[${gameIds[gid]}公告推送] taskPushNews/NewBBB.ts`));
                    return Promise.all(_sendQueue).catch(err => log.error(err));
                }
            }).catch((err: any) => log.error(err));
        }
    }
}

export async function detalData(data: PostFullPost) {
    var json;
    try {
        json = JSON.parse(data.post.content);
    } catch (error) {

    }
    if (typeof json == "object") {
        if (json.imgs && json.imgs.length > 0) {
            for (const val of json.imgs) {
                data.post.content = ` <div class="ql-image-box"><img src="${val}?x-oss-process=image//resize,s_300/quality,q_40/auto-orient,0/interlace,1/format,jpg"></div>`;
            }
        }
    } else {
        for (const img of data.post.images) {
            data.post.content = data.post.content.replace(img, img + "?x-oss-process=image//resize,s_300/quality,q_40/auto-orient,0/interlace,1/format,jpg");
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
