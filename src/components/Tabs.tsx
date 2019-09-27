import { CSSProperties } from "react";
import { observer } from "mobx-react";
import Border from "src/components/Border";

interface ITabs {
  children?: any[];
  color?: string;
  style?: CSSProperties;
}

const Tabs = observer((props: ITabs) => {
  const { children } = props;

  return (
    <>
      {children.map((child, i) => {
        const isLast = children.length - 1 === i;

        if (isLast) {
          return child;
        } else {
          return (
            <>
              {child}
              <Border right style={{ height: "100%" }} />
            </>
          );
        }
      })}
    </>
  );
});

export default Tabs;
