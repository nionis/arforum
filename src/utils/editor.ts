import seq from "promise-sequential";
import { mapValues } from "lodash";
import transactions from "src/stores/transactions";

const waitForTx = (data: any) => {
  return new Promise<string>(async (resolve, reject) => {
    const content = await fetch(data.url)
      .then(r => r.arrayBuffer())
      .then(arr => new Uint8Array(arr));

    transactions
      .add(
        {
          tags: {
            "Content-Type": data.type || ""
          },
          content
        },
        {
          txIdCb: id => resolve(id),
          title: "media"
        }
      )
      .catch(reject);
  });
};

export const getBlobData = (content: any, type: "text" | "media" | "link") => {
  return type === "text"
    ? Object.values(content.entityMap)
        .filter((o: any) => {
          return o.type === "IMAGE";
        })
        .map((o: any) => ({
          url: o.data.src
        }))
    : type === "media"
    ? [
        {
          url: URL.createObjectURL(content),
          type: content.type
        }
      ]
    : [];
};

export const postBlobData = async (
  blobData: {
    url: string;
    type?: string;
  }[]
) => {
  return seq(
    blobData.map(props => async () => {
      let id: string;

      if (props.url.startsWith("https://arweave.net/")) {
        id = props.url.split("https://arweave.net/")[1];
      } else {
        id = await waitForTx(props);
      }

      return {
        id,
        url: props.url
      };
    })
  );
};

export const patchContent = (
  content: any,
  type: "text" | "media" | "link",
  blobIds: any
) => {
  if (type === "media") {
    content = blobIds[0].url;
  } else if (type === "text") {
    content.entityMap = mapValues(content.entityMap, item => {
      console.log(item);
      if (item.type !== "IMAGE") return item;

      const id = blobIds.find(o => o.url === item.data.src).id;
      item.data.src = `https://arweave.net/${id}`;

      return item;
    });
  }

  return content;
};
