import CustomGridNoData from '@/components/app-data-grid/components/CustomGridNoData';
import CustomGridPagination from '@/components/app-data-grid/components/CustomGridPagination';
import CustomGridToolbar from '@/components/app-data-grid/components/CustomGridToolbar';
import GridCancelButton from '@/components/app-data-grid/components/GridCancelButton';
import GridDeleteButton from '@/components/app-data-grid/components/GridDeleteButton';
import GridEditButton from '@/components/app-data-grid/components/GridEditButton';
import GridSaveButton from '@/components/app-data-grid/components/GridSaveButton';
import renderTextInputCell from '@/components/app-data-grid/components/input-components/GridTextField';
import { AppGridColDef } from '@/components/app-data-grid/types/AppGridColDef';
import { AppQueryParam } from '@/components/app-data-grid/types/AppQueryParam';
import { AppQueryResult } from '@/components/app-data-grid/types/AppQueryResult';
import { SxProps } from '@mui/material';
import {
  DataGrid,
  GridColDef,
  GridFeatureMode,
  GridPaginationModel,
  GridRowHeightParams,
  GridRowHeightReturnValue,
  GridRowId,
  GridRowIdGetter,
  GridRowModes,
  GridRowModesModel,
  GridRowParams,
  GridRowSelectionModel,
  GridSortModel,
  MuiEvent,
} from '@mui/x-data-grid';

import { isFunction } from 'lodash';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { ValidationError } from 'yup';

import './app-data-grid.scss';

interface AppDataGridProps {
  columns: AppGridColDef[];
  data: ((query: AppQueryParam) => Promise<AppQueryResult>) | Array<Record<string, any>>;
  getRowId?: GridRowIdGetter<any> | undefined;
  gridTitle?: React.ReactNode;

  showCheckboxSelection?: boolean;
  resetSelectionOnPageSizeChanged?: boolean;
  hideSelectAllButton?: boolean;
  singleCheckboxSelection?: boolean;
  onRowSelectionChange?: (rowSelectionModel: GridRowSelectionModel) => void;

  enableInlineEdit?: boolean;
  onAdd?: () => void;
  onEdit?: (model?: Record<string, any>) => void;
  onSave?: (model?: Record<string, any>) => void;
  onDelete?: (id: GridRowId) => void;

  onSortChange?: (model: GridSortModel) => void;

  onPaginationChange?: (model: GridPaginationModel) => void;

  enableSearch?: boolean;

  [k: string]: any; // Other props of MUI Data grid
}

const defaultPageSizeOptions = [10, 20, 50, 100];

