import { API_ENDPOINTS } from "../../Constants";
import axios from "axios";

const headers = {
  "Content-Type": "application/json;charset=UTF-8",
  "Access-Control-Allow-Origin": process.env.NEXT_PUBLIC_HEADER_ACCESS,
  "Access-Control-Allow-Credentials": "true",
  isAuthRequired: false,
  withCredentials: false,
};

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  LandingPageCount: (params) => {
    return axios.get(process.env.NEXT_PUBLIC_API_PROFILE + API_ENDPOINTS.B2B_PROFILE_PAGE_DATA, {
      headers: { ...headers },
      params: { ...params },
    });
  },
};
