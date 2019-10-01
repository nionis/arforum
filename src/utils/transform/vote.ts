import { Instance } from "mobx-state-tree";
import Vote from "src/models/Vote";
import { fromMs, toMs } from "src/utils/timestamp";
import { requiredTags } from "./utils";
import { IToTransaction, IFromTransaction } from "./types";

type ModelInstance = Instance<typeof Vote>;
type Keys = "type" | "item" | "createdAt";
type Tags = {
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
    id: undefined,
    tags: {
      ...fromMs(ops.createdAt),
      ...requiredTags(),
      "Content-Type": "text/plain",
      type: "vote",
      // TODO: could add type here
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
    id: ops.id,
    type: ops.content,
    from: ops.tags.from,
    item: ops.tags.item,
    createdAt: toMs(ops.tags)
  };
};
