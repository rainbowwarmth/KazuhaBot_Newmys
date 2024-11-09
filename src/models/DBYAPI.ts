import md5 from "md5";
import lodash from "lodash";
import fetch from "node-fetch";
import { PostList, PostFull} from "./API"
import { MihoyoAPI } from "../lib/type";
import log from "../lib/logger";

export async function DBYmiGetNewsList(type: number, pageSize = 10) {
    return fetch(`https://bbs-api-static.miyoushe.com/painter/wapi/getNewsList?gids=5&page_size=${pageSize}&type=${type}`, {
        method: "GET",
        headers: { Referer: 'https://www.miyoushe.com',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36 Edg/130.0.0.0' }
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

export async function DBYmiGetPostFull(postId: string) {
    return fetch(`https://bbs-api.miyoushe.com/post/wapi/getPostFull?gids=5&read=1&post_id=${postId}`, {
        method: "GET",
        headers: { Referer: 'https://www.miyoushe.com',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36 Edg/130.0.0.0' }
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
