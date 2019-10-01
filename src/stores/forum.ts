import { reaction } from "mobx";
import Forum from "src/models/Forum";
import app from "src/stores/app";
import { Pagination } from "src/utils";
import { appId } from "src/env";

const forum = Forum.create({
  id: appId
});

forum.shallowFetch();

// let pagination;
// let fn: Parameters<typeof Pagination>[1]
// reaction(
//   () => app.pathData,
//   ({ page, categoryId }) => {
//     if (categoryId) {
//       fn = ops => forum.getCategories({
//         ...ops,
//         categoryId
//       })
//     } else if (page === "Home") {
//       fn = ops => forum.getCategories({...ops})
//     }

//   },
//   {
//     fireImmediately: true
//   }
// );

export default forum;
