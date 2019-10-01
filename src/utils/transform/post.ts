import { Instance } from "mobx-state-tree";
import Post from "src/models/Post";
import * as utils from "./utils";
import { IToTransaction, IFromTransaction } from "./types";

type ModelInstance = Instance<typeof Post>;
type Keys = "id" | "title" | "text" | "createdAt" | "category" | "editOf";
type Tags = {
  id: string;
  title: string;
  type: "post";
  category: string;
  editOf: string;
};
type Content = "text";

export const toTransaction: IToTransaction<
  ModelInstance,
  Keys,
  Tags,
  Content
> = ops => {
  return {
    tags: {
      id: ops.id,
      title: ops.title,
      ...utils.fromMsToCreatedAtTags(ops.createdAt),
      ...utils.requiredTags(),
      "Content-Type": "text/plain",
      type: "post",
      category: ops.category,
      editOf: ops.editOf
    },
    content: ops.text
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
    title: ops.tags.title,
    text: ops.content,
    from: ops.tags.from,
    category: ops.tags.category,
    editOf: ops.tags.editOf,
    createdAt: utils.toMsFromCreatedAtTags(ops.tags)
  };
};
