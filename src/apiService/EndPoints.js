import ApiService from "./ApiService"
import { Get, Post } from "../utils/RequestHandler"

const apiService = new ApiService();
const jsonToQueryParams = (json) => Object.keys(json)
    .map(key => encodeURIComponent(key) + '=' + encodeURIComponent(json[key]))
    .join('&');

export const getAgents = () => apiService.fetchJsonWithReject(`get-agents`, { method: 'GET' }, 3)

export const getEmailTasks = (data) => {
    return apiService.fetchJsonWithReject(`get-email-tasks?${jsonToQueryParams(data)}`, { method: 'GET' }, 3)
}

export const getEmailDetails = (data) => {
    return apiService.fetchJsonWithReject(`get-email-message?${jsonToQueryParams(data)}`, { method: 'GET' }, 3)
}

export const deleteEmailTasks = (data) => {
    return apiService.post(`delete-email-tasks`, data);
}

export const setEmailPriority = (data) => {
    return apiService.post(`set-email-priority`, data);
}

export const assignEmailTaskToAgent = (data) => {
    return apiService.post(`assign-email-tasks`, data);
}

export const getAllAgents = () => Post(`nmagents`, {})
export const getmntasks = (data) => Post(`nmtasks`, data)
export const getBrandDetails = (data) => Post(`emailDetail`, data)

