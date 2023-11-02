import { WorkflowClient } from "@temporalio/client";
import { SignalDefinition } from "@temporalio/client";
import { storyProgressionWorkflow, welcomeWorkflow } from "./workflows";
import { info } from "loglevel";

export const workflowIds = {
  welcome: (userId: string) => "welcome-" + userId,
  story: (storyId: string) => "storyProgression-" + storyId,
};

export async function startWelcomeWf(userId: string) {
  const client = new WorkflowClient();
  const handle = await client.start(welcomeWorkflow, {
    taskQueue: "adventurebot",
    args: [{ userId }],
    // in practice, use a meaningful business ID, like customerId or transactionId
    workflowId: workflowIds.welcome(userId),
  });
  info(`Started workflow ${handle.workflowId}`);
}

export async function storyProgressionWf(userId: string, storyId: string) {
  const client = new WorkflowClient();
  const handle = await client.start(storyProgressionWorkflow, {
    taskQueue: "adventurebot",
    args: [{ userId, storyId }],
    // in practice, use a meaningful business ID, like customerId or transactionId
    workflowId: workflowIds.story(storyId),
  });
  info(`Started workflow ${handle.workflowId}`);
}

export async function sendSignal<T extends any[] = []>(
  workflowId: string,
  signal: SignalDefinition<T>,
  ...args: T
) {
  const client = new WorkflowClient();
  const handle = client.getHandle(workflowId);
  // @ts-ignore
  await handle.signal(signal, ...args);
}
