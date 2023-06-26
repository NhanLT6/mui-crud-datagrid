import React, { useEffect } from 'react';

import { useMsal } from '@azure/msal-react';
import { first } from 'lodash';

import { Logout } from '@mui/icons-material';
import { Avatar, Box, IconButton, ListItemIcon, Menu, Stack, Typography } from '@mui/material';
import MenuItem from '@mui/material/MenuItem';

import { useGlobalContext } from 'shared/hooks/useGlobalContext';

const AccountMenu = () => {
  const { userName, userDisplayName, rest } = useGlobalContext();
  const { instance, accounts } = useMsal();

  const [profileDisplayName, setProfileDisplayName] = React.useState<string>('loading ...');
  const [profileLetterAva, setProfileLetterAva] = React.useState<string>('');

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  useEffect(() => {
    if (rest?.givenName) {
      const firstLetter = rest.givenName.substring(0, 1);

      let secondLetter: string;
      if (rest.surname) {
        secondLetter = rest.surname.substring(0, 1);
      } else {
        secondLetter = rest.givenName.substring(1, 1);
      }

      setProfileLetterAva(firstLetter.concat(secondLetter));
    } else {
      const val = userName || userDisplayName || 'NA';
      setProfileLetterAva(val.substring(0, 2));
    }

    if (userName) {
      setProfileDisplayName(userName);
    } else if (userDisplayName) {
      setProfileDisplayName(userDisplayName);
    } else {
      setProfileDisplayName('N/A');
    }
  }, [userName, userDisplayName, rest.givenName, rest.surname]);

  const openMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const closeMenu = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    const currentAccount = first(accounts);

    if (currentAccount) await instance.logoutRedirect({ account: currentAccount });
    else await instance.logoutRedirect();

    closeMenu();
  };

  return (
    <Box>
      <Stack direction="row" spacing={2}>
        <Typography sx={{ margin: 'auto' }} gutterBottom component="div" color="primary">
          {profileDisplayName}
        </Typography>

        <IconButton disableRipple onClick={openMenu}>
          <Avatar sx={{ backgroundColor: '#5BC0B5', fontSize: '20px' }}>{profileLetterAva}</Avatar>
        </IconButton>
      </Stack>

      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={closeMenu}
        onClick={closeMenu}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: 'visible',
            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
            mt: 1.5,
            '& .MuiAvatar-root': {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1,
            },
            '&:before': {
              content: '""',
              display: 'block',
              position: 'absolute',
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: 'background.paper',
              transform: 'translateY(-50%) rotate(45deg)',
              zIndex: 0,
            },
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem onClick={handleLogout}>
          <ListItemIcon>
            <Logout fontSize="small" />
          </ListItemIcon>
          Logout
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default AccountMenu;
