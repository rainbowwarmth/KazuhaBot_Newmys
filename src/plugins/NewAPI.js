"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.detalData = detalData;
var emoticon = null;
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
//# sourceMappingURL=NewAPI.js.map