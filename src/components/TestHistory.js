import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  Container,
  Card,
  CardHeader,
  CardContent,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Button,
  IconButton,
  Alert,
  CircularProgress,
  Tabs,
  Tab,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Grid,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  InputAdornment,
  Avatar
} from '@mui/material';
import {
  Info as InfoIcon,
  History as HistoryIcon,
  Timer as TimerIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Search as SearchIcon,
  ExpandMore as ExpandMoreIcon,
  RemoveRedEye as RemoveRedEyeIcon,
  Replay as ReplayIcon,
  Assignment as AssignmentIcon,
  Help as HelpIcon,
  TrendingUp as TrendingUpIcon,
  FilterList as FilterListIcon,
  Today as TodayIcon,
  ArrowDownward as ArrowDownwardIcon,
  ArrowUpward as ArrowUpwardIcon,
  Refresh as RefreshIcon,
  AccessTime as AccessTimeIcon,
  Visibility as VisibilityIcon
} from '@mui/icons-material';
import axiosInstance from './axios-config';
import { format } from 'date-fns';
import { useMemo } from 'react';
import { subscribeToTestHistory, syncTestHistoryWithFirebase, getCurrentUserId } from '../services/firebase';

// Add a global test history cache to optimize fetching
const TEST_HISTORY_CACHE = {
  data: null,
  timestamp: null,
  TTL: 5 * 60 * 1000, // 5 minutes in milliseconds
  isValid() {
    if (!this.data || !this.timestamp) return false;
    return (Date.now() - this.timestamp) < this.TTL;
  },
  set(data) {
    this.data = data;
    this.timestamp = Date.now();
  },
  invalidate() {
    this.data = null;
    this.timestamp = null;
  }
};

// Make the cache available globally
window.TEST_HISTORY_CACHE = TEST_HISTORY_CACHE;

