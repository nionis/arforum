import Forum from "src/models/Forum";
import { appId } from "src/env";

const forum = Forum.create({
  id: appId
});

export default forum;
