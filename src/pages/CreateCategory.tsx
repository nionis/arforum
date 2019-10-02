import { observer } from "mobx-react";
import { types, unprotect } from "mobx-state-tree";
import Input from "src/components/Input";
import Button from "src/components/Button";
import app, { goto } from "src/stores/app";
import account from "src/stores/account";
import forum from "src/stores/forum";

const store = types
  .model("CreateCategory", {
    name: "",
    description: "",
    showErrors: false
  })
  .views(self => ({
    get valid() {
      return {
        name: self.name.length > 0 && self.name.length < 20,
        description: self.description.length < 200
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

    return {
      updateInput(key: "name" | "description", value: string) {
        self.showErrors = true;

        self[key] = value;
      },

      create() {
        if (!self.ok) return;

        forum.createCategory(self.name, self.description);
      }
    };
  })
  .create();

const CreateCategory = observer(() => {
  const { colors } = app;
  const disabled = !account.loggedIn || !store.ok;
  const nameError =
    store.showErrors && !store.valid.name
      ? "Enter name, max 20 characters"
      : null;
  const descriptionError =
    store.showErrors && !store.valid.description
      ? "Enter description, max 200 characters"
      : null;

  return (
    <>
      <div className="container">
        <div className="inputContainer">
          <div className="name">Create Category</div>
          <Input
            label="Name"
            value={store.name}
            onChange={e => store.updateInput("name", e.target.value)}
            error={nameError}
          />
          <Input
            multiline={true}
            label="Description"
            value={store.description}
            onChange={e => store.updateInput("description", e.target.value)}
            error={descriptionError}
          />
          <div className="button">
            <Button
              disabled={disabled}
              onClick={store.create}
              style={{ width: "100%", padding: "10px", height: "50px" }}
            >
              Create Category
            </Button>
          </div>
        </div>
      </div>

      <style jsx>{`
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

        .button {
          width: 70%;
        }

        .name {
          font-size: 20px;
          padding-bottom: 20px;
          text-align: center;
          color: ${colors.normalText};
        }
      `}</style>
    </>
  );
});

export default CreateCategory;
