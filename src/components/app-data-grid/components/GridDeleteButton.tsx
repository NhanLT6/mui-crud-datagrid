import { DeleteOutline } from '@mui/icons-material';
import { GridActionsCellItem, GridRowId } from '@mui/x-data-grid';
import React from 'react';

type GridEditButtonProps = {
  rowId: GridRowId;
  onClick?: (rowId: GridRowId) => void;
  [k: string]: any;
};

const GridDeleteButton = ({ rowId, onClick, ...rest }: GridEditButtonProps) => {
  return (
    <GridActionsCellItem
      icon={<DeleteOutline color="error" />}
      label="Delete"
      onClick={() => onClick && onClick(rowId)}
      {...rest}
    />
  );
};

export default GridDeleteButton;
