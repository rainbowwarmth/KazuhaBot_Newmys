"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.IMessageEx = void 0;
exports.sendImage = sendImage;
const fs_1 = __importDefault(require("fs"));
const node_fetch_1 = __importDefault(require("node-fetch"));
const form_data_1 = __importDefault(require("form-data"));
const kazuha_1 = require("../kazuha");
const global_1 = require("../models/global");
const logger_1 = __importDefault(require("./logger"));
class IMessageEx {
    constructor(msg, messageType) {
        this.id = msg.id;
        this.channel_id = msg.channel_id;
        this.guild_id = msg.guild_id;
        this.content = msg.content;
        this.timestamp = msg.timestamp;
        this.edited_timestamp = msg.edited_timestamp;
        this.mention_everyone = msg.mention_everyone;
        this.author = msg.author;
        this.member = msg.member;
        this.attachments = msg.attachments;
        this.embeds = msg.embeds;
        this.mentions = msg.mentions;
        this.ark = msg.ark;
        this.seq = msg.seq;
        this.seq_in_channel = msg.seq_in_channel;
        this.messageType = messageType;
        if (messageType == "DIRECT") {
            logger_1.default.info(`私信[${msg.guild_id}][${msg.channel_id}](${msg.author.username}):${msg.content}`);
            return;
        }
        for (const guild of saveGuildsTree) {
            if (guild.id == this.guild_id) {
                for (const channel of guild.channel) {
                    if (channel.id == this.channel_id) {
                        this.guild_name = guild.name;
                        this.channel_name = channel.name;
                        logger_1.default.info(`频道[${this.guild_name}][${this.channel_name}](${this.author.username}|${this.author.id}):${this.content}`);
                        return;
                    }
                }
            }
        }
        logger_1.default.warn(`unKnown message:[${msg.guild_id}][${msg.channel_id}](${msg.author.username}):${msg.content}`);
    }
    async sendMsgEx(option) {
        global_1.botStatus.msgSendNum++;
        const { ref, imagePath, content, initiative } = option;
        const { id, guild_id, channel_id } = this;
        if (imagePath) {
            option.messageType = option.messageType || this.messageType;
            option.msgId = option.msgId || this.id;
            option.guildId = option.guildId || this.guild_id;
            option.channelId = option.channelId || this.channel_id;
            return sendImage(option);
        }
        else {
            if (this.messageType == "GUILD") {
                return global_1.client.messageApi.postMessage(channel_id, {
                    content: content,
                    msg_id: initiative ? undefined : id,
                    message_reference: ref ? { message_id: id, } : undefined
                });
            }
            else {
                return global_1.client.directMessageApi.postDirectMessage(guild_id, {
                    msg_id: initiative ? undefined : id,
                    content: content,
                });
            }
        }
    }
}
exports.IMessageEx = IMessageEx;
async function sendImage(option) {
    const { messageType, initiative, content, imagePath, msgId, guildId, channelId } = option;
    if (!imagePath)
        return;
    var pushUrl = messageType == "DIRECT" ?
        `https://api.sgroup.qq.com/dms/${guildId}/messages` :
        `https://api.sgroup.qq.com/channels/${channelId}/messages`;
    const formdata = new form_data_1.default();
    if (!initiative)
        formdata.append("msg_id", msgId);
    if (content)
        formdata.append("content", content);
    formdata.append("file_image", fs_1.default.createReadStream(imagePath));
    return (0, node_fetch_1.default)(pushUrl, {
        method: "POST",
        headers: {
            "Content-Type": formdata.getHeaders()["content-type"],
            "Authorization": `Bot ${kazuha_1.config.initConfig.appID}.${kazuha_1.config.initConfig.token}`,
        }, body: formdata
    }).then(res => {
        return res.json();
    }).then(body => {
        if (body.code)
            logger_1.default.error(body);
        return body;
    }).catch(error => {
        logger_1.default.error(error);
    });
}
//# sourceMappingURL=IMessageEx.js.map