import { Instance } from "mobx-state-tree";
import Category from "src/models/Category";
import * as timestamp from "./utils";
import {
  ITimestampTags,
  IToTransaction,
  IFromTransaction,
  IRequiredTags
} from "./types";
import { appId, environment, version } from "src/env";

type Model = Instance<typeof Category>;

type IToTransactionInputs = Pick<
  Model,
  "id" | "description" | "createdAt" | "updatedAt"
>;

type IToTransactionOutput = Pick<Model, "id" | "description"> & {
  type: "category";
} & ITimestampTags &
  IRequiredTags;

export const toTransaction: IToTransaction<
  IToTransactionInputs,
  IToTransactionOutput
> = o => {
  return {
    tags: {
      id: o.id,
      description: o.description,
      ...timestamp.fromMsToCreatedAtTags(o.createdAt),
      ...timestamp.fromMsToUpdatedAtTags(o.updatedAt),
      "Content-Type": "text/plain",
      appId,
      environment,
      version,
      type: "category"
    }
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
    description: o.tags.description,
    from: o.tags.from,
    createdAt: timestamp.toMsFromCreatedAtTags(o.tags),
    updatedAt: timestamp.toMsFromUpdatedAtTags(o.tags)
  };
};
