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
  EmojiEvents as TrophyIcon,
  Book as BookIcon
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import axiosInstance from '../components/axios-config';
import Syllabus from '../components/Syllabus';

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
        console.log('Fetching student profile data...');
        const response = await axiosInstance.get('/api/students/profile');
        console.log('Student profile data received:', response.data);
        setStudentData(response.data);
        
        // Calculate N.POINTS based on levels cleared
        if (response.data.subjects) {
          const { physics, chemistry, biology } = response.data.subjects;
          
          // Convert level strings to numbers and subtract 1 (since level 1 means 0 levels cleared)
          const physicsLevel = parseInt(physics.level) - 1;
          const chemistryLevel = parseInt(chemistry.level) - 1;
          const biologyLevel = parseInt(biology.level) - 1;
          
          // Sum up the levels cleared (ensure they're not negative)
          const totalLevelsCleared = 
            Math.max(0, physicsLevel) + 
            Math.max(0, chemistryLevel) + 
            Math.max(0, biologyLevel);
          
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

  // Mock data for announcements
  const announcements = [
    { id: 1, title: 'Live Session: Physics Problem Solving', date: 'Tomorrow, 4:00 PM', description: 'Join our expert for an interactive problem-solving session.' },
    { id: 2, title: 'Mock Test Scheduled', date: 'Saturday, 10:00 AM', description: 'Prepare for the all-India mock test scheduled for this weekend.' },
    { id: 3, title: 'New Study Materials Uploaded', date: 'Just now', description: 'Check out the new biology notes and practice worksheets.' },
  ];

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={3}>
        {/* Stats Row */}
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

        {/* Main Content */}
        <Grid item xs={12}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <StyledCard>
              <CardHeader
                title="Announcements & News"
              />
              <Divider />
              <CardContent>
                <Tabs
                  value={tabValue}
                  onChange={handleTabChange}
                  indicatorColor="primary"
                  textColor="primary"
                  variant="scrollable"
                  scrollButtons="auto"
                >
                  <Tab icon={<MenuBook />} label="Study Materials" />
                  <Tab icon={<Assignment />} label="Assignments" />
                  <Tab icon={<Event />} label="Schedule" />
                  <Tab icon={<BookIcon />} label="Syllabus" />
                  <Tab icon={<Star />} label="Progress" />
                </Tabs>

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
                  {/* Existing Assignments content */}
                </TabPanel>

                <TabPanel value={tabValue} index={2}>
                  {/* Existing Schedule content */}
                </TabPanel>

                <TabPanel value={tabValue} index={3}>
                  <Syllabus />
                </TabPanel>

                <TabPanel value={tabValue} index={4}>
                  {/* Existing Progress content */}
                </TabPanel>
              </CardContent>
            </StyledCard>
          </motion.div>
        </Grid>
      </Grid>
    </Container>
  );
};

export default StudentDashboard; 