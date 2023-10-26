import { useEffect, useState } from "react";
import { io } from "socket.io-client";

export const useWebsocket = (url: string) => {
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

  return websocket;
};
