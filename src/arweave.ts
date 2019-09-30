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
  timeout: 60000
});

export const graphql = (query: string, variables?: any) => {
  return fetch("https://arweave.net/arql", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json"
    },
    body: JSON.stringify({ query, variables })
  }).then(res => res.json());
};

export default arweave;
