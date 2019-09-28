import React, { forwardRef, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { types } from "mobx-state-tree";
import { observer } from "mobx-react";
import { ArrowDownward } from "@material-ui/icons";
import app from "src/stores/app";
import account from "src/stores/account";

interface ILogin {
  onClose: () => any;
}

const store = types
  .model("Login", {
    error: types.maybe(types.string)
  })
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
          account.setJwk(JSON.parse(contents)).then(onClose);
        } catch (err) {
          store.onError();
        }
      };

      reader.readAsText(file);
    }, []);
    const { getRootProps, getInputProps, isDragActive } = useDropzone({
      onDrop
    });
    const { colors } = app;

    return (
      <>
        <div className="container" {...getRootProps()} ref={ref}>
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

        <style jsx>{`
          .container {
            display: flex;
            justify-content: center;
            align-items: center;
            flex-direction: column;
            width: ${app.size === "large" ? "50vw" : "100vw"};
            height: 50vh;
            cursor: pointer;
            color: ${colors.normalText};
            background-color: ${isDragActive
              ? colors.activeBackground
              : colors.pageBackground};
            border: 1px solid ${colors.border};
          }

          .error {
            color: ${colors.error};
          }
        `}</style>
      </>
    );
  })
);

export default Login;
