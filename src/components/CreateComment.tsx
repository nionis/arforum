import { observer } from "mobx-react";
import { types, Instance, unprotect } from "mobx-state-tree";
import Button from "src/components/Button";
import PostModel from "src/models/Post";
import app from "src/stores/app";

interface ICreateComment {
  post: Instance<typeof PostModel>;
}

const store = types
  .model("CreateComment", {
    text: ""
  })
  .actions(self => {
    unprotect(self);

    return {};
  })
  .create();

const CreateComment = observer(({ post }: ICreateComment) => {
  const { colors } = app;

  return (
    <>
      <div className="container">
        <textarea
          placeholder="enter your comment"
          onChange={e => (store.text = e.target.value)}
          defaultValue={store.text}
        ></textarea>
        <div className="buttonContainer">
          <Button onClick={() => post.createComment(store.text)}>SUBMIT</Button>
        </div>
      </div>

      <style jsx>{`
        .container {
          display: flex;
          justify-content: flex-start;
          text-align: left;
          flex-direction: column;
          width: 100%;
          min-height: 10vh;
          background-color: ${colors.foreground};
          border: 1px solid ${colors.border};
        }

        .buttonContainer {
          display: flex;
          justify-content: flex-end;
          padding: 10px;
        }

        textarea {
          min-height: 80px;
          padding: 10px;
          border: none;
          resize: vertical;
          color: ${colors.normalText};
          background-color: ${colors.inputBackground};
          border-bottom: 1px solid ${colors.border};
        }
      `}</style>
    </>
  );
});

export default CreateComment;
