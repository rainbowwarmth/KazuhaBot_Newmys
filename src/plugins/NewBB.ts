import kazuha from "../kazuha";
import { IMessageEx } from "../lib/IMessageEx";

export async function bbnewsContentBBS(msg: IMessageEx) {
    var type = 1;
    if (msg.content.includes("资讯")) type = 3;
    if (msg.content.includes("活动")) type = 2;

    const pagesData = await kazuha.bbmiGetNewsList(type);
    const _page = msg.content.match(/[0-9]+/);
    const page = _page ? parseInt(_page[0]) : 1;
    if (!pagesData) return;

    if (page <= 0 || page > pagesData.list.length) {
        msg.sendMsgEx({ content: "目前只查前10条最新的公告，请输入1-10之间的整数。" });
        return true;
    }
    const postFull = await kazuha.bbmiGetPostFull(pagesData.list[page - 1].post.post_id);
    if (!postFull) return;
    const data = await kazuha.detalData(postFull.post);
    //log.debug(data);
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
        if (savePath)
            msg.sendMsgEx({ imagePath: savePath });
            log.mark(kazuha.chalk.blueBright(`[崩坏学园2公告] newsContentBBS/NewBB.ts`));
    }).catch((err: any) => {
        log.error(err);
    });

}

export async function bbnewsListBBS(msg: IMessageEx) {

    var type = 1, typeName = "公告";
    if (msg.content.includes("资讯")) type = 3, typeName = "资讯";
    if (msg.content.includes("活动")) type = 2, typeName = "活动";

    const data = await kazuha.bbmiGetNewsList(type, 5);
    if (!data) return;

    var datas = data.list;
    if (datas.length == 0) {
        return true;
    }

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
        log.mark(kazuha.chalk.blueBright(`[崩坏学园2公告列表] newListBBS/NewBB.ts`));
    }).catch((err: any) => {
        log.error(err);
    });

}

export async function bbchangePushTask(msg: IMessageEx) {
    if (msg.messageType != "GUILD") return true;
    const value = msg.content.includes("开启") ? true : false;
    await global.redis.hSet("config:bbnewsPush", parseInt(msg.channel_id), `${value}`).then((v) => {
        if (value) return msg.sendMsgEx({
            content: `崩坏学园2米游社公告推送已开启` + `\n每1分钟自动检测一次是否存在新更新公告` + `\n如有更新自动发送公告内容至此。`
        });
        else {
            return msg.sendMsgEx({ content: `崩坏学园2米游社公告推送已关闭` });
        }
    }).catch(err => {
        log.error(err);
    });
}

export async function bbtaskPushNews() {
    const msgId = await global.redis.get("lastestMsgId");
    if (!msgId) return;

    const sendChannels: string[] = [];
    const _newsPushChannels = await global.redis.hGetAll("config:bbnewsPush").catch(err => { log.error(err); });
    if (!_newsPushChannels) return;

    for (const channel in _newsPushChannels) {
        if (_newsPushChannels[channel] == "true")
            sendChannels.push(channel);
    }
    if (sendChannels.length == 0) return;

    const ignoreReg = /已开奖|大别野/;
    const pagesData = [{ type: "公告", list: (await kazuha.bbmiGetNewsList(1))?.list }, { type: "资讯", list: (await kazuha.bbmiGetNewsList(3))?.list }];
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
        const postFull = await kazuha.bbmiGetPostFull(postId);
        if (!postFull) return;
        const data = await kazuha.detalData(postFull.post);
        //log.debug(data);
        await kazuha.render({
            app: "New",
            type: "NewBBList",
            imgType: "jpeg",
            render: { saveId: "NewBB" },
            data: {
                dataConent: data.post.content,
                data,
            }
        }).then((savePath: any) => {
            if (savePath) {
                const _sendQueue: Promise<any>[] = [];
                for (const sendChannel of sendChannels) {
                    _sendQueue.push(kazuha.sendImage({
                        msgId,
                        imagePath: savePath,
                        channelId: sendChannel,
                        messageType: "GUILD"
                    }));
                }
            log.mark(kazuha.chalk.blueBright(`[崩坏学园2公告推送] taskPushNews/NewBB.ts`));
                return Promise.all(_sendQueue).catch(err => {
                    log.error(err);
                });
            }
        }).catch((err: any) => {
            log.error(err);
        });
    }
}

