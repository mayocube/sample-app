import { Get, Post } from '../utils/RequestHandler';

export const getmntasks = (data) => Post('nmtasks', data);
export const getBrandDetails = (data) => Post('emailDetail', data);
export const setEmailPriority = (data) => Post('emailDetail', data);
export const deleteEmailTasks = (data) => Post('emailDetail', data);
export const getAgents = (data) => Post('emailDetail', data);
export const getEmailDetails = (data) => Post('emailDetail', data);
export const getEmailTasks = (data) => Post('emailDetail', data);
export const assignEmailTaskToAgent = (data) => Post('emailDetail', data);