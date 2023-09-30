import { Get, Post } from "../Util/RequestHandler";

export const getAllAgents = () => Post(`nmagents`, {})
export const getmntasks = (data) => Post(`nmtasks`, data)
