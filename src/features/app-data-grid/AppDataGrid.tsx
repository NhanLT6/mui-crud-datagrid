import React, { useCallback, useEffect, useMemo, useState } from 'react';

import { includes, isFunction } from 'lodash';
import { ValidationError } from 'yup';

import { Cancel, Edit, Save } from '@mui/icons-material';
import DeleteIcon from '@mui/icons-material/Delete';
import {
  DataGrid,
  GridActionsCellItem,
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

import renderTextInputCell from 'shared/components/app-data-grid/components/input-components/GridTextField';
import { AppGridColDef } from 'shared/components/app-data-grid/types/AppGridColDef';
import { AppQueryParam } from 'shared/components/app-data-grid/types/AppQueryParam';
import { AppQueryResult } from 'shared/components/app-data-grid/types/AppQueryResult';

import './app-data-grid.scss';

import CustomGridNoData from './components/CustomGridNoData';
import CustomGridPagination from './components/CustomGridPagination';
import EditToolbar from './components/EditToolbar';

interface AppDataGridProps {
  columns: AppGridColDef[];
  data: ((query: AppQueryParam) => Promise<AppQueryResult>) | Array<Record<string, any>>;

  getRowId?: GridRowIdGetter<any> | undefined;
  showCheckboxSelection?: boolean;
  resetSelectionOnPageSizeChanged?: boolean;
  hideSelectAllButton?: boolean;

  enableInlineEdit?: boolean;
  initialValues?: Record<string, any>;
  onAdd?: () => void;
  onEdit?: (id: GridRowId) => void;
  onDelete?: (id: GridRowId) => void;

  onSortChange?: (model: GridSortModel) => void;

  onPaginationChange?: (model: GridPaginationModel) => void;
  onRowSelectionChange?: (rowSelectionModel: GridRowSelectionModel) => void;

  [k: string]: any; // Other props of MUI Data grid
}

const defaultPageSizeOptions = [10, 20, 50, 100];

const AppDataGrid = ({
  columns,
  data,
  getRowId,
  showCheckboxSelection,
  hideSelectAllButton,
  onSortChange,
  onPaginationChange,
  onRowSelectionChange,
  resetSelectionOnPageSizeChanged = true,
  enableInlineEdit,
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
  }, [data, paginationModel, sortModel]);

  const onSortModelChange = (model: GridSortModel) => {
    onSortChange?.(model);
    setSortModel(model);
  };

  const onRowSelectionModelChange = (model: GridRowSelectionModel) => {
    onRowSelectionChange?.(model);
    setSelectedRowModel(model);
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

  const onRowEditStart = (params: GridRowParams, event: MuiEvent<React.SyntheticEvent>) => {
    event.defaultMuiPrevented = true;
  };

  const onRowEditStop = (params: GridRowParams, event: MuiEvent) => {
    event.defaultMuiPrevented = true;
  };

  const onRowModesModelChange = (newRowModesModel: GridRowModesModel) => {
    setRowModesModel(newRowModesModel);
  };

  const onAddRow = () => {
    console.log('Grid toolbar add');
  };

  const onEditRow = useCallback(
    (id: GridRowId) => () => {
      setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
    },
    [rowModesModel]
  );

  const onSaveRow = useCallback(
    (id: GridRowId) => () => {
      setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
    },
    [rowModesModel]
  );

  const onCancelRow = useCallback(
    (id: GridRowId) => () => {
      setRowModesModel({
        ...rowModesModel,
        [id]: { mode: GridRowModes.View, ignoreModifications: true },
      });
    },
    [rowModesModel]
  );

  const onDeleteRow = useCallback(
    (id: GridRowId) => () => {
      setRows(rows.filter((row) => row.id !== id));
    },
    [rows]
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
              <GridActionsCellItem key="saveButton" icon={<Save />} label="Save" onClick={onSaveRow(id)} />,
              <GridActionsCellItem
                key="cancelButton"
                icon={<Cancel />}
                label="Cancel"
                className="textPrimary"
                onClick={onCancelRow(id)}
                color="inherit"
              />,
            ];
          }

          return [
            <GridActionsCellItem
              key="editButton"
              icon={<Edit />}
              label="Edit"
              className="textPrimary"
              onClick={onEditRow(id)}
              color="inherit"
            />,
            <GridActionsCellItem
              key="deleteButton"
              icon={<DeleteIcon />}
              label="Delete"
              onClick={onDeleteRow(id)}
              color="inherit"
            />,
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

  return (
    <DataGrid
      columns={transformedColumns}
      rows={rows}
      getRowId={getRowId}
      loading={isFetching}
      slots={{
        pagination: CustomGridPagination,
        noRowsOverlay: CustomGridNoData,
        toolbar: enableInlineEdit ? EditToolbar : undefined,
      }}
      slotProps={{
        toolbar: { onAddRow },
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
      sx={{
        '& .MuiDataGrid-columnHeaderCheckbox .MuiDataGrid-columnHeaderTitleContainer': {
          display: hideSelectAllButton ? 'none' : 'block',
        },
      }}
      {...rest}
    />
  );
};

export default AppDataGrid;
