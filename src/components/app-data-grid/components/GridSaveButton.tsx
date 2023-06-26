import React from 'react';

import { Save } from '@mui/icons-material';
import { GridActionsCellItem, GridRowId } from '@mui/x-data-grid';

type GridSaveButtonProps = {
  rowId: GridRowId;
  onClick?: (rowId: GridRowId) => void;
  [k: string]: any;
};

const GridSaveButton = ({ rowId, onClick, ...rest }: GridSaveButtonProps) => {
  return (
    <GridActionsCellItem
      label="Save"
      icon={<Save color="primary" />}
      onClick={() => onClick && onClick(rowId)}
      {...rest}
    />
  );
};

export default GridSaveButton;
