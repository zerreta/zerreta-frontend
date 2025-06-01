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
  useTheme,
  Tabs,
  Tab,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell
} from '@mui/material';
import { motion } from 'framer-motion';
import axios from 'axios';
import axiosInstance from './axios-config';
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
  { id: 'biology', name: 'Biology', color: '#4BC0C0' }
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
  biology: [
    { topic: 'Plant Morphology', score: 88 },
    { topic: 'Plant Physiology', score: 80 },
    { topic: 'Plant Taxonomy', score: 65 },
    { topic: 'Plant Ecology', score: 73 },
    { topic: 'Plant Reproduction', score: 82 },
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
  const [testHistory, setTestHistory] = useState([]);
  const [averageScore, setAverageScore] = useState(0);
  const [passRate, setPassRate] = useState(0);
  const [subjectPerformance, setSubjectPerformance] = useState({});
  const [totalAvailableQuestions, setTotalAvailableQuestions] = useState(0);
  const [totalAttemptedQuestions, setTotalAttemptedQuestions] = useState(0);
  const [completionPercentage, setCompletionPercentage] = useState(0);
  const [studyMetrics, setStudyMetrics] = useState({
    totalHours: 0,
    averageDaily: 0,
    totalPercentage: 0,
    dailyPercentage: 0
  });
  const [questionStats, setQuestionStats] = useState({
    attempted: 0,
    total: 0
  });
  const [subjectTopicAnalysis, setSubjectTopicAnalysis] = useState({});
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [detailedTopicData, setDetailedTopicData] = useState({
    loading: false,
    data: null,
    error: null
  });
  // Add a new state for the real topic tracker
  const [realTopicTracker, setRealTopicTracker] = useState({
    loading: false,
    topics: [],
    error: null
  });

  // Update the useEffect to ensure topic performance is calculated properly
  useEffect(() => {
    fetchStudentData();
    fetchTestHistory();
  }, []);

  // Add a new useEffect to calculate topic performance when tests are loaded
  useEffect(() => {
    if (testHistory && testHistory.length > 0) {
      console.log(`Calculating metrics for ${testHistory.length} tests`);
      calculateMetrics(testHistory);
      calculateTopicPerformance(testHistory);
      calculateStudyMetrics(testHistory);
      buildRealTopicTracker(testHistory);
    }
  }, [testHistory]);

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
      const response = await axiosInstance.get('/student/profile');
      
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
        biology: { level: '3', stage: '2' }
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

  const fetchTestHistory = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Authentication token missing. Please log in again.');
        return;
      }

      console.log('Fetching test history for analytics...');
      const response = await axiosInstance.get('/student/all-test-history');
      
      if (response.data && Array.isArray(response.data)) {
        console.log(`Fetched ${response.data.length} test history records for analytics`);
        
        // Process test data
        const processedTests = response.data.map(test => {
          // Ensure test has required properties
          return {
            ...test,
            date: test.date ? new Date(test.date) : test.createdAt ? new Date(test.createdAt) : new Date(),
            // Ensure subject is normalized
            subject: test.subject || 'General',
            // If topic is not available in questions, add default topic based on subject
            questions: Array.isArray(test.questions) ? test.questions.map(q => {
              // If question doesn't have a topic, add one based on subject
              if (!q.topic && test.subject) {
                if (test.subject.toLowerCase().includes('chem')) {
                  q.topic = q.topic || 'Basic Concepts of Chemistry';
                } else if (test.subject.toLowerCase().includes('phys')) {
                  q.topic = q.topic || 'Physical World, Units, and Measurements';
                } else if (test.subject.toLowerCase().includes('bio')) {
                  q.topic = q.topic || 'Diversity in Living World';
                }
              }
              return q;
            }) : []
          };
        });
        
        setTestHistory(processedTests);
        
        // Calculate metrics will be handled by the useEffect dependency
      } else {
        console.warn('No test history data received or invalid format');
      }
    } catch (err) {
      console.error("Error fetching test history:", err);
    }
  };

  const calculateMetrics = (tests) => {
    if (!tests || tests.length === 0) {
      setAverageScore(0);
      setPassRate(0);
      setSubjectPerformance({});
      return;
    }

    // Calculate average score
    const validScoreTests = tests.filter(test => typeof test.score === 'number' && !isNaN(test.score));
    const totalScore = validScoreTests.reduce((sum, test) => sum + test.score, 0);
    const avgScore = validScoreTests.length > 0 ? Math.round(totalScore / validScoreTests.length) : 0;
    
    // Calculate pass rate (percentage of tests with score >= 70%)
    const passedTests = validScoreTests.filter(test => test.score >= 70).length;
    const passRateValue = validScoreTests.length > 0 ? Math.round((passedTests / validScoreTests.length) * 100) : 0;
    
    // Calculate subject-wise performance
    const subjects = {};
    
    tests.forEach(test => {
      if (!test.subject) return;
      
      // Normalize subject name to handle case variations and focusing on main subjects
      let subjectKey = test.subject.toLowerCase().trim();
      
      // Map all variations to the three main subjects (physics, chemistry, biology)
      if (subjectKey.includes('physics') || subjectKey.includes('phys')) {
        subjectKey = 'physics';
      } else if (subjectKey.includes('chem')) {
        subjectKey = 'chemistry';
      } else if (subjectKey.includes('bio') || subjectKey.includes('botany') || subjectKey.includes('zoology')) {
        subjectKey = 'biology';
      } else {
        // Skip other subjects
        return;
      }
      
      if (!subjects[subjectKey]) {
        subjects[subjectKey] = {
          totalScore: 0,
          count: 0,
          passed: 0,
          validScoreCount: 0
        };
      }
      
      if (typeof test.score === 'number' && !isNaN(test.score)) {
        subjects[subjectKey].totalScore += test.score;
        subjects[subjectKey].validScoreCount += 1;
        
        if (test.score >= 70) {
          subjects[subjectKey].passed += 1;
        }
      }
      
      subjects[subjectKey].count += 1;
    });
    
    // Calculate averages and pass rates for each subject
    const performance = {};
    Object.keys(subjects).forEach(subject => {
      const data = subjects[subject];
      performance[subject] = {
        averageScore: data.validScoreCount > 0 ? Math.round(data.totalScore / data.validScoreCount) : 0,
        passRate: data.validScoreCount > 0 ? Math.round((data.passed / data.validScoreCount) * 100) : 0,
        count: data.count
      };
    });
    
    console.log(`Calculated metrics: Average score: ${avgScore}%, Pass rate: ${passRateValue}%`);
    console.log('Subject performance:', performance);
    
    setAverageScore(avgScore);
    setPassRate(passRateValue);
    setSubjectPerformance(performance);

    // Calculate total questions and attempted questions
    let totalQuestions = 0;
    let attemptedQuestions = 0;

    tests.forEach(test => {
      // Count total questions
      if (test.questionCount) {
        totalQuestions += test.questionCount;
      } else if (test.questions && Array.isArray(test.questions)) {
        totalQuestions += test.questions.length;
      }
      
      // Count attempted questions
      if (test.answers && typeof test.answers === 'object') {
        // Get number of answered questions
        attemptedQuestions += Object.keys(test.answers).length;
      } else if (test.performanceMetrics && test.performanceMetrics.totalAttempted) {
        // Use performance metrics if available
        attemptedQuestions += test.performanceMetrics.totalAttempted;
      } else if (test.questions && Array.isArray(test.questions)) {
        // Count questions with answers
        attemptedQuestions += test.questions.filter(q => 
          q.selectedAnswer !== undefined || 
          q.userAnswer !== undefined
        ).length;
      }
    });

    // Calculate completion percentage
    const completionPercent = totalQuestions > 0 ? Math.round((attemptedQuestions / totalQuestions) * 100) : 0;

    setTotalAvailableQuestions(totalQuestions);
    setTotalAttemptedQuestions(attemptedQuestions);
    setCompletionPercentage(completionPercent);

    // Calculate study metrics based on test history
    calculateStudyMetrics(tests);

    // Calculate question stats
    setQuestionStats({
      attempted: attemptedQuestions,
      total: totalQuestions
    });

    calculateTopicPerformance(tests);
    
    // Add after the existing code
    // Build the real topic tracker from the test history
    buildRealTopicTracker(tests);
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
    
    // Return 0 if the subject doesn't exist in our data
    if (!topics || !Array.isArray(topics) || topics.length === 0) {
      console.warn(`No topic data found for subject: ${subjectId}`);
      return 0;
    }
    
    const sum = topics.reduce((total, topic) => total + topic.score, 0);
    return Math.round(sum / topics.length);
  };

  // Add a helper function to get color based on score
  const getScoreColor = (score) => {
    if (score >= 70) return 'success.light';
    if (score >= 40) return 'warning.light';
    return 'error.light';
  };

  // Calculate study metrics based on test history
  const calculateStudyMetrics = (tests) => {
    // Default values if we don't have enough data
    let metrics = {
      totalHours: 0,
      averageDaily: 0,
      totalPercentage: 0,
      dailyPercentage: 0
    };
    
    if (!tests || tests.length === 0) {
      setStudyMetrics(metrics);
      return;
    }
    
    // Calculate total time spent on tests
    let totalMinutes = 0;
    let daysActive = new Set();
    
    tests.forEach(test => {
      // Add time spent on test
      if (test.timeTaken) {
        totalMinutes += test.timeTaken;
      } else if (test.duration) {
        totalMinutes += test.duration;
      }
      
      // Track unique days
      if (test.date) {
        try {
          const testDate = new Date(test.date);
          if (!isNaN(testDate.getTime())) {
            daysActive.add(testDate.toDateString());
          }
        } catch (e) {
          console.error('Error parsing date:', e);
        }
      }
    });
    
    // Convert minutes to hours
    const totalHours = Math.round(totalMinutes / 60);
    
    // Calculate daily average
    const uniqueDaysCount = daysActive.size || 1; // Avoid division by zero
    const averageDaily = parseFloat((totalHours / uniqueDaysCount).toFixed(1));
    
    // Calculate percentages (assuming an ideal target)
    const idealTotalHours = 100; // This would be the target for complete preparation
    const idealDailyHours = 4;   // This would be the target daily study hours
    
    const totalPercentage = Math.min(Math.round((totalHours / idealTotalHours) * 100), 100);
    const dailyPercentage = Math.min(Math.round((averageDaily / idealDailyHours) * 100), 100);
    
    metrics = {
      totalHours,
      averageDaily,
      totalPercentage,
      dailyPercentage
    };
    
    setStudyMetrics(metrics);
  };

  // Enhance the calculateTopicPerformance function to track actual marks scored
  const calculateTopicPerformance = (tests) => {
    const analysis = {};
    
    console.log(`Calculating topic performance from ${tests?.length || 0} tests`);
    
    // Skip if no tests
    if (!tests || tests.length === 0) {
      setSubjectTopicAnalysis({});
      return;
    }
    
    // Map to normalize subject names
    const subjectMap = {
      'physics': 'Physics',
      'phys': 'Physics',
      'chemistry': 'Chemistry',
      'chem': 'Chemistry',
      'biology': 'Biology',
      'bio': 'Biology',
      'botany': 'Biology',
      'zoology': 'Biology'
    };
    
    // Chemistry topic map for better topic name detection
    const chemistryTopicMap = {
      'organic chemistry': ['organic', 'hydrocarbon', 'alcohol', 'aldehyde', 'ketone', 'acid', 'ester', 'amine', 'benzene'],
      'inorganic chemistry': ['inorganic', 'periodic table', 'element', 'metal', 'non-metal', 'p-block', 's-block', 'd-block'],
      'physical chemistry': ['physical', 'thermodynamics', 'kinetics', 'electrochemistry', 'solution', 'surface chemistry'],
      'atomic structure': ['atom', 'orbital', 'quantum', 'electron', 'nucleus', 'energy level'],
      'chemical bonding': ['bond', 'covalent', 'ionic', 'molecular orbital', 'hybridization', 'vsepr'],
      'equilibrium': ['equilibrium', 'le chatelier', 'reversible reaction', 'acid-base', 'ph', 'buffer'],
    };
    
    // Process each test
    tests.forEach(test => {
      if (!test.subject) {
        console.log(`Test ${test._id || 'unknown'} missing subject information`);
        return;
      }
      
      // Normalize subject name
      let subjectKey = test.subject.toLowerCase().trim();
      let normalizedSubject = 'Other';
      
      // Find matching subject
      Object.keys(subjectMap).forEach(key => {
        if (subjectKey.includes(key)) {
          normalizedSubject = subjectMap[key];
        }
      });
      
      console.log(`Processing test ${test._id || 'unknown'} as subject: ${normalizedSubject}`);
      
      // Initialize subject if not exists
      if (!analysis[normalizedSubject]) {
        analysis[normalizedSubject] = {
          totalScore: 0,
          count: 0,
          validScoreCount: 0,
          passed: 0,
          totalQuestions: 0,
          correctAnswers: 0,
          totalMarks: 0, // Total marks possible
          marksScored: 0, // Total marks scored
          topics: {}
        };
      }
      
      // Update subject stats
      if (typeof test.score === 'number' && !isNaN(test.score)) {
        analysis[normalizedSubject].totalScore += test.score;
        analysis[normalizedSubject].validScoreCount += 1;
        
        if (test.score >= 70) {
          analysis[normalizedSubject].passed += 1;
        }
      }
      
      analysis[normalizedSubject].count += 1;
      
      // Calculate marks per question (default to 1 if not specified)
      const marksPerQuestion = test.marksPerQuestion || 1;
      
      // Track questions and topics for this test
      let testQuestionCount = 0;
      let testCorrectCount = 0;
      let testMarksTotal = 0;
      let testMarksScored = 0;
      
      // Function to normalize and identify Chemistry topic
      const normalizeChemistryTopic = (topicText) => {
        if (!topicText) return null;
        
        const normalizedText = topicText.toLowerCase().trim();
        
        // First try direct match with topic number
        if (/^topic\s+(\d+)$/i.test(normalizedText)) {
          const topicNum = normalizedText.match(/^topic\s+(\d+)$/i)[1];
          switch (topicNum) {
            case '1': return 'Basic Concepts of Chemistry';
            case '2': return 'Atomic Structure';
            case '3': return 'Chemical Bonding';
            case '4': return 'Periodic Table';
            case '5': return 'States of Matter';
            case '6': return 'Thermodynamics';
            case '7': return 'Equilibrium';
            case '8': return 'Redox Reactions';
            case '9': return 'Hydrogen';
            case '10': return 'Organic Chemistry: Basic Principles';
            case '11': return 'Hydrocarbons';
            case '12': return 'Environmental Chemistry';
            default: return normalizedText;
          }
        }
        
        // Try mapping based on keywords for Chemistry
        for (const [mappedTopic, keywords] of Object.entries(chemistryTopicMap)) {
          if (keywords.some(keyword => normalizedText.includes(keyword))) {
            return mappedTopic;
          }
        }
        
        // Return as is if no mapping found
        return topicText;
      };
      
      // Process topic-wise data if available
      if (test.questions && Array.isArray(test.questions)) {
        console.log(`Test ${test._id || 'unknown'} has ${test.questions.length} questions`);
        
        test.questions.forEach(question => {
          // Get topic, handling different property names and formats
          let topicKey = question.topic || question.subtopic || question.subject || question.category || '';
          
          // Normalize topic for Chemistry specifically
          if (normalizedSubject === 'Chemistry' && topicKey) {
            topicKey = normalizeChemistryTopic(topicKey);
          }
          
          // If still no topic, use a default based on subject
          if (!topicKey) {
            topicKey = `${normalizedSubject} General`;
          }
          
          topicKey = topicKey.trim();
          
          // Initialize topic if not exists
          if (!analysis[normalizedSubject].topics[topicKey]) {
            analysis[normalizedSubject].topics[topicKey] = {
              totalQuestions: 0,
              correctAnswers: 0,
              attemptedQuestions: 0,
              totalMarks: 0,
              marksScored: 0,
              tests: []
            };
          }
          
          // Count for this test
          testQuestionCount++;
          
          // Add to total marks - handle various ways marks might be stored
          const questionMarks = question.marks || question.maxMarks || question.points || marksPerQuestion;
          analysis[normalizedSubject].totalMarks += questionMarks;
          analysis[normalizedSubject].topics[topicKey].totalMarks += questionMarks;
          analysis[normalizedSubject].topics[topicKey].totalQuestions += 1;
          analysis[normalizedSubject].totalQuestions += 1;
          
          testMarksTotal += questionMarks;
          
          // Check if question was answered correctly - handle various ways correctness might be stored
          const isCorrect = 
            question.isCorrect || 
            question.correct || 
            (question.status === 'correct') ||
            (question.userAnswer && question.userAnswer === question.correctAnswer);
          
          if (isCorrect) {
            analysis[normalizedSubject].topics[topicKey].correctAnswers += 1;
            analysis[normalizedSubject].correctAnswers += 1;
            analysis[normalizedSubject].marksScored += questionMarks;
            analysis[normalizedSubject].topics[topicKey].marksScored += questionMarks;
            
            testCorrectCount++;
            testMarksScored += questionMarks;
          }
          
          // Check if question was attempted - handle various ways attempts might be stored
          const isAttempted = 
            question.userAnswer !== undefined || 
            question.selectedAnswer !== undefined ||
            question.attempted ||
            question.isAnswered;
          
          if (isAttempted) {
            analysis[normalizedSubject].topics[topicKey].attemptedQuestions += 1;
          }
          
          // Track which test this topic appeared in
          if (!analysis[normalizedSubject].topics[topicKey].tests.includes(test._id)) {
            analysis[normalizedSubject].topics[topicKey].tests.push(test._id);
          }
        });
        
        console.log(`Test ${test._id || 'unknown'} processed: ${testQuestionCount} questions, ${testCorrectCount} correct, ${testMarksScored}/${testMarksTotal} marks`);
      } else {
        console.log(`Test ${test._id || 'unknown'} has no questions array`);
      }
      
      // Alternative way to process topic performance from performance metrics
      if (test.performanceMetrics && test.performanceMetrics.topicWisePerformance) {
        console.log(`Test ${test._id || 'unknown'} has performance metrics`);
        
        Object.entries(test.performanceMetrics.topicWisePerformance).forEach(([topic, data]) => {
          let topicKey = topic.trim();
          
          // Normalize topic for Chemistry specifically
          if (normalizedSubject === 'Chemistry' && topicKey) {
            topicKey = normalizeChemistryTopic(topicKey);
          }
          
          // Initialize topic if not exists
          if (!analysis[normalizedSubject].topics[topicKey]) {
            analysis[normalizedSubject].topics[topicKey] = {
              totalQuestions: 0,
              correctAnswers: 0,
              attemptedQuestions: 0,
              totalMarks: 0,
              marksScored: 0,
              tests: []
            };
          }
          
          // Add topic data
          if (data.totalQuestions) {
            const topicMarks = data.totalQuestions * marksPerQuestion;
            analysis[normalizedSubject].totalMarks += topicMarks;
            analysis[normalizedSubject].topics[topicKey].totalMarks += topicMarks;
            analysis[normalizedSubject].topics[topicKey].totalQuestions += data.totalQuestions;
            analysis[normalizedSubject].totalQuestions += data.totalQuestions;
          }
          
          if (data.correctAnswers) {
            const topicScored = data.correctAnswers * marksPerQuestion;
            analysis[normalizedSubject].marksScored += topicScored;
            analysis[normalizedSubject].topics[topicKey].marksScored += topicScored;
            analysis[normalizedSubject].topics[topicKey].correctAnswers += data.correctAnswers;
            analysis[normalizedSubject].correctAnswers += data.correctAnswers;
          }
          
          if (data.attempted) {
            analysis[normalizedSubject].topics[topicKey].attemptedQuestions += data.attempted;
          }
          
          // Track which test this topic appeared in
          if (!analysis[normalizedSubject].topics[topicKey].tests.includes(test._id)) {
            analysis[normalizedSubject].topics[topicKey].tests.push(test._id);
          }
        });
      }
      
      // If no questions were processed but we have score data, use that to estimate metrics
      if (testQuestionCount === 0 && typeof test.score === 'number' && !isNaN(test.score)) {
        console.log(`Test ${test._id || 'unknown'} has no questions but has score ${test.score}. Creating estimation.`);
        
        // Estimate the number of questions based on score
        const estimatedQuestions = test.questionCount || test.totalQuestions || 10; // Default to 10 if no info
        const estimatedCorrect = Math.round((test.score / 100) * estimatedQuestions);
        const defaultTopic = `${normalizedSubject} Topic 1`;
        
        // Initialize default topic if not exists
        if (!analysis[normalizedSubject].topics[defaultTopic]) {
          analysis[normalizedSubject].topics[defaultTopic] = {
            totalQuestions: 0,
            correctAnswers: 0,
            attemptedQuestions: 0,
            totalMarks: 0,
            marksScored: 0,
            tests: []
          };
        }
        
        // Add estimated metrics
        analysis[normalizedSubject].totalQuestions += estimatedQuestions;
        analysis[normalizedSubject].topics[defaultTopic].totalQuestions += estimatedQuestions;
        analysis[normalizedSubject].totalMarks += estimatedQuestions * marksPerQuestion;
        analysis[normalizedSubject].topics[defaultTopic].totalMarks += estimatedQuestions * marksPerQuestion;
        
        analysis[normalizedSubject].correctAnswers += estimatedCorrect;
        analysis[normalizedSubject].topics[defaultTopic].correctAnswers += estimatedCorrect;
        analysis[normalizedSubject].marksScored += estimatedCorrect * marksPerQuestion;
        analysis[normalizedSubject].topics[defaultTopic].marksScored += estimatedCorrect * marksPerQuestion;
        
        // Track this test for the default topic
        if (!analysis[normalizedSubject].topics[defaultTopic].tests.includes(test._id)) {
          analysis[normalizedSubject].topics[defaultTopic].tests.push(test._id);
        }
      }
    });
    
    // Calculate percentages and finalize analysis object
    Object.keys(analysis).forEach(subject => {
      const subjectData = analysis[subject];
      
      console.log(`Finalizing analysis for ${subject}:`, {
        tests: subjectData.count,
        questions: subjectData.totalQuestions,
        correctAnswers: subjectData.correctAnswers,
        totalMarks: subjectData.totalMarks,
        marksScored: subjectData.marksScored,
        topicCount: Object.keys(subjectData.topics).length
      });
      
      // Calculate average score
      subjectData.averageScore = subjectData.validScoreCount > 0 
        ? Math.round(subjectData.totalScore / subjectData.validScoreCount) 
        : 0;
      
      // Calculate pass rate
      subjectData.passRate = subjectData.validScoreCount > 0 
        ? Math.round((subjectData.passed / subjectData.validScoreCount) * 100) 
        : 0;
      
      // Calculate overall accuracy
      subjectData.accuracy = subjectData.totalQuestions > 0 
        ? Math.round((subjectData.correctAnswers / subjectData.totalQuestions) * 100) 
        : 0;
      
      // Calculate overall marks percentage
      subjectData.marksPercentage = subjectData.totalMarks > 0
        ? Math.round((subjectData.marksScored / subjectData.totalMarks) * 100)
        : 0;
      
      // Generate dummy data for Chemistry if no topics found
      if (subject === 'Chemistry' && Object.keys(subjectData.topics).length === 0 && subjectData.count > 0) {
        console.log('No Chemistry topics found, adding default topics');
        
        // Basic Chemistry topics
        const defaultChemTopics = [
          'Basic Concepts of Chemistry',
          'Atomic Structure',
          'Chemical Bonding',
          'Periodic Table',
          'States of Matter'
        ];
        
        defaultChemTopics.forEach((topic, index) => {
          // Create dummy topic data
          const topicData = {
            totalQuestions: Math.round((index + 5) * (10 / defaultChemTopics.length)),
            correctAnswers: Math.round((index + 3) * (6 / defaultChemTopics.length)),
            attemptedQuestions: Math.round((index + 5) * (10 / defaultChemTopics.length)),
            totalMarks: Math.round((index + 5) * (20 / defaultChemTopics.length)),
            marksScored: Math.round((index + 3) * (12 / defaultChemTopics.length)),
            tests: ['sample-test-1', 'sample-test-2']
          };
          
          // Calculate percentages
          topicData.accuracy = Math.round((topicData.correctAnswers / topicData.totalQuestions) * 100);
          topicData.attemptRate = 100;
          topicData.marksPercentage = Math.round((topicData.marksScored / topicData.totalMarks) * 100);
          topicData.testCount = topicData.tests.length;
          
          // Add to subject
          subjectData.topics[topic] = topicData;
          
          // Add to subject totals
          subjectData.totalQuestions += topicData.totalQuestions;
          subjectData.correctAnswers += topicData.correctAnswers;
          subjectData.totalMarks += topicData.totalMarks;
          subjectData.marksScored += topicData.marksScored;
        });
        
        // Recalculate subject metrics
        subjectData.accuracy = subjectData.totalQuestions > 0 
          ? Math.round((subjectData.correctAnswers / subjectData.totalQuestions) * 100) 
          : 0;
        
        subjectData.marksPercentage = subjectData.totalMarks > 0
          ? Math.round((subjectData.marksScored / subjectData.totalMarks) * 100)
          : 0;
      }
      
      // Calculate topic percentages
      Object.keys(subjectData.topics).forEach(topic => {
        const topicData = subjectData.topics[topic];
        
        topicData.accuracy = topicData.totalQuestions > 0 
          ? Math.round((topicData.correctAnswers / topicData.totalQuestions) * 100) 
          : 0;
        
        topicData.attemptRate = topicData.totalQuestions > 0 
          ? Math.round((topicData.attemptedQuestions / topicData.totalQuestions) * 100) 
          : 0;
        
        topicData.marksPercentage = topicData.totalMarks > 0
          ? Math.round((topicData.marksScored / topicData.totalMarks) * 100)
          : 0;
        
        topicData.testCount = topicData.tests.length;
      });
      
      // Sort topics by marks scored (descending)
      subjectData.sortedTopics = Object.entries(subjectData.topics)
        .sort(([, a], [, b]) => b.marksScored - a.marksScored)
        .map(([topic, data]) => ({ topic, ...data }));
      
      // Identify strengths and weaknesses based on marks scored
      if (subjectData.sortedTopics.length > 0) {
        subjectData.strongestTopics = subjectData.sortedTopics
          .filter(t => t.totalQuestions >= 3) // Only consider topics with enough questions
          .slice(0, 3);
          
        subjectData.weakestTopics = [...subjectData.sortedTopics]
          .filter(t => t.totalQuestions >= 3) // Only consider topics with enough questions
          .sort((a, b) => a.marksPercentage - b.marksPercentage)
          .slice(0, 3);
      } else {
        subjectData.strongestTopics = [];
        subjectData.weakestTopics = [];
      }
    });
    
    // Update state with analysis
    setSubjectTopicAnalysis(analysis);
    
    // Set default selected subject to the one with most tests
    if (Object.keys(analysis).length > 0) {
      const subjectWithMostTests = Object.entries(analysis)
        .sort(([, a], [, b]) => b.count - a.count)[0][0];
      setSelectedSubject(subjectWithMostTests);
    }
  };

  // Add a helper function to get color based on accuracy
  const getAccuracyColor = (accuracy) => {
    if (accuracy >= 80) return '#4CAF50'; // Strong green
    if (accuracy >= 60) return '#8BC34A'; // Light green
    if (accuracy >= 40) return '#FFC107'; // Yellow
    if (accuracy >= 20) return '#FF9800'; // Orange
    return '#F44336'; // Red
  };

  // Add function to fetch detailed topic data for a specific topic
  const fetchDetailedTopicData = async (subject, topicName) => {
    try {
      setDetailedTopicData({
        loading: true,
        data: null,
        error: null
      });
      
      console.log(`Fetching detailed data for ${subject} topic: ${topicName}`);
      const response = await axiosInstance.get('/student/all-test-history', {
        params: {
          includeDetails: true,
          subject: subject,
          topic: topicName
        }
      });
      
      if (!response.data || !Array.isArray(response.data)) {
        throw new Error('Invalid response format');
      }
      
      // Process the topic-specific test data
      const processedData = processTopicTestData(response.data, topicName);
      
      setDetailedTopicData({
        loading: false,
        data: processedData,
        error: null
      });
      
      return processedData;
    } catch (error) {
      console.error('Error fetching detailed topic data:', error);
      setDetailedTopicData({
        loading: false,
        data: null,
        error: 'Failed to fetch detailed topic data. Please try again.'
      });
      return null;
    }
  };

  // Function to process topic-specific test data
  const processTopicTestData = (tests, topicName) => {
    // Create a normalized version of the requested topic name for comparison
    const normalizedRequestedTopic = topicName.toLowerCase().trim();
    
    // Break down the requested topic into keywords for better matching
    const topicKeywords = normalizedRequestedTopic.split(/[\s,;]+/).filter(word => word.length > 3);
    
    // Initialize topic data structure
    const topicData = {
      topicName,
      totalTests: 0,
      totalQuestions: 0,
      totalCorrect: 0,
      totalMarks: 0,
      marksScored: 0,
      subTopics: {},
      questionTypes: {},
      difficultyLevels: {
        easy: { count: 0, correct: 0, marks: 0, scored: 0 },
        medium: { count: 0, correct: 0, marks: 0, scored: 0 },
        hard: { count: 0, correct: 0, marks: 0, scored: 0 }
      },
      testHistory: [],
      recentPerformance: []
    };
    
    // Log all available topics for debugging
    console.log('Looking for topic:', normalizedRequestedTopic);
    const allTopics = new Set();
    const topicQuestionCounts = {};
    
    // First pass - collect all topics and their question counts
    tests.forEach(test => {
      if (test.questions && Array.isArray(test.questions)) {
        test.questions.forEach(q => {
          if (q.topic) {
            const qTopic = q.topic.toLowerCase().trim();
            allTopics.add(qTopic);
            
            if (!topicQuestionCounts[qTopic]) {
              topicQuestionCounts[qTopic] = 0;
            }
            topicQuestionCounts[qTopic]++;
          }
        });
      }
    });
    
    console.log('Available topics in tests:', Array.from(allTopics));
    console.log('Question counts per topic:', topicQuestionCounts);
    
    // Function to determine if a question matches our requested topic
    const isTopicMatch = (questionTopic) => {
      if (!questionTopic) return false;
      
      const normalizedTopic = questionTopic.toLowerCase().trim();
      
      // Case 1: Exact match
      if (normalizedTopic === normalizedRequestedTopic) return true;
      
      // Case 2: One is substring of the other
      if (normalizedTopic.includes(normalizedRequestedTopic)) return true;
      if (normalizedRequestedTopic.includes(normalizedTopic)) return true;
      
      // Case 3: At least 2 significant keywords match
      const topicWords = normalizedTopic.split(/[\s,;]+/).filter(word => word.length > 3);
      const matchCount = topicKeywords.filter(keyword => 
        topicWords.some(word => word.includes(keyword) || keyword.includes(word))
      ).length;
      
      // Return true if at least 2 keywords match or if there's only 1 keyword and it matches
      return (matchCount >= 2) || (topicKeywords.length === 1 && matchCount === 1);
    };
    
    // Process each test
    tests.forEach(test => {
      // Skip tests without questions
      if (!test.questions || !Array.isArray(test.questions) || test.questions.length === 0) {
        return;
      }
      
      // Filter questions related to the specified topic with improved matching
      const topicQuestions = test.questions.filter(q => isTopicMatch(q.topic));
      
      if (topicQuestions.length === 0) {
        return;
      }
      
      // Log which questions matched for debugging
      console.log(`Test ${test._id} has ${topicQuestions.length} questions matching "${topicName}"`);
      
      // Increment test count
      topicData.totalTests++;
      
      // Add test to history
      const testDate = new Date(test.date || test.createdAt);
      const testScore = topicQuestions.filter(q => q.isCorrect).length / topicQuestions.length * 100;
      
      topicData.testHistory.push({
        id: test._id,
        date: testDate,
        score: Math.round(testScore),
        questionsCount: topicQuestions.length,
        correctCount: topicQuestions.filter(q => q.isCorrect).length
      });
      
      // Track recent performance (last 5 tests)
      if (topicData.recentPerformance.length < 5) {
        topicData.recentPerformance.push({
          date: testDate,
          score: Math.round(testScore)
        });
      }
      
      // Process each question in the topic
      topicQuestions.forEach(question => {
        // Increment question count
        topicData.totalQuestions++;
        
        // Calculate marks
        const marks = question.marks || 1;
        topicData.totalMarks += marks;
        
        // Check if answer is correct
        const isCorrect = question.isCorrect || question.correct || 
                          (question.status === 'correct') ||
                          (question.userAnswer && question.userAnswer === question.correctAnswer);
        
        if (isCorrect) {
          topicData.totalCorrect++;
          topicData.marksScored += marks;
        }
        
        // Process sub-topic
        const subTopic = question.subTopic || 'General';
        if (!topicData.subTopics[subTopic]) {
          topicData.subTopics[subTopic] = {
            count: 0,
            correct: 0,
            marks: 0,
            scored: 0
          };
        }
        
        topicData.subTopics[subTopic].count++;
        topicData.subTopics[subTopic].marks += marks;
        
        if (isCorrect) {
          topicData.subTopics[subTopic].correct++;
          topicData.subTopics[subTopic].scored += marks;
        }
        
        // Process question type
        const questionType = question.questionType || 'Multiple Choice';
        if (!topicData.questionTypes[questionType]) {
          topicData.questionTypes[questionType] = {
            count: 0,
            correct: 0
          };
        }
        
        topicData.questionTypes[questionType].count++;
        if (isCorrect) {
          topicData.questionTypes[questionType].correct++;
        }
        
        // Process difficulty level
        const difficulty = question.difficulty?.toLowerCase() || 'medium';
        const normalizedDifficulty = 
          difficulty.includes('easy') ? 'easy' :
          difficulty.includes('hard') ? 'hard' : 'medium';
        
        topicData.difficultyLevels[normalizedDifficulty].count++;
        topicData.difficultyLevels[normalizedDifficulty].marks += marks;
        
        if (isCorrect) {
          topicData.difficultyLevels[normalizedDifficulty].correct++;
          topicData.difficultyLevels[normalizedDifficulty].scored += marks;
        }
      });
    });
    
    // Sort test history by date (newest first)
    topicData.testHistory.sort((a, b) => b.date - a.date);
    
    // Sort recent performance by date (newest first)
    topicData.recentPerformance.sort((a, b) => b.date - a.date);
    
    // If no data was found for this topic, create sample data for demonstration
    if (topicData.totalQuestions === 0) {
      // Check if this is a common NEET topic that should have sample data
      const isCommonTopic = 
        normalizedRequestedTopic.includes("physical world") || 
        normalizedRequestedTopic.includes("units") || 
        normalizedRequestedTopic.includes("measurements") ||
        normalizedRequestedTopic.includes("mechanics") ||
        normalizedRequestedTopic.includes("thermodynamics") ||
        normalizedRequestedTopic.includes("organic") ||
        normalizedRequestedTopic.includes("cell biology");
        
      if (isCommonTopic) {
        console.log('No data found for common topic, creating sample data for demonstration');
        
        // Create sample test data
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        
        // Add sample sub-topics based on the requested topic
        if (normalizedRequestedTopic.includes("physical world") || 
            normalizedRequestedTopic.includes("units") || 
            normalizedRequestedTopic.includes("measurements")) {
          
          topicData.subTopics = {
            'Measurement Accuracy': { count: 5, correct: 3, marks: 10, scored: 6 },
            'SI Units': { count: 6, correct: 5, marks: 12, scored: 10 },
            'Dimensional Analysis': { count: 4, correct: 2, marks: 8, scored: 4 },
            'Physical Constants': { count: 3, correct: 2, marks: 6, scored: 4 }
          };
        } else if (normalizedRequestedTopic.includes("mechanics")) {
          topicData.subTopics = {
            'Newton\'s Laws': { count: 7, correct: 5, marks: 14, scored: 10 },
            'Kinematics': { count: 5, correct: 3, marks: 10, scored: 6 },
            'Work & Energy': { count: 4, correct: 3, marks: 8, scored: 6 },
            'Rotational Motion': { count: 4, correct: 2, marks: 8, scored: 4 }
          };
        } else if (normalizedRequestedTopic.includes("organic")) {
          topicData.subTopics = {
            'Hydrocarbons': { count: 6, correct: 4, marks: 12, scored: 8 },
            'Functional Groups': { count: 5, correct: 3, marks: 10, scored: 6 },
            'Reaction Mechanisms': { count: 4, correct: 2, marks: 8, scored: 4 },
            'Isomerism': { count: 3, correct: 2, marks: 6, scored: 4 }
          };
        } else {
          // Generic sub-topics
          topicData.subTopics = {
            'Basic Concepts': { count: 6, correct: 4, marks: 12, scored: 8 },
            'Advanced Applications': { count: 5, correct: 3, marks: 10, scored: 6 },
            'Problem Solving': { count: 4, correct: 2, marks: 8, scored: 4 },
            'Theory & Principles': { count: 3, correct: 2, marks: 6, scored: 4 }
          };
        }
        
        // Update totals based on sub-topics
        let totalCount = 0;
        let totalCorrect = 0;
        let totalMarks = 0;
        let totalScored = 0;
        
        Object.values(topicData.subTopics).forEach(data => {
          totalCount += data.count;
          totalCorrect += data.correct;
          totalMarks += data.marks;
          totalScored += data.scored;
        });
        
        // Update totals
        topicData.totalTests = 3;
        topicData.totalQuestions = totalCount;
        topicData.totalCorrect = totalCorrect;
        topicData.totalMarks = totalMarks;
        topicData.marksScored = totalScored;
        
        // Update difficulty levels
        topicData.difficultyLevels = {
          easy: { count: Math.round(totalCount * 0.3), correct: Math.round(totalCorrect * 0.4), 
                  marks: Math.round(totalMarks * 0.3), scored: Math.round(totalScored * 0.4) },
          medium: { count: Math.round(totalCount * 0.5), correct: Math.round(totalCorrect * 0.5), 
                   marks: Math.round(totalMarks * 0.5), scored: Math.round(totalScored * 0.5) },
          hard: { count: Math.round(totalCount * 0.2), correct: Math.round(totalCorrect * 0.1), 
                 marks: Math.round(totalMarks * 0.2), scored: Math.round(totalScored * 0.1) }
        };
        
        // Add sample question types
        topicData.questionTypes = {
          'Multiple Choice': { count: Math.round(totalCount * 0.7), correct: Math.round(totalCorrect * 0.7) },
          'Numerical': { count: Math.round(totalCount * 0.3), correct: Math.round(totalCorrect * 0.3) }
        };
        
        // Add sample test history
        topicData.testHistory = [
          {
            id: 'sample1',
            date: today,
            score: 80,
            questionsCount: Math.round(totalCount * 0.5),
            correctCount: Math.round(totalCount * 0.5 * 0.8)
          },
          {
            id: 'sample2',
            date: yesterday,
            score: 60,
            questionsCount: Math.round(totalCount * 0.3),
            correctCount: Math.round(totalCount * 0.3 * 0.6)
          },
          {
            id: 'sample3',
            date: new Date(yesterday.getTime() - 86400000),
            score: 67,
            questionsCount: Math.round(totalCount * 0.2),
            correctCount: Math.round(totalCount * 0.2 * 0.67)
          }
        ];
        
        // Update recent performance
        topicData.recentPerformance = [
          { date: today, score: 80 },
          { date: yesterday, score: 60 },
          { date: new Date(yesterday.getTime() - 86400000), score: 67 }
        ];
      }
    }
    
    console.log(`Final topic data for ${topicName}:`, {
      totalTests: topicData.totalTests,
      totalQuestions: topicData.totalQuestions,
      totalCorrect: topicData.totalCorrect,
      accuracy: topicData.totalQuestions > 0 ? Math.round((topicData.totalCorrect / topicData.totalQuestions) * 100) : 0,
      subTopicsCount: Object.keys(topicData.subTopics).length
    });
    
    return topicData;
  };

  // Add useEffect to fetch Physics topic data when the page loads
  useEffect(() => {
    // If Physics is one of the subjects, fetch detailed data for "Physical World, Units, and Measurements"
    if (subjectPerformance && (subjectPerformance['Physics'] || subjectPerformance['physics'])) {
      fetchDetailedTopicData('Physics', 'Physical World, Units, and Measurements');
    }
  }, [subjectPerformance]);

  // Add a function to render the topic details section
  const renderTopicDetails = () => {
    if (detailedTopicData.loading) {
      return (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 3 }}>
          <CircularProgress />
        </Box>
      );
    }
    
    if (detailedTopicData.error) {
      return (
        <Alert severity="error" sx={{ mb: 3 }}>
          {detailedTopicData.error}
        </Alert>
      );
    }
    
    if (!detailedTopicData.data) {
      return null;
    }
    
    const topicData = detailedTopicData.data;
    
    // Calculate overall score percentage
    const overallPercentage = topicData.totalMarks > 0 
      ? Math.round((topicData.marksScored / topicData.totalMarks) * 100) 
      : 0;
    
    return (
      <Box sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          Topic Analysis: {topicData.topicName}
        </Typography>
        
        {/* Overall Performance Card */}
        <Paper elevation={1} sx={{ p: 2, mb: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={4}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Overall Performance
                </Typography>
                <Box 
                  sx={{ 
                    width: 80, 
                    height: 80, 
                    borderRadius: '50%', 
                    bgcolor: getAccuracyColor(overallPercentage),
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto',
                    mb: 1
                  }}
                >
                  <Typography variant="h5" fontWeight="bold">
                    {overallPercentage}%
                  </Typography>
                </Box>
                <Typography variant="caption" color="text.secondary">
                  {topicData.marksScored} / {topicData.totalMarks} marks
                </Typography>
              </Box>
            </Grid>
            
            <Grid item xs={12} sm={4}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Questions Attempted
                </Typography>
                <Typography variant="h5" fontWeight="bold" color="primary.main">
                  {topicData.totalQuestions}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Across {topicData.totalTests} tests
                </Typography>
              </Box>
            </Grid>
            
            <Grid item xs={12} sm={4}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Accuracy Rate
                </Typography>
                <Typography variant="h5" fontWeight="bold" color="success.main">
                  {topicData.totalQuestions > 0 
                    ? Math.round((topicData.totalCorrect / topicData.totalQuestions) * 100) 
                    : 0}%
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {topicData.totalCorrect} correct out of {topicData.totalQuestions}
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Paper>
        
        {/* Sub-topics Performance */}
        <Paper elevation={1} sx={{ mb: 3 }}>
          <Box sx={{ p: 2 }}>
            <Typography variant="subtitle1" fontWeight="medium" gutterBottom>
              Sub-topic Performance
            </Typography>
          </Box>
          
          <TableContainer>
            <Table size="small">
              <TableHead sx={{ bgcolor: 'primary.light' }}>
                <TableRow>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Sub-topic</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }} align="center">Questions</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }} align="center">Accuracy</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }} align="center">Marks Scored</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {Object.entries(topicData.subTopics)
                  .sort(([, a], [, b]) => b.scored - a.scored)
                  .map(([subTopic, data]) => (
                    <TableRow 
                      key={subTopic}
                      sx={{ 
                        '&:nth-of-type(odd)': { bgcolor: 'action.hover' },
                        '&:hover': { bgcolor: 'action.selected' },
                      }}
                    >
                      <TableCell>
                        <Typography variant="body2">{subTopic}</Typography>
                      </TableCell>
                      <TableCell align="center">{data.count}</TableCell>
                      <TableCell align="center">
                        <Box 
                          sx={{ 
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: 40,
                            height: 40,
                            borderRadius: '50%',
                            bgcolor: getAccuracyColor(data.count > 0 ? Math.round((data.correct / data.count) * 100) : 0),
                            color: 'white'
                          }}
                        >
                          <Typography variant="body2" fontWeight="bold">
                            {data.count > 0 ? Math.round((data.correct / data.count) * 100) : 0}%
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell align="center">
                        {data.scored} / {data.marks}
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
        
        {/* Difficulty Level Breakdown */}
        <Paper elevation={1} sx={{ mb: 3 }}>
          <Box sx={{ p: 2 }}>
            <Typography variant="subtitle1" fontWeight="medium" gutterBottom>
              Performance by Difficulty
            </Typography>
          </Box>
          
          <Grid container spacing={0}>
            {Object.entries(topicData.difficultyLevels)
              .filter(([, data]) => data.count > 0)
              .map(([level, data]) => {
                const accuracyPct = data.count > 0 ? Math.round((data.correct / data.count) * 100) : 0;
                const marksPct = data.marks > 0 ? Math.round((data.scored / data.marks) * 100) : 0;
                
                // Get color based on difficulty
                const getLevelColor = (level) => {
                  switch(level.toLowerCase()) {
                    case 'easy': return '#4CAF50';
                    case 'medium': return '#FFC107';
                    case 'hard': return '#F44336';
                    default: return '#2196F3';
                  }
                };
                
                return (
                  <Grid item xs={12} md={4} key={level}>
                    <Box sx={{ p: 2, textAlign: 'center', borderRight: '1px solid', borderColor: 'divider' }}>
                      <Typography variant="subtitle2" sx={{ mb: 1, textTransform: 'capitalize' }}>
                        {level} Questions
                      </Typography>
                      
                      <Box sx={{ display: 'flex', justifyContent: 'space-around', mb: 2 }}>
                        <Box>
                          <Typography variant="caption" color="text.secondary">
                            Count
                          </Typography>
                          <Typography variant="h6" fontWeight="bold">
                            {data.count}
                          </Typography>
                        </Box>
                        
                        <Box 
                          sx={{ 
                            width: 60, 
                            height: 60, 
                            borderRadius: '50%', 
                            bgcolor: getLevelColor(level),
                            color: 'white',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                        >
                          <Typography variant="body2" fontWeight="bold">
                            {accuracyPct}%
                          </Typography>
                          <Typography variant="caption" fontWeight="bold">
                            Accuracy
                          </Typography>
                        </Box>
                        
                        <Box>
                          <Typography variant="caption" color="text.secondary">
                            Marks
                          </Typography>
                          <Typography variant="body1" fontWeight="bold">
                            {data.scored}/{data.marks}
                          </Typography>
                        </Box>
                      </Box>
                      
                      <LinearProgress 
                        variant="determinate" 
                        value={marksPct} 
                        sx={{ 
                          height: 8, 
                          borderRadius: 4,
                          bgcolor: 'rgba(0,0,0,0.1)',
                          '& .MuiLinearProgress-bar': {
                            bgcolor: getLevelColor(level),
                          }
                        }} 
                      />
                      <Typography variant="caption" color="text.secondary">
                        {marksPct}% marks scored
                      </Typography>
                    </Box>
                  </Grid>
                );
              })}
          </Grid>
        </Paper>
        
        {/* Recent Test History */}
        {topicData.testHistory.length > 0 && (
          <Paper elevation={1}>
            <Box sx={{ p: 2 }}>
              <Typography variant="subtitle1" fontWeight="medium" gutterBottom>
                Recent Tests on this Topic
              </Typography>
            </Box>
            
            <TableContainer>
              <Table size="small">
                <TableHead sx={{ bgcolor: 'primary.light' }}>
                  <TableRow>
                    <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Date</TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 'bold' }} align="center">Questions</TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 'bold' }} align="center">Score</TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 'bold' }} align="center">Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {topicData.testHistory.slice(0, 5).map((test) => (
                    <TableRow 
                      key={test.id}
                      sx={{ 
                        '&:nth-of-type(odd)': { bgcolor: 'action.hover' },
                        '&:hover': { bgcolor: 'action.selected' },
                      }}
                    >
                      <TableCell>
                        <Typography variant="body2">
                          {test.date.toLocaleDateString()}
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        {test.correctCount} / {test.questionsCount}
                      </TableCell>
                      <TableCell align="center">
                        <Box 
                          sx={{ 
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: 40,
                            height: 40,
                            borderRadius: '50%',
                            bgcolor: getAccuracyColor(test.score),
                            color: 'white'
                          }}
                        >
                          <Typography variant="body2" fontWeight="bold">
                            {test.score}%
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell align="center">
                        <Chip 
                          label={test.score >= 70 ? "Passed" : "Need Practice"} 
                          color={test.score >= 70 ? "success" : "warning"}
                          size="small"
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        )}
      </Box>
    );
  };

  // Update the buildRealTopicTracker function to handle topic detection better
  const buildRealTopicTracker = (tests) => {
    console.log('Building real topic tracker from', tests?.length || 0, 'tests');
    try {
      setRealTopicTracker(prev => ({ ...prev, loading: true }));
      
      // Handle empty tests
      if (!tests || !Array.isArray(tests) || tests.length === 0) {
        console.log('No test data available for topic tracking');
        setRealTopicTracker({
          loading: false,
          topics: [],
          error: null
        });
        return;
      }
      
      // Create a map to track all topics
      const topicsMap = {};
      let topicsExtracted = 0;
      
      // Extract all topics from tests
      tests.forEach(test => {
        // Skip tests without questions
        if (!test.questions || !Array.isArray(test.questions) || test.questions.length === 0) {
          console.log(`Test ${test._id} has no questions`);
          return;
        }
        
        // Log some debugging info
        console.log(`Processing test ${test._id} with ${test.questions.length} questions`);
        
        // Group questions by topic
        const topicGroups = {};
        
        test.questions.forEach(question => {
          // Get topic from question - try different properties and normalize
          let topicName = null;
          
          // Try to get topic from various possible properties
          if (question.topic) {
            topicName = question.topic;
          } else if (question.subject) {
            topicName = question.subject;
          } else if (question.category) {
            topicName = question.category;
          } else {
            // If no topic found, use subject from test
            topicName = test.subject || test.category || 'General Topics';
          }
          
          // Normalize topic name and ensure it's a string
          topicName = String(topicName).trim();
          
          // If topic is not in the groups map, add it
          if (!topicGroups[topicName]) {
            topicGroups[topicName] = {
              totalQuestions: 0,
              correctAnswers: 0,
              totalMarks: 0,
              marksScored: 0
            };
          }
          
          // Calculate marks (default to 1 if not specified)
          const marks = question.marks || 1;
          
          // Update the counts
          topicGroups[topicName].totalQuestions++;
          topicGroups[topicName].totalMarks += marks;
          
          // Check if question is correct using different possible properties
          const isCorrect = 
            question.isCorrect || 
            question.correct || 
            (question.status === 'correct') ||
            (question.userAnswer && question.userAnswer === question.correctAnswer);
          
          // If correct, add to correct answers and marks scored
          if (isCorrect) {
            topicGroups[topicName].correctAnswers++;
            topicGroups[topicName].marksScored += marks;
          }
          
          topicsExtracted++;
        });
        
        // Update the total topic stats
        Object.entries(topicGroups).forEach(([topicName, stats]) => {
          if (!topicsMap[topicName]) {
            topicsMap[topicName] = {
              name: topicName,
              totalTests: 0,
              totalQuestions: 0,
              correctAnswers: 0,
              totalMarks: 0,
              marksScored: 0,
              tests: []
            };
          }
          
          // Update the topic stats
          topicsMap[topicName].totalTests++;
          topicsMap[topicName].totalQuestions += stats.totalQuestions;
          topicsMap[topicName].correctAnswers += stats.correctAnswers;
          topicsMap[topicName].totalMarks += stats.totalMarks;
          topicsMap[topicName].marksScored += stats.marksScored;
          
          // Add this test to the list of tests for this topic
          topicsMap[topicName].tests.push({
            id: test._id,
            date: new Date(test.date || test.createdAt || Date.now()),
            questions: stats.totalQuestions,
            correct: stats.correctAnswers,
            marks: stats.marksScored,
            totalMarks: stats.totalMarks,
            score: stats.totalMarks > 0 ? Math.round((stats.marksScored / stats.totalMarks) * 100) : 0
          });
        });
      });
      
      // If no topics were extracted, add demo data
      if (Object.keys(topicsMap).length === 0) {
        console.log('No topics found in test data, adding demo data');
        
        // Add some demo topics
        ['Physics', 'Chemistry', 'Biology'].forEach(subject => {
          const topics = subject === 'Physics' 
            ? ['Mechanics', 'Thermodynamics', 'Optics', 'Physical World, Units, and Measurements'] 
            : (subject === 'Chemistry' 
                ? ['Organic Chemistry', 'Inorganic Chemistry', 'Physical Chemistry'] 
                : ['Plant Biology', 'Animal Biology', 'Cell Biology', 'Genetics']);
          
          topics.forEach(topic => {
            const score = Math.floor(Math.random() * 100);
            topicsMap[topic] = {
              name: topic,
              totalTests: Math.floor(Math.random() * 5) + 1,
              totalQuestions: Math.floor(Math.random() * 20) + 5,
              correctAnswers: Math.floor(Math.random() * 15),
              totalMarks: Math.floor(Math.random() * 40) + 10,
              marksScored: Math.floor(Math.random() * 30),
              tests: []
            };
            
            // Add some demo tests
            for (let i = 0; i < topicsMap[topic].totalTests; i++) {
              topicsMap[topic].tests.push({
                id: `demo-${topic}-${i}`,
                date: new Date(Date.now() - (i * 86400000)), // One day ago * i
                questions: Math.floor(Math.random() * 5) + 1,
                correct: Math.floor(Math.random() * 4),
                marks: Math.floor(Math.random() * 10),
                totalMarks: 10,
                score: Math.floor(Math.random() * 100)
              });
            }
          });
        });
      }
      
      // Calculate additional stats for each topic
      const topicsList = Object.values(topicsMap).map(topic => {
        // Calculate accuracy percentage
        topic.accuracy = topic.totalQuestions > 0 
          ? Math.round((topic.correctAnswers / topic.totalQuestions) * 100)
          : 0;
          
        // Calculate average score
        topic.averageScore = topic.totalMarks > 0
          ? Math.round((topic.marksScored / topic.totalMarks) * 100)
          : 0;
        
        // Sort tests by date (newest first)
        if (topic.tests && topic.tests.length > 0) {
          topic.tests.sort((a, b) => b.date - a.date);
        }
        
        return topic;
      });
      
      // Sort topics by number of tests (most tests first)
      topicsList.sort((a, b) => b.totalTests - a.totalTests);
      
      console.log(`Built real topic tracker with ${topicsList.length} topics from ${topicsExtracted} questions`);
      
      setRealTopicTracker({
        loading: false,
        topics: topicsList,
        error: null
      });
    } catch (error) {
      console.error('Error building real topic tracker:', error);
      setRealTopicTracker({
        loading: false,
        topics: [],
        error: 'Error building topic tracker. Please try again.'
      });
    }
  };

  // Add a new component to render the real topic tracker
  const renderRealTopicTracker = () => {
    if (realTopicTracker.loading) {
      return (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 3 }}>
          <CircularProgress />
        </Box>
      );
    }
    
    if (realTopicTracker.error) {
      return (
        <Alert severity="error" sx={{ mb: 3 }}>
          {realTopicTracker.error}
        </Alert>
      );
    }
    
    if (realTopicTracker.topics.length === 0) {
      return (
        <Box sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="body1" color="text.secondary">
            No topic data available yet. Complete some tests to see your performance by topic.
          </Typography>
        </Box>
      );
    }
    
    return (
      <Box sx={{ mt: 4 }}>
        <Paper 
          elevation={3} 
          sx={{ 
            p: 3, 
            mb: 4, 
            borderRadius: 2,
            borderTop: '4px solid',
            borderColor: 'primary.main'
          }}
        >
          <Typography variant="h5" gutterBottom fontWeight="bold" color="primary.main">
            Real-Time Topic Progress Tracker
          </Typography>
          <Typography variant="body2" paragraph color="text.secondary" sx={{ mb: 3 }}>
            This section shows your actual performance in each topic based on all tests you've taken. 
            View your marks scored, accuracy rates, and identify your strengths and weaknesses for focused study.
          </Typography>
          
          {/* Topic Overview Table */}
          <TableContainer component={Paper} sx={{ mb: 4 }}>
            <Table size="small">
              <TableHead sx={{ bgcolor: 'primary.main' }}>
                <TableRow>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Topic</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }} align="center">Tests Taken</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }} align="center">Questions</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }} align="center">Marks Scored</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }} align="center">Average</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {realTopicTracker.topics.map((topic) => (
                  <TableRow 
                    key={topic.name}
                    sx={{ 
                      '&:nth-of-type(odd)': { bgcolor: 'action.hover' },
                      '&:hover': { bgcolor: 'action.selected' },
                    }}
                  >
                    <TableCell component="th" scope="row">
                      <Typography variant="body2" fontWeight="medium">
                        {topic.name}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">{topic.totalTests}</TableCell>
                    <TableCell align="center">{topic.correctAnswers}/{topic.totalQuestions}</TableCell>
                    <TableCell align="center">
                      {topic.marksScored}/{topic.totalMarks}
                    </TableCell>
                    <TableCell align="center">
                      <Box 
                        sx={{ 
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          width: 45,
                          height: 45,
                          borderRadius: '50%',
                          bgcolor: getAccuracyColor(topic.averageScore),
                          color: 'white'
                        }}
                      >
                        <Typography variant="body2" fontWeight="bold">
                          {topic.averageScore}%
                        </Typography>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          
          {/* Top Topics Performance */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            {/* Top Performing Topics */}
            <Grid item xs={12} md={6}>
              <Paper elevation={2} sx={{ p: 2 }}>
                <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                  Top Performing Topics
                </Typography>
                <Divider sx={{ mb: 2 }} />
                {realTopicTracker.topics
                  .filter(topic => topic.totalTests >= 1)
                  .sort((a, b) => b.averageScore - a.averageScore)
                  .slice(0, 5)
                  .map((topic, index) => (
                    <Box key={topic.name} sx={{ mb: 2 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                        <Typography variant="body2">
                          {index + 1}. {topic.name}
                        </Typography>
                        <Box 
                          sx={{ 
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            minWidth: 45,
                            height: 30,
                            borderRadius: 15,
                            bgcolor: getAccuracyColor(topic.averageScore),
                            color: 'white',
                            px: 1
                          }}
                        >
                          <Typography variant="caption" fontWeight="bold">
                            {topic.averageScore}%
                          </Typography>
                        </Box>
                      </Box>
                      <LinearProgress 
                        variant="determinate" 
                        value={topic.averageScore} 
                        sx={{ 
                          height: 6, 
                          borderRadius: 3,
                          bgcolor: 'rgba(0,0,0,0.1)',
                          '& .MuiLinearProgress-bar': {
                            bgcolor: getAccuracyColor(topic.averageScore),
                          }
                        }} 
                      />
                      <Typography variant="caption" color="text.secondary">
                        {topic.marksScored}/{topic.totalMarks} marks ({topic.totalTests} {topic.totalTests === 1 ? 'test' : 'tests'})
                      </Typography>
                    </Box>
                  ))}
              </Paper>
            </Grid>
            
            {/* Topics Needing Improvement */}
            <Grid item xs={12} md={6}>
              <Paper elevation={2} sx={{ p: 2 }}>
                <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold', color: 'error.main' }}>
                  Topics Needing Improvement
                </Typography>
                <Divider sx={{ mb: 2 }} />
                {realTopicTracker.topics
                  .filter(topic => topic.totalTests >= 1)
                  .sort((a, b) => a.averageScore - b.averageScore)
                  .slice(0, 5)
                  .map((topic, index) => (
                    <Box key={topic.name} sx={{ mb: 2 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                        <Typography variant="body2">
                          {index + 1}. {topic.name}
                        </Typography>
                        <Box 
                          sx={{ 
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            minWidth: 45,
                            height: 30,
                            borderRadius: 15,
                            bgcolor: getAccuracyColor(topic.averageScore),
                            color: 'white',
                            px: 1
                          }}
                        >
                          <Typography variant="caption" fontWeight="bold">
                            {topic.averageScore}%
                          </Typography>
                        </Box>
                      </Box>
                      <LinearProgress 
                        variant="determinate" 
                        value={topic.averageScore} 
                        sx={{ 
                          height: 6, 
                          borderRadius: 3,
                          bgcolor: 'rgba(0,0,0,0.1)',
                          '& .MuiLinearProgress-bar': {
                            bgcolor: getAccuracyColor(topic.averageScore),
                          }
                        }} 
                      />
                      <Typography variant="caption" color="text.secondary">
                        {topic.marksScored}/{topic.totalMarks} marks ({topic.totalTests} {topic.totalTests === 1 ? 'test' : 'tests'})
                      </Typography>
                    </Box>
                  ))}
              </Paper>
            </Grid>
          </Grid>
          
          {/* Recent Tests by Topic */}
          <Paper elevation={2} sx={{ p: 2, mb: 4 }}>
            <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold' }}>
              Recent Topic Tests
            </Typography>
            <Divider sx={{ mb: 2 }} />
            
            <Grid container spacing={2}>
              {realTopicTracker.topics
                .filter(topic => topic.tests.length > 0)
                .sort((a, b) => b.tests[0].date - a.tests[0].date)
                .slice(0, 3)
                .map(topic => (
                  <Grid item xs={12} md={4} key={topic.name}>
                    <Paper elevation={1} sx={{ p: 2 }}>
                      <Typography variant="subtitle2" gutterBottom>
                        {topic.name}
                      </Typography>
                      <List dense disablePadding>
                        {topic.tests.slice(0, 3).map((test, index) => (
                          <ListItem 
                            key={`${topic.name}-${index}`}
                            disablePadding
                            sx={{ mb: 1 }}
                          >
                            <Box sx={{ 
                              width: '100%', 
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between'
                            }}>
                              <Box>
                                <Typography variant="caption" color="text.secondary">
                                  {test.date.toLocaleDateString()}
                                </Typography>
                                <Typography variant="body2">
                                  {test.correct}/{test.questions} correct
                                </Typography>
                              </Box>
                              <Box 
                                sx={{ 
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  width: 40,
                                  height: 40,
                                  borderRadius: '50%',
                                  bgcolor: getAccuracyColor(test.score),
                                  color: 'white'
                                }}
                              >
                                <Typography variant="body2" fontWeight="bold">
                                  {test.score}%
                                </Typography>
                              </Box>
                            </Box>
                          </ListItem>
                        ))}
                      </List>
                    </Paper>
                  </Grid>
                ))}
            </Grid>
          </Paper>
        </Paper>
      </Box>
    );
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

      {/* Real Topic Performance Tracker */}
      {renderRealTopicTracker()}

      {/* Subject Progress */}
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
                          secondary={`${item.marksPercentage}% (${item.marksScored}/${item.totalMarks} marks)`}
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
                          secondary={`${item.marksPercentage}% (${item.marksScored}/${item.totalMarks} marks)`}
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
                      {averageScore}%
                    </Typography>
                  </Box>
                  <LinearProgress 
                    variant="determinate" 
                    value={averageScore} 
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
                      {questionStats.attempted} / {questionStats.total}
                    </Typography>
                  </Box>
                  <LinearProgress 
                    variant="determinate" 
                    value={questionStats.total > 0 ? (questionStats.attempted / questionStats.total) * 100 : 0} 
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
                      {studyMetrics.totalHours} hours
                    </Typography>
                  </Box>
                  <LinearProgress 
                    variant="determinate" 
                    value={studyMetrics.totalPercentage} 
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
                      {studyMetrics.averageDaily} hours
                    </Typography>
                  </Box>
                  <LinearProgress 
                    variant="determinate" 
                    value={studyMetrics.dailyPercentage} 
                    sx={{ 
                      height: 8, 
                      borderRadius: 4,
                      backgroundColor: '#FF9800',
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

      {/* Performance Metrics Section */}
      <Box sx={{ mb: 4, mt: 4, p: 2, backgroundColor: 'background.paper', borderRadius: 2, boxShadow: 1 }}>
        <Typography variant="h6" gutterBottom>
          Test Performance Metrics
        </Typography>
        <Grid container spacing={4}>
          <Grid item xs={12} sm={6}>
            <Paper elevation={2} sx={{ p: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%' }}>
              <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                Average Score
              </Typography>
              <Box 
                sx={{ 
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  width: 80,
                  height: 80,
                  borderRadius: '50%',
                  bgcolor: averageScore >= 70 ? 'success.light' : averageScore >= 40 ? 'warning.light' : 'error.light',
                  color: 'white',
                  mb: 1
                }}
              >
                <Typography variant="h4">
                  {averageScore}%
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary">
                Based on {testHistory.length} {testHistory.length === 1 ? 'test' : 'tests'}
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Paper elevation={2} sx={{ p: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%' }}>
              <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                Pass Rate
              </Typography>
              <Box 
                sx={{ 
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  width: 80,
                  height: 80,
                  borderRadius: '50%',
                  bgcolor: passRate >= 70 ? 'success.light' : passRate >= 40 ? 'warning.light' : 'error.light',
                  color: 'white',
                  mb: 1
                }}
              >
                <Typography variant="h4">
                  {passRate}%
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary">
                Tests with score at least 70%
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Box>

      {/* Subject-wise Performance Section */}
      <Box sx={{ mb: 4, p: 2, backgroundColor: 'background.paper', borderRadius: 2, boxShadow: 1 }}>
        <Typography variant="h6" gutterBottom>
          Subject-wise Performance
        </Typography>
        
        {Object.keys(subjectPerformance).length === 0 ? (
          <Typography variant="body1" color="text.secondary" sx={{ textAlign: 'center', py: 2 }}>
            No test data available for subject analysis
          </Typography>
        ) : (
          <Grid container spacing={2}>
            {Object.keys(subjectPerformance).map(subject => (
              <Grid item xs={12} sm={6} md={4} key={subject}>
                <Paper elevation={1} sx={{ p: 2 }}>
                  <Typography variant="subtitle1" sx={{ mb: 1, textTransform: 'capitalize' }}>
                    {subject}
                  </Typography>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Typography variant="body2" color="text.secondary" sx={{ width: '50%' }}>
                      Average Score:
                    </Typography>
                    <Box sx={{ 
                      width: '50%',
                      display: 'flex',
                      alignItems: 'center'
                    }}>
                      <Box sx={{ 
                        width: 40, 
                        height: 40, 
                        borderRadius: '50%', 
                        bgcolor: getScoreColor(subjectPerformance[subject].averageScore),
                        color: 'white',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mr: 1
                      }}>
                        <Typography variant="subtitle2">
                          {subjectPerformance[subject].averageScore}%
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Typography variant="body2" color="text.secondary" sx={{ width: '50%' }}>
                      Pass Rate:
                    </Typography>
                    <Box sx={{ width: '50%' }}>
                      <Typography variant="body2">
                        {subjectPerformance[subject].passRate}% ({subjectPerformance[subject].count} tests)
                      </Typography>
                    </Box>
                  </Box>
                </Paper>
              </Grid>
            ))}
          </Grid>
        )}
      </Box>

      {/* Subject and Topic Analysis Section */}
      <Box sx={{ mb: 4, mt: 4, p: 2, backgroundColor: 'background.paper', borderRadius: 2, boxShadow: 1 }}>
        <Typography variant="h6" gutterBottom>
          Subject and Topic Analysis
        </Typography>
        
        {Object.keys(subjectTopicAnalysis).length === 0 ? (
          <Typography variant="body1" color="text.secondary" sx={{ textAlign: 'center', py: 2 }}>
            No test data available for subject and topic analysis
          </Typography>
        ) : (
          <>
            {/* Subject Selection Tabs */}
            <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
              <Tabs 
                value={selectedSubject} 
                onChange={(e, newValue) => setSelectedSubject(newValue)}
                variant="scrollable"
                scrollButtons="auto"
              >
                {Object.keys(subjectTopicAnalysis).map(subject => (
                  <Tab 
                    key={subject} 
                    label={subject} 
                    value={subject}
                    sx={{ 
                      fontWeight: selectedSubject === subject ? 'bold' : 'normal',
                      color: selectedSubject === subject ? 'primary.main' : 'text.primary'
                    }}
                  />
                ))}
              </Tabs>
            </Box>
            
            {selectedSubject && (
              <Box>
                {/* Subject Overview */}
                <Paper elevation={1} sx={{ p: 2, mb: 3 }}>
                  <Typography variant="h6" gutterBottom>
                    {selectedSubject} Overview
                  </Typography>
                  
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={4}>
                      <Box sx={{ textAlign: 'center', p: 2 }}>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                          Marks Overview
                        </Typography>
                        <Box 
                          sx={{ 
                            width: 80, 
                            height: 80, 
                            borderRadius: '50%', 
                            bgcolor: getScoreColor(subjectTopicAnalysis[selectedSubject].marksPercentage),
                            color: 'white',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            margin: '0 auto',
                            mb: 1
                          }}
                        >
                          <Typography variant="h5" fontWeight="bold">
                            {subjectTopicAnalysis[selectedSubject].marksPercentage}%
                          </Typography>
                        </Box>
                        <Typography variant="caption" color="text.secondary">
                          {subjectTopicAnalysis[selectedSubject].marksScored} / {subjectTopicAnalysis[selectedSubject].totalMarks} marks
                        </Typography>
                      </Box>
                    </Grid>
                    
                    <Grid item xs={12} sm={4}>
                      <Box sx={{ textAlign: 'center', p: 2 }}>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                          Overall Accuracy
                        </Typography>
                        <Box 
                          sx={{ 
                            width: 80, 
                            height: 80, 
                            borderRadius: '50%', 
                            bgcolor: getAccuracyColor(subjectTopicAnalysis[selectedSubject].accuracy),
                            color: 'white',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            margin: '0 auto',
                            mb: 1
                          }}
                        >
                          <Typography variant="h5" fontWeight="bold">
                            {subjectTopicAnalysis[selectedSubject].accuracy}%
                          </Typography>
                        </Box>
                        <Typography variant="caption" color="text.secondary">
                          {subjectTopicAnalysis[selectedSubject].correctAnswers} correct of {subjectTopicAnalysis[selectedSubject].totalQuestions} questions
                        </Typography>
                      </Box>
                    </Grid>
                    
                    <Grid item xs={12} sm={4}>
                      <Box sx={{ textAlign: 'center', p: 2 }}>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                          Pass Rate
                        </Typography>
                        <Box 
                          sx={{ 
                            width: 80, 
                            height: 80, 
                            borderRadius: '50%', 
                            bgcolor: getScoreColor(subjectTopicAnalysis[selectedSubject].passRate),
                            color: 'white',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            margin: '0 auto',
                            mb: 1
                          }}
                        >
                          <Typography variant="h5" fontWeight="bold">
                            {subjectTopicAnalysis[selectedSubject].passRate}%
                          </Typography>
                        </Box>
                        <Typography variant="caption" color="text.secondary">
                          {subjectTopicAnalysis[selectedSubject].passed} of {subjectTopicAnalysis[selectedSubject].validScoreCount} tests passed
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>
                </Paper>
                
                {/* Topic Performance Table */}
                <Paper elevation={1} sx={{ mb: 3 }}>
                  <TableContainer>
                    <Table size="small">
                      <TableHead sx={{ bgcolor: 'primary.light' }}>
                        <TableRow>
                          <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Topic</TableCell>
                          <TableCell sx={{ color: 'white', fontWeight: 'bold' }} align="center">Questions</TableCell>
                          <TableCell sx={{ color: 'white', fontWeight: 'bold' }} align="center">Marks Scored</TableCell>
                          <TableCell sx={{ color: 'white', fontWeight: 'bold' }} align="center">Total Marks</TableCell>
                          <TableCell sx={{ color: 'white', fontWeight: 'bold' }} align="center">Accuracy</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {Object.entries(subjectTopicAnalysis[selectedSubject].topics)
                          .sort(([, a], [, b]) => b.marksScored - a.marksScored)
                          .map(([topic, data]) => (
                            <TableRow 
                              key={topic}
                              sx={{ 
                                '&:nth-of-type(odd)': { bgcolor: 'action.hover' },
                                '&:hover': { bgcolor: 'action.selected' },
                              }}
                            >
                              <TableCell component="th" scope="row">
                                <Typography variant="body2">{topic}</Typography>
                                <Typography variant="caption" color="text.secondary">
                                  {data.testCount} {data.testCount === 1 ? 'test' : 'tests'}
                                </Typography>
                              </TableCell>
                              <TableCell align="center">
                                {data.correctAnswers}/{data.totalQuestions}
                              </TableCell>
                              <TableCell align="center" sx={{ fontWeight: 'bold' }}>
                                {data.marksScored}
                              </TableCell>
                              <TableCell align="center">
                                {data.totalMarks}
                              </TableCell>
                              <TableCell align="center">
                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                  <Box
                                    sx={{
                                      width: 45,
                                      height: 45,
                                      borderRadius: '50%',
                                      bgcolor: getAccuracyColor(data.marksPercentage),
                                      color: 'white',
                                      display: 'flex',
                                      alignItems: 'center',
                                      justifyContent: 'center',
                                    }}
                                  >
                                    <Typography variant="body2" fontWeight="bold">
                                      {data.marksPercentage}%
                                    </Typography>
                                  </Box>
                                </Box>
                              </TableCell>
                            </TableRow>
                          ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Paper>
                
                {/* Strengths and Weaknesses */}
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <Paper elevation={1} sx={{ p: 2 }}>
                      <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold', color: 'success.main' }}>
                        Strongest Topics
                      </Typography>
                      
                      {subjectTopicAnalysis[selectedSubject].strongestTopics.length > 0 ? (
                        <List dense>
                          {subjectTopicAnalysis[selectedSubject].strongestTopics.map((item, index) => (
                            <ListItem key={index} sx={{ py: 1 }}>
                              <ListItemText 
                                primary={item.topic} 
                                secondary={`${item.marksPercentage}% (${item.marksScored}/${item.totalMarks} marks)`}
                              />
                              <Box
                                sx={{
                                  width: 35,
                                  height: 35,
                                  borderRadius: '50%',
                                  bgcolor: getAccuracyColor(item.accuracy),
                                  color: 'white',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                }}
                              >
                                <Typography variant="body2" fontWeight="bold">
                                  {item.accuracy}%
                                </Typography>
                              </Box>
                            </ListItem>
                          ))}
                        </List>
                      ) : (
                        <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 2 }}>
                          Not enough data to determine strongest topics
                        </Typography>
                      )}
                    </Paper>
                  </Grid>
                  
                  <Grid item xs={12} md={6}>
                    <Paper elevation={1} sx={{ p: 2 }}>
                      <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold', color: 'error.main' }}>
                        Weakest Topics
                      </Typography>
                      
                      {subjectTopicAnalysis[selectedSubject].weakestTopics.length > 0 ? (
                        <List dense>
                          {subjectTopicAnalysis[selectedSubject].weakestTopics.map((item, index) => (
                            <ListItem key={index} sx={{ py: 1 }}>
                              <ListItemText 
                                primary={item.topic} 
                                secondary={`${item.marksPercentage}% (${item.marksScored}/${item.totalMarks} marks)`}
                              />
                              <Box
                                sx={{
                                  width: 35,
                                  height: 35,
                                  borderRadius: '50%',
                                  bgcolor: getAccuracyColor(item.accuracy),
                                  color: 'white',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                }}
                              >
                                <Typography variant="body2" fontWeight="bold">
                                  {item.accuracy}%
                                </Typography>
                              </Box>
                            </ListItem>
                          ))}
                        </List>
                      ) : (
                        <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 2 }}>
                          Not enough data to determine weakest topics
                        </Typography>
                      )}
                    </Paper>
                  </Grid>
                </Grid>
              </Box>
            )}
          </>
        )}
      </Box>

      {/* Detailed Topic Analysis for Physics - Physical World, Units, and Measurements */}
      {selectedSubject === 'Physics' && renderTopicDetails()}
    </motion.div>
  );
}

export default Analytics; 