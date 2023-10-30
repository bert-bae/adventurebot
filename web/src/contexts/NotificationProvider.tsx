import React, { useEffect } from "react";
import { useAuthContext } from "./AuthorizationProvider";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const NotificationContext = React.createContext(null);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { ws } = useAuthContext();

  useEffect(() => {
    if (!ws) {
      return;
    }

    ws.on("message", (data) => {
      const notification = JSON.parse(data);
      toast(notification.message, {
        closeOnClick: true,
        type: notification.type,
      });
    });
  }, [ws]);

  return (
    <NotificationContext.Provider value={null}>
      <ToastContainer />
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotificationContext = () =>
  React.useContext(NotificationContext);
