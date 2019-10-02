import { toJS } from "mobx";
import { types, flow, Instance } from "mobx-state-tree";
import seq from "promise-sequential";
import { mapValues } from "lodash";
import Primitive from "src/models/Primitive";
import HasOwner from "src/models/HasOwner";
import User from "src/models/User";
import Post from "src/models/Post";
import fetches from "src/stores/fetches";
import transactions from "src/stores/transactions";
import arweave from "src/arweave";
import { getNow, Reference, post as tfPost, toTiny } from "src/utils";
import { getBlobData, postBlobData, patchContent } from "src/utils/editor";
import { appId } from "src/env";

const Category = types
  .compose(
    "Category",
    Primitive,
    HasOwner,
    types.model({
      name: "",
      description: "",
      posts: types.map(Reference(Post))
    })
  )
  .views(self => ({
    get displayName() {
      return self.name || toTiny(self.id);
    },

    get postsProcessed() {
      const posts = Array.from(self.posts.values()).sort((a, b) => {
        return a.createdAt - b.createdAt;
      });

      const processed = posts.reduce((result, post) => {
        if (post.editOf && result.get(post.editOf)) {
          result.delete(post.editOf);
        }

        result.set(post.id, post);
        return result;
      }, new Map());

      return processed;
    }
  }))
  .actions(self => ({
    setPost(post: Instance<typeof Post>) {
      self.posts.set(post.id, post);

      return self.posts.get(post.id);
    }
  }))
  .actions(self => ({
    createPost: flow(function* createPost(
      title: string,
      content: any,
      type: "text" | "media" | "link"
    ) {
      const now = getNow();
      const blobData = getBlobData(content, type);
      const blobIds: any[] = yield postBlobData(blobData);

      content = patchContent(content, type, blobIds);

      transactions.add(
        tfPost.toTransaction({
          title,
          content,
          type,
          createdAt: now,
          category: self.id,
          editOf: undefined
        }),
        {
          title: "post"
        }
      );
    })
  }));

export default Category;
