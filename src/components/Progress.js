import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Paper,
  LinearProgress,
  Tooltip,
  Tabs,
  Tab,
  CircularProgress,
  Alert,
  Chip,
  Divider,
  Avatar,
  useTheme,
  useMediaQuery,
  Skeleton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@mui/material';
import {
  Lock as LockIcon,
  CheckCircle as CheckCircleIcon,
  EmojiEvents as TrophyIcon,
  ArrowForward as ArrowForwardIcon,
  Timeline as TimelineIcon,
  School as SchoolIcon,
  Science as ScienceIcon,
  Biotech as BiotechIcon,
  Pets as PetsIcon,
  Bolt as BoltIcon,
  Lightbulb as LightbulbIcon,
  Psychology as PsychologyIcon,
  Assessment as AssessmentIcon,
  Close as CloseIcon,
  AccessTime as AccessTimeIcon,
  Check as CheckIcon,
  Clear as ClearIcon
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import axios from 'axios';
import axiosInstance from './axios-config';
import { useNavigate } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer, Cell } from 'recharts';

// Subject configuration with icons and colors
const subjects = [
  { id: 'physics', name: 'Physics', icon: <BoltIcon />, color: '#3f51b5', gradient: 'linear-gradient(135deg, #3f51b5 0%, #5c6bc0 100%)' },
  { id: 'chemistry', name: 'Chemistry', icon: <ScienceIcon />, color: '#f44336', gradient: 'linear-gradient(135deg, #f44336 0%, #e57373 100%)' },
  { id: 'botany', name: 'Botany', icon: <BiotechIcon />, color: '#4caf50', gradient: 'linear-gradient(135deg, #4caf50 0%, #81c784 100%)' },
  { id: 'zoology', name: 'Zoology', icon: <PetsIcon />, color: '#ff9800', gradient: 'linear-gradient(135deg, #ff9800 0%, #ffb74d 100%)' },
];

const generateStages = (subjectId, studentSubjects) => {
  // Default to level 1 if no student data is available
  const currentLevel = studentSubjects && studentSubjects[subjectId] 
    ? parseInt(studentSubjects[subjectId].level) 
    : 1;
  
  const currentStage = studentSubjects && studentSubjects[subjectId] 
    ? parseInt(studentSubjects[subjectId].stage) 
    : 1;
  
  return Array.from({ length: 12 }, (_, stageIndex) => {
    const stageNumber = stageIndex + 1;
    
    return {
      id: stageNumber,
      name: `${getStageName(stageNumber)}`,
      description: getStageDescription(stageNumber),
      levels: Array.from({ length: 4 }, (_, levelIndex) => {
        const levelNumber = levelIndex + 1;
        
        // Determine if this level/stage combination should be unlocked
        let isLocked = true;
        // Determine if this level is completed
        let isCompleted = false;
        // Calculate progress
        let progress = 0;
        
        // Rule 1: Previous stages are completely unlocked and completed (all levels)
        if (stageNumber < currentStage) {
          isLocked = false;
          isCompleted = true;
          progress = 100;
        }
        // Rule 2: Current stage - unlock levels up to current level
        else if (stageNumber === currentStage && levelNumber <= currentLevel) {
          isLocked = false;
          
          // Only the levels before current level are completed
          if (levelNumber < currentLevel) {
            isCompleted = true;
            progress = 100;
          } else {
            // Current level is unlocked but not completed
            progress = 0;
          }
        }
        // Rule 3: Next stage - only unlock if all levels of current stage are completed
        // This means the next stage's first level is only unlocked when currentLevel = 4 (max level)
        else if (stageNumber === currentStage + 1 && levelNumber === 1 && currentLevel === 4) {
          isLocked = false;
          progress = 0;
        }
        
        return {
          id: levelNumber,
          name: `${getLevelName(levelNumber)}`,
          description: getLevelDescription(levelNumber),
          isLocked: isLocked,
          isCompleted: isCompleted,
          progress: progress,
        };
      }),
    };
  });
};

const getStageName = (stageNumber) => {
  const stageNames = [
    'Foundation',
    'Basic Concepts',
    'Intermediate',
    'Advanced',
    'Complex Systems',
    'Problem Solving',
    'Analysis',
    'Synthesis',
    'Application',
    'Integration',
    'Mastery',
    'Expertise',
  ];
  return stageNames[stageNumber - 1] || `Stage ${stageNumber}`;
};

