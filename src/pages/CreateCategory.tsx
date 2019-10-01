import forum from "src/stores/forum";
import Input from "../components/Input";
import Button from "../components/Button";
import app from "src/stores/app";
import { observer } from "mobx-react";

import { ArrowDownward } from "@material-ui/icons";
import Tabs from "../components/Tabs";
import Border from "../components/Border";
import { useDropzone } from "react-dropzone";

const CreateCategory = observer(() => {
  const { colors } = app;
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    multiple: false
  });
  return (
    <>
      <div className="container">
        {/* <div className="inputContainer"> */}
        {/* <div className="title">Create Category</div> */}
        {/* <Input label="Title" />
          <Input multiline={true} label="Description" />
          <div className="button">
            <Button style={{ width: "100%", padding: "10px", height: "50px" }}>
              Create Category
            </Button>
          </div>
        </div> */}

        <div className="inputContainer">
          <div className="tabs">
            <Tabs direction="row">
              <Border
                bottom={true}
                disabled={false}
                color={colors.accent}
                width="2px"
                style={{
                  justifyContent: "center",
                  display: "flex",
                  alignItems: "center",
                  width: "35%",
                  textAlign: "center",
                  height: "50px"
                }}
              >
                <div>Post</div>
              </Border>
              <Border
                bottom={true}
                disabled={false}
                color={colors.accent}
                width="2px"
                style={{
                  justifyContent: "center",
                  display: "flex",
                  alignItems: "center",
                  width: "35%",
                  textAlign: "center",
                  height: "50px"
                }}
              >
                <div>Image</div>
              </Border>
              <Border
                bottom={true}
                disabled={false}
                color={colors.accent}
                width="2px"
                style={{
                  justifyContent: "center",
                  display: "flex",
                  alignItems: "center",
                  width: "35%",
                  textAlign: "center",
                  height: "50px"
                }}
              >
                <div>Link</div>
              </Border>
            </Tabs>
          </div>
          <div className="inputPadding">
            <Input label="Title" />

            {/* when POST tab is active */}
            {/* <Input multiline={true} label="Description" /> */}

            {/* when IMAGE tab is active */}
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

            {/* when LINK tab is active */}
            {/* <Input label="URL" /> */}

            <div className="button">
              <Button
                style={{ width: "100%", padding: "10px", height: "50px" }}
              >
                Create Post
              </Button>
            </div>
          </div>
        </div>
      </div>
      <style jsx>{`
        {/* STYLING FOR CREATE POST */}
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
          color: ${colors.normalText}
        }
        .inputContainer {
          width: ${app.size === "large" ? "50%" : "100%"};
          background: ${colors.foreground};
          justify-content: center;
          align-items: center;
          display: flex;
          flex-direction: column;
        }
        .inputPadding{
          padding: 20px;
          width: 100%;          
          justify-content: center;
          align-items: center;
          display: flex;
          flex-direction: column;
        }
        .tabs{
          display: flex;
          width: 100%;
        }
{/* STYLING FOR CREATE CATEGORY */}
      {/* .button {
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
          padding: 20px;
          background: ${colors.foreground};
          justify-content: center;
          align-items: center;
          display: flex;
          flex-direction: column;
        }
        .title {
          font-size: 20px;
          padding-bottom: 20px;
          text-align: center;
          color: ${colors.normalText};
        } */}


      `}</style>
    </>
  );
});

export default CreateCategory;
