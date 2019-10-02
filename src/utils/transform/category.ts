import { Instance } from "mobx-state-tree";
import Category from "src/models/Category";
import { fromMs, toMs } from "src/utils/timestamp";
import { requiredTags } from "./utils";
import { IToTransaction, IFromTransaction } from "./types";

type ModelInstance = Instance<typeof Category>;
type Keys = "name" | "description" | "createdAt";
type Tags = {
  modelType: "category";
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
      "Content-Type": "application/json",
      modelType: "category"
    },
    content: JSON.stringify({
      name: ops.name,
      description: ops.description
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
    name: ops.content.name,
    description: ops.content.description,
    from: ops.tags.from,
    createdAt: toMs(ops.tags)
  };
};
