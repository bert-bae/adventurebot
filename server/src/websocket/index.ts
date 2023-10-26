import { Server } from "socket.io";

export const websocket = () => {
  const io = new Server(+process.env.WEBSOCKET_PORT!, {
    cors: {
      origin: process.env.ALLOWED_CORS,
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    socket.on("message", (args) => {
      socket.send(args);
    });
  });
};
