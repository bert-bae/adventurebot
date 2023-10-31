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

export async function continueStoryNotification(
  userId: string,
  storyId: string
): Promise<boolean> {
  const socket = getWsConnection(userId);
  if (!socket) {
    return false;
  }

  socket.send(
    JSON.stringify({
      type: "success",
      message:
        "Hmm... You haven't made a choice yet. The story can't continue without your input!",
      meta: {
        storyId,
      },
    })
  );
  return true;
}

export async function markStoryAsPublished(storyId: string): Promise<boolean> {
  await prisma.story.update({
    data: { published: true },
    where: { id: storyId },
  });
  return true;
}

export async function storyPublishedNotification(
  userId: string,
  storyId: string
): Promise<boolean> {
  const socket = getWsConnection(userId);
  if (!socket) {
    return false;
  }

  const story = await prisma.story.findUnique({ where: { id: storyId } });
  console.log(story);
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

export async function streamlineStoryContent(storyId: string) {
  const converted = await storyPromptService.streamlineStory(storyId);
  await storyPromptService.update(storyId, { content: converted });
}
