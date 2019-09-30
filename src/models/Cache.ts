import { observable } from "mobx";

const Cache = () => {
  const store = observable.map();

  return store;
};

export default Cache;
