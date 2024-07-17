import axios from "axios";
import _ from "lodash";
import secureLocalStorage from "react-secure-storage";

function bindPath(url, pathVal) {
  let newUrl = url;
  if (typeof pathVal === "object") {
    Object.keys(pathVal).forEach((key) => {
      newUrl = newUrl.replace(`:${key}`, pathVal[key]);
    });
  } else if (typeof pathVal === "string") {
    newUrl = newUrl.replace(/:[a-z0-9]+/gi, pathVal);
  }
  return newUrl;
}

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  setupInterceptors: (store) => {
    axios.interceptors.request.use(
      function (config) {
        console.log('config', config)
        if (config.headers.isAuthRequired) {
          const token = store?.token || secureLocalStorage.getItem("token");
          if (token) config.headers.Authorization = `Bearer ${token}`;
        }

        config.headers.device = "Microsite";
        delete config.headers.isAuthRequired;
        delete config.headers.authKey;

        if (config.headers.path) {
          try {
            config.url = bindPath(config.url, config.headers.path);
          } catch (e) {
            console.log("ERROR OCCURED WHEN REPLACING PATH VARIABLES", e);
          }
        }

        config.baseURL = config.headers.isChat
          ? process.env.NEXT_PUBLIC_HEADER_ACCESS
          : config.headers.isAes
          ? process.env.NEXT_PUBLIC_V1_API
          : process.env.NEXT_PUBLIC_API_PROFILE;

        delete config.headers?.isAes;
        delete config.headers?.isChat;

        return config;
      },
      function (error) {
        return Promise.reject(error);
      }
    );

    axios.interceptors.response.use(
      function (response) {
        return response;
      },
      function (error) {
        if (error?.response?.status === 401) {
          window.location.href = "/";
          secureLocalStorage.clear();
          console.log(error);
        } else {
          return Promise.reject(error);
        }
      }
    );
  },
};
