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
  Slide,
  Zoom,
  Fade,
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
  Home as HomeIcon,
  AutoAwesome as PremiumIcon,
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import axiosInstance from './axios-config';
import zerLogo from '../assets/zer-logo.png';

const drawerWidth = 280;

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  color: 'white',
  boxShadow: '0 4px 20px rgba(102, 126, 234, 0.3)',
  zIndex: theme.zIndex.drawer + 1,
}));

const StyledDrawer = styled(Drawer)(({ theme }) => ({
  width: drawerWidth,
  flexShrink: 0,
  '& .MuiDrawer-paper': {
    width: drawerWidth,
    boxSizing: 'border-box',
    borderRight: 'none',
    background: 'linear-gradient(180deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    boxShadow: '2px 0 20px rgba(102, 126, 234, 0.2)',
    overflowX: 'hidden',
  },
}));

const DrawerHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: theme.spacing(2, 3),
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  color: 'white',
  height: 80,
  borderBottom: '1px solid rgba(255,255,255,0.1)'
}));

const MenuItemContainer = styled(ListItem)(({ theme, active }) => ({
  padding: theme.spacing(1.5, 3),
  marginBottom: theme.spacing(1),
  borderRadius: '0 30px 30px 0',
  marginRight: theme.spacing(2),
  transition: 'all 0.3s ease',
  position: 'relative',
  background: active ? 'rgba(255,255,255,0.15)' : 'transparent',
  '&:hover': {
    background: 'rgba(255,255,255,0.1)',
    transform: 'translateX(5px)',
  },
  '&::before': {
    content: '""',
    position: 'absolute',
    left: 0,
    top: '50%',
    transform: 'translateY(-50%)',
    width: active ? 6 : 0,
    height: '70%',
    background: '#FFD700',
    borderRadius: '0 6px 6px 0',
    transition: 'width 0.3s ease',
  },
}));

const StyledListItemIcon = styled(ListItemIcon)(({ active, theme }) => ({
  minWidth: 45,
  color: active ? '#FFD700' : 'rgba(255, 255, 255, 0.8)',
}));

const StyledListItemText = styled(ListItemText)(({ active, theme }) => ({
  '& .MuiTypography-root': {
    fontWeight: active ? 700 : 500,
    color: active ? '#FFD700' : 'rgba(255, 255, 255, 0.9)',
    fontSize: '1rem',
  },
}));

const neetMenuItems = [
  { text: 'NEET Dashboard', icon: <PsychologyIcon />, path: '/student-dashboard/neet' },
  { text: 'My Progress', icon: <SchoolIcon />, path: '/student-dashboard/neet/progress' },
  { text: 'Analytics', icon: <AnalyticsIcon />, path: '/student-dashboard/neet/analytics' },
  { text: 'Analytics Summary', icon: <AssessmentIcon />, path: '/student-dashboard/neet/analytics-summary' },
  { text: 'Resources', icon: <BookmarkIcon />, path: '/student-dashboard/neet/resources' },
  { text: 'Test History', icon: <AssignmentIcon />, path: '/student-dashboard/neet/test-history' },
  { text: 'AI Help', icon: <LightbulbIcon />, path: '/student-dashboard/neet/ai-help' },
  { text: 'Leaderboard', icon: <TrophyIcon />, path: '/student-dashboard/neet/leaderboard' }
];

const NEETLayout = () => {
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

  const handleGoToDashboard = () => {
    navigate('/student-dashboard');
  };

  const drawer = (
    <>
      <DrawerHeader>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <img 
            src={zerLogo} 
            alt="NEET Logo" 
            style={{ 
              height: '40px', 
              marginRight: '12px',
              filter: 'brightness(0) invert(1)'
            }} 
          />
          <Box>
            <Typography variant="h6" fontWeight="800" sx={{ fontSize: '1.1rem' }}>
              NEET PREPARATION
            </Typography>
          </Box>
        </Box>
        <IconButton 
          size="small" 
          sx={{ 
            color: 'white',
            '&:hover': {
              backgroundColor: 'rgba(255,255,255,0.1)',
            }
          }}
          onClick={handleDrawerToggle}
          display={{ xs: 'block', md: 'none' }}
        >
          <ChevronLeftIcon />
        </IconButton>
      </DrawerHeader>

      {/* Go to Dashboard Button */}
      <Box sx={{ p: 2, borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
        <Button
          variant="outlined"
          fullWidth
          startIcon={<HomeIcon />}
          onClick={handleGoToDashboard}
          sx={{ 
            color: 'white', 
            borderColor: 'rgba(255,255,255,0.3)', 
            borderRadius: 3,
            py: 1.5,
            fontWeight: 600,
            '&:hover': {
              borderColor: '#FFD700',
              backgroundColor: 'rgba(255, 215, 0, 0.1)',
              color: '#FFD700'
            }
          }}
        >
          Go to Dashboard
        </Button>
      </Box>

      <Box sx={{ mt: 2 }}>
        <List>
          {neetMenuItems.map((item) => (
            <React.Fragment key={item.text}>
              <MenuItemContainer
                button
                active={location.pathname === item.path}
                onClick={() => handleItemClick(item)}
              >
                <StyledListItemIcon active={location.pathname === item.path}>
                  {item.icon}
                </StyledListItemIcon>
                <StyledListItemText 
                  active={location.pathname === item.path} 
                  primary={item.text} 
                />
              </MenuItemContainer>
            </React.Fragment>
          ))}
        </List>
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
                height: '32px', 
                marginRight: '12px'
              }} 
            />
            <Typography variant="h5" component="div" sx={{ flexGrow: 0, mr: 2, fontWeight: 700 }}>
              Zerreta - Foundation for NEET & Science Excellence
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
                backgroundColor: 'rgba(255,255,255,0.1)',
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

        {/* Desktop drawer */}
        <StyledDrawer
          variant="permanent"
          sx={{ 
            display: { xs: 'none', md: 'block' }
          }}
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
          width: { md: `calc(100% - ${drawerWidth}px)` },
          mt: 8,
          background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
          minHeight: '100vh',
          overflowX: 'hidden',
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
};

export default NEETLayout; 