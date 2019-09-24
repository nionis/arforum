import uuid from "uuid/v4";

export const randomId = () => uuid();

export const getNow = () => Number(new Date());

export * from "./addTags";
