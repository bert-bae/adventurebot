import { proxyActivities, condition, sleep } from "@temporalio/workflow";
// Only import the activity types
import type * as activities from "./activities";
import { useState } from "./helpers";

const {
  welcomeNotification,
  newStoryNotification,
  markStoryAsPublished,
  storyPublishedNotification,
  streamlineStoryContent,
} = proxyActivities<typeof activities>({
  startToCloseTimeout: "1 minute",
});

export const storyStart = useState<boolean>("storyStart", false);
export const stopStory = useState<boolean>("stopStory", false);

export async function welcomeWorkflow(params: { userId: string }) {
  await sleep("5 seconds");
  await welcomeNotification(params.userId);
}

export async function storyProgressionWorkflow(params: {
  userId: string;
  storyId: string;
}) {
  await newStoryNotification(params.userId);

  stopStory.attachHandlers();
  await condition(() => stopStory.get());
  await streamlineStoryContent(params.storyId);
  await markStoryAsPublished(params.storyId);
  await storyPublishedNotification(params.userId, params.storyId);
}
