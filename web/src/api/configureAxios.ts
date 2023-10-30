import Axios from "axios";
import { Cookies } from "react-cookie";
import { AUTH_COOKIE } from "utils/hooks/useAuthCookie";
// @ts-ignore
Axios.interceptors.request.use((config) => {
  const cookies = new Cookies();
  const token = cookies.get(AUTH_COOKIE);
  return {
    ...config,
    headers: {
      ...config.headers,
      Authorization: token ? `Bearer ${token}` : undefined,
    },
    baseURL: process.env.REACT_APP_SERVER_URL,
  };
});
