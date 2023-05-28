export interface AppQueryResult {
  resultCount: number;
  pageNumber: number;
  pageSize: number;
  rows: Array<Record<string, any>>;
}
