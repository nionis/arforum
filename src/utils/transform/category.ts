import { Instance } from "mobx-state-tree";
import Category from "src/models/Category";
import * as utils from "./utils";
import { IToTransaction, IFromTransaction } from "./types";

type ModelInstance = Instance<typeof Category>;
type Keys = "id" | "description" | "createdAt";
type Tags = {
  id: string;
  description: string;
  type: "category";
};
type Content = undefined;

export const toTransaction: IToTransaction<
  ModelInstance,
  Keys,
  Tags,
  Content
> = ops => {
  return {
    tags: {
      id: ops.id,
      description: ops.description,
      ...utils.fromMsToCreatedAtTags(ops.createdAt),
      ...utils.requiredTags(),
      "Content-Type": "text/plain",
      type: "category"
    },
    content: undefined
  };
};

export const fromTransaction: IFromTransaction<
  ModelInstance,
  Keys,
  Tags,
  Content
> = ops => {
  return {
    id: ops.tags.id,
    description: ops.tags.description,
    from: ops.tags.from,
    createdAt: utils.toMsFromCreatedAtTags(ops.tags)
  };
};
