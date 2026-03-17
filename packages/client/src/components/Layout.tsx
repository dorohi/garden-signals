import { type ReactNode } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';

import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import DashboardIcon from '@mui/icons-material/Dashboard';
import YardIcon from '@mui/icons-material/Yard';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import BugReportIcon from '@mui/icons-material/BugReport';
import PestControlIcon from '@mui/icons-material/PestControl';
import SettingsIcon from '@mui/icons-material/Settings';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import LogoutIcon from '@mui/icons-material/Logout';

import { useStore } from '../stores';

const DRAWER_WIDTH = 260;
const DRAWER_COLLAPSED_WIDTH = 72;

interface NavItem {
  label: string;
  path: string;
  icon: ReactNode;
}

const mainNavItems: NavItem[] = [
  { label: 'Сегодня', path: '/', icon: <DashboardIcon /> },
  { label: 'Мои сады', path: '/garden', icon: <YardIcon /> },
  { label: 'Каталог растений', path: '/catalog', icon: <MenuBookIcon /> },
  { label: 'Болезни', path: '/diseases', icon: <BugReportIcon /> },
  { label: 'Вредители', path: '/pests', icon: <PestControlIcon /> },
];

const Layout = observer(() => {
  const { uiStore, themeStore, authStore } = useStore();
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));

  const collapsed = isDesktop && uiStore.sidebarCollapsed;
  const drawerWidth = collapsed ? DRAWER_COLLAPSED_WIDTH : DRAWER_WIDTH;

  const handleNavClick = (path: string) => {
    navigate(path);
    if (!isDesktop) {
      uiStore.setSidebarOpen(false);
    }
  };

  const isSelected = (path: string) =>
    path === '/' ? location.pathname === '/' : location.pathname.startsWith(path);

  const renderNavItem = (item: NavItem) => (
    <Tooltip key={item.path} title={collapsed ? item.label : ''} placement="right">
      <ListItemButton
        selected={isSelected(item.path)}
        onClick={() => handleNavClick(item.path)}
        sx={{
          mx: 1,
          borderRadius: 2,
          minHeight: 48,
          justifyContent: collapsed ? 'center' : 'initial',
          px: collapsed ? 2 : 2.5,
          '&.Mui-selected': {
            bgcolor: 'primary.main',
            color: 'primary.contrastText',
            '&:hover': { bgcolor: 'primary.dark' },
            '& .MuiListItemIcon-root': { color: 'primary.contrastText' },
          },
        }}
      >
        <ListItemIcon
          sx={{
            minWidth: 0,
            mr: collapsed ? 0 : 2,
            justifyContent: 'center',
          }}
        >
          {item.icon}
        </ListItemIcon>
        {!collapsed && <ListItemText primary={item.label} />}
      </ListItemButton>
    </Tooltip>
  );

  const drawerContent = (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Logo + collapse toggle */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: collapsed ? 'center' : 'space-between',
          px: collapsed ? 1 : 2,
          py: 2,
          minHeight: 64,
        }}
      >
        {collapsed ? (
          <IconButton onClick={uiStore.toggleSidebarCollapsed} size="small">
            <MenuIcon />
          </IconButton>
        ) : (
          <>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <YardIcon color="primary" sx={{ fontSize: 32 }} />
              <Typography variant="h6" color="primary" fontWeight={700} noWrap>
                DachaCare
              </Typography>
            </Box>
            {isDesktop && (
              <IconButton onClick={uiStore.toggleSidebarCollapsed} size="small">
                <ChevronLeftIcon />
              </IconButton>
            )}
          </>
        )}
      </Box>

      <Divider />

      {/* Main navigation */}
      <List sx={{ flex: 1, py: 1 }}>
        {mainNavItems.map(renderNavItem)}
      </List>

      {/* Bottom section */}
      <Divider />
      <List sx={{ py: 1 }}>
        <Tooltip title={collapsed ? 'Настройки' : ''} placement="right">
          <ListItemButton
            selected={isSelected('/settings')}
            onClick={() => handleNavClick('/settings')}
            sx={{
              mx: 1,
              borderRadius: 2,
              minHeight: 48,
              justifyContent: collapsed ? 'center' : 'initial',
              px: collapsed ? 2 : 2.5,
            }}
          >
            <ListItemIcon sx={{ minWidth: 0, mr: collapsed ? 0 : 2, justifyContent: 'center' }}>
              <SettingsIcon />
            </ListItemIcon>
            {!collapsed && <ListItemText primary="Настройки" />}
          </ListItemButton>
        </Tooltip>

        <Tooltip title={collapsed ? (themeStore.mode === 'dark' ? 'Светлая тема' : 'Тёмная тема') : ''} placement="right">
          <ListItemButton
            onClick={themeStore.toggle}
            sx={{
              mx: 1,
              borderRadius: 2,
              minHeight: 48,
              justifyContent: collapsed ? 'center' : 'initial',
              px: collapsed ? 2 : 2.5,
            }}
          >
            <ListItemIcon sx={{ minWidth: 0, mr: collapsed ? 0 : 2, justifyContent: 'center' }}>
              {themeStore.mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
            </ListItemIcon>
            {!collapsed && (
              <ListItemText primary={themeStore.mode === 'dark' ? 'Светлая тема' : 'Тёмная тема'} />
            )}
          </ListItemButton>
        </Tooltip>

        <Tooltip title={collapsed ? 'Выйти' : ''} placement="right">
          <ListItemButton
            onClick={authStore.logout}
            sx={{
              mx: 1,
              borderRadius: 2,
              minHeight: 48,
              justifyContent: collapsed ? 'center' : 'initial',
              px: collapsed ? 2 : 2.5,
            }}
          >
            <ListItemIcon sx={{ minWidth: 0, mr: collapsed ? 0 : 2, justifyContent: 'center' }}>
              <LogoutIcon />
            </ListItemIcon>
            {!collapsed && <ListItemText primary="Выйти" />}
          </ListItemButton>
        </Tooltip>
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      {isDesktop ? (
        <Drawer
          variant="permanent"
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            transition: theme.transitions.create('width', {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.enteringScreen,
            }),
            '& .MuiDrawer-paper': {
              width: drawerWidth,
              boxSizing: 'border-box',
              overflowX: 'hidden',
              transition: theme.transitions.create('width', {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.enteringScreen,
              }),
            },
          }}
        >
          {drawerContent}
        </Drawer>
      ) : (
        <>
          <Box
            sx={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              zIndex: theme.zIndex.drawer + 1,
              bgcolor: 'background.paper',
              borderBottom: 1,
              borderColor: 'divider',
              display: 'flex',
              alignItems: 'center',
              px: 2,
              height: 56,
            }}
          >
            <IconButton edge="start" onClick={uiStore.toggleSidebar} sx={{ mr: 1 }}>
              <MenuIcon />
            </IconButton>
            <YardIcon color="primary" sx={{ mr: 1 }} />
            <Typography variant="h6" color="primary" fontWeight={700}>
              DachaCare
            </Typography>
          </Box>
          <Drawer
            variant="temporary"
            open={uiStore.sidebarOpen}
            onClose={() => uiStore.setSidebarOpen(false)}
            sx={{
              '& .MuiDrawer-paper': {
                width: DRAWER_WIDTH,
                boxSizing: 'border-box',
              },
            }}
            ModalProps={{ keepMounted: true }}
          >
            {drawerContent}
          </Drawer>
        </>
      )}

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: { xs: 1.5, sm: 2, md: 3 },
          mt: isDesktop ? 0 : '56px',
          width: isDesktop ? `calc(100% - ${drawerWidth}px)` : '100%',
          transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
          }),
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
});

export default Layout;
