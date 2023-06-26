import SearchIcon from '@mui/icons-material/Search';
import {
  Card,
  CardContent,
  CardHeader,
  Divider,
  InputAdornment,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';
import { orderBy } from 'lodash';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import 'assets/styles/menu.scss';
import { Helmet } from 'react-helmet';
import useAuthControl from 'auth/authControl/useAuthControl';
import { NavigationGroup, NavigationItem } from '../menuItems';

const defaultUnauthorizedItem = {
  path: '#',
  title: 'You do not have access to view any forms in this category',
  icon: null,
};

interface MenuItemListProps {
  menuGroup: NavigationGroup;
  onClick: (navigationItem: NavigationItem) => void;
}

const MenuItemList = ({ menuGroup, onClick }: MenuItemListProps) => {
  const navigate = useNavigate();
  const { isValidRole } = useAuthControl();

  const [searchText, setSearchText] = useState('');
  const [menuItems, setMenuItems] = useState<NavigationItem[]>([]);

  useEffect(() => {
    const authorizedMenuItems = menuGroup.items?.filter((item) => isValidRole(item.allowedRoles || [])) ?? [];

    let items = authorizedMenuItems;
    const authorizeItemsLength = authorizedMenuItems.length;
    const isEmptyForm = authorizeItemsLength === 0;
    if (isEmptyForm) {
      items = [defaultUnauthorizedItem];
    } else {
      items = items.filter((x) => x.title.toLowerCase().includes(searchText.toLowerCase()));
    }

    setMenuItems(items);
  }, [menuGroup, searchText, isValidRole]);

  const sortedMenuItems = orderBy(menuItems, (item) => item.title);

  const onRowClick = (row: NavigationItem) => {
    if (isDefaultPath(row.path)) return;

    navigate(row.path);
    onClick(row);
  };

  return (
    <Card elevation={0} className="Menu">
      <CardHeader
        className="titleContainer"
        title={
          <Typography variant="h1" sx={{ paddingTop: '3px' }}>
            Forms: {menuGroup.title}
          </Typography>
        }
        action={
          <TextField
            onChange={(e) => setSearchText(e.target.value)}
            variant="outlined"
            placeholder="Search"
            size="small"
            sx={{ width: 305 }}
            InputProps={{
              className: 'searchInput',
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
        }
      />

      <Divider />

      <CardContent className="cardContent">
        <TableContainer>
          <Table sx={{ minWidth: 650 }}>
            <TableHead>
              <TableRow className="tbRowMenu">
                <TableCell className="tbHeadCellMenu">Form Name</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {sortedMenuItems.map((row) => (
                <TableRow
                  className="tbRowMenu"
                  hover={!isDefaultPath(row.path)}
                  onClick={() => onRowClick(row)}
                  key={row.path}
                  sx={{
                    cursor: isDefaultPath(row.path) ? 'default' : 'pointer',
                    '&:last-child td, &:last-child th': { border: 0 },
                  }}
                >
                  <TableCell className="tbCellMenu" component="th" scope="row">
                    <Link to={row.path} className="form-menu-item">
                      {row.title}
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>

      <Helmet>
        <title>{menuGroup.title}</title>
      </Helmet>
    </Card>
  );
};

const isDefaultPath = (path: string) => {
  return path === defaultUnauthorizedItem.path;
};

export default MenuItemList;
