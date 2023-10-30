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
  storyStartedNotification,
  storyIdeaNotification,
} = proxyActivities<typeof activities>({
  startToCloseTimeout: "1 minute",
});

export const storyStart = useState<boolean>("storyStart", false);

export async function firstStoryReminderWorkflow(params: { userId: string }) {
  storyStart.attachHandlers();
  if (await condition(() => !storyStart.get(), "30 seconds")) {
    await startStoryNotification(params.userId);
  }

  if (await condition(() => !storyStart.get(), "30 seconds")) {
    await storyIdeaNotification(params.userId);
  }
}

export async function welcomeWorkflow(params: { userId: string }) {
  await sleep("5 seconds");
  await welcomeNotification(params.userId);

  storyStart.attachHandlers();
  if (await condition(() => storyStart.get(), "30 seconds")) {
    await storyStartedNotification(params.userId);
  } else {
    await firstStoryReminderWorkflow({ userId: params.userId });
  }
}
