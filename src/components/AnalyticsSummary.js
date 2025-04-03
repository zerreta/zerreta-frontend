import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CircularProgress,
  Paper,
  Divider,
  Chip,
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Button,
  TextField,
  Tab,
  Tabs,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  useTheme,
  LinearProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Slider,
  ListItemIcon
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
  LineChart,
  Line,
  AreaChart,
  Area,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from 'recharts';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import SchoolIcon from '@mui/icons-material/School';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import PsychologyIcon from '@mui/icons-material/Psychology';
import InsightsIcon from '@mui/icons-material/Insights';
import AutoGraphIcon from '@mui/icons-material/AutoGraph';
import LocalLibraryIcon from '@mui/icons-material/LocalLibrary';
import AssessmentIcon from '@mui/icons-material/Assessment';
import BiotechIcon from '@mui/icons-material/Biotech';
import ScienceIcon from '@mui/icons-material/Science';
import PrecisionManufacturingIcon from '@mui/icons-material/PrecisionManufacturing';
import SpeedIcon from '@mui/icons-material/Speed';
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PriorityHighIcon from '@mui/icons-material/PriorityHigh';
import TimelineIcon from '@mui/icons-material/Timeline';
import GroupIcon from '@mui/icons-material/Group';
import SentimentSatisfiedAltIcon from '@mui/icons-material/SentimentSatisfiedAlt';
import SentimentDissatisfiedIcon from '@mui/icons-material/SentimentDissatisfied';
import SentimentNeutralIcon from '@mui/icons-material/SentimentNeutral';
import SentimentVeryDissatisfiedIcon from '@mui/icons-material/SentimentVeryDissatisfied';
import LoadingDots from './LoadingDots';
import FaceIcon from '@mui/icons-material/Face';
import EmotionTracker from './EmotionTracker';
import EmotionSummary from './EmotionSummary';
import emotionUtils from '../utils/emotionUtils';
import RealTimeEmotionDetector from './RealTimeEmotionDetector';
import VideocamIcon from '@mui/icons-material/Videocam';

// Define the subjects
const subjects = [
  { id: 'physics', name: 'Physics', color: '#FF6384', icon: PrecisionManufacturingIcon },
  { id: 'chemistry', name: 'Chemistry', color: '#36A2EB', icon: ScienceIcon },
  { id: 'biology', name: 'Biology', color: '#4BC0C0', icon: BiotechIcon }
];

// Mock topics for each subject
const topicsBySubject = {
  physics: [
    { id: 'mechanics', name: 'Mechanics', mastery: 85 },
    { id: 'electromagnetism', name: 'Electromagnetism', mastery: 72 },
    { id: 'optics', name: 'Optics', mastery: 90 },
    { id: 'thermodynamics', name: 'Thermodynamics', mastery: 65 },
    { id: 'modern_physics', name: 'Modern Physics', mastery: 60 }
  ],
  chemistry: [
    { id: 'physical', name: 'Physical Chemistry', mastery: 82 },
    { id: 'organic', name: 'Organic Chemistry', mastery: 75 },
    { id: 'inorganic', name: 'Inorganic Chemistry', mastery: 68 },
    { id: 'analytical', name: 'Analytical Chemistry', mastery: 60 },
    { id: 'biochemistry', name: 'Biochemistry', mastery: 70 }
  ],
  biology: [
    { id: 'plant_morphology', name: 'Plant Morphology', mastery: 88 },
    { id: 'plant_physiology', name: 'Plant Physiology', mastery: 80 },
    { id: 'cell_biology', name: 'Cell Biology', mastery: 85 },
    { id: 'genetics', name: 'Genetics', mastery: 79 },
    { id: 'human_physiology', name: 'Human Physiology', mastery: 82 }
  ]
};

// Mock performance history data
const performanceHistory = [
  { month: 'Jan', physics: 65, chemistry: 58, biology: 50, average: 54 },
  { month: 'Feb', physics: 68, chemistry: 62, biology: 55, average: 58 },
  { month: 'Mar', physics: 72, chemistry: 67, biology: 63, average: 63 },
  { month: 'Apr', physics: 78, chemistry: 70, biology: 68, average: 69 },
  { month: 'May', physics: 82, chemistry: 73, biology: 72, average: 73 },
  { month: 'Jun', physics: 85, chemistry: 78, biology: 75, average: 76 }
];

// Mock test attempts data
const testAttempts = [
  { id: 1, subject: 'Physics', date: '2023-06-10', score: 85, timeSpent: 40, questionsSolved: 30, accuracy: 85 },
  { id: 2, subject: 'Chemistry', date: '2023-06-05', score: 78, timeSpent: 45, questionsSolved: 30, accuracy: 78 },
  { id: 3, subject: 'Biology', date: '2023-05-28', score: 75, timeSpent: 42, questionsSolved: 30, accuracy: 75 },
  { id: 4, subject: 'Biology', date: '2023-05-20', score: 68, timeSpent: 47, questionsSolved: 30, accuracy: 68 },
  { id: 5, subject: 'Physics', date: '2023-05-15', score: 80, timeSpent: 43, questionsSolved: 30, accuracy: 80 }
];

// Mock question response patterns
const questionTypeAnalysis = [
  { type: 'Conceptual', correct: 82, incorrect: 18 },
  { type: 'Numerical', correct: 70, incorrect: 30 },
  { type: 'Application', correct: 75, incorrect: 25 },
  { type: 'Memory-based', correct: 88, incorrect: 12 },
  { type: 'Diagram-based', correct: 65, incorrect: 35 }
];

// Comparative analysis data
const comparativeData = [
  { subject: 'Physics', studentScore: 85, peerAverage: 72 },
  { subject: 'Chemistry', studentScore: 78, peerAverage: 70 },
  { subject: 'Biology', studentScore: 75, peerAverage: 68 },
  { subject: 'Overall', studentScore: 76, peerAverage: 69 }
];

// Helper function to load data from localStorage or return default values
const loadDataFromStorage = (key, defaultValue) => {
  try {
    const storedData = localStorage.getItem(`analytics_${key}`);
    return storedData ? JSON.parse(storedData) : defaultValue;
  } catch (error) {
    console.error(`Error loading ${key} data:`, error);
    return defaultValue;
  }
};

// Helper function to save data to localStorage
const saveDataToStorage = (key, data) => {
  try {
    localStorage.setItem(`analytics_${key}`, JSON.stringify(data));
    return true;
  } catch (error) {
    console.error(`Error saving ${key} data:`, error);
    return false;
  }
};

// Helper function to convert emotion to icon
const getEmotionIcon = (emotion) => {
  switch(emotion) {
    case 'happy':
      return <SentimentSatisfiedAltIcon color="success" />;
    case 'sad':
    case 'confused':
      return <SentimentDissatisfiedIcon color="warning" />;
    case 'angry':
      return <SentimentVeryDissatisfiedIcon color="error" />;
    case 'focused':
      return <PsychologyIcon color="primary" />;
    default:
      return <SentimentNeutralIcon color="action" />;
  }
};

// Helper function to convert emotion to color
const getEmotionColor = (emotion, theme) => {
  switch(emotion) {
    case 'happy':
      return theme.palette.success.main;
    case 'focused':
      return theme.palette.primary.main;
    case 'sad':
    case 'confused':
      return theme.palette.warning.main;
    case 'angry':
      return theme.palette.error.main;
    case 'surprised':
      return theme.palette.info.main;
    default:
      return theme.palette.text.secondary;
  }
};

function AnalyticsSummary() {
  const theme = useTheme();
  const [studentData, setStudentData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [aiLoading, setAiLoading] = useState(false);
  const [error, setError] = useState('');
  const [subjectProgress, setSubjectProgress] = useState([]);
  const [aiSummary, setAiSummary] = useState(null);
  const [nPoints, setNPoints] = useState(0);
  const [customQuestion, setCustomQuestion] = useState('');
  const [activeTab, setActiveTab] = useState(0);
  const [selectedSubject, setSelectedSubject] = useState('physics');
  
  // Replace localStorage states with direct API-based states
  const [realTopicsData, setRealTopicsData] = useState(topicsBySubject);
  const [realPerformanceHistory, setRealPerformanceHistory] = useState(performanceHistory);
  const [realTestAttempts, setRealTestAttempts] = useState([]);
  const [recentTestAttempts, setRecentTestAttempts] = useState([]); // Store last 3 tests
  const [realQuestionTypeAnalysis, setRealQuestionTypeAnalysis] = useState(questionTypeAnalysis);
  const [realComparativeData, setRealComparativeData] = useState(comparativeData);
  const [testHistory, setTestHistory] = useState([]);
  const [topicPerformance, setTopicPerformance] = useState({});
  
  // Add state to track if data entry dialog is open
  const [dataEntryOpen, setDataEntryOpen] = useState(false);
  const [newTestData, setNewTestData] = useState({
    subject: 'Physics',
    date: new Date().toISOString().split('T')[0],
    score: 75,
    timeSpent: 40,
    questionsSolved: 30,
    accuracy: 75
  });
  
  // New state for emotion tracking
  const [isEmotionTrackingActive, setIsEmotionTrackingActive] = useState(false);
  const [emotionData, setEmotionData] = useState([]);
  const [showEmotionTrackerDialog, setShowEmotionTrackerDialog] = useState(false);
  
  // Add state for real-time emotion detection
  const [showRealTimeDetector, setShowRealTimeDetector] = useState(false);
  const [realTimePermissionDialog, setRealTimePermissionDialog] = useState(false);

  useEffect(() => {
    fetchStudentData();
    fetchTestHistory();
  }, []);

  // Fetch student profile data
  const fetchStudentData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Authentication token missing. Please log in again.');
        setLoading(false);
        return;
      }

      // Get student profile
      const profileResponse = await axios.get('http://localhost:5000/student/profile', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (!profileResponse.data) {
        throw new Error('No data received from server');
      }
      
      setStudentData(profileResponse.data);
      
      // Calculate N.POINTS
      if (profileResponse.data.subjects) {
        const { physics, chemistry, biology } = profileResponse.data.subjects;
        
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
      
      // Calculate progress for each subject
      if (profileResponse.data.subjects) {
        const progress = calculateSubjectProgress(profileResponse.data.subjects);
        setSubjectProgress(progress);
      }
      
      // Simulate a delay for API call
      setTimeout(() => {
        generateAISummary(profileResponse.data);
        setLoading(false);
      }, 1000);
      
    } catch (err) {
      console.error("Error fetching student data:", err);
      setError(`Failed to fetch student data: ${err.message}`);
      
      // Use mock data if API fails
      const mockSubjects = {
        physics: { level: '3', stage: '4' },
        chemistry: { level: '3', stage: '3' },
        biology: { level: '2', stage: '4' }
      };
      
      setStudentData({
        name: 'Student',
        subjects: mockSubjects
      });
      
      const progress = calculateSubjectProgress(mockSubjects);
      setSubjectProgress(progress);
      
      // Mock N.POINTS
      setNPoints(225);
      
      // Generate AI summary with mock data
      setTimeout(() => {
        generateAISummary({ name: 'Student', subjects: mockSubjects });
        setLoading(false);
      }, 1000);
    }
  };

  // Optimized version of fetch test history for faster performance
  const fetchTestHistory = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        return;
      }

      console.time('fetchTestHistory'); // Performance measurement start
      
      // Get all test attempts - use a query param to limit to recent tests if needed
      const response = await axios.get('http://localhost:5000/student/tests', {
        headers: { 'Authorization': `Bearer ${token}` },
        params: { limit: 50 } // Optionally limit the number of tests returned
      });

      if (response.data && Array.isArray(response.data)) {
        // Use more efficient data processing

        // Create an efficient data structure - Map provides faster lookups than array
        const testMap = new Map();
        
        // Process the tests once and derive all required data in a single pass
        const processedData = {
          sortedTests: [],
          formattedTests: [],
          subjectPerformance: {
            physics: { scores: [], totalTime: 0, totalQuestions: 0, correctAnswers: 0 },
            chemistry: { scores: [], totalTime: 0, totalQuestions: 0, correctAnswers: 0 },
            biology: { scores: [], totalTime: 0, totalQuestions: 0, correctAnswers: 0 }
          },
          monthlyPerformance: new Map(),
          topicPerformance: {},
          questionTypes: {
            'Conceptual': { correct: 0, incorrect: 0 },
            'Numerical': { correct: 0, incorrect: 0 },
            'Application': { correct: 0, incorrect: 0 },
            'Memory-based': { correct: 0, incorrect: 0 },
            'Diagram-based': { correct: 0, incorrect: 0 }
          }
        };
        
        // Process all tests in a single pass - O(n) operation
        response.data.forEach((test, index) => {
          // Store the test in our map
          testMap.set(test.id, test);
          
          // Basic test data processing
          const testDate = new Date(test.completedAt);
          const formattedDate = testDate.toISOString().split('T')[0];
          const subject = test.subject.toLowerCase();
          const accuracy = Math.round((test.correctAnswers / test.totalQuestions) * 100);
          
          // Create processed test object
          const processedTest = {
            id: index + 1,
            rawId: test.id,
            subject: test.subject,
            date: formattedDate,
            score: test.score,
            timeSpent: Math.round(test.totalTime / 60),
            questionsSolved: test.totalQuestions,
            accuracy: accuracy,
            topicPerformance: test.topicPerformance || [],
            timestamp: testDate.getTime() // For efficient sorting
          };
          
          processedData.sortedTests.push(test);
          processedData.formattedTests.push(processedTest);
          
          // Track subject performance
          if (processedData.subjectPerformance[subject]) {
            processedData.subjectPerformance[subject].scores.push(test.score);
            processedData.subjectPerformance[subject].totalTime += test.totalTime;
            processedData.subjectPerformance[subject].totalQuestions += test.totalQuestions;
            processedData.subjectPerformance[subject].correctAnswers += test.correctAnswers;
          }
          
          // Track monthly performance
          const monthYear = `${testDate.toLocaleString('default', { month: 'short' })}-${testDate.getFullYear()}`;
          if (!processedData.monthlyPerformance.has(monthYear)) {
            processedData.monthlyPerformance.set(monthYear, {
              physics: [],
              chemistry: [],
              biology: [],
              month: testDate.toLocaleString('default', { month: 'short' })
            });
          }
          
          if (subject === 'physics' || subject === 'chemistry' || subject === 'biology') {
            processedData.monthlyPerformance.get(monthYear)[subject].push(test.score);
          }
          
          // Process topics and questions
          if (test.questions) {
            test.questions.forEach(question => {
              // Process topic data
              if (question.topic) {
                const topic = question.topic;
                
                if (!processedData.topicPerformance[subject]) {
                  processedData.topicPerformance[subject] = {};
                }
                
                if (!processedData.topicPerformance[subject][topic]) {
                  processedData.topicPerformance[subject][topic] = {
                    total: 0,
                    correct: 0
                  };
                }
                
                processedData.topicPerformance[subject][topic].total++;
                if (question.isCorrect) {
                  processedData.topicPerformance[subject][topic].correct++;
                }
              }
              
              // Process question type data
              if (question.type) {
                let type = 'Conceptual'; // Default
                
                if (question.type.includes('numerical') || question.type.includes('calculation')) {
                  type = 'Numerical';
                } else if (question.type.includes('application')) {
                  type = 'Application';
                } else if (question.type.includes('memory') || question.type.includes('recall')) {
                  type = 'Memory-based';
                } else if (question.type.includes('diagram') || question.type.includes('visual')) {
                  type = 'Diagram-based';
                }
                
                if (question.isCorrect) {
                  processedData.questionTypes[type].correct++;
                } else {
                  processedData.questionTypes[type].incorrect++;
                }
              }
            });
          }
        });
        
        // Sort tests efficiently by timestamp (pre-computed)
        processedData.formattedTests.sort((a, b) => b.timestamp - a.timestamp);
        processedData.sortedTests.sort((a, b) => new Date(b.completedAt) - new Date(a.completedAt));
        
        // Store all tests
        setTestHistory(processedData.sortedTests);
        
        // Only keep the most recent 3 tests for quick access
        setRecentTestAttempts(processedData.sortedTests.slice(0, 3));
        
        // Set formatted tests
        setRealTestAttempts(processedData.formattedTests);
        
        // Process monthly performance data
        const performanceData = [];
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        
        processedData.monthlyPerformance.forEach((data, monthYear) => {
          const physics = data.physics.length > 0 
            ? Math.round(data.physics.reduce((a, b) => a + b, 0) / data.physics.length) 
            : 0;
          
          const chemistry = data.chemistry.length > 0 
            ? Math.round(data.chemistry.reduce((a, b) => a + b, 0) / data.chemistry.length) 
            : 0;
          
          const biology = data.biology.length > 0 
            ? Math.round(data.biology.reduce((a, b) => a + b, 0) / data.biology.length) 
            : 0;
          
          // Calculate overall average
          let validScores = 0;
          let totalScore = 0;
          
          if (physics > 0) { totalScore += physics; validScores++; }
          if (chemistry > 0) { totalScore += chemistry; validScores++; }
          if (biology > 0) { totalScore += biology; validScores++; }
          
          const average = validScores > 0 ? Math.round(totalScore / validScores) : 0;
          
          performanceData.push({
            month: data.month,
            physics,
            chemistry,
            biology,
            average,
            monthIndex: months.indexOf(data.month)
          });
        });
        
        // Sort by month chronologically
        performanceData.sort((a, b) => a.monthIndex - b.monthIndex);
        setRealPerformanceHistory(performanceData);
        
        // Process topic performance
        const updatedTopicsData = { ...realTopicsData };
        for (const subject in processedData.topicPerformance) {
          if (!updatedTopicsData[subject]) continue;
          
          for (const topic in processedData.topicPerformance[subject]) {
            const topicStats = processedData.topicPerformance[subject][topic];
            const masteryPercentage = Math.round((topicStats.correct / topicStats.total) * 100);
            
            // Find the topic in our existing data structure
            const existingTopicIndex = updatedTopicsData[subject].findIndex(t => 
              t.name.toLowerCase() === topic.toLowerCase()
            );
            
            if (existingTopicIndex >= 0) {
              // Update existing topic
              updatedTopicsData[subject][existingTopicIndex].mastery = masteryPercentage;
            } else {
              // Add new topic
              updatedTopicsData[subject].push({
                id: topic.toLowerCase().replace(/\s+/g, '_'),
                name: topic,
                mastery: masteryPercentage
              });
            }
          }
        }
        setRealTopicsData(updatedTopicsData);
        setTopicPerformance(processedData.topicPerformance);
        
        // Process question type analysis
        const questionAnalysis = Object.keys(processedData.questionTypes).map(type => {
          const stats = processedData.questionTypes[type];
          const total = stats.correct + stats.incorrect;
          
          if (total === 0) {
            return { type, correct: 0, incorrect: 0 };
          }
          
          return {
            type,
            correct: Math.round((stats.correct / total) * 100),
            incorrect: Math.round((stats.incorrect / total) * 100)
          };
        });
        setRealQuestionTypeAnalysis(questionAnalysis);
        
        // Process comparative data
        const updatedComparative = [...realComparativeData];
        
        // Calculate subject averages
        for (const subject in processedData.subjectPerformance) {
          const subjectData = processedData.subjectPerformance[subject];
          if (subjectData.scores.length === 0) continue;
          
          const avgScore = Math.round(
            subjectData.scores.reduce((a, b) => a + b, 0) / subjectData.scores.length
          );
          
          const subjectIndex = updatedComparative.findIndex(item => 
            item.subject.toLowerCase() === subject.charAt(0).toUpperCase() + subject.slice(1)
          );
          
          if (subjectIndex >= 0) {
            updatedComparative[subjectIndex].studentScore = avgScore;
          }
        }
        
        // Calculate overall average
        const allScores = processedData.formattedTests.map(test => test.score);
        if (allScores.length > 0) {
          const overallAvg = Math.round(allScores.reduce((a, b) => a + b, 0) / allScores.length);
          
          const overallIndex = updatedComparative.findIndex(item => item.subject === 'Overall');
          if (overallIndex >= 0) {
            updatedComparative[overallIndex].studentScore = overallAvg;
          }
        }
        setRealComparativeData(updatedComparative);
        
        console.timeEnd('fetchTestHistory'); // Performance measurement end
      }
    } catch (error) {
      console.error("Error fetching test history:", error);
      // Keep using mock data if the API fails
    }
  };

  // Function to extract performance history by month
  const extractPerformanceHistory = (tests) => {
    const monthlyData = {};
    
    // Group tests by month
    tests.forEach(test => {
      const date = new Date(test.date);
      const monthYear = `${date.toLocaleString('default', { month: 'short' })}-${date.getFullYear()}`;
      
      if (!monthlyData[monthYear]) {
        monthlyData[monthYear] = {
          physics: [],
          chemistry: [],
          biology: []
        };
      }
      
      const subject = test.subject.toLowerCase();
      if (subject === 'physics' || subject === 'chemistry' || subject === 'biology') {
        monthlyData[monthYear][subject].push(test.score);
      }
    });
    
    // Calculate averages and format for the chart
    const performanceData = Object.keys(monthlyData).map(monthYear => {
      const physics = monthlyData[monthYear].physics.length > 0 
        ? Math.round(monthlyData[monthYear].physics.reduce((a, b) => a + b, 0) / monthlyData[monthYear].physics.length) 
        : null;
      
      const chemistry = monthlyData[monthYear].chemistry.length > 0 
        ? Math.round(monthlyData[monthYear].chemistry.reduce((a, b) => a + b, 0) / monthlyData[monthYear].chemistry.length) 
        : null;
      
      const biology = monthlyData[monthYear].biology.length > 0 
        ? Math.round(monthlyData[monthYear].biology.reduce((a, b) => a + b, 0) / monthlyData[monthYear].biology.length) 
        : null;
      
      // Calculate overall average
      let validScores = 0;
      let totalScore = 0;
      
      if (physics !== null) { totalScore += physics; validScores++; }
      if (chemistry !== null) { totalScore += chemistry; validScores++; }
      if (biology !== null) { totalScore += biology; validScores++; }
      
      const average = validScores > 0 ? Math.round(totalScore / validScores) : 0;
      
      return {
        month: monthYear.split('-')[0],  // Just use the month name
        physics: physics || 0,
        chemistry: chemistry || 0,
        biology: biology || 0,
        average
      };
    });
    
    // Sort by month chronologically
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return performanceData.sort((a, b) => {
      const aIndex = months.indexOf(a.month);
      const bIndex = months.indexOf(b.month);
      return aIndex - bIndex;
    });
  };

  // Function to analyze topic performance from test data
  const analyzeTopicPerformance = (tests) => {
    const topicData = {};
    
    // Process each test
    tests.forEach(test => {
      if (!test.questions) return;
      
      // Group questions by topic
      test.questions.forEach(question => {
        if (!question.topic) return;
        
        const subject = test.subject.toLowerCase();
        const topic = question.topic;
        
        if (!topicData[subject]) {
          topicData[subject] = {};
        }
        
        if (!topicData[subject][topic]) {
          topicData[subject][topic] = {
            total: 0,
            correct: 0
          };
        }
        
        topicData[subject][topic].total++;
        if (question.isCorrect) {
          topicData[subject][topic].correct++;
        }
      });
    });
    
    // Convert to mastery percentages
    const updatedTopicsData = { ...realTopicsData };
    
    for (const subject in topicData) {
      if (!updatedTopicsData[subject]) continue;
      
      for (const topic in topicData[subject]) {
        const topicStats = topicData[subject][topic];
        const masteryPercentage = Math.round((topicStats.correct / topicStats.total) * 100);
        
        // Find the topic in our existing data structure
        const existingTopicIndex = updatedTopicsData[subject].findIndex(t => 
          t.name.toLowerCase() === topic.toLowerCase()
        );
        
        if (existingTopicIndex >= 0) {
          // Update existing topic
          updatedTopicsData[subject][existingTopicIndex].mastery = masteryPercentage;
        } else {
          // Add new topic
          updatedTopicsData[subject].push({
            id: topic.toLowerCase().replace(/\s+/g, '_'),
            name: topic,
            mastery: masteryPercentage
          });
        }
      }
    }
    
    setRealTopicsData(updatedTopicsData);
    setTopicPerformance(topicData);
  };

  // Function to update question type analysis
  const updateQuestionTypeAnalysis = (tests) => {
    const questionTypes = {
      'Conceptual': { correct: 0, incorrect: 0 },
      'Numerical': { correct: 0, incorrect: 0 },
      'Application': { correct: 0, incorrect: 0 },
      'Memory-based': { correct: 0, incorrect: 0 },
      'Diagram-based': { correct: 0, incorrect: 0 }
    };
    
    // Process each test
    tests.forEach(test => {
      if (!test.questions) return;
      
      // Analyze each question by type
      test.questions.forEach(question => {
        if (!question.type) return;
        
        // Map API question types to our analytics types
        let type = 'Conceptual'; // Default
        
        if (question.type.includes('numerical') || question.type.includes('calculation')) {
          type = 'Numerical';
        } else if (question.type.includes('application')) {
          type = 'Application';
        } else if (question.type.includes('memory') || question.type.includes('recall')) {
          type = 'Memory-based';
        } else if (question.type.includes('diagram') || question.type.includes('visual')) {
          type = 'Diagram-based';
        }
        
        if (!questionTypes[type]) {
          questionTypes[type] = { correct: 0, incorrect: 0 };
        }
        
        if (question.isCorrect) {
          questionTypes[type].correct++;
        } else {
          questionTypes[type].incorrect++;
        }
      });
    });
    
    // Convert to percentages
    const updatedAnalysis = Object.keys(questionTypes).map(type => {
      const stats = questionTypes[type];
      const total = stats.correct + stats.incorrect;
      
      if (total === 0) {
        return { type, correct: 0, incorrect: 0 };
      }
      
      return {
        type,
        correct: Math.round((stats.correct / total) * 100),
        incorrect: Math.round((stats.incorrect / total) * 100)
      };
    });
    
    setRealQuestionTypeAnalysis(updatedAnalysis);
  };

  // Function to update comparative data
  const updateComparativeData = (tests) => {
    const subjectScores = {
      'Physics': [],
      'Chemistry': [],
      'Biology': []
    };
    
    // Group scores by subject
    tests.forEach(test => {
      if (subjectScores[test.subject]) {
        subjectScores[test.subject].push(test.score);
      }
    });
    
    // Calculate average scores
    const updatedComparative = [...realComparativeData];
    
    for (const subject in subjectScores) {
      if (subjectScores[subject].length === 0) continue;
      
      const avgScore = Math.round(
        subjectScores[subject].reduce((a, b) => a + b, 0) / subjectScores[subject].length
      );
      
      const subjectIndex = updatedComparative.findIndex(item => item.subject === subject);
      if (subjectIndex >= 0) {
        updatedComparative[subjectIndex].studentScore = avgScore;
      }
    }
    
    // Calculate overall average
    const allScores = tests.map(test => test.score);
    if (allScores.length > 0) {
      const overallAvg = Math.round(allScores.reduce((a, b) => a + b, 0) / allScores.length);
      
      const overallIndex = updatedComparative.findIndex(item => item.subject === 'Overall');
      if (overallIndex >= 0) {
        updatedComparative[overallIndex].studentScore = overallAvg;
      }
    }
    
    setRealComparativeData(updatedComparative);
  };

  // Handle adding a new test
  const handleAddNewTest = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Authentication token missing. Please log in again.');
        return;
      }
      
      // Create test data to send to API
      const testData = {
        subject: newTestData.subject,
        score: newTestData.score,
        totalTime: newTestData.timeSpent * 60, // Convert to seconds
        totalQuestions: newTestData.questionsSolved,
        correctAnswers: Math.round((newTestData.accuracy / 100) * newTestData.questionsSolved),
        completedAt: new Date(newTestData.date).toISOString()
      };
      
      // Send to API
      await axios.post('http://localhost:5000/student/tests', testData, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      // Refresh test history
      fetchTestHistory();
      
      // Close dialog
      setDataEntryOpen(false);
      
      // Reset form
      setNewTestData({
        subject: 'Physics',
        date: new Date().toISOString().split('T')[0],
        score: 75,
        timeSpent: 40,
        questionsSolved: 30,
        accuracy: 75
      });
      
    } catch (error) {
      console.error("Error adding new test:", error);
      setError('Failed to add new test. Please try again.');
    }
  };

  // Get topic data for selected subject
  const topicsData = realTopicsData[selectedSubject] || [];

  // Add a deep analysis function that derives insights from test history
  const generateDeepAnalysis = () => {
    if (testHistory.length === 0) return null;
    
    // Analyze time trends
    const timePerQuestion = realTestAttempts.map(test => 
      test.timeSpent * 60 / test.questionsSolved
    );
    const avgTimePerQuestion = timePerQuestion.reduce((a, b) => a + b, 0) / timePerQuestion.length;
    
    // Analyze accuracy trends
    const accuracyTrend = realTestAttempts.map(test => test.accuracy);
    const avgAccuracy = accuracyTrend.reduce((a, b) => a + b, 0) / accuracyTrend.length;
    
    // Identify topics that need improvement
    const topicsNeedingImprovement = [];
    
    for (const subject in topicPerformance) {
      for (const topic in topicPerformance[subject]) {
        const stats = topicPerformance[subject][topic];
        const masteryPercentage = Math.round((stats.correct / stats.total) * 100);
        
        if (masteryPercentage < 70 && stats.total >= 3) {
          topicsNeedingImprovement.push({
            subject,
            topic,
            mastery: masteryPercentage,
            occurrences: stats.total
          });
        }
      }
    }
    
    // Sort topics by mastery (lowest first)
    topicsNeedingImprovement.sort((a, b) => a.mastery - b.mastery);
    
    // Identify strengths
    const topStrengths = [];
    
    for (const subject in topicPerformance) {
      for (const topic in topicPerformance[subject]) {
        const stats = topicPerformance[subject][topic];
        const masteryPercentage = Math.round((stats.correct / stats.total) * 100);
        
        if (masteryPercentage > 85 && stats.total >= 3) {
          topStrengths.push({
            subject,
            topic,
            mastery: masteryPercentage,
            occurrences: stats.total
          });
        }
      }
    }
    
    // Sort strengths by mastery (highest first)
    topStrengths.sort((a, b) => b.mastery - a.mastery);
    
    // Time management analysis
    const timeManagementScore = avgTimePerQuestion < 90 ? 'Good' : 'Needs Improvement';
    
    return {
      avgTimePerQuestion: Math.round(avgTimePerQuestion),
      avgAccuracy,
      topicsNeedingImprovement: topicsNeedingImprovement.slice(0, 5),
      topStrengths: topStrengths.slice(0, 5),
      timeManagementScore,
      testsTaken: testHistory.length,
      totalQuestions: testHistory.reduce((sum, test) => sum + (test.totalQuestions || 0), 0),
      totalCorrect: testHistory.reduce((sum, test) => sum + (test.correctAnswers || 0), 0)
    };
  };
  
  // Generate deep analysis
  const deepAnalysis = generateDeepAnalysis();

  // Function to update topic mastery
  const handleUpdateTopicMastery = async (subject, topicId, newMastery) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Authentication token missing. Please log in again.');
        return;
      }

      // Update local state first for immediate UI feedback
      const updatedTopics = { ...realTopicsData };
      const topicIndex = updatedTopics[subject].findIndex(topic => topic.id === topicId);
      
      if (topicIndex >= 0) {
        // Ensure mastery is between 0 and 100
        const validatedMastery = Math.min(100, Math.max(0, newMastery));
        updatedTopics[subject][topicIndex].mastery = validatedMastery;
        setRealTopicsData(updatedTopics);
        
        // Send update to API
        await axios.post('http://localhost:5000/student/topic-mastery', {
          subject,
          topicId,
          mastery: validatedMastery
        }, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
      }
    } catch (error) {
      console.error("Error updating topic mastery:", error);
      setError('Failed to update topic mastery. Please try again.');
    }
  };

  // Calculate progress for each subject
  const calculateSubjectProgress = (subjectsData) => {
    return subjects.map(subject => {
      const subjectData = subjectsData[subject.id];
      
      // Calculate stage and level
      const stage = parseInt(subjectData?.stage || 1);
      const level = parseInt(subjectData?.level || 1);
      
      // Calculate progress percentage
      // Total possible: 12 stages × 4 levels = 48 levels
      const totalPossibleLevels = 48;
      const completedLevels = (stage - 1) * 4 + (level - 1);
      const progressPercentage = Math.round((completedLevels / totalPossibleLevels) * 100);
      
      return {
        id: subject.id,
        name: subject.name,
        color: subject.color,
        icon: subject.icon,
        stage,
        level,
        completedLevels,
        totalLevels: totalPossibleLevels,
        progress: progressPercentage
      };
    });
  };

  // Generate AI summary based on student data
  const generateAISummary = (data) => {
    setAiLoading(true);
    
    // Simulate AI processing
    setTimeout(() => {
      // Calculate the highest and lowest subjects
      const subjectPercentages = subjects.map(subject => {
        const subjectData = data.subjects[subject.id];
        const stage = parseInt(subjectData?.stage || 1);
        const level = parseInt(subjectData?.level || 1);
        const completedLevels = (stage - 1) * 4 + (level - 1);
        const progressPercentage = (completedLevels / 48) * 100;
        
        return {
          id: subject.id,
          name: subject.name,
          progress: progressPercentage
        };
      });
      
      const sortedSubjects = [...subjectPercentages].sort((a, b) => b.progress - a.progress);
      const highestSubject = sortedSubjects[0];
      const lowestSubject = sortedSubjects[2];
      
      // Calculate overall progress
      const totalCompletedLevels = subjectPercentages.reduce((sum, subject) => {
        const subjectData = data.subjects[subject.id];
        const stage = parseInt(subjectData?.stage || 1);
        const level = parseInt(subjectData?.level || 1);
        return sum + ((stage - 1) * 4 + (level - 1));
      }, 0);
      
      const overallProgress = Math.round((totalCompletedLevels / (48 * 4)) * 100);
      
      // Process emotion data for insights
      const productiveTimesData = emotionUtils.calculateProductivityByTimeOfDay(emotionData);
      const sortedProductiveTimes = [...productiveTimesData].sort((a, b) => b.productivity - a.productivity);
      
      // Find peak productive times
      const mostProductiveTime = sortedProductiveTimes.length > 0 
        ? sortedProductiveTimes[0].time
        : '9:00';
        
      // Get emotion distribution
      const emotionDistribution = {};
      emotionData.forEach(item => {
        if (!emotionDistribution[item.emotion]) {
          emotionDistribution[item.emotion] = 0;
        }
        emotionDistribution[item.emotion]++;
      });
      
      // Find dominant emotion
      let dominantEmotion = 'neutral';
      let maxCount = 0;
      Object.entries(emotionDistribution).forEach(([emotion, count]) => {
        if (count > maxCount) {
          maxCount = count;
          dominantEmotion = emotion;
        }
      });
      
      // Create a comprehensive AI summary
      const aiResponse = {
        overview: `Based on comprehensive analysis of your academic data, you've completed ${totalCompletedLevels} levels across all subjects, representing ${overallProgress}% of the NEET curriculum. Your strongest subject is ${highestSubject.name} (${Math.round(highestSubject.progress)}% complete), while ${lowestSubject.name} (${Math.round(lowestSubject.progress)}% complete) requires more attention. Your performance shows a consistent improvement rate of 4.5% monthly, which puts you on track to complete the curriculum before the examination period.`,
        strengths: [
          `Exceptional conceptual understanding in ${highestSubject.name}, particularly in theoretical frameworks.`,
          `Above-average performance in numerical problems across all subjects (+15% compared to peers).`,
          `Strong performance in diagram-based questions in Biology subjects (+20% vs average).`,
          `Consistent study pattern with regular progression through levels.`,
          `Excellent time management during tests, with per-question time 12% lower than peer average.`
        ],
        weaknesses: [
          `Conceptual gaps in ${lowestSubject.name}, particularly in classification topics (-18% vs your average).`,
          `Inconsistent performance in application-based questions (-15% vs conceptual questions).`,
          `Below-average retention of memorization-heavy topics in Chemistry nomenclature.`,
          `Difficulty with time management in complex multi-step problems.`,
          `Gap in connecting interrelated concepts across different subjects.`
        ],
        recommendations: [
          `Focus intensively on ${lowestSubject.name} by allocating 30% more study time, particularly on taxonomy and classification.`,
          `Strengthen your conceptual framework in ${highestSubject.name} through advanced problem-solving while maintaining regular revision.`,
          `Implement spaced repetition for memorization-heavy topics to improve long-term retention.`,
          `Practice with timed mock tests with progressively increasing difficulty to improve performance consistency.`,
          `Dedicate focused study sessions to application-based questions across all subjects.`,
          `Create concept maps connecting related topics across different subjects.`,
          `Analyze your incorrect answers to identify and address specific error patterns.`,
          `Target completing at least one full level every 2 weeks to maintain optimal curriculum coverage.`
        ],
        insights: [
          `Your learning efficiency index of 2.1 points/hour is 18% above average, indicating excellent study habits.`,
          `You've earned ${nPoints} N.POINTS, placing you in the top 15% of students based on curriculum progression.`,
          `Your response time analytics show a 12% improvement in average question-solving speed over 3 months.`,
          `Your study consistency score of 85/100 indicates disciplined learning habits.`,
          `Your strongest performance occurs between ${mostProductiveTime.split(':')[0]}-${parseInt(mostProductiveTime.split(':')[0]) + 2} hours, suggesting this as your cognitive peak period.`,
          `Analysis of error patterns shows a 30% reduction in repeated mistakes with active recall vs passive reading.`,
          `Your conceptual connection score shows excellent ability to relate theory to applications (top 22%).`,
          `Based on your current trajectory, you're projected to complete the full curriculum 8 weeks before exams.`
        ],
        subjectAnalysis: {
          physics: {
            strengths: ['Mechanics', 'Modern Physics'],
            weaknesses: ['Thermodynamics', 'Wave Optics'],
            recommendedFocus: 'Focus on thermodynamic cycles and entropy concepts',
            timeAllocation: 'Increase from 6 to 8 hours weekly'
          },
          chemistry: {
            strengths: ['Physical Chemistry', 'Chemical Bonding'],
            weaknesses: ['Organic Reaction Mechanisms', 'Coordination Compounds'],
            recommendedFocus: 'Create reaction mechanism flowcharts for organic chemistry',
            timeAllocation: 'Maintain 7 hours weekly with redistribution to weak areas'
          },
          biology: {
            strengths: ['Plant Morphology', 'Cell Biology'],
            weaknesses: ['Plant Physiology', 'Genetics'],
            recommendedFocus: 'Use visual aids for taxonomic classifications',
            timeAllocation: 'Increase from 5 to 7 hours weekly'
          }
        },
        progressPrediction: {
          currentScore: 76,
          projectedScore: 85,
          targetScore: 90,
          timeline: '3 months',
          probabilityOfSuccess: '82%',
          criticalInterventions: [
            'Intensive focus on Biology taxonomy (+12 potential points)',
            'Regular practice tests under timed conditions (+8 potential points)',
            'Structured error analysis and correction (+5 potential points)'
          ]
        },
        peerComparison: {
          overallPercentile: 85,
          subjectPercentiles: {
            physics: 92,
            chemistry: 83,
            biology: 78
          },
          strengths: 'Conceptual understanding (88th percentile)',
          improvements: 'Application questions (currently at 68th percentile)'
        },
        learningPatterns: {
          optimalStudyTime: `${mostProductiveTime.split(':')[0]}-${parseInt(mostProductiveTime.split(':')[0]) + 2} hours (${dominantEmotion} during this period)`,
          retentionRate: '72% after 30 days without review (15% above average)',
          errorPatterns: 'Formula application errors (32% of mistakes), taxonomic classification (28%)',
          recommendedTechniques: 'Active recall, spaced repetition, concept mapping'
        },
        emotionInsights: {
          dominantEmotion: dominantEmotion,
          productivePeriods: sortedProductiveTimes.slice(0, 3).map(time => time.time),
          emotionalPattern: `You're predominantly ${dominantEmotion} during study sessions, which ${dominantEmotion === 'focused' || dominantEmotion === 'happy' ? 'suggests high engagement' : 'may indicate learning challenges'}.`,
          recommendations: [
            `Schedule complex topics during your peak productivity hours (${mostProductiveTime.split(':')[0]}-${parseInt(mostProductiveTime.split(':')[0]) + 2}).`,
            `You show higher focus levels in the ${sortedProductiveTimes[0]?.time.includes('PM') ? 'evening' : 'morning'}, suggesting this is your optimal study time.`,
            `When you're feeling ${dominantEmotion === 'confused' ? 'confused' : 'less focused'}, try switching to visual learning methods or taking short breaks.`
          ]
        }
      };
      
      setAiSummary(aiResponse);
      setAiLoading(false);
    }, 2000);
  };

  // Handle custom AI question
  const handleCustomQuestion = () => {
    if (!customQuestion.trim()) return;
    
    setAiLoading(true);
    
    // Simulate AI processing the custom question
    setTimeout(() => {
      let response = "";
      
      // Comprehensive responses based on common questions
      if (customQuestion.toLowerCase().includes("improve") || customQuestion.toLowerCase().includes("better")) {
        response = "Based on comprehensive analysis of your performance data, I recommend the following targeted strategy:\n\n1) For Biology (your weakest subject at 68%), focus specifically on taxonomic classification and comparative anatomy with 8-10 hours/week. Create visual comparison tables for animal phyla and use active recall techniques for classification criteria.\n\n2) For Physics, while it's your strongest subject (85%), your performance in Thermodynamics shows a 20% lower accuracy compared to Mechanics. Dedicate 3-4 hours/week specifically to thermodynamic cycles, entropy concepts, and carnot engine problems.\n\n3) In Chemistry, your organic reaction mechanisms show recurring error patterns (28% of your mistakes). Implement a systematic approach using reaction flowcharts and electron-pushing diagrams for 4 hours/week.\n\n4) Your performance drops 18% in the final quarter of tests, indicating potential time pressure or mental fatigue. Practice with strictly timed mock tests, gradually increasing difficulty and length.\n\n5) Your accuracy on multi-concept integration questions (64%) is significantly lower than single-concept questions (85%). Create concept maps connecting related topics across subjects and practice cross-subject application problems.\n\n6) Implement a comprehensive error journal where you document every mistake, categorize it by type (conceptual, calculation, etc.), and review weekly. Your data shows this could reduce repeat errors by 40%.";
      } 
      else if (customQuestion.toLowerCase().includes("time") || customQuestion.toLowerCase().includes("schedule")) {
        response = "Based on your detailed analytics, here's your optimized weekly study schedule:\n\n• Physics: 8 hours/week\n  - Mechanics: 2hrs (maintain - strong area)\n  - Thermodynamics: 3hrs (increase - detected weakness)\n  - Electromagnetism: 2hrs (maintain)\n  - Modern Physics: 1hr (maintain)\n\n• Chemistry: 7 hours/week\n  - Physical Chemistry: 2hrs (maintain - strong area)\n  - Organic Chemistry: 3hrs (increase - error patterns detected)\n  - Inorganic Chemistry: 2hrs (maintain)\n\n• Biology: 7 hours/week\n  - Plant Morphology: 1hr (decrease - strong area)\n  - Cell Biology: 3hrs (increase significantly - major weakness)\n  - Human Physiology: 2hrs (maintain)\n\nOptimal Study Pattern (based on your cognitive analytics):\n• 5-7 AM: New concept learning (peak retention period)\n• 2-4 PM: Problem solving and application practice\n• 7-9 PM: Active recall and error correction (second cognitive peak)\n\nWeekly Structure:\n• Mon-Fri: Deep subject focus (25 hours)\n• Saturday: Mixed subject practice tests (3 hours)\n• Sunday: Error analysis and correction (2 hours)";
      }
      else if (customQuestion.toLowerCase().includes("rank") || customQuestion.toLowerCase().includes("compared")) {
        response = "Based on platform analytics comparing your metrics with 15,000+ NEET students:\n\n• Overall Percentile: 85th (outperforming 85% of students)\n\n• Subject-Wise Percentiles:\n  - Physics: 92nd percentile (Exceptional)\n  - Chemistry: 83rd percentile (Strong)\n  - Biology: 78th percentile (Above average)\n\n• Skill-Based Percentiles:\n  - Conceptual Understanding: 88th\n  - Problem-Solving Speed: 82nd\n  - Accuracy: 84th\n  - Curriculum Coverage: 86th\n\n• N.POINTS (225): 90th percentile\n\n• Notable Strengths vs Peers:\n  - Physics problem-solving: top 8% nationally\n  - Concept-application abilities: top 12%\n  - Learning curve/improvement rate: top 15%\n\n• Areas Where Peers Outperform You:\n  - Time management in biology (32% of peers perform better)\n  - Retention of chemical equations (25% perform better)\n  - Classification questions in taxonomy (22% perform better)\n\n• Success Prediction Model:\n  Based on your trajectory compared to historical data from students who achieved 650+ in NEET, you have an 87% probability of scoring in the top 5% nationally with continued improvement at current rate.";
      }
      else if (customQuestion.toLowerCase().includes("predict") || customQuestion.toLowerCase().includes("score")) {
        response = "Based on our predictive analytics model trained on 50,000+ student profiles and outcomes:\n\n• Current Performance Score: 76/100\n• Projected NEET Score (if exam were today): 610-625/720\n• Current National Percentile Projection: 92.5-93.8\n\n• Subject-Wise Projections (Current → Potential):\n  - Physics: 165/180 → 172/180\n  - Chemistry: 155/180 → 168/180\n  - Biology: 145/180 → 160/180\n\n• Improvement Trajectory:\n  - 1 Month: 635-645/720 (with focused intervention)\n  - 3 Months: 660-675/720 (with all recommendations)\n  - 6 Months: 680-695/720 (maximum projected potential)\n\n• Critical Focus Areas (Highest ROI):\n  - Biology Taxonomy (+12 potential marks)\n  - Organic Chemistry Mechanisms (+10 potential marks)\n  - Thermodynamics (+7 potential marks)\n  - Plant Taxonomy (+6 potential marks)\n\n• Success Probability Analysis:\n  - 95% probability of 650+ score\n  - 82% probability of 675+ score\n  - 65% probability of 690+ score\n\n• Required Performance Improvements:\n  - Accuracy: +8% overall (from 78% to 86%)\n  - Speed: +12% (allowing 5-7 more question attempts)\n  - Error reduction: -35% in identified weak areas";
      }
      else {
        response = "Based on comprehensive analysis of your performance data across 3,000+ questions and 50+ tests, I've identified several critical insights:\n\n1) Your learning pattern shows exceptional strength in conceptual understanding (88% accuracy) but significant weakness in application-based problems (76% accuracy). This 12% gap is larger than the typical 5-7% differential for high performers.\n\n2) Time analysis reveals peak productivity during 5-8 AM with comprehension rates 23% higher than evening sessions. Your afternoon sessions (2-4 PM) show the lowest retention rates.\n\n3) Your progress in Physics (85% completion) demonstrates excellent conceptual mastery but detailed test response analysis reveals inconsistent application in cross-topic problems.\n\n4) For Biology (68% completion), error pattern analysis shows specific difficulties with taxonomic classification (47% of all Biology errors) and comparative anatomy (32% of errors).\n\n5) Your test performance analytics show accuracy declining by approximately 18% in the final quarter of timed tests, significantly above the average 7-10% decline rate.\n\n6) Question-type analysis reveals mastery of direct recall questions (92% accuracy) but struggle with multi-step application problems (74% accuracy) and cross-subject integration questions (68% accuracy).\n\n7) Based on historical progression of similar student profiles, you're projected to reach 85% overall mastery within 12 weeks, putting you on track for a 660-675 NEET score with current trajectory.";
      }
      
      // Update AI summary with the new response
      setAiSummary({
        ...aiSummary,
        customResponse: response
      });
      
      setCustomQuestion('');
      setAiLoading(false);
    }, 2000);
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleSubjectChange = (event, newValue) => {
    setSelectedSubject(newValue);
  };
  
  // Get the highest and lowest subjects
  const highestSubject = subjectProgress.length > 0 
    ? [...subjectProgress].sort((a, b) => b.progress - a.progress)[0]
    : { name: 'Physics', progress: 65 };
  
  const lowestSubject = subjectProgress.length > 0 
    ? [...subjectProgress].sort((a, b) => a.progress - b.progress)[0]
    : { name: 'Biology', progress: 38 };

  // Data for the subject progress chart
  const chartData = subjectProgress.map(subject => ({
    name: subject.name,
    progress: subject.progress,
    fill: subject.color
  }));

  // Add a new useEffect to load emotion data
  useEffect(() => {
    // Load emotion data when component mounts
    const loadEmotionData = async () => {
      try {
        const data = await emotionUtils.getEmotionData();
        setEmotionData(data);
      } catch (error) {
        console.error('Failed to load emotion data:', error);
        // Use mock data as fallback
        setEmotionData(emotionUtils.generateMockEmotionData());
      }
    };
    
    loadEmotionData();
  }, []);
  
  // Updated function to handle detected emotions
  const handleEmotionDetected = (emotionDataPoint) => {
    // Get current study context
    const studyContext = {
      subject: selectedSubject,
      topic: getCurrentTopic(),
      subtopic: null
    };
    
    // Format data for storage
    const formattedData = emotionUtils.formatEmotionForStorage(emotionDataPoint, studyContext);
    
    // Update local state
    const newEmotionData = {
      time: emotionDataPoint.timeString,
      emotion: emotionDataPoint.emotion,
      duration: 5, // Default duration for a detection
      subject: studyContext.subject,
      topic: studyContext.topic
    };
    
    setEmotionData(prev => [...prev, newEmotionData]);
    
    // Store in backend/localStorage
    emotionUtils.storeEmotionData(formattedData);
  };
  
  // Get current topic being studied
  const getCurrentTopic = () => {
    const subjectTopics = realTopicsData[selectedSubject] || [];
    if (subjectTopics.length === 0) return 'General';
    
    // Find a topic with mastery < 100 or return the first topic
    const inProgressTopic = subjectTopics.find(topic => topic.mastery < 100);
    return (inProgressTopic?.name || subjectTopics[0]?.name || 'General');
  };
  
  // Toggle emotion tracking
  const toggleEmotionTracking = () => {
    if (!isEmotionTrackingActive) {
      setShowEmotionTrackerDialog(true);
    } else {
      setIsEmotionTrackingActive(false);
    }
  };
  
  // Handle real-time emotion detection
  const handleRealTimeEmotionDetected = (emotionData) => {
    // Create a data point with study context
    const studyContext = {
      subject: selectedSubject,
      topic: getCurrentTopic(),
      subtopic: null
    };
    
    // Format and add to emotion data
    const newEmotionData = {
      time: emotionData.timeString,
      emotion: emotionData.emotion,
      duration: 5, // Default duration for a detection
      subject: studyContext.subject,
      topic: studyContext.topic,
      confidence: emotionData.confidence
    };
    
    // Add to local state
    setEmotionData(prev => [...prev, newEmotionData]);
    
    // Store data
    const formattedData = emotionUtils.formatEmotionForStorage(
      {
        emotion: emotionData.emotion,
        timestamp: emotionData.timestamp,
        timeString: emotionData.timeString
      }, 
      studyContext
    );
    
    emotionUtils.storeEmotionData(formattedData);
  };
  
  // Toggle real-time emotion detection
  const toggleRealTimeDetection = () => {
    if (!showRealTimeDetector) {
      setRealTimePermissionDialog(true);
    } else {
      setShowRealTimeDetector(false);
    }
  };
  
  // Start real-time detection after permission
  const startRealTimeDetection = () => {
    setRealTimePermissionDialog(false);
    setShowRealTimeDetector(true);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Paper 
        elevation={0} 
        sx={{ 
          p: 3, 
          mb: 4, 
          borderRadius: 2, 
          background: `linear-gradient(135deg, #7445f8 0%, #5c33d4 100%)`,
          color: 'white',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}
      >
        <Box>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          Advanced Analytics Dashboard
        </Typography>
        <Typography variant="body1">
            Comprehensive performance insights powered by Zerreta AI
        </Typography>
        </Box>
        
        {/* Add Real-Time Detection Button */}
        <Button
          variant="contained"
          color={showRealTimeDetector ? "error" : "secondary"}
          startIcon={<VideocamIcon />}
          onClick={toggleRealTimeDetection}
          sx={{ 
            fontWeight: 'medium',
            boxShadow: theme.shadows[4],
            bgcolor: showRealTimeDetector ? 'error.main' : 'white',
            color: showRealTimeDetector ? 'white' : 'primary.main',
            '&:hover': {
              bgcolor: showRealTimeDetector ? 'error.dark' : 'rgba(255,255,255,0.9)'
            }
          }}
        >
          {showRealTimeDetector ? 'Stop Detection' : 'Real-Time Emotion'}
        </Button>
      </Paper>

      {/* Dashboard Tabs */}
      <Tabs 
        value={activeTab} 
        onChange={handleTabChange} 
        variant="scrollable"
        scrollButtons="auto"
        sx={{ 
          mb: 3, 
          '& .MuiTab-root': { 
            minWidth: 'auto',
            px: 3,
            fontWeight: 500
          },
          borderBottom: '1px solid rgba(0,0,0,0.1)'
        }}
      >
        <Tab label="AI Summary" icon={<PsychologyIcon />} iconPosition="start" />
        <Tab label="Subject Analysis" icon={<SchoolIcon />} iconPosition="start" />
        <Tab label="Performance Trends" icon={<TimelineIcon />} iconPosition="start" />
        <Tab label="Test History" icon={<AssessmentIcon />} iconPosition="start" />
        <Tab label="Peer Comparison" icon={<GroupIcon />} iconPosition="start" />
        <Tab label="Integrated Analysis" icon={<AnalyticsIcon />} iconPosition="start" />
        <Tab label="Deep Analysis" icon={<InsightsIcon />} iconPosition="start" />
        <Tab label="Emotion Analysis" icon={<PsychologyIcon />} iconPosition="start" />
      </Tabs>

      {/* Dialog for Data Entry */}
      <Dialog open={dataEntryOpen} onClose={() => setDataEntryOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Add New Test Data</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Subject</InputLabel>
                  <Select
                    value={newTestData.subject}
                    label="Subject"
                    onChange={(e) => setNewTestData({ ...newTestData, subject: e.target.value })}
                  >
                    <MenuItem value="Physics">Physics</MenuItem>
                    <MenuItem value="Chemistry">Chemistry</MenuItem>
                    <MenuItem value="Biology">Biology</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Date"
                  type="date"
                  value={newTestData.date}
                  onChange={(e) => setNewTestData({ ...newTestData, date: e.target.value })}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Score (%)"
                  type="number"
                  InputProps={{ inputProps: { min: 0, max: 100 } }}
                  value={newTestData.score}
                  onChange={(e) => setNewTestData({ ...newTestData, score: Number(e.target.value) })}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Time Spent (minutes)"
                  type="number"
                  InputProps={{ inputProps: { min: 1 } }}
                  value={newTestData.timeSpent}
                  onChange={(e) => setNewTestData({ ...newTestData, timeSpent: Number(e.target.value) })}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Questions Solved"
                  type="number"
                  InputProps={{ inputProps: { min: 1 } }}
                  value={newTestData.questionsSolved}
                  onChange={(e) => setNewTestData({ ...newTestData, questionsSolved: Number(e.target.value) })}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Accuracy (%)"
                  type="number"
                  InputProps={{ inputProps: { min: 0, max: 100 } }}
                  value={newTestData.accuracy}
                  onChange={(e) => setNewTestData({ ...newTestData, accuracy: Number(e.target.value) })}
                />
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDataEntryOpen(false)}>Cancel</Button>
          <Button onClick={handleAddNewTest} variant="contained" color="primary">
            Save Data
          </Button>
        </DialogActions>
      </Dialog>

      {/* AI Summary Tab */}
      {activeTab === 0 && (
        <Grid container spacing={3}>
          {/* AI Summary Card */}
          <Grid item xs={12} lg={8}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Card sx={{ mb: 3, borderRadius: 2, height: '100%', boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)' }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Avatar sx={{ bgcolor: '#7445f8', mr: 2 }}>
                      <PsychologyIcon />
                    </Avatar>
                    <Typography variant="h5" fontWeight="bold">
                      Zerreta AI Analysis
                    </Typography>
                  </Box>
                  
                  <Divider sx={{ mb: 3 }} />
                  
                  {aiLoading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', py: 5 }}>
                      <CircularProgress />
                    </Box>
                  ) : (
                    <>
                      <Typography variant="body1" paragraph>
                        {aiSummary?.overview}
                      </Typography>
                      
                      {/* Emotional Insights Section */}
                      {aiSummary?.emotionInsights && (
                        <Box sx={{ mt: 3, p: 2, bgcolor: 'rgba(116, 69, 248, 0.05)', borderRadius: 2, border: '1px dashed rgba(116, 69, 248, 0.3)' }}>
                          <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                            <Box component="span" sx={{ display: 'inline-flex', alignItems: 'center' }}>
                              <FaceIcon sx={{ mr: 1, color: '#7445f8' }} />
                              Emotional Learning Patterns
                            </Box>
                      </Typography>
                      
                          <Typography variant="body2" paragraph>
                            {aiSummary.emotionInsights.emotionalPattern}
                          </Typography>
                          
                          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                            <Chip 
                              icon={getEmotionIcon(aiSummary.emotionInsights.dominantEmotion)} 
                              label={`Dominant: ${aiSummary.emotionInsights.dominantEmotion}`}
                              size="small"
                              sx={{ bgcolor: `${getEmotionColor(aiSummary.emotionInsights.dominantEmotion, theme)}20`, color: getEmotionColor(aiSummary.emotionInsights.dominantEmotion, theme) }}
                            />
                            
                            <Chip 
                              icon={<AccessTimeIcon />} 
                              label={`Peak time: ${aiSummary.learningPatterns.optimalStudyTime.split('(')[0]}`}
                              size="small"
                              sx={{ bgcolor: 'rgba(116, 69, 248, 0.1)', color: '#7445f8' }}
                            />
                          </Box>
                          
                          <Typography variant="caption" color="text.secondary">
                            For detailed emotion analysis and time-based patterns, check the Emotion Analysis tab.
                          </Typography>
                        </Box>
                      )}
                      
                      <Box sx={{ mt: 3 }}>
                        <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                            Strengths
                          </Typography>
                          <List dense>
                          {aiSummary?.strengths.map((strength, index) => (
                            <ListItem key={index} sx={{ py: 0.5 }}>
                              <ListItemIcon sx={{ minWidth: 36 }}>
                                <CheckCircleIcon sx={{ color: 'success.main' }} fontSize="small" />
                              </ListItemIcon>
                              <ListItemText primary={strength} />
                              </ListItem>
                            ))}
                          </List>
                      </Box>
                        
                      <Box sx={{ mt: 2 }}>
                        <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                            Areas for Improvement
                          </Typography>
                          <List dense>
                          {aiSummary?.weaknesses.map((weakness, index) => (
                            <ListItem key={index} sx={{ py: 0.5 }}>
                              <ListItemIcon sx={{ minWidth: 36 }}>
                                <TrendingUpIcon sx={{ color: 'warning.main' }} fontSize="small" />
                              </ListItemIcon>
                              <ListItemText primary={weakness} />
                              </ListItem>
                            ))}
                          </List>
                      </Box>
                      
                      <Box sx={{ mt: 2 }}>
                        <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                          Recommended Actions
                      </Typography>
                        <List dense>
                          {aiSummary?.recommendations.slice(0, 3).map((recommendation, index) => (
                            <ListItem key={index} sx={{ py: 0.5 }}>
                              <ListItemIcon sx={{ minWidth: 36 }}>
                                <PrecisionManufacturingIcon sx={{ color: '#7445f8' }} fontSize="small" />
                              </ListItemIcon>
                              <ListItemText primary={recommendation} />
                          </ListItem>
                        ))}
                      </List>
                        </Box>
                    </>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </Grid>

          {/* Stats and Ask AI Section */}
          <Grid item xs={12} lg={4}>
            <Grid container spacing={3}>
              {/* N.POINTS Card */}
              <Grid item xs={12} sm={6} lg={12}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                >
                  <Card sx={{ borderRadius: 2, bgcolor: '#7445f8', color: 'white', boxShadow: '0 4px 20px rgba(116, 69, 248, 0.3)' }}>
                    <CardContent>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="h6" fontWeight="medium">
                          Your N.POINTS
                        </Typography>
                        <EmojiEventsIcon sx={{ fontSize: 28 }} />
                      </Box>
                      <Typography variant="h3" fontWeight="bold" sx={{ my: 1 }}>
                        {nPoints}
                      </Typography>
                      <Typography variant="body2" sx={{ opacity: 0.8 }}>
                        {`You've unlocked ${nPoints/25} levels across all subjects`}
                      </Typography>
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>

              {/* Strongest Subject */}
              <Grid item xs={12} sm={6} lg={12}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <Card sx={{ borderRadius: 2, boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)' }}>
                    <CardContent>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="h6" fontWeight="medium" color="primary">
                          Strongest Subject
                        </Typography>
                        <SchoolIcon sx={{ color: highestSubject.color || '#4CAF50' }} />
                      </Box>
                      <Box sx={{ my: 1 }}>
                        <Typography variant="h5" fontWeight="bold">
                          {highestSubject.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {`${highestSubject.progress}% Complete`}
                        </Typography>
                      </Box>
                      <Chip 
                        icon={<TrendingUpIcon />} 
                        label="Keep up the good work!" 
                        size="small" 
                        color="success" 
                        sx={{ mt: 1 }}
                      />
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>

              {/* Ask AI Question */}
              <Grid item xs={12}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                >
                  <Card sx={{ borderRadius: 2, boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)' }}>
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Avatar sx={{ bgcolor: theme.palette.primary.light, mr: 2 }}>
                          <SmartToyIcon />
                        </Avatar>
                        <Typography variant="h6" fontWeight="medium">
                          Ask Zerreta AI
                        </Typography>
                      </Box>
                      <TextField
                        fullWidth
                        placeholder="Ask about your performance or for study advice..."
                        variant="outlined"
                        value={customQuestion}
                        onChange={(e) => setCustomQuestion(e.target.value)}
                        sx={{ mb: 2 }}
                      />
                      <Button 
                        variant="contained" 
                        fullWidth
                        onClick={handleCustomQuestion}
                        disabled={aiLoading || !customQuestion.trim()}
                        sx={{ 
                          bgcolor: '#7445f8', 
                          '&:hover': { bgcolor: '#5c33d4' } 
                        }}
                      >
                        {aiLoading ? 'Processing...' : 'Get AI Insights'}
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      )}

      {/* Subject Analysis Tab */}
      {activeTab === 1 && (
        <Grid container spacing={3}>
          {/* Subject Selector */}
          <Grid item xs={12}>
            <Paper sx={{ p: 2, borderRadius: 2 }}>
              <Tabs
                value={selectedSubject}
                onChange={handleSubjectChange}
                variant="scrollable"
                scrollButtons="auto"
                sx={{ mb: 2 }}
              >
                {subjects.map((subject) => (
                  <Tab 
                    key={subject.id} 
                    label={subject.name} 
                    value={subject.id} 
                    icon={<subject.icon />} 
                    iconPosition="start" 
                    sx={{ 
                      color: subject.id === selectedSubject ? subject.color : 'inherit',
                      '&.Mui-selected': { color: subject.color }
                    }}
                  />
                ))}
              </Tabs>
              
              {/* Subject Overview Card */}
              <Box sx={{ mb: 3 }}>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={7}>
                    <Typography variant="h5" fontWeight="bold" sx={{ mb: 2 }}>
                      {subjects.find(s => s.id === selectedSubject)?.name} Analysis
                    </Typography>
                    <Box sx={{ mb: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <Typography variant="body1" fontWeight="medium">
                          Overall Progress:
                        </Typography>
                        <Box sx={{ flexGrow: 1, ml: 2 }}>
                          <LinearProgress 
                            variant="determinate" 
                            value={subjectProgress.find(s => s.id === selectedSubject)?.progress || 0} 
                            sx={{ 
                              height: 10, 
                              borderRadius: 5,
                              backgroundColor: 'rgba(0,0,0,0.1)',
                              '& .MuiLinearProgress-bar': {
                                backgroundColor: subjects.find(s => s.id === selectedSubject)?.color
                              }
                            }}
                          />
                        </Box>
                        <Typography variant="body1" fontWeight="bold" sx={{ ml: 2 }}>
                          {subjectProgress.find(s => s.id === selectedSubject)?.progress || 0}%
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="body2" color="text.secondary">
                          Stage: {subjectProgress.find(s => s.id === selectedSubject)?.stage || 1}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Level: {subjectProgress.find(s => s.id === selectedSubject)?.level || 1}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Completed: {subjectProgress.find(s => s.id === selectedSubject)?.completedLevels || 0}/{subjectProgress.find(s => s.id === selectedSubject)?.totalLevels || 48} levels
                        </Typography>
                      </Box>
                    </Box>
                    
                    {/* Subject Strengths and Weaknesses */}
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={6}>
                        <Typography variant="h6" sx={{ mb: 1, color: theme.palette.success.main }}>
                          Strengths
                        </Typography>
                        <Box sx={{ bgcolor: 'rgba(76, 175, 80, 0.08)', p: 2, borderRadius: 2 }}>
                          <List dense>
                            {aiSummary?.subjectAnalysis?.[selectedSubject]?.strengths?.map((strength, index) => (
                              <ListItem key={index} sx={{ px: 0 }}>
                                <ListItemAvatar>
                                  <Avatar sx={{ bgcolor: theme.palette.success.light, width: 28, height: 28 }}>
                                    <CheckCircleIcon fontSize="small" />
                                  </Avatar>
                                </ListItemAvatar>
                                <ListItemText primary={strength} />
                              </ListItem>
                            ))}
                          </List>
                        </Box>
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <Typography variant="h6" sx={{ mb: 1, color: theme.palette.error.main }}>
                          Weaknesses
                        </Typography>
                        <Box sx={{ bgcolor: 'rgba(244, 67, 54, 0.08)', p: 2, borderRadius: 2 }}>
                          <List dense>
                            {aiSummary?.subjectAnalysis?.[selectedSubject]?.weaknesses?.map((weakness, index) => (
                              <ListItem key={index} sx={{ px: 0 }}>
                                <ListItemAvatar>
                                  <Avatar sx={{ bgcolor: theme.palette.error.light, width: 28, height: 28 }}>
                                    <PriorityHighIcon fontSize="small" />
                                  </Avatar>
                                </ListItemAvatar>
                                <ListItemText primary={weakness} />
                              </ListItem>
                            ))}
                          </List>
                        </Box>
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid item xs={12} md={5}>
                    <Card sx={{ height: '100%', p: 2, boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)' }}>
                      <Typography variant="h6" fontWeight="medium" sx={{ mb: 2 }}>
                        Topic Mastery
                      </Typography>
                      <ResponsiveContainer width="100%" height={220}>
                        <BarChart
                          data={topicsData}
                          layout="vertical"
                          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis type="number" domain={[0, 100]} />
                          <YAxis dataKey="name" type="category" width={150} />
                          <Tooltip />
                          <Bar 
                            dataKey="mastery" 
                            fill={subjects.find(s => s.id === selectedSubject)?.color} 
                            radius={[0, 4, 4, 0]}
                          />
                        </BarChart>
                      </ResponsiveContainer>
                      
                      <Typography variant="h6" fontWeight="medium" sx={{ mt: 3, mb: 1 }}>
                        Expert Recommendations
                      </Typography>
                      <Box sx={{ p: 2, bgcolor: 'rgba(116, 69, 248, 0.05)', borderRadius: 2 }}>
                        <Typography variant="body2" fontWeight="medium" sx={{ mb: 1 }}>
                          Focus Area:
                        </Typography>
                        <Typography variant="body2" sx={{ mb: 2 }}>
                          {aiSummary?.subjectAnalysis?.[selectedSubject]?.recommendedFocus}
                        </Typography>
                        <Typography variant="body2" fontWeight="medium" sx={{ mb: 1 }}>
                          Time Allocation:
                        </Typography>
                        <Typography variant="body2">
                          {aiSummary?.subjectAnalysis?.[selectedSubject]?.timeAllocation}
                        </Typography>
                      </Box>
                    </Card>
                  </Grid>
                </Grid>
              </Box>
            </Paper>
          </Grid>
          
          {/* Topic Mastery Editor */}
          <Grid item xs={12}>
            <Card sx={{ p: 3, borderRadius: 2, boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)' }}>
              <Typography variant="h6" fontWeight="bold" sx={{ mb: 3 }}>
                Update Topic Mastery
              </Typography>
              <Grid container spacing={3}>
                {realTopicsData[selectedSubject]?.map((topic) => (
                  <Grid item xs={12} md={6} lg={4} key={topic.id}>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body1" fontWeight="medium" sx={{ mb: 1 }}>
                        {topic.name}: {topic.mastery}%
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Slider
                          value={topic.mastery}
                          min={0}
                          max={100}
                          step={1}
                          onChange={(e, value) => handleUpdateTopicMastery(selectedSubject, topic.id, value)}
                          sx={{ 
                            color: subjects.find(s => s.id === selectedSubject)?.color,
                            flexGrow: 1
                          }}
                        />
                      </Box>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </Card>
          </Grid>
        </Grid>
      )}
      
      {/* Performance Trends Tab */}
      {activeTab === 2 && (
        <Grid container spacing={3}>
          {/* Performance History Chart */}
          <Grid item xs={12}>
            <Card sx={{ p: 3, borderRadius: 2, boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)' }}>
              <Typography variant="h5" fontWeight="bold" sx={{ mb: 3 }}>
                Performance Trends
              </Typography>
              <ResponsiveContainer width="100%" height={350}>
                <LineChart
                  data={realPerformanceHistory}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip />
                  <Legend />
                  {subjects.map((subject) => (
                    <Line
                      key={subject.id}
                      type="monotone"
                      dataKey={subject.id}
                      stroke={subject.color}
                      strokeWidth={2}
                      activeDot={{ r: 8 }}
                    />
                  ))}
                  <Line
                    type="monotone"
                    dataKey="average"
                    stroke="#757575"
                    strokeWidth={2}
                    strokeDasharray="5 5"
                  />
                </LineChart>
              </ResponsiveContainer>
              <Box sx={{ mt: 3, p: 2, bgcolor: 'rgba(0, 0, 0, 0.02)', borderRadius: 2 }}>
                <Typography variant="h6" fontWeight="medium" sx={{ mb: 2 }}>
                  Trend Analysis
                </Typography>
                <Grid container spacing={2}>
                  {subjects.map((subject) => {
                    const firstScore = realPerformanceHistory[0][subject.id];
                    const lastScore = realPerformanceHistory[realPerformanceHistory.length - 1][subject.id];
                    const improvement = lastScore - firstScore;
                    return (
                      <Grid item xs={12} sm={6} lg={3} key={subject.id}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Avatar sx={{ bgcolor: subject.color, mr: 2 }}>
                            <subject.icon />
                          </Avatar>
                          <Box>
                            <Typography variant="body2" fontWeight="medium">
                              {subject.name}
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <TrendingUpIcon sx={{ fontSize: 16, mr: 0.5, color: 'success.main' }} />
                              <Typography variant="body2" color="success.main">
                                +{improvement}% over 6 months
                              </Typography>
                            </Box>
                          </Box>
                        </Box>
                      </Grid>
                    );
                  })}
                </Grid>
              </Box>
            </Card>
          </Grid>
          
          {/* Monthly Progress Card */}
          <Grid item xs={12} md={6}>
            <Card sx={{ p: 3, borderRadius: 2, boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)' }}>
              <Typography variant="h6" fontWeight="bold" sx={{ mb: 3 }}>
                Monthly Progress
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart
                  data={realPerformanceHistory}
                  margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Area
                    type="monotone"
                    dataKey="average"
                    stroke="#7445f8"
                    fill="#7445f8"
                    fillOpacity={0.3}
                  />
                </AreaChart>
              </ResponsiveContainer>
              <Box sx={{ mt: 2 }}>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  <strong>Analysis:</strong> You've shown a consistent improvement of approximately 4.5% per month, with the most significant growth between March and April (9.5% increase).
                </Typography>
                <Typography variant="body2">
                  At this rate, you're projected to reach the 85% proficiency mark by the end of your next trimester.
                </Typography>
              </Box>
            </Card>
          </Grid>
          
          {/* Learning Patterns Card */}
          <Grid item xs={12} md={6}>
            <Card sx={{ p: 3, borderRadius: 2, boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)' }}>
              <Typography variant="h6" fontWeight="bold" sx={{ mb: 3 }}>
                Learning Patterns
              </Typography>
              <Box sx={{ mb: 3 }}>
                <Typography variant="body2" fontWeight="medium" sx={{ mb: 1 }}>
                  Optimal Study Times
                </Typography>
                <Typography variant="body1">
                  {aiSummary?.learningPatterns?.optimalStudyTime}
                </Typography>
              </Box>
              <Box sx={{ mb: 3 }}>
                <Typography variant="body2" fontWeight="medium" sx={{ mb: 1 }}>
                  Information Retention
                </Typography>
                <Typography variant="body1">
                  {aiSummary?.learningPatterns?.retentionRate}
                </Typography>
              </Box>
              <Box sx={{ mb: 3 }}>
                <Typography variant="body2" fontWeight="medium" sx={{ mb: 1 }}>
                  Common Error Patterns
                </Typography>
                <Typography variant="body1">
                  {aiSummary?.learningPatterns?.errorPatterns}
                </Typography>
              </Box>
              <Box>
                <Typography variant="body2" fontWeight="medium" sx={{ mb: 1 }}>
                  Recommended Learning Techniques
                </Typography>
                <Typography variant="body1">
                  {aiSummary?.learningPatterns?.recommendedTechniques}
                </Typography>
              </Box>
            </Card>
          </Grid>
        </Grid>
      )}
      
      {/* Test History Tab */}
      {activeTab === 3 && (
        <Grid container spacing={3}>
          {/* Test Attempts Table */}
          <Grid item xs={12}>
            <Card sx={{ borderRadius: 2, boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)' }}>
              <CardContent>
                <Typography variant="h5" fontWeight="bold" sx={{ mb: 3 }}>
                  Recent Test Attempts
                </Typography>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Subject</TableCell>
                        <TableCell>Date</TableCell>
                        <TableCell>Score</TableCell>
                        <TableCell>Accuracy</TableCell>
                        <TableCell>Time Spent (min)</TableCell>
                        <TableCell>Questions Solved</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {realTestAttempts.map((test) => (
                        <TableRow key={test.id}>
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <Avatar 
                                sx={{ 
                                  width: 30, 
                                  height: 30, 
                                  mr: 1, 
                                  bgcolor: subjects.find(s => s.name === test.subject)?.color 
                                }}
                              >
                                {test.subject.substring(0, 1)}
                              </Avatar>
                              {test.subject}
                            </Box>
                          </TableCell>
                          <TableCell>{test.date}</TableCell>
                          <TableCell>
                            <Typography 
                              fontWeight="bold" 
                              color={test.score >= 75 ? 'success.main' : test.score >= 60 ? 'warning.main' : 'error.main'}
                            >
                              {test.score}%
                            </Typography>
                          </TableCell>
                          <TableCell>{test.accuracy}%</TableCell>
                          <TableCell>{test.timeSpent} min</TableCell>
                          <TableCell>{test.questionsSolved}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          </Grid>
          
          {/* Test Performance Analysis */}
          <Grid item xs={12} md={6}>
            <Card sx={{ p: 3, borderRadius: 2, boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)' }}>
              <Typography variant="h6" fontWeight="bold" sx={{ mb: 3 }}>
                Question Type Analysis
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={realQuestionTypeAnalysis}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="type" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="correct" stackId="a" fill="#4caf50" name="Correct" />
                  <Bar dataKey="incorrect" stackId="a" fill="#f44336" name="Incorrect" />
                </BarChart>
              </ResponsiveContainer>
              <Box sx={{ mt: 2 }}>
                <Typography variant="body2">
                  <strong>Strengths:</strong> Excellent performance in memory-based and conceptual questions.
                </Typography>
                <Typography variant="body2">
                  <strong>Areas for Improvement:</strong> Focus on diagram-based and numerical problem-solving.
                </Typography>
              </Box>
            </Card>
          </Grid>
          
          {/* Time Management Analysis */}
          <Grid item xs={12} md={6}>
            <Card sx={{ p: 3, borderRadius: 2, boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)' }}>
              <Typography variant="h6" fontWeight="bold" sx={{ mb: 3 }}>
                Time Management Analysis
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'rgba(0, 0, 0, 0.02)', borderRadius: 2 }}>
                    <AccessTimeIcon sx={{ fontSize: 40, color: theme.palette.primary.main, mb: 1 }} />
                    <Typography variant="h4" fontWeight="bold" color="primary">
                      1.4
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Minutes per question (average)
                    </Typography>
                    <Chip 
                      icon={<TrendingDownIcon />} 
                      label="12% faster than average" 
                      size="small" 
                      color="success" 
                      sx={{ mt: 1 }}
                    />
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'rgba(0, 0, 0, 0.02)', borderRadius: 2 }}>
                    <SpeedIcon sx={{ fontSize: 40, color: theme.palette.primary.main, mb: 1 }} />
                    <Typography variant="h4" fontWeight="bold" color="primary">
                      85%
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Time efficiency score
                    </Typography>
                    <Chip 
                      icon={<TrendingUpIcon />} 
                      label="Top 15% percentile" 
                      size="small" 
                      color="success" 
                      sx={{ mt: 1 }}
                    />
                  </Box>
                </Grid>
              </Grid>
              
              <Box sx={{ mt: 3 }}>
                <Typography variant="body2" fontWeight="medium" sx={{ mb: 1 }}>
                  Key Observations
                </Typography>
                <List dense>
                  <ListItem sx={{ px: 0 }}>
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: theme.palette.info.light, width: 24, height: 24 }}>
                        <TimelineIcon fontSize="small" />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText primary="Your performance drops 18% in the final quarter of tests (vs. 7-10% average)." />
                  </ListItem>
                  <ListItem sx={{ px: 0 }}>
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: theme.palette.success.light, width: 24, height: 24 }}>
                        <CheckCircleIcon fontSize="small" />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText primary="You excel in quick-response questions, averaging 45 seconds per question." />
                  </ListItem>
                  <ListItem sx={{ px: 0 }}>
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: theme.palette.error.light, width: 24, height: 24 }}>
                        <PriorityHighIcon fontSize="small" />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText primary="Complex numerical problems take 3.2x longer than conceptual questions." />
                  </ListItem>
                </List>
              </Box>
            </Card>
          </Grid>
        </Grid>
      )}
      
      {/* Peer Comparison Tab */}
      {activeTab === 4 && (
        <Grid container spacing={3}>
          {/* Peer Comparison Chart */}
          <Grid item xs={12}>
            <Card sx={{ p: 3, borderRadius: 2, boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)' }}>
              <Typography variant="h5" fontWeight="bold" sx={{ mb: 3 }}>
                Subject Performance vs. Peer Average
              </Typography>
              <ResponsiveContainer width="100%" height={350}>
                <BarChart
                  data={realComparativeData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="subject" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="studentScore" name="Your Score" fill="#7445f8" />
                  <Bar dataKey="peerAverage" name="Peer Average" fill="#bdbdbd" />
                </BarChart>
              </ResponsiveContainer>
            </Card>
          </Grid>
          
          {/* Percentile Ranks */}
          <Grid item xs={12} md={6}>
            <Card sx={{ p: 3, borderRadius: 2, boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)' }}>
              <Typography variant="h6" fontWeight="bold" sx={{ mb: 3 }}>
                Your Percentile Ranks
              </Typography>
              <Box sx={{ mb: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Typography variant="body1" fontWeight="medium">
                    Overall Percentile:
                  </Typography>
                  <Box sx={{ flexGrow: 1, mx: 2 }}>
                    <LinearProgress 
                      variant="determinate" 
                      value={aiSummary?.peerComparison?.overallPercentile || 85} 
                      sx={{ 
                        height: 10, 
                        borderRadius: 5,
                        backgroundColor: 'rgba(0,0,0,0.1)',
                        '& .MuiLinearProgress-bar': {
                          backgroundColor: '#7445f8'
                        }
                      }}
                    />
                  </Box>
                  <Typography variant="body1" fontWeight="bold">
                    {aiSummary?.peerComparison?.overallPercentile || 85}th
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                  You're outperforming 85% of students on our platform
                </Typography>
              </Box>
              
              <Divider sx={{ my: 2 }} />
              
              <Typography variant="subtitle1" fontWeight="medium" sx={{ mb: 2 }}>
                Subject Percentiles
              </Typography>
              {subjects.map((subject) => (
                <Box key={subject.id} sx={{ mb: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                    <Avatar sx={{ width: 24, height: 24, mr: 1, bgcolor: subject.color }}>
                      <subject.icon sx={{ fontSize: 16 }} />
                    </Avatar>
                    <Typography variant="body2">
                      {subject.name}:
                    </Typography>
                    <Box sx={{ flexGrow: 1, mx: 2 }}>
                      <LinearProgress 
                        variant="determinate" 
                        value={aiSummary?.peerComparison?.subjectPercentiles?.[subject.id] || 75} 
                        sx={{ 
                          height: 8, 
                          borderRadius: 4,
                          backgroundColor: 'rgba(0,0,0,0.1)',
                          '& .MuiLinearProgress-bar': {
                            backgroundColor: subject.color
                          }
                        }}
                      />
                    </Box>
                    <Typography variant="body2" fontWeight="bold">
                      {aiSummary?.peerComparison?.subjectPercentiles?.[subject.id] || 75}th
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Card>
          </Grid>
          
          {/* Skill Comparison */}
          <Grid item xs={12} md={6}>
            <Card sx={{ p: 3, borderRadius: 2, boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)' }}>
              <Typography variant="h6" fontWeight="bold" sx={{ mb: 3 }}>
                Skill Comparison
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <RadarChart outerRadius={90} data={[
                  { skill: 'Conceptual Understanding', you: 88, peers: 75 },
                  { skill: 'Problem Solving', you: 82, peers: 70 },
                  { skill: 'Memory Recall', you: 85, peers: 72 },
                  { skill: 'Application', you: 68, peers: 65 },
                  { skill: 'Analysis', you: 78, peers: 68 }
                ]}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="skill" />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} />
                  <Radar name="You" dataKey="you" stroke="#7445f8" fill="#7445f8" fillOpacity={0.6} />
                  <Radar name="Peers" dataKey="peers" stroke="#bdbdbd" fill="#bdbdbd" fillOpacity={0.6} />
                  <Legend />
                </RadarChart>
              </ResponsiveContainer>
              <Box sx={{ mt: 2 }}>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  <strong>Key Strengths vs Peers:</strong> {aiSummary?.peerComparison?.strengths}
                </Typography>
                <Typography variant="body2">
                  <strong>Areas for Improvement:</strong> {aiSummary?.peerComparison?.improvements}
                </Typography>
              </Box>
            </Card>
          </Grid>
          
          {/* Prediction Model */}
          <Grid item xs={12}>
            <Card sx={{ p: 3, borderRadius: 2, boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Avatar sx={{ bgcolor: '#7445f8', mr: 2 }}>
                  <AutoGraphIcon />
                </Avatar>
                <Typography variant="h6" fontWeight="bold">
                  Success Prediction Model
                </Typography>
              </Box>
              
              <Grid container spacing={3}>
                <Grid item xs={12} md={4}>
                  <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'rgba(116, 69, 248, 0.05)', borderRadius: 2 }}>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Current Score
                    </Typography>
                    <Typography variant="h3" fontWeight="bold" color="primary">
                      {aiSummary?.progressPrediction?.currentScore}/100
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Equivalent to ~{aiSummary?.progressPrediction?.currentScore * 7.2}/720 NEET Score
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'rgba(116, 69, 248, 0.05)', borderRadius: 2 }}>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Projected Score (in {aiSummary?.progressPrediction?.timeline})
                    </Typography>
                    <Typography variant="h3" fontWeight="bold" color="primary">
                      {aiSummary?.progressPrediction?.projectedScore}/100
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Equivalent to ~{aiSummary?.progressPrediction?.projectedScore * 7.2}/720 NEET Score
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'rgba(116, 69, 248, 0.05)', borderRadius: 2 }}>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Probability of Success
                    </Typography>
                    <Typography variant="h3" fontWeight="bold" color="primary">
                      {aiSummary?.progressPrediction?.probabilityOfSuccess}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Based on your current trajectory & historical data
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
              
              <Box sx={{ mt: 3 }}>
                <Typography variant="subtitle1" fontWeight="medium" sx={{ mb: 2 }}>
                  Critical Interventions for Success
                </Typography>
                <List>
                  {aiSummary?.progressPrediction?.criticalInterventions?.map((intervention, index) => (
                    <ListItem key={index} sx={{ pl: 0 }}>
                      <ListItemAvatar>
                        <Avatar sx={{ bgcolor: theme.palette.primary.light }}>
                          <PriorityHighIcon />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText primary={intervention} />
                    </ListItem>
                  ))}
                </List>
              </Box>
            </Card>
          </Grid>
        </Grid>
      )}

      {/* Integrated Analysis Tab */}
      {activeTab === 5 && (
        <Grid container spacing={3}>
          {/* Holistic View Card - Similar to existing, but use real data */}
          
          {/* Connected Performance Matrix - Use real data */}
          <Grid item xs={12}>
            <Card sx={{ p: 3, borderRadius: 2, boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)' }}>
              <Typography variant="h6" fontWeight="bold" sx={{ mb: 3 }}>
                Connected Performance Matrix
              </Typography>
              <TableContainer component={Paper} elevation={0}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Key Metric</TableCell>
                      <TableCell>Physics</TableCell>
                      <TableCell>Chemistry</TableCell>
                      <TableCell>Biology</TableCell>
                      <TableCell>Cross-Subject Impact</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow>
                      <TableCell><strong>Topic Mastery</strong></TableCell>
                      <TableCell>{Math.round(realTopicsData.physics.reduce((sum, topic) => sum + topic.mastery, 0) / realTopicsData.physics.length)}%</TableCell>
                      <TableCell>{Math.round(realTopicsData.chemistry.reduce((sum, topic) => sum + topic.mastery, 0) / realTopicsData.chemistry.length)}%</TableCell>
                      <TableCell>{Math.round(realTopicsData.biology.reduce((sum, topic) => sum + topic.mastery, 0) / realTopicsData.biology.length)}%</TableCell>
                      <TableCell>Strong correlation with test scores (+68%)</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell><strong>Test Performance</strong></TableCell>
                      <TableCell>{realTestAttempts.filter(t => t.subject === 'Physics').reduce((sum, test) => sum + test.score, 0) / realTestAttempts.filter(t => t.subject === 'Physics').length || 0}%</TableCell>
                      <TableCell>{realTestAttempts.filter(t => t.subject === 'Chemistry').reduce((sum, test) => sum + test.score, 0) / realTestAttempts.filter(t => t.subject === 'Chemistry').length || 0}%</TableCell>
                      <TableCell>{realTestAttempts.filter(t => t.subject === 'Biology').reduce((sum, test) => sum + test.score, 0) / realTestAttempts.filter(t => t.subject === 'Biology').length || 0}%</TableCell>
                      <TableCell>Predicts NEET score with 82% accuracy</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell><strong>Time Efficiency</strong></TableCell>
                      <TableCell>86%</TableCell>
                      <TableCell>79%</TableCell>
                      <TableCell>81%</TableCell>
                      <TableCell>12% better than peer average</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell><strong>Progress Rate</strong></TableCell>
                      <TableCell>{(realPerformanceHistory[realPerformanceHistory.length-1].physics - realPerformanceHistory[0].physics) / realPerformanceHistory.length}% per month</TableCell>
                      <TableCell>{(realPerformanceHistory[realPerformanceHistory.length-1].chemistry - realPerformanceHistory[0].chemistry) / realPerformanceHistory.length}% per month</TableCell>
                      <TableCell>{(realPerformanceHistory[realPerformanceHistory.length-1].biology - realPerformanceHistory[0].biology) / realPerformanceHistory.length}% per month</TableCell>
                      <TableCell>Puts you on track for 85% mastery in 3 months</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </Card>
          </Grid>
          
          {/* Fix all icon issues with proper React element creation */}
          <Grid item xs={12} md={6}>
            <Card sx={{ p: 3, borderRadius: 2, boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)', height: '100%' }}>
              <Typography variant="h6" fontWeight="bold" sx={{ mb: 3 }}>
                Integrated Predictive Analysis
              </Typography>
              <Box sx={{ mb: 3 }}>
                <Typography variant="body2" fontWeight="medium" sx={{ mb: 1 }}>
                  Expected NEET Performance Projection
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Typography variant="h4" fontWeight="bold" color="primary" sx={{ mr: 2 }}>
                    {Math.round(aiSummary?.progressPrediction?.projectedScore * 7.2)}/720
                  </Typography>
                  <Chip 
                    label={`${aiSummary?.progressPrediction?.probabilityOfSuccess} probability`}
                    color="success"
                    size="small"
                  />
    </Box>
              </Box>
              
              <Typography variant="body2" fontWeight="medium" sx={{ mb: 1 }}>
                Contributing Factors
              </Typography>
              <List dense>
                <ListItem sx={{ px: 0 }}>
                  <ListItemAvatar>
                    <Avatar sx={{ bgcolor: subjects[0].color, width: 28, height: 28 }}>
                      {React.createElement(subjects[0].icon, { fontSize: "small" })}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText 
                    primary={`Physics: ${aiSummary?.progressPrediction?.projectedScore * 0.33 * 1.8}/180 projected`}
                    secondary="Strong performance in mechanics and optics"
                  />
                </ListItem>
                <ListItem sx={{ px: 0 }}>
                  <ListItemAvatar>
                    <Avatar sx={{ bgcolor: subjects[1].color, width: 28, height: 28 }}>
                      {React.createElement(subjects[1].icon, { fontSize: "small" })}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText 
                    primary={`Chemistry: ${aiSummary?.progressPrediction?.projectedScore * 0.33 * 1.8}/180 projected`}
                    secondary="Improvement needed in organic mechanisms"
                  />
                </ListItem>
                <ListItem sx={{ px: 0 }}>
                  <ListItemAvatar>
                    <Avatar sx={{ bgcolor: subjects[2].color, width: 28, height: 28 }}>
                      {React.createElement(subjects[2].icon, { fontSize: "small" })}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText 
                    primary={`Biology: ${aiSummary?.progressPrediction?.projectedScore * 0.34 * 1.8}/180 projected`}
                    secondary="Focus area: taxonomy and classification"
                  />
                </ListItem>
              </List>
            </Card>
          </Grid>
          
          {/* Rest of Integrated Analysis Tab */}
        </Grid>
      )}

      {/* Deep Analysis Tab - New tab for comprehensive insights */}
      {activeTab === 6 && deepAnalysis && (
        <Grid container spacing={3}>
          {/* Test Performance Summary */}
          <Grid item xs={12}>
            <Card sx={{ p: 3, borderRadius: 2, boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)' }}>
              <Typography variant="h5" fontWeight="bold" sx={{ mb: 3 }}>
                Comprehensive Test Analysis
              </Typography>
              <Grid container spacing={4}>
                <Grid item xs={12} md={3}>
                  <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'rgba(116, 69, 248, 0.05)', borderRadius: 2 }}>
                    <Typography variant="h2" fontWeight="bold" color="primary">
                      {deepAnalysis.testsTaken}
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                      Tests Taken
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} md={3}>
                  <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'rgba(116, 69, 248, 0.05)', borderRadius: 2 }}>
                    <Typography variant="h2" fontWeight="bold" color="primary">
                      {deepAnalysis.totalQuestions}
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                      Questions Attempted
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} md={3}>
                  <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'rgba(116, 69, 248, 0.05)', borderRadius: 2 }}>
                    <Typography variant="h2" fontWeight="bold" color="primary">
                      {deepAnalysis.avgAccuracy}%
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                      Overall Accuracy
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} md={3}>
                  <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'rgba(116, 69, 248, 0.05)', borderRadius: 2 }}>
                    <Typography variant="h2" fontWeight="bold" color="primary">
                      {deepAnalysis.avgTimePerQuestion}s
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                      Avg. Time per Question
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </Card>
          </Grid>
          
          {/* Recent Test Analysis */}
          <Grid item xs={12}>
            <Card sx={{ p: 3, borderRadius: 2, boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)' }}>
              <Typography variant="h6" fontWeight="bold" sx={{ mb: 3 }}>
                Last 3 Tests - Detailed Analysis
              </Typography>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Subject</TableCell>
                      <TableCell>Date</TableCell>
                      <TableCell>Performance</TableCell>
                      <TableCell>Time Management</TableCell>
                      <TableCell>Strongest Topic</TableCell>
                      <TableCell>Weakest Topic</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {recentTestAttempts.map((test, index) => {
                      // Extract test-specific analytics
                      const testDate = new Date(test.completedAt).toLocaleDateString();
                      
                      // Get strongest and weakest topics
                      const topicPerf = test.topicPerformance || {};
                      let strongestTopic = { topic: 'N/A', accuracy: 0 };
                      let weakestTopic = { topic: 'N/A', accuracy: 100 };
                      
                      Object.keys(topicPerf).forEach(topic => {
                        const accuracy = topicPerf[topic].accuracy;
                        if (accuracy > strongestTopic.accuracy) {
                          strongestTopic = { topic, accuracy };
                        }
                        if (accuracy < weakestTopic.accuracy) {
                          weakestTopic = { topic, accuracy };
                        }
                      });
                      
                      // Calculate time management score
                      const avgTimePerQuestion = Math.round(test.totalTime / test.totalQuestions);
                      const timeManagement = 
                        avgTimePerQuestion < 60 ? "Excellent" :
                        avgTimePerQuestion < 90 ? "Good" : 
                        avgTimePerQuestion < 120 ? "Average" : "Needs Improvement";
                      
                      return (
                        <TableRow key={index}>
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <Avatar 
                                sx={{ 
                                  width: 30, 
                                  height: 30, 
                                  mr: 1, 
                                  bgcolor: subjects.find(s => s.name === test.subject)?.color 
                                }}
                              >
                                {test.subject.substring(0, 1)}
                              </Avatar>
                              {test.subject}
                            </Box>
                          </TableCell>
                          <TableCell>{testDate}</TableCell>
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <Typography 
                                fontWeight="bold" 
                                color={
                                  test.score >= 80 ? 'success.main' : 
                                  test.score >= 65 ? 'warning.main' : 
                                  'error.main'
                                }
                                sx={{ mr: 1 }}
                              >
                                {test.score}%
                              </Typography>
                              <Chip 
                                size="small"
                                label={
                                  test.score >= 80 ? "Excellent" : 
                                  test.score >= 65 ? "Good" : 
                                  "Needs Improvement"
                                }
                                color={
                                  test.score >= 80 ? "success" : 
                                  test.score >= 65 ? "warning" : 
                                  "error"
                                }
                              />
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Typography color={
                              timeManagement === "Excellent" ? 'success.main' :
                              timeManagement === "Good" ? 'success.main' :
                              timeManagement === "Average" ? 'warning.main' :
                              'error.main'
                            }>
                              {timeManagement}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {avgTimePerQuestion}s per question
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography fontWeight="medium">
                              {strongestTopic.topic}
                            </Typography>
                            <Typography variant="body2" color="success.main">
                              {strongestTopic.accuracy}% correct
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography fontWeight="medium">
                              {weakestTopic.topic}
                            </Typography>
                            <Typography variant="body2" color="error.main">
                              {weakestTopic.accuracy}% correct
                            </Typography>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
            </Card>
          </Grid>
          
          {/* Topic Improvement Areas */}
          <Grid item xs={12} md={6}>
            <Card sx={{ p: 3, borderRadius: 2, boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)', height: '100%' }}>
              <Typography variant="h6" fontWeight="bold" sx={{ mb: 3 }}>
                Focus Areas for Improvement
              </Typography>
              {deepAnalysis.topicsNeedingImprovement.length > 0 ? (
                <List>
                  {deepAnalysis.topicsNeedingImprovement.map((topic, index) => (
                    <ListItem key={index} sx={{ pl: 0 }}>
                      <ListItemAvatar>
                        <Avatar sx={{ bgcolor: theme.palette.error.light }}>
                          <PriorityHighIcon />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText 
                        primary={
                          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Typography fontWeight="medium">
                              {topic.topic} ({topic.subject})
                            </Typography>
                            <Typography fontWeight="bold" color="error.main">
                              {topic.mastery}%
                            </Typography>
                          </Box>
                        }
                        secondary={`Appeared in ${topic.occurrences} questions`}
                      />
                    </ListItem>
                  ))}
                </List>
              ) : (
                <Box sx={{ p: 3, textAlign: 'center' }}>
                  <Typography variant="body1" color="text.secondary">
                    Not enough data to determine improvement areas yet.
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    Complete more tests to see personalized recommendations.
                  </Typography>
                </Box>
              )}
              {deepAnalysis.topicsNeedingImprovement.length > 0 && (
                <Box sx={{ mt: 2, p: 2, bgcolor: 'rgba(244, 67, 54, 0.05)', borderRadius: 2 }}>
                  <Typography variant="subtitle2" fontWeight="bold" sx={{ mb: 1 }}>
                    Remediation Strategy
                  </Typography>
                  <Typography variant="body2">
                    Focus on these topics with targeted study sessions of 30-45 minutes each.
                    Use active recall techniques and practice with progressively harder problems.
                  </Typography>
                </Box>
              )}
            </Card>
          </Grid>
          
          {/* Strengths */}
          <Grid item xs={12} md={6}>
            <Card sx={{ p: 3, borderRadius: 2, boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)', height: '100%' }}>
              <Typography variant="h6" fontWeight="bold" sx={{ mb: 3 }}>
                Your Strongest Topics
              </Typography>
              {deepAnalysis.topStrengths.length > 0 ? (
                <List>
                  {deepAnalysis.topStrengths.map((topic, index) => (
                    <ListItem key={index} sx={{ pl: 0 }}>
                      <ListItemAvatar>
                        <Avatar sx={{ bgcolor: theme.palette.success.light }}>
                          <CheckCircleIcon />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText 
                        primary={
                          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Typography fontWeight="medium">
                              {topic.topic} ({topic.subject})
                            </Typography>
                            <Typography fontWeight="bold" color="success.main">
                              {topic.mastery}%
                            </Typography>
                          </Box>
                        }
                        secondary={`Mastered in ${topic.occurrences} questions`}
                      />
                    </ListItem>
                  ))}
                </List>
              ) : (
                <Box sx={{ p: 3, textAlign: 'center' }}>
                  <Typography variant="body1" color="text.secondary">
                    Not enough data to determine strengths yet.
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    Complete more tests to see your strongest topics.
                  </Typography>
                </Box>
              )}
              {deepAnalysis.topStrengths.length > 0 && (
                <Box sx={{ mt: 2, p: 2, bgcolor: 'rgba(76, 175, 80, 0.05)', borderRadius: 2 }}>
                  <Typography variant="subtitle2" fontWeight="bold" sx={{ mb: 1 }}>
                    Leverage Strategy
                  </Typography>
                  <Typography variant="body2">
                    Maintain your strong topics with periodic review sessions.
                    Consider using these strengths to build connections with weaker areas.
                  </Typography>
                </Box>
              )}
            </Card>
          </Grid>
          
          {/* Time Management Analysis */}
          <Grid item xs={12}>
            <Card sx={{ p: 3, borderRadius: 2, boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)' }}>
              <Typography variant="h6" fontWeight="bold" sx={{ mb: 3 }}>
                Time Management Analysis
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12} md={7}>
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="body1" paragraph>
                      Your time management analysis shows you're spending an average of <strong>{deepAnalysis.avgTimePerQuestion} seconds</strong> per question, which is considered <strong>{deepAnalysis.timeManagementScore}</strong> for NEET exam preparation.
                    </Typography>
                    <Typography variant="body1">
                      {deepAnalysis.timeManagementScore === 'Good' 
                        ? "You're demonstrating excellent time management skills. Keep practicing to maintain this pace."
                        : "You may need to work on your speed. Try practicing with timed mock tests and focus on improving your question-solving strategy."}
                    </Typography>
                  </Box>
                  <Box sx={{ p: 2, bgcolor: 'rgba(116, 69, 248, 0.05)', borderRadius: 2 }}>
                    <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 1 }}>
                      Time Management Tips
                    </Typography>
                    <List dense>
                      <ListItem>
                        <ListItemIcon>
                          <AccessTimeIcon color="primary" sx={{ fontSize: 20 }} />
                        </ListItemIcon>
                        <ListItemText primary="Allocate 1-1.5 minutes per NEET MCQ question" />
                      </ListItem>
                      <ListItem>
                        <ListItemIcon>
                          <PriorityHighIcon color="primary" sx={{ fontSize: 20 }} />
                        </ListItemIcon>
                        <ListItemText primary="Skip difficult questions initially and return to them later" />
                      </ListItem>
                      <ListItem>
                        <ListItemIcon>
                          <CheckCircleIcon color="primary" sx={{ fontSize: 20 }} />
                        </ListItemIcon>
                        <ListItemText primary="Practice elimination techniques for multiple-choice questions" />
                      </ListItem>
                    </List>
                  </Box>
                </Grid>
                <Grid item xs={12} md={5}>
                  <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <Box sx={{ mb: 3, textAlign: 'center' }}>
                      <Typography variant="h4" fontWeight="bold" color="primary">
                        {deepAnalysis.avgTimePerQuestion}s
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Average Time per Question
                      </Typography>
                    </Box>
                    <Box sx={{ mb: 3 }}>
                      <Typography variant="body2" fontWeight="medium" sx={{ mb: 1 }}>
                        Time Efficiency Rating
                      </Typography>
                      <LinearProgress 
                        variant="determinate" 
                        value={deepAnalysis.timeManagementScore === 'Good' ? 85 : 60} 
                        sx={{ 
                          height: 10, 
                          borderRadius: 5,
                          backgroundColor: 'rgba(0,0,0,0.1)',
                          '& .MuiLinearProgress-bar': {
                            backgroundColor: deepAnalysis.timeManagementScore === 'Good' ? '#4caf50' : '#ff9800'
                          }
                        }}
                      />
                    </Box>
                    <Box>
                      <Typography variant="body2" fontWeight="medium" sx={{ mb: 1 }}>
                        NEET Benchmark
                      </Typography>
                      <Typography variant="body2">
                        NEET exam requires answering 180 questions in 180 minutes (60 seconds per question).
                        {deepAnalysis.avgTimePerQuestion <= 60 
                          ? ' You are meeting this benchmark.' 
                          : ' You need to improve your speed to meet this benchmark.'}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
              </Grid>
            </Card>
          </Grid>
          
          {/* Smart Recommendations */}
          <Grid item xs={12}>
            <Card sx={{ p: 3, borderRadius: 2, boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)' }}>
              <Typography variant="h6" fontWeight="bold" sx={{ mb: 3 }}>
                Smart Study Recommendations
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12} md={4}>
                  <Box sx={{ p: 2, bgcolor: 'rgba(76, 175, 80, 0.05)', borderRadius: 2, height: '100%' }}>
                    <Typography variant="h6" fontWeight="medium" sx={{ mb: 2, color: 'success.main' }}>
                      Short-term Plan (7 days)
                    </Typography>
                    <List dense>
                      {deepAnalysis.topicsNeedingImprovement.slice(0, 2).map((topic, index) => (
                        <ListItem key={index}>
                          <ListItemText 
                            primary={`Focus on ${topic.topic} (${topic.subject})`}
                            secondary={`Allocate 3-4 hours, aim for ${Math.min(100, topic.mastery + 15)}% mastery`}
                          />
                        </ListItem>
                      ))}
                      <ListItem>
                        <ListItemText 
                          primary="Take 2 subject-specific practice tests"
                          secondary="Focus on topics you've studied this week"
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemText 
                          primary="Review mistakes and create correction notes"
                          secondary="Spend 1 hour on error analysis"
                        />
                      </ListItem>
                    </List>
                  </Box>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Box sx={{ p: 2, bgcolor: 'rgba(33, 150, 243, 0.05)', borderRadius: 2, height: '100%' }}>
                    <Typography variant="h6" fontWeight="medium" sx={{ mb: 2, color: 'primary.main' }}>
                      Mid-term Plan (30 days)
                    </Typography>
                    <List dense>
                      <ListItem>
                        <ListItemText 
                          primary={`Complete all topics in ${deepAnalysis.topicsNeedingImprovement[0]?.subject || 'your weakest subject'}`}
                          secondary="Schedule 3-4 sessions per week"
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemText 
                          primary="Take 4 full-length practice tests"
                          secondary="Simulate exam conditions, focus on time management"
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemText 
                          primary="Create concept maps for complex topics"
                          secondary="Connect related concepts across subjects"
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemText 
                          primary="Implement spaced repetition for difficult topics"
                          secondary="Use flashcards or digital tools"
                        />
                      </ListItem>
                    </List>
                  </Box>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Box sx={{ p: 2, bgcolor: 'rgba(156, 39, 176, 0.05)', borderRadius: 2, height: '100%' }}>
                    <Typography variant="h6" fontWeight="medium" sx={{ mb: 2, color: 'secondary.main' }}>
                      Long-term Strategy
                    </Typography>
                    <List dense>
                      <ListItem>
                        <ListItemText 
                          primary="Develop a balanced study schedule"
                          secondary="Allocate time based on subject difficulty"
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemText 
                          primary="Track your progress with regular assessments"
                          secondary="Take at least 2 tests per week"
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemText 
                          primary="Focus on application-based learning"
                          secondary="Practice real-world applications of concepts"
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemText 
                          primary="Build topic connections across subjects"
                          secondary="Especially between Biology and Chemistry"
                        />
                      </ListItem>
                    </List>
                  </Box>
                </Grid>
              </Grid>
            </Card>
          </Grid>
        </Grid>
      )}
      
      {/* Emotion Analysis Tab */}
      {activeTab === 7 && (
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h4" fontWeight="bold">
                Emotion Analysis
              </Typography>
              <Button 
                variant="contained" 
                color={isEmotionTrackingActive ? "error" : "primary"}
                onClick={toggleEmotionTracking}
              >
                {isEmotionTrackingActive ? "Stop Tracking" : "Start Tracking"}
              </Button>
            </Box>
            
            {emotionData.length === 0 ? (
              <Card sx={{ borderRadius: 2, boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)', p: 4, textAlign: 'center' }}>
                <Typography variant="h6" sx={{ mb: 2 }}>
                  No emotion data available yet
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Enable emotion tracking to start analyzing your study patterns based on emotional states.
                </Typography>
                <Button 
                  variant="contained" 
                  sx={{ mt: 3 }}
                  onClick={() => setShowEmotionTrackerDialog(true)}
                >
                  Enable Tracking
                </Button>
              </Card>
            ) : (
              <EmotionSummary emotionData={emotionData} />
            )}
          </Grid>
        </Grid>
      )}
      
      {/* Add the EmotionTracker component (invisible) to track emotions */}
      <EmotionTracker 
        isActive={isEmotionTrackingActive && !showRealTimeDetector} 
        onEmotionDetected={handleEmotionDetected} 
      />
      
      {/* Add a dialog to explain and enable emotion tracking */}
      <Dialog
        open={showEmotionTrackerDialog}
        onClose={() => setShowEmotionTrackerDialog(false)}
      >
        <DialogTitle>Enable Emotion Tracking</DialogTitle>
        <DialogContent>
          <Typography variant="body1" paragraph>
            With emotion tracking enabled, we'll analyze your facial expressions to understand when you're focused, confused, or engaged.
          </Typography>
          <Typography variant="body1" paragraph>
            This helps create a personalized study pattern based on when you're most receptive to learning.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowEmotionTrackerDialog(false)}>Cancel</Button>
          <Button 
            variant="contained" 
            onClick={() => {
              setIsEmotionTrackingActive(true);
              setShowEmotionTrackerDialog(false);
            }}
          >
            Enable Tracking
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Real-Time Emotion Detection Dialog */}
      <Dialog
        open={realTimePermissionDialog}
        onClose={() => setRealTimePermissionDialog(false)}
        maxWidth="sm"
      >
        <DialogTitle>Enable Real-Time Emotion Detection</DialogTitle>
        <DialogContent>
          <Typography variant="body1" paragraph>
            To analyze your emotional state in real-time while studying, we need to access your camera.
          </Typography>
          <Typography variant="body1" paragraph>
            This feature uses AI to detect your facial expressions and emotions as you study, helping you understand when you're most engaged or when you might be struggling.
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Your privacy is important. All processing happens locally on your device and no images are stored.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setRealTimePermissionDialog(false)}>
            Cancel
          </Button>
          <Button 
            variant="contained" 
            color="primary"
            onClick={startRealTimeDetection}
          >
            Enable Real-Time Detection
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Real-Time Emotion Detector Component */}
      {showRealTimeDetector && (
        <RealTimeEmotionDetector
          onClose={() => setShowRealTimeDetector(false)}
          onEmotionDetected={handleRealTimeEmotionDetected}
        />
      )}
    </Box>
  );
}

export default AnalyticsSummary; 