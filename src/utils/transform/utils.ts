import { fromMs, toMs } from "src/utils/timestamp";
import { ICreatedAtTags, IUpdatedAtTags } from "./types";
import { appId, environment, version } from "src/env";

export const fromMsToCreatedAtTags = (ms: number): ICreatedAtTags => {
  const parsed = fromMs(ms);

  return {
    c_year: parsed.year,
    c_month: parsed.month,
    c_date: parsed.date,
    c_hours: parsed.hours,
    c_minutes: parsed.minutes,
    c_seconds: parsed.seconds
  };
};

export const toMsFromCreatedAtTags = (tags: ICreatedAtTags): number => {
  return toMs({
    year: tags.c_year,
    month: tags.c_month,
    date: tags.c_date,
    hours: tags.c_hours,
    minutes: tags.c_minutes,
    seconds: tags.c_seconds
  });
};

export const toMsFromUpdatedAtTags = (tags: IUpdatedAtTags): number => {
  return toMs({
    year: tags.u_year,
    month: tags.u_month,
    date: tags.u_date,
    hours: tags.u_hours,
    minutes: tags.u_minutes,
    seconds: tags.u_seconds
  });
};

export const fromMsToUpdatedAtTags = (ms: number): IUpdatedAtTags => {
  const parsed = fromMs(ms);

  return {
    u_year: parsed.year,
    u_month: parsed.month,
    u_date: parsed.date,
    u_hours: parsed.hours,
    u_minutes: parsed.minutes,
    u_seconds: parsed.seconds
  };
};

export const requiredTags = () => ({
  appId,
  environment,
  version
});
