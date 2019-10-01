import { Instance } from "mobx-state-tree";
import Vote from "src/models/Vote";
import * as utils from "./utils";
import { IToTransaction, IFromTransaction } from "./types";

type ModelInstance = Instance<typeof Vote>;
type Keys = "id" | "type" | "item" | "createdAt" | "updatedAt";
type Tags = {
  id: string;
  type: "vote";
  item: string;
};
type Content = "type";

export const toTransaction: IToTransaction<
  ModelInstance,
  Keys,
  Tags,
  Content
> = ops => {
  return {
    tags: {
      id: ops.id,
      ...utils.fromMsToCreatedAtTags(ops.createdAt),
      ...utils.fromMsToUpdatedAtTags(ops.updatedAt),
      ...utils.requiredTags(),
      "Content-Type": "text/plain",
      type: "vote",
      item: ops.item
    },
    content: ops.type
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
    type: ops.content,
    from: ops.tags.from,
    item: ops.tags.item,
    createdAt: utils.toMsFromCreatedAtTags(ops.tags),
    updatedAt: utils.toMsFromUpdatedAtTags(ops.tags)
  };
};
