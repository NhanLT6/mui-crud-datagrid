import React from 'react';

import { Box } from '@mui/system';

const CustomGridNoData = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
      }}
    >
      No results
    </Box>
  );
};

export default CustomGridNoData;