const getStageDescription = (stageNumber) => {
  const descriptions = [
    'Build your fundamental knowledge',
    'Understand core principles and theories',
    'Connect concepts and deepen understanding',
    'Tackle challenging problems and scenarios',
    'Explore interconnected systems and relationships',
    'Develop strategic approaches to complex problems',
    'Break down complex scenarios into components',
    'Combine concepts to form comprehensive solutions',
    'Apply knowledge to real-world scenarios',
    'Connect cross-disciplinary concepts',
    'Demonstrate comprehensive subject expertise',
    'Achieve expert-level understanding and application',
  ];
  return descriptions[stageNumber - 1] || `Description for Stage ${stageNumber}`;
};

const getLevelName = (levelNumber) => {
  const levelNames = [
    'Introduction',
    'Understanding',
    'Practice',
    'Mastery',
  ];
  return levelNames[levelNumber - 1] || `Level ${levelNumber}`;
};

const getLevelDescription = (levelNumber) => {
  const descriptions = [
    'Learn the basic concepts and terminology',
    'Develop deeper understanding of principles',
    'Apply concepts through guided practice',
    'Demonstrate comprehensive mastery',
  ];
  return descriptions[levelNumber - 1] || `Description for Level ${levelNumber}`;
};

// TestResultDetails component for showing test results with explanations and time analytics
const TestResultDetails = ({ open, onClose, testData }) => {
  const theme = useTheme();
  
  // If no test data, show placeholder message
  if (!testData) {
    return (
      <Dialog 
        open={open} 
        onClose={onClose}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h6">Test Results</Typography>
            <IconButton onClick={onClose} size="small">
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="body1">No test data available.</Typography>
          </Box>
        </DialogContent>
      </Dialog>
    );
  }

  // Prepare data for time analysis chart
  const timeChartData = testData.questions.map((question, index) => {
    const questionNumber = index + 1;
    const actualTime = question.timeSpent || 0; // In seconds
    const allocatedTime = question.allocatedTime || 60; // Default 60 seconds per question
    const isOvertime = actualTime > allocatedTime;
    
    return {
      name: `Q${questionNumber}`,
      actualTime: actualTime,
      allocatedTime: allocatedTime,
      efficiency: Math.min(100, (allocatedTime / actualTime) * 100),
      isCorrect: question.isCorrect
    };
  });

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      fullWidth
      maxWidth="md"
      scroll="paper"
    >
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h5" fontWeight="bold">
            Test Results: {testData.subjectName} - Stage {testData.stage}, Level {testData.level}
          </Typography>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      
      <DialogContent dividers>
        {/* Score Summary */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={4}>
            <Paper elevation={1} sx={{ p: 2, borderRadius: 2, bgcolor: 'primary.light', color: 'white', height: '100%' }}>
              <Typography variant="h6" align="center" gutterBottom>Score</Typography>
              <Typography variant="h3" align="center" fontWeight="bold">{testData.score}%</Typography>
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 1 }}>
                <Chip 
                  label={`${testData.correctCount}/${testData.totalQuestions} correct`} 
                  color="primary" 
                  variant="outlined"
                  sx={{ bgcolor: 'rgba(255,255,255,0.2)' }}
                />
              </Box>
            </Paper>
          </Grid>
          
          <Grid item xs={12} sm={4}>
            <Paper 
              elevation={1} 
              sx={{ 
                p: 2, 
                borderRadius: 2, 
                bgcolor: testData.passed ? 'success.light' : 'warning.light',
                color: 'white',
                height: '100%'
              }}
            >
              <Typography variant="h6" align="center" gutterBottom>Status</Typography>
              <Typography variant="h3" align="center" fontWeight="bold">
                {testData.passed ? 'PASSED' : 'FAILED'}
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 1 }}>
                <Chip 
                  label={testData.passed ? 'Level Cleared' : 'Try Again'} 
                  color={testData.passed ? "success" : "warning"} 
                  variant="outlined"
                  sx={{ bgcolor: 'rgba(255,255,255,0.2)' }}
                />
              </Box>
            </Paper>
          </Grid>
          
          <Grid item xs={12} sm={4}>
            <Paper elevation={1} sx={{ p: 2, borderRadius: 2, bgcolor: 'info.light', color: 'white', height: '100%' }}>
              <Typography variant="h6" align="center" gutterBottom>Time</Typography>
              <Typography variant="h3" align="center" fontWeight="bold">{testData.totalTime}m</Typography>
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 1 }}>
                <Chip 
                  label={`${testData.avgTimePerQuestion}s per question`} 
                  color="info" 
                  variant="outlined"
                  sx={{ bgcolor: 'rgba(255,255,255,0.2)' }}
                />
              </Box>
            </Paper>
          </Grid>
        </Grid>
        
        {/* Time Analysis Chart */}
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
          Time Analytics
        </Typography>
        
        <Paper elevation={1} sx={{ p: 2, borderRadius: 2, mb: 4 }}>
          <Typography variant="body2" sx={{ mb: 2, color: 'text.secondary' }}>
            This chart shows how much time you spent on each question compared to the allocated time.
          </Typography>
          
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={timeChartData}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis label={{ value: 'Time (seconds)', angle: -90, position: 'insideLeft' }} />
              <RechartsTooltip 
                formatter={(value, name) => {
                  if (name === 'actualTime') return [`${value} seconds`, 'Time Spent'];
                  if (name === 'allocatedTime') return [`${value} seconds`, 'Allocated Time'];
                  return [value, name];
                }}
              />
              <Legend />
              <Bar name="Allocated Time" dataKey="allocatedTime" fill="#8884d8" opacity={0.6} />
              <Bar name="Time Spent" dataKey="actualTime" fill="#82ca9d">
                {timeChartData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={
                      entry.isCorrect 
                        ? (entry.actualTime > entry.allocatedTime ? '#ff9800' : '#4caf50') 
                        : '#f44336'
                    } 
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2, gap: 2, flexWrap: 'wrap' }}>
            <Chip 
              size="small" 
              icon={<CheckIcon sx={{ color: 'white !important' }} />} 
              label="Correct & On Time" 
              sx={{ bgcolor: '#4caf50', color: 'white' }} 
            />
            <Chip 
              size="small" 
              icon={<AccessTimeIcon sx={{ color: 'white !important' }} />} 
              label="Correct but Overtime" 
              sx={{ bgcolor: '#ff9800', color: 'white' }} 
            />
            <Chip 
              size="small" 
              icon={<ClearIcon sx={{ color: 'white !important' }} />} 
              label="Incorrect" 
              sx={{ bgcolor: '#f44336', color: 'white' }} 
            />
          </Box>
        </Paper>
        
        {/* Question Explanations */}
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
          Question Explanations
        </Typography>
        
        <List sx={{ bgcolor: 'background.paper', borderRadius: 2 }}>
          {testData.questions.map((question, index) => (
            <React.Fragment key={index}>
              <ListItem 
                alignItems="flex-start"
                sx={{ 
                  bgcolor: question.isCorrect ? 'rgba(76, 175, 80, 0.1)' : 'rgba(244, 67, 54, 0.1)',
                  borderRadius: 2,
                  mb: 2,
                  flexDirection: 'column'
                }}
              >
                <Box sx={{ width: '100%', display: 'flex', alignItems: 'flex-start', mb: 1 }}>
                  <ListItemIcon sx={{ minWidth: 36 }}>
                    {question.isCorrect ? (
                      <CheckCircleIcon color="success" />
                    ) : (
                      <ClearIcon color="error" />
                    )}
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Typography variant="subtitle1" fontWeight="medium">
                        Question {index + 1}: {question.text}
                      </Typography>
                    }
                    secondary={
                      <Box sx={{ mt: 1 }}>
                        <Typography variant="body2" color="text.secondary">
                          Your answer: {question.selectedOption}
                        </Typography>
                        {!question.isCorrect && (
                          <Typography variant="body2" color="success.main">
                            Correct answer: {question.correctOption}
                          </Typography>
                        )}
                        <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                          <Chip 
                            size="small" 
                            icon={<AccessTimeIcon />} 
                            label={`${question.timeSpent} seconds`} 
                            color={question.timeSpent > question.allocatedTime ? "warning" : "default"}
                          />
                        </Box>
                      </Box>
                    }
                  />
                </Box>
                
                {question.explanation && (
                  <Box sx={{ 
                    mt: 1, 
                    p: 2, 
                    bgcolor: 'background.paper', 
                    borderRadius: 1,
                    border: '1px solid',
                    borderColor: 'divider',
                    width: '100%'
                  }}>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                      Explanation:
                    </Typography>
                    <Typography variant="body2">
                      {question.explanation}
                    </Typography>
                  </Box>
                )}
              </ListItem>
              {index < testData.questions.length - 1 && <Divider variant="inset" component="li" />}
            </React.Fragment>
          ))}
        </List>
      </DialogContent>
      
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Close
        </Button>
        <Button 
          variant="contained" 
          color="primary" 
          onClick={() => {
            onClose();
            // Trigger practice mode or similar follow-up action
          }}
        >
          Practice Weak Areas
        </Button>
      </DialogActions>
    </Dialog>
  );
};

