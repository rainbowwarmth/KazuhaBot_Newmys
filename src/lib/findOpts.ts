import { isAdmin } from "../plugins/other/admin";
import { IMessageEx } from "./IMessageEx";

// 定义插件命令的类型，不包含 directory 字段
interface CommandOption {
    reg?: string;
    fnc?: string;
    type?: string[];
    permission?: string;
    describe?: string;
}

// 定义插件组的类型，包含必需的 directory 字段
interface CommandGroup {
    directory: string; // 每个插件组必须有一个 directory 字段
    [key: string]: CommandOption | string; // 其他字段为命令项或 directory
}

export async function findOpts(msg: IMessageEx): Promise<{ directory: string; file: string; fnc: string; } | null> {
    if (!msg.content) return null; // 如果内容为空，返回 null

    // 加载配置文件
    const fnc = await import("../../config/opts.json");
    const command: { [mainKey: string]: CommandGroup } = fnc.command;

    // 遍历插件命令配置
    for (const mainKey in command) {
        const group = command[mainKey];
        const groupDir = group.directory; // 使用插件组的 directory 字段

        for (const key in group) {
            if (key === "directory") continue; // 跳过 directory 字段
            const opt = group[key] as CommandOption;

            // 检查消息类型是否匹配
            if (!opt.type?.includes(msg.messageType)) continue;

            // 检查正则表达式是否匹配消息内容
            const regex = opt.reg ? new RegExp(opt.reg) : null;
            if (!regex || !regex.test(msg.content)) continue;

            // 权限检查
            if (opt.permission !== "anyone") {
                const isUserAdmin = await isAdmin(
                    msg.author.id,
                    msg.messageType === "GUILD" ? msg.member : undefined,
                    msg.messageType === "DIRECT" ? msg.src_guild_id : undefined
                );
                if (!isUserAdmin) continue;
            }

            // 返回匹配的指令配置
            return {
                directory: groupDir,
                file: mainKey,
                fnc: opt.fnc!,
            };
        }
    }

    // 如果没有匹配项，返回 null
    return null;
}
