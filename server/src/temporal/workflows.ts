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

const { welcomeNotification } = proxyActivities<typeof activities>({
  startToCloseTimeout: "1 minute",
});

const useState = <T = any>(name: string, initialValue: T) => {
  const signal = defineSignal<[T]>(name);
  const query = defineQuery<T>(name);
  let state: T = initialValue;
  return {
    signal,
    query,
    get: () => state,
    set: (newVal: T) => {
      state = newVal;
    },
    attachHandlers: () => {
      setHandler(signal, (newVal: T) => void (state = newVal));
      setHandler(query, () => state);
    },
  };
};

export const cancel = useState<boolean>("cancelSignal", false);
export const charge = useState<number>("charge", 0);

export async function welcomeWorkflow(params: { userId: string }) {
  await sleep("5 seconds");
  let welcomeSent = false;
  while (!welcomeSent) {
    const sent = await welcomeNotification(params.userId);
    welcomeSent = sent;
  }
  // if (await condition(() => cancel.get(), trialPeriod)) {
  //   await sendCancellationDuringTrialEmail(email);
  // } else {
  //   await billingWorkflow(customer);
  // }
}
