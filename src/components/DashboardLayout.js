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
  Popover,
  Paper,
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
  BookmarkBorder as BookmarkIcon,
  RecordVoiceOver as SpeakyIcon,
  Calculate as AptiIcon,
  Extension as ExtrasIcon,
  Code as CodeIcon,
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import axiosInstance from './axios-config';
import zerLogo from '../assets/zer-logo.png';
import { useSidebar } from '../context/SidebarContext';

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
    background: 'transparent',
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
  { 
    text: 'Skills', 
    icon: <ExtrasIcon />, 
    path: '/student-dashboard/skills',
    subItems: [
      { text: 'Speaky', icon: <SpeakyIcon />, path: '/student-dashboard/speaky' },
      { text: 'Codezy', icon: <CodeIcon />, path: '/student-dashboard/codezy' },
      { text: 'Apti', icon: <AptiIcon />, path: '/student-dashboard/apti' }
    ]
  },
  { 
    text: 'Curriculum', 
    icon: <MenuBookIcon />, 
    path: '/student-dashboard/curriculum'
  },
  { 
    text: 'Career Guidance', 
    icon: <AssignmentIcon />, 
    path: '/student-dashboard/career-guidance'
  },
  { 
    text: 'NEET', 
    icon: <PsychologyIcon />, 
    path: '/student-dashboard/neet'
  }
];

const DashboardLayout = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userData, setUserData] = useState({ name: 'Loading...' });
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const { mainSidebarVisible } = useSidebar();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;

        const response = await axiosInstance.get('/student/profile');
        
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

  const handleItemClick = (item) => {
    navigate(item.path);
    if (mobileOpen) {
      setMobileOpen(false);
    }
  };

  const drawer = (
    <>
      <DrawerHeader>
        <Typography variant="h6" fontWeight="700">
          ZERRETA LEARNINGS
        </Typography>
        <IconButton 
          size="small" 
          sx={{ 
            color: 'white',
            '&:hover': {
              backgroundColor: 'transparent',
            }
          }}
          onClick={handleDrawerToggle}
          display={{ xs: 'block', md: 'none' }}
        >
          <ChevronLeftIcon />
        </IconButton>
      </DrawerHeader>
      <Divider />

      <Box sx={{ mt: 2 }}>
        <List>
          {menuItems.map((item) => (
            <React.Fragment key={item.text}>
              <MenuItemContainer
                button
                active={location.pathname === item.path || 
                  (item.subItems && item.subItems.some(subItem => location.pathname === subItem.path))}
                onClick={() => handleItemClick(item)}
              >
                <StyledListItemIcon active={location.pathname === item.path || 
                  (item.subItems && item.subItems.some(subItem => location.pathname === subItem.path))}>
                  {item.icon}
                </StyledListItemIcon>
                <StyledListItemText 
                  active={location.pathname === item.path || 
                    (item.subItems && item.subItems.some(subItem => location.pathname === subItem.path))} 
                  primary={item.text} 
                />
              </MenuItemContainer>
            </React.Fragment>
          ))}
        </List>
      </Box>

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
              background: 'transparent',
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
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <img 
              src={zerLogo} 
              alt="Zerreta Logo" 
              style={{ 
                height: '36px', 
                marginRight: '10px' 
              }} 
            />
            <Typography variant="h6" component="div" sx={{ flexGrow: 0, mr: 2 }}>
              ZERRETA LEARNINGS
            </Typography>
          </Box>
          
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ 
              mr: 2, 
              display: { md: 'none' },
              '&:hover': {
                backgroundColor: 'transparent',
              }
            }}
          >
            <MenuIcon />
          </IconButton>
          
          <Box sx={{ flexGrow: 1 }} />
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
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': { width: drawerWidth, boxSizing: 'border-box', overflowX: 'hidden' },
          }}
        >
          {drawer}
        </Drawer>

        {/* Desktop drawer - respect the mainSidebarVisible state */}
        <StyledDrawer
          variant="permanent"
          sx={{ 
            display: { 
              xs: 'none', 
              md: mainSidebarVisible ? 'block' : 'none' 
            } 
          }}
          open
        >
          {drawer}
        </StyledDrawer>
      </Box>

      {/* Main content - adjust based on sidebar visibility */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { 
            md: mainSidebarVisible ? `calc(100% - ${drawerWidth}px)` : '100%' 
          },
          mt: 8,
          backgroundColor: '#f8f9fa',
          minHeight: '100vh',
          overflowX: 'hidden',
          transition: 'width 0.3s ease'
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
};

export default DashboardLayout; 