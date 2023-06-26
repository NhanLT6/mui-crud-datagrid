import { Edit } from '@mui/icons-material';
import { GridActionsCellItem, GridRowId } from '@mui/x-data-grid';
import React from 'react';

type GridEditButtonProps = {
  rowId: GridRowId;
  onClick?: (rowId: GridRowId) => void;
  [k: string]: any;
};

const GridEditButton = ({ rowId, onClick, ...rest }: GridEditButtonProps) => {
  return (
    <GridActionsCellItem
      label="Edit"
      icon={<Edit color="primary" />}
      onClick={() => onClick && onClick(rowId)}
      {...rest}
    />
  );
};

export default GridEditButton;
