import { Instance } from "mobx-state-tree";
import Vote from "src/models/Vote";
import * as timestamp from "./utils";
import {
  ITimestampTags,
  IToTransaction,
  IFromTransaction,
  IRequiredTags
} from "./types";
import { appId, environment, version } from "src/env";

type Model = Instance<typeof Vote>;

type IToTransactionInputs = Pick<
  Model,
  "id" | "type" | "item" | "createdAt" | "updatedAt"
>;

type IToTransactionOutput = Pick<Model, "id"> & {
  type: "vote";
  item: string;
} & ITimestampTags &
  IRequiredTags;

export const toTransaction: IToTransaction<
  IToTransactionInputs,
  IToTransactionOutput
> = o => {
  return {
    tags: {
      id: o.id,
      ...timestamp.fromMsToCreatedAtTags(o.createdAt),
      ...timestamp.fromMsToUpdatedAtTags(o.updatedAt),
      "Content-Type": "text/plain",
      appId,
      environment,
      version,
      type: "vote",
      item: o.item
    },
    content: o.type
  };
};

type IFromTransactionInput = IToTransactionOutput & {
  from: string;
};

type IFromTransactionOutput = IToTransactionInputs & {
  from: string;
};

export const fromTransaction: IFromTransaction<
  IFromTransactionInput,
  IFromTransactionOutput
> = o => {
  return {
    id: o.tags.id,
    type: o.content,
    from: o.tags.from,
    item: o.tags.item,
    createdAt: timestamp.toMsFromCreatedAtTags(o.tags),
    updatedAt: timestamp.toMsFromUpdatedAtTags(o.tags)
  };
};
