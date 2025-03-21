import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  AppBar,
  Toolbar,
  IconButton,
  Alert,
  Snackbar,
  Card,
  CardContent,
  Grid,
  InputAdornment,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Avatar,
  Divider,
  useTheme,
  Tooltip,
  CircularProgress,
  Menu,
  MenuItem,
  Badge,
  Fade
} from '@mui/material';
import {
  Logout as LogoutIcon,
  Person as PersonIcon,
  Lock as LockIcon,
  Add as AddIcon,
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  Settings as SettingsIcon,
  Notifications as NotificationsIcon,
  Menu as MenuIcon,
  Search as SearchIcon,
  School as SchoolIcon
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { motion } from 'framer-motion';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip as RechartsTooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import axios from 'axios';
import Students from './Students';

// Styled components
const drawerWidth = 240;

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: 0,
    ...(open && {
      transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      marginLeft: drawerWidth,
    }),
  }),
);

const StyledAppBar = styled(AppBar, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    ...(open && {
      width: `calc(100% - ${drawerWidth}px)`,
      marginLeft: drawerWidth,
      transition: theme.transitions.create(['margin', 'width'], {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
    }),
  }),
);

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
  justifyContent: 'center',
}));

const StyledCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  borderRadius: 12,
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: '0 8px 25px rgba(0, 0, 0, 0.1)',
  },
}));

const StyledCardContent = styled(CardContent)(({ theme }) => ({
  flexGrow: 1,
  padding: theme.spacing(3),
}));

const StatCard = styled(Card)(({ theme, color }) => ({
  borderRadius: 12,
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
  background: `linear-gradient(135deg, ${color} 0%, ${color}99 100%)`,
  color: '#fff',
  transition: 'transform 0.3s ease',
  '&:hover': {
    transform: 'translateY(-5px)',
  },
}));

const StatCardContent = styled(CardContent)(({ theme }) => ({
  padding: theme.spacing(3),
}));

const SearchBar = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: 30,
    backgroundColor: theme.palette.background.paper,
    '& fieldset': {
      borderColor: 'transparent',
    },
    '&:hover fieldset': {
      borderColor: theme.palette.primary.light,
    },
    '&.Mui-focused fieldset': {
      borderColor: theme.palette.primary.main,
    },
  },
}));

// Mock data for charts
const studentData = [
  { name: 'Jan', count: 12 },
  { name: 'Feb', count: 19 },
  { name: 'Mar', count: 15 },
  { name: 'Apr', count: 27 },
  { name: 'May', count: 32 },
  { name: 'Jun', count: 24 },
];

const pieData = [
  { name: 'Active', value: 75 },
  { name: 'Inactive', value: 25 },
];

const COLORS = ['#2563eb', '#e5e7eb'];

