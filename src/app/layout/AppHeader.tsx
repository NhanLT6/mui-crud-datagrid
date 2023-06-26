import React from 'react';

import MenuIcon from '@mui/icons-material/Menu';
import { AppBar, Box, IconButton, Toolbar } from '@mui/material';

import AccountMenu from './AccountMenu';

export const AppHeader = (props: any) => {
  const { onSidebarOpen, ...other } = props;

  return (
    <Box
      component={AppBar}
      sx={{
        left: {
          lg: '256px',
        },
        width: {
          lg: 'calc(100% - 256px)',
        },
        backgroundColor: 'background.paper',
        boxShadow: 1,
      }}
      {...other}
    >
      <Toolbar
        variant="dense"
        disableGutters
        sx={{
          left: 0,
          px: 2,
        }}
      >
        <IconButton
          onClick={onSidebarOpen}
          sx={{
            display: {
              xs: 'inline-flex',
              lg: 'none',
            },
          }}
        >
          <MenuIcon fontSize="small" />
        </IconButton>

        <Box sx={{ flexGrow: 1 }} />

        <AccountMenu />
      </Toolbar>
    </Box>
  );
};

export default AppHeader;
