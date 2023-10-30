import { getWsConnection } from "../websocket";

export async function welcomeNotification(userId: string): Promise<boolean> {
  const socket = getWsConnection(userId);
  if (!socket) {
    return false;
  }

  socket.send(
    JSON.stringify({ type: "info", message: "Welcome to AdventureBot!" })
  );
  return true;
}
