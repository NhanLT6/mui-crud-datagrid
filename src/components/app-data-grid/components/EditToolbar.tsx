import React from 'react';

import AddIcon from '@mui/icons-material/Add';
import { Button } from '@mui/material';
import { GridRowId, GridToolbarContainer, useGridApiContext } from '@mui/x-data-grid';

interface EditToolbarProps {
  onAdd: (id?: GridRowId) => void;
}

const EditToolbar = (props: EditToolbarProps) => {
  const { onAdd } = props;
  const apiRef = useGridApiContext();

  const handleButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    onAdd?.();
  };

  return (
    <GridToolbarContainer>
      <Button color="primary" variant="contained" disableElevation startIcon={<AddIcon />} onClick={handleButtonClick}>
        Add
      </Button>
    </GridToolbarContainer>
  );
};

export default EditToolbar;
