import uuid from "uuid/v4";

export const randomId = () => uuid();

export const getNow = () => Number(new Date());

export const getClientSize = () => {
  const width = document.documentElement.clientWidth;
  const height = document.documentElement.clientHeight;

  return {
    width,
    height
  };
};

export * from "./addTags";
export * from "./pickLatest";
