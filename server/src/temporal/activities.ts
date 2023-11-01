import { prisma } from "../db/pg";
import { StoryPromptService } from "../services/StoryPromptService";
import { getWsConnection } from "../websocket";

const storyPromptService = new StoryPromptService();

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

export async function newStoryNotification(userId: string): Promise<boolean> {
  const socket = getWsConnection(userId);
  if (!socket) {
    return false;
  }

  socket.send(
    JSON.stringify({
      type: "success",
      message: "Let's start this journey!",
    })
  );
  return true;
}

export async function storyPublishedNotification(
  userId: string,
  storyId: string
): Promise<boolean> {
  const socket = getWsConnection(userId);
  if (!socket) {
    throw new Error("User websocket is not connected.");
  }

  const story = await prisma.story.findUnique({ where: { id: storyId } });
  if (!story) {
    return false;
  }

  socket.send(
    JSON.stringify({
      type: "info",
      message: `Story called ${story.title} has been published!`,
      meta: {
        storyId,
      },
    })
  );
  return true;
}

export async function publishStory(storyId: string) {
  const converted = await storyPromptService.streamlineStory(storyId);
  await storyPromptService.update(storyId, {
    content: converted,
    published: true,
  });
}
