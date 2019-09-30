import { observer } from "mobx-react";
import Border from "src/components/Border";

interface ITabs {
  children?: any[];
  direction?: "row" | "column";
  space?: string;
}

const Tabs = observer(({ children, direction = "row", space }: ITabs) => {
  const isRight = direction === "row";
  const isBottom = direction === "column";
  const spaceStyle = (() => {
    if (direction === "row") {
      return {
        marginLeft: space ? space : "none",
        marginRight: space ? space : "none"
      };
    } else {
      return {
        marginTop: space ? space : "none",
        marginBottom: space ? space : "none"
      };
    }
  })();

  children = children.filter(child => !!child);

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
                style={{
                  height: "100%",
                  ...spaceStyle
                }}
              />
            </>
          );
        }
      })}
    </>
  );
});

export default Tabs;