function TestHistory() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [testHistory, setTestHistory] = useState([]);
  const [filteredHistory, setFilteredHistory] = useState([]);
  const [activeTab, setActiveTab] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [subjectFilter, setSubjectFilter] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [sortDirection, setSortDirection] = useState('desc');
  const [dateRangeFilter, setDateRangeFilter] = useState('all');
  const [uniqueSubjects, setUniqueSubjects] = useState([]);
  const [isCachedData, setIsCachedData] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState(null);
  const [realTimeEnabled, setRealTimeEnabled] = useState(true);
  const [currentStudentInfo, setCurrentStudentInfo] = useState(null);
  const [profileLoaded, setProfileLoaded] = useState(false);

  // Create a ref to store the unsubscribe function
  const unsubscribeRef = useRef(null);

  // Add direct student fetch function
  const fetchCurrentStudentDirectly = async () => {
    try {
      console.log('Directly fetching current student information');
      setProfileLoaded(false); // Reset profile loaded state
      
      // Fetch profile from the new endpoint
      const response = await axiosInstance.get('/student/profile');
      
      if (response.data) {
        console.log('Successfully fetched student profile:', response.data);
        
        // Use complete data from response
        const studentInfo = {
          name: response.data.name || 'Student',
          studentId: response.data.studentId || response.data._id || 'N/A',
          username: response.data.username || '',
          _id: response.data._id || '',
          grade: response.data.grade,
          school: response.data.school,
          email: response.data.email,
          phone: response.data.phone,
        };
        
        setCurrentStudentInfo(studentInfo);
        setProfileLoaded(true);
        
        // Store in localStorage as a fallback
        localStorage.setItem('currentStudentInfo', JSON.stringify({
          ...studentInfo,
          timestamp: Date.now()
        }));
        
        return response.data;
      }
    } catch (error) {
      console.error('Error fetching student profile:', error);
      
      // Try to get from token as fallback
      try {
        const token = localStorage.getItem('token');
        if (token) {
          const tokenData = JSON.parse(atob(token.split('.')[1]));
          const studentInfo = {
            name: tokenData.username || 'Student',
            studentId: tokenData.userId || 'N/A',
            username: tokenData.username || '',
            _id: tokenData.userId || ''
          };
          
          console.log('Using token data for student info:', studentInfo);
          setCurrentStudentInfo(studentInfo);
          setProfileLoaded(true);
          
          // Store in localStorage
          localStorage.setItem('currentStudentInfo', JSON.stringify({
            ...studentInfo,
            timestamp: Date.now()
          }));
          
          return studentInfo;
        }
      } catch (err) {
        console.error('Error using token data:', err);
      }
    }
    
    setProfileLoaded(true); // Mark as loaded even if failed
    return null;
  };

  useEffect(() => {
    // Fetch student info first to ensure we have it
    fetchCurrentStudentDirectly()
      .then(() => {
        // Then fetch test history
    fetchTestHistory();
      })
      .catch(err => {
        console.error('Error in initial data loading:', err);
        // Still try to fetch test history even if student info fails
        fetchTestHistory();
      });

    // Set up real-time listener
    if (realTimeEnabled) {
      subscribeToFirebase();
    }

    // Cleanup on unmount
    return () => {
      if (unsubscribeRef.current) {
        console.log('Unsubscribing from Firebase');
        unsubscribeRef.current();
      }
    };
  }, [realTimeEnabled]);

  useEffect(() => {
    if (profileLoaded && currentStudentInfo) {
      console.log('Profile loaded, fetching test history with student info:', currentStudentInfo);
      // Update test history to use current student info
      const updatedHistory = testHistory.map(test => ({
        ...test,
        studentName: currentStudentInfo.name || test.studentName,
        studentId: currentStudentInfo.studentId || test.studentId
      }));
      
      setTestHistory(updatedHistory);
      
      // Also apply filters and sorting with updated data
      applyFiltersAndSorting();
    }
  }, [profileLoaded, currentStudentInfo]);

  useEffect(() => {
    // Apply filters and sorting whenever the raw data or filter settings change
    applyFiltersAndSorting();
  }, [testHistory, activeTab, searchQuery, subjectFilter, sortBy, sortDirection, dateRangeFilter]);

  // Function to subscribe to Firebase real-time updates
  const subscribeToFirebase = () => {
    const userId = getCurrentUserId();
    if (!userId) {
      console.error('Cannot subscribe to Firebase: No user ID found');
      return;
    }

    // Unsubscribe from previous listener if exists
    if (unsubscribeRef.current) {
      unsubscribeRef.current();
    }

    // Subscribe to test history updates
    console.log('Setting up Firebase real-time listener');
    unsubscribeRef.current = subscribeToTestHistory(userId, (updatedTests) => {
      console.log('Received real-time update from Firebase:', updatedTests.length, 'tests');
      
      if (updatedTests.length > 0) {
        // Process the incoming data
        const processedHistory = processHistoryData(updatedTests);
        
        // Don't limit the history, show all tests
        // const limitedHistory = processedHistory.slice(0, 3);
        
        // Update state with all history
        setTestHistory(processedHistory);
        
        // Extract unique subjects
        const subjects = [...new Set(processedHistory.map(test => test.subject))];
        setUniqueSubjects(subjects);
        
        // Mark as not cached since it's real-time data
        setIsCachedData(false);
        
        // Update last sync time
        setLastSyncTime(new Date());
      }
    });
  };

  // Add a refresh function to force reload fresh data and sync with Firebase
  const refreshTestHistory = async () => {
    setIsSyncing(true);
    
    try {
      // Invalidate the cache
      TEST_HISTORY_CACHE.invalidate();
      setIsCachedData(false);
      
      // Re-fetch with fresh data from the backend
      const freshData = await fetchTestHistoryFromBackend(true);
      
      // Sync the fresh data with Firebase
      if (freshData && freshData.length > 0) {
        await syncTestHistoryWithFirebase(freshData);
      }
      
      // Update last sync time
      setLastSyncTime(new Date());
    } catch (error) {
      console.error('Error refreshing and syncing test history:', error);
      setError('Failed to refresh test history. Please try again.');
    } finally {
      setIsSyncing(false);
    }
  };

  // Function to fetch data from backend
  const fetchTestHistoryFromBackend = async (forceRefresh = false) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No authentication token found in localStorage');
        setError('Authentication token not found. Please log in again.');
        return [];
      }

      // Parse and log user information from token for debugging
      try {
        const tokenData = JSON.parse(atob(token.split('.')[1]));
        console.log('TOKEN DEBUG INFO:', {
          userId: tokenData.userId,
          username: tokenData.username,
          role: tokenData.role,
          allFields: Object.keys(tokenData)
        });
      } catch (err) {
        console.error('Error parsing token for debugging:', err);
      }

      // Always fetch fresh data if forceRefresh is true
      if (forceRefresh) {
        TEST_HISTORY_CACHE.invalidate();
      }

      // Check cache first if not forcing refresh
      if (!forceRefresh && TEST_HISTORY_CACHE.isValid()) {
        console.log('Using cached test history data');
        const cachedData = TEST_HISTORY_CACHE.data;
        
        // Use all cached data instead of limiting to just 10
        setTestHistory(cachedData);
        setIsCachedData(true);
        
        // Extract unique subjects
        const subjects = [...new Set(cachedData.map(test => test.subject))];
        setUniqueSubjects(subjects);
        
        setLoading(false);
        return cachedData;
      }

      console.log('Fetching fresh test history data from backend...');
      
      // Get student ID from token
      const tokenData = JSON.parse(atob(token.split('.')[1]));
      const currentUserId = tokenData.userId;
      const studentName = tokenData.username || 'Student';
      
      console.log('Current user ID from token:', currentUserId);
      console.log('Current username from token:', studentName);
      
      // Try with alternative endpoints if needed
      let response;
      try {
        response = await axiosInstance.get('/student/all-test-history', {
          params: {
            studentId: currentUserId,
            batchSize: 100, // Increase to get more history (up from 50)
            includeDetails: true
          }
        });
        console.log('Response from primary endpoint:', response.data);
      } catch (initialError) {
        console.error('Error with primary endpoint:', initialError);
        console.log('Trying alternative endpoint...');
        
        // Try alternative endpoint if the first fails
        response = await axiosInstance.get('/student/test-history', {
          params: { 
            studentId: currentUserId,
            includeAll: true 
          }
        });
      }
      
      let historyData = [];
        
        // Ensure test history is an array
        if (Array.isArray(response.data) && response.data.length > 0) {
        console.log(`Received ${response.data.length} tests from backend`);
        // Log the first test record in detail to debug structure
        if (response.data[0]) {
          console.log('FIRST TEST RECORD STRUCTURE:', {
            id: response.data[0]._id,
            studentId: response.data[0].studentId,
            studentInfo: response.data[0].studentInfo,
            studentIdType: typeof response.data[0].studentId,
            fields: Object.keys(response.data[0])
          });
        }
        historyData = response.data;
        } else if (response.data && typeof response.data === 'object') {
          console.log('Test history is not an array, converting to array format');
          // If it's an object with test data, convert to array
        if (response.data._id) {
          historyData = [response.data];
        } else if (Object.keys(response.data).length > 0) {
          // It might be an object with multiple tests
          historyData = Object.values(response.data);
        }
      }
      
      // If history data is empty, return empty array
      if (historyData.length === 0) {
        console.log('No test history data returned from backend');
        setTestHistory([]);
        setLoading(false);
        return [];
      }
      
      // Process and format the history data for consistency
      const processedHistory = processHistoryData(historyData);
      
      // Use all processed data instead of limiting to just 10
      setTestHistory(processedHistory);
      
      // Update the cache with all processed data
      TEST_HISTORY_CACHE.set(processedHistory);
      setIsCachedData(false);
      
      // Extract unique subjects
      const subjects = [...new Set(processedHistory.map(test => test.subject))];
      setUniqueSubjects(subjects);
      
      console.log(`Showing ${processedHistory.length} test history records`);
      setLoading(false);
      return processedHistory;
    } catch (error) {
      console.error('Error fetching test history from backend:', error);
      setError('Failed to load test history. Please try refreshing the page.');
      setLoading(false);
      
      // Return empty array to avoid null reference errors
      return [];
    }
  };

  const fetchTestHistory = async () => {
    try {
      setLoading(true);
      console.log('Fetching test history...');
      
      // Get data from backend
      const backendData = await fetchTestHistoryFromBackend();
      
      if (backendData) {
        console.log(`Loaded ${backendData.length} tests from backend`);
      
        // Extract unique subjects
        const subjects = [...new Set(backendData.map(test => test.subject))];
        setUniqueSubjects(subjects);
        
        // Update last sync time
        setLastSyncTime(new Date());
          } else {
        console.error('No data returned from backend');
        setError('Failed to fetch test history from server. Please try again.');
      }
    } catch (error) {
      console.error('Error fetching test history:', error);
      setError('Failed to load test history. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Toggle real-time updates
  const toggleRealTimeUpdates = () => {
    const newValue = !realTimeEnabled;
    setRealTimeEnabled(newValue);
    
    if (newValue) {
      // Re-subscribe to Firebase
      subscribeToFirebase();
    } else {
      // Unsubscribe from Firebase
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
        unsubscribeRef.current = null;
      }
    }
  };

  // JSX for Real-time indicator badge
  const RealTimeIndicator = () => (
    <Chip
      label={realTimeEnabled ? "Real-time ON" : "Real-time OFF"}
      color={realTimeEnabled ? "success" : "default"}
      size="small"
      onClick={toggleRealTimeUpdates}
      sx={{ ml: 2 }}
    />
  );

  // Process and standardize history data format
  const processHistoryData = (historyData) => {
    if (!Array.isArray(historyData)) {
      console.error('Expected an array for historyData, got:', typeof historyData);
      return [];
    }
    
    // Get the cached student info from state or localStorage
    const cachedStudentInfo = currentStudentInfo || (() => {
      try {
        const cached = localStorage.getItem('currentStudentInfo');
        if (cached) {
          const parsed = JSON.parse(cached);
          // Check if cache is fresh (less than 30 minutes old)
          if (Date.now() - parsed.timestamp < 30 * 60 * 1000) {
            console.log('Using cached student info from localStorage:', parsed);
            return parsed;
          }
        }
      } catch (err) {
        console.error('Error parsing cached student info:', err);
      }
      return null;
    })();
    
    console.log('Processing history data with cached student info:', cachedStudentInfo);
    
    return historyData.map(test => {
      // If we have current student info and this test belongs to current user, use our info directly
      const token = localStorage.getItem('token');
      let tokenData = null;
      if (token) {
        try {
          tokenData = JSON.parse(atob(token.split('.')[1]));
        } catch (e) {
          console.error('Error parsing token:', e);
        }
      }
      
      // Determine if this test belongs to the current user
      const isCurrentUserTest = tokenData && (
        (test.studentId === tokenData.userId) || 
        (typeof test.studentId === 'object' && test.studentId?._id === tokenData.userId) ||
        (test.studentInfo && test.studentInfo.studentId === tokenData.userId)
      );
      
      let studentName = 'Unknown';
      let studentId = 'N/A';
      let studentInfoSource = 'none';
      
      // First priority: If this is the current user's test, use our profile data
      if (isCurrentUserTest && cachedStudentInfo) {
        studentName = cachedStudentInfo.name;
        studentId = cachedStudentInfo.studentId;
        studentInfoSource = 'current_user_profile';
        console.log(`Using current user profile for test ${test._id}`);
      }
      // Second priority: Use test's studentInfo object if available
      else if (test.studentInfo) {
        studentName = test.studentInfo.name || 'Unknown';
        studentId = test.studentInfo.studentId || 'N/A';
        studentInfoSource = 'studentInfo';
        console.log(`Using studentInfo object: ${studentName} (${studentId})`);
      }
      // Third priority: Use test's studentId as object
      else if (test.studentId && typeof test.studentId === 'object') {
        studentName = test.studentId.name || 'Unknown';
        studentId = test.studentId.studentId || test.studentId._id || 'N/A';
        studentInfoSource = 'studentId_object';
        console.log(`Using studentId object: ${studentName} (${studentId})`);
      }
      // Fourth priority: Try matching studentId string with cached info or token
      else if (test.studentId && typeof test.studentId === 'string') {
        studentId = test.studentId;
        studentInfoSource = 'studentId_string';
        
        if (cachedStudentInfo && (cachedStudentInfo._id === studentId || cachedStudentInfo.studentId === studentId)) {
          studentName = cachedStudentInfo.name;
          studentInfoSource = 'studentId_string_with_cache_match';
          console.log(`Matched studentId with cached info: ${studentName} (${studentId})`);
        } 
        else if (tokenData && tokenData.userId === studentId) {
          studentName = tokenData.username || 'Unknown';
          studentInfoSource = 'studentId_string_with_token_match';
          console.log(`Matched studentId with token: ${studentName} (${studentId})`);
        }
        else {
          console.log(`No match for studentId string: ${studentId}`);
          // Use default values already set
        }
      }
      
      // Improve score calculation in processHistoryData function
      let score = 0;
      if (typeof test.score === 'number' && test.score > 0) {
        score = test.score;
      } else if (test.questions && test.questions.length > 0) {
        const correctCount = test.questions.filter(q => q && q.isCorrect).length;
        const totalQuestions = test.questions.length;
        console.log(`Calculating score from questions: ${correctCount}/${totalQuestions}`);
        if (totalQuestions > 0) {
          score = Math.round((correctCount / totalQuestions) * 100);
        }
      } else if (test.performanceMetrics?.correctAnswers && test.performanceMetrics?.totalQuestions) {
        const correctCount = test.performanceMetrics.correctAnswers;
        const totalQuestions = test.performanceMetrics.totalQuestions;
        console.log(`Calculating score from metrics: ${correctCount}/${totalQuestions}`);
        if (totalQuestions > 0) {
          score = Math.round((correctCount / totalQuestions) * 100);
        }
      } else if (test.originalData && typeof test.originalData.score === 'number') {
        score = test.originalData.score;
        console.log(`Using original data score: ${score}`);
      }
      
      // Log the calculated score for debugging
      console.log(`Final calculated score for test ${test._id}: ${score}%`);
      
      // Log the final processed data for this test
      console.log('FINAL PROCESSED TEST:', {
        id: test._id || test.testId || test.firebaseKey || `temp-${Date.now()}-${Math.random()}`,
        studentName,
        studentId,
        studentInfoSource,
        subject: test.subject || 'Unknown'
      });
      
      // Ensure all required fields exist
      return {
        _id: test._id || test.testId || test.firebaseKey || `temp-${Date.now()}-${Math.random()}`,
        subject: test.subject || 'Unknown',
        score: score,
        date: test.date || test.endTime || test.startTime || new Date().toISOString(),
        totalTime: test.totalTime || 0,
        questionCount: Array.isArray(test.questions) ? test.questions.length : 0,
        correctCount: Array.isArray(test.questions) 
          ? test.questions.filter(q => q && q.isCorrect).length 
          : (test.performanceMetrics?.correctAnswers || 0),
        topicNumber: test.topicNumber || '',
        mode: test.mode || test.testMode || 'practice',
        stage: test.stage || '',
        level: test.level || '',
        // Add student information
        studentName,
        studentId,
        studentInfoSource,
        // Additional metrics if available
        performanceMetrics: test.performanceMetrics || {},
        // Keep the original data for detailed view
        originalData: test
      };
    });
  };

  // Remove the getMockTestData function as we don't want to use it anymore
  // Instead, we'll replace it with a function that returns an empty array
  const getMockTestData = () => {
    console.log('Mock data function called but disabled');
    return [];
  };

  const applyFiltersAndSorting = () => {
    // Start with the full dataset
    let filtered = [...testHistory];
    
    // Apply tab filter
    if (activeTab === 1) {
      filtered = filtered.filter(test => test.passedLevel);
    } else if (activeTab === 2) {
      filtered = filtered.filter(test => !test.passedLevel);
    }
    
    // Apply subject filter
    if (subjectFilter !== 'all') {
      filtered = filtered.filter(test => test.subject === subjectFilter);
    }
    
    // Apply search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(test => 
        test.subject.toLowerCase().includes(query) ||
        (test.topicNumber && test.topicNumber.toString().includes(query)) ||
        (test.mode && test.mode.toLowerCase().includes(query))
      );
    }
    
    // Apply date range filter
    if (dateRangeFilter !== 'all') {
      const now = new Date();
      let startDate;
      
      switch (dateRangeFilter) {
        case 'today':
          startDate = new Date(now.setHours(0, 0, 0, 0));
          break;
        case 'week':
          startDate = new Date(now.setDate(now.getDate() - 7));
          break;
        case 'month':
          startDate = new Date(now.setMonth(now.getMonth() - 1));
          break;
        case 'year':
          startDate = new Date(now.setFullYear(now.getFullYear() - 1));
          break;
        default:
          startDate = null;
      }
      
      if (startDate) {
        filtered = filtered.filter(test => new Date(test.date) >= startDate);
      }
    }
    
    // Apply sorting
    filtered.sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'date':
          comparison = new Date(a.date) - new Date(b.date);
          break;
        case 'score':
          comparison = a.score - b.score;
          break;
        case 'subject':
          comparison = a.subject.localeCompare(b.subject);
          break;
        case 'time':
          comparison = (a.totalTime || 0) - (b.totalTime || 0);
          break;
        default:
          comparison = new Date(a.date) - new Date(b.date);
      }
      
      return sortDirection === 'asc' ? comparison : -comparison;
    });
    
    setFilteredHistory(filtered);
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleViewTestDetails = (testId) => {
    if (!testId) {
      console.error('Test ID is undefined');
      return;
    }
    
    // Navigate to test details page
    navigate(`/student-dashboard/test-details/${testId}`);
  };

  // Add the missing handleRetakeTest function
  const handleRetakeTest = (test) => {
    console.log('Retaking test:', test);
    // Navigate to the test page with the same topic/subject
    navigate('/test', {
      state: {
        subject: test.subject,
        mode: 'practice',
        topicNumber: test.topicNumber,
        retake: true,
        previousTestId: test._id
      }
    });
  };

  // Function to toggle sort direction or change sort field
  const handleSortChange = (field) => {
    if (sortBy === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortDirection('desc'); // Default to descending when changing fields
    }
  };

  // Helper to capitalize the first letter of a string
  const capitalize = (string) => {
    if (!string) return '';
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
  };

  const formatTime = (minutes) => {
    if (!minutes && minutes !== 0) return "00:00";
    const mins = Math.floor(minutes);
    const secs = Math.round((minutes - mins) * 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Unknown';
    try {
      // First try using date-fns
      return format(new Date(dateString), 'MMM dd, yyyy h:mm a');
    } catch (e) {
      // Fallback to native JavaScript date formatting if date-fns fails
    try {
      const options = { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric', 
        hour: '2-digit', 
        minute: '2-digit'
      };
      return new Date(dateString).toLocaleDateString(undefined, options);
      } catch (fallbackError) {
        console.error('Error formatting date:', fallbackError);
        return 'Invalid date';
      }
    }
  };

  // Add this function to the TestHistory component to display enhanced metrics
  const renderEnhancedMetrics = (test) => {
    // Only show enhanced metrics if they exist
    if (!test.performanceMetrics && !test.deviceInfo && !test.timingDetails) {
      return null;
    }
    
    return (
      <Box sx={{ mt: 2 }}>
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="subtitle2">Detailed Analytics</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Grid container spacing={2}>
              {test.performanceMetrics && (
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" gutterBottom>Performance</Typography>
                  <Box sx={{ pl: 2 }}>
                    <Typography variant="body2">
                      Correct answers: {test.performanceMetrics.correctAnswers || 0}
                    </Typography>
                    <Typography variant="body2">
                      Incorrect answers: {test.performanceMetrics.incorrectAnswers || 0}
                    </Typography>
                    <Typography variant="body2">
                      Unanswered: {test.performanceMetrics.unanswered || 0}
                    </Typography>
                    <Typography variant="body2">
                      Avg. time per question: {formatTime((test.performanceMetrics.averageTimePerQuestion || 0) * 60)}
                    </Typography>
                  </Box>
                </Grid>
              )}
              
              {test.deviceInfo && (
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" gutterBottom>Device Info</Typography>
                  <Box sx={{ pl: 2 }}>
                    <Typography variant="body2">
                      Browser: {test.deviceInfo.browser || 'Unknown'}
                    </Typography>
                    <Typography variant="body2">
                      Platform: {test.deviceInfo.platform || 'Unknown'}
                    </Typography>
                    <Typography variant="body2">
                      Screen: {test.deviceInfo.screenSize || 'Unknown'}
                    </Typography>
                  </Box>
                </Grid>
              )}
              
              {test.timingDetails && (
                <Grid item xs={12}>
                  <Typography variant="subtitle2" gutterBottom>Timing</Typography>
                  <Box sx={{ pl: 2 }}>
                    <Typography variant="body2">
                      Started: {test.timingDetails.startTime ? new Date(test.timingDetails.startTime).toLocaleString() : 'Unknown'}
                    </Typography>
                    <Typography variant="body2">
                      Completed: {test.timingDetails.endTime ? new Date(test.timingDetails.endTime).toLocaleString() : 'Unknown'}
                    </Typography>
                    <Typography variant="body2">
                      Pause duration: {formatTime(test.timingDetails.pauseDuration || 0)}
                    </Typography>
                  </Box>
                </Grid>
              )}
              
              {test.improvement && (
                <Grid item xs={12}>
                  <Typography variant="subtitle2" gutterBottom>Improvement</Typography>
                  <Box sx={{ pl: 2 }}>
                    <Typography variant="body2">
                      Previous best: {test.improvement.previousBestScore || 0}%
                    </Typography>
                    <Typography variant="body2" color={test.improvement.scoreImprovement > 0 ? 'success.main' : 'error.main'}>
                      Score change: {test.improvement.scoreImprovement > 0 ? '+' : ''}{test.improvement.scoreImprovement || 0}%
                    </Typography>
                    <Typography variant="body2" color={test.improvement.timeImprovement > 0 ? 'success.main' : 'error.main'}>
                      Time change: {test.improvement.timeImprovement > 0 ? '-' : '+'}{Math.abs(test.improvement.timeImprovement || 0).toFixed(1)} min
                    </Typography>
                  </Box>
                </Grid>
              )}
              
              {test.performanceMetrics?.topicWisePerformance && (
                <Grid item xs={12}>
                  <Typography variant="subtitle2" gutterBottom>Topic Performance</Typography>
                  <TableContainer component={Paper} variant="outlined" sx={{ mb: 2 }}>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell>Topic</TableCell>
                          <TableCell align="right">Questions</TableCell>
                          <TableCell align="right">Correct</TableCell>
                          <TableCell align="right">Score</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {Object.entries(test.performanceMetrics?.topicWisePerformance || {}).map(([topic, data]) => (
                          <TableRow key={topic}>
                            <TableCell>{topic}</TableCell>
                            <TableCell align="right">{data.total}</TableCell>
                            <TableCell align="right">{data.correct}</TableCell>
                            <TableCell align="right">{data.score}%</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Grid>
              )}
            </Grid>
          </AccordionDetails>
        </Accordion>
      </Box>
    );
  };

  // Improved function to render test card with better student information display
  const renderTestCard = (test) => {
    console.log('Rendering test card with data:', test);
    
    // Properly handle dates
    let testDate = null;
    try {
      testDate = new Date(test.date);
      // Check if date is valid
      if (isNaN(testDate.getTime())) {
        console.warn('Invalid date detected in test record, using fallback:', test.date);
        testDate = new Date(); // Use current date as fallback
      }
    } catch (e) {
      console.error('Error parsing date:', e, test.date);
      testDate = new Date(); // Use current date as fallback
    }
    
    const formattedDate = testDate.toLocaleDateString();
    const formattedTime = testDate.toLocaleTimeString();
    
    // Get subject info with proper capitalization
    const subject = test.subject ? test.subject.charAt(0).toUpperCase() + test.subject.slice(1) : 'Unknown Subject';
    
    // Ensure question count and score have default values
    const totalQuestions = test.questionCount || 0;
    const score = typeof test.score === 'number' ? test.score : 0;
    
    // Log values for debugging
    console.log(`Test ${test._id} card details:`, {
      subject,
      date: formattedDate,
      time: formattedTime,
      questions: totalQuestions,
      score: score
    });
    
    return (
      <Card
        key={test._id}
        sx={{
          mb: 2,
          transition: 'transform 0.2s',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: 4,
          },
          borderLeft: `6px solid ${
            score >= 70 ? '#4caf50' : 
            score >= 40 ? '#ff9800' : 
            '#f44336'
          }`,
        }}
      >
        <CardContent>
          {/* Student information section with highlight */}
          <Box 
                  sx={{ 
              bgcolor: 'background.paper', 
              p: 1, 
              mb: 2, 
              borderRadius: 1,
              border: '1px solid',
              borderColor: 'divider'
            }}
          >
            <Typography variant="subtitle2" color="text.secondary">
              Student Information
                  </Typography>
            <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
              {test.studentName || 'Unknown'} 
              {test.studentId && <span> (ID: {test.studentId})</span>}
                  </Typography>
          </Box>

          <Grid container spacing={2}>
            <Grid item xs={12} sm={8}>
              <Typography variant="h6" component="div">
                {subject}
              </Typography>
              <Typography color="text.secondary" gutterBottom>
                {formattedDate} at {formattedTime}
              </Typography>
              <Box sx={{ mt: 1, display: 'flex', alignItems: 'center' }}>
                <AssignmentIcon sx={{ mr: 1, color: 'primary.main' }} />
                <Typography variant="body2">
                  {totalQuestions} questions
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={4} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', justifyContent: 'center' }}>
              <Box 
                sx={{ 
              display: 'flex', 
              alignItems: 'center',
                  justifyContent: 'center',
                  width: 80,
                  height: 80,
                  borderRadius: '50%',
                  bgcolor: score >= 70 ? 'success.light' : score >= 40 ? 'warning.light' : 'error.light',
                  color: 'white',
                  mb: 1
                }}
              >
                <Typography variant="h4">
                  {score}%
                </Typography>
              </Box>
              <Button
                variant="outlined"
                size="small"
                onClick={() => handleViewTestDetails(test._id)}
                startIcon={<VisibilityIcon />}
              >
                View Details
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    );
  };

  // Add a StudentInfoCard component to display at the top of the page
  const StudentInfoCard = () => {
    if (!currentStudentInfo) return null;
    
    return (
      <Card sx={{ mb: 4, bgcolor: 'primary.main', color: 'white' }}>
        <CardContent>
          <Grid container alignItems="center" spacing={2}>
            <Grid item>
              <Avatar 
                sx={{ 
                  width: 60, 
                  height: 60,
                  bgcolor: 'white',
                  color: 'primary.main',
                  fontWeight: 'bold',
                  fontSize: '1.5rem'
                }}
              >
                {currentStudentInfo.name.charAt(0).toUpperCase()}
              </Avatar>
            </Grid>
            <Grid item xs>
              <Typography variant="h5" component="div" sx={{ fontWeight: 'bold' }}>
                {currentStudentInfo.name}
              </Typography>
              <Typography variant="body1">
                ID: {currentStudentInfo.studentId}
              </Typography>
              <Typography variant="body2">
                {currentStudentInfo.username}
              </Typography>
            </Grid>
            <Grid item>
              <Typography variant="h6">
                Test History
              </Typography>
              <Typography variant="body1">
                {testHistory.length} tests taken
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    );
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <StudentInfoCard />
      
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <HistoryIcon color="primary" sx={{ fontSize: 32, mr: 2 }} />
        <Typography variant="h4" fontWeight="bold">
          Test History
        </Typography>
          <RealTimeIndicator />
        </Box>
        
        <Box>
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={refreshTestHistory}
            disabled={loading || isSyncing}
            sx={{ mr: 1 }}
          >
            {isSyncing ? 'Syncing...' : 'Sync Now'}
          </Button>
        </Box>
      </Box>

      {lastSyncTime && (
        <Typography variant="caption" color="text.secondary" sx={{ mb: 2, display: 'block' }}>
          Last synced: {format(lastSyncTime, 'MMM dd, yyyy h:mm a')}
        </Typography>
      )}
      
      {isCachedData && (
        <Alert 
          severity="info" 
          sx={{ mb: 3 }}
          action={
            <Button color="inherit" size="small" onClick={refreshTestHistory}>
              Refresh
            </Button>
          }
        >
          You're viewing cached test history data. Click refresh to load the latest data.
        </Alert>
      )}

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {filteredHistory.length === 0 && !loading ? (
        <Card sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No test history found
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            You haven't taken any tests yet. Complete a test to see your results here.
          </Typography>
          <Button 
            variant="contained" 
            color="primary"
            onClick={() => navigate('/student-dashboard')}
            sx={{ mt: 2 }}
          >
            Go to Dashboard
          </Button>
        </Card>
      ) : (
        <>
          <Card sx={{ mb: 4 }}>
            <CardHeader 
              title="Your Test Performance Overview" 
              titleTypographyProps={{ fontWeight: 'bold' }}
              sx={{ bgcolor: '#f5f5f5' }}
            />
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap' }}>
                <Box sx={{ 
                  minWidth: 200, 
                  textAlign: 'center', 
                  p: 2, 
                  border: '1px solid', 
                  borderColor: 'divider',
                  borderRadius: 2,
                  bgcolor: '#f9f9f9',
                  mb: 2
                }}>
                  <Typography variant="h6" color="text.secondary" gutterBottom>
                    Total Tests
                  </Typography>
                  <Typography variant="h3" fontWeight="bold" color="primary.main">
                    {filteredHistory.length}
                  </Typography>
                </Box>
                
                <Box sx={{ 
                  minWidth: 200, 
                  textAlign: 'center', 
                  p: 2, 
                  border: '1px solid', 
                  borderColor: 'divider',
                  borderRadius: 2,
                  bgcolor: '#f9f9f9',
                  mb: 2
                }}>
                  <Typography variant="h6" color="text.secondary" gutterBottom>
                    Pass Rate
                  </Typography>
                  <Typography variant="h3" fontWeight="bold" color="success.main">
                    {filteredHistory.length > 0 
                      ? Math.round((filteredHistory.filter(test => {
                          // Consider it passed if score is at least 70%
                          return typeof test.score === 'number' && !isNaN(test.score) && test.score >= 70;
                        }).length / filteredHistory.filter(test => 
                          typeof test.score === 'number' && !isNaN(test.score)
                        ).length) * 100) || 0
                      : 0}%
                  </Typography>
                </Box>
                
                <Box sx={{ 
                  minWidth: 200, 
                  textAlign: 'center', 
                  p: 2, 
                  border: '1px solid', 
                  borderColor: 'divider',
                  borderRadius: 2,
                  bgcolor: '#f9f9f9',
                  mb: 2
                }}>
                  <Typography variant="h6" color="text.secondary" gutterBottom>
                    Average Score
                  </Typography>
                  <Typography variant="h3" fontWeight="bold" color="info.main">
                    {filteredHistory.length > 0
                      ? (() => {
                          const validScores = filteredHistory.filter(test => 
                            typeof test.score === 'number' && !isNaN(test.score)
                          );
                          return validScores.length > 0 
                            ? Math.round(validScores.reduce((acc, test) => acc + test.score, 0) / validScores.length) 
                            : 0;
                        })()
                      : 0}%
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>

          {/* Filters and Search */}
          <Paper sx={{ mb: 4, p: 2 }}>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  placeholder="Search tests..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={2}>
                <FormControl fullWidth>
                  <InputLabel>Subject</InputLabel>
                  <Select
                    value={subjectFilter}
                    onChange={(e) => setSubjectFilter(e.target.value)}
                    label="Subject"
                  >
                    <MenuItem value="all">All Subjects</MenuItem>
                    {uniqueSubjects.map(subject => (
                      <MenuItem key={subject} value={subject}>{subject}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={6} sm={2}>
                <FormControl fullWidth>
                  <InputLabel>Sort By</InputLabel>
                  <Select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    label="Sort By"
                  >
                    <MenuItem value="date">Date</MenuItem>
                    <MenuItem value="score">Score</MenuItem>
                    <MenuItem value="subject">Subject</MenuItem>
                    <MenuItem value="time">Duration</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={6} sm={2}>
                <IconButton 
                  onClick={() => setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')}
                  color="primary"
                  sx={{ border: '1px solid', borderColor: 'divider', p: 1, width: '100%' }}
                >
                  {sortDirection === 'asc' ? <ArrowUpwardIcon /> : <ArrowDownwardIcon />}
                </IconButton>
              </Grid>
              <Grid item xs={12} sm={2}>
                <FormControl fullWidth>
                  <InputLabel>Time Range</InputLabel>
                  <Select
                    value={dateRangeFilter}
                    onChange={(e) => setDateRangeFilter(e.target.value)}
                    label="Time Range"
                  >
                    <MenuItem value="all">All Time</MenuItem>
                    <MenuItem value="today">Today</MenuItem>
                    <MenuItem value="week">Last Week</MenuItem>
                    <MenuItem value="month">Last Month</MenuItem>
                    <MenuItem value="year">Last Year</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </Paper>

          <Paper sx={{ mb: 4 }}>
            <Tabs 
              value={activeTab} 
              onChange={handleTabChange}
              variant="fullWidth"
              textColor="primary"
              indicatorColor="primary"
            >
              <Tab label="All Tests" />
              <Tab label="Passed Tests" />
              <Tab label="Failed Tests" />
            </Tabs>
            <Divider />
            <Box p={2}>
              {filteredHistory.length === 0 ? (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <Typography variant="body1" color="text.secondary">
                    No test results match your current filters.
                          </Typography>
                        </Box>
              ) : (
                filteredHistory.map(test => renderTestCard(test))
              )}
            </Box>
          </Paper>
        </>
      )}
    </Container>
  );
}

export default TestHistory; 