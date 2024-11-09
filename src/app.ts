import { initialize } from "./index";
import kazuha from "./kazuha";

initialize().then(() => {
    kazuha._log.mark(kazuha.chalk.cyan(kazuha.Bot.name + ' v' + kazuha.Bot.version + '启动成功'))
})