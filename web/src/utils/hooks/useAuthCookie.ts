import { useCookies } from "react-cookie";

export const AUTH_COOKIE = "adventure_bot_tk";
const REFRESH_AUTH_COOKIE = "adventure_bot_refresh_tk";

const useAuthCookie = () => {
  const [cookies, setCookie, removeCookie] = useCookies([
    AUTH_COOKIE,
    REFRESH_AUTH_COOKIE,
  ]);
  return {
    token: cookies[AUTH_COOKIE],
    addToken: (token: string, path?: string) => {
      setCookie(AUTH_COOKIE, token, { path, secure: true });
    },
    addRefreshToken: (token: string, path?: string) => {
      setCookie(REFRESH_AUTH_COOKIE, token, {
        path,
        secure: true,
        httpOnly: true,
      });
    },
    removeToken: () => {
      removeCookie(AUTH_COOKIE);
      removeCookie(REFRESH_AUTH_COOKIE);
    },
  };
};

export default useAuthCookie;
