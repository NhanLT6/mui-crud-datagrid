import React from 'react';

import { Cancel } from '@mui/icons-material';
import { GridActionsCellItem, GridRowId } from '@mui/x-data-grid';

type GridCancelButtonProps = {
  rowId: GridRowId;
  onClick?: (rowId: GridRowId) => void;
  [k: string]: any;
};

const GridCancelButton = ({ rowId, onClick, ...rest }: GridCancelButtonProps) => {
  return (
    <GridActionsCellItem
      icon={<Cancel />}
      label="Cancel"
      className="textPrimary"
      color="inherit"
      onClick={() => onClick && onClick(rowId)}
      {...rest}
    />
  );
};

export default GridCancelButton;
