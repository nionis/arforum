/*
  expose all utils
*/
export const getNow = () => Number(new Date());

export const getClientSize = () => {
  const width = document.documentElement.clientWidth;
  const height = document.documentElement.clientHeight;

  return {
    width,
    height
  };
};

// async timeout
export const wait = (ms: number) => {
  return new Promise<void>(resolve => {
    setTimeout(resolve, ms);
  });
};

export * from "./colors";
export * from "./transform";
export * from "./cache";
export * from "./graphql";
export * from "./mst";
export * from "./pagination";
export * from "./pickLatest";
export * from "./timestamp";
