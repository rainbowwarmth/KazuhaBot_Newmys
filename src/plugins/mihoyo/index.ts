import { taskPushNews } from './apps/mysNew';
import logger from '../../lib/logger';

export const tasks = [
  { taskFunction: taskPushNews, cronExpression: '0/1 * * * * ?' },
]

logger.info('mihoyo 插件中的所有推送任务已注册');
