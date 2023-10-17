import { Get, Post } from "../utils/RequestHandler"

export const getAllAgents = () => Post(`nmagents`, {})
export const getmntasks = (data) => Post(`nmtasks`, data)

export const getBrandDetails = (data) => Post(`emailDetail`, data)
