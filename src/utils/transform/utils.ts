import { fromMs, toMs } from "src/utils/timestamp";
import { ICreatedAtTags } from "./types";
import { appId, environment, version } from "src/env";

export const fromMsToCreatedAtTags = (ms: number): ICreatedAtTags => {
  const parsed = fromMs(ms);

  return {
    year: parsed.year,
    month: parsed.month,
    date: parsed.date,
    hours: parsed.hours,
    minutes: parsed.minutes,
    seconds: parsed.seconds
  };
};

export const toMsFromCreatedAtTags = (tags: ICreatedAtTags): number => {
  return toMs({
    year: tags.year,
    month: tags.month,
    date: tags.date,
    hours: tags.hours,
    minutes: tags.minutes,
    seconds: tags.seconds
  });
};

export const requiredTags = () => ({
  appId,
  environment,
  version
});
