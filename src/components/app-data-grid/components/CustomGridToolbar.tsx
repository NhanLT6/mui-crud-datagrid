import { Clear, SearchOutlined } from '@mui/icons-material';
import React, { useState } from 'react';

import AddIcon from '@mui/icons-material/Add';
import { Box, Button, IconButton, InputAdornment, OutlinedInput } from '@mui/material';
import { GridRowId, GridToolbarContainer } from '@mui/x-data-grid';

interface CustomGridToolbarProps {
  title?: React.ReactNode;
  onAdd?: (id?: GridRowId) => void;
  enableSearch?: boolean;
  onSearchChanged?: (searchText?: string) => void;
}

const SearchField = ({ value, onChange }: { value?: string; onChange?: (searchText?: string) => void }) => {
  return (
    <OutlinedInput
      value={value}
      placeholder="Search..."
      size="small"
      startAdornment={
        <InputAdornment position="start">
          <SearchOutlined fontSize="small" />
        </InputAdornment>
      }
      endAdornment={
        <InputAdornment position="end">
          <IconButton
            size="small"
            disabled={!value}
            onClick={() => {
              return onChange?.('');
            }}
          >
            <Clear fontSize="small" />
          </IconButton>
        </InputAdornment>
      }
      sx={{ mr: 1 }}
      onChange={(event) => {
        onChange?.(event.target.value);
      }}
    />
  );
};

const CustomGridToolbar = ({ title, onAdd, enableSearch = true, onSearchChanged }: CustomGridToolbarProps) => {
  const [searchText, setSearchText] = useState<string | undefined>('');

  const handleAdd = () => {
    onAdd?.();
  };

  const handleSearchTextChanged = (searchText?: string) => {
    setSearchText(searchText);
    onSearchChanged?.(searchText);
  };

  return (
    <GridToolbarContainer>
      {title}

      <Box sx={{ display: 'flex', flexGrow: 1, justifyContent: 'flex-end' }}>
        {enableSearch && <SearchField value={searchText} onChange={handleSearchTextChanged} />}

        {onAdd && (
          <Button color="primary" variant="contained" disableElevation startIcon={<AddIcon />} onClick={handleAdd}>
            Add
          </Button>
        )}
      </Box>
    </GridToolbarContainer>
  );
};

export default CustomGridToolbar;
