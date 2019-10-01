import { Instance } from "mobx-state-tree";
import Post from "src/models/Post";
import { fromMs, toMs } from "src/utils/timestamp";
import { requiredTags } from "./utils";
import { IToTransaction, IFromTransaction } from "./types";

type ModelInstance = Instance<typeof Post>;
type Keys = "title" | "text" | "createdAt" | "category" | "editOf";
type Tags = {
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
    id: undefined,
    tags: {
      title: ops.title, // TODO: could be in content
      // TODO: could add description
      ...fromMs(ops.createdAt),
      ...requiredTags(),
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
    id: ops.id,
    title: ops.tags.title,
    text: ops.content,
    from: ops.tags.from,
    category: ops.tags.category,
    editOf: ops.tags.editOf,
    createdAt: toMs(ops.tags)
  };
};
