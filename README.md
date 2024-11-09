# KazuhaBot_NewMys

<p align="center">
  <a href="https://github.com/rainbowwarmth/KazuhaBot_Newmys"><img src="https://upload-bbs.miyoushe.com/upload/2021/12/05/82642572/3196a8010ff14dd131d5192ba9b9743a_5729765311568100837.jpg?x-oss-process=image/resize,s_600/quality,q_80/auto-orient,0/interlace,1/format,jpg" width="256" height="256" alt="KazuhaBot_NewMys"></a>
</p>
<h1 align = "center">KazuhaBot_NewMys</h1>
[![npm puppeteer package](https://img.shields.io/npm/v/kazuha-bot.svg)](https://npmjs.org/package/kazuha-bot)

## 使用方法
> 环境准备： Windows or Linux，Node.js（ [版本至少v16以上](http://nodejs.cn/download/) ）， [Redis](https://redis.io/docs/getting-started/installation/ )

> 与[KazuhaBot](https://github.com/feilongproject/KazuhaBot)对比
 * 本项目仅保留了公告推送内容，更加简洁高效。

> 注意V2.1.5开始使用js运行，抛弃之前的ts方法，请务必进行编译后运行项目

---

## 安装[pnpm](https://pnpm.io/zh/installation)

> 已安装的可以跳过

```sh
npm install pnpm -g
```

## 安装项目
### 使用PNPM安装（优先推荐）

请先创建一个空目录，然后在 你创建的空目录 根目录夹打开终端，运行下述指令之一

```
// 使用PNPM
pnpm install kazuha-bot

// 使用PNPM镜像(网络不好首选)
pnpm i kazuha-bot --registry=https://registry.npmmirror.com
```

### 使用Git安装（第二推荐）
> 请根据网络情况选择Github安装或Gitee安装

```
// 使用gitee
git clone --depth=1 https://gitee.com/rainbowwarmth/KazuhaBot
pnpm install -P

// 使用github
git clone --depth=1 https://github.com/rainbowwarmth/KazuhaBot
pnpm install -P
```

### 手工下载安装（不推荐）

手工下载安装包，解压后重命名为 KazuhaBot

不能使用git pull 故不推荐

---


## 安装依赖
> 注意只有使用Git安装和手工下载安装才要进行此步，使用PNPM安装的请直接下一步
> 外网环境请修改的本地npm配置.npmrc

```sh
# 直接安装
pnpm install -P
```

## 修改设置文件

打开config文件夹中的config.json，并更改其中的APP_ID和APP_TOKEN为机器人对应ID与TOKEN

## 编译
终端进入 KazuhaBot 根目录，运行`npm run build`

## 运行
> 启动redis后
在终端输入`npm start`运行


## 致谢

|                           名称                                                         |        介绍           |
|:-------------------------------------------------------------:|:------------------:|
|[KazuhaBot](https://github.com/feilongproject/KazuhaBot)| 飞龙大佬的KazuhaBot |

## 其他
* 项目仅供学习交流使用，严禁用于任何商业用途和非法行为
* [MIT 许可证](https://github.com/rainbowwarmth/KazuhaBot_Newmys/blob/main/LICENSE)
