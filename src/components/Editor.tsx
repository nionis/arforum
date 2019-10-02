import { observer } from "mobx-react";
import { EditorState } from "draft-js";
import { Editor as EditorDraft } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { light } from "src/utils";

interface IEditorProps {
  state: EditorState;
  onChange: (state: EditorState) => any;
}

const Editor = observer(({ state, onChange }: IEditorProps) => {
  return (
    <>
      <EditorDraft
        editorState={state}
        toolbar={{
          image: {
            uploadCallback: async file => {
              const url = URL.createObjectURL(file);

              return {
                data: {
                  link: url
                }
              };
            }
          }
        }}
        editorClassName="editor-editor"
        toolbarClassName="editor-toolbar"
        wrapperClassName="editor-wrapper"
        onEditorStateChange={onChange}
      />

      <style jsx global>{`
        .editor-editor {
          background-color: ${light.inputBackground};
          padding-left: 10px;
          padding-right: 10px;
          min-height: 300px;
        }

        .editor-toolbar {
          background-color: ${light.inputBackground};
        }

        .editor-wrapper {
          background-color: ${light.inputBackground};
        }
      `}</style>
    </>
  );
});

export default Editor;
