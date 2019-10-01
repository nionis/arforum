import app from "src/stores/app";
import { observer } from "mobx-react";

interface IInputProps {
  label: string;
  onClick?: () => any;
  disabled?: boolean;
  errorMessage?: string;
  multiline?: boolean;
}

const Input = observer(
  ({ label, onClick, disabled, errorMessage, multiline }: IInputProps) => {
    const { colors } = app;
    return (
      <>
        <div className="inputContainer">
          <div className="labelContainer">
            <div className={disabled ? "labelDisabled" : "label"}>{label}</div>
            <div className="errorMessage">
              {errorMessage ? errorMessage : null}
            </div>
          </div>
          {multiline ? (
            <textarea
              className={errorMessage ? "inputError" : null}
              disabled={disabled}
            />
          ) : (
            <input
              className={errorMessage ? "inputError" : null}
              type="text"
              disabled={disabled}
            />
          )}
        </div>
        <style jsx>{`
          input:disabled,
          textarea:disabled {
            cursor: not-allowed;
            background: ${colors.activeBackground};
          }
          input:focus,
          textarea:focus {
            border: 1px solid ${colors.accent};
          }
          .inputError {
            border: 1px solid ${colors.error};
          }
          input {
            padding: 5px;
            height: 45px;
            width: 100%;
            font-size: 14px;
            border: 1px solid ${colors.border};
            border-radius: 3px;
            background: ${colors.inputBackground};
          }
          textarea {
            padding: 5px;
            width: 100%;
            height: 150px;
            font-size: 14px;
            border: 1px solid ${colors.border};
            border-radius: 3px;
            background: ${colors.inputBackground};
          }
          .inputContainer {
            width: 100%;
            display: flex;
            flex-direction: column;
            padding-bottom: 2vh;
            color: ${colors.normalText};
          }
          .errorMessage {
            color: ${colors.error};
          }
          .labelContainer {
            padding: 2px;
            width: 100%;
            justify-content: space-between;
            display: flex;
          }
          .labelDisabled {
            color: ${colors.mutedText};
            cursor: not-allowed;
          }
          .label {
            color: ${colors.normalText};
          }
        `}</style>
      </>
    );
  }
);

export default Input;
