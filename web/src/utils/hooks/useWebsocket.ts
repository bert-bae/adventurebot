import { useEffect, useState } from "react";
import { io } from "socket.io-client";

export const useWebsocket = (url: string, userId: string | null) => {
  const [websocket, setWebsocket] = useState<ReturnType<typeof io> | null>(
    null
  );

  useEffect(() => {
    const socket = io(url);
    setWebsocket(socket);
    return () => {
      socket.close();
    };
  }, []);

  useEffect(() => {
    if (websocket && userId) {
      websocket.emit("setSocketId", userId);
    }
  }, [websocket, userId]);

  return websocket;
};
