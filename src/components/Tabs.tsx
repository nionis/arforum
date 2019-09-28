import { observer } from "mobx-react";
import Border from "src/components/Border";

interface ITabs {
  children?: any[];
  direction?: "row" | "column";
}

const Tabs = observer(({ children, direction = "row" }: ITabs) => {
  const isRight = direction === "row";
  const isBottom = direction === "column";

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
              <Border
                right={isRight}
                bottom={isBottom}
                style={{ height: "100%" }}
              />
            </>
          );
        }
      })}
    </>
  );
});

export default Tabs;
