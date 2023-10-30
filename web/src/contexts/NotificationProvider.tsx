import React, { useEffect } from "react";
import { useAuthContext } from "./AuthorizationProvider";
import { useWebsocket } from "utils/hooks/useWebsocket";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const NotificationContext = React.createContext(null);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const {
    state: { user },
  } = useAuthContext();
  const websocket = useWebsocket(`ws://localhost:5001`, user?.id);

  useEffect(() => {
    if (!websocket) {
      return;
    }

    websocket.on("notify", (data) => {
      const notification = JSON.parse(data);
      toast(notification.message, {
        closeOnClick: true,
        type: notification.type,
      });
    });
  }, [websocket]);

  const handleClose = (id: string) => {};

  return (
    <NotificationContext.Provider value={null}>
      <ToastContainer />
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotificationContext = () =>
  React.useContext(NotificationContext);
