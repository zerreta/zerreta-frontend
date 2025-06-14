import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  List,
  Typography,
  Divider,
  IconButton,
  ListItem,
  ListItemIcon,
  ListItemText,
  Avatar,
  Badge,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  School as SchoolIcon, 
  People as PeopleIcon,
  Upload as UploadIcon,
  Logout as LogoutIcon,
  Notifications as NotificationsIcon,
  ChevronLeft as ChevronLeftIcon,
  QuestionAnswer as QuestionIcon,
  Person as PersonIcon,
  EmojiEvents as TrophyIcon,
  Assessment as AssessmentIcon
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import zerLogo from '../assets/zer-logo.png';

const drawerWidth = 260;

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  background: '#7445f8',
  color: 'white',
  boxShadow: '0 4px 20px rgba(116, 69, 248, 0.2)',
  zIndex: theme.zIndex.drawer + 1,
}));

const StyledDrawer = styled(Drawer)(({ theme }) => ({
  width: drawerWidth,
  flexShrink: 0,
  '& .MuiDrawer-paper': {
    width: drawerWidth,
    boxSizing: 'border-box',
    borderRight: 'none',
    boxShadow: '2px 0 20px rgba(0, 0, 0, 0.05)',
    overflowX: 'hidden',
  },
}));

const DrawerHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: theme.spacing(2, 3),
  background: '#7445f8',
  color: 'white',
  height: 64,
}));

const MenuItemContainer = styled(ListItem)(({ theme, active }) => ({
  padding: theme.spacing(1, 3),
  marginBottom: theme.spacing(0.5),
  borderRadius: '0 24px 24px 0',
  marginRight: theme.spacing(2),
  transition: 'all 0.3s ease',
  position: 'relative',
  background: active ? 'rgba(116, 69, 248, 0.08)' : 'transparent',
  '&:hover': {
    background: 'rgba(116, 69, 248, 0.05)',
  },
  '&::before': {
    content: '""',
    position: 'absolute',
    left: 0,
    top: '50%',
    transform: 'translateY(-50%)',
    width: active ? 4 : 0,
    height: '60%',
    background: '#7445f8',
    borderRadius: '0 4px 4px 0',
    transition: 'width 0.3s ease',
  },
}));

const StyledListItemIcon = styled(ListItemIcon)(({ active, theme }) => ({
  minWidth: 40,
  color: active ? '#7445f8' : 'rgba(0, 0, 0, 0.54)',
}));

const StyledListItemText = styled(ListItemText)(({ active, theme }) => ({
  '& .MuiTypography-root': {
    fontWeight: active ? 600 : 500,
    color: active ? '#7445f8' : 'rgba(0, 0, 0, 0.87)',
    fontSize: '0.95rem',
  },
}));

const menuItems = [
  { path: '/admin', label: 'Dashboard', icon: DashboardIcon },
  { path: '/admin/institutions', label: 'Institutions', icon: SchoolIcon },
  { path: '/admin/questions', label: 'NEET Questions', icon: QuestionIcon },
  { path: '/admin/grammar-questions', label: 'Grammar Questions', icon: QuestionIcon },
  { path: '/admin/aptitude-questions', label: 'Aptitude Questions', icon: QuestionIcon },
  { path: '/admin/student-levels', label: 'Student Levels', icon: SchoolIcon },
  { path: '/admin/student-points', label: 'Student N.POINTS', icon: TrophyIcon },
  { path: '/admin/student-data', label: 'Student Data', icon: PeopleIcon },
  { path: '/admin/test-history', label: 'Test History', icon: AssessmentIcon },
];

const AdminLayout = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    window.location.href = '/login';
  };

  const drawer = (
    <>
      <DrawerHeader>
        <Typography variant="h6" fontWeight="700">
          Student
        </Typography>
        <IconButton 
          size="small" 
          sx={{ color: 'white' }}
          onClick={handleDrawerToggle}
          display={{ xs: 'block', sm: 'none' }}
        >
          <ChevronLeftIcon />
        </IconButton>
      </DrawerHeader>
      <Divider />

      <Box sx={{ mt: 2 }}>
        <List>
          {menuItems.map((item) => (
            <MenuItemContainer
              button
              key={item.path}
              active={location.pathname === item.path}
              onClick={() => navigate(item.path)}
            >
              <StyledListItemIcon active={location.pathname === item.path}>
                <item.icon />
              </StyledListItemIcon>
              <StyledListItemText active={location.pathname === item.path} primary={item.label} />
            </MenuItemContainer>
          ))}
        </List>
      </Box>

      <Box sx={{ position: 'absolute', bottom: 0, width: '100%', p: 2 }}>
        <Divider sx={{ mb: 2 }} />
        <List>
          <MenuItemContainer
            button
            onClick={handleLogout}
          >
            <StyledListItemIcon>
              <LogoutIcon />
            </StyledListItemIcon>
            <StyledListItemText primary="Logout" />
          </MenuItemContainer>
        </List>
      </Box>
    </>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <StyledAppBar position="fixed">
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
            <img 
              src={zerLogo} 
              alt="Zerreta Logo" 
              style={{ 
                height: '36px', 
                marginRight: '10px' 
              }} 
            />
            <Typography variant="h6" component="div">
              ADMIN
            </Typography>
          </Box>
          <IconButton color="inherit">
            <PersonIcon />
          </IconButton>
        </Toolbar>
      </StyledAppBar>

      <Box component="nav">
        {/* Mobile drawer */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { width: drawerWidth, boxSizing: 'border-box', overflowX: 'hidden' },
          }}
        >
          {drawer}
        </Drawer>

        {/* Desktop drawer */}
        <StyledDrawer
          variant="permanent"
          sx={{ display: { xs: 'none', sm: 'block' } }}
          open
        >
          {drawer}
        </StyledDrawer>
      </Box>

      {/* Main content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          mt: 8, // Add space for the AppBar
          backgroundColor: '#f8f9fa',
          minHeight: '100vh',
          overflow: 'auto',
          overflowX: 'hidden'
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
};

export default AdminLayout;