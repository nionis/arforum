import { Instance } from "mobx-state-tree";
import Post from "src/models/Post";
import { fromMs, toMs } from "src/utils/timestamp";
import { requiredTags } from "./utils";
import { IToTransaction, IFromTransaction } from "./types";

type ModelInstance = Instance<typeof Post>;
type Keys = "title" | "content" | "createdAt" | "category" | "editOf" | "type";
type Tags = {
  modelType: "post";
  category: string;
  editOf: string;
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
      modelType: "post",
      category: ops.category,
      editOf: ops.editOf
    },
    content: JSON.stringify({
      title: ops.title,
      content: ops.content,
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
    title: ops.content.title,
    content: ops.content.content,
    from: ops.tags.from,
    category: ops.tags.category,
    editOf: ops.tags.editOf,
    type: ops.content.type,
    createdAt: toMs(ops.tags)
  };
};
