import Axios from "axios";

// @ts-ignore
Axios.interceptors.request.use((config) => {
  return {
    ...config,
    baseURL: process.env.REACT_APP_SERVER_URL,
  };
});
