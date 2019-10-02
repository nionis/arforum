import { observer } from "mobx-react";
import CircularProgress from "@material-ui/core/CircularProgress";
import app from "src/stores/app";

interface ILoadingProps {
  size?: string;
  alwaysWhite?: boolean;
}

const Loading = observer(({ size = "25px", alwaysWhite }: ILoadingProps) => {
  const { colors } = app;

  return (
    <CircularProgress
      style={{
        color: `${alwaysWhite ? "white" : colors.normalText}`,
        width: size,
        height: size
      }}
    />
  );
});

export default Loading;
