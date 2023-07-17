import { GridPaginationModel, GridSortModel } from '@mui/x-data-grid';

export interface AppQueryParam {
  pagination: GridPaginationModel;
  sorting: GridSortModel;
  searchText?: string;
}
