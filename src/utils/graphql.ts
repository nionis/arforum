import { appId, environment, version } from "src/env";

export const queryApp = `
  { name: "appId", value: "${appId}" }
  { name: "environment", value: "${environment}" }
  { name: "version", value: "${version}" }
`;

export const timestamps = `
  YYYY: tagValue(tagName: "YYYY")
  MM: tagValue(tagName: "MM")
  d: tagValue(tagName: "d")
  H: tagValue(tagName: "H")
  m: tagValue(tagName: "m")
  s: tagValue(tagName: "s")
`;
