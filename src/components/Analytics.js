import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  LinearProgress,
  CircularProgress,
  Alert,
  Paper,
  Divider,
  Chip,
  List,
  ListItem,
  ListItemText,
  Avatar,
  useTheme
} from '@mui/material';
import { motion } from 'framer-motion';
import axios from 'axios';
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  Legend, 
  Tooltip, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  AreaChart, 
  Area,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from 'recharts';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import AssessmentIcon from '@mui/icons-material/Assessment';

// Define the subjects
const subjects = [
  { id: 'physics', name: 'Physics', color: '#FF6384' },
  { id: 'chemistry', name: 'Chemistry', color: '#36A2EB' },
  { id: 'botany', name: 'Botany', color: '#4BC0C0' },
  { id: 'zoology', name: 'Zoology', color: '#FFCE56' }
];

// Total levels per subject (12 stages × 4 levels)
const TOTAL_LEVELS = 48;

// Mock data for time tracking
const timeTrackingData = [
  { name: 'Week 1', productive: 12, unproductive: 5 },
  { name: 'Week 2', productive: 15, unproductive: 4 },
  { name: 'Week 3', productive: 18, unproductive: 3 },
  { name: 'Week 4', productive: 16, unproductive: 6 },
  { name: 'Week 5', productive: 20, unproductive: 2 },
  { name: 'Week 6', productive: 22, unproductive: 3 },
];

// Mock data for subject-specific strengths and weaknesses
const subjectTopicsData = {
  physics: [
    { topic: 'Mechanics', score: 85 },
    { topic: 'Thermodynamics', score: 65 },
    { topic: 'Electromagnetism', score: 78 },
    { topic: 'Optics', score: 90 },
    { topic: 'Modern Physics', score: 72 }
  ],
  chemistry: [
    { topic: 'Organic Chemistry', score: 75 },
    { topic: 'Inorganic Chemistry', score: 60 },
    { topic: 'Physical Chemistry', score: 82 },
    { topic: 'Analytical Chemistry', score: 68 },
    { topic: 'Biochemistry', score: 77 }
  ],
  botany: [
    { topic: 'Plant Morphology', score: 88 },
    { topic: 'Plant Physiology', score: 80 },
    { topic: 'Plant Taxonomy', score: 65 },
    { topic: 'Plant Ecology', score: 73 },
    { topic: 'Plant Reproduction', score: 82 }
  ],
  zoology: [
    { topic: 'Animal Physiology', score: 70 },
    { topic: 'Animal Taxonomy', score: 63 },
    { topic: 'Cell Biology', score: 85 },
    { topic: 'Genetics', score: 79 },
    { topic: 'Evolution', score: 68 }
  ]
};

