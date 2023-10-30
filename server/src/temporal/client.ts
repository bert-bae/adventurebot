import { Connection, Client } from "@temporalio/client";
import { SignalDefinition } from "@temporalio/client";
import { welcomeWorkflow } from "./workflows";
import { info } from "loglevel";
import { nanoid } from "nanoid";

const createClient = async () => {
  const connection = await Connection.connect({ address: "localhost:7233" });

  return new Client({
    connection,
    namespace: "default",
  });
};

export const workflowIds = {
  welcome: (userId: string) => "welcome-" + userId,
};

export async function startWelcomeWf(userId: string) {
  const client = await createClient();
  const handle = await client.workflow.start(welcomeWorkflow, {
    taskQueue: "adventurebot",
    args: [{ userId }],
    // in practice, use a meaningful business ID, like customerId or transactionId
    workflowId: workflowIds.welcome(userId),
  });
  info(`Started workflow ${handle.workflowId}`);
}

export async function sendSignal<T extends any[] = []>(
  workflowId: string,
  signal: SignalDefinition<T>,
  ...args: T
) {
  const client = await createClient();
  const handle = client.workflow.getHandle(workflowId);
  // @ts-ignore
  await handle.signal(signal, ...args);
}
