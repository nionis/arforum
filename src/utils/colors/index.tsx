import { light, dark } from "src/utils/colors/colors";

export { light, dark };
export const getColors = (isDark: boolean) => (isDark ? dark : light);
