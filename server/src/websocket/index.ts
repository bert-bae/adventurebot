import { nanoid } from "nanoid";
import { Server, Socket } from "socket.io";

const socketIds: Record<string, Socket> = {};

export const websocket = () => {
  const io = new Server(+process.env.WEBSOCKET_PORT!, {
    cors: {
      origin: process.env.ALLOWED_CORS,
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    socket.on("setSocketId", (id: string) => {
      socketIds[id] = socket;
      socket.emit(
        "notify",
        JSON.stringify({ type: "info", message: "hello world" })
      );
    });
  });
};
