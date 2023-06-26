import React from 'react';

import { GridRowId } from '@mui/x-data-grid';
import { GridApiCommunity } from '@mui/x-data-grid/internals';

// Remove selected row from AppDataGrid rows
export const deleteGridRow = (tableRef: React.MutableRefObject<GridApiCommunity>, rowId: GridRowId) => {
  const newRows = Array.from(tableRef.current?.getRowModels().entries())
    .filter(([id]) => id !== rowId)
    .map(([, row]) => row);

  tableRef.current?.setRows(newRows);
};
