import { Instance } from "mobx-state-tree";
import Comment from "src/models/Comment";
import * as utils from "./utils";
import { IToTransaction, IFromTransaction } from "./types";

type ModelInstance = Instance<typeof Comment>;
type Keys = "id" | "text" | "createdAt" | "post" | "editOf" | "replyOf";
type Tags = {
  id: string;
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
    tags: {
      id: ops.id,
      ...utils.fromMsToCreatedAtTags(ops.createdAt),
      ...utils.requiredTags(),
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
    id: ops.tags.id,
    text: ops.content,
    from: ops.tags.from,
    post: ops.tags.post,
    createdAt: utils.toMsFromCreatedAtTags(ops.tags),
    editOf: ops.tags.editOf,
    replyOf: ops.tags.replyOf
  };
};
