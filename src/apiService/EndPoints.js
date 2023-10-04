import { Post } from "../utils/RequestHandler"

export const getAllAgents = () => Post(`nmagents`, {})
export const getmntasks = (data) => Post(`nmtasks`, data)
