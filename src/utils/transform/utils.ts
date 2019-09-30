import { IParsedTimestamp, ICreatedAtTags, IUpdatedAtTags } from "./types";

export const fromMs = (ms: number): IParsedTimestamp => {
  const date = new Date(ms);

  return {
    year: date.getUTCFullYear(),
    month: date.getUTCMonth(),
    date: date.getUTCDate(),
    hours: date.getUTCHours(),
    minutes: date.getUTCMinutes(),
    seconds: date.getUTCSeconds()
  };
};

export const toMs = (data: IParsedTimestamp): number => {
  const date = new Date();

  date.setUTCFullYear(data.year);
  date.setUTCMonth(data.month);
  date.setUTCDate(data.date);
  date.setUTCHours(data.hours);
  date.setUTCMinutes(data.minutes);
  date.setUTCSeconds(data.seconds);

  return date.valueOf();
};

export const fromMsToCreatedAtTags = (ms: number): ICreatedAtTags => {
  const parsedCreatedAt = fromMs(ms);

  return {
    c_year: parsedCreatedAt.year,
    c_month: parsedCreatedAt.month,
    c_date: parsedCreatedAt.date,
    c_hours: parsedCreatedAt.hours,
    c_minutes: parsedCreatedAt.minutes,
    c_seconds: parsedCreatedAt.seconds
  };
};

export const fromMsToUpdatedAtTags = (ms: number): IUpdatedAtTags => {
  const parsedUpdatedAt = fromMs(ms);

  return {
    u_year: parsedUpdatedAt.year,
    u_month: parsedUpdatedAt.month,
    u_date: parsedUpdatedAt.date,
    u_hours: parsedUpdatedAt.hours,
    u_minutes: parsedUpdatedAt.minutes,
    u_seconds: parsedUpdatedAt.seconds
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
