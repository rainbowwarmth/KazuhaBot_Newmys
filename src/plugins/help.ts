import { IMessageEx } from "../lib/IMessageEx";

export async function helpimage(msg: IMessageEx) {
    fetch('https://gitee.com/rainbowwarmth/qqguid-bot-plugin/raw/master/help.json')
    .then(response => response.json())
    .then(data =>{
        return msg.sendMsgEx({
            content: `${data.New}`+
            `\n${data.desc}`+
            `\n${data.NewList}`+
            `\n${data.Listdesc}`+
            `\n${data.taskNew}`+
            `\n${data.taskdesc}`
        })
    })
}

export async function version(msg: IMessageEx){
    fetch('https://gitee.com/rainbowwarmth/qqguid-bot-plugin/raw/master/version.json')
    .then(response => response.json())
    .then(data =>{
        return msg.sendMsgEx({
            content: `更新日志`+
            `\n当前版本：${data.version}`+
            `\n·${data.content}`+
            `\n下个版本：${data.upload_version}`+
            `\n·${data.upload_content}`+
            `\n上个版本：${data.last_version}`+
            `\n·${data.last_content}`
        })
    })

}