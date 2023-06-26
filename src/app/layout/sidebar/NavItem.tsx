import { ListItemButton, ListItemIcon, ListItemText } from '@mui/material';

export const NavItem = (props: any) => {
  const { path, icon, title, selected, onClick, sx: sxFromProps, ...others } = props;

  return (
    <ListItemButton
      className="navItemContainer"
      onClick={onClick}
      selected={selected}
      sx={{
        py: 0,
        minHeight: 40,
        color: '#FFFFFF',
        '&:hover': {
          backgroundColor: 'action.menuItemHover',
          border: '1px solid #FFFFFF',
          borderRadius: '4px',
        },
        '&.Mui-selected': { backgroundColor: 'action.menuItemSelected', border: '1px solid #FFFFFF' },
        ...sxFromProps,
      }}
      {...others}
    >
      <ListItemIcon className="navIcon" sx={{ color: 'inherit', minWidth: 0 }}>
        {icon}
      </ListItemIcon>

      <ListItemText
        primary={title}
        primaryTypographyProps={{ fontSize: 16, fontWeight: 'medium', letterSpacing: '0.1px', lineHeight: '27px' }}
      />
    </ListItemButton>
  );
};
