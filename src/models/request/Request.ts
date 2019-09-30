/* 
  A generic model that keeps track of a function's status.
  Used when fetching data or making a transaction.
*/
import { types } from "mobx-state-tree";
import { flow } from "src/utils";

const Request = types
  .model("Request", {
    status: types.maybe(types.enumeration(["PENDING", "SUCCESS", "FAILURE"]))
  })
  .volatile(() => ({
    response: undefined
  }))
  .actions(self => {
    const track = <R = any>(fn: () => Promise<R>) =>
      flow<Promise<R>, R | undefined, [() => Promise<R>]>(function* track(fn) {
        self.status = "PENDING";
        self.response = undefined;

        try {
          const res = yield fn();
          self.status = "SUCCESS";
          self.response = res;

          return res;
        } catch (err) {
          console.error(err);
          self.status = "FAILURE";
          self.response = undefined;

          return undefined;
        }
      })(fn);

    return {
      track
    };
  });

export default Request;