const AppDataGrid = ({
  columns,
  data,
  getRowId,
  gridTitle,
  showCheckboxSelection,
  resetSelectionOnPageSizeChanged = true,
  hideSelectAllButton,
  singleCheckboxSelection,
  onRowSelectionChange,
  onSortChange,
  onPaginationChange,
  enableInlineEdit,
  onAdd,
  onEdit,
  onSave,
  onDelete,
  ...rest
}: AppDataGridProps) => {
  const gridMode: GridFeatureMode = isFunction(data) ? 'server' : 'client';

  const [isFetching, setIsFetching] = useState<boolean>(false);

  const [totalRows, setTotalRows] = useState<number>(0);
  const [rows, setRows] = useState<Array<Record<string, any>>>([]);

  const [selectedRowModel, setSelectedRowModel] = useState<GridRowSelectionModel>([]);

  const [sortModel, setSortModel] = useState<GridSortModel>([]);

  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
    page: 0,
    pageSize: 100,
  });

  const [searchText, setSearchText] = useState<string | undefined>('');

  const [rowModesModel, setRowModesModel] = useState<GridRowModesModel>({});

  // Fetch data from server
  useEffect(() => {
    const getData = async () => {
      if (isFunction(data)) {
        try {
          setIsFetching(true);

          const gridInitialState: AppQueryParam = {
            pagination: paginationModel,
            sorting: sortModel,
            searchText,
          };

          const response = await data(gridInitialState);

          setRows(response.rows);
          setTotalRows(response.resultCount);
        } catch (e) {
          console.log('Failed to get data', e);
        } finally {
          setIsFetching(false);
        }
      } else {
        setRows(data);
        setTotalRows(data.length);
      }
    };

    getData();
  }, [data, paginationModel, sortModel, searchText]);

  const onSortModelChange = (model: GridSortModel) => {
    onSortChange?.(model);
    setSortModel(model);
  };

  const onRowSelectionModelChange = (model: GridRowSelectionModel) => {
    const newValues = !singleCheckboxSelection ? model : model.filter((newId) => !selectedRowModel.includes(newId));
    console.log('newValues', newValues);

    onRowSelectionChange?.(newValues);
    setSelectedRowModel(newValues);
  };

  const onPaginationModelChange = (model: GridPaginationModel) => {
    // Reset selected rows before pageSize changed
    const isPageSizeChanged = model.pageSize !== paginationModel.pageSize;
    if (resetSelectionOnPageSizeChanged && isPageSizeChanged) {
      setSelectedRowModel([]);
    }

    onPaginationChange?.(model);

    setPaginationModel(model);
  };

  const onSearchChanged = (searchText: string | undefined) => {
    setSearchText(searchText);
  };

  const onRowEditStart = (params: GridRowParams, event: MuiEvent<React.SyntheticEvent>) => {
    event.defaultMuiPrevented = true;
  };

  const onRowEditStop = (params: GridRowParams, event: MuiEvent) => {
    event.defaultMuiPrevented = true;
  };

  const onRowModesModelChange = (newRowModesModel: GridRowModesModel) => {
    setRowModesModel(newRowModesModel);
  };

  const onEditRow = useCallback(
    (id: GridRowId) => () => {
      setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });

      const modelWithId = rows.map((r) => {
        const id = getRowId?.(r)?.toString() ?? '';

        return { id, model: r };
      });

      const model = modelWithId.find((m) => m.id === id.toString())?.model;
      onEdit?.(model);
    },
    [getRowId, onEdit, rowModesModel, rows],
  );

  const onSaveRow = useCallback(
    (id: GridRowId) => () => {
      setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });

      const modelWithId = rows.map((r) => {
        const id = getRowId?.(r)?.toString() ?? '';

        return { id, model: r };
      });

      const model = modelWithId.find((m) => m.id === id.toString())?.model;
      onSave?.(model);
    },
    [getRowId, onSave, rowModesModel, rows],
  );

  const onCancelRow = useCallback(
    (id: GridRowId) => () => {
      setRowModesModel({
        ...rowModesModel,
        [id]: { mode: GridRowModes.View, ignoreModifications: true },
      });
    },
    [rowModesModel],
  );

  const onDeleteRow = useCallback(
    (id: GridRowId) => () => {
      setRows(rows.filter((row) => row.id !== id));
      onDelete?.(id);
    },
    [onDelete, rows],
  );

  // Set some values for column to reduce boilerplate code when defining columns
  const transformedColumns = useMemo((): GridColDef[] => {
    const newColumns = columns.map((c) => {
      const newCol: GridColDef = {
        ...c,
        flex: c.flex ?? 1,
        editable: c.editable ?? true,
      };

      // Validate input if yupSchema has been defined
      if (enableInlineEdit && (c.type === undefined || c.type === 'string')) {
        newCol.cellClassName = 'align-bottom';
        newCol.renderEditCell = renderTextInputCell;
        newCol.preProcessEditCellProps = async (params) => {
          try {
            await c.yupSchema?.validate(params.props.value);
            return { ...params.props, error: '' };
          } catch (e) {
            const errorMessage = (e as ValidationError).errors[0];
            return { ...params.props, error: errorMessage };
          }
        };
      }

      return newCol;
    });

    // Add actions column when enableInlineEdit is true
    if (enableInlineEdit) {
      const actionColumn: GridColDef = {
        field: 'actions',
        type: 'actions',
        headerName: 'Actions',
        width: 100,
        getActions: ({ id }) => {
          const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;

          if (isInEditMode) {
            return [
              <GridSaveButton key="saveButton" rowId={id} onClick={onSaveRow(id)} />,
              <GridCancelButton key="cancelButton" rowId={id} onClick={onCancelRow(id)} />,
            ];
          }

          return [
            <GridEditButton key="editButton" rowId={id} onClick={onEditRow(id)} />,
            <GridDeleteButton key="deleteButton" rowId={id} onClick={onDeleteRow(id)} />,
          ];
        },
      };

      newColumns.push(actionColumn);
    }

    return newColumns;
  }, [columns, enableInlineEdit, onCancelRow, onDeleteRow, onEditRow, onSaveRow, rowModesModel]);

  const getRowHeight = (params: GridRowHeightParams): GridRowHeightReturnValue => {
    const editModels = Object.keys(rowModesModel)
      .map((key) => ({ id: key, mode: rowModesModel[key].mode }))
      .filter((item) => item.mode === GridRowModes.Edit);

    const editingRow = editModels.find((m) => m.id === params.id.toString());

    // return editingRow ? 80 : 52;

    return editingRow ? 'auto' : 52;
  };

  const gridSxProps: SxProps = {
    // Disable Select All button if needed
    '& .MuiDataGrid-columnHeaderCheckbox .MuiDataGrid-columnHeaderTitleContainer': {
      display: hideSelectAllButton ? 'none' : 'block',
    },
    // Disable border of selected cell
    '& .MuiDataGrid-cell:focus-within, & .MuiDataGrid-cell:focus': {
      outline: 'none !important',
    },
    '& .MuiDataGrid-columnHeader:focus-within, & .MuiDataGrid-columnHeader:focus': {
      outline: 'none !important',
    },
  };

  return (
    <DataGrid
      columns={transformedColumns}
      rows={rows}
      getRowId={getRowId}
      loading={isFetching}
      slots={{
        pagination: CustomGridPagination,
        noRowsOverlay: CustomGridNoData,
        noResultsOverlay: CustomGridNoData,
        toolbar: CustomGridToolbar,
      }}
      slotProps={{
        toolbar: { gridTitle, onAdd, onSearchChanged },
      }}
      sortingMode={gridMode}
      sortModel={sortModel}
      onSortModelChange={onSortModelChange}
      pagination
      paginationMode={gridMode}
      rowCount={totalRows}
      pageSizeOptions={defaultPageSizeOptions}
      paginationModel={paginationModel}
      onPaginationModelChange={onPaginationModelChange}
      checkboxSelection={showCheckboxSelection}
      rowSelectionModel={selectedRowModel}
      keepNonExistentRowsSelected
      hideFooterSelectedRowCount
      onRowSelectionModelChange={onRowSelectionModelChange}
      editMode="row"
      rowModesModel={rowModesModel}
      onRowModesModelChange={onRowModesModelChange}
      onRowEditStart={onRowEditStart}
      onRowEditStop={onRowEditStop}
      getRowHeight={getRowHeight}
      sx={gridSxProps}
      {...rest}
    />
  );
};

export default AppDataGrid;
