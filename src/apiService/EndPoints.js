import { Delete, Post, Put } from '../utils/RequestHandler';

export const getmntasks = (data) => Post('nmtasks', data);
export const getBrandDetails = (data) => Post('emailDetail', data);
export const setEmailPriority = (data) => Post('emailDetail', data);
export const deleteEmailTasks = (data) => Post('emailDetail', data);
export const getAgents = (data) => Post('get-agents', data);
export const getEmailDetails = (data) => Post('get-email-message', data);
export const getEmailTasks = (data) => Post('get-email-tasks', data);
export const assignEmailTaskToAgent = (data) => Post('emailDetail', data);
export const getHoops = (data) => Post('hoops', data);

export const getHoopsById = (id) => Post(`hoops/${id}`);
export const deleteHoop = (id) => Delete(`hoops/${id}`);

export const createUpdateHoops = async (data, hoopsId) => {
  try {
    if (hoopsId) {
      return await Post('hoops/update', data);
    } else {
      return await Post('hoops/save', data);
    }
  }
  catch (error) {
    throw error;
  }
}
export const getDisposition = (data) => Post('get-cdt-records', data);
export const getDispositionById = (id) => Post(`disposition/${encodeURIComponent(id)}`);
export const deleteDisposition = (id) => Delete(`disposition/${encodeURIComponent(id)}`);
export const createUpdateDisposition = async (data, dispositionId) => {
  try {
    if (dispositionId) {
      data.pk = dispositionId;
      return await Put('disposition/update', data);
    } else {
      return await Post('disposition/save', data);
    }
  }
  catch (error) {
    throw error;
  }
}