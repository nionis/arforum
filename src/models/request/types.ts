export type IFetchResult<T extends { [key: string]: any }> = {
  id: string;
  content?: any;
} & T;

export interface IRunOps {
  query: any;
  contentType: "text/plain" | "application/json";
  forceRefetch?: boolean;
}

export interface ITransactionOps {
  txIdCb?: (id: string) => any;
  target?: string;
  quantity?: string;
  reward?: string;
}
