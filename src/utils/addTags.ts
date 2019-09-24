import Transaction from "arweave/web/lib/transaction";
import { forumId } from "src/env";

interface IOpsConstant {
  id: string;
  createdAt: number;
  updatedAt: number;
}

interface IOpsCategory extends IOpsConstant {
  type: "category";
}

interface IOpsPost extends IOpsConstant {
  type: "post";
  category: string;
}

interface IOpsVote extends IOpsConstant {
  type: "vote";
  post: string;
}

type IOps = IOpsCategory | IOpsPost | IOpsVote;

const addTags = (tx: Transaction, ops: IOps) => {
  tx.addTag("Content-Type", "application/json");
  tx.addTag("appId", forumId);
  tx.addTag("id", ops.id);
  tx.addTag("createdAt", String(ops.createdAt));
  tx.addTag("updatedAt", String(ops.updatedAt));

  tx.addTag("type", ops.type);
  if (ops.type === "post") {
    tx.addTag("category", ops.category);
  } else if (ops.type === "vote") {
    tx.addTag("post", ops.post);
  }

  return tx;
};

export { addTags };
