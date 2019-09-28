import { CSSProperties } from "react";
import { observer } from "mobx-react";
import app from "src/stores/app";

interface IBorder {
  children?: any;
  top?: boolean;
  right?: boolean;
  bottom?: boolean;
  left?: boolean;
  disabled?: boolean;
  color?: string;
  width?: string;
  style?: CSSProperties;
}

const Border = observer(
  ({
    children,
    top,
    right,
    bottom,
    left,
    disabled,
    color,
    width,
    style
  }: IBorder) => {
    const { colors } = app;
    color = color || colors.border;
    width = width || "1px";

    const all = [top, right, bottom, left].every(v => {
      return !v;
    });

    const getBorderStyle = (useBorder: boolean) => {
      if (disabled) return "none";

      if (useBorder) return `${width} solid ${color}`;
      return "none";
    };

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
