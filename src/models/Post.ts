import { types, flow, Instance } from "mobx-state-tree";
import Primitive from "src/models/Primitive";
import fetches from "src/stores/fetches";
import HasOwner from "src/models/HasOwner";
import Request from "src/models/request/Request";
import User from "src/models/User";
import Vote from "src/models/Vote";
import Votes from "src/models/Votes";
import Editable from "src/models/Editable";
import Comment from "src/models/Comment";
import Transaction from "src/models/request/Transaction";
import transactions from "src/stores/transactions";
import {
  getNow,
  post as tfPost,
  comment as tfComment,
  vote as tfVote
} from "src/utils";
import { appId } from "src/env";
import Category from "src/models/Category";
import { getBlobData, postBlobData, patchContent } from "src/utils/editor";

const Post = types
  .compose(
    "Post",
    Primitive,
    HasOwner,
    Votes,
    Editable,
    types
      .model({
        fComments: types.optional(Request, {}),
        category: types.string,
        title: "",
        comments: types.map(Comment),
        type: types.maybe(types.enumeration(["text", "media", "link"]))
      })
      .volatile(self => ({
        content: undefined
      }))
  )
  .actions(self => ({
    setComment(comment: Instance<typeof Comment>) {
      self.comments.set(comment.id, comment);
    },

    setVote(vote: Instance<typeof Vote>) {
      self.votes.set(vote.id, vote);
    },

    setContent(content: any) {
      self.content = content;
    }
  }))
  .actions(self => ({
    quickFetch: async () => {
      await self.fVotes.track(async () => {
        const votes: any[] = (await fetches.add({
          query: {
            op: "and",
            expr1: {
              op: "equals",
              expr1: "appId",
              expr2: appId
            },
            expr2: {
              op: "and",
              expr1: {
                op: "equals",
                expr1: "modelType",
                expr2: "vote"
              },
              expr2: {
                op: "equals",
                expr1: "item",
                expr2: self.id
              }
            }
          },
          contentType: "application/json"
        })) as any;

        votes.forEach(vote => {
          try {
            if (!self.votes.has(vote.id)) {
              const normalized = tfVote.fromTransaction(vote);

              self.setVote(
                Vote.create({
                  ...normalized,
                  from: User.create({
                    id: normalized.from
                  }) as any
                })
              );
            }
          } catch (err) {
            console.error(err);
          }
        });

        return votes;
      });

      await self.fComments.track(async () => {
        const comments: any[] = (await fetches.add({
          query: {
            op: "and",
            expr1: {
              op: "equals",
              expr1: "appId",
              expr2: appId
            },
            expr2: {
              op: "and",
              expr1: {
                op: "equals",
                expr1: "modelType",
                expr2: "comment"
              },
              expr2: {
                op: "equals",
                expr1: "post",
                expr2: self.id
              }
            }
          },
          contentType: "application/json"
        })) as any;

        comments.forEach(comment => {
          try {
            if (!self.comments.has(comment.id)) {
              const normalized = tfComment.fromTransaction(comment);

              self.setComment(
                Comment.create({
                  ...normalized,
                  from: User.create({
                    id: normalized.from
                  }) as any
                })
              );
            }
          } catch (err) {
            console.error(err);
          }
        });

        return comments;
      });
    },

    updateContent: flow(function* updateContent(content: any) {
      const now = getNow();
      const editOf = self.id;

      const blobData = getBlobData(content, self.type);
      const blobIds: any[] = yield postBlobData(blobData);

      content = patchContent(content, self.type, blobIds);

      transactions.add(
        tfPost.toTransaction({
          title: self.title,
          content,
          type: self.type,
          createdAt: now,
          category: self.category,
          editOf: editOf
        }),
        {
          title: "post edit"
        }
      );
    }),

    createComment: flow(function* createComment(content: any) {
      const now = getNow();

      return Transaction.create().run(
        tfComment.toTransaction({
          content,
          createdAt: now,
          post: self.id,
          editOf: undefined,
          replyOf: undefined
        })
      );
    })
  }));

export default Post;
