import { Instance } from "mobx-state-tree";
import Comment from "src/models/Comment";
import * as utils from "./utils";
import { IToTransaction, IFromTransaction } from "./types";

type ModelInstance = Instance<typeof Comment>;
type Keys = "id" | "text" | "createdAt" | "updatedAt" | "post";
type Tags = {
  id: string;
  type: "comment";
  post: string;
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
      ...utils.fromMsToUpdatedAtTags(ops.updatedAt),
      ...utils.requiredTags(),
      "Content-Type": "text/plain",
      type: "comment",
      post: ops.post
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
    updatedAt: utils.toMsFromUpdatedAtTags(ops.tags)
  };
};
