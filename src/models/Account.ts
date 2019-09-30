import { types, flow } from "mobx-state-tree";
import arweave from "src/arweave";
import User from "src/models/User";

const Account = types
  .compose(
    "Account",
    User,
    types.model({
      id: types.maybe(types.string),
      balance: "0"
    })
  )
  .volatile(() => ({
    jwk: undefined
  }))
  .views(self => ({
    get loggedIn() {
      return !!self.address;
    },

    get balancePretty() {
      return arweave.ar.winstonToAr(self.balance, {
        decimals: 5
      });
    }
  }))
  .actions(self => ({
    setJwk: flow(function* setJwk(jwk: typeof self["jwk"]) {
      self.jwk = jwk;
      self.id = yield arweave.wallets.jwkToAddress(jwk);
      self.balance = yield arweave.wallets.getBalance(self.address);
    })
  }));

export default Account;
