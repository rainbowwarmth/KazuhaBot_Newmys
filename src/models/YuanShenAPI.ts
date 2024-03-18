import md5 from "md5";
import lodash from "lodash";
import fetch from "node-fetch";
import { PostList, PostFull} from "./API"

export async function ysmiGetNewsList(type: number, pageSize = 10) {
    return fetch(`https://bbs-api.mihoyo.com/post/wapi/getNewsList?gids=2&page_size=${pageSize}&type=${type}`, {
        method: "GET",
        headers: { Referer: "https://www.miyoushe.com",
        'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/104.0.0.0 Safari/537.36' }
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

export async function ysmiGetPostFull(postId: string) {
    return fetch(`https://bbs-api.mihoyo.com/post/wapi/getPostFull?gids=2&read=1&post_id=${postId}`, {
        method: "GET",
        headers: { Referer: "https://www.miyoushe.com",
        'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/104.0.0.0 Safari/537.36' }
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
