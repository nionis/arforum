import { types } from "mobx-state-tree";
import { fromMs } from "src/utils";

const Pagination = types
  .model("Pagination", {
    page: 0
  })
  .actions(self => {
    let fn: () => Promise<any> | undefined;

    return {
      setFn(_fn: typeof fn) {
        fn = _fn;
      }
    };
  });
