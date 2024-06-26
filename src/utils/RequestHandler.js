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
        if(process.env.NODE_ENV === "development"){
          return response?.data ?? response;
        }
        return response

    } catch (err) {
        throw new Error(err.message);
    }
}

export const Put = async (path, data) => {
    try {
        const response = await axios.put(`${url}${path}`, data, { headers: customHeaders })
        if(process.env.NODE_ENV === "development"){
          return response?.data ?? response;
        }
        return response

    } catch (err) {
        throw new Error(err.message);
    }

}

export const Delete = async (path) => {
  try {
      const response = await axios.delete(`${url}${path}`)
      if(process.env.NODE_ENV === "development"){
        return response?.data ?? response;
      }
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
    [event.target?.name]:  (event.target.type === "radio" || event.target.type === "checkbox") ? (event.target?.value === "" ? '' : event.target?.value == "true") : event.target?.value
  }
}