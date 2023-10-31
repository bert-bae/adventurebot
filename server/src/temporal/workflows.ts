import { Duration } from "@temporalio/common";
import {
  sleep,
  proxyActivities,
  setHandler,
  defineSignal,
  condition,
  defineQuery,
} from "@temporalio/workflow";
// Only import the activity types
import type * as activities from "./activities";
import { useState } from "./helpers";

const {
  welcomeNotification,
  startStoryNotification,
  // storyStartedNotification,
  // storyIdeaNotification,
  newStoryNotification,
  // continueStoryNotification,
  markStoryAsPublished,
  storyPublishedNotification,
} = proxyActivities<typeof activities>({
  startToCloseTimeout: "1 minute",
});

export const storyStart = useState<boolean>("storyStart", false);
export const stopStory = useState<boolean>("stopStory", false);

export async function firstStoryReminderWorkflow(params: { userId: string }) {
  await startStoryNotification(params.userId);
}

export async function welcomeWorkflow(params: { userId: string }) {
  await welcomeNotification(params.userId);
  await firstStoryReminderWorkflow({ userId: params.userId });
}

export async function storyProgressionWorkflow(params: {
  userId: string;
  storyId: string;
}) {
  await newStoryNotification(params.userId);

  stopStory.attachHandlers();
  await condition(() => stopStory.get());
  await markStoryAsPublished(params.storyId);
  await storyPublishedNotification(params.userId, params.storyId);
}
