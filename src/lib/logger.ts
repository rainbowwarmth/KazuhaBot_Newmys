import log4js from "log4js";
import c from "../cfg";

const log = log4js.configure({
    appenders: {
        console: {
            type: "console",
            layout: {
                type: "pattern",
                pattern: "%[[KazuhaBot][%d][%p]%] %m"
                }
            },
        },
    categories: {
        default: {
            appenders: ["console"],
            level: c.config.loglevel,
            enableCallStack: true,
        },
    },
}).getLogger()


export function setDevLog() {
    log.setParseCallStackFunction((error: Error) => {
        const stacklines = error.stack?.split("\n")!.splice(4)!;
        const lineMatch = /at (?:(.+)\s+\()?(?:(.+?):(\d+)(?::(\d+))?|([^)]+))\)?/.exec(stacklines[0]);
        /* istanbul ignore else: failsafe */
        if (lineMatch && lineMatch.length === 6)
            return { fileName: ` [${lineMatch[2].replace(`${_path}/`, "")}:${lineMatch[3]}:${lineMatch[4]}]` };
    });
}
log.setParseCallStackFunction((error: Error) => { });
export default log