import { Instance } from "mobx-state-tree";
import Comment from "src/models/Comment";
import { fromMs, toMs } from "src/utils/timestamp";
import { requiredTags } from "./utils";
import { IToTransaction, IFromTransaction } from "./types";

type ModelInstance = Instance<typeof Comment>;
type Keys = "text" | "createdAt" | "post" | "editOf" | "replyOf";
type Tags = {
  type: "comment";
  post: string;
  editOf: string;
  replyOf: string;
};
type Content = "text";

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
      type: "comment",
      post: ops.post,
      editOf: ops.editOf,
      replyOf: ops.replyOf
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
    id: ops.id,
    text: ops.content,
    from: ops.tags.from,
    post: ops.tags.post,
    createdAt: toMs(ops.tags),
    editOf: ops.tags.editOf,
    replyOf: ops.tags.replyOf
  };
};
