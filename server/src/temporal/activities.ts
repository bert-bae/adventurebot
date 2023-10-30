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

export async function startStoryNotification(userId: string): Promise<boolean> {
  const socket = getWsConnection(userId);
  if (!socket) {
    return false;
  }

  socket.send(
    JSON.stringify({
      type: "warn",
      message: "Looks like you haven't started a story yet. Try creating one!",
    })
  );
  return true;
}

export async function storyIdeaNotification(userId: string): Promise<boolean> {
  const socket = getWsConnection(userId);
  if (!socket) {
    return false;
  }

  socket.send(
    JSON.stringify({
      type: "info",
      message:
        "Stories don't have to be complicated. Start with something and see where it goes!",
    })
  );
  return true;
}

export async function storyStartedNotification(
  userId: string
): Promise<boolean> {
  const socket = getWsConnection(userId);
  if (!socket) {
    return false;
  }

  socket.send(
    JSON.stringify({
      type: "success",
      message: "Great job starting your first story with AdventureBot!",
    })
  );
  return true;
}