function Analytics() {
  const theme = useTheme();
  const [studentData, setStudentData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [subjectProgress, setSubjectProgress] = useState([]);
  const [activeSubject, setActiveSubject] = useState('physics');

  useEffect(() => {
    fetchStudentData();
  }, []);

  const fetchStudentData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Authentication token missing. Please log in again.');
        setLoading(false);
        return;
      }

      console.log('Fetching student data...');
      const response = await axios.get('http://localhost:5000/student/profile', {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      console.log('Student data received:', response.data);
      
      if (!response.data) {
        throw new Error('No data received from server');
      }
      
      setStudentData(response.data);
      
      // Calculate progress for each subject
      if (response.data && response.data.subjects) {
        const progress = calculateSubjectProgress(response.data.subjects);
        setSubjectProgress(progress);
      }
      
      setLoading(false);
    } catch (err) {
      console.error("Error fetching student data:", err);
      if (err.response) {
        setError(`Failed to fetch student data: ${err.response.data.message || err.response.statusText}`);
      } else if (err.request) {
        setError('Failed to fetch student data: No response from server. Please check your connection.');
      } else {
        setError(`Failed to fetch student data: ${err.message}`);
      }
      
      // Use mock data if API fails
      const mockSubjects = {
        physics: { level: '2', stage: '3' },
        chemistry: { level: '2', stage: '2' },
        botany: { level: '1', stage: '4' },
        zoology: { level: '1', stage: '3' }
      };
      
      setStudentData({
        name: 'Student',
        subjects: mockSubjects
      });
      
      const progress = calculateSubjectProgress(mockSubjects);
      setSubjectProgress(progress);
      
      setLoading(false);
    }
  };

  // Calculate progress for each subject
  const calculateSubjectProgress = (subjectsData) => {
    return subjects.map(subject => {
      const subjectData = subjectsData[subject.id];
      
      // Calculate completed levels based on stage and level
      // Each stage has 4 levels, so (stage-1)*4 + level gives total completed levels
      const stage = parseInt(subjectData?.stage || 1);
      const level = parseInt(subjectData?.level || 1);
      
      // Calculate completed levels
      // All previous stages are completed, plus levels in current stage
      const completedLevels = (stage - 1) * 4 + (level - 1);
      
      // Current level is in progress
      const inProgressLevels = 1;
      
      // Remaining levels are locked
      const lockedLevels = TOTAL_LEVELS - completedLevels - inProgressLevels;
      
      return {
        id: subject.id,
        name: subject.name,
        color: subject.color,
        data: [
          { name: 'Completed', value: completedLevels, color: '#4CAF50' },
          { name: 'In Progress', value: inProgressLevels, color: '#FFC107' },
          { name: 'Locked', value: lockedLevels, color: '#E0E0E0' }
        ]
      };
    });
  };

  // Get top strengths and weaknesses for a specific subject
  const getTopStrengthsForSubject = (subjectId) => {
    return [...subjectTopicsData[subjectId]]
      .sort((a, b) => b.score - a.score)
      .slice(0, 3);
  };

  const getTopWeaknessesForSubject = (subjectId) => {
    return [...subjectTopicsData[subjectId]]
      .sort((a, b) => a.score - b.score)
      .slice(0, 3);
  };

  // Calculate average score for a subject
  const getAverageScoreForSubject = (subjectId) => {
    const topics = subjectTopicsData[subjectId];
    const sum = topics.reduce((total, topic) => total + topic.score, 0);
    return Math.round(sum / topics.length);
  };

  if (loading) {
    return (
      <Box sx={{ p: 3 }}>
        <Paper 
          elevation={0} 
          sx={{ 
            p: 3, 
            mb: 4, 
            borderRadius: 2, 
            background: `linear-gradient(135deg, ${theme.palette.primary.light} 0%, ${theme.palette.primary.main} 100%)`,
            color: 'white'
          }}
        >
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            Performance Analytics
          </Typography>
          <Typography variant="body1">
            Track your learning progress and performance metrics
          </Typography>
        </Paper>
        
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 8 }}>
          <CircularProgress size={60} />
          <Typography variant="h6" sx={{ mt: 2, color: 'text.secondary' }}>
            Loading your analytics data...
          </Typography>
          <Typography variant="body2" sx={{ mt: 1, color: 'text.secondary', maxWidth: 400, textAlign: 'center' }}>
            We're retrieving your performance data from our servers. This should only take a moment.
          </Typography>
        </Box>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ mt: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Paper 
        elevation={0} 
        sx={{ 
          p: 3, 
          mb: 4, 
          borderRadius: 2, 
          background: `linear-gradient(135deg, ${theme.palette.primary.light} 0%, ${theme.palette.primary.main} 100%)`,
          color: 'white'
        }}
      >
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          Performance Analytics
        </Typography>
        <Typography variant="body1">
          Track your learning progress and performance metrics
        </Typography>
      </Paper>

      {/* Subject Progress Pie Charts */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <AssessmentIcon sx={{ mr: 1, color: theme.palette.primary.main }} />
          <Typography variant="h5" fontWeight="bold">
            Subject Progress
          </Typography>
        </Box>
        <Grid container spacing={3}>
          {subjectProgress.map((subject) => (
            <Grid item xs={12} sm={6} md={3} key={subject.id}>
              <Card sx={{ 
                height: '100%', 
                boxShadow: '0 8px 24px rgba(0,0,0,0.12)', 
                borderRadius: 3,
                transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
                overflow: 'visible',
                position: 'relative',
                '&:hover': {
                  transform: 'translateY(-8px)',
                  boxShadow: '0 16px 32px rgba(0,0,0,0.15)'
                }
              }}>
                <Box 
                  sx={{ 
                    position: 'absolute', 
                    top: '-15px', 
                    left: '50%', 
                    transform: 'translateX(-50%)',
                    backgroundColor: subject.color,
                    color: 'white',
                    borderRadius: '20px',
                    px: 2,
                    py: 0.5,
                    fontWeight: 'bold',
                    fontSize: '0.9rem',
                    boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                    zIndex: 1
                  }}
                >
                  {subject.name}
                </Box>
                <CardContent sx={{ pt: 4, pb: 2 }}>
                  <Box sx={{ height: 240, position: 'relative' }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={subject.data}
                          cx="50%"
                          cy="50%"
                          innerRadius={50}
                          outerRadius={80}
                          paddingAngle={2}
                          dataKey="value"
                          animationDuration={500}
                        >
                          {subject.data.map((entry, index) => (
                            <Cell 
                              key={`cell-${index}`} 
                              fill={entry.color} 
                              stroke="white"
                              strokeWidth={1}
                            />
                          ))}
                        </Pie>
                        <Tooltip 
                          formatter={(value, name) => [`${value} Levels`, name]} 
                        />
                      </PieChart>
                    </ResponsiveContainer>
                    <Box 
                      sx={{ 
                        position: 'absolute', 
                        top: '50%', 
                        left: '50%', 
                        transform: 'translate(-50%, -50%)',
                        textAlign: 'center'
                      }}
                    >
                      <Typography 
                        variant="h4" 
                        fontWeight="bold" 
                        color={subject.color}
                      >
                        {Math.round((subject.data[0].value / TOTAL_LEVELS) * 100)}%
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Complete
                      </Typography>
                    </Box>
                  </Box>
                  
                  <Box sx={{ mt: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                      <Typography variant="body2" fontWeight="medium">
                        Progress
                      </Typography>
                      <Typography variant="body2" fontWeight="bold" color={subject.color}>
                        {subject.data[0].value} of {TOTAL_LEVELS} levels
                      </Typography>
                    </Box>
                    <LinearProgress 
                      variant="determinate" 
                      value={(subject.data[0].value / TOTAL_LEVELS) * 100} 
                      sx={{ 
                        height: 10, 
                        borderRadius: 5, 
                        backgroundColor: '#E0E0E0',
                        '& .MuiLinearProgress-bar': {
                          backgroundColor: subject.color,
                          borderRadius: 5,
                        }
                      }} 
                    />
                    
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                      {subject.data.map((entry, index) => (
                        <Box key={index} sx={{ display: 'flex', alignItems: 'center' }}>
                          <Box 
                            sx={{ 
                              width: 12, 
                              height: 12, 
                              borderRadius: '50%', 
                              backgroundColor: entry.color,
                              mr: 0.5 
                            }} 
                          />
                          <Typography variant="caption" color="text.secondary">
                            {entry.name}: {entry.value}
                          </Typography>
                        </Box>
                      ))}
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Time Tracking */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <AccessTimeIcon sx={{ mr: 1, color: theme.palette.primary.main }} />
          <Typography variant="h5" fontWeight="bold">
            Time Tracking
          </Typography>
        </Box>
        <Card sx={{ boxShadow: '0 4px 20px rgba(0,0,0,0.1)', borderRadius: 2 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Productive vs. Unproductive Study Time
            </Typography>
            <Typography variant="body2" color="textSecondary" paragraph>
              Track how effectively you're using your study time each week
            </Typography>
            <Box sx={{ height: 300, mt: 3 }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={timeTrackingData}
                  margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis label={{ value: 'Hours', angle: -90, position: 'insideLeft' }} />
                  <Tooltip formatter={(value) => [`${value} hours`, '']} />
                  <Legend />
                  <Area 
                    type="monotone" 
                    dataKey="productive" 
                    stackId="1"
                    stroke="#4CAF50" 
                    fill="#4CAF50" 
                    name="Productive Time"
                  />
                  <Area 
                    type="monotone" 
                    dataKey="unproductive" 
                    stackId="1"
                    stroke="#FF5252" 
                    fill="#FF5252" 
                    name="Unproductive Time"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
              <Chip 
                label="Total Productive: 103 hours" 
                sx={{ 
                  backgroundColor: '#E8F5E9', 
                  color: '#2E7D32',
                  fontWeight: 'medium'
                }} 
              />
              <Chip 
                label="Total Unproductive: 23 hours" 
                sx={{ 
                  backgroundColor: '#FFEBEE', 
                  color: '#C62828',
                  fontWeight: 'medium'
                }} 
              />
            </Box>
          </CardContent>
        </Card>
      </Box>

      {/* Strengths and Weaknesses */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <EmojiEventsIcon sx={{ mr: 1, color: theme.palette.primary.main }} />
          <Typography variant="h5" fontWeight="bold">
            Strengths & Weaknesses
          </Typography>
        </Box>
        
        {/* Subject Tabs */}
        <Box sx={{ mb: 3, display: 'flex', justifyContent: 'center' }}>
          {subjects.map((subject) => (
            <Box 
              key={subject.id}
              onClick={() => setActiveSubject(subject.id)}
              sx={{
                px: 3,
                py: 1.5,
                mx: 1,
                borderRadius: 2,
                cursor: 'pointer',
                backgroundColor: activeSubject === subject.id ? subject.color : '#f5f5f5',
                color: activeSubject === subject.id ? 'white' : 'text.primary',
                fontWeight: 'medium',
                transition: 'all 0.3s ease',
                boxShadow: activeSubject === subject.id ? '0 4px 12px rgba(0,0,0,0.1)' : 'none',
                '&:hover': {
                  backgroundColor: activeSubject === subject.id ? subject.color : '#e0e0e0',
                  transform: 'translateY(-2px)'
                }
              }}
            >
              {subject.name}
            </Box>
          ))}
        </Box>
        
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Card sx={{ boxShadow: '0 4px 20px rgba(0,0,0,0.1)', borderRadius: 2, height: '100%' }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6" gutterBottom>
                    {subjects.find(s => s.id === activeSubject).name} Topic Performance
                  </Typography>
                  <Chip 
                    label={`Average: ${getAverageScoreForSubject(activeSubject)}%`} 
                    sx={{ 
                      backgroundColor: subjects.find(s => s.id === activeSubject).color,
                      color: 'white',
                      fontWeight: 'bold'
                    }} 
                  />
                </Box>
                <Box sx={{ height: 300 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart outerRadius={90} data={subjectTopicsData[activeSubject]}>
                      <PolarGrid />
                      <PolarAngleAxis dataKey="topic" />
                      <PolarRadiusAxis angle={30} domain={[0, 100]} />
                      <Radar 
                        name="Score" 
                        dataKey="score" 
                        stroke={subjects.find(s => s.id === activeSubject).color} 
                        fill={subjects.find(s => s.id === activeSubject).color} 
                        fillOpacity={0.6} 
                      />
                      <Tooltip formatter={(value) => [`${value}%`, 'Score']} />
                    </RadarChart>
                  </ResponsiveContainer>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card sx={{ boxShadow: '0 4px 20px rgba(0,0,0,0.1)', borderRadius: 2, height: '100%' }}>
              <CardContent>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center' }}>
                    <TrendingUpIcon sx={{ color: '#4CAF50', mr: 1 }} />
                    Top Strengths
                  </Typography>
                  <Divider sx={{ my: 1 }} />
                  <List dense>
                    {getTopStrengthsForSubject(activeSubject).map((item, index) => (
                      <ListItem key={index} sx={{ py: 0.5 }}>
                        <Avatar 
                          sx={{ 
                            width: 32, 
                            height: 32, 
                            bgcolor: '#E8F5E9', 
                            color: '#2E7D32',
                            fontSize: '0.875rem',
                            fontWeight: 'bold',
                            mr: 1
                          }}
                        >
                          {item.score}%
                        </Avatar>
                        <ListItemText 
                          primary={item.topic} 
                          primaryTypographyProps={{ fontWeight: 'medium' }}
                        />
                      </ListItem>
                    ))}
                  </List>
                </Box>
                
                <Box sx={{ mt: 3 }}>
                  <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center' }}>
                    <TrendingDownIcon sx={{ color: '#F44336', mr: 1 }} />
                    Areas to Improve
                  </Typography>
                  <Divider sx={{ my: 1 }} />
                  <List dense>
                    {getTopWeaknessesForSubject(activeSubject).map((item, index) => (
                      <ListItem key={index} sx={{ py: 0.5 }}>
                        <Avatar 
                          sx={{ 
                            width: 32, 
                            height: 32, 
                            bgcolor: '#FFEBEE', 
                            color: '#C62828',
                            fontSize: '0.875rem',
                            fontWeight: 'bold',
                            mr: 1
                          }}
                        >
                          {item.score}%
                        </Avatar>
                        <ListItemText 
                          primary={item.topic} 
                          primaryTypographyProps={{ fontWeight: 'medium' }}
                          secondary={
                            <Box sx={{ mt: 0.5 }}>
                              <Typography variant="caption" color="text.secondary">
                                Recommended: {index === 0 ? 'Practice more problems' : index === 1 ? 'Review core concepts' : 'Watch tutorial videos'}
                              </Typography>
                              <LinearProgress 
                                variant="determinate" 
                                value={item.score} 
                                sx={{ 
                                  height: 4, 
                                  borderRadius: 2, 
                                  mt: 0.5,
                                  backgroundColor: '#FFEBEE',
                                  '& .MuiLinearProgress-bar': {
                                    backgroundColor: '#F44336',
                                  }
                                }} 
                              />
                            </Box>
                          }
                        />
                      </ListItem>
                    ))}
                  </List>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>

      {/* Performance Overview */}
      <Box sx={{ mb: 4 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card sx={{ boxShadow: '0 4px 20px rgba(0,0,0,0.1)', borderRadius: 2 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom fontWeight="medium">Performance Overview</Typography>
                <Box sx={{ mt: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2" fontWeight="medium">
                      Average Score
                    </Typography>
                    <Typography variant="body2" fontWeight="bold" color="primary">
                      85%
                    </Typography>
                  </Box>
                  <LinearProgress 
                    variant="determinate" 
                    value={85} 
                    sx={{ 
                      height: 8, 
                      borderRadius: 4,
                      mb: 2,
                      backgroundColor: '#E0E0E0',
                      '& .MuiLinearProgress-bar': {
                        backgroundColor: '#4CAF50',
                      }
                    }} 
                  />
                  
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2" fontWeight="medium">
                      Questions Attempted
                    </Typography>
                    <Typography variant="body2" fontWeight="bold" color="primary">
                      150 / 200
                    </Typography>
                  </Box>
                  <LinearProgress 
                    variant="determinate" 
                    value={75} 
                    sx={{ 
                      height: 8, 
                      borderRadius: 4,
                      backgroundColor: '#E0E0E0',
                      '& .MuiLinearProgress-bar': {
                        backgroundColor: '#2196F3',
                      }
                    }} 
                  />
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card sx={{ boxShadow: '0 4px 20px rgba(0,0,0,0.1)', borderRadius: 2 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom fontWeight="medium">Study Time</Typography>
                <Box sx={{ mt: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2" fontWeight="medium">
                      Total Study Hours
                    </Typography>
                    <Typography variant="body2" fontWeight="bold" color="primary">
                      45 hours
                    </Typography>
                  </Box>
                  <LinearProgress 
                    variant="determinate" 
                    value={60} 
                    sx={{ 
                      height: 8, 
                      borderRadius: 4,
                      mb: 2,
                      backgroundColor: '#E0E0E0',
                      '& .MuiLinearProgress-bar': {
                        backgroundColor: '#9C27B0',
                      }
                    }} 
                  />
                  
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2" fontWeight="medium">
                      Average Daily
                    </Typography>
                    <Typography variant="body2" fontWeight="bold" color="primary">
                      2.5 hours
                    </Typography>
                  </Box>
                  <LinearProgress 
                    variant="determinate" 
                    value={70} 
                    sx={{ 
                      height: 8, 
                      borderRadius: 4,
                      backgroundColor: '#E0E0E0',
                      '& .MuiLinearProgress-bar': {
                        backgroundColor: '#FF9800',
                      }
                    }} 
                  />
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </motion.div>
  );
}

export default Analytics; 