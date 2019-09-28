import Forum from "src/models/Forum";
import { forumId } from "src/env";

const forum = Forum.create({
  id: forumId
});

forum.getCategories();

export default forum;
