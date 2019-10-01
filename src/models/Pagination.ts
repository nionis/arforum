import { types } from "mobx-state-tree";

const Pagination = types
  .model("Pagination", {
    timestamp: types.number
  })
  .actions(self => ({
    previous() {
      const date = new Date(self.timestamp);
      date.setUTCMonth(date.getUTCMonth() - 1);
      date.setUTCHours(0, 0, 0);
      date.setUTCMilliseconds(0);

      self.timestamp = Number(date);
    }
  }))
  .actions(self => ({
    async next(fn: (timestamp: typeof self["timestamp"]) => Promise<any>) {
      await fn(self.timestamp);

      self.previous();
    }
  }));

export default Pagination;
