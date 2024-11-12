import { bbtaskPushNews } from './apps/NewBB';
import { bbbtaskPushNews } from './apps/NewBBB';
import { taskPushNews } from './apps/NewYuanShen';
import { srtaskPushNews } from './apps/NewStarRail';
import { zzztaskPushNews } from './apps/NewZZZ';
import { wdtaskPushNews } from './apps/NewWeiDing';
import { dbytaskPushNews } from './apps/NewDBY';
import log from '../../lib/logger';

// 定义任务列表，每个任务包含函数和 cron 表达式
export const tasks = [
  { taskFunction: bbtaskPushNews, cronExpression: '0/1 * * * * ?' },
  { taskFunction: bbbtaskPushNews, cronExpression: '0/2 * * * * ?' },
  { taskFunction: taskPushNews, cronExpression: '0/3 * * * * ?' },
  { taskFunction: srtaskPushNews, cronExpression: '0/4 * * * * ?' },
  { taskFunction: zzztaskPushNews, cronExpression: '0/5 * * * * ?' },
  { taskFunction: wdtaskPushNews, cronExpression: '0/6 * * * * ?' },
  { taskFunction: dbytaskPushNews, cronExpression: '0/7 * * * * ?' },
];

log.info('mihoyo 插件中的所有推送任务已定义');
