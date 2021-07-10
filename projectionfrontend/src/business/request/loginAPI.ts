import { API_BASE_URL, ACCESS_TOKEN } from "../constants";
import request from "./securityConfig";

export const getCurrentUser = () => {
    if (!localStorage.getItem(ACCESS_TOKEN)){
        return Promise.reject("No access token set.");
    }

    return request({
        url: API_BASE_URL + "/profile",
        method: "GET"
    })
}
