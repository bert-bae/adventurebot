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
      WEBSOCKET_CONNECTIONS[id] = socket;
    });
  });
};
