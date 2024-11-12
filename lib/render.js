"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.render = render;
exports.renderURL = renderURL;
const fs_1 = __importDefault(require("fs"));
const puppeteer_1 = __importDefault(require("puppeteer"));
const art_template_1 = __importDefault(require("art-template"));
const common_1 = require("./common");
const global_1 = require("./global");
const kazuha_1 = __importDefault(require("../kazuha"));
const logger_1 = __importDefault(require("./logger"));
//html模板
const html = {};
//截图数达到时重启浏览器 避免生成速度越来越慢
var restartNum = 30;
//截图次数
var renderNum = 0;
//锁住
var lock = false;
//截图中
var shoting = [];
async function render(renderData) {
    //log.debug(renderData);
    if (renderData.render.template)
        renderData.render.resFile = `${global_1._path}/resources/${renderData.app}/${renderData.type}/${renderData.render.template}.html`;
    else
        renderData.render.resFile = `${global_1._path}/resources/${renderData.app}/${renderData.type}/index.html`;
    if (!renderData.render.saveFile)
        renderData.render.saveFile = `${global_1._path}/generate/html/${renderData.app}/${renderData.type}/${renderData.render.saveId}.html`;
    if (!renderData.data.resPath)
        renderData.data.resPath = `${global_1._path}/resources`;
    //renderData.data.resPath = `/resources`;//测试用
    return await doRender(renderData).catch(err => {
        logger_1.default.error(err);
    });
}
async function doRender(renderData) {
    var { app, type, imgType, render, data } = renderData;
    const savePic = `${render.saveFile}.${imgType}`;
    html[`${app}.${type}`] = fs_1.default.readFileSync(render.resFile, "utf8");
    var tmpHtml = art_template_1.default.render(html[`${app}.${type}`], data);
    (0, common_1.writeFileSyncEx)(render.saveFile, tmpHtml);
    if (!(await browserInit()))
        return null;
    if (!global.browser)
        return null;
    const page = await global.browser.newPage();
    await page.goto(`file://${renderData.render.saveFile}`, {
        waitUntil: "networkidle0",
    }).then(() => {
        return page.$("#container");
    }).then(body => {
        return body?.screenshot({
            type: imgType,
            encoding: "binary",
            quality: 100,
            path: savePic,
            omitBackground: true,
        });
    }).catch(err => {
        logger_1.default.error(err);
    });
    await page.close();
    if (fs_1.default.existsSync(savePic)) {
        global_1.botStatus.imageRenderNum++;
        return savePic;
    }
    else {
        return null;
    }
}
async function renderURL(renderData) {
    var { app, type, imgType, url, saveId } = renderData;
    const savePath = `${global_1._path}/generate/url/${app}/${type}/${saveId}.${imgType}`;
    if (!(await browserInit()))
        return false;
    if (!global.browser)
        return false;
    const page = await global.browser.newPage();
    await page.goto(url, {
        waitUntil: "networkidle0",
    });
    await page.evaluate(() => {
        document.querySelector("#__layout > div > div.header")?.remove();
    });
    //log.debug(`goto${url}`);
    await page.$("#__layout > div > div.root-page-container > div > div.mhy-layout__main > div.mhy-article-page__main.mhy-container").then(f => {
        //log.debug(f);
        if (f) {
            return f.screenshot({
                type: imgType,
                encoding: "binary",
                quality: 100,
                path: savePath,
                omitBackground: true,
            });
        }
    }).catch(err => {
        logger_1.default.error(err);
    });
    await page.close();
    return savePath;
}
async function browserInit() {
    if (global.browser) {
        if (kazuha_1.default.config.devEnv)
            logger_1.default.debug(`puppeteer已经启动`);
        return true;
    }
    if (lock) {
        return false;
    }
    lock = true;
    logger_1.default.mark("puppeteer启动中");
    //初始化puppeteer
    await puppeteer_1.default.launch({
        executablePath: kazuha_1.default.config.executablePath || undefined, //chromium其他路径
        headless: true,
        args: [
            "--disable-gpu",
            "--disable-dev-shm-usage",
            "--disable-setuid-sandbox",
            "--no-first-run",
            "--no-sandbox",
            "--no-zygote",
            "--single-process",
            "--windows-size=1920,1080"
        ]
    }).then(_browser => {
        global.browser = _browser;
        logger_1.default.info("puppeteer启动成功");
        global.browser.on("disconnected", function () {
            logger_1.default.error("Chromium实例关闭或崩溃！");
            global.browser = null;
        });
    }).catch((err) => {
        logger_1.default.error(err);
    });
    lock = false;
    return true;
}
;
;
//# sourceMappingURL=render.js.map