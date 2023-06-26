import { useMsal } from '@azure/msal-react';
import { Alert, Snackbar } from '@mui/material';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import { useTheme } from '@mui/material/styles';
import { menuGroupItems, NavigationGroup, NavigationItem } from 'app/menuItems';
import { loginRequest } from 'auth/authConfig';
import { callMsGraph } from 'auth/graph';
import jwt_decode from 'jwt-decode';
import { useCallback, useMemo } from 'react';
import * as React from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { EmployeeViewModel, StoreViewModel } from 'shared/api/generatedApi';
import { initAxios } from 'shared/api/http';
import { sidebarWidth, toolbarHeight } from 'shared/constants/appSettings';
import { AppGlobalContext } from 'shared/hooks/useGlobalContext';
import AppHeader from './AppHeader';
import MenuItemList from './MenuItemList';
import SideBar from './sidebar';

export const AppContainer = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const theme = useTheme();
  const { instance, accounts } = useMsal();

  const [isSidebarOpen, setSidebarOpen] = React.useState(false);
  const [menuGroup, setMenuGroup] = React.useState<NavigationGroup | undefined>(undefined);
  const [menuItem, setMenuItem] = React.useState<NavigationItem>();
  const [employeeList, setEmployeeList] = React.useState<EmployeeViewModel[]>([]);
  const [stores, setStores] = React.useState<StoreViewModel[]>([]);
  const [salvageStores, setSalvageStores] = React.useState<StoreViewModel[]>([]);
  const [greStores, setGreStores] = React.useState<StoreViewModel[]>([]);
  const [fixedAssetsStores, setFixedAssetsStores] = React.useState<StoreViewModel[]>([]);
  const [lossControlStores, setLossControlStores] = React.useState<StoreViewModel[]>([]);
  const [kaizenStores, setKaizenStores] = React.useState<StoreViewModel[]>([]);
  const [graphData, setGraphData] = React.useState({} as any);
  const [errors, setErrors] = React.useState<string[]>([]);
  const [account, setAccount] = React.useState<IAccountInfo>();

  const handleClose = (error: string) => {
    setErrors(errors.filter((x) => x !== error));
  };

  React.useEffect(() => {
    initAxios(setErrors);
  }, []);

  const navigationGroups = useMemo(() => menuGroupItems.flatMap((g) => (g.subGroups ? g.subGroups : g)), []);

  React.useEffect(() => {
    navigationGroups.forEach((group) => {
      if (`#${group.id}` === location.hash) {
        setMenuItem(undefined);
        setMenuGroup(group);
      } else {
        const item = group.items?.find((item) => window.location.pathname.startsWith(item.path));
        if (item) {
          setMenuGroup(group);
          setMenuItem(item);
        }
      }
    });
  }, [location.hash, navigationGroups]);

  React.useEffect(() => {
    instance
      .acquireTokenSilent({
        ...loginRequest,
        account: accounts[0],
      })
      .then((response) => {
        callMsGraph(response.accessToken).then((response) => setGraphData(response));
        serializeAccount(response.accessToken);
      });
  }, [accounts, instance]);

  const onBack = useCallback(
    (backPath = '') => {
      if (backPath) {
        navigate(backPath);
        return;
      }

      const group = navigationGroups.find((group) =>
        group.items?.find((item) => window.location.pathname.startsWith(item.path))
      );

      const menuGroupId = group?.id || navigationGroups[0].id;
      navigate(`/#${menuGroupId}`);
    },
    [navigate, navigationGroups]
  );

  const serializeAccount = (accessToken: string) => {
    const payload: any = jwt_decode(accessToken);
    const account = {
      firstName: payload.given_name,
      lastName: payload.family_name,
    } as IAccountInfo;
    setAccount(account);
  };

  const appContextValue = useMemo(
    () => ({
      onBack,
      employeeList,
      setEmployeeList,
      stores,
      setStores,
      salvageStores,
      setSalvageStores,
      greStores,
      setGreStores,
      fixedAssetsStores,
      setFixedAssetsStores,
      lossControlStores,
      setLossControlStores,
      kaizenStores,
      setKaizenStores,
      userName: graphData ? graphData.mail : '',
      userDisplayName: graphData ? graphData.displayName : '',
      firstName: account?.firstName || '',
      lastName: account?.lastName || '',
      rest: graphData,
      errors,
      setErrors,
    }),
    [
      account?.firstName,
      account?.lastName,
      employeeList,
      errors,
      fixedAssetsStores,
      graphData,
      greStores,
      kaizenStores,
      lossControlStores,
      onBack,
      salvageStores,
      stores,
    ]
  );

  const onSideBarGroupClicked = (group: NavigationGroup) => {
    setSidebarOpen(false);
    navigate(`/#${group.id}`);
  };

  return (
    <>
      <AppGlobalContext.Provider value={appContextValue}>
        <Box
          sx={{
            display: 'flex',
            flex: '1 1 auto',
            maxWidth: '100%',
            paddingTop: `${toolbarHeight}px`,
            [theme.breakpoints.up('lg')]: {
              paddingLeft: `${sidebarWidth + 7}px`,
            },
            bgColor: 'grey.100',
            minHeight: '100vh',
          }}
        >
          <Box
            component={Paper}
            sx={{
              display: 'flex',
              flex: '1 1 auto',
              flexDirection: 'column',
              width: '100%',
              padding: '17px 17px 17px 18px',
              margin: '18px 14px',
            }}
          >
            {menuGroup && !menuItem && <MenuItemList menuGroup={menuGroup} onClick={setMenuItem} />}
            {menuItem && <Outlet />}
          </Box>
        </Box>

        <AppHeader onSidebarOpen={() => setSidebarOpen(true)} />

        <SideBar
          onClose={() => setSidebarOpen(false)}
          open={isSidebarOpen}
          menuGroup={menuGroup}
          onSelectMenuGroup={onSideBarGroupClicked}
        />

        {errors.map((error) => (
          <Snackbar
            key={error}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            open={Boolean(error)}
            autoHideDuration={3000}
            onClose={() => handleClose(error)}
          >
            <Alert onClose={() => handleClose(error)} severity="error" sx={{ width: '100%' }}>
              {error}
            </Alert>
          </Snackbar>
        ))}
      </AppGlobalContext.Provider>
    </>
  );
};

interface IAccountInfo {
  firstName: string;
  lastName: string;
}
