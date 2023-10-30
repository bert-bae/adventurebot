import { Navigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import React from "react";
import useAuthCookie from "utils/hooks/useAuthCookie";

const ProtectedRoute = ({ children }: React.PropsWithChildren<{}>) => {
  const { token } = useAuthCookie();
  const location = useLocation();
  if (!token) {
    return <Navigate to="/login" replace state={{ path: location.pathname }} />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
