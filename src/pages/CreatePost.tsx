import { useCallback, CSSProperties } from "react";
import { observer } from "mobx-react";
import { types, unprotect } from "mobx-state-tree";
import { useDropzone } from "react-dropzone";
import { ArrowDownward } from "@material-ui/icons";
import { EditorState, convertToRaw } from "draft-js";
import Input from "src/components/Input";
import Button from "src/components/Button";
import Tabs from "src/components/Tabs";
import Border from "src/components/Border";
import Item from "src/components/Item";
import Editor from "src/components/Editor";
import app from "src/stores/app";
import forum from "src/stores/forum";

const store = types
  .model("CreatePost", {
    error: "",
    panel: types.optional(types.enumeration(["text", "media", "link"]), "text"),
    title: "",
    url: "",
    showErrors: false
  })
  .volatile(self => ({
    editorState: EditorState.createEmpty()
  }))
  .views(self => ({
    get valid() {
      return {
        title: self.title.length > 0 && self.title.length < 20
      };
    }
  }))
  .views(self => ({
    get ok() {
      return Object.values(self.valid).every(ok => ok);
    }
  }))
  .actions(self => {
    unprotect(self);
    let media;

    return {
      setMedia(m: any) {
        media = m;
      },

      onError() {
        self.error =
          "Something went wrong, please try again with a different file.";
      },

      changePanel(panel: typeof self["panel"]) {
        self.panel = panel;
      },

      updateInput(key: "title" | "url" | "editorState", value: any) {
        self.showErrors = true;

        self[key] = value;
      },

      create() {
        if (!self.ok) return;

        const title = self.title;
        const content =
          self.panel === "text"
            ? convertToRaw(self.editorState.getCurrentContent())
            : self.panel === "media"
            ? media
            : self.url;

        forum.categories
          .get("jfyToGEYY7YAda_gwR5mg6mKmoLp0S-I-N_u1Ha26hk")
          .createPost(title, content, self.panel);
      }
    };
  })
  .create();

const CreatePost = observer(() => {
  const { colors } = app;

  const onDrop = useCallback(([file]) => {
    const reader = new FileReader();

    reader.onabort = store.onError;
    reader.onerror = store.onError;

    store.setMedia(file);
  }, []);

  const { getInputProps, getRootProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false
  });

  const borderStyle: CSSProperties = {
    justifyContent: "center",
    display: "flex",
    alignItems: "center",
    width: "35%",
    textAlign: "center",
    height: "50px"
  };

  return (
    <>
      <div className="container">
        <div className="inputContainer">
          <div className="tabs">
            <Tabs direction="row">
              <Border
                bottom={true}
                disabled={store.panel !== "text"}
                color={colors.accent}
                width="2px"
                style={borderStyle}
              >
                <Item onClick={() => store.changePanel("text")}>
                  <div>Text</div>
                </Item>
              </Border>
              <Border
                bottom={true}
                disabled={store.panel !== "media"}
                color={colors.accent}
                width="2px"
                style={borderStyle}
              >
                <Item onClick={() => store.changePanel("media")}>
                  <div>Media</div>
                </Item>
              </Border>
              <Border
                bottom={true}
                disabled={store.panel !== "link"}
                color={colors.accent}
                width="2px"
                style={borderStyle}
              >
                <Item onClick={() => store.changePanel("link")}>
                  <div>Link</div>
                </Item>
              </Border>
            </Tabs>
          </div>
          <div className="inputPadding">
            <Input
              label="Title"
              value={store.title}
              onChange={e => store.updateInput("title", e.target.value)}
            />

            {store.panel === "text" ? (
              <Editor
                state={store.editorState}
                onChange={state => store.updateInput("editorState", state)}
              />
            ) : store.panel === "media" ? (
              <div className="dropzone" {...getRootProps()}>
                <input {...getInputProps()} />
                <span>Upload an image, video or file</span>
                <ArrowDownward
                  style={{
                    width: "80px",
                    height: "80px"
                  }}
                />
                {store.error ? (
                  <span className="error">{store.error}</span>
                ) : null}
              </div>
            ) : (
              <>
                <Input
                  label="URL"
                  value={store.url}
                  onChange={e => store.updateInput("url", e.target.value)}
                />
              </>
            )}
            <div className="button">
              <Button
                style={{ width: "100%", padding: "10px", height: "50px" }}
                onClick={store.create}
              >
                Create Post
              </Button>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .dropzone {
          display: flex;
          justify-content: center;
          align-items: center;
          flex-direction: column;
          cursor: pointer;
          width: 100%;
          height: 100%;
          margin-bottom: 20px;
          color: ${colors.normalText};
          background-color: ${isDragActive
            ? colors.activeBackground
            : colors.pageBackground};
          border: 1px solid ${colors.border};
        }

        .error {
          color: ${colors.error};
        }

        .button {
          margin-top: 30px;
          width: 70%;
        }

        .container {
          display: flex;
          flex-direction: column;
          width: 100%;
          justify-content: center;
          align-items: center;
          padding-top: ${app.size === "large" ? "5vh" : "2vh"};
        }

        .inputContainer {
          width: ${app.size === "large" ? "50%" : "100%"};
          background: ${colors.foreground};
          justify-content: center;
          align-items: center;
          display: flex;
          flex-direction: column;
        }

        .inputPadding {
          padding: 20px;
          width: 100%;
          justify-content: center;
          align-items: center;
          display: flex;
          flex-direction: column;
        }

        .tabs {
          display: flex;
          width: 100%;
        }
      `}</style>
    </>
  );
});

export default CreatePost;
