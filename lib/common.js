"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Format = void 0;
exports.writeFileSyncEx = writeFileSyncEx;
exports.sleep = sleep;
exports.cacheJson = cacheJson;
exports.redisCache = redisCache;
const fs_1 = __importDefault(require("fs"));
const global_1 = require("../models/global");
const logger_1 = __importDefault(require("./logger"));
function writeFileSyncEx(filePath, data, options) {
    const pathPart = filePath.split("/");
    pathPart.pop();
    if (fs_1.default.existsSync(pathPart.join("/"))) {
        fs_1.default.writeFileSync(filePath, data, options);
    }
    else {
        var _p = "";
        for (const [iv, _part] of pathPart.entries()) {
            //if (iv + 1 == pathPart.length) break;
            _p += `${_part}/`;
            if (fs_1.default.existsSync(_p))
                continue;
            else
                fs_1.default.mkdirSync(_p);
        }
        writeFileSyncEx(filePath, data, options);
    }
}
function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}
function cacheJson(opt, app, data) {
    const jsonPath = `${global_1._path}/generate/cache/${app}.json`;
    try {
        if (opt == "r") {
            if (!fs_1.default.existsSync(jsonPath))
                return null;
            const data = fs_1.default.readFileSync(jsonPath, { encoding: "utf8" });
            const json = JSON.parse(data);
            return json;
        }
        else {
            writeFileSyncEx(jsonPath, JSON.stringify(data), { encoding: "utf8" });
            return true;
        }
    }
    catch (error) {
        logger_1.default.error(error);
        if (opt == "r")
            return null;
        else
            return false;
    }
}
async function redisCache(type, key, field, data, expire) {
    if (type == "r") {
        return await global_1.redis.hGet(key, field) || null;
    }
    ;
    if (type == "w") {
        global_1.redis.hSet(key, field, data).then(() => {
            if (expire)
                global_1.redis.expire(key, expire);
        });
    }
    return null;
}
exports.Format = {
    /**
     * string to number
     * @param d string
     * @returns number
     */
    int: (d) => {
        return parseInt(d);
    },
    comma: (num, fix = 0) => {
        num = parseFloat((num * 1).toFixed(fix));
        let [integer, decimal] = num.toString().split('.');
        integer = integer.replace(/\d(?=(\d{3})+$)/g, '$&,');
        return `${integer}${decimal ? '.' + decimal : ''}`;
    },
    pct: (num, fix = 1) => {
        return num.toFixed(fix) + '%';
    },
    percent: (num, fix = 1) => {
        return exports.Format.pct(num * 100, fix);
    }
};
//# sourceMappingURL=common.js.map