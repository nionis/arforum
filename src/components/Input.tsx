import { ChangeEvent } from "react";
import { observer } from "mobx-react";
import app from "src/stores/app";

interface IInputProps {
  label: string;
  onChange?: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => any;
  value?: string;
  disabled?: boolean;
  error?: string;
  multiline?: boolean;
}

const Input = observer(
  ({
    label,
    onChange,
    value = "",
    disabled,
    error,
    multiline
  }: IInputProps) => {
    const { colors } = app;

    return (
      <>
        <div className="inputContainer">
          <div className="labelContainer">
            <div className={disabled ? "labelDisabled" : "label"}>{label}</div>
            <div className="error">{error ? error : null}</div>
          </div>
          {multiline ? (
            <textarea
              className={error ? "inputError" : null}
              disabled={disabled}
              onChange={onChange}
              defaultValue={value}
            />
          ) : (
            <input
              className={error ? "inputError" : null}
              type="text"
              disabled={disabled}
              onChange={onChange}
              defaultValue={value}
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
            min-height: 80px;
            resize: vertical;
          }

          .inputContainer {
            width: 100%;
            display: flex;
            flex-direction: column;
            padding-bottom: 2vh;
            color: ${colors.normalText};
          }

          .error {
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
