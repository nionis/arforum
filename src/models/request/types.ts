export type IFetchResult<T extends { [key: string]: any }> = {
  id: string;
  content?: any;
} & T;

export interface IRunOps<T = any> {
  query: string;
  variables?: any;
  getData: (res: any) => IFetchResult<T>;
  fetchContent?: boolean;
  type?: "text" | "json" | "binary";
  forceRefetch?: boolean;
}
