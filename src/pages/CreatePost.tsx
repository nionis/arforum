import { useState, CSSProperties } from "react";
import { observer } from "mobx-react";
import { useDropzone } from "react-dropzone";
import { ArrowDownward } from "@material-ui/icons";
import Input from "src/components/Input";
import Button from "src/components/Button";
import Tabs from "src/components/Tabs";
import Border from "src/components/Border";
import Item from "src/components/Item";
import app from "src/stores/app";

const CreatePost = observer(() => {
  const { colors } = app;

  const [panel, changePanel] = useState<"Post" | "Media" | "Link">("Post");
  const { getInputProps } = useDropzone({
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
                disabled={panel !== "Post"}
                color={colors.accent}
                width="2px"
                style={borderStyle}
              >
                <Item onClick={() => changePanel("Post")}>
                  <div>Post</div>
                </Item>
              </Border>
              <Border
                bottom={true}
                disabled={panel !== "Media"}
                color={colors.accent}
                width="2px"
                style={borderStyle}
              >
                <Item onClick={() => changePanel("Media")}>
                  <div>Image</div>
                </Item>
              </Border>
              <Border
                bottom={true}
                disabled={panel !== "Link"}
                color={colors.accent}
                width="2px"
                style={borderStyle}
              >
                <Item onClick={() => changePanel("Link")}>
                  <div>Link</div>
                </Item>
              </Border>
            </Tabs>
          </div>
          <div className="inputPadding">
            <Input label="Title" />

            {panel === "Post" ? (
              <Input multiline={true} label="Description" />
            ) : panel === "Media" ? (
              <div className="dropzone">
                <input {...getInputProps()} />
                <span>Upload an image</span>
                <ArrowDownward
                  style={{
                    width: "80px",
                    height: "80px"
                  }}
                />
                <span className="error">ERROR MESSAGE</span>
              </div>
            ) : (
              <>
                <Input label="URL" />
                <div className="button">
                  <Button
                    style={{ width: "100%", padding: "10px", height: "50px" }}
                  >
                    Create Post
                  </Button>
                </div>
              </>
            )}
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
        }

        .error {
          color: ${colors.error};
        }

        .button {
          width: 70%;
        }

        .container {
          display: flex;
          flex-direction: column;
          width: 100%;
          justify-content: center;
          align-items: center;
          padding-top: ${app.size === "large" ? "5vh" : "2vh"};
          color: ${colors.normalText};
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
