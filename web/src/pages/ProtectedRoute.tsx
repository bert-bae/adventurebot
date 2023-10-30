import { Navigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import React from "react";
import { useAuthContext } from "contexts/AuthorizationProvider";

const ProtectedRoute = ({ children }: React.PropsWithChildren<{}>) => {
  const {
    state: { user },
  } = useAuthContext();
  const location = useLocation();
  if (!user.id) {
    return <Navigate to="/login" replace state={{ path: location.pathname }} />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