function Dashboard() {
  const theme = useTheme();
  const [open, setOpen] = useState(true);
  const [newStudent, setNewStudent] = useState({ username: '', password: '' });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [notificationAnchorEl, setNotificationAnchorEl] = useState(null);
  const [currentPage, setCurrentPage] = useState('dashboard');

  const handleDrawerToggle = () => {
    setOpen(!open);
  };

  const handleAddStudent = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5000/admin/add-student', 
        newStudent,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      
      setMessage('Student added successfully!');
      setNewStudent({ username: '', password: '' });
      setError('');
      setShowSnackbar(true);
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to add student');
      setMessage('');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    window.location.href = '/';
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleNotificationOpen = (event) => {
    setNotificationAnchorEl(event.currentTarget);
  };

  const handleNotificationClose = () => {
    setNotificationAnchorEl(null);
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        when: "beforeChildren",
        staggerChildren: 0.1,
        duration: 0.3 
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { duration: 0.5 }
    }
  };

  // Check token validity when component mounts
  useEffect(() => {
    const checkTokenValidity = async () => {
      const token = localStorage.getItem('token');
      const role = localStorage.getItem('role');
      
      if (!token || role !== 'admin') {
        console.log('Invalid token or role, redirecting to login');
        handleLogout();
        return;
      }
      
      try {
        // Make a test request to verify token
        await axios.get('http://localhost:5000/admin/students', {
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        console.log('Token is valid');
      } catch (error) {
        console.error('Token validation error:', error);
        if (error.response && (error.response.status === 401 || error.response.status === 403)) {
          console.log('Token is invalid, redirecting to login');
          handleLogout();
        }
      }
    };
    
    checkTokenValidity();
  }, []);

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <StyledAppBar position="fixed" open={open} elevation={0} color="default">
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerToggle}
            edge="start"
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 0, display: { xs: 'none', sm: 'block' } }}>
            Admin Dashboard
          </Typography>
          
          <Box sx={{ flexGrow: 1, mx: 2, display: { xs: 'none', md: 'block' } }}>
            <SearchBar
              placeholder="Search students..."
              size="small"
              fullWidth
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon color="action" />
                  </InputAdornment>
                ),
              }}
            />
          </Box>
          
          <Box sx={{ flexGrow: 0 }}>
            <Tooltip title="Account settings">
              <IconButton 
                color="inherit" 
                onClick={handleMenuOpen}
                aria-controls="account-menu"
                aria-haspopup="true"
              >
                <Avatar sx={{ width: 32, height: 32, bgcolor: theme.palette.primary.main }}>A</Avatar>
              </IconButton>
            </Tooltip>
            <Menu
              id="account-menu"
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
              TransitionComponent={Fade}
              PaperProps={{
                elevation: 3,
                sx: { width: 200, borderRadius: 2 }
              }}
            >
              <MenuItem onClick={handleMenuClose}>
                <ListItemIcon>
                  <PersonIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="Profile" />
              </MenuItem>
              <MenuItem onClick={handleMenuClose}>
                <ListItemIcon>
                  <SettingsIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="Settings" />
              </MenuItem>
              <Divider />
              <MenuItem onClick={handleLogout}>
                <ListItemIcon>
                  <LogoutIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="Logout" />
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </StyledAppBar>
      
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            borderRight: 'none',
            boxShadow: '0 0 20px rgba(0, 0, 0, 0.05)',
          },
        }}
        variant="persistent"
        anchor="left"
        open={open}
      >
        <DrawerHeader>
          <Box sx={{ display: 'flex', alignItems: 'center', py: 2 }}>
            <SchoolIcon color="primary" sx={{ mr: 1 }} />
            <Typography variant="h6" color="primary" fontWeight="bold">
              NEET Admin
            </Typography>
          </Box>
        </DrawerHeader>
        <Divider />
        <List>
          <ListItem 
            button 
            selected={currentPage === 'dashboard'}
            onClick={() => setCurrentPage('dashboard')}
          >
            <ListItemIcon>
              <DashboardIcon color={currentPage === 'dashboard' ? "primary" : "inherit"} />
            </ListItemIcon>
            <ListItemText primary="Dashboard" />
          </ListItem>
          <ListItem 
            button 
            selected={currentPage === 'students'}
            onClick={() => setCurrentPage('students')}
          >
            <ListItemIcon>
              <PeopleIcon color={currentPage === 'students' ? "primary" : "inherit"} />
            </ListItemIcon>
            <ListItemText primary="Students" />
          </ListItem>
          <ListItem button>
            <ListItemIcon>
              <SettingsIcon />
            </ListItemIcon>
            <ListItemText primary="Settings" />
          </ListItem>
        </List>
        <Box sx={{ flexGrow: 1 }} />
        <Box sx={{ p: 2 }}>
          <Button
            variant="outlined"
            fullWidth
            startIcon={<LogoutIcon />}
            onClick={handleLogout}
          >
            Logout
          </Button>
        </Box>
      </Drawer>
      
      <Main open={open}>
        <DrawerHeader />
        
        {currentPage === 'dashboard' ? (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <Box sx={{ mb: 4 }}>
              <Typography variant="h4" fontWeight="bold" gutterBottom component={motion.h4} variants={itemVariants}>
                Welcome, Admin
              </Typography>
              <Typography variant="body1" color="textSecondary" component={motion.p} variants={itemVariants}>
                Manage your students and monitor system performance
              </Typography>
            </Box>
            
            <Grid container spacing={3}>
              {/* Stats Cards */}
              <Grid item xs={12} md={4} component={motion.div} variants={itemVariants}>
                <StatCard color={theme.palette.primary.main}>
                  <StatCardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Box>
                        <Typography variant="overline" sx={{ opacity: 0.8 }}>
                          Total Students
                        </Typography>
                        <Typography variant="h4" fontWeight="bold">
                          128
                        </Typography>
                        <Typography variant="body2" sx={{ mt: 1, opacity: 0.8 }}>
                          <span style={{ color: '#4ade80' }}>↑ 12%</span> from last month
                        </Typography>
                      </Box>
                      <Avatar sx={{ bgcolor: 'rgba(255, 255, 255, 0.2)', width: 56, height: 56 }}>
                        <PeopleIcon fontSize="large" />
                      </Avatar>
                    </Box>
                  </StatCardContent>
                </StatCard>
              </Grid>
              
              <Grid item xs={12} md={4} component={motion.div} variants={itemVariants}>
                <StatCard color={theme.palette.success.main}>
                  <StatCardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Box>
                        <Typography variant="overline" sx={{ opacity: 0.8 }}>
                          Active Students
                        </Typography>
                        <Typography variant="h4" fontWeight="bold">
                          96
                        </Typography>
                        <Typography variant="body2" sx={{ mt: 1, opacity: 0.8 }}>
                          <span style={{ color: '#4ade80' }}>↑ 8%</span> from last month
                        </Typography>
                      </Box>
                      <Avatar sx={{ bgcolor: 'rgba(255, 255, 255, 0.2)', width: 56, height: 56 }}>
                        <SchoolIcon fontSize="large" />
                      </Avatar>
                    </Box>
                  </StatCardContent>
                </StatCard>
              </Grid>
              
              <Grid item xs={12} md={4} component={motion.div} variants={itemVariants}>
                <StatCard color={theme.palette.info.main}>
                  <StatCardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Box>
                        <Typography variant="overline" sx={{ opacity: 0.8 }}>
                          New This Month
                        </Typography>
                        <Typography variant="h4" fontWeight="bold">
                          32
                        </Typography>
                        <Typography variant="body2" sx={{ mt: 1, opacity: 0.8 }}>
                          <span style={{ color: '#4ade80' }}>↑ 24%</span> from last month
                        </Typography>
                      </Box>
                      <Avatar sx={{ bgcolor: 'rgba(255, 255, 255, 0.2)', width: 56, height: 56 }}>
                        <AddIcon fontSize="large" />
                      </Avatar>
                    </Box>
                  </StatCardContent>
                </StatCard>
              </Grid>
              
              {/* Charts */}
              <Grid item xs={12} md={8} component={motion.div} variants={itemVariants}>
                <StyledCard>
                  <StyledCardContent>
                    <Typography variant="h6" fontWeight="bold" gutterBottom>
                      Student Enrollment Trends
                    </Typography>
                    <Typography variant="body2" color="textSecondary" gutterBottom>
                      Monthly student registration statistics
                    </Typography>
                    <Box sx={{ height: 300, mt: 2 }}>
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={studentData}
                          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                          <XAxis dataKey="name" stroke="#718096" />
                          <YAxis stroke="#718096" />
                          <RechartsTooltip 
                            contentStyle={{ 
                              backgroundColor: '#fff', 
                              border: 'none', 
                              borderRadius: 8,
                              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)'
                            }} 
                          />
                          <Bar 
                            dataKey="count" 
                            fill={theme.palette.primary.main} 
                            radius={[4, 4, 0, 0]}
                            barSize={40}
                          />
                        </BarChart>
                      </ResponsiveContainer>
                    </Box>
                  </StyledCardContent>
                </StyledCard>
              </Grid>
              
              <Grid item xs={12} md={4} component={motion.div} variants={itemVariants}>
                <StyledCard>
                  <StyledCardContent>
                    <Typography variant="h6" fontWeight="bold" gutterBottom>
                      Student Status
                    </Typography>
                    <Typography variant="body2" color="textSecondary" gutterBottom>
                      Active vs. Inactive students
                    </Typography>
                    <Box sx={{ height: 300, mt: 2, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={pieData}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={90}
                            paddingAngle={5}
                            dataKey="value"
                            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                            labelLine={false}
                          >
                            {pieData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <RechartsTooltip 
                            contentStyle={{ 
                              backgroundColor: '#fff', 
                              border: 'none', 
                              borderRadius: 8,
                              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)'
                            }} 
                          />
                        </PieChart>
                      </ResponsiveContainer>
                    </Box>
                  </StyledCardContent>
                </StyledCard>
              </Grid>
              
              {/* Add Student Form */}
              <Grid item xs={12} component={motion.div} variants={itemVariants}>
                <StyledCard>
                  <StyledCardContent>
                    <Typography variant="h6" fontWeight="bold" gutterBottom>
                      Add New Student
                    </Typography>
                    <Typography variant="body2" color="textSecondary" gutterBottom>
                      Create a new student account
                    </Typography>
                    
                    <Box component="form" onSubmit={handleAddStudent} sx={{ mt: 3 }}>
                      <Grid container spacing={2}>
                        <Grid item xs={12} md={5}>
                          <TextField
                            fullWidth
                            label="Username"
                            name="username"
                            value={newStudent.username}
                            onChange={(e) => setNewStudent({...newStudent, username: e.target.value})}
                            required
                            InputProps={{
                              startAdornment: (
                                <InputAdornment position="start">
                                  <PersonIcon color="action" />
                                </InputAdornment>
                              ),
                            }}
                          />
                        </Grid>
                        <Grid item xs={12} md={5}>
                          <TextField
                            fullWidth
                            label="Password"
                            name="password"
                            type="password"
                            value={newStudent.password}
                            onChange={(e) => setNewStudent({...newStudent, password: e.target.value})}
                            required
                            InputProps={{
                              startAdornment: (
                                <InputAdornment position="start">
                                  <LockIcon color="action" />
                                </InputAdornment>
                              ),
                            }}
                          />
                        </Grid>
                        <Grid item xs={12} md={2}>
                          <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            disabled={isLoading}
                            sx={{ height: '100%' }}
                            startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : <AddIcon />}
                          >
                            {isLoading ? 'Adding...' : 'Add Student'}
                          </Button>
                        </Grid>
                      </Grid>
                      
                      {error && (
                        <Alert severity="error" sx={{ mt: 2 }}>
                          {error}
                        </Alert>
                      )}
                    </Box>
                  </StyledCardContent>
                </StyledCard>
              </Grid>
            </Grid>
          </motion.div>
        ) : currentPage === 'students' ? (
          <Students />
        ) : null}
      </Main>
      
      <Snackbar
        open={showSnackbar}
        autoHideDuration={6000}
        onClose={() => setShowSnackbar(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={() => setShowSnackbar(false)}
          severity="success"
          variant="filled"
          sx={{ width: '100%' }}
        >
          {message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default Dashboard; 