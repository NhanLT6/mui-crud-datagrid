import {
  Alert,
  Box,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Snackbar,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import { NavItem } from './NavItem';
import { menuGroupItems, NavigationGroup } from 'app/menuItems';
import logo from 'assets/images/logo.png';
import 'assets/styles/sidebar.scss';
import CameraStAloneModal from 'shared/components/camera/CameraStAloneModal';
import useDialog from 'shared/hooks/useDialog';
import React, { useCallback, useState } from 'react';
import NavItemGroup from './NavItemGroup';

interface SideBarProps {
  open?: boolean;
  onClose: any;
  menuGroup?: NavigationGroup;
  onSelectMenuGroup: (group: NavigationGroup) => void;
}

export const SideBar = ({ menuGroup, onClose, onSelectMenuGroup, open }: SideBarProps) => {
  const theme = useTheme();
  const dialog = useDialog();
  const lgUp = useMediaQuery(theme.breakpoints.up('lg'), { defaultMatches: true });

  const [openAlert, setOpenAlert] = useState(false);

  const handleClose = (event: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpenAlert(false);
  };

  const openDetailModal = () => {
    dialog
      .show(CameraStAloneModal, {
        title: 'Camera',
        isCloseAfterUpload: false,
        onOpenAlert: setOpenAlert,
      })
      .then((result: any) => {});
  };

  const getMenuItems = useCallback(() => {
    return menuGroupItems.map((group) => {
      // Render Accordion
      if (group.subGroups) {
        return <NavItemGroup key={group.id} items={group} onClick={onSelectMenuGroup} />;
      }

      // Render ListItem
      return (
        <NavItem
          onClick={() => onSelectMenuGroup(group)}
          key={group.id}
          icon={group.icon}
          title={group.title}
          selected={group.id === menuGroup?.id}
        />
      );
    });
  }, [menuGroup?.id, onSelectMenuGroup]);

  return (
    <Drawer
      anchor="left"
      onClose={lgUp ? () => {} : onClose}
      open={open}
      PaperProps={{
        sx: {
          border: 'none',
          bgcolor: 'background.sidebar',
          color: 'common.white',
          width: 256,
          ...(lgUp ? {} : { zIndex: (theme) => theme.zIndex.appBar + 100 }),
        },
      }}
      variant={lgUp ? 'permanent' : 'temporary'}
      className="Sidebar"
    >
      <Snackbar
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        open={openAlert}
        autoHideDuration={6000}
        onClose={handleClose}
      >
        <Alert onClose={handleClose} severity="success" sx={{ width: '100%' }}>
          Image uploaded successfully!
        </Alert>
      </Snackbar>

      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          backgroundSize: 'cover',
          height: '100%',
        }}
        className="leftSidebar"
      >
        <Box className="logo" component="img" src={logo} sx={{ width: '100%' }}></Box>

        <List
          className="formCategory"
          sx={{ flexGrow: 1 }}
          subheader={
            // SideBar Header
            <Typography display="block" className="formCategoryLabel" gutterBottom>
              FORM CATEGORIES
            </Typography>
          }
        >
          {/* SideBar items */}
          {getMenuItems()}

          {/* Camera */}
          <ListItemButton
            className="navItemContainer"
            onClick={() => openDetailModal()}
            sx={{
              py: 0,
              minHeight: 40,
              color: '#FFFFFF',
              '&:hover': {
                backgroundColor: 'action.menuItemHover',
                border: '1px solid #FFFFFF',
                borderRadius: '4px',
              },
              '&.Mui-selected': { backgroundColor: 'action.menuItemSelected' },
            }}
          >
            <ListItemIcon className="navIcon" sx={{ color: 'inherit', minWidth: 0 }}>
              <PhotoCameraIcon />
            </ListItemIcon>

            <ListItemText
              primary={'Camera'}
              primaryTypographyProps={{
                fontSize: 16,
                fontWeight: 'medium',
                letterSpacing: '0.1px',
                lineHeight: '27px',
              }}
            />
          </ListItemButton>
        </List>
      </Box>
    </Drawer>
  );
};

export default SideBar;
