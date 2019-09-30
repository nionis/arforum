import { types, flow as _flow } from "mobx-state-tree";
import { FlowReturnType } from "mobx-state-tree/dist/core/flow";

export const id = types.identifier;

// latest typescript (3.6) changed generator typings
// and mobx didn't fix it yet on their end
// this is a custom flow function that fixes it
export type Flow = <T extends Promise<any>, R, Args extends any[]>(
  generator: (
    ...args: Args
  ) => Generator<T, R, T extends Promise<infer Y> ? Y : never>
) => (...args: Args) => Promise<FlowReturnType<R>>;

export const flow = _flow as Flow;
