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
import { getNow, Reference, post as tfPost } from "src/utils";
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
    displayName() {
      return self.name || `${self.id.substring(0, 4)}..`;
    }
  }))
  .actions(self => ({
    setPost(post: Instance<typeof Post>) {
      self.posts.set(post.id, post);

      return self.posts.get(post.id);
    }
  }))

  .actions(self => ({
    getPosts: flow(function* getPosts({
      shallow,
      month
    }: {
      shallow: boolean;
      month?: number;
    }) {
      const specificMonth =
        typeof month !== "undefined"
          ? `{ name: "months", value: "${month}" }`
          : "";

      const postsRaw: any[] = yield fetches.add({
        query: `
          query Posts {
            transactions(
              tags: [
                { name: "appId", value: "${appId}" }
                { name: "modelType", value: "post" }
                { name: "category", value: "${self.id}" }
                ${specificMonth}
              ]
            ) {
              id
              tags {
                name
                value
              }
            }
          }
        `,
        getData: res => res.data.transactions,
        fetchContent: !shallow,
        type: "text"
      });

      const posts = postsRaw.map(tfPost.fromTransaction);

      posts.forEach(post => {
        try {
          self.posts.set(
            post.id,
            Post.create({
              ...post,
              from: User.create({ id: post.from }) as any
            })
          );
        } catch (err) {
          console.error(err);
        }
      });
    }),

    createPost: flow(function* createPost(
      title: string,
      content: any,
      type: "text" | "media" | "link"
    ) {
      const now = getNow();

      const blobData: any[] =
        type === "text"
          ? Object.values(content.entityMap)
              .filter((o: any) => {
                return o.type === "IMAGE";
              })
              .map((o: any) => ({
                url: o.data.src
              }))
          : type === "media"
          ? [
              {
                url: URL.createObjectURL(content),
                type: content.type
              }
            ]
          : [];

      const waitForTx = (props: any) => {
        return new Promise(async (resolve, reject) => {
          const content = await fetch(props.url)
            .then(r => r.arrayBuffer())
            .then(arr => new Uint8Array(arr));

          transactions
            .add(
              {
                tags: {
                  "Content-Type": props.type || ""
                },
                content
              },
              id => resolve(id)
            )
            .catch(reject);
        });
      };

      const blobIds: any[] = yield seq(
        blobData.map(props => async () => {
          return {
            id: await waitForTx(props),
            url: props.url
          };
        })
      );

      if (type === "media") {
        content = blobIds[0].url;
      } else if (type === "text") {
        content.entityMap = mapValues(content.entityMap, item => {
          console.log(item);
          if (item.type !== "IMAGE") return item;

          const id = blobIds.find(o => o.url === item.data.src).id;
          item.data.src = `https://arweave.net/${id}`;

          return item;
        });
      }

      transactions.add(
        tfPost.toTransaction({
          title,
          content,
          type,
          createdAt: now,
          category: self.id,
          editOf: undefined
        })
      );
    })
  }));

export default Category;
