"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.wdmiGetNewsList = wdmiGetNewsList;
exports.wdmiGetPostFull = wdmiGetPostFull;
const node_fetch_1 = __importDefault(require("node-fetch"));
const logger_1 = __importDefault(require("../lib/logger"));
async function wdmiGetNewsList(type, pageSize = 10) {
    return (0, node_fetch_1.default)(`https://bbs-api-static.miyoushe.com/painter/wapi/getNewsList?gids=4&page_size=${pageSize}&type=${type}`, {
        method: "GET",
        headers: { Referer: 'https://www.miyoushe.com',
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36 Edg/130.0.0.0' }
    }).then(res => {
        return res.json();
    }).then((json) => {
        if (json.data)
            return json.data;
        else
            throw new Error("not found data");
    }).catch(err => {
        logger_1.default.error(err);
        return null;
    });
}
async function wdmiGetPostFull(postId) {
    return (0, node_fetch_1.default)(`https://bbs-api.miyoushe.com/post/wapi/getPostFull?gids=4&read=1&post_id=${postId}`, {
        method: "GET",
        headers: { Referer: 'https://www.miyoushe.com',
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36 Edg/130.0.0.0' }
    }).then(res => {
        return res.json();
    }).then((json) => {
        if (json.data)
            return json.data;
        else
            throw new Error("not found data");
    }).catch(err => {
        logger_1.default.error(err);
        return null;
    });
}
//# sourceMappingURL=WeiDingAPI.js.map