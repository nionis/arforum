import { Instance } from "mobx-state-tree";
import Comment from "src/models/Comment";
import { fromMs, toMs } from "src/utils/timestamp";
import { requiredTags } from "./utils";
import { IToTransaction, IFromTransaction } from "./types";

type ModelInstance = Instance<typeof Comment>;
type Keys = "content" | "createdAt" | "post" | "editOf" | "replyOf";
type Tags = {
  modelType: "comment";
  post: string;
  editOf: string;
  replyOf: string;
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
      modelType: "comment",
      post: ops.post,
      editOf: ops.editOf,
      replyOf: ops.replyOf
    },
    content: JSON.stringify({
      content: ops.content
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
    content: ops.content.content,
    from: ops.tags.from,
    post: ops.tags.post,
    createdAt: toMs(ops.tags),
    editOf: ops.tags.editOf,
    replyOf: ops.tags.replyOf
  };
};
