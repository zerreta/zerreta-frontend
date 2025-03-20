import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import {
  Box,
  Typography,
  Button,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  CircularProgress,
  Alert,
  Divider,
  Paper,
  LinearProgress,
  Chip,
  Grid,
  CardMedia,
  Tabs,
  Tab,
  Tooltip,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableBody,
  TableCell,
  Container,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle
} from '@mui/material';
import {
  Timer as TimerIcon,
  Check as CheckIcon,
  ArrowBack as ArrowBackIcon,
  EmojiEvents as TrophyIcon,
  Info as InfoIcon,
  Image as ImageIcon,
  Lock as LockIcon,
  LockOpen as LockOpenIcon,
  ArrowForward as ArrowForwardIcon,
  Send as SendIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Replay as ReplayIcon,
  Error as ErrorIcon
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import axiosInstance from './axios-config';
import { motion } from 'framer-motion';

function TestPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { subject, stage, level } = location.state || {};
  
  // Define global styles properly
  const globalStyles = {
    margin: 0,
    padding: 0,
    width: '100vw',
    height: '100vh'
  };
  
  // Define the image URL formatting function at component level
  const getFullImageUrl = (url) => {
    if (!url) return null;
    
    console.log('Processing image URL:', url);
    
    // If URL already has http or https, it's already a full URL
    if (url.startsWith('http://') || url.startsWith('https://')) {
      console.log('URL is already absolute, returning as is:', url);
      return url;
    }
    
    // Get the base URL from the axiosInstance
    const baseApiUrl = axiosInstance.defaults.baseURL;
    
    // If it's a relative URL, prepend the backend server URL
    const formattedUrl = `${baseApiUrl}${url.startsWith('/') ? url : `/${url}`}`;
    console.log('Formatted URL:', formattedUrl);
    return formattedUrl;
  };
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [confirmedAnswers, setConfirmedAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(2700); // 45 minutes in seconds
  const [testStarted, setTestStarted] = useState(false);
  const [testCompleted, setTestCompleted] = useState(false);
  const [results, setResults] = useState(null);
  const [previousAttempts, setPreviousAttempts] = useState([]);
  const [showRules, setShowRules] = useState(true);
  const [activeTab, setActiveTab] = useState(0);
  
  // Initialize a ref for last question time
  const lastQuestionTime = useRef(null);
  
  // Add new state for per-question timers
  const [questionTimers, setQuestionTimers] = useState({});
  const [timer, setTimer] = useState(0);

  // The answeredAt state is used to track when questions are first answered
  // This helps with analytics and timing calculations
  const [answeredAt, setAnsweredAt] = useState({});

  // Add the leaderboard display to the test results page

  // First define a sample leaderboard state (this would be populated by an API call in a real application)
  const [leaderboard, setLeaderboard] = useState([]);

  // Create a function to fetch the leaderboard data
  const fetchLeaderboard = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No token found in localStorage');
        return;
      }
      
      // Update to use axiosInstance
      const response = await axiosInstance.get('/student/leaderboard');
      setLeaderboard(response.data);
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
    }
  }, []);

  // Call fetchLeaderboard when test is completed
  useEffect(() => {
    if (testCompleted) {
      fetchLeaderboard();
    }
  }, [testCompleted, fetchLeaderboard]);

  // Fetch the test questions when component mounts
  useEffect(() => {
    const fetchQuestions = async () => {
      setLoading(true);
      try {
        // Get auth token from local storage
        const token = localStorage.getItem('token');
        if (!token) {
          setError('Authentication token not found. Please log in again.');
          setLoading(false);
          return;
        }

        // Fetch questions from the server
        const response = await axiosInstance.get(`/student/test?subject=${subject}&stage=${stage}&level=${level}`);

        console.log("Fetched questions:", response.data);
        
        // Add more detailed logging to see the full response
        console.log("Full API response:", JSON.stringify(response.data, null, 2));
        
        // Check if response.data is either an array or has a questions property
        const questionsArray = Array.isArray(response.data) ? response.data : 
                              (response.data && Array.isArray(response.data.questions)) ? response.data.questions : [];
        
        if (questionsArray.length > 0) {
          // Log the first question to debug option format
          console.log("Sample question data:", questionsArray[0]);
          console.log("First question options:", {
            optionA: questionsArray[0].optionA,
            optionB: questionsArray[0].optionB,
            optionC: questionsArray[0].optionC,
            optionD: questionsArray[0].optionD,
          });
          
          // Ensure all questions have option properties
          const processedQuestions = questionsArray.map(q => {
            // Validate question format
            const processedQuestion = { ...q };
            
            // Log options for debugging
            console.log(`Question ${q.id || q._id} options:`, {
              optionA: q.optionA,
              optionB: q.optionB,
              optionC: q.optionC,
              optionD: q.optionD,
            });
            
            // Ensure each option exists
            ['A', 'B', 'C', 'D'].forEach(option => {
              const optionKey = `option${option}`;
              if (!processedQuestion[optionKey] && processedQuestion[optionKey] !== 0) {
                console.warn(`Missing ${optionKey} for question ${q._id || q.id}. Setting default value.`);
                processedQuestion[optionKey] = `Option ${option}`;
              } else {
                console.log(`Option ${option} for question ${q._id || q.id}: ${processedQuestion[optionKey]}`);
              }
            });
            
            // Ensure question has a valid ID
            if (!processedQuestion._id && !processedQuestion.id) {
              processedQuestion.id = Math.random().toString(36).substring(2, 9);
              console.warn("Question without ID detected. Assigned temporary ID:", processedQuestion.id);
            }
            
            return processedQuestion;
          });
          
          setQuestions(processedQuestions);
          setCurrentQuestionIndex(0);
          lastQuestionTime.current = Date.now();
          setTestStarted(true);
        } else {
          setError('No questions available for this test.');
        }
      } catch (err) {
        console.error("Error fetching questions:", err);
        setError(`Failed to load questions: ${err.response?.data?.message || err.message}`);
      }
      setLoading(false);
    };

    if (subject && stage && level) {
      fetchQuestions();
    }
  }, [subject, stage, level]);

  // Define the memoized fetchPreviousAttempts function before it's used in useEffect
  const fetchPreviousAttempts = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        console.error('Authentication token missing');
        return;
      }
      
      // Update to use axiosInstance
      const response = await axiosInstance.get(
        `/student/test-history?subject=${subject}&stage=${stage}&level=${level}`
      );
      
      setPreviousAttempts(response.data);
    } catch (error) {
      console.error('Error fetching previous attempts:', error);
    }
  }, [subject, stage, level]);

  // First, define the handleSubmitTest function to properly include leaderboard points (25 points per level cleared)
  // Memoize the handleSubmitTest function 
  const handleSubmitTest = async () => {
    try {
      // Don't allow submitting if the test is still loading or already completed
      if (loading || testCompleted) {
        return;
      }
      
      // Check if all questions have been answered
      if (Object.keys(confirmedAnswers).length < questions.length) {
        alert(`Please answer all questions before submitting. You have answered ${Object.keys(confirmedAnswers).length} out of ${questions.length} questions.`);
        return;
      }
      
      // Set loading state
      setLoading(true);
      
      // Get auth token from local storage
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Authentication token not found. Please log in again.');
        setLoading(false);
        return;
      }
      
      // Calculate score
      let correctCount = 0;
      const answersToSubmit = [];
      
      // Convert confirmed answers to the format expected by the backend
      questions.forEach(question => {
        const questionId = question._id || question.id;
        const selectedOption = confirmedAnswers[questionId];
        
        if (selectedOption) {
          const isCorrect = selectedOption === question.correctOption;
          if (isCorrect) correctCount++;
          
          answersToSubmit.push({
            questionId: questionId,
            selectedOption: selectedOption,
            isCorrect: isCorrect
          });
        }
      });
      
      // Calculate score as percentage
      const score = Math.round((correctCount / questions.length) * 100);
      
      // Determine if the student passed the level (70% or above)
      const passedLevel = score >= 70;
      
      // Calculate leaderboard points (25 points for passing the level)
      const leaderboardPoints = passedLevel ? 25 : 0;
      
      // Prepare submission data
      const submissionData = {
        subject: subject,
        stage: parseInt(stage),
        level: parseInt(level),
        answers: answersToSubmit,
        score: score,
        timeTaken: timer,
        passedLevel: passedLevel,
        leaderboardPoints: leaderboardPoints
      };
      
      console.log("Submitting test answers:", submissionData);
      
      // Update to use axiosInstance
      const response = await axiosInstance.post('/student/test/submit', {
        testDetails: {
          subject,
          stage,
          level,
          timeSpent: 2700 - timeLeft,
          questionTimers
        },
        answers: confirmedAnswers,
        isComplete: true
      });
      
      console.log("Test submission response:", response.data);
      
      // Create results object
      const results = {
        score: score,
        correctAnswers: correctCount,
        totalQuestions: questions.length,
        timeTaken: timer,
        passedLevel: passedLevel,
        leaderboardPoints: leaderboardPoints,
        results: response.data.results || []
      };
      
      // Set results and mark test as completed
      setResults(results);
      setTestCompleted(true);
      
      // Fetch updated leaderboard
      if (fetchLeaderboard) {
        fetchLeaderboard();
      }
      
    } catch (err) {
      console.error("Error submitting test:", err);
      setError(`Failed to submit test: ${err.response?.data?.message || err.message}`);
      
      // Show detailed error in console
      if (err.response) {
        console.error("Server response error:", err.response.data);
      }
    } finally {
      setLoading(false);
    }
  };

  // Now, let's place the useEffect after all the function declarations so that they're initialized properly
  useEffect(() => {
    if (!subject || !stage || !level) {
      navigate('/student-dashboard');
      return;
    }
    
    // Only fetch previous attempts here
    fetchPreviousAttempts();
  }, [subject, stage, level, navigate, fetchPreviousAttempts]);

  // Timer effect with the memoized handleSubmitTest
  useEffect(() => {
    let timer;
    if (testStarted && !testCompleted && timeLeft > 0) {
      timer = setTimeout(() => {
        setTimeLeft(prevTime => prevTime - 1);
      }, 1000);
    } else if (timeLeft === 0 && !testCompleted) {
      handleSubmitTest();
    }
    
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [timeLeft, testStarted, testCompleted, handleSubmitTest]);

  // Set up question timer
  useEffect(() => {
    let interval;
    
    if (testStarted && !testCompleted) {
      lastQuestionTime.current = lastQuestionTime.current || Date.now();
      
      interval = setInterval(() => {
        setTimer(prev => prev + 1);
      }, 1000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [testStarted, testCompleted]);

  // Clean up timer when component unmounts
  useEffect(() => {
    return () => {
      if (timer) {
        clearInterval(timer);
      }
    };
  }, []);

  const handleStartTest = () => {
    setTestStarted(true);
    setShowRules(false);
    lastQuestionTime.current = Date.now();
    setTimer(0);
  };

  // Memoize the handleAnswerSelect function
  const handleAnswerSelect = (option) => {
    console.log("Selected option:", option);
    if (!questions[currentQuestionIndex]) {
      console.error("Current question is not defined");
      return;
    }

    const questionId = questions[currentQuestionIndex]._id || questions[currentQuestionIndex].id;
    
    // Don't allow changing a confirmed answer
    if (confirmedAnswers[questionId]) {
      console.log("This answer is already confirmed");
      return;
    }
    
    // Update the selected answer for this question
    setSelectedAnswers(prev => ({
      ...prev,
      [questionId]: option
    }));
    
    // Update the question timer
    const currentTime = Date.now();
    if (lastQuestionTime.current) {
      const timeSpent = Math.floor((currentTime - lastQuestionTime.current) / 1000);
      
      setQuestionTimers(prev => ({
        ...prev,
        [questionId]: (prev[questionId] || 0) + timeSpent
      }));
    }
    
    lastQuestionTime.current = currentTime;
    console.log("Selected answers updated:", { ...selectedAnswers, [questionId]: option });
  };

  const handleConfirmAnswer = () => {
    if (!questions[currentQuestionIndex]) {
      console.error("Current question is not defined");
      return;
    }

    const questionId = questions[currentQuestionIndex]._id || questions[currentQuestionIndex].id;
    const selected = selectedAnswers[questionId];
    
    console.log("Confirming answer:", { questionId, selected });
    
    // Don't allow confirming if no answer is selected
    if (!selected) {
      console.warn("No answer selected to confirm");
      return;
    }
    
    // Don't allow changing a confirmed answer
    if (confirmedAnswers[questionId]) {
      console.log("This answer is already confirmed");
      return;
    }
    
    // Confirm the answer
    setConfirmedAnswers(prev => ({
      ...prev,
      [questionId]: selected
    }));
    
    console.log("Confirmed answers updated:", { ...confirmedAnswers, [questionId]: selected });
    
    // Auto move to next question if not the last one
    if (currentQuestionIndex < questions.length - 1) {
      // Use a short delay for better UX
      setTimeout(() => {
        handleNextQuestion();
      }, 500);
    }
  };

  const handlePrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      // Update timer for current question
      const questionId = questions[currentQuestionIndex]._id || questions[currentQuestionIndex].id;
      const currentTime = Date.now();
      
      if (lastQuestionTime.current) {
        const timeSpent = Math.floor((currentTime - lastQuestionTime.current) / 1000);
        
      setQuestionTimers(prev => ({
        ...prev,
        [questionId]: (prev[questionId] || 0) + timeSpent
      }));
      }
      
      // Move to previous question
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      lastQuestionTime.current = Date.now();
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      // Update timer for current question
      const questionId = questions[currentQuestionIndex]._id || questions[currentQuestionIndex].id;
      const currentTime = Date.now();
      
      if (lastQuestionTime.current) {
        const timeSpent = Math.floor((currentTime - lastQuestionTime.current) / 1000);
        
        setQuestionTimers(prev => ({
          ...prev,
          [questionId]: (prev[questionId] || 0) + timeSpent
        }));
      }
      
      // Move to next question
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      lastQuestionTime.current = Date.now();
    }
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getCompletionPercentage = () => {
    const answeredCount = Object.keys(selectedAnswers).length;
    return (answeredCount / questions.length) * 100;
  };

  // Function to render the question with image if available
  const renderQuestionWithImage = (question) => {
    if (!question) return null;
    
    // Get the correct ID from the question object (MongoDB uses _id, our local code might use id)
    const questionId = question._id || question.id;
    
    // Get the full image URL
    const fullImageUrl = question.imageUrl ? getFullImageUrl(question.imageUrl) : null;
    
    return (
      <Box>
        <Typography 
          variant="h5" 
          gutterBottom 
          sx={{ 
            fontWeight: 'medium', 
            color: 'text.primary',
            mb: 2
          }}
        >
          {question.questionText}
        </Typography>
        
        {fullImageUrl && (
          <Box sx={{ 
            mb: 3, 
            display: 'flex',
            justifyContent: 'center',
            p: 2,
            bgcolor: 'white',
            border: '1px solid #e0e0e0',
            borderRadius: 2,
            overflow: 'hidden'
          }}>
            <img 
              src={fullImageUrl}
              alt="Question"
              style={{
                maxWidth: '100%',
                maxHeight: 220,
                objectFit: 'contain'
              }}
            />
          </Box>
        )}
      </Box>
    );
  };

  // First, define a theme object to control sizing globally
  const theme = {
    spacing: 0.7, // Reduce spacing factor
    fontSize: {
      h4: '1.5rem',
      h5: '1.1rem',
      h6: '0.95rem',
      body1: '0.8rem',
      body2: '0.7rem',
      subtitle1: '0.85rem',
      subtitle2: '0.75rem',
      caption: '0.65rem'
    },
    padding: {
      small: '0.4rem',
      medium: '0.7rem',
      large: '1rem'
    }
  };

  if (loading) {
    return (
      <Box sx={{ 
        height: '100vh', 
        width: '100vw',
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center',
        bgcolor: '#fafafa',
        margin: 0,
        padding: 0,
        position: 'fixed',
        top: 0,
        left: 0,
        overflow: 'auto',
        // ...globalStyles
      }}>
        <Paper elevation={2} sx={{ p: 3, maxWidth: 400, width: '100%', textAlign: 'center' }}>
          <CircularProgress sx={{ mb: 2 }} size={30} />
          <Typography variant="h6" gutterBottom sx={{ fontSize: '1.1rem' }}>
            Loading Test
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.8rem' }}>
            Please wait while we prepare your test...
          </Typography>
        </Paper>
      </Box>
    );
  }
  
  if (error) {
    return (
      <Box sx={{ 
        height: '100vh', 
        width: '100vw',
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center',
        bgcolor: '#fafafa',
        margin: 0,
        padding: 0,
        position: 'fixed',
        top: 0,
        left: 0,
        overflow: 'auto',
        // ...globalStyles
      }}>
        <Paper elevation={2} sx={{ p: theme.padding.medium, maxWidth: 450, width: '100%', textAlign: 'center' }}>
          <ErrorIcon color="error" sx={{ fontSize: 50, mb: 1.5 }} />
          <Typography variant="h6" gutterBottom color="error" sx={{ fontSize: theme.fontSize.h6 }}>
            Error Loading Test
          </Typography>
          <Typography variant="body1" sx={{ mb: 2.5, fontSize: theme.fontSize.body1 }}>
            {error}
          </Typography>
          <Button 
            variant="contained" 
            color="primary"
            onClick={() => window.location.reload()}
            size="small"
          >
            Try Again
          </Button>
        </Paper>
      </Box>
    );
  }

  if (showRules) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        style={{
          // ...globalStyles,
          width: '100vw',
          height: '100vh',
          margin: 0,
          padding: 0,
          position: 'fixed',
          top: 0,
          left: 0,
          overflow: 'auto'
        }}
      >
        <Box sx={{ p: 4, maxWidth: 1200, mx: 'auto', my: 3 }}>
          <Typography variant="h4" gutterBottom sx={{ 
            textAlign: 'center', 
            fontWeight: 'bold',
            background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
            backgroundClip: 'text',
            textFillColor: 'transparent',
            mb: 3,
            fontSize: '2rem'
          }}>
            {subject.charAt(0).toUpperCase() + subject.slice(1)} - Stage {stage}, Level {level}
          </Typography>
          
          <Paper elevation={3} sx={{ p: 3, mb: 4, borderRadius: 2, border: '1px solid #e0e0e0' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <InfoIcon color="primary" sx={{ fontSize: 28, mr: 1 }} />
              <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', m: 0 }}>
                NEET Exam Rules
              </Typography>
            </Box>
            <Divider sx={{ mb: 3 }} />
            
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Paper elevation={1} sx={{ p: 2, bgcolor: '#f5f5f5', height: '100%' }}>
                  <Typography variant="h6" gutterBottom sx={{ color: 'primary.main', fontWeight: 'bold' }}>
                    Test Format
                  </Typography>
                  <Box component="ul" sx={{ pl: 2, mb: 0 }}>
                    <Typography component="li" sx={{ mb: 1 }}>
                      This test contains <strong>45 multiple-choice questions</strong>.
                    </Typography>
                    <Typography component="li" sx={{ mb: 1 }}>
                      You have <strong>45 minutes</strong> to complete the test.
                    </Typography>
                    <Typography component="li" sx={{ mb: 1 }}>
                      You can navigate between questions using the Next and Previous buttons.
                    </Typography>
                    <Typography component="li" sx={{ mb: 1 }}>
                      You can review your answers before submitting.
                    </Typography>
                  </Box>
                </Paper>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Paper elevation={1} sx={{ p: 2, bgcolor: '#f5f5f5', height: '100%' }}>
                  <Typography variant="h6" gutterBottom sx={{ color: 'primary.main', fontWeight: 'bold' }}>
                    Marking Scheme
                  </Typography>
                  <Box component="ul" sx={{ pl: 2, mb: 0 }}>
                    <Typography component="li" sx={{ mb: 1 }}>
                      <strong>+4 marks</strong> for each correct answer.
                    </Typography>
                    <Typography component="li" sx={{ mb: 1 }}>
                      <strong>-1 mark</strong> for each incorrect answer (negative marking).
                    </Typography>
                    <Typography component="li" sx={{ mb: 1 }}>
                      No marks for unattempted questions.
                    </Typography>
                    <Typography component="li" sx={{ mb: 1 }}>
                      Your score will be displayed after submission.
                    </Typography>
                  </Box>
                </Paper>
              </Grid>
              
              <Grid item xs={12}>
                <Paper elevation={1} sx={{ p: 2, bgcolor: '#e8f4fd', borderLeft: '4px solid #2196f3' }}>
                  <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                    <strong>Important:</strong> Once submitted, you cannot retake the test immediately. Make sure to review all your answers before submitting.
                  </Typography>
                </Paper>
              </Grid>
            </Grid>
          </Paper>
          
          {previousAttempts.length > 0 && (
            <Paper elevation={3} sx={{ p: 3, mb: 4, borderRadius: 2 }}>
              <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
                Previous Attempts
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <Box>
                {previousAttempts.map((attempt, index) => (
                  <Box key={index} sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography>
                      {new Date(attempt.date).toLocaleDateString()}
                    </Typography>
                    <Chip 
                      label={`${attempt.score}/${attempt.total} (${Math.round((attempt.score/attempt.total) * 100)}%)`}
                      color={attempt.score/attempt.total >= 0.7 ? 'success' : 'warning'}
                    />
                  </Box>
                ))}
              </Box>
            </Paper>
          )}
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
            <Button 
              variant="outlined" 
              startIcon={<ArrowBackIcon />} 
              onClick={handleGoBack}
              size="large"
              sx={{ px: 4, py: 1.5 }}
            >
              Go Back
            </Button>
            <Button 
              variant="contained" 
              color="primary" 
              onClick={handleStartTest}
              disabled={questions.length === 0}
              size="large"
              sx={{ px: 6, py: 1.5, fontSize: '1.1rem' }}
            >
              Start Test
            </Button>
          </Box>
        </Box>
      </motion.div>
    );
  }

  if (testCompleted && results) {
    return (
      <Box sx={{ 
        height: '100vh', 
        width: '100vw',
        bgcolor: '#ffffff',
        margin: 0,
        padding: 0,
        overflow: 'auto',
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        transform: 'none'
      }}>
        {/* Results Header */}
        <Container maxWidth={false} sx={{ width: '100%', px: 2, py: 2 }}>
          <Paper 
            elevation={2}
            sx={{
              p: 4,
              borderRadius: 2,
              mb: 4,
              background: results.score >= 70 ? 
                'linear-gradient(to right, #4caf50, #81c784)' : 
                'linear-gradient(to right, #ff9800, #ffb74d)',
              color: 'white'
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              {results.score >= 70 ? (
                <CheckCircleIcon sx={{ fontSize: 40, mr: 2 }} />
              ) : (
                <InfoIcon sx={{ fontSize: 40, mr: 2 }} />
              )}
              <Typography variant="h4" fontWeight="bold">
                {results.score >= 70 ? 'Test Passed!' : 'Test Completed'}
              </Typography>
            </Box>
            
            <Typography variant="h6" sx={{ opacity: 0.9, mb: 3 }}>
              {results.score >= 70 
                ? 'Congratulations! You have successfully passed this level.' 
                : 'You did not reach the passing score. Review your answers and try again.'}
            </Typography>
            
            <Grid container spacing={4}>
              <Grid item xs={12} md={4}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="overline" sx={{ opacity: 0.8, letterSpacing: 1 }}>
                    SCORE
                  </Typography>
                  <Typography variant="h2" fontWeight="bold" sx={{ my: 1 }}>
                    {results.score}%
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.8 }}>
                    {results.correctAnswers} of {results.totalQuestions} questions answered correctly
                  </Typography>
                </Box>
              </Grid>
              
              <Grid item xs={12} md={4}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="overline" sx={{ opacity: 0.8, letterSpacing: 1 }}>
                    RESULT
                  </Typography>
                  <Typography variant="h2" fontWeight="bold" sx={{ my: 1 }}>
                    {results.passedLevel ? 'PASS' : 'FAIL'}
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.8 }}>
                    {results.passedLevel 
                      ? `You earned ${results.leaderboardPoints} points` 
                      : 'You need 70% to pass this level'}
                  </Typography>
                </Box>
              </Grid>
              
              <Grid item xs={12} md={4}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="overline" sx={{ opacity: 0.8, letterSpacing: 1 }}>
                    TIME
                  </Typography>
                  <Typography variant="h2" fontWeight="bold" sx={{ my: 1 }}>
                    {Math.floor(results.timeTaken / 60)}:{(results.timeTaken % 60).toString().padStart(2, '0')}
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.8 }}>
                    Avg. {Math.round(results.timeTaken / questions.length)} seconds per question
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Paper>

          {/* Detailed Results */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="h5" fontWeight="bold" gutterBottom>
              Question Review
            </Typography>
            
            {/* Time Analysis Graph */}
            <Paper elevation={1} sx={{ p: 3, borderRadius: 2, mb: 4 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <TimerIcon sx={{ color: 'primary.main', mr: 1 }} />
                <Typography variant="h6" fontWeight="bold">
                  Time Analysis
                </Typography>
              </Box>
              
              <Typography variant="body2" color="text.secondary" mb={2}>
                This chart shows how much time you spent on each question compared to the allocated time (60 sec per question).
              </Typography>
              
              <Box sx={{ height: 'auto', width: '100%', mb: 3 }}>
                <Grid container spacing={1}>
                  {questions.map((question, index) => {
                    const questionId = question._id || question.id;
                    const timeSpent = questionTimers[questionId] || 0;
                    const allocatedTime = 60; // Default 60 seconds per question
                    const isCorrect = (selectedAnswers[questionId] || confirmedAnswers[questionId]) === question.correctOption;
                    
                    // Calculate percentage of allocated time
                    const percentage = Math.min(100, (timeSpent / allocatedTime) * 100);
                    
                    // Determine color based on correctness and time
                    let color = '#f44336'; // Red for incorrect
                    if (isCorrect) {
                      color = timeSpent > allocatedTime ? '#ff9800' : '#4caf50'; // Orange for overtime, green for on time
                    }
                    
                    return (
                      <Grid item xs={12} key={questionId} sx={{ mb: 1 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Typography variant="body2" fontWeight="medium" sx={{ mr: 1, minWidth: 50 }}>
                              Q{index + 1}:
                            </Typography>
                            <Chip 
                              size="small" 
                              label={isCorrect ? "Correct" : "Incorrect"}
                              color={isCorrect ? "success" : "error"}
                              sx={{ mr: 1 }}
                            />
                          </Box>
                          <Typography variant="body2">
                            {timeSpent} sec / {allocatedTime} sec
                            {timeSpent > allocatedTime && (
                              <span style={{ color: '#ff9800', fontWeight: 'bold', marginLeft: '4px' }}>
                                (Overtime)
                              </span>
                            )}
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                          <Box sx={{ flexGrow: 1, bgcolor: '#f0f0f0', height: 12, borderRadius: 6, overflow: 'hidden' }}>
                            <Box
                              sx={{ 
                                width: `${percentage}%`,
                                bgcolor: color,
                                height: '100%',
                                transition: 'width 0.5s ease-in-out'
                              }}
                            />
                          </Box>
                        </Box>
                      </Grid>
                    );
                  })}
                </Grid>
              </Box>
              
              <Box sx={{ display: 'flex', justifyContent: 'center', gap: 3, flexWrap: 'wrap' }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Box sx={{ width: 16, height: 16, bgcolor: '#4caf50', borderRadius: '50%', mr: 1 }} />
                  <Typography variant="body2">Correct & On Time</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Box sx={{ width: 16, height: 16, bgcolor: '#ff9800', borderRadius: '50%', mr: 1 }} />
                  <Typography variant="body2">Correct but Overtime</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Box sx={{ width: 16, height: 16, bgcolor: '#f44336', borderRadius: '50%', mr: 1 }} />
                  <Typography variant="body2">Incorrect</Typography>
                </Box>
              </Box>
            </Paper>
            
            <Typography variant="h5" sx={{ mb: 4, textAlign: 'center' }}>
              Review Your Answers
            </Typography>
            
            {/* Wrap questions in a Grid container */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
              {questions.map((question, index) => {
                const questionId = question._id || question.id;
                const selectedOption = selectedAnswers[questionId] || confirmedAnswers[questionId] || '';
                const isCorrect = selectedOption === question.correctOption;
                const resultDetails = results.results?.find(r => r.questionId === questionId);
                
                // Get formatted image URL
                const fullImageUrl = question.imageUrl ? getFullImageUrl(question.imageUrl) : null;
                
                // Display two questions side by side based on index
                return (
                  <Grid item xs={12} md={6} key={questionId}>
                    <Paper 
                      elevation={1} 
                      sx={{ 
                        mb: 3,
                        borderRadius: 2,
                        overflow: 'hidden',
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column'
                      }}
                    >
                      {/* Question Header */}
                      <Box sx={{ 
                        px: 2, 
                        py: 1.5, 
                        bgcolor: isCorrect ? 'success.light' : 'error.light',
                        borderBottom: '1px solid',
                        borderColor: isCorrect ? 'success.main' : 'error.main',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                      }}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          {isCorrect ? (
                            <CheckCircleIcon sx={{ color: 'success.dark', mr: 1, fontSize: '1.2rem' }} />
                          ) : (
                            <CancelIcon sx={{ color: 'error.dark', mr: 1, fontSize: '1.2rem' }} />
                          )}
                          <Typography variant="body1" fontWeight="bold" color={isCorrect ? 'success.dark' : 'error.dark'}>
                            Question {index + 1} - {isCorrect ? 'Correct' : 'Incorrect'}
                          </Typography>
                        </Box>
                        
                        <Chip 
                          icon={<TimerIcon fontSize="small" />}
                          label={`${questionTimers[questionId] || 0} seconds`}
                          size="small"
                          color={isCorrect ? "success" : "error"}
                          variant="outlined"
                        />
                      </Box>
                      
                      {/* Question Content */}
                      <Box sx={{ p: 2, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                        {/* Subject & Question Text */}
                        <Box sx={{ mb: 2 }}>
                          <Typography variant="caption" color="text.secondary" gutterBottom>
                            {subject.toUpperCase()} • LEVEL {level}
                          </Typography>
                          <Typography variant="h5" sx={{ fontWeight: 'medium', mb: 3, fontSize: '0.95rem' }}>
                            {question.questionText || "Loading question..."}
                          </Typography>
                        </Box>
                        
                        {/* Image display area */}
                        {question.imageUrl && (
                          <Box sx={{ 
                            mb: 2, 
                            display: 'flex',
                            justifyContent: 'center',
                            p: 2,
                            bgcolor: 'white',
                            border: '1px solid #e0e0e0',
                            borderRadius: 2,
                            overflow: 'hidden'
                          }}>
                            <img 
                              src={fullImageUrl}
                              alt="Question"
                              style={{
                                maxWidth: '100%',
                                maxHeight: 220,
                                objectFit: 'contain'
                              }}
                            />
                          </Box>
                        )}
                        
                        {/* Answer Options */}
                        <Box sx={{ mb: 3 }}>
                          <Typography variant="body2" fontWeight="bold" sx={{ mb: 1 }}>
                            Answer Options:
                          </Typography>
                          
                          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                            {['A', 'B', 'C', 'D'].map((option) => {
                              const isUserSelected = selectedOption === option;
                              const isCorrectOption = question.correctOption === option;
                              
                              const optionText = question[`option${option}`] || 
                                (question.options && question.options.length > 0 && question.options[option.charCodeAt(0) - 'A'.charCodeAt(0)]) ||
                                `Option ${option}`;
                              
                              // Define disabled variable
                              const disabled = true; // In review mode, options should be disabled
                              
                              return (
                                <Paper
                                  key={option}
                                  elevation={0}
                                  onClick={() => !disabled && handleAnswerSelect(option)}
                                  sx={{
                                    p: 1.5,
                                    border: '1.5px solid',
                                    borderColor: isCorrectOption ? 'success.main' : 
                                                isUserSelected ? 'primary.main' : 
                                                 '#e0e0e0',
                                    borderRadius: 1.5,
                                    transition: 'all 0.2s ease',
                                    bgcolor: isCorrectOption ? 'rgba(76, 175, 80, 0.1)' : 
                                             isUserSelected ? 'rgba(33, 150, 243, 0.1)' : 
                                               'white',
                                    cursor: disabled ? 'default' : 'pointer',
                                    '&:hover': {
                                      bgcolor: disabled ? (isCorrectOption ? 'rgba(76, 175, 80, 0.1)' : isUserSelected ? 'rgba(33, 150, 243, 0.1)' : 'white') : 
                                                '#f5f5f5',
                                      borderColor: disabled ? (isCorrectOption ? 'success.main' : isUserSelected ? 'primary.main' : '#e0e0e0') :
                                                                      '#bdbdbd'
                                    },
                                    display: 'flex',
                                    alignItems: 'center'
                                  }}
                                >
                                  <Box sx={{
                                    width: 30,
                                    height: 30,
                                    borderRadius: '50%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    bgcolor: isCorrectOption ? 'success.main' :
                                             isUserSelected ? 'primary.main' : 
                                             '#f0f0f0',
                                    color: (isCorrectOption || isUserSelected) ? 'white' : 'text.primary',
                                    fontWeight: (isCorrectOption || isUserSelected) ? 'medium' : 'regular',
                                    mr: 1.5,
                                    fontSize: '0.9rem'
                                  }}>
                                    {option}
                                  </Box>
                                  <Typography 
                                    variant="body1" 
                                    sx={{ 
                                      fontWeight: (isCorrectOption || isUserSelected) ? 'medium' : 'regular',
                                      wordBreak: 'break-word',
                                      flex: 1,
                                      fontSize: '0.8rem'
                                    }}
                                  >
                                    {optionText}
                                  </Typography>
                                </Paper>
                              );
                            })}
                          </Box>
                        </Box>
                        
                        {/* Explanation */}
                        {resultDetails?.explanation && (
                          <Box sx={{ mt: 'auto', pt: 1 }}>
                            <Typography variant="body2" fontWeight="bold" color="text.secondary">
                              Explanation:
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.9rem' }}>
                              {resultDetails.explanation}
                            </Typography>
                          </Box>
                        )}
                      </Box>
                    </Paper>
                  </Grid>
                );
              })}
            </Grid>
          </Box>
          
          {/* Actions */}
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between',
            mt: 6,
            pb: 8  // Add more padding at the bottom to ensure content doesn't get cut off
          }}>
            <Button 
              variant="outlined"
              color="primary"
              size="large"
              onClick={handleGoBack}
              startIcon={<ArrowBackIcon />}
            >
              Back to Dashboard
            </Button>
            
            {!results.passedLevel && (
            <Button 
              variant="contained"
              color="primary"
              size="large"
              onClick={() => window.location.reload()}
              startIcon={<ReplayIcon />}
            >
              Try Again
            </Button>
            )}
            
            {results.passedLevel && (
              <Button 
                variant="contained"
                color="primary"
                size="large"
                onClick={() => navigate('/student-dashboard')}
                endIcon={<ArrowForwardIcon />}
              >
                Continue to Next Level
              </Button>
            )}
          </Box>
        </Container>
      </Box>
    );
  }

  if (testStarted && !testCompleted) {
    return (
      <Box sx={{ 
        height: '100vh', 
        width: '100vw',
        display: 'flex',
        flexDirection: 'column',
        bgcolor: '#ffffff',
        margin: 0,
        padding: 0,
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        transform: 'none',
        overflow: 'hidden'
      }}>
        {/* Header with timer */}
        <Box 
          component={Paper} 
          elevation={2}
          sx={{
            p: 1,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderRadius: 0,
            borderBottom: '1px solid #e0e0e0',
            flexShrink: 0 // Prevent header from shrinking
          }}
        >
          <Typography variant="h6" fontWeight="medium" sx={{ fontSize: '0.95rem' }}>
            {subject.charAt(0).toUpperCase() + subject.slice(1)} - Stage {stage}, Level {level}
          </Typography>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <TimerIcon sx={{ color: timer < 300 ? "error.main" : timer < 600 ? "warning.main" : "primary.main", mr: 1 }} />
              <Typography variant="h6" fontWeight="bold" sx={{ color: timer < 300 ? "error.main" : timer < 600 ? "warning.main" : "primary.main" }}>
                {formatTime(timer)}
              </Typography>
            </Box>
            
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              bgcolor: 'success.light', 
              py: 0.5, 
              px: 2, 
              borderRadius: 2 
            }}>
              <Typography variant="body1" fontWeight="medium" color="success.dark">
                {Object.keys(confirmedAnswers).length}/{questions.length} Answered
              </Typography>
            </Box>
          </Box>
        </Box>
        
        {/* Main test area */}
        <Box sx={{ 
          display: 'flex', 
          flexGrow: 1, 
          overflow: 'hidden',
          position: 'relative', // Add position relative
          height: 'calc(100vh - 56px)' // Account for header height
        }}>
          {/* OMR Sheet (Left Panel) */}
          <Paper
            elevation={0}
            sx={{ 
              width: 240, // Reduce width 
              borderRight: '1px solid #e0e0e0',
              display: { xs: 'none', md: 'flex' },
              flexDirection: 'column',
              p: 2  // Reduce padding
            }}
          >
            <Typography variant="h6" fontWeight="bold" sx={{ mb: 2, fontSize: '0.95rem' }}>
              Answer Sheet (OMR)
            </Typography>
            
            <Box sx={{ mb: 4 }}>
              <LinearProgress 
                variant="determinate" 
                value={(Object.keys(confirmedAnswers).length / questions.length) * 100} 
                sx={{ height: 8, borderRadius: 4, mb: 2 }}
              />
              <Typography variant="body2" sx={{ textAlign: 'center' }}>
                {Object.keys(confirmedAnswers).length} of {questions.length} answered
              </Typography>
            </Box>
            
            <Grid container spacing={1.5} sx={{ mb: 4 }}>
              {questions.map((question, index) => {
                const questionId = question._id || question.id;
                const isAnswered = !!confirmedAnswers[questionId];
                const selectedOption = confirmedAnswers[questionId] || '';
                
                return (
                  <Grid item xs={3} key={questionId}>
                    <Button
                      variant={currentQuestionIndex === index ? "contained" : "outlined"}
                      color={isAnswered ? "success" : "primary"}
                      onClick={() => setCurrentQuestionIndex(index)}
                      sx={{
                        minWidth: 'auto',
                        width: 42,
                        height: 42,
                        fontWeight: 'bold',
                        position: 'relative'
                      }}
                    >
                      {index + 1}
                      {isAnswered && (
                        <Box sx={{
                          position: 'absolute',
                          top: -5,
                          right: -5,
                          bgcolor: 'success.main',
                          color: 'white',
                          width: 18,
                          height: 18,
                          borderRadius: '50%',
                          fontSize: '0.7rem',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          border: '1px solid white',
                          boxShadow: '0 1px 2px rgba(0,0,0,0.2)'
                        }}>
                          {selectedOption}
                        </Box>
                      )}
                    </Button>
                  </Grid>
                );
              })}
            </Grid>
            
            {/* OMR Answer Key */}
            <Paper 
              elevation={0} 
              sx={{ 
                border: '1px solid #e0e0e0',
                p: 2,
                borderRadius: 2,
                mb: 3,
                bgcolor: '#f9f9f9'
              }}
            >
              <Typography variant="subtitle2" fontWeight="bold" sx={{ mb: 1.5, color: 'text.secondary' }}>
                Answer Key
              </Typography>
              
              <Grid container spacing={1} sx={{ mb: 1 }}>
                {['A', 'B', 'C', 'D'].map(option => (
                  <Grid item xs={3} key={option}>
                    <Box sx={{
                      bgcolor: 'white',
                      border: '1px solid #ddd',
                      borderRadius: '50%',
                      width: 40,
                      height: 40,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 'bold',
                      color: 'text.primary',
                      mx: 'auto'
                    }}>
                      {option}
                    </Box>
                  </Grid>
                ))}
              </Grid>
              
              <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
                <Box sx={{
                  width: 12,
                  height: 12,
                  borderRadius: '50%',
                  bgcolor: 'success.main',
                  mr: 1
                }} />
                <Typography variant="caption">
                  Marked answers
                </Typography>
              </Box>
            </Paper>
            
            <Box sx={{ mt: 'auto', pt: 3, borderTop: '1px solid #f0f0f0' }}>
              <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 2 }}>
                Instructions
              </Typography>
              <Typography variant="body2" sx={{ mb: 1, color: 'text.secondary' }}>
                • Select an option and confirm
              </Typography>
              <Typography variant="body2" sx={{ mb: 1, color: 'text.secondary' }}>
                • Confirm all answers before submitting
              </Typography>
              <Typography variant="body2" sx={{ mb: 1, color: 'text.secondary' }}>
                • Once submitted, you cannot change answers
              </Typography>
            </Box>
          </Paper>
          
          {/* Question Display */}
          <Box sx={{ 
            flexGrow: 1, 
            p: 3, 
            display: 'flex', 
            flexDirection: 'column',
            overflow: 'auto',
            height: '100%' // Ensure it takes full height
          }}>
            <Box sx={{ 
              maxWidth: '100%', 
              width: '100%', 
              mx: 'auto', 
              display: 'flex', 
              flexDirection: 'column',
              height: '100%' 
            }}>
              {/* Question Navigator */}
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center', 
                mb: 3,
                pb: 2,
                borderBottom: '1px solid #f0f0f0'
              }}>
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={handlePrevQuestion}
                  disabled={currentQuestionIndex === 0}
                  startIcon={<ArrowBackIcon />}
                  size="small"
                >
                  Previous
                </Button>
                <Typography variant="h6" fontWeight="medium">
                  Question {currentQuestionIndex + 1} of {questions.length}
                </Typography>
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={handleNextQuestion}
                  disabled={currentQuestionIndex === questions.length - 1}
                  endIcon={<ArrowForwardIcon />}
                  size="small"
                >
                  Next
                </Button>
              </Box>
              
              {/* Question Content */}
              <Paper 
                elevation={1} 
                sx={{ 
                  p: 2, 
                  flexGrow: 1, 
                  display: 'flex', 
                  flexDirection: 'column',
                  borderRadius: 2,
                  border: '1px solid #e0e0e0',
                  bgcolor: '#fafafa',
                  mb: 2
                }}
              >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
                  <Box sx={{ width: '100%' }}>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom sx={{ fontSize: '0.7rem' }}>
                      {subject.toUpperCase()} • LEVEL {level}
                    </Typography>
                    <Typography variant="h5" sx={{ fontWeight: 'medium', mb: 2, fontSize: '1rem' }}>
                      {questions[currentQuestionIndex]?.questionText || "Loading question..."}
                    </Typography>
                  </Box>
                </Box>
                
                {/* Image display area */}
                {questions[currentQuestionIndex]?.imageUrl && (
                  <Box sx={{ 
                    mb: 2, 
                    display: 'flex',
                    justifyContent: 'center',
                    p: 2,
                    bgcolor: 'white',
                    border: '1px solid #e0e0e0',
                    borderRadius: 2,
                    overflow: 'hidden'
                  }}>
                    <img 
                      src={getFullImageUrl(questions[currentQuestionIndex]?.imageUrl)}
                      alt="Question"
                      style={{
                        maxWidth: '100%',
                        maxHeight: 220,
                        objectFit: 'contain'
                      }}
                    />
                  </Box>
                )}
                
                {/* Options Section */}
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 1, fontSize: '0.85rem' }}>
                    Select your answer:
                  </Typography>
                  
                  {questions[currentQuestionIndex] ? (
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                      {['A', 'B', 'C', 'D'].map((option) => {
                        const currentQuestion = questions[currentQuestionIndex];
                        const questionId = currentQuestion?._id || currentQuestion?.id;
                        const isConfirmed = confirmedAnswers[questionId] === option;
                        const isUserSelected = selectedAnswers[questionId] === option;
                        
                        // Get option text from the question
                        let optionText = '';
                        
                        // First try direct property access (optionA, optionB, etc.)
                        optionText = currentQuestion[`option${option}`] || '';
                        
                        // If that fails, try the options array
                        if (!optionText && optionText !== 0) {
                          if (currentQuestion.options && Array.isArray(currentQuestion.options) && currentQuestion.options.length > 0) {
                            const optionIndex = option.charCodeAt(0) - 'A'.charCodeAt(0);
                            if (optionIndex >= 0 && optionIndex < currentQuestion.options.length) {
                              optionText = currentQuestion.options[optionIndex];
                            }
                          }
                        }
                        
                        // If still no option text, show placeholder
                        if (!optionText && optionText !== 0) {
                          optionText = `Option ${option}`;
                        }
                        
                        const disabled = !!confirmedAnswers[questionId];
                        
                        return (
                          <Paper
                            key={option}
                            elevation={0}
                            onClick={() => !disabled && handleAnswerSelect(option)}
                            sx={{
                              p: 1.5,
                              border: '1.5px solid',
                              borderColor: isConfirmed ? 'success.main' : 
                                                  isUserSelected ? 'primary.main' : 
                                                  '#e0e0e0',
                              borderRadius: 1.5,
                              transition: 'all 0.2s ease',
                              bgcolor: isConfirmed ? 'rgba(76, 175, 80, 0.1)' : 
                                               isUserSelected ? 'rgba(33, 150, 243, 0.1)' : 
                                               'white',
                              cursor: disabled ? 'default' : 'pointer',
                              '&:hover': {
                                bgcolor: disabled ? (isConfirmed ? 'rgba(76, 175, 80, 0.1)' : isUserSelected ? 'rgba(33, 150, 243, 0.1)' : 'white') : 
                                          '#f5f5f5',
                                borderColor: disabled ? (isConfirmed ? 'success.main' : isUserSelected ? 'primary.main' : '#e0e0e0') :
                                                              '#bdbdbd'
                              },
                              display: 'flex',
                              alignItems: 'center'
                            }}
                          >
                            <Box sx={{
                              width: 30,
                              height: 30,
                              borderRadius: '50%',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              bgcolor: isConfirmed ? 'success.main' :
                                       isUserSelected ? 'primary.main' : 
                                       '#f0f0f0',
                              color: (isConfirmed || isUserSelected) ? 'white' : 'text.primary',
                              fontWeight: (isConfirmed || isUserSelected) ? 'medium' : 'regular',
                              mr: 1.5,
                              fontSize: '0.9rem'
                            }}>
                              {option}
                            </Box>
                            <Typography variant="body1" sx={{ 
                              fontWeight: (isConfirmed || isUserSelected) ? 'medium' : 'regular',
                              wordBreak: 'break-word',
                              flex: 1,
                              fontSize: '0.8rem'
                            }}>
                              {optionText}
                            </Typography>
                          </Paper>
                        );
                      })}
                    </Box>
                  ) : (
                    <Box sx={{ p: 1.5, textAlign: 'center' }}>
                      <Typography color="text.secondary" sx={{ fontSize: '0.8rem' }}>Loading options...</Typography>
                    </Box>
                  )}
                </Box>
                
                {/* Confirm Answer Button */}
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                  <Button
                    variant="contained"
                    color="success"
                    size="medium"
                    onClick={handleConfirmAnswer}
                    disabled={
                      !selectedAnswers[questions[currentQuestionIndex]?._id || questions[currentQuestionIndex]?.id] || 
                      !!confirmedAnswers[questions[currentQuestionIndex]?._id || questions[currentQuestionIndex]?.id]
                    }
                    sx={{ 
                      px: 3, 
                      py: 1,
                      borderRadius: '6px',
                      fontWeight: 'bold',
                      minWidth: 160,
                      boxShadow: 1,
                      fontSize: '0.9rem'
                    }}
                  >
                    Confirm Answer
                  </Button>
                </Box>
              </Paper>
            </Box>
          </Box>
        </Box>
        
        {/* Submit Test Button - Moved to a fixed position at the bottom right */}
        <Box sx={{ 
          position: 'fixed',
          bottom: 25,
          right: 25,
          zIndex: 100
        }}>
          <Paper
            elevation={3}
            sx={{
              p: 1,
              borderRadius: 2,
              bgcolor: 'white'
            }}
          >
            <Button
              variant="contained"
              color="primary"
              size="medium"
              onClick={handleSubmitTest}
              disabled={Object.keys(confirmedAnswers).length < questions.length}
              startIcon={<SendIcon />}
              sx={{ 
                px: 3, 
                py: 1, 
                borderRadius: 2,
                fontWeight: 'bold',
                fontSize: '0.85rem'
              }}
            >
              Submit ({Object.keys(confirmedAnswers).length}/{questions.length})
            </Button>
          </Paper>
        </Box>
      </Box>
    );
  }
}

export default TestPage; 