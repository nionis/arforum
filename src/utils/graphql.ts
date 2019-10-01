import { appId, environment, version } from "src/env";

export const queryApp = `
  { name: "appId", value: "${appId}" }
  { name: "environment", value: "${environment}" }
  { name: "version", value: "${version}" }
`;

export const timestamps = `
  year: tagValue(tagName: "year")
  month: tagValue(tagName: "month")
  date: tagValue(tagName: "date")
  hours: tagValue(tagName: "hours")
  minutes: tagValue(tagName: "minutes")
  seconds: tagValue(tagName: "seconds")
`;
