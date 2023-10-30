import { Connection, Client } from "@temporalio/client";
import { welcomeWorkflow } from "./workflows";
import { info } from "loglevel";

const createClient = async () => {
  const connection = await Connection.connect({ address: "localhost:7233" });

  return new Client({
    connection,
    namespace: "default",
  });
};

export async function startWelcomeWf(userId: string) {
  const client = await createClient();
  const handle = await client.workflow.start(welcomeWorkflow, {
    taskQueue: "adventurebot",
    args: [{ userId }],
    // in practice, use a meaningful business ID, like customerId or transactionId
    workflowId: "welcome-" + startWelcomeWf,
  });
  info(`Started workflow ${handle.workflowId}`);
}