function Progress() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));
  
  const [selectedSubject, setSelectedSubject] = useState('physics');
  const [studentData, setStudentData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeStage, setActiveStage] = useState(null);
  const navigate = useNavigate();
  
  // Add state for test results dialog
  const [testResultsOpen, setTestResultsOpen] = useState(false);
  const [selectedTestData, setSelectedTestData] = useState(null);
  const [testHistory, setTestHistory] = useState({});

  useEffect(() => {
    fetchStudentData();
    fetchTestHistory();
  }, []);

  useEffect(() => {
    // Set active stage to current stage when data loads or subject changes
    if (studentData && studentData.subjects && studentData.subjects[selectedSubject]) {
      setActiveStage(parseInt(studentData.subjects[selectedSubject].stage));
    }
  }, [studentData, selectedSubject]);

  const fetchStudentData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Authentication token missing. Please log in again.');
        setLoading(false);
        return;
      }

      const response = await axiosInstance.get('/student/profile');
      
      setStudentData(response.data);
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
      setLoading(false);
    }
  };

  const fetchTestHistory = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('Authentication token missing');
        return;
      }

      // In a real application, use this API call:
      const response = await axiosInstance.get('/student/test-history');
      
      setTestHistory(response.data);
      
      // If API call fails, use mock data as fallback
      /* 
      const mockTestHistory = {
        physics: {
          "1-1": {
            subjectName: "Physics",
            stage: 1,
            level: 1,
            date: "2023-08-15T14:30:00",
            score: 85,
            passed: true,
            correctCount: 17,
            totalQuestions: 20,
            totalTime: 42, // minutes
            avgTimePerQuestion: 126, // seconds
            questions: [
              {
                text: "Which of the following is a scalar quantity?",
                selectedOption: "Mass",
                correctOption: "Mass",
                isCorrect: true,
                timeSpent: 45,
                allocatedTime: 60,
                explanation: "Mass is a scalar quantity because it has magnitude but no direction. Other scalar quantities include time, distance, speed, and energy."
              },
              {
                text: "What is the SI unit of force?",
                selectedOption: "Newton",
                correctOption: "Newton",
                isCorrect: true,
                timeSpent: 38,
                allocatedTime: 60,
                explanation: "The SI unit of force is the Newton (N), which is defined as the force needed to accelerate a mass of 1 kilogram at a rate of 1 meter per second squared."
              },
              {
                text: "Which law of motion states that for every action, there is an equal and opposite reaction?",
                selectedOption: "Third law",
                correctOption: "Third law",
                isCorrect: true,
                timeSpent: 42,
                allocatedTime: 60,
                explanation: "Newton's Third Law of Motion states that for every action (force), there is an equal and opposite reaction (force)."
              }
              // More questions would be here
            ]
          }
          // More test results for different levels would be here
        }
        // More subjects would be here
      };
      
      setTestHistory(mockTestHistory);
      */
    } catch (err) {
      console.error("Error fetching test history:", err);
      // Use mock data as fallback if API fails
      const mockTestHistory = {
        physics: {
          "1-1": {
            subjectName: "Physics",
            stage: 1,
            level: 1,
            date: "2023-08-15T14:30:00",
            score: 85,
            passed: true,
            correctCount: 17,
            totalQuestions: 20,
            totalTime: 42, // minutes
            avgTimePerQuestion: 126, // seconds
            questions: [
              {
                text: "Which of the following is a scalar quantity?",
                selectedOption: "Mass",
                correctOption: "Mass",
                isCorrect: true,
                timeSpent: 45,
                allocatedTime: 60,
                explanation: "Mass is a scalar quantity because it has magnitude but no direction. Other scalar quantities include time, distance, speed, and energy."
              },
              {
                text: "What is the SI unit of force?",
                selectedOption: "Newton",
                correctOption: "Newton",
                isCorrect: true,
                timeSpent: 38,
                allocatedTime: 60,
                explanation: "The SI unit of force is the Newton (N), which is defined as the force needed to accelerate a mass of 1 kilogram at a rate of 1 meter per second squared."
              },
              {
                text: "Which law of motion states that for every action, there is an equal and opposite reaction?",
                selectedOption: "Third law",
                correctOption: "Third law",
                isCorrect: true,
                timeSpent: 42,
                allocatedTime: 60,
                explanation: "Newton's Third Law of Motion states that for every action (force), there is an equal and opposite reaction (force)."
              }
            ]
          }
        }
      };
      setTestHistory(mockTestHistory);
    }
  };

  const handleSubjectChange = (event, newValue) => {
    setSelectedSubject(newValue);
  };

  const handleLevelClick = (stageId, levelId) => {
    // Only navigate if the level is not locked
    const stage = stages.find(s => s.id === stageId);
    const level = stage?.levels.find(l => l.id === levelId);
    
    if (level && !level.isLocked) {
      // Always navigate to test page when clicking a level
      navigate('/test', { 
        state: { 
          subject: selectedSubject, 
          stage: stageId.toString(), 
          level: levelId.toString() 
        } 
      });
    }
  };

  // Generate stages based on student data
  const stages = studentData 
    ? generateStages(selectedSubject, studentData.subjects) 
    : [];

  // Get current subject info
  const currentSubject = subjects.find(s => s.id === selectedSubject) || subjects[0];

  // Calculate overall progress for the selected subject
  const calculateOverallProgress = () => {
    if (!studentData || !studentData.subjects || !studentData.subjects[selectedSubject]) {
      return 0;
    }
    
    const currentStage = parseInt(studentData.subjects[selectedSubject].stage);
    const currentLevel = parseInt(studentData.subjects[selectedSubject].level);
    
    // Total possible progress: 12 stages × 4 levels = 48 levels
    const totalLevels = 12 * 4;
    
    // Completed levels: (completed stages × 4 levels) + levels in current stage
    const completedLevels = ((currentStage - 1) * 4) + (currentLevel - 1);
    
    return Math.round((completedLevels / totalLevels) * 100);
  };

  if (loading) {
    return (
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column',
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        gap: 2
      }}>
        <CircularProgress size={60} thickness={4} />
        <Typography variant="h6" color="text.secondary">
          Loading your learning journey...
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 4, maxWidth: 800, mx: 'auto', mt: 4 }}>
        <Alert 
          severity="error" 
          variant="filled"
          sx={{ 
            borderRadius: 2,
            boxShadow: 3
          }}
        >
          {error}
        </Alert>
      </Box>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Box sx={{ 
        maxWidth: 1200, 
        mx: 'auto', 
        p: { xs: 2, sm: 3, md: 4 },
        pb: 8
      }}>
        {/* Header Section */}
        <Box 
          component={Paper} 
          elevation={3} 
          sx={{ 
            p: { xs: 2, sm: 3, md: 4 }, 
            mb: 4, 
            borderRadius: 3,
            background: `${currentSubject.gradient}`,
            color: 'white',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          <Box sx={{ 
            position: 'absolute', 
            right: -20, 
            top: -20, 
            opacity: 0.1, 
            fontSize: 180 
          }}>
            {currentSubject.icon}
          </Box>
          
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={7}>
              <Typography variant="h3" fontWeight="bold" gutterBottom>
                Your Learning Journey
              </Typography>
              <Typography variant="h5" sx={{ mb: 2, opacity: 0.9 }}>
                {currentSubject.name}
              </Typography>
              <Typography variant="body1" sx={{ mb: 3, maxWidth: 600 }}>
                Track your progress, unlock new levels, and master NEET concepts through our structured learning path.
              </Typography>
              
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
                <Chip 
                  icon={<SchoolIcon />} 
                  label={`Stage ${studentData?.subjects?.[selectedSubject]?.stage || 1}`} 
                  sx={{ 
                    bgcolor: 'rgba(255,255,255,0.2)', 
                    color: 'white',
                    fontWeight: 'bold',
                    '& .MuiChip-icon': { color: 'white' }
                  }} 
                />
                <Chip 
                  icon={<TimelineIcon />} 
                  label={`Level ${studentData?.subjects?.[selectedSubject]?.level || 1}`} 
                  sx={{ 
                    bgcolor: 'rgba(255,255,255,0.2)', 
                    color: 'white',
                    fontWeight: 'bold',
                    '& .MuiChip-icon': { color: 'white' }
                  }} 
                />
                <Chip 
                  icon={<LightbulbIcon />} 
                  label={`${calculateOverallProgress()}% Complete`} 
                  sx={{ 
                    bgcolor: 'rgba(255,255,255,0.2)', 
                    color: 'white',
                    fontWeight: 'bold',
                    '& .MuiChip-icon': { color: 'white' }
                  }} 
                />
              </Box>
            </Grid>
            
            <Grid item xs={12} md={5} sx={{ display: 'flex', justifyContent: 'center' }}>
              <Box sx={{ position: 'relative', width: 200, height: 200 }}>
                <CircularProgress
                  variant="determinate"
                  value={calculateOverallProgress()}
                  size={200}
                  thickness={5}
                  sx={{
                    color: 'white',
                    opacity: 0.9,
                    '& .MuiCircularProgress-circle': {
                      strokeLinecap: 'round',
                    },
                  }}
                />
                <Box
                  sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    bottom: 0,
                    right: 0,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Typography variant="h3" fontWeight="bold">
                    {calculateOverallProgress()}%
                  </Typography>
                  <Typography variant="body1">Complete</Typography>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Box>

        {/* Subject Tabs */}
        <Paper elevation={2} sx={{ borderRadius: 2, mb: 4, overflow: 'hidden' }}>
          <Tabs
            value={selectedSubject}
            onChange={handleSubjectChange}
            variant="scrollable"
            scrollButtons="auto"
            sx={{
              '& .MuiTabs-indicator': {
                height: 4,
                borderTopLeftRadius: 2,
                borderTopRightRadius: 2,
              },
              '& .MuiTab-root': {
                minHeight: 64,
                fontSize: { xs: '0.875rem', sm: '1rem' },
              }
            }}
          >
            {subjects.map((subject) => (
              <Tab
                key={subject.id}
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Avatar 
                      sx={{ 
                        bgcolor: subject.color,
                        width: 32,
                        height: 32
                      }}
                    >
                      {subject.icon}
                    </Avatar>
                    <span>{subject.name}</span>
                  </Box>
                }
                value={subject.id}
              />
            ))}
          </Tabs>
        </Paper>

        {/* Stages Section */}
        <Grid container spacing={3}>
          {stages.map((stage) => (
            <Grid item xs={12} key={stage.id}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: stage.id * 0.05 }}
              >
                <Paper 
                  elevation={activeStage === stage.id ? 4 : 1} 
                  sx={{ 
                    mb: 3, 
                    borderRadius: 3,
                    overflow: 'hidden',
                    transition: 'all 0.3s ease',
                    border: activeStage === stage.id ? `2px solid ${currentSubject.color}` : 'none',
                  }}
                >
                  <Box 
                    sx={{ 
                      p: { xs: 2, sm: 3 }, 
                      background: activeStage === stage.id ? currentSubject.gradient : 'rgba(0,0,0,0.02)',
                      color: activeStage === stage.id ? 'white' : 'inherit',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      flexWrap: 'wrap',
                      gap: 2
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Avatar 
                        sx={{ 
                          bgcolor: activeStage === stage.id ? 'rgba(255,255,255,0.2)' : currentSubject.color,
                          color: activeStage === stage.id ? 'white' : 'white',
                          width: 40,
                          height: 40
                        }}
                      >
                        {stage.id}
                      </Avatar>
                      <Box>
                        <Typography variant="h6" fontWeight="bold">
                          {stage.name}
                        </Typography>
                        <Typography variant="body2" sx={{ opacity: 0.9 }}>
                          {stage.description}
                        </Typography>
                      </Box>
                    </Box>
                    
                    {activeStage === stage.id && (
                      <Chip 
                        icon={<PsychologyIcon />} 
                        label="Current Stage" 
                        sx={{ 
                          bgcolor: 'rgba(255,255,255,0.2)', 
                          color: 'white',
                          '& .MuiChip-icon': { color: 'white' }
                        }} 
                      />
                    )}
                  </Box>
                  
                  <Divider />
                  
                  <Box sx={{ p: { xs: 2, sm: 3 } }}>
                    <Grid container spacing={2}>
                      {stage.levels.map((level) => (
                        <Grid item xs={12} sm={6} md={3} key={level.id}>
                          <Card
                            elevation={level.isLocked ? 0 : 2}
                            sx={{
                              height: '100%',
                              cursor: level.isLocked ? 'not-allowed' : 'pointer',
                              opacity: level.isLocked ? 0.7 : 1,
                              transition: 'all 0.2s ease',
                              borderRadius: 2,
                              border: level.isLocked ? '1px dashed rgba(0,0,0,0.1)' : 'none',
                              position: 'relative',
                              overflow: 'hidden',
                              '&:hover': {
                                transform: level.isLocked ? 'none' : 'translateY(-4px)',
                                boxShadow: level.isLocked ? 'none' : '0 8px 16px rgba(0,0,0,0.1)',
                              },
                              bgcolor: level.isCompleted ? 'rgba(76, 175, 80, 0.05)' : 'white',
                            }}
                            onClick={() => !level.isLocked && handleLevelClick(stage.id, level.id)}
                          >
                            {level.isCompleted && (
                              <Box 
                                sx={{ 
                                  position: 'absolute', 
                                  top: 0, 
                                  right: 0,
                                  bgcolor: 'success.main',
                                  color: 'white',
                                  px: 1,
                                  py: 0.5,
                                  borderBottomLeftRadius: 8,
                                  fontSize: '0.75rem',
                                  fontWeight: 'bold',
                                  zIndex: 1
                                }}
                              >
                                COMPLETED
                              </Box>
                            )}
                            
                            <CardContent sx={{ p: 2.5 }}>
                              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                                <Typography 
                                  variant="h6" 
                                  sx={{ 
                                    fontSize: '1.1rem', 
                                    fontWeight: 'bold',
                                    color: level.isLocked ? 'text.disabled' : 'text.primary'
                                  }}
                                >
                                  Level {level.id}: {level.name}
                                </Typography>
                                {level.isLocked ? (
                                  <LockIcon color="disabled" />
                                ) : level.isCompleted ? (
                                  <CheckCircleIcon color="success" />
                                ) : (
                                  <ArrowForwardIcon sx={{ color: currentSubject.color }} />
                                )}
                              </Box>
                              
                              <Typography 
                                variant="body2" 
                                color={level.isLocked ? "text.disabled" : "text.secondary"} 
                                sx={{ mb: 2, minHeight: 40 }}
                              >
                                {level.description}
                              </Typography>
                              
                              <Box sx={{ mt: 'auto' }}>
                                <LinearProgress
                                  variant="determinate"
                                  value={level.progress}
                                  sx={{ 
                                    height: 8, 
                                    borderRadius: 4,
                                    bgcolor: 'rgba(0,0,0,0.05)',
                                    '& .MuiLinearProgress-bar': {
                                      bgcolor: level.isLocked ? 'text.disabled' : currentSubject.color,
                                    }
                                  }}
                                />
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                                  <Typography variant="caption" color="text.secondary">
                                    Progress
                                  </Typography>
                                  <Typography variant="caption" fontWeight="bold" color={level.isLocked ? "text.disabled" : "text.secondary"}>
                                    {level.progress}%
                                  </Typography>
                                </Box>
                                
                                {level.isCompleted && (
                                  <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
                                    <Button
                                      size="small"
                                      variant="outlined"
                                      color="primary"
                                      startIcon={<AssessmentIcon />}
                                      onClick={(e) => {
                                        e.stopPropagation(); // Prevent triggering the card click
                                        const levelKey = `${stage.id}-${level.id}`;
                                        const testData = testHistory[selectedSubject]?.[levelKey];
                                        if (testData) {
                                          setSelectedTestData(testData);
                                          setTestResultsOpen(true);
                                        }
                                      }}
                                    >
                                      View Results
                                    </Button>
                                  </Box>
                                )}
                              </Box>
                            </CardContent>
                          </Card>
                        </Grid>
                      ))}
                    </Grid>
                  </Box>
                </Paper>
              </motion.div>
            </Grid>
          ))}
        </Grid>

        {/* Test Results Dialog */}
        <TestResultDetails 
          open={testResultsOpen} 
          onClose={() => setTestResultsOpen(false)} 
          testData={selectedTestData} 
        />
      </Box>
    </motion.div>
  );
}

export default Progress; 