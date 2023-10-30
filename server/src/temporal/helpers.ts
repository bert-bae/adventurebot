import { setHandler, defineSignal, defineQuery } from "@temporalio/workflow";

export const useState = <T = any>(name: string, initialValue: T) => {
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
