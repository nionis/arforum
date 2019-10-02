import CircularProgress from "@material-ui/core/CircularProgress";
import app from "src/stores/app";
import { observer } from "mobx-react";

interface ILoadingProps {
  alwaysWhite?: boolean;
}

const Loading = observer(({ alwaysWhite }: ILoadingProps) => {
  const { colors } = app;

  return (
    <CircularProgress
      style={{
        color: `${alwaysWhite ? "white" : colors.normalText}`,
        width: "3vh",
        height: "3vh",
        margin: "1vh"
      }}
    />
  );
});

export default Loading;
