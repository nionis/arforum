import { types, IAnyComplexType } from "mobx-state-tree";
import cache from "src/stores/cache";

// a generic reference to cache
export const Reference = <T extends IAnyComplexType>(model: T) => {
  return types.reference(model, {
    get(id) {
      return cache.get(id) || null;
    },

    set(store: any) {
      cache.set(store.id, store);
      return store.id;
    }
  });
};
