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

interface Commit {
    commit: {
        author: {
            name: string;
            date: string;
        };
        message: string;
    };
    authorName: string;
    authorDate: string;
    commitMessage: string;
}

export async function commits(msg: IMessageEx) {
    try {
        const response = await fetch('https://gitee.com/api/v5/repos/rainbowwarmth/KazuhaBot_Newmys/commits');
        if (!response.ok) {
            throw new Error('Failed to fetch data');
        }
        const data = await response.json();

        // 提取项目中的信息
        const extractedData = data.slice(0, 15).map((commit: Commit) => {
            const messageWithoutLinks = commit.commit.message.replace(/\./g, ' ');
            return {
                authorName: commit.commit.author.name,
                authorDate: commit.commit.author.date,
                commitMessage: messageWithoutLinks,
            };
        });
        // 循环遍历提取的数据发送到控制台
        extractedData.forEach((commit: Commit) => {
            console.log('Author Name:', commit.authorName);
            console.log('Author Date:', commit.authorDate);
            console.log('Commit Message:', commit.commitMessage);
            console.log('\n');
        });

        let content = '更新日志\n';
        extractedData.forEach((commit: Commit) => {
            content += `\n作者：${commit.authorName}\n时间：${commit.authorDate}\n内容：${commit.commitMessage}\n`;
        });

        return msg.sendMsgEx({
            content: content
        });

    } catch (error) {
        console.error('Error fetching or parsing data:', error);
        return null;
    }
}
