import React, { Provider, useEffect, useState } from "react";
import useAuthCookie from "utils/hooks/useAuthCookie";

export type AuthContext = {
  state: {
    user: { id?: string; name?: string; email?: string };
    token?: string;
  };
  addToken: (token: string) => void;
  removeToken: () => void;
};

const defaultUser = {
  id: undefined,
  name: undefined,
  email: undefined,
};
const defaultValues: AuthContext = {
  state: {
    user: defaultUser,
    token: undefined,
  },
  addToken: (token: string) => {},
  removeToken: () => {},
};

export const AuthorizationContext =
  React.createContext<AuthContext>(defaultValues);

export const AuthorizationProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { token, addToken, removeToken } = useAuthCookie();
  const [user, setUser] = useState<AuthContext["state"]["user"]>(defaultUser);

  useEffect(() => {
    if (token) {
    } else {
      setUser(defaultUser);
    }
  }, [token]);

  return (
    <AuthorizationContext.Provider
      value={{
        state: {
          user,
          token,
        },
        addToken,
        removeToken,
      }}
    >
      {children}
    </AuthorizationContext.Provider>
  );
};
