import React, { useState, useEffect } from 'react';
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
  Button,
  useTheme,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  AccountCircle as AccountCircleIcon,
  SmartToy as SmartToyIcon,
  Timeline as TimelineIcon,
  EmojiEvents as EmojiEventsIcon,
  Notifications as NotificationsIcon,
  Logout as LogoutIcon,
  ChevronLeft as ChevronLeftIcon,
  Assessment as AssessmentIcon,
  Person as PersonIcon,
  Assignment as AssignmentIcon,
  School as SchoolIcon,
  Analytics as AnalyticsIcon,
  MenuBook as MenuBookIcon,
  Lightbulb as LightbulbIcon,
  EmojiEvents as TrophyIcon,
  Psychology as PsychologyIcon,
  Settings as SettingsIcon
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import axios from 'axios';
import axiosInstance from './axios-config';

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
  { text: 'Dashboard', icon: <DashboardIcon />, path: '/student-dashboard' },
  { text: 'My Progress', icon: <SchoolIcon />, path: '/student-dashboard/progress' },
  { text: 'Analytics', icon: <AnalyticsIcon />, path: '/student-dashboard/analytics' },
  { text: 'AI Summary', icon: <PsychologyIcon />, path: '/student-dashboard/analytics-summary' },
  { text: 'AI Help', icon: <LightbulbIcon />, path: '/student-dashboard/ai-help' },
  { text: 'Leaderboard', icon: <TrophyIcon />, path: '/student-dashboard/leaderboard' },
  { 
    text: 'Other Options', 
    icon: <MenuBookIcon />, 
    path: '/student-dashboard/other-options',
    subItems: [
      { text: 'Take Tests', icon: <AssignmentIcon />, path: '/student-dashboard/test' },
      { text: 'Study Materials', icon: <MenuBookIcon />, path: '/student-dashboard/study' }
    ]
  }
];

// Settings and system menu items
const systemMenuItems = [
  { text: 'Connection Test', icon: <SettingsIcon />, path: '/test-connection' },
];

const DashboardLayout = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userData, setUserData] = useState({ name: 'Loading...' });
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;

        const response = await axios.get(`/student/profile`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        if (response.data) {
          setUserData({ name: response.data.name || 'Student' });
          console.log('User data loaded:', response.data);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        setUserData({ name: 'Student' });
      }
    };

    fetchUserData();
  }, []);

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
          ZERRETA LEARNINGS
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
                {item.icon}
              </StyledListItemIcon>
              <StyledListItemText active={location.pathname === item.path} primary={item.text} />
            </MenuItemContainer>
          ))}
        </List>
      </Box>
      
      <Divider sx={{ mt: 2, mb: 1 }} />
      <Typography variant="caption" color="text.secondary" sx={{ px: 3, py: 1, display: 'block' }}>
        System
      </Typography>
      
      <List>
        {systemMenuItems.map((item) => (
          <MenuItemContainer
            button
            key={item.path}
            active={location.pathname === item.path}
            onClick={() => navigate(item.path)}
          >
            <StyledListItemIcon active={location.pathname === item.path}>
              {item.icon}
            </StyledListItemIcon>
            <StyledListItemText active={location.pathname === item.path} primary={item.text} />
          </MenuItemContainer>
        ))}
      </List>

      <Box sx={{ position: 'absolute', bottom: 0, width: '100%', p: 2 }}>
        <Divider sx={{ mb: 2 }} />
        <MenuItemContainer
          button
          active={location.pathname === '/student-dashboard/profile'}
          onClick={() => navigate('/student-dashboard/profile')}
          sx={{ mb: 2 }}
        >
          <StyledListItemIcon active={location.pathname === '/student-dashboard/profile'}>
            <PersonIcon />
          </StyledListItemIcon>
          <StyledListItemText active={location.pathname === '/student-dashboard/profile'} primary="My Profile" />
        </MenuItemContainer>
        <Button
          variant="outlined"
          fullWidth
          startIcon={<LogoutIcon />}
          onClick={handleLogout}
          sx={{ 
            color: '#7445f8', 
            borderColor: '#7445f8', 
            borderRadius: 8,
            '&:hover': {
              borderColor: '#5c33d4',
              background: 'rgba(116, 69, 248, 0.05)',
            }
          }}
        >
          Logout
        </Button>
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
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            ZERRETA LEARNINGS
          </Typography>
          <IconButton color="inherit" sx={{ mr: 2 }}>
            <Badge badgeContent={3} color="error">
              <NotificationsIcon />
            </Badge>
          </IconButton>
          <Button 
            color="inherit"
            startIcon={<Avatar sx={{ width: 28, height: 28 }} src="/student-avatar.jpg" />}
            sx={{ textTransform: 'none' }}
          >
            {userData.name || 'User'}
          </Button>
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
            '& .MuiDrawer-paper': { width: drawerWidth, boxSizing: 'border-box' },
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
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
};

export default DashboardLayout; 