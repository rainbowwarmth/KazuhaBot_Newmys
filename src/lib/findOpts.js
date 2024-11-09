"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.findOpts = findOpts;
const admin_1 = require("../plugins/admin");
async function findOpts(msg) {
    if (!msg.content)
        return { path: "err", fnc: "err" };
    const fnc = await Promise.resolve().then(() => __importStar(require("../../config/opts.json")));
    const command = fnc.command;
    for (const mainKey in command) {
        for (const key in command[mainKey]) {
            const opt = command[mainKey][key];
            if (!opt.type.includes(msg.messageType))
                continue;
            if (!RegExp(opt.reg).test(msg.content))
                continue;
            if (opt.permission != "anyone") {
                if (msg.messageType == "GUILD"
                    && !await (0, admin_1.isAdmin)(msg.author.id, msg.member))
                    continue;
                if (msg.messageType == "DIRECT"
                    && !await (0, admin_1.isAdmin)(msg.author.id, undefined, msg.src_guild_id))
                    continue;
            }
            return {
                path: mainKey,
                fnc: opt.fnc,
            };
        }
    }
    return {
        path: "err",
        fnc: "err",
    };
}
//# sourceMappingURL=findOpts.js.map