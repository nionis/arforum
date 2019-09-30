export interface IParsedTimestamp {
  year: number;
  month: number;
  date: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export interface ICreatedAtTags {
  c_year: number;
  c_month: number;
  c_date: number;
  c_hours: number;
  c_minutes: number;
  c_seconds: number;
}

export interface IUpdatedAtTags {
  u_year: number;
  u_month: number;
  u_date: number;
  u_hours: number;
  u_minutes: number;
  u_seconds: number;
}

export type ITimestampTags = ICreatedAtTags & IUpdatedAtTags;

export type IRequiredTags = {
  "Content-Type": "application/json" | any;
  appId: string;
  environment: string;
  version: string;
};

export type ITags = {
  [key: string]: any;
};

export type ITransactionObject<T extends ITags> = { tags: T; content?: any };

export type IToTransaction<I, T extends ITags> = (
  ops: I
) => ITransactionObject<T>;

export type IFromTransaction<T extends ITags, O> = (
  ops: ITransactionObject<T>
) => O;
