import { light, dark } from "src/utils/colors/colors";

export const getColors = (isDark: boolean) => (isDark ? dark : light);
