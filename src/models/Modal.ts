import { types } from "mobx-state-tree";

const Modal = types
  .model("Modal", {
    opened: false
  })
  .actions(self => ({
    open() {
      self.opened = true;
    },

    close() {
      self.opened = false;
    }
  }));

export default Modal;
