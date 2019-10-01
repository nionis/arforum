import { Instance } from "mobx-state-tree";
import Category from "src/models/Category";
import { fromMs, toMs } from "src/utils/timestamp";
import { requiredTags } from "./utils";
import { IToTransaction, IFromTransaction } from "./types";

type ModelInstance = Instance<typeof Category>;
type Keys = "name" | "description" | "createdAt";
type Tags = {
  name: string;
  type: "category";
};
type Content = "description";

export const toTransaction: IToTransaction<
  ModelInstance,
  Keys,
  Tags,
  Content
> = ops => {
  return {
    id: undefined,
    tags: {
      name: ops.name, // not needed
      ...fromMs(ops.createdAt),
      ...requiredTags(),
      "Content-Type": "application/json",
      type: "category"
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
  Content
> = ops => {
  const content = (ops.content || {}) as any;

  return {
    id: ops.id,
    name: ops.tags.name,
    description: content.description,
    from: ops.tags.from,
    createdAt: toMs(ops.tags)
  };
};
