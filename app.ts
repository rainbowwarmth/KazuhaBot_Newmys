import { initialize } from "./src/index";
import kazuha from "./src/kazuha";

initialize().then(() => {
    kazuha._log.mark(kazuha.chalk.cyan(kazuha.Bot.name + ' v' + kazuha.Bot.version + '启动成功'))
})