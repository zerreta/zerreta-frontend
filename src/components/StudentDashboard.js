import React, { useState } from 'react';
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
  Card,
  CardContent,
  Grid,
} from '@mui/material';
import {
  Menu as MenuIcon,
  ChevronRight as ChevronRightIcon,
  Dashboard as DashboardIcon,
  School as SchoolIcon,
  Assignment as AssignmentIcon,
  MenuBook as MenuBookIcon,
  Person as PersonIcon,
  Logout as LogoutIcon,
  Timeline as TimelineIcon,
  SmartToy as SmartToyIcon,
  EmojiEvents as EmojiEventsIcon,
  BookmarkBorder as BookmarkIcon,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import Progress from './Progress';
import Analytics from './Analytics';
import AIHelp from './AIHelp';
import Leaderboard from './Leaderboard';
import Resources from './Resources';

const drawerWidth = 240;

const sidebarItems = [
  { text: 'Home', icon: <DashboardIcon />, path: '/student-dashboard' },
  { text: 'Progress', icon: <TimelineIcon />, path: '/student-dashboard/progress' },
  { text: 'Analytics', icon: <SchoolIcon />, path: '/student-dashboard/analytics' },
  { text: 'Resources', icon: <BookmarkIcon />, path: '/student-dashboard/resources' },
  { text: 'AI Help', icon: <SmartToyIcon />, path: '/student-dashboard/ai-help' },
  { text: 'Leaderboard', icon: <EmojiEventsIcon />, path: '/student-dashboard/leaderboard' },
];

function StudentDashboard() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleNavigation = (path) => {
    navigate(path);
    setMobileOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    window.location.href = '/login';
  };

  const renderContent = () => {
    switch (location.pathname) {
      case '/student-dashboard/progress':
        return <Progress />;
      case '/student-dashboard/analytics':
        return <Analytics />;
      case '/student-dashboard/resources':
        return <Resources />;
      case '/student-dashboard/ai-help':
        return <AIHelp />;
      case '/student-dashboard/leaderboard':
        return <Leaderboard />;
      default:
        return (
          <Box>
            <Typography variant="h4" gutterBottom>
              Welcome back, Student!
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6} lg={4}>
                <Card sx={{ 
                  height: '100%',
                  transition: 'transform 0.3s',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: '0 6px 20px rgba(0,0,0,0.1)'
                  }
                }}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Upcoming Assignments
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      No upcoming assignments
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={6} lg={4}>
                <Card sx={{ 
                  height: '100%',
                  transition: 'transform 0.3s',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: '0 6px 20px rgba(0,0,0,0.1)'
                  }
                }}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Recent Courses
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      No recent courses
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={6} lg={4}>
                <Card 
                  sx={{ 
                    height: '100%',
                    cursor: 'pointer',
                    bgcolor: '#f5f9ff',
                    transition: 'transform 0.3s',
                    '&:hover': {
                      transform: 'translateY(-5px)',
                      boxShadow: '0 6px 20px rgba(0,0,0,0.1)'
                    }
                  }}
                  onClick={() => handleNavigation('/student-dashboard/resources')}
                >
                  <CardContent>
                    <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                      <BookmarkIcon sx={{ mr: 1 }} color="primary" />
                      Learning Resources
                    </Typography>
                    <Typography variant="body2">
                      Access video tutorials, study materials and more for NEET preparation.
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Box>
        );
    }
  };

  const drawer = (
    <div>
      <Toolbar>
        <Typography variant="h6" noWrap component="div">
          Student Portal
        </Typography>
        <IconButton onClick={() => setSidebarOpen(!sidebarOpen)} color="inherit">
          {sidebarOpen ? <MenuIcon /> : <ChevronRightIcon />}
        </IconButton>
      </Toolbar>
      <Divider />
      <List>
        {sidebarItems.map((item) => (
          <ListItem
            button
            key={item.text}
            onClick={() => handleNavigation(item.path)}
            selected={location.pathname === item.path}
            sx={{
              position: 'relative',
              background: location.pathname === item.path ? '#F5F5F5' : 'transparent',
              color: 'black',
              borderRadius: '8px',
              '&::before': {
                content: '""',
                position: 'absolute',
                left: 0,
                top: 0,
                bottom: 0,
                width: location.pathname === item.path ? '4px' : '0px',
                backgroundColor: '#00ADB5',
                transition: 'width 0.3s ease',
              },
              '&:hover': {
                background: '#F0F0F0',
                transform: 'scale(1.03)',
              },
              transition: 'all 0.3s ease',
            }}
          >
            <ListItemIcon sx={{ minWidth: '40px', color: 'black' }}>
              {item.icon}
            </ListItemIcon>
            <ListItemText primary={item.text} sx={{ color: 'black' }} />
          </ListItem>
        ))}
      </List>
      <Divider />
      <Box sx={{ position: 'absolute', bottom: 20, width: '100%' }}>
        <List>
          <ListItem button onClick={() => handleNavigation('/student-dashboard/profile')}>
            <ListItemIcon>
              <PersonIcon sx={{ color: 'black' }} />
            </ListItemIcon>
            <ListItemText primary="Profile" sx={{ color: 'black' }} />
          </ListItem>
          <ListItem button onClick={handleLogout}>
            <ListItemIcon>
              <LogoutIcon sx={{ color: 'black' }} />
            </ListItemIcon>
            <ListItemText primary="Logout" sx={{ color: 'black' }} />
          </ListItem>
        </List>
      </Box>
    </div>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
        }}
      >
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
          <Typography variant="h6" noWrap component="div">
            {sidebarItems.find(item => item.path === location.pathname)?.text || 'Home'}
          </Typography>
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{
          width: { sm: sidebarOpen ? drawerWidth : 80 },
          flexShrink: 0,
          background: '#FFFFFF',
          color: 'black',
          transition: 'width 0.3s ease',
          '& .MuiDrawer-paper': {
            width: sidebarOpen ? drawerWidth : 80,
            background: '#FFFFFF',
            color: 'black',
            transition: 'width 0.3s ease',
          },
        }}
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
        }}
      >
        <Toolbar />
        {renderContent()}
      </Box>
    </Box>
  );
}

export default StudentDashboard;