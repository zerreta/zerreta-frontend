import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Container, 
  Grid, 
  Paper, 
  Typography, 
  Card, 
  CardContent, 
  CardHeader,
  Avatar,
  IconButton,
  Divider,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  LinearProgress,
  Tabs,
  Tab,
  Badge,
  Chip,
  useTheme,
  CircularProgress
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { 
  MenuBook, 
  Assignment, 
  Event, 
  Star,
  Timeline,
  Science,
  ArrowForward,
  CheckCircle,
  Schedule,
  CalendarMonth,
  EmojiEvents as TrophyIcon
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import axios from 'axios';
import axiosInstance from '../components/axios-config';

// Styled components
const StyledCard = styled(Card)(({ theme }) => ({
  height: '100%',
  borderRadius: 12,
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
  overflow: 'hidden',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: '0 8px 25px rgba(0, 0, 0, 0.1)',
  }
}));

const ProgressBar = styled(LinearProgress)(({ theme, value }) => ({
  height: 8,
  borderRadius: 5,
  backgroundColor: 'rgba(116, 69, 248, 0.1)',
  '& .MuiLinearProgress-bar': {
    backgroundColor: '#7445f8',
  }
}));

const StatCard = styled(Card)(({ theme, bgcolor }) => ({
  height: '100%',
  borderRadius: 12,
  background: bgcolor || '#7445f8',
  color: 'white',
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
}));

const ActionButton = styled(Button)(({ theme }) => ({
  background: '#7445f8',
  color: 'white',
  borderRadius: 8,
  textTransform: 'none',
  padding: theme.spacing(1, 3),
  '&:hover': {
    background: '#5c33d4',
  }
}));

const TabPanel = (props) => {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ pt: 2 }}>{children}</Box>}
    </div>
  );
};

const StudentDashboard = () => {
  const theme = useTheme();
  const [tabValue, setTabValue] = useState(0);
  const [studentData, setStudentData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [nPoints, setNPoints] = useState(0);

  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axiosInstance.get('/student/profile');
        
        setStudentData(response.data);
        
        // Calculate N.POINTS based on levels cleared
        if (response.data.subjects) {
          const { physics, chemistry, botany, zoology } = response.data.subjects;
          
          // Convert level strings to numbers and subtract 1 (since level 1 means 0 levels cleared)
          const physicsLevel = parseInt(physics.level) - 1;
          const chemistryLevel = parseInt(chemistry.level) - 1;
          const botanyLevel = parseInt(botany.level) - 1;
          const zoologyLevel = parseInt(zoology.level) - 1;
          
          // Sum up the levels cleared (ensure they're not negative)
          const totalLevelsCleared = 
            Math.max(0, physicsLevel) + 
            Math.max(0, chemistryLevel) + 
            Math.max(0, botanyLevel) + 
            Math.max(0, zoologyLevel);
          
          // Calculate N.POINTS (25 points per level cleared)
          setNPoints(totalLevelsCleared * 25);
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching student data:', error);
        setLoading(false);
      }
    };
    
    fetchStudentData();
  }, []);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  // Mock data for the dashboard
  const courses = [
    { id: 1, title: 'Physics NEET Preparation', progress: 65, instructor: 'Dr. Sharma', lastAccessed: '2 hours ago', icon: <Science sx={{ color: '#7445f8' }} /> },
    { id: 2, title: 'Biology Mastery', progress: 82, instructor: 'Dr. Patel', lastAccessed: 'Yesterday', icon: <MenuBook sx={{ color: '#7445f8' }} /> },
    { id: 3, title: 'Chemistry Crash Course', progress: 38, instructor: 'Prof. Rajan', lastAccessed: '3 days ago', icon: <Science sx={{ color: '#7445f8' }} /> },
  ];

  const announcements = [
    { id: 1, title: 'Live Session: Physics Problem Solving', date: 'Tomorrow, 4:00 PM', description: 'Join our expert for an interactive problem-solving session.' },
    { id: 2, title: 'Mock Test Scheduled', date: 'Saturday, 10:00 AM', description: 'Prepare for the all-India mock test scheduled for this weekend.' },
    { id: 3, title: 'New Study Materials Uploaded', date: 'Just now', description: 'Check out the new biology notes and practice worksheets.' },
  ];

  const upcomingEvents = [
    { id: 1, title: 'Physics Live Class', date: 'Today, 6:00 PM', subject: 'Physics' },
    { id: 2, title: 'Biology Quiz', date: 'Tomorrow, 11:00 AM', subject: 'Biology' },
    { id: 3, title: 'Chemistry Doubt Clearing', date: 'Friday, 4:00 PM', subject: 'Chemistry' },
  ];

  const recentActivities = [
    { id: 1, title: 'Completed Biology Module 4', time: '2 hours ago', icon: <CheckCircle sx={{ color: '#4caf50' }} /> },
    { id: 2, title: 'Started Physics Mock Test', time: 'Yesterday', icon: <Assignment sx={{ color: '#2196f3' }} /> },
    { id: 3, title: 'Attended Chemistry Live Class', time: '2 days ago', icon: <Schedule sx={{ color: '#ff9800' }} /> },
  ];

  return (
    <Box>
      {/* Stats Row */}
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={4}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <StatCard bgcolor="#7445f8">
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Timeline sx={{ fontSize: 40, opacity: 0.8 }} />
                  <Typography variant="h3" fontWeight="bold">
                    78%
                  </Typography>
                </Box>
                <Typography variant="body2" sx={{ opacity: 0.8 }}>
                  Overall Progress
                </Typography>
              </CardContent>
            </StatCard>
          </motion.div>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <StatCard bgcolor="#4CAF50">
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Star sx={{ fontSize: 40, opacity: 0.8 }} />
                  <Typography variant="h3" fontWeight="bold">
                    92%
                  </Typography>
                </Box>
                <Typography variant="body2" sx={{ opacity: 0.8 }}>
                  Average Score
                </Typography>
              </CardContent>
            </StatCard>
          </motion.div>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <StatCard bgcolor="#FF9800">
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <TrophyIcon sx={{ fontSize: 40, opacity: 0.8 }} />
                  {loading ? (
                    <CircularProgress size={30} color="inherit" />
                  ) : (
                    <Typography variant="h3" fontWeight="bold">
                      {nPoints}
                    </Typography>
                  )}
                </Box>
                <Typography variant="body2" sx={{ opacity: 0.8 }}>
                  N.POINTS
                </Typography>
              </CardContent>
            </StatCard>
          </motion.div>
        </Grid>
      </Grid>

      {/* Main Dashboard Sections */}
      <Grid container spacing={3} sx={{ mt: 3 }}>
        {/* Courses & Progress */}
        <Grid item xs={12} lg={8}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <StyledCard>
              <CardHeader
                title="Your Courses"
                action={
                  <Button 
                    endIcon={<ArrowForward />}
                    sx={{ color: '#7445f8', textTransform: 'none' }}
                  >
                    View All
                  </Button>
                }
              />
              <Divider />
              <CardContent>
                <Grid container spacing={2}>
                  {courses.map(course => (
                    <Grid item xs={12} key={course.id}>
                      <Paper
                        sx={{
                          p: 2,
                          borderRadius: 2,
                          display: 'flex',
                          flexDirection: { xs: 'column', sm: 'row' },
                          alignItems: { sm: 'center' },
                          mb: 1,
                          '&:hover': {
                            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
                          }
                        }}
                      >
                        <Avatar 
                          variant="rounded"
                          sx={{ 
                            bgcolor: 'rgba(116, 69, 248, 0.1)',
                            width: 50,
                            height: 50,
                            mr: { xs: 0, sm: 2 },
                            mb: { xs: 1, sm: 0 }
                          }}
                        >
                          {course.icon}
                        </Avatar>
                        <Box sx={{ flex: 1 }}>
                          <Box 
                            sx={{ 
                              display: 'flex', 
                              justifyContent: 'space-between',
                              alignItems: 'center',
                              flexWrap: 'wrap'
                            }}
                          >
                            <Typography variant="subtitle1" fontWeight="600">
                              {course.title}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {course.lastAccessed}
                            </Typography>
                          </Box>
                          <Typography variant="body2" color="text.secondary" gutterBottom>
                            Instructor: {course.instructor}
                          </Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Box sx={{ flex: 1, mr: 1 }}>
                              <ProgressBar 
                                variant="determinate" 
                                value={course.progress} 
                                sx={{ mb: 0.5 }}
                              />
                            </Box>
                            <Typography variant="body2" fontWeight="600" color="primary">
                              {course.progress}%
                            </Typography>
                          </Box>
                        </Box>
                      </Paper>
                    </Grid>
                  ))}
                </Grid>
              </CardContent>
            </StyledCard>
          </motion.div>
        </Grid>
        
        {/* Right Sidebar */}
        <Grid item xs={12} lg={4}>
          <Grid container spacing={3} direction="column">
            {/* Upcoming Events */}
            <Grid item>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <StyledCard>
                  <CardHeader
                    title="Upcoming Schedule"
                    action={
                      <IconButton>
                        <CalendarMonth sx={{ color: '#7445f8' }} />
                      </IconButton>
                    }
                  />
                  <Divider />
                  <CardContent>
                    <List sx={{ p: 0 }}>
                      {upcomingEvents.map(event => (
                        <ListItem 
                          key={event.id} 
                          alignItems="flex-start"
                          sx={{
                            p: 1.5,
                            borderRadius: 2,
                            mb: 1,
                            '&:hover': {
                              bgcolor: 'rgba(0, 0, 0, 0.02)',
                            }
                          }}
                        >
                          <ListItemAvatar>
                            <Avatar sx={{ bgcolor: 'rgba(116, 69, 248, 0.1)' }}>
                              <Event sx={{ color: '#7445f8' }} />
                            </Avatar>
                          </ListItemAvatar>
                          <ListItemText
                            primary={event.title}
                            secondary={
                              <>
                                <Typography variant="body2" color="text.secondary">
                                  {event.date}
                                </Typography>
                                <Chip 
                                  label={event.subject} 
                                  size="small" 
                                  sx={{ mt: 1, bgcolor: 'rgba(116, 69, 248, 0.1)', color: '#7445f8' }} 
                                />
                              </>
                            }
                          />
                        </ListItem>
                      ))}
                    </List>
                  </CardContent>
                </StyledCard>
              </motion.div>
            </Grid>
            
            {/* Recent Activity */}
            <Grid item>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <StyledCard>
                  <CardHeader
                    title="Recent Activity"
                  />
                  <Divider />
                  <CardContent>
                    <List sx={{ p: 0 }}>
                      {recentActivities.map(activity => (
                        <ListItem 
                          key={activity.id}
                          sx={{
                            py: 1.5,
                            borderBottom: '1px solid rgba(0, 0, 0, 0.06)',
                            '&:last-child': {
                              borderBottom: 'none'
                            }
                          }}
                        >
                          <ListItemAvatar>
                            <Avatar sx={{ bgcolor: 'rgba(0, 0, 0, 0.04)' }}>
                              {activity.icon}
                            </Avatar>
                          </ListItemAvatar>
                          <ListItemText
                            primary={activity.title}
                            secondary={activity.time}
                          />
                        </ListItem>
                      ))}
                    </List>
                  </CardContent>
                </StyledCard>
              </motion.div>
            </Grid>
          </Grid>
        </Grid>

        {/* Announcements */}
        <Grid item xs={12}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <StyledCard>
              <CardHeader
                title="Announcements & News"
                action={
                  <Tabs
                    value={tabValue}
                    onChange={handleTabChange}
                    sx={{
                      '& .MuiTabs-indicator': {
                        backgroundColor: '#7445f8',
                      },
                      '& .MuiTab-root.Mui-selected': {
                        color: '#7445f8',
                      },
                    }}
                  >
                    <Tab label="All" />
                    <Tab label="Important" />
                    <Tab label="Recent" />
                  </Tabs>
                }
              />
              <Divider />
              <CardContent>
                <TabPanel value={tabValue} index={0}>
                  <Grid container spacing={2}>
                    {announcements.map(announcement => (
                      <Grid item xs={12} md={4} key={announcement.id}>
                        <Paper
                          sx={{
                            p: 2,
                            borderRadius: 2,
                            height: '100%',
                            '&:hover': {
                              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
                            }
                          }}
                        >
                          <Box sx={{ mb: 1 }}>
                            <Chip
                              label={announcement.date}
                              size="small"
                              sx={{ bgcolor: 'rgba(116, 69, 248, 0.1)', color: '#7445f8' }}
                            />
                          </Box>
                          <Typography variant="h6" fontWeight="600" gutterBottom>
                            {announcement.title}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {announcement.description}
                          </Typography>
                        </Paper>
                      </Grid>
                    ))}
                  </Grid>
                </TabPanel>
                <TabPanel value={tabValue} index={1}>
                  <Typography variant="body1">Important announcements will appear here.</Typography>
                </TabPanel>
                <TabPanel value={tabValue} index={2}>
                  <Typography variant="body1">Recent announcements will appear here.</Typography>
                </TabPanel>
              </CardContent>
            </StyledCard>
          </motion.div>
        </Grid>
      </Grid>
    </Box>
  );
};

export default StudentDashboard; 