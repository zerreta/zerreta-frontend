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
  Button,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  FormControlLabel,
  FormGroup,
  TextField,
  Container,
  Accordion,
  AccordionSummary,
  AccordionDetails
} from '@mui/material';
import {
  Lock as LockIcon,
  CheckCircle as CheckCircleIcon,
  ArrowForward as ArrowForwardIcon,
  Timeline as TimelineIcon,
  School as SchoolIcon,
  Science as ScienceIcon,
  Biotech as BiotechIcon,
  Bolt as BoltIcon,
  EmojiEvents as TrophyIcon,
  Assessment as AssessmentIcon,
  Refresh as RefreshIcon,
  PlayArrow as PlayArrowIcon,
  Lightbulb as LightbulbIcon,
  BookmarkBorder as BookmarkIcon,
  PlayCircleOutline as PracticeIcon,
  HelpOutline as HelpIcon,
  FilterList as FilterIcon,
  Sort as SortIcon,
  Search as SearchIcon,
  Timer as TimerIcon,
  Add as AddIcon,
  ExpandMore as ExpandMoreIcon
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import axiosInstance from './axios-config';
import { useNavigate } from 'react-router-dom';

// Import topic arrays from Syllabus component
import { physicsTopics, chemistryTopics, biologyTopics } from './SyllabusData';

// Subject configuration with icons and colors
const subjects = [
  { id: 'physics', name: 'Physics', icon: <BoltIcon />, color: '#3f51b5', gradient: 'linear-gradient(135deg, #3f51b5 0%, #5c6bc0 100%)', topics: physicsTopics },
  { id: 'chemistry', name: 'Chemistry', icon: <ScienceIcon />, color: '#f44336', gradient: 'linear-gradient(135deg, #f44336 0%, #e57373 100%)', topics: chemistryTopics },
  { id: 'biology', name: 'Biology', icon: <BiotechIcon />, color: '#4caf50', gradient: 'linear-gradient(135deg, #4caf50 0%, #81c784 100%)', topics: biologyTopics },
];

// Assessment Dialog Component
const AssessmentDialog = ({ open, onClose, subject, onStartTest }) => {
  const [selectedTopics, setSelectedTopics] = useState([]);
  const [allTopics, setAllTopics] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectAll, setSelectAll] = useState(false);
  
  // Change default behavior to not pre-select any subjects
  const [selectedSubjects, setSelectedSubjects] = useState([]);
  
  const subjectData = subjects.find(s => s.id === subject) || subjects[0];
  
  useEffect(() => {
    // Reset selections when dialog opens
    setSelectedTopics([]);
    setSelectAll(false);
    setSearchQuery('');
    // Don't pre-select any subjects, show all topics
    setSelectedSubjects([]);
    
    // Get all topics from all subjects by default
    updateTopicsList(subjects.map(s => s.id));
  }, [open]);
  
  // Function to update topics list based on selected subjects
  const updateTopicsList = (subjectList) => {
    let combinedTopics = [];
    
    // If no subjects selected, show topics from all subjects
    const subjectsToShow = subjectList.length > 0 ? subjectList : subjects.map(s => s.id);
    
    subjectsToShow.forEach(subjectId => {
      const subjectTopics = subjects.find(s => s.id === subjectId)?.topics || [];
      // Add subject info to each topic for display
      const topicsWithSubject = subjectTopics.map(topic => ({
        ...topic,
        subjectId,
        subjectName: subjects.find(s => s.id === subjectId)?.name,
        subjectColor: subjects.find(s => s.id === subjectId)?.color,
      }));
      combinedTopics = [...combinedTopics, ...topicsWithSubject];
    });
    
    setAllTopics(combinedTopics);
  };
  
  const filteredTopics = allTopics.filter(topic => 
    topic.title.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const handleTopicToggle = (topicId, subjectId) => {
    const topicKey = `${subjectId}:${topicId}`;
    const currentIndex = selectedTopics.indexOf(topicKey);
    const newSelectedTopics = [...selectedTopics];
    
    if (currentIndex === -1) {
      newSelectedTopics.push(topicKey);
    } else {
      newSelectedTopics.splice(currentIndex, 1);
    }
    
    setSelectedTopics(newSelectedTopics);
    
    // Update selectAll state based on whether all filtered topics are selected
    setSelectAll(newSelectedTopics.length === filteredTopics.length);
  };
  
  const handleSelectAllToggle = () => {
    if (selectAll) {
      setSelectedTopics([]);
    } else {
      setSelectedTopics(filteredTopics.map(topic => `${topic.subjectId}:${topic.number}`));
    }
    setSelectAll(!selectAll);
  };
  
  const handleSubjectToggle = (subjectId) => {
    let newSelectedSubjects;
    
    if (selectedSubjects.includes(subjectId)) {
      // Remove subject if already selected
      newSelectedSubjects = selectedSubjects.filter(id => id !== subjectId);
    } else {
      // Add subject if not selected
      newSelectedSubjects = [...selectedSubjects, subjectId];
    }
    
    setSelectedSubjects(newSelectedSubjects);
    
    // Update topic list based on selected subjects
    // If no subjects selected, show all topics
    if (newSelectedSubjects.length === 0) {
      updateTopicsList(subjects.map(s => s.id));
    } else {
      updateTopicsList(newSelectedSubjects);
    }
  };
  
  const handleStartTest = () => {
    // Process selected topics by subject
    const topicsBySubject = {};
    
    selectedTopics.forEach(topicKey => {
      const [subjectId, topicId] = topicKey.split(':');
      
      if (!topicsBySubject[subjectId]) {
        topicsBySubject[subjectId] = [];
      }
      
      topicsBySubject[subjectId].push(topicId);
    });
    
    // Create list of subjects that have topics selected
    const subjectsWithSelectedTopics = Object.keys(topicsBySubject);
    
    onStartTest({
      multiSubject: true,
      topicsBySubject,
      selectedSubjects: subjectsWithSelectedTopics,
      questionCount: 40,
      combineQuestions: true // Flag to ensure questions are combined
    });
    onClose();
  };
  
  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      fullWidth
      maxWidth="sm"
    >
      <DialogTitle sx={{ bgcolor: subjectData.color, color: 'white' }}>
        <Box display="flex" alignItems="center" gap={1}>
          <AssessmentIcon />
          <Typography variant="h6">Create Multi-Subject Assessment</Typography>
        </Box>
      </DialogTitle>
      
      <DialogContent dividers>
        <DialogContentText paragraph>
          Select topics from one or more subjects. The assessment will generate a test with 40 questions from your selected topics.
        </DialogContentText>
        
        {/* Subject selection area with improved hover effects */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle2" gutterBottom>
            Filter by Subjects:
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {subjects.map(subj => (
              <Chip
                key={subj.id}
                icon={subj.icon}
                label={subj.name}
                onClick={() => handleSubjectToggle(subj.id)}
                sx={{ 
                  bgcolor: selectedSubjects.includes(subj.id) ? subj.color : 'default',
                  color: selectedSubjects.includes(subj.id) ? 'white' : 'text.primary',
                  '& .MuiChip-icon': {
                    color: selectedSubjects.includes(subj.id) ? 'white' : 'inherit',
                  },
                  '&:hover': {
                    bgcolor: selectedSubjects.includes(subj.id) 
                      ? `${subj.color}` // Full color if selected
                      : `${subj.color}22`, // Translucent version of subject color when not selected
                    color: selectedSubjects.includes(subj.id) ? 'white' : 
                           subj.id === 'physics' ? '#3f51b5' : 
                           subj.id === 'chemistry' ? '#f44336' : '#4caf50',
                    '& .MuiChip-icon': {
                      color: selectedSubjects.includes(subj.id) ? 'white' : 
                             subj.id === 'physics' ? '#3f51b5' : 
                             subj.id === 'chemistry' ? '#f44336' : '#4caf50',
                    },
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                    transform: 'translateY(-1px)'
                  },
                  transition: 'all 0.2s ease',
                  cursor: 'pointer'
                }}
              />
            ))}
          </Box>
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
            {selectedSubjects.length === 0 
              ? "Showing topics from all subjects" 
              : `Filtered to ${selectedSubjects.length} subject(s)`}
          </Typography>
        </Box>
        
        {/* Search and filter */}
        <Box sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
          <TextField
            fullWidth
            variant="outlined"
            size="small"
            placeholder="Search topics..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: <SearchIcon color="action" sx={{ mr: 1 }} />,
            }}
          />
        </Box>
        
        {/* Select all checkbox */}
        <FormControlLabel
          control={
            <Checkbox 
              checked={selectAll} 
              onChange={handleSelectAllToggle} 
              color="primary"
            />
          }
          label={`Select All (${filteredTopics.length} topics)`}
          sx={{ mb: 2 }}
        />
        
        {/* Topic list */}
        <Paper variant="outlined" sx={{ maxHeight: 350, overflow: 'auto', p: 1 }}>
          <FormGroup>
            {filteredTopics.map((topic) => (
              <FormControlLabel
                key={`${topic.subjectId}-${topic.number}`}
                control={
                  <Checkbox 
                    checked={selectedTopics.includes(`${topic.subjectId}:${topic.number}`)} 
                    onChange={() => handleTopicToggle(topic.number, topic.subjectId)} 
                    color="primary"
                  />
                }
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Chip 
                      size="small" 
                      label={topic.subjectName}
                      sx={{ 
                        mr: 1, 
                        bgcolor: topic.subjectColor,
                        color: 'white',
                        fontSize: '0.7rem',
                        height: 20
                      }}
                    />
                    {topic.number}. {topic.title}
                  </Box>
                }
              />
            ))}
          </FormGroup>
        </Paper>
        
        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography>
            Selected: <Chip 
              label={`${selectedTopics.length} topics`} 
              color="primary" 
              size="small"
            />
          </Typography>
          
          <Typography>
            Questions: <Chip 
              label="40 questions" 
              color="secondary" 
              size="small"
            />
          </Typography>
        </Box>
      </DialogContent>
      
      <DialogActions>
        <Button onClick={onClose} color="inherit">Cancel</Button>
        <Button 
          onClick={handleStartTest}
          color="primary"
          variant="contained"
          startIcon={<PlayArrowIcon />}
          disabled={selectedTopics.length === 0}
        >
          Start Combined Assessment
        </Button>
      </DialogActions>
    </Dialog>
  );
};

