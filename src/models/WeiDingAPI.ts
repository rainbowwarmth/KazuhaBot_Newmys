import md5 from "md5";
import lodash from "lodash";
import fetch from "node-fetch";
import { PostList, PostSearch, PostFull, Emoticon} from "./API"

export async function wdmiGetNewsList(type: number, pageSize = 10) {
    return fetch(`https://bbs-api.mihoyo.com/post/wapi/getNewsList?gids=4&page_size=${pageSize}&type=${type}`, {
        method: "GET",
        headers: { Referer: "https://bbs.mihoyo.com/" }
    }).then(res => {
        return res.json();
    }).then((json: MihoyoAPI<PostList>) => {
        if (json.data) return json.data;
        else throw new Error("not found data");
    }).catch(err => {
        log.error(err);
        return null;
    });
}

export async function wdmiGetPostFull(postId: string) {
    return fetch(`https://bbs-api.mihoyo.com/post/wapi/getPostFull?gids=4&read=1&post_id=${postId}`, {
        method: "GET",
        headers: { Referer: "https://bbs.mihoyo.com/" }
    }).then(res => {
        return res.json();
    }).then((json: MihoyoAPI<PostFull>) => {
        if (json.data) return json.data;
        else throw new Error("not found data");
    }).catch(err => {
        log.error(err);
        return null;
    });
}

export async function wdmiSearchPosts(keyword: string, gids = 4, size = 20) {
    return fetch(`https://bbs-api.mihoyo.com/post/wapi/searchPosts?keyword=${keyword}&gids=${gids}&size=${size}`, {
        method: "GET",
        headers: { Referer: "https://bbs.mihoyo.com/" }
    }).then(res => {
        return res.json();
    }).then((json: MihoyoAPI<PostSearch>) => {
        if (json.data) return json.data;
        else throw json;
    }).catch(err => {
        log.error(err);
        return null;
    });

}

export async function wdmiGetEmoticon() {
    return fetch(`https://bbs-api-static.mihoyo.com/misc/api/emoticon_set?gids=4`).then(res => {
        return res.json();
    }).then((json: MihoyoAPI<Emoticon>) => {
        if (json.data) return json.data;
        else throw new Error("not found data");
    }).catch(err => {
        log.error(err);
    });
}

