# KazuhaBot_NewMys

<p align="center">
  <a href="https://github.com/rainbowwarmth/KazuhaBot_Newmys"><img src="https://upload-bbs.miyoushe.com/upload/2021/12/05/82642572/3196a8010ff14dd131d5192ba9b9743a_5729765311568100837.jpg?x-oss-process=image/resize,s_600/quality,q_80/auto-orient,0/interlace,1/format,jpg" width="256" height="256" alt="KazuhaBot_NewMys"></a>
</p>
<h1 align = "center">KazuhaBot_NewMys</h1>

## 使用方法
> 环境准备： Windows or Linux，Node.js（ [版本至少v16以上](http://nodejs.cn/download/) ）， [Redis](https://redis.io/docs/getting-started/installation/ )

### 1.克隆项目
选择适合的目录，使用下面的方法进行安装(二选一)
* git clone --depth=1 https://github.com/rainbowwarmth/KazuhaBot_Newmys.git

或使用ssh（注意：使用该指令必须将SSH keys添加到GitHub中）

* git clone --depth=1 git@github.com:rainbowwarmth/KazuhaBot_Newmys.git

### 2.安装依赖
直接安装
* npm i

如依赖安装缓慢或失败，可尝试更换国内npm源后再执行install命令

* npm config set registry https://registry.npmmirror.com
* npm i

### 3.修改设置文件

* 重命名config文件夹中的config.example.json为config.json，并更改其中的APP_ID和APP_TOKEN为机器人对应ID与TOKEN

### 4.启动项目
* 确保redis数据库启动成功
* 在主目录下使用指令npm start开始启动
## 命令列表

1.公告资讯
* (公告|资讯)+游戏别名+[1-9]
* (公告|资讯)+游戏别名+列表
* (开启|关闭)+公告+游戏别名+推送

2.帮助和更新日志
* help
* 更新日志

### 以上命令需要加入#字符

## 致谢

|                           名称                                                         |        介绍           |
|:-------------------------------------------------------------:|:------------------:|
|[KazuhaBot](https://github.com/feilongproject/KazuhaBot)| 飞龙大佬的KazuhaBot |
