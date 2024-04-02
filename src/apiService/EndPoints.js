import { Get, Post } from '../utils/RequestHandler';

export const getmntasks = (data) => Post('nmtasks', data);
export const getBrandDetails = (data) => Post('emailDetail', data);
export const setEmailPriority = (data) => Post('emailDetail', data);
export const deleteEmailTasks = (data) => Post('emailDetail', data);
export const getAgents = (data) => Post('get-agents', data);
export const getEmailDetails = (data) => Post('get-email-message', data);
export const getEmailTasks = (data) => Post('get-email-tasks', data);
export const assignEmailTaskToAgent = (data) => Post('emailDetail', data);
export const getHoops = (data) => Post('hoops', data);