import { useValidate } from "api/__generated__/server";
import React, { useEffect, useState } from "react";
import useAuthCookie from "utils/hooks/useAuthCookie";

export type AuthContext = {
  state: {
    user: { id: string | null; name: string | null; email: string | null };
    token?: string;
  };
  addToken: (token: string, path?: string) => void;
  addRefreshToken: (token: string) => void;
  removeToken: () => void;
};

const defaultUser = {
  id: null,
  name: null,
  email: null,
};
const defaultValues: AuthContext = {
  state: {
    user: defaultUser,
    token: undefined,
  },
  addToken: (token: string) => {},
  addRefreshToken: (token: string) => {},
  removeToken: () => {},
};

export const AuthorizationContext =
  React.createContext<AuthContext>(defaultValues);

export const AuthorizationProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { token, addToken, addRefreshToken, removeToken } = useAuthCookie();
  const [user, setUser] = useState<AuthContext["state"]["user"]>(defaultUser);
  const { refetch } = useValidate({
    query: {
      enabled: false,
      queryKey: [token],
      onSuccess: ({ data }) => {
        setUser(data);
      },
      onError: () => {
        removeToken();
      },
    },
  });

  useEffect(() => {
    if (token) {
      refetch();
    } else {
      setUser(defaultUser);
    }
  }, [token, refetch]);

  return (
    <AuthorizationContext.Provider
      value={{
        state: {
          user,
          token,
        },
        addToken,
        addRefreshToken,
        removeToken,
      }}
    >
      {children}
    </AuthorizationContext.Provider>
  );
};

export const useAuthContext = () => React.useContext(AuthorizationContext);
