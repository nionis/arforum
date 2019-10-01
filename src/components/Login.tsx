import React, { forwardRef, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { types } from "mobx-state-tree";
import { observer } from "mobx-react";
import Modal from "@material-ui/core/Modal";
import { ArrowDownward } from "@material-ui/icons";
import Item from "src/components/Item";
import Link from "src/components/Link";
import ModalModel from "src/models/Modal";
import app from "src/stores/app";
import account from "src/stores/account";

export const store = types
  .compose(
    "Login",
    ModalModel,
    types.model("Login", {
      error: types.maybe(types.string)
    })
  )
  .actions(self => ({
    onError() {
      self.error =
        "Something went wrong, please try again with a different file.";
    },

    reset() {
      self.error = undefined;
    }
  }))
  .create();

interface ILogin {
  onClose: () => any;
}

const Login = observer(
  forwardRef(({ onClose }: ILogin, ref: React.RefObject<HTMLDivElement>) => {
    const onDrop = useCallback(([file]) => {
      store.reset();
      const reader = new FileReader();

      reader.onabort = store.onError;
      reader.onerror = store.onError;
      reader.onload = e => {
        const contents = e.target.result as string;

        try {
          account.setJwk(JSON.parse(contents)).then(() => {
            account.getUsername();
            onClose();
          });
        } catch (err) {
          store.onError();
        }
      };

      reader.readAsText(file);
    }, []);
    const { getRootProps, getInputProps, isDragActive } = useDropzone({
      onDrop,
      multiple: false
    });
    const { colors } = app;

    return (
      <>
        <div className="container">
          <div className="dropzone" {...getRootProps()} ref={ref}>
            <input {...getInputProps()} />
            <span>Drop a wallet key file to login</span>
            <ArrowDownward
              style={{
                width: "80px",
                height: "80px"
              }}
            />
            <span className="error">{store.error}</span>
          </div>
          <div className="new">
            <Item>new here?&nbsp;</Item>
            <Link href="https://tokens.arweave.org/" target="_blank">
              get a free wallet!
            </Link>
          </div>
        </div>

        <style jsx>{`
          .container {
            display: flex;
            justify-content: center;
            align-items: center;
            flex-direction: column;
            width: ${app.size === "large" ? "50vw" : "100vw"};
            height: 50vh;
            color: ${colors.normalText};
            background-color: ${isDragActive
              ? colors.activeBackground
              : colors.pageBackground};
            border: 1px solid ${colors.border};
          }

          .dropzone {
            display: flex;
            justify-content: center;
            align-items: center;
            flex-direction: column;
            cursor: pointer;
            width: 100%;
            height: 80%;
          }

          .new {
            display: flex;
            justify-content: center;
            align-items: center;
            flex-direction: column;
            width: 100%;
            height: 20%;
          }

          .error {
            color: ${colors.error};
          }
        `}</style>
      </>
    );
  })
);

const LoginModal = observer(() => {
  return (
    <Modal
      open={store.opened}
      onClose={store.close}
      disableAutoFocus={true}
      disableEnforceFocus={true}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
      }}
    >
      <Login onClose={store.close} />
    </Modal>
  );
});

export default LoginModal;
