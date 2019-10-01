import { useState } from "react";
import { Instance } from "mobx-state-tree";
import PaginationModel from "src/models/Pagination";

interface IPagination {
  children: ({
    next,
    store
  }: {
    next: () => Promise<any>;
    store: Instance<typeof PaginationModel>;
  }) => any;

  fn: Parameters<Instance<typeof PaginationModel>["next"]>[0];
}

const Pagination = ({ children, fn }: IPagination) => {
  const [store] = useState(
    PaginationModel.create({
      timestamp: Number(new Date())
    })
  );

  return children({
    next: () => store.next(fn),
    store
  });
};

export default Pagination;
