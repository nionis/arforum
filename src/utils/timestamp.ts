export interface IParsedTimestamp {
  year: number;
  month: number;
  date: number;
  hours: number;
  minutes: number;
  seconds: number;
}

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
