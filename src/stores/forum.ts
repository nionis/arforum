import Forum from "src/models/Forum";
import { appId } from "src/env";

const forum = Forum.create({
  id: appId
});

forum.quickFetch().then(() => forum.postFetch());

export default forum;
