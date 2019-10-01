import { ModelInstanceType } from "mobx-state-tree";
import { IParsedTimestamp } from "src/utils";

export interface ICreatedAtTags {
  year: number;
  month: number;
  date: number;
  hours: number;
  minutes: number;
  seconds: number;
}

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
) => ITransactionResult<T & IRequiredTags & IParsedTimestamp, M[C]>;

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
