import { Get, Post } from "../Util/RequestHandler";

export const getAllAgents = () => Post(`nmagents`, {})
export const getmntasks = () => Post(`nmtasks`, {})
