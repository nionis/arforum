import { Instance } from "mobx-state-tree";
import Vote from "src/models/Vote";
import { fromMs, toMs } from "src/utils/timestamp";
import { requiredTags } from "./utils";
import { IToTransaction, IFromTransaction } from "./types";

type ModelInstance = Instance<typeof Vote>;
type Keys = "type" | "item" | "createdAt";
type Tags = {
  modelType: "vote";
  item: string;
};
type Content = string;

export const toTransaction: IToTransaction<
  ModelInstance,
  Keys,
  Tags,
  Content
> = ops => {
  return {
    id: undefined,
    tags: {
      ...fromMs(ops.createdAt),
      ...requiredTags(),
      "Content-Type": "text/plain",
      modelType: "vote",
      type: ops.type, // temporary: for faster loading
      item: ops.item
    },
    content: JSON.stringify({
      type: ops.type
    })
  };
};

export const fromTransaction: IFromTransaction<
  ModelInstance,
  Keys,
  Tags,
  any
> = ops => {
  return {
    id: ops.id,
    type: ops.content.type,
    from: ops.tags.from,
    item: ops.tags.item,
    createdAt: toMs(ops.tags)
  };
};
