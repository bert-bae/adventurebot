import { info } from "loglevel";
import { Server, Socket } from "socket.io";

const WEBSOCKET_CONNECTIONS: Record<string, Socket> = {};

const ws = new Server(+process.env.WEBSOCKET_PORT!, {
  cors: {
    origin: process.env.ALLOWED_CORS,
    methods: ["GET", "POST"],
  },
});

export const getWsConnection = (userId: string): Socket | undefined => {
  return WEBSOCKET_CONNECTIONS[userId];
};

export const websocket = () => {
  ws.on("connection", (socket) => {
    socket.on("setSocketId", (id: string) => {
      info("Saving socket connection: ", id);
      WEBSOCKET_CONNECTIONS[id] = socket;
    });

    socket.on("unsetSocketId", (id: string) => {
      info("Removing socket connection: ", id);
      delete WEBSOCKET_CONNECTIONS[id];
    });
  });
};