function Progress() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  
  const [selectedSubject, setSelectedSubject] = useState('physics');
  const [studentData, setStudentData] = useState(null);
  const [topicProgress, setTopicProgress] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Assessment dialog state
  const [assessmentDialogOpen, setAssessmentDialogOpen] = useState(false);
  
  // Topic filtering and sorting
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('number'); // 'number', 'name', 'progress'
  
  // Add this after fetchTopicProgress function
  const [testHistory, setTestHistory] = useState({});
  
  // New state variables for multi-subject selection
  const [selectedSubjects, setSelectedSubjects] = useState([]);
  const [topicsBySubject, setTopicsBySubject] = useState({});
  const [timeLimit, setTimeLimit] = useState(40);
  const [questionCount, setQuestionCount] = useState(45);
  const [selectedTopics, setSelectedTopics] = useState([]);
  
  useEffect(() => {
    fetchStudentData();
    fetchTopicProgress();
    fetchTestHistory();
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

      const response = await axiosInstance.get('/student/profile');
      setStudentData(response.data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching student data:", err);
      setError('Failed to fetch student data. Please try again later.');
      setLoading(false);
    }
  };

  const fetchTopicProgress = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('Authentication token missing');
        return;
      }

      // Try to get topic progress from the API
      try {
        const response = await axiosInstance.get('/student/topic-progress');
        setTopicProgress(response.data);
      } catch (err) {
        console.error("Error fetching topic progress:", err);
        
        // If API call fails, generate mock progress data ONLY if we don't have real data yet
        if (Object.keys(topicProgress).length === 0) {
          const mockProgress = {};
          
          subjects.forEach(subject => {
            mockProgress[subject.id] = {};
            
            subject.topics.forEach(topic => {
              // Generate random progress between 0-100 for demo purposes
              const progress = Math.floor(Math.random() * 100);
              mockProgress[subject.id][topic.number] = {
                progress,
                completed: progress === 100,
                attemptsCount: Math.floor(Math.random() * 5),
                lastAttemptDate: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString()
              };
            });
          });
          
          setTopicProgress(mockProgress);
        }
      }
    } catch (err) {
      console.error("Error in topic progress:", err);
    }
  };

  const fetchTestHistory = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('Authentication token missing');
        return;
      }

      // Fetch all test history
      const response = await axiosInstance.get('/student/all-test-history');
      console.log('Fetched test history:', response.data);
      
      if (response.data && Array.isArray(response.data)) {
        // Process and organize by subject and topic
        const organizedHistory = {};
        
        response.data.forEach(test => {
          const subjectId = test.subject.toLowerCase();
          
          // Initialize subject if not present
          if (!organizedHistory[subjectId]) {
            organizedHistory[subjectId] = {};
          }
          
          // Handle both topic-based and legacy tests
          if (test.testMode === 'practice' && test.topicNumber) {
            // For practice tests with topic numbers
            if (!organizedHistory[subjectId][test.topicNumber]) {
              organizedHistory[subjectId][test.topicNumber] = [];
            }
            organizedHistory[subjectId][test.topicNumber].push(test);
          } else if (test.stage === 'topic') {
            // Alternative format where topic is stored in level
            if (!organizedHistory[subjectId][test.level]) {
              organizedHistory[subjectId][test.level] = [];
            }
            organizedHistory[subjectId][test.level].push(test);
          }
        });
        
        // Sort attempts by date (newest first)
        Object.keys(organizedHistory).forEach(subject => {
          Object.keys(organizedHistory[subject]).forEach(topic => {
            organizedHistory[subject][topic].sort((a, b) => 
              new Date(b.date) - new Date(a.date)
            );
          });
        });
        
        setTestHistory(organizedHistory);
        
        // Use test history to enhance topic progress data
        updateTopicProgressFromTestHistory(organizedHistory);
      }
    } catch (error) {
      console.error('Error fetching test history:', error);
    }
  };

  const updateTopicProgressFromTestHistory = (history) => {
    const updatedProgress = { ...topicProgress };
    
    // Loop through each subject
    Object.keys(history).forEach(subject => {
      if (!updatedProgress[subject]) {
        updatedProgress[subject] = {};
      }
      
      // Loop through each topic
      Object.keys(history[subject]).forEach(topicNumber => {
        const topicAttempts = history[subject][topicNumber];
        
        if (topicAttempts && topicAttempts.length > 0) {
          // Get most recent attempt
          const latestAttempt = topicAttempts[0];
          
          // Update or create progress entry
          updatedProgress[subject][topicNumber] = {
            progress: latestAttempt.score || 0,
            completed: (latestAttempt.score || 0) >= 70,
            attemptsCount: topicAttempts.length,
            lastAttemptDate: latestAttempt.date,
            attempts: topicAttempts.map(a => ({
              date: new Date(a.date).toLocaleDateString(),
              score: a.score,
              timeTaken: a.totalTime || 0,
              questionsCount: a.questions?.length || 0,
              correctCount: a.questions?.filter(q => q.isCorrect).length || 0,
              _id: a._id
            }))
          };
        }
      });
    });
    
    setTopicProgress(updatedProgress);
  };

  const handleSubjectChange = (event, newValue) => {
    setSelectedSubject(newValue);
    setSearchQuery(''); // Reset search when changing subjects
  };

  const handleStartPracticeTest = (topicNumber) => {
    navigate('/test', { 
      state: { 
        subject: selectedSubject, 
        topicNumber: topicNumber,
        mode: 'practice'
      } 
    });
  };
  
  const handleStartAssessment = () => {
    if (selectedSubject && selectedTopics.length > 0) {
      // Regular assessment flow
      navigate('/test', {
        state: {
          mode: 'assessment',
          subject: selectedSubject,
          topics: selectedTopics,
          questionCount: questionCount || 40
        }
      });
      setAssessmentDialogOpen(false);
    } else if (selectedSubjects.length > 0 && Object.keys(topicsBySubject).length > 0) {
      // Format the topicsBySubject object properly
      const formattedTopicsBySubject = {};
      
      // Ensure each selected subject has a valid array of topic IDs
      selectedSubjects.forEach(subjectId => {
        if (topicsBySubject[subjectId] && topicsBySubject[subjectId].length > 0) {
          // Convert topic IDs to strings if they're not already
          formattedTopicsBySubject[subjectId] = topicsBySubject[subjectId].map(topicId => 
            typeof topicId === 'string' ? topicId : String(topicId)
          );
        }
      });
      
      console.log("Starting combined test with:", {
        selectedSubjects,
        topicsBySubject: formattedTopicsBySubject,
        questionCount,
        timeLimit
      });
      
      // Combined assessment flow
      navigate('/test', {
        state: {
          mode: 'assessment',
          multiSubject: true,
          selectedSubjects: selectedSubjects,
          topicsBySubject: formattedTopicsBySubject,
          questionCount: questionCount || 40,
          timeLimit: timeLimit
        }
      });
    }
  };
  
  // Function to handle subject selection in advanced assessment
  const handleSubjectToggle = (subjectId) => {
    setSelectedSubjects(prev => {
      if (prev.includes(subjectId)) {
        // Remove subject and its topics
        const newSelected = prev.filter(id => id !== subjectId);
        setTopicsBySubject(prevTopics => {
          const newTopics = {...prevTopics};
          delete newTopics[subjectId];
          return newTopics;
        });
        return newSelected;
      } else {
        // Add subject
        return [...prev, subjectId];
      }
    });
  };

  // Function to handle topic selection for a specific subject
  const handleTopicToggle = (subjectId, topicId) => {
    setTopicsBySubject(prev => {
      const subjectTopics = prev[subjectId] || [];
      
      if (subjectTopics.includes(topicId)) {
        // Remove topic
        return {
          ...prev,
          [subjectId]: subjectTopics.filter(id => id !== topicId)
        };
      } else {
        // Add topic
        return {
          ...prev,
          [subjectId]: [...subjectTopics, topicId]
        };
      }
    });
  };

  // Function to select all topics for a subject
  const selectAllTopicsForSubject = (subjectId) => {
    const subjectData = subjects.find(s => s._id === subjectId);
    if (subjectData && subjectData.topics) {
      const allTopicIds = subjectData.topics.map(topic => topic._id);
      setTopicsBySubject(prev => ({
        ...prev,
        [subjectId]: allTopicIds
      }));
    }
  };
  
  // Sort and filter topics
  const getFilteredAndSortedTopics = () => {
    const currentSubject = subjects.find(s => s.id === selectedSubject);
    if (!currentSubject) return [];
    
    let filteredTopics = [...currentSubject.topics];
    
    // Apply search filter
    if (searchQuery) {
      filteredTopics = filteredTopics.filter(topic => 
        topic.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        topic.number.includes(searchQuery)
      );
    }
    
    // Apply sorting
    filteredTopics.sort((a, b) => {
      if (sortBy === 'number') {
        return parseInt(a.number) - parseInt(b.number);
      } else if (sortBy === 'name') {
        return a.title.localeCompare(b.title);
      } else if (sortBy === 'progress') {
        const progressA = topicProgress[selectedSubject]?.[a.number]?.progress || 0;
        const progressB = topicProgress[selectedSubject]?.[b.number]?.progress || 0;
        return progressB - progressA; // Higher progress first
      }
      return 0;
    });
    
    return filteredTopics;
  };
  
  // Calculate overall progress for the selected subject
  const calculateOverallProgress = () => {
    if (!topicProgress || !topicProgress[selectedSubject]) {
      return 0;
    }
    
    const currentSubject = subjects.find(s => s.id === selectedSubject);
    if (!currentSubject) return 0;
    
    const topicCount = currentSubject.topics.length;
    let totalProgress = 0;
    
    currentSubject.topics.forEach(topic => {
      totalProgress += topicProgress[selectedSubject][topic.number]?.progress || 0;
    });
    
    return Math.round(totalProgress / topicCount);
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

  // Get current subject info
  const currentSubject = subjects.find(s => s.id === selectedSubject) || subjects[0];
  const filteredTopics = getFilteredAndSortedTopics();

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
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Paper 
            elevation={4} 
            sx={{ 
              p: { xs: 2, md: 4 }, 
              background: currentSubject.gradient, 
              color: 'white',
              borderRadius: 3,
              mb: 4
            }}
          >
            <Grid container spacing={3} alignItems="center">
              <Grid item xs={12} md={7}>
                <Typography variant="h3" fontWeight="bold" gutterBottom>
                  Your Learning Journey
                </Typography>
                <Typography variant="h5" sx={{ mb: 2, opacity: 0.9 }}>
                  {currentSubject.name}
                </Typography>
                <Typography variant="body1" sx={{ mb: 3, maxWidth: 600 }}>
                  Track your progress through {currentSubject.topics.length} topics, practice with topic-specific tests, 
                  and master NEET concepts through our structured learning path.
                </Typography>
                
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
                  <Chip 
                    icon={<AssessmentIcon />} 
                    label={`${currentSubject.topics.length} Topics`} 
                    sx={{ 
                      bgcolor: 'rgba(255,255,255,0.2)', 
                      color: 'white',
                      fontWeight: 'bold',
                      '& .MuiChip-icon': { color: 'white' }
                    }} 
                  />
                  <Chip 
                    icon={<TimelineIcon />} 
                    label={`${calculateOverallProgress()}% Complete`} 
                    sx={{ 
                      bgcolor: 'rgba(255,255,255,0.2)', 
                      color: 'white',
                      fontWeight: 'bold',
                      '& .MuiChip-icon': { color: 'white' }
                    }} 
                  />
                  <Box sx={{ display: 'flex', gap: 2, ml: 'auto' }}>
                    <Button
                      variant="contained"
                      color="secondary"
                      size="medium"
                      startIcon={<AssessmentIcon />}
                      onClick={() => navigate('/advanced-assessment')}
                      sx={{ 
                        bgcolor: 'rgba(255,255,255,0.3)',
                        '&:hover': {
                          bgcolor: '#ffffff',
                          color: currentSubject.color,
                          '& .MuiSvgIcon-root': { color: currentSubject.color }
                        },
                        transition: 'all 0.2s'
                      }}
                    >
                      Combined Assessment
                    </Button>
                    <Button
                      variant="contained"
                      color="secondary"
                      size="medium"
                      startIcon={<PlayArrowIcon />}
                      onClick={() => setAssessmentDialogOpen(true)}
                      sx={{ 
                        bgcolor: 'rgba(255,255,255,0.3)',
                        '&:hover': {
                          bgcolor: 'rgba(255,255,255,0.5)'
                        }
                      }}
                    >
                      Quick Assessment
                    </Button>
                  </Box>
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
          </Paper>
        </motion.div>

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

        {/* Search, Filter, and Sort Controls */}
        <Paper elevation={1} sx={{ p: 2, mb: 3, borderRadius: 2 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                variant="outlined"
                size="small"
                placeholder="Search topics..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                InputProps={{
                  startAdornment: <SearchIcon color="action" sx={{ mr: 1 }} />,
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl size="small" fullWidth>
                <InputLabel id="sort-select-label">Sort By</InputLabel>
                <Select
                  labelId="sort-select-label"
                  value={sortBy}
                  label="Sort By"
                  onChange={(e) => setSortBy(e.target.value)}
                  startAdornment={<SortIcon color="action" sx={{ mr: 1 }} />}
                >
                  <MenuItem value="number">Topic Number</MenuItem>
                  <MenuItem value="name">Topic Name</MenuItem>
                  <MenuItem value="progress">Progress (High to Low)</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </Paper>

        {/* Topics Grid */}
        <Grid container spacing={3}>
          {filteredTopics.map((topic) => {
            const topicData = topicProgress[selectedSubject]?.[topic.number] || { 
              progress: 0, 
              completed: false,
              attemptsCount: 0,
              lastAttemptDate: null
            };
            
            return (
              <Grid item xs={12} sm={6} md={4} key={topic.number}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: parseInt(topic.number) * 0.03 }}
                >
                  <Card 
                    elevation={2}
                    sx={{ 
                      height: '100%',
                      borderRadius: 2,
                      transition: 'all 0.2s ease',
                      overflow: 'hidden',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
                      },
                      border: topicData.completed ? `2px solid ${theme.palette.success.main}` : 'none',
                    }}
                  >
                    <CardContent sx={{ p: 2.5, height: 'calc(100% - 8px)' }}>
                      <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 1.5 }}>
                        <Avatar 
                          sx={{ 
                            bgcolor: topicData.completed ? theme.palette.success.main : currentSubject.color,
                            width: 32,
                            height: 32,
                            mr: 1.5,
                            fontWeight: 'bold',
                            fontSize: '0.875rem'
                          }}
                        >
                          {topic.number}
                        </Avatar>
                        <Typography 
                          variant="h6" 
                          sx={{ 
                            fontSize: '1rem', 
                            fontWeight: 'bold',
                            lineHeight: 1.3,
                            mb: 0.5
                          }}
                        >
                          {topic.title}
                        </Typography>
                      </Box>
                      
                      {/* Show last attempt if available */}
                      {topicData.attempts && topicData.attempts.length > 0 && (
                        <Box sx={{ mb: 1.5 }}>
                          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
                            Last attempt: {new Date(topicData.lastAttemptDate).toLocaleDateString()}
                          </Typography>
                          <Box sx={{ 
                            display: 'flex', 
                            justifyContent: 'space-between', 
                            bgcolor: 'rgba(0,0,0,0.02)', 
                            p: 0.75, 
                            borderRadius: 1 
                          }}>
                            <Typography variant="caption">
                              Score: <strong>{topicData.attempts[0].score}%</strong>
                            </Typography>
                            <Typography variant="caption">
                              {topicData.attempts[0].correctCount}/{topicData.attempts[0].questionsCount} correct
                            </Typography>
                          </Box>
                        </Box>
                      )}
                      
                      <Divider sx={{ my: 1.5 }} />
                      
                      <Box sx={{ 
                        display: 'flex', 
                        flexDirection: 'column',
                        gap: 1.5, 
                        mt: 'auto',
                        width: '100%'
                      }}>
                        {/* Add test info */}
                        <Typography 
                          variant="caption" 
                          sx={{ 
                            textAlign: 'center', 
                            color: 'text.secondary',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: 0.5,
                            fontSize: '0.75rem'
                          }}
                        >
                          <TimerIcon fontSize="inherit" /> 45mins • 45 questions
                        </Typography>
                        
                        <Button
                          variant="contained"
                          color={selectedSubject === 'physics' ? 'primary' : (selectedSubject === 'chemistry' ? 'error' : 'success')}
                          size="small"
                          startIcon={<PracticeIcon />}
                          onClick={() => handleStartPracticeTest(topic.number)}
                          fullWidth
                          sx={{
                            bgcolor: currentSubject.color,
                            transition: 'all 0.2s ease',
                            '&:hover': {
                              bgcolor: '#ffffff',
                              color: currentSubject.color,
                              '& .MuiSvgIcon-root': {
                                color: currentSubject.color
                              },
                              boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                              transform: 'translateY(-2px)'
                            }
                          }}
                        >
                          Practice Test
                        </Button>
                      </Box>
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
            );
          })}
        </Grid>
        
        {filteredTopics.length === 0 && (
          <Box sx={{ textAlign: 'center', py: 6 }}>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No topics found matching "{searchQuery}"
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Try a different search term or clear the search
            </Typography>
          </Box>
        )}
        
        {/* Assessment Dialog */}
        <AssessmentDialog
          open={assessmentDialogOpen}
          onClose={() => setAssessmentDialogOpen(false)}
          subject={selectedSubject}
          onStartTest={handleStartAssessment}
        />
      </Box>
    </motion.div>
  );
}

export default Progress; 