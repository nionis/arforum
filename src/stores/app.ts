import App from "src/models/App";
import { getClientSize } from "src/utils";

const app = App.create(getClientSize());

export default app;
