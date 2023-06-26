import { AnySchema } from 'yup';

import { GridColDef } from '@mui/x-data-grid';

export type AppGridColDef = GridColDef & {
  yupSchema?: AnySchema;
};
