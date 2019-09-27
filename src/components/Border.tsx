import { CSSProperties } from "react";
import { observer } from "mobx-react";
import app from "src/stores/app";

interface IBorder {
  children?: any;
  top?: boolean;
  right?: boolean;
  bottom?: boolean;
  left?: boolean;
  style?: CSSProperties;
}

const getBorderStyle = (useBorder: boolean) => {
  const { colors } = app;

  if (useBorder) return `1px solid ${colors.border}`;
  return "none";
};

const Border = observer(
  ({ children, top, right, bottom, left, style }: IBorder) => {
    const all = [top, right, bottom, left].every(v => {
      return !!v;
    });

    return (
      <>
        <div style={style}>{children}</div>

        <style jsx>{`
          div {
            border-top: ${getBorderStyle(all || top)};
            border-right: ${getBorderStyle(all || right)};
            border-bottom: ${getBorderStyle(all || bottom)};
            border-left: ${getBorderStyle(all || left)};
          }
        `}</style>
      </>
    );
  }
);

export default Border;
