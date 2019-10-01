import { ModelInstanceType } from "mobx-state-tree";

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

export type ITag<T = any> = T;

// tags type
export type ITags<T = any> = {
  [key: string]: ITag<T>;
};

// content type
export type IContent<T = any> = T;

// transaction result when fetching
export type ITransactionResult<T, C> = {
  // id: string;
  tags: T;
  content?: IContent<C>;
};

export type IToTransactionOps<
  M extends ModelInstanceType<any, any>,
  K extends keyof M
> = Pick<M, K>;

export type IToTransaction<
  M extends ModelInstanceType<any, any>,
  K extends keyof M,
  T,
  C extends keyof M
> = (
  ops: IToTransactionOps<M, K>
) => ITransactionResult<T & IRequiredTags & ITimestampTags, M[C]>;

export type IFromTransactionOps<
  M extends ModelInstanceType<any, any>,
  K extends keyof M,
  T,
  C extends keyof M
> = ReturnType<IToTransaction<M, K, T & { from: string }, C>>;

export type IFromTransaction<
  M extends ModelInstanceType<any, any>,
  K extends keyof M,
  T,
  C extends keyof M
> = (
  ops: IFromTransactionOps<M, K, T, C>
) => IToTransactionOps<M, K> & {
  from: string;
};
