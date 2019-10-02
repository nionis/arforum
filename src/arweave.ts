/*
  Initiate arweave, expose tiny graphql fetcher.
  We use a custom graphql fetcher since we do
  de-dup, caching ourselves since using apollo
  or something similar would be overkill atm.
*/
import Arweave from "arweave/web";

const arweave = Arweave.init({
  host: "arweave.net",
  protocol: "https",
  port: 443,
  timeout: 60e3
});

export default arweave;
