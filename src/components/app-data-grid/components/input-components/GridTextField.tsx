import { AppGridColDef } from '@/components/app-data-grid/types/AppGridColDef';

import { TextField } from '@mui/material';
import { GridColDef, GridRenderCellParams, useGridApiContext } from '@mui/x-data-grid';
import React, { ChangeEvent, useEffect, useState } from 'react';

import { ValidationError } from 'yup';

const GridTextField = ({ value: valueProp, field, id }: GridRenderCellParams<any, string>) => {
  const apiRef = useGridApiContext();

  const [value, setValue] = useState<string>(valueProp ?? '');
  const [error, setError] = useState<string>('');

  const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const newValue = event.target.value ?? '';
    const currentCol = apiRef.current?.getColumn(field);
    const yupSchema = (currentCol as AppGridColDef)?.yupSchema;

    try {
      yupSchema?.validateSync(newValue);
      setError(''); // Reset error message
    } catch (e) {
      const firstErrorMessage = (e as ValidationError).errors[0];
      setError(firstErrorMessage);
    }

    apiRef.current.setEditCellValue({ id, field, value: newValue, debounceMs: 200 });
    setValue(newValue);
  };

  useEffect(() => {
    setValue(valueProp ?? '');
  }, [valueProp]);

  return (
    <TextField
      value={value ?? ''}
      size="small"
      fullWidth
      variant="standard"
      error={!!error}
      helperText={error || ' '}
      sx={{ mt: 2, mx: 1 }}
      onChange={handleChange}
    />
  );
};

const renderTextInputCell: GridColDef['renderCell'] = (params: GridRenderCellParams<any, any, any>) => {
  return <GridTextField {...params} />;
};

export default renderTextInputCell;
