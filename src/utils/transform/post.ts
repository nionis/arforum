import { Instance } from "mobx-state-tree";
import Post from "src/models/Post";
import * as timestamp from "./utils";
import {
  ITimestampTags,
  IToTransaction,
  IFromTransaction,
  IRequiredTags
} from "./types";
import { appId, environment, version } from "src/env";

type Model = Instance<typeof Post>;

type IToTransactionInputs = Pick<
  Model,
  "id" | "title" | "text" | "createdAt" | "updatedAt" | "category"
>;

type IToTransactionOutput = Pick<Model, "id" | "title"> & {
  type: "post";
  category: string;
} & ITimestampTags &
  IRequiredTags;

export const toTransaction: IToTransaction<
  IToTransactionInputs,
  IToTransactionOutput
> = o => {
  return {
    tags: {
      id: o.id,
      title: o.title,
      ...timestamp.fromMsToCreatedAtTags(o.createdAt),
      ...timestamp.fromMsToUpdatedAtTags(o.updatedAt),
      "Content-Type": "text/plain",
      appId,
      environment,
      version,
      type: "post",
      category: o.category
    },
    content: o.text
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
    title: o.tags.title,
    text: o.content,
    from: o.tags.from,
    category: o.tags.category,
    createdAt: timestamp.toMsFromCreatedAtTags(o.tags),
    updatedAt: timestamp.toMsFromUpdatedAtTags(o.tags)
  };
};
