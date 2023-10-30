import { NativeConnection, Worker } from "@temporalio/worker";
import * as activities from "./activities";

export async function worker() {
  const connection = await NativeConnection.connect({
    address: "localhost:7233",
  });

  const worker = await Worker.create({
    connection,
    namespace: "default",
    taskQueue: "adventurebot",
    workflowsPath: require.resolve("./workflows"),
    activities,
  });

  await worker.run();
}
