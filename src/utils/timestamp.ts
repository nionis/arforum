export interface IParsedTimestamp {
  YYYY: number;
  MM: number;
  d: number;
  H: number;
  m: number;
  s: number;
}

export const fromMs = (ms: number): IParsedTimestamp => {
  const date = new Date(ms);

  return {
    YYYY: date.getUTCFullYear(),
    MM: date.getUTCMonth(),
    d: date.getUTCDate(),
    H: date.getUTCHours(),
    m: date.getUTCMinutes(),
    s: date.getUTCSeconds()
  };
};

export const toMs = (data: IParsedTimestamp): number => {
  const date = new Date();

  date.setUTCFullYear(data.YYYY);
  date.setUTCMonth(data.MM);
  date.setUTCDate(data.d);
  date.setUTCHours(data.H);
  date.setUTCMinutes(data.m);
  date.setUTCSeconds(data.s);

  return date.valueOf();
};
