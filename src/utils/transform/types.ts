import { ModelInstanceType } from "mobx-state-tree";
import { IParsedTimestamp } from "src/utils";

export type IRequiredTags = {
  "Content-Type": "text/plain" | "application/json";
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
  id?: string;
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
  C = string
> = (
  ops: IToTransactionOps<M, K>
) => ITransactionResult<T & IRequiredTags & IParsedTimestamp, C>;

export type IFromTransactionOps<
  M extends ModelInstanceType<any, any>,
  K extends keyof M,
  T,
  C = string
> = ReturnType<IToTransaction<M, K, T & { id: string; from: string }, C>>;

export type IFromTransaction<
  M extends ModelInstanceType<any, any>,
  K extends keyof M,
  T,
  C = string
> = (
  ops: IFromTransactionOps<M, K, T, C>
) => IToTransactionOps<M, K> & {
  id: string;
  from: string;
};
