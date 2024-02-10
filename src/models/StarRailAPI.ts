import md5 from "md5";
import lodash from "lodash";
import fetch from "node-fetch";
import { PostList, PostFull} from "./API"

export async function srmiGetNewsList(type: number, pageSize = 10) {
    return fetch(`https://bbs-api.mihoyo.com/post/wapi/getNewsList?gids=6&page_size=${pageSize}&type=${type}`, {
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

export async function srmiGetPostFull(postId: string) {
    return fetch(`https://bbs-api.mihoyo.com/post/wapi/getPostFull?gids=6&read=1&post_id=${postId}`, {
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
