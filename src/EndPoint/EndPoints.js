import { Get, Post } from "../Util/RequestHandler";

export const getAllAgents = () => Post(`nmagents`, {})
