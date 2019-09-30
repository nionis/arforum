import { Instance } from "mobx-state-tree";
import Comment from "src/models/Comment";
import * as timestamp from "./utils";
import {
  ITimestampTags,
  IToTransaction,
  IFromTransaction,
  IRequiredTags
} from "./types";
import { appId, environment, version } from "src/env";

type Model = Instance<typeof Comment>;

type IToTransactionInputs = Pick<
  Model,
  "id" | "text" | "createdAt" | "updatedAt" | "post"
>;

type IToTransactionOutput = Pick<Model, "id"> & {
  type: "comment";
  post: string;
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
      type: "comment",
      post: o.post
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
    text: o.content,
    from: o.tags.from,
    post: o.tags.post,
    createdAt: timestamp.toMsFromCreatedAtTags(o.tags),
    updatedAt: timestamp.toMsFromUpdatedAtTags(o.tags)
  };
};
