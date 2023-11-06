import axios from "axios";
import { url } from "./Host";
const customHeaders = {
    "ngrok-skip-browser-warning": "true",
}
export const Get = async (path) => {
    try {
        const response = await axios.get(`${url}${path}`, { headers: customHeaders })
        return response

    } catch (err) {
        throw new Error(err.message);
    }

}
export const Post = async (path, data) => {
    try {
        const response = await axios.post(`${url}${path}`, data, { headers: customHeaders })
        return response

    } catch (err) {
        throw new Error(err.message);
    }

}


export const formReducer = (state, event) => {
  if (!event.target) {
    return {
      ...state,
      ...event
    }
  }
  return {
    ...state,
    [event.target?.name]: event.target?.value
  }
}