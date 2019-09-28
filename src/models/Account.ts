import { types, flow } from "mobx-state-tree";
import arweave from "src/arweave";
import User from "src/models/User";

const Account = types
  .compose(
    "Account",
    User,
    types.model({})
  )
  .volatile(self => ({
    jwk: undefined
  }))
  .views(self => ({
    get loggedIn() {
      return !!self.address;
    }
  }))
  .actions(self => ({
    setJwk: flow(function* setJwk(jwk: typeof self["jwk"]) {
      self.jwk = jwk;
      self.address = yield arweave.wallets.jwkToAddress(jwk);
    })
  }));

export default Account;
