import * as React from 'react';

import MuiPagination from '@mui/material/Pagination';
import { TablePaginationProps } from '@mui/material/TablePagination';
import {
  GridPagination,
  gridFilteredTopLevelRowCountSelector,
  gridPageSizeSelector,
  useGridApiContext,
  useGridRootProps,
  useGridSelector,
} from '@mui/x-data-grid';

const getPageCount = (rowCount: number, pageSize: number): number => {
  if (pageSize > 0 && rowCount > 0) {
    return Math.ceil(rowCount / pageSize);
  }

  return 0;
};

const Pagination = ({
  page,
  onPageChange,
  className,
}: Pick<TablePaginationProps, 'page' | 'onPageChange' | 'className'>) => {
  const apiRef = useGridApiContext();
  const pageSize = useGridSelector(apiRef, gridPageSizeSelector);
  const visibleTopLevelRowCount = useGridSelector(apiRef, gridFilteredTopLevelRowCountSelector);
  const rootProps = useGridRootProps();

  const pageCount = getPageCount(rootProps.rowCount ?? visibleTopLevelRowCount, pageSize);

  return (
    <MuiPagination
      color="primary"
      showFirstButton
      showLastButton
      className={className}
      count={pageCount}
      page={page + 1}
      onChange={(event, newPage) => {
        onPageChange(event as any, newPage - 1);
      }}
    />
  );
};

const CustomPaginationGrid = (props: any) => <GridPagination ActionsComponent={Pagination} {...props} />;

export default CustomPaginationGrid;
