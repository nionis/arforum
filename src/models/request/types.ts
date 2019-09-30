export interface ITag {
  name: string;
  value: string;
}

export interface ITx {
  id: string;
  tags?: ITag[];
}

export interface ITxNormalized {
  id: string;
  tags: {
    [key: string]: ITag;
  };
  content?: any;
}

export interface IRunOps {
  query: string;
  variables?: any;
  getTxs: (res: any) => ITx[];
  fetchContent?: boolean;
  type?: "text" | "json" | "binary";
  forceRefetch?: boolean;
}
