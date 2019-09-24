import Arweave from "arweave/web";
import ApolloClient from "apollo-boost";

const arweave = Arweave.init({
  host: "arweave.net",
  protocol: "https",
  port: 443,
  timeout: 60000
});

const graphql = new ApolloClient({
  uri: "https://arweave.net/arql"
});

export { graphql };
export default arweave;
