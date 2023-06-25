import fs from "fs";
import fetch from 'node-fetch';
import { PostChannelObj, ChannelType, ChannelSubType  } from "qq-guild-bot";
import config from '../../config/config.json';
import internal from "stream";

export class PostChannelObjEx implements PostChannelObj {
    id: string;
    guild_id: string;
    name: string;
    type: ChannelType;
    sub_type?: ChannelSubType;
    position: number;
    parent_id: string;
    private_type?: number

    constructor(msg: PostChannelObj){
        this.id = msg.id;
        this.guild_id = msg.guild_id;
    }
}