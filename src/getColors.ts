interface IColors {
  error: string;
  vote: string;
  upvote: string;
  downvote: string;
  normalText: string;
  mutedText: string;
  border: string;
  accent: string;
  pageBackground: string;
  foreground: string;
  activeBackground: string;
  inputBackground: string;
  shadow: string;
}

const constants = {
  error: "#f5222d",
  vote: "#b6b6b6",
  upvote: "#f9920b",
  downvote: "#2e70ff"
};

const light: IColors = {
  ...constants,
  normalText: "#454f5b",
  mutedText: "#818e99",
  border: "#ebedf0",
  accent: "#1890ff",
  pageBackground: "#f4f6f8",
  foreground: "#ffffff",
  activeBackground: "#fafafa",
  inputBackground: "#fcfcfc",
  shadow: "rgba(0, 0, 0, 0.05)"
};

const dark: IColors = {
  ...constants,
  normalText: "#ffffff",
  mutedText: "#b0b8bf",
  border: "#333333",
  accent: "#33a0ff",
  pageBackground: "#1b1b1b",
  foreground: "#262626",
  activeBackground: "#333333",
  inputBackground: "#212121",
  shadow: "rgba(0, 0, 0, 0.4)"
};

const getColors = (isDark: boolean) => (isDark ? dark : light);

export default getColors;
