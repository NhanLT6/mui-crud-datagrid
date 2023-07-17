import AppDataGrid from '@/components/app-data-grid/AppDataGrid';
import { AppGridColDef } from '@/components/app-data-grid/types/AppGridColDef';
import { AppQueryParam } from '@/components/app-data-grid/types/AppQueryParam';
import { AppQueryResult } from '@/components/app-data-grid/types/AppQueryResult';
import { Box, Typography } from '@mui/material';
import { GridValueGetterParams, useGridApiRef } from '@mui/x-data-grid';
import React from 'react';

const TestDataGrid = () => {
  const columns: AppGridColDef[] = [
    { field: 'id', headerName: 'ID', width: 90 },
    {
      field: 'firstName',
      headerName: 'First name',
      width: 150,
      editable: true,
    },
    {
      field: 'lastName',
      headerName: 'Last name',
      width: 150,
      editable: true,
    },
    {
      field: 'age',
      headerName: 'Age',
      type: 'number',
      width: 110,
      editable: true,
    },
    {
      field: 'fullName',
      headerName: 'Full name',
      description: 'This column has a value getter and is not sortable.',
      sortable: false,
      width: 160,
      valueGetter: (params: GridValueGetterParams) => `${params.row.firstName || ''} ${params.row.lastName || ''}`,
    },
  ];

  const rawData = [
    { id: 1, lastName: 'Snow', firstName: 'Jon', age: 35 },
    { id: 2, lastName: 'Lannister', firstName: 'Cersei', age: 42 },
    { id: 3, lastName: 'Lannister', firstName: 'Jaime', age: 45 },
    { id: 4, lastName: 'Stark', firstName: 'Arya', age: 16 },
    { id: 5, lastName: 'Targaryen', firstName: 'Daenerys', age: null },
    { id: 6, lastName: 'Melisandre', firstName: null, age: 150 },
    { id: 7, lastName: 'Clifford', firstName: 'Ferrara', age: 44 },
    { id: 8, lastName: 'Frances', firstName: 'Rossini', age: 36 },
    { id: 9, lastName: 'Roxie', firstName: 'Harvey', age: 65 },
  ];

  const data = (query: AppQueryParam): Promise<AppQueryResult> => {
    const result = rawData
      .filter((item) =>
        query.searchText ? JSON.stringify(item).toLowerCase().includes(query.searchText.toLowerCase()) : true,
      )
      .slice(query.pagination.page, (query.pagination.page + 1) * query.pagination.pageSize);

    return Promise.resolve({
      resultCount: result.length,
      pageNumber: query.pagination.page + 1,
      pageSize: query.pagination.pageSize,
      rows: result,
    });
  };

  const apiRef = useGridApiRef();

  return (
    <div>
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Typography variant="h3" sx={{ mb: 2 }}>
          MUI CRUD DataGrid
        </Typography>
      </Box>

      <Box sx={{ height: 600 }}>
        <AppDataGrid
          apiRef={apiRef}
          columns={columns}
          data={data}
          title={<Typography variant="h4">CRUD table</Typography>}
          enableInlineEdit
          onAdd={() => console.log('Add')}
        />
      </Box>
    </div>
  );
};

export default TestDataGrid;
