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
  Container,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Card,
  CardContent,
  Avatar
} from '@mui/material';
import {
  Timer as TimerIcon,
  Check as CheckIcon,
  ArrowBack as ArrowBackIcon,
  EmojiEvents as TrophyIcon,
  Info as InfoIcon,
  ArrowForward as ArrowForwardIcon,
  Send as SendIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Replay as ReplayIcon,
  Error as ErrorIcon,
  Quiz as QuizIcon
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import axiosInstance from './axios-config';

function GrammarTest() {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state;
  
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [questionStartTime, setQuestionStartTime] = useState(new Date());
  const [testTimeLeft, setTestTimeLeft] = useState(20 * 60); // 20 minutes
  const [isSubmitting, setSubmitting] = useState(false);
  
  // Test state variables
  const [timeSpent, setTimeSpent] = useState(0);
  const [questionTimers, setQuestionTimers] = useState([]);
  const [selectedAnswers, setSelectedAnswers] = useState([]);
  const [reviewedQuestions, setReviewedQuestions] = useState([]);
  const [module, setModule] = useState(state?.module || '');
  const [topicNumber, setTopicNumber] = useState(state?.topicNumber || '');
  
  // Test UI state
  const [showRules, setShowRules] = useState(true);
  const [confirmStartDialogOpen, setConfirmStartDialogOpen] = useState(false);
  const [testStarted, setTestStarted] = useState(false);
  const [testCompleted, setTestCompleted] = useState(false);
  const [results, setResults] = useState(null);
  const [testStartTime, setTestStartTime] = useState(new Date());

  // Calculate score function
  const calculateScore = useCallback(() => {
    if (!questions || !selectedAnswers) return 0;
    const correctAnswers = questions.filter((question, index) => 
      selectedAnswers[index] === question.correctOption
    ).length;
    return (correctAnswers / questions.length) * 100;
  }, [questions, selectedAnswers]);

  // Update useEffect to set module and topicNumber when state changes
  useEffect(() => {
    if (state) {
      setModule(state?.module || '');
      setTopicNumber(state?.topicNumber || '');
    }
  }, [state]);

  // Fetch questions from backend
  const fetchQuestions = async () => {
    try {
      setLoading(true);
      setError('');

      if (!module) {
        setError('Module not specified');
        return;
      }

      const queryParams = new URLSearchParams();
      queryParams.append('module', module);
      if (topicNumber) {
        queryParams.append('topicNumber', topicNumber);
      }

      console.log('Fetching grammar questions with params:', queryParams.toString());
      const response = await axiosInstance.get(`/grammar-questions?${queryParams.toString()}`);
      
      if (response.data && response.data.length > 0) {
        const shuffledQuestions = shuffleArray([...response.data]).slice(0, 15); // Take 15 random questions
        setQuestions(shuffledQuestions);
        setAnswers(new Array(shuffledQuestions.length).fill(null));
        setSelectedAnswers(new Array(shuffledQuestions.length).fill(null));
        setQuestionTimers(new Array(shuffledQuestions.length).fill(0));
      } else {
        setError('No questions found for this module and topic.');
      }
    } catch (err) {
      console.error('Error fetching grammar questions:', err);
      setError('Failed to load questions. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Shuffle array function
  const shuffleArray = (array) => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  };

  // Load questions when component mounts
  useEffect(() => {
    if (module) {
      fetchQuestions();
    }
  }, [module, topicNumber]);

  // Timer effect for test countdown
  useEffect(() => {
    let interval;
    if (testStarted && !testCompleted && testTimeLeft > 0) {
      interval = setInterval(() => {
        setTestTimeLeft(prev => {
          if (prev <= 1) {
            handleTestComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [testStarted, testCompleted]);

  // Timer effect for overall time spent
  useEffect(() => {
    let interval;
    if (testStarted && !testCompleted) {
      interval = setInterval(() => {
        setTimeSpent(prev => prev + 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [testStarted, testCompleted]);

  // Timer effect for individual question timers
  useEffect(() => {
    if (testStarted && !testCompleted && currentQuestionIndex < questions.length) {
      const startTime = Date.now();
      const interval = setInterval(() => {
        const currentTime = Date.now();
        const timeSpent = Math.floor((currentTime - startTime) / 1000);
        setQuestionTimers(prev => {
          const newTimers = [...prev];
          newTimers[currentQuestionIndex] = timeSpent;
          return newTimers;
        });
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [testStarted, testCompleted, currentQuestionIndex, questions.length]);

  // Scroll to top when test results are shown
  useEffect(() => {
    if (testCompleted && results) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [testCompleted, results]);

  const handleStartTest = () => {
    setShowRules(false);
    setTestStarted(true);
    setTestStartTime(new Date());
    setQuestionStartTime(new Date());
  };

  const handleAnswerSelect = (questionIndex, optionIndex) => {
    const newAnswers = [...answers];
    newAnswers[questionIndex] = optionIndex;
    setAnswers(newAnswers);

    const newSelectedAnswers = [...selectedAnswers];
    newSelectedAnswers[questionIndex] = optionIndex;
    setSelectedAnswers(newSelectedAnswers);
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setQuestionStartTime(new Date());
    }
  };

  const handlePrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      setQuestionStartTime(new Date());
    }
  };

  const handleTestComplete = async () => {
    setTestCompleted(true);
    setSubmitting(true);

    try {
      const score = calculateScore();
      const testEndTime = new Date();
      const totalTime = Math.floor((testEndTime - testStartTime) / 1000 / 60); // in minutes

      // Prepare test results
      const questionsWithAnswers = questions.map((question, index) => ({
        text: question.questionText,
        selectedOption: selectedAnswers[index] !== null ? question.options[selectedAnswers[index]] : '',
        correctOption: question.options[question.correctOption],
        isCorrect: selectedAnswers[index] === question.correctOption,
        timeSpent: questionTimers[index] || 0,
        allocatedTime: question.timeAllocation || 60,
        explanation: question.explanation || '',
        topicNumber: question.topicNumber,
        difficulty: question.difficulty,
        category: question.category,
        grammarRule: question.grammarRule,
        questionId: question._id
      }));

      const testData = {
        module,
        topicNumber,
        score,
        totalTime,
        questions: questionsWithAnswers,
        testMode: 'practice',
        timingDetails: {
          startTime: testStartTime,
          endTime: testEndTime
        },
        performanceMetrics: {
          correctAnswers: questionsWithAnswers.filter(q => q.isCorrect).length,
          incorrectAnswers: questionsWithAnswers.filter(q => !q.isCorrect && selectedAnswers[questions.indexOf(questions.find(orig => orig.questionText === q.text))] !== null).length,
          unanswered: questionsWithAnswers.filter(q => selectedAnswers[questions.indexOf(questions.find(orig => orig.questionText === q.text))] === null).length,
          averageTimePerQuestion: questionTimers.reduce((a, b) => a + b, 0) / questions.length
        }
      };

      // Save test results to backend
      const response = await axiosInstance.post('/grammar-test-history', testData);
      console.log('Grammar test results saved:', response.data);

      setResults({
        ...testData,
        _id: response.data._id
      });

    } catch (err) {
      console.error('Error saving grammar test results:', err);
      setError('Failed to save test results. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getCompletionPercentage = () => {
    return ((currentQuestionIndex + 1) / questions.length) * 100;
  };

  const getFullImageUrl = (imageUrl) => {
    if (!imageUrl) return null;
    if (imageUrl.startsWith('http')) return imageUrl;
    return `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/uploads/${imageUrl}`;
  };

  const handleGoBack = () => {
    navigate('/student-dashboard/speaky/grammar');
  };

  const handleRetakeTest = () => {
    // Reset all state
    setCurrentQuestionIndex(0);
    setAnswers([]);
    setSelectedAnswers([]);
    setQuestionTimers([]);
    setTestStarted(false);
    setTestCompleted(false);
    setResults(null);
    setTimeSpent(0);
    setTestTimeLeft(20 * 60);
    setShowRules(true);
    
    // Fetch new questions
    fetchQuestions();
  };

  // Show loading state
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <CircularProgress size={60} />
      </Box>
    );
  }

  // Show error state
  if (error && !testCompleted) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
        <Button variant="contained" onClick={handleGoBack} startIcon={<ArrowBackIcon />}>
          Back to Grammar
        </Button>
      </Container>
    );
  }

  // Show test rules
  if (showRules && !testCompleted) {
    return (
      <Box sx={{ minHeight: '100vh', backgroundColor: '#f8fafc', overflow: 'hidden' }}>
        {/* Hero Section */}
        <Box sx={{ 
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          py: 6
        }}>
          <Container maxWidth="lg" sx={{ px: { xs: 2, sm: 3 } }}>
            <Grid container spacing={4} alignItems="center">
              <Grid item xs={12} md={8}>
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: { xs: 'flex-start', sm: 'center' }, 
                  flexDirection: { xs: 'column', sm: 'row' },
                  gap: 2, 
                  mb: 2 
                }}>
                  <TrophyIcon sx={{ 
                    fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
                    color: '#fbbf24'
                  }} />
                  <Typography variant="h3" fontWeight={700} sx={{ 
                    fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' }
                  }}>
                    Grammar Test
                  </Typography>
                  <Button
                    variant="outlined"
                    startIcon={<ArrowBackIcon />}
                    onClick={handleGoBack}
                    sx={{
                      borderColor: 'rgba(255,255,255,0.3)',
                      color: 'white',
                      backgroundColor: 'rgba(255,255,255,0.1)',
                      backdropFilter: 'blur(10px)',
                      '&:hover': {
                        borderColor: 'rgba(255,255,255,0.5)',
                        backgroundColor: 'rgba(255,255,255,0.2)',
                      },
                      textTransform: 'none',
                      fontWeight: 500,
                      borderRadius: 2,
                      px: 3,
                      alignSelf: { xs: 'flex-start', sm: 'center' }
                    }}
                  >
                    Back to Grammar
                  </Button>
                </Box>
                <Typography variant="h5" fontWeight={600} sx={{ mb: 1, color: '#fbbf24' }}>
                  {module.charAt(0).toUpperCase() + module.slice(1)} Level
                  {topicNumber && ` - Topic ${topicNumber}`}
                </Typography>
                <Typography variant="h6" sx={{ opacity: 0.9, mb: 3, lineHeight: 1.6 }}>
                  Test your grammar knowledge with {questions.length} carefully selected questions. 
                  Take your time and demonstrate your understanding.
                </Typography>
                
                {/* Test Stats */}
                <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap', mb: 3 }}>
                  <Box sx={{ 
                    backgroundColor: 'rgba(255,255,255,0.15)',
                    backdropFilter: 'blur(10px)',
                    borderRadius: 2,
                    px: 3,
                    py: 1,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1
                  }}>
                    <TimerIcon />
                    <Typography variant="body1" fontWeight={600}>
                      20 Minutes
                    </Typography>
                  </Box>
                  <Box sx={{ 
                    backgroundColor: 'rgba(255,255,255,0.15)',
                    backdropFilter: 'blur(10px)',
                    borderRadius: 2,
                    px: 3,
                    py: 1,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1
                  }}>
                    <QuizIcon />
                    <Typography variant="body1" fontWeight={600}>
                      {questions.length} Questions
                    </Typography>
                  </Box>
                  <Box sx={{ 
                    backgroundColor: 'rgba(255,255,255,0.15)',
                    backdropFilter: 'blur(10px)',
                    borderRadius: 2,
                    px: 3,
                    py: 1,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1
                  }}>
                    <CheckIcon />
                    <Typography variant="body1" fontWeight={600}>
                      70% to Pass
                    </Typography>
                  </Box>
                </Box>
              </Grid>
              <Grid item xs={12} md={4} sx={{ textAlign: 'center' }}>
                <QuizIcon sx={{ 
                  fontSize: '120px',
                  opacity: 0.3,
                  filter: 'drop-shadow(0 0 20px rgba(255,255,255,0.3))'
                }} />
              </Grid>
            </Grid>
          </Container>
        </Box>

        {/* Main Content */}
        <Container maxWidth="lg" sx={{ py: 6, px: { xs: 2, sm: 3 } }}>
          <Typography variant="h4" fontWeight={600} color="#1e293b" gutterBottom sx={{ mb: 1 }}>
            Test Instructions
          </Typography>
          <Typography variant="body1" color="#64748b" sx={{ mb: 4 }}>
            Please read the following instructions carefully before starting your test
          </Typography>

          <Grid container spacing={4}>
            {/* Instructions Card */}
            <Grid item xs={12} md={8}>
              <Card sx={{
                borderRadius: 3,
                border: '2px solid #e5e7eb',
                backgroundColor: 'white',
                transition: 'all 0.3s ease',
                position: 'relative',
                overflow: 'hidden'
              }}>
                {/* Top indicator */}
                <Box
                  sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: 4,
                    background: 'linear-gradient(90deg, #667eea, #764ba2)'
                  }}
                />

                <CardContent sx={{ p: 4 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                    <Avatar sx={{
                      backgroundColor: '#667eea',
                      width: 56,
                      height: 56,
                      mr: 2
                    }}>
                      <InfoIcon sx={{ fontSize: '1.5rem' }} />
                    </Avatar>
                    <Typography variant="h5" fontWeight={600} color="#1e293b">
                      Test Guidelines
                    </Typography>
                  </Box>

                  <Box sx={{ pl: 2 }}>
                    {[
                      { icon: '⏱️', text: `You have 20 minutes to complete ${questions.length} questions` },
                      { icon: '📝', text: 'Each question has 4 multiple choice options' },
                      { icon: '🔄', text: 'Navigate between questions using Next/Previous buttons' },
                      { icon: '💾', text: 'Your answers are saved automatically' },
                      { icon: '⚡', text: 'Test auto-submits when time expires' },
                      { icon: '📊', text: 'Detailed results and explanations provided at the end' }
                    ].map((item, index) => (
                      <Box key={index} sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                        <Typography sx={{ fontSize: '1.2rem', mr: 2, mt: 0.2 }}>
                          {item.icon}
                        </Typography>
                        <Typography variant="body1" sx={{ lineHeight: 1.6, color: '#475569' }}>
                          {item.text}
                        </Typography>
                      </Box>
                    ))}
                  </Box>

                  <Alert severity="info" sx={{ mt: 3, borderRadius: 2 }}>
                    <Typography variant="body2">
                      <strong>Pro Tip:</strong> Ensure you have a stable internet connection. 
                      Read each question carefully before selecting your answer.
                    </Typography>
                  </Alert>
                </CardContent>
              </Card>
            </Grid>

            {/* Quick Stats */}
            <Grid item xs={12} md={4}>
              <Card sx={{
                borderRadius: 3,
                border: '2px solid #10b981',
                backgroundColor: '#f0fdf4',
                height: 'fit-content'
              }}>
                <CardContent sx={{ p: 4, textAlign: 'center' }}>
                  <TrophyIcon sx={{ fontSize: '3rem', color: '#10b981', mb: 2 }} />
                  <Typography variant="h6" fontWeight={600} color="#1e293b" gutterBottom>
                    Ready to Excel?
                  </Typography>
                  <Typography variant="body2" color="#475569" sx={{ mb: 3 }}>
                    Show your grammar expertise and achieve your best score!
                  </Typography>
                  
                  <Box sx={{ textAlign: 'left', mb: 3 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2" color="#6b7280">Questions:</Typography>
                      <Typography variant="body2" fontWeight={600}>{questions.length}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2" color="#6b7280">Time Limit:</Typography>
                      <Typography variant="body2" fontWeight={600}>20 minutes</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2" color="#6b7280">Passing Score:</Typography>
                      <Typography variant="body2" fontWeight={600}>70%</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2" color="#6b7280">Level:</Typography>
                      <Typography variant="body2" fontWeight={600}>
                        {module.charAt(0).toUpperCase() + module.slice(1)}
                      </Typography>
                    </Box>
                  </Box>

                  <Button
                    variant="contained"
                    size="large"
                    fullWidth
                    onClick={handleStartTest}
                    sx={{
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      py: 1.5,
                      fontSize: '1.1rem',
                      fontWeight: 600,
                      textTransform: 'none',
                      borderRadius: 2,
                      '&:hover': {
                        background: 'linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%)',
                      }
                    }}
                  >
                    Start Test Now
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </Box>
    );
  }

  // Show test results
  if (testCompleted && results) {
    const { score, performanceMetrics, questions: reviewQuestions } = results;
    const passed = score >= 70;

    return (
      <Box sx={{ minHeight: '100vh', backgroundColor: '#f8fafc' }}>
        {/* Hero Results Section */}
        <Box sx={{
          background: passed ? 
            'linear-gradient(135deg, #10b981 0%, #059669 100%)' : 
            'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
          py: 4,
          position: 'relative',
          overflow: 'hidden'
        }}>
          <Container maxWidth="lg">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Grid container spacing={4} alignItems="center">
                <Grid item xs={12} md={8}>
                  <Box sx={{ color: 'white' }}>
                    <Typography variant="h4" fontWeight={700} gutterBottom>
                      {passed ? 'Excellent Work!' : 'Keep Learning!'}
                    </Typography>
                    <Typography variant="h5" fontWeight={600} sx={{ mb: 1.5 }}>
                      Your Score: {score.toFixed(1)}%
                    </Typography>
                    <Typography variant="body1" sx={{ opacity: 0.9, mb: 2 }}>
                      {module.charAt(0).toUpperCase() + module.slice(1)} Grammar Test
                      {topicNumber && ` - Topic ${topicNumber}`}
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
                      <Chip 
                        label={passed ? 'PASSED' : 'REVIEW NEEDED'} 
                        sx={{ 
                          backgroundColor: 'rgba(255,255,255,0.2)', 
                          color: 'white',
                          fontWeight: 600,
                          fontSize: '1rem',
                          py: 2,
                          px: 1
                        }} 
                      />
                      <Chip 
                        label={`${performanceMetrics.correctAnswers}/${questions.length} Correct`} 
                        sx={{ 
                          backgroundColor: 'rgba(255,255,255,0.2)', 
                          color: 'white',
                          fontWeight: 600,
                          fontSize: '1rem',
                          py: 2,
                          px: 1
                        }} 
                      />
                      <Chip 
                        label={`Time: ${formatTime(timeSpent)}`} 
                        sx={{ 
                          backgroundColor: 'rgba(255,255,255,0.2)', 
                          color: 'white',
                          fontWeight: 600,
                          fontSize: '1rem',
                          py: 2,
                          px: 1
                        }} 
                      />
                      <Button 
                        variant="outlined" 
                        onClick={handleGoBack}
                        sx={{
                          borderColor: 'rgba(255,255,255,0.5)',
                          color: 'white',
                          fontWeight: 600,
                          px: 3,
                          py: 1,
                          textTransform: 'none',
                          borderRadius: 2,
                          ml: 2,
                          '&:hover': {
                            backgroundColor: 'rgba(255,255,255,0.1)',
                            borderColor: 'white'
                          }
                        }}
                      >
                        Back to Grammar
                      </Button>
                    </Box>
                  </Box>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Box sx={{
                      width: 120,
                      height: 120,
                      borderRadius: '50%',
                      backgroundColor: 'rgba(255,255,255,0.2)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto',
                      position: 'relative',
                      '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: -8,
                        left: -8,
                        right: -8,
                        bottom: -8,
                        borderRadius: '50%',
                        background: 'conic-gradient(from 0deg, rgba(255,255,255,0.3), rgba(255,255,255,0.1), rgba(255,255,255,0.3))',
                        animation: 'spin 8s linear infinite'
                      },
                      '@keyframes spin': {
                        from: { transform: 'rotate(0deg)' },
                        to: { transform: 'rotate(360deg)' }
                      }
                    }}>
                      <Typography variant="h3" fontWeight={700} color="white">
                        {score.toFixed(0)}%
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
              </Grid>
            </motion.div>
          </Container>
        </Box>

        <Container maxWidth="xl" sx={{ py: 3 }}>
          {/* Performance Stats Cards */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} sm={6} md={3}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.5 }}
              >
                <Card sx={{
                  p: 2,
                  textAlign: 'center',
                  borderRadius: 2,
                  border: '2px solid #22c55e',
                  backgroundColor: '#f0fdf4',
                  boxShadow: '0 4px 12px rgba(34, 197, 94, 0.1)'
                }}>
                  <CheckCircleIcon sx={{ fontSize: '2rem', color: '#22c55e', mb: 1 }} />
                  <Typography variant="h4" fontWeight={700} color="#22c55e">
                    {performanceMetrics.correctAnswers}
                  </Typography>
                  <Typography variant="body1" color="#065f46" fontWeight={600}>
                    Correct
                  </Typography>
                </Card>
              </motion.div>
            </Grid>
            
            <Grid item xs={12} sm={6} md={3}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
              >
                <Card sx={{
                  p: 2,
                  textAlign: 'center',
                  borderRadius: 2,
                  border: '2px solid #ef4444',
                  backgroundColor: '#fef2f2',
                  boxShadow: '0 4px 12px rgba(239, 68, 68, 0.1)'
                }}>
                  <CancelIcon sx={{ fontSize: '2rem', color: '#ef4444', mb: 1 }} />
                  <Typography variant="h4" fontWeight={700} color="#ef4444">
                    {performanceMetrics.incorrectAnswers}
                  </Typography>
                  <Typography variant="body1" color="#991b1b" fontWeight={600}>
                    Incorrect
                  </Typography>
                </Card>
              </motion.div>
            </Grid>
            
            <Grid item xs={12} sm={6} md={3}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
              >
                <Card sx={{
                  p: 2,
                  textAlign: 'center',
                  borderRadius: 2,
                  border: '2px solid #f59e0b',
                  backgroundColor: '#fffbeb',
                  boxShadow: '0 4px 12px rgba(245, 158, 11, 0.1)'
                }}>
                  <ErrorIcon sx={{ fontSize: '2rem', color: '#f59e0b', mb: 1 }} />
                  <Typography variant="h4" fontWeight={700} color="#f59e0b">
                    {performanceMetrics.unanswered}
                  </Typography>
                  <Typography variant="body1" color="#92400e" fontWeight={600}>
                    Unanswered
                  </Typography>
                </Card>
              </motion.div>
            </Grid>
            
            <Grid item xs={12} sm={6} md={3}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.5 }}
              >
                <Card sx={{
                  p: 2,
                  textAlign: 'center',
                  borderRadius: 2,
                  border: '2px solid #3b82f6',
                  backgroundColor: '#eff6ff',
                  boxShadow: '0 4px 12px rgba(59, 130, 246, 0.1)'
                }}>
                  <TimerIcon sx={{ fontSize: '2rem', color: '#3b82f6', mb: 1 }} />
                  <Typography variant="h4" fontWeight={700} color="#3b82f6">
                    {formatTime(timeSpent)}
                  </Typography>
                  <Typography variant="body1" color="#1e40af" fontWeight={600}>
                    Time
                  </Typography>
                </Card>
              </motion.div>
            </Grid>
          </Grid>

          {/* Action Buttons */}
          <Box sx={{ textAlign: 'center', mb: 3 }}>
            <Button
              variant="contained"
              onClick={handleRetakeTest}
              startIcon={<ReplayIcon />}
              sx={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                fontWeight: 600,
                px: 4,
                py: 1.5,
                textTransform: 'none',
                borderRadius: 2,
                '&:hover': {
                  background: 'linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%)',
                }
              }}
            >
              Retake Test
            </Button>
          </Box>

          {/* Detailed Test Review Section */}
          <Card sx={{
            borderRadius: 3,
            border: '2px solid #e5e7eb',
            boxShadow: '0 8px 25px rgba(0, 0, 0, 0.1)',
            overflow: 'hidden'
          }}>
            <Box sx={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              p: 3,
              color: 'white'
            }}>
              <Typography variant="h5" fontWeight={700} gutterBottom>
                Detailed Review
              </Typography>
              <Typography variant="body1" sx={{ opacity: 0.9 }}>
                Review each question to understand your performance and learn from explanations
              </Typography>
            </Box>
            
            <CardContent sx={{ p: 3 }}>
              <Grid container spacing={2}>
                {reviewQuestions && reviewQuestions.map((question, index) => (
                  <Grid item xs={12} md={6} key={index}>
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1, duration: 0.3 }}
                    >
                      <Card 
                        sx={{ 
                          height: '100%',
                          border: '2px solid',
                          borderColor: question.isCorrect ? '#22c55e' : (question.selectedOption ? '#ef4444' : '#f59e0b'),
                          borderRadius: 2,
                          overflow: 'hidden',
                          boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                          position: 'relative',
                          '&::before': {
                            content: '""',
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '4px',
                            height: '100%',
                            backgroundColor: question.isCorrect ? '#22c55e' : (question.selectedOption ? '#ef4444' : '#f59e0b'),
                          }
                        }}
                      >
                        <CardContent sx={{ p: 2 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                            <Avatar sx={{
                              backgroundColor: question.isCorrect ? '#22c55e' : (question.selectedOption ? '#ef4444' : '#f59e0b'),
                              color: 'white',
                              width: 32,
                              height: 32,
                              mr: 1.5,
                              fontWeight: 600,
                              fontSize: '0.9rem'
                            }}>
                              {index + 1}
                            </Avatar>
                            <Box sx={{ flex: 1 }}>
                              <Typography variant="subtitle1" fontWeight={600} color="#1e293b">
                                Question {index + 1}
                              </Typography>
                              <Box sx={{ display: 'flex', gap: 1, mt: 0.5 }}>
                                {question.isCorrect ? (
                                  <Chip icon={<CheckCircleIcon />} label="Correct" color="success" size="small" />
                                ) : question.selectedOption ? (
                                  <Chip icon={<CancelIcon />} label="Incorrect" color="error" size="small" />
                                ) : (
                                  <Chip icon={<ErrorIcon />} label="Not Answered" color="warning" size="small" />
                                )}
                              </Box>
                            </Box>
                          </Box>

                          <Typography variant="body1" sx={{ mb: 2, fontWeight: 500, lineHeight: 1.5, color: '#374151' }}>
                            {question.text}
                          </Typography>

                          <Grid container spacing={1} sx={{ mb: 2 }}>
                            <Grid item xs={12}>
                              <Box sx={{ 
                                p: 2, 
                                border: '1px solid', 
                                borderColor: question.selectedOption ? 
                                  (question.isCorrect ? '#22c55e' : '#ef4444') : 
                                  '#f59e0b',
                                borderRadius: 1,
                                backgroundColor: question.selectedOption ? 
                                  (question.isCorrect ? '#f0fdf4' : '#fef2f2') : 
                                  '#fffbeb',
                              }}>
                                <Typography variant="caption" fontWeight={600} color="#1e293b">
                                  {question.selectedOption ? 
                                    (question.isCorrect ? '✅ Your Answer' : '❌ Your Answer') : 
                                    '⚠️ Your Answer'
                                  }
                                </Typography>
                                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                  {question.selectedOption || 'Not answered'}
                                </Typography>
                              </Box>
                            </Grid>
                            <Grid item xs={12}>
                              <Box sx={{ 
                                p: 2, 
                                border: '1px solid #22c55e',
                                borderRadius: 1,
                                backgroundColor: '#f0fdf4',
                              }}>
                                <Typography variant="caption" fontWeight={600} color="#1e293b">
                                  ✅ Correct Answer
                                </Typography>
                                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                  {question.correctOption}
                                </Typography>
                              </Box>
                            </Grid>
                          </Grid>

                          {question.explanation && (
                            <Box sx={{ 
                              p: 2, 
                              backgroundColor: '#eff6ff', 
                              borderRadius: 1,
                              border: '1px solid #3b82f6',
                              mb: 1
                            }}>
                              <Typography variant="caption" color="#1e40af" fontWeight={600}>
                                <InfoIcon sx={{ fontSize: 14, mr: 0.5, verticalAlign: 'middle' }} />
                                Explanation
                              </Typography>
                              <Typography variant="body2" color="#1e40af" sx={{ lineHeight: 1.4 }}>
                                {question.explanation}
                              </Typography>
                            </Box>
                          )}

                          {(question.category || question.grammarRule) && (
                            <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                              {question.category && (
                                <Chip 
                                  label={question.category.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())} 
                                  color="secondary" 
                                  size="small"
                                  variant="outlined"
                                />
                              )}
                              {question.grammarRule && (
                                <Chip 
                                  label={question.grammarRule} 
                                  color="info" 
                                  size="small"
                                  variant="outlined"
                                />
                              )}
                            </Box>
                          )}
                        </CardContent>
                      </Card>
                    </motion.div>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>
        </Container>
      </Box>
    );
  }

  // Show test interface
  const currentQuestion = questions[currentQuestionIndex];
  
  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#f8fafc' }}>
      {/* Fixed Header */}
      <Box sx={{ 
        position: 'sticky',
        top: 0,
        zIndex: 10,
        backgroundColor: 'white',
        borderBottom: '1px solid #e5e7eb',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
      }}>
        <Container maxWidth="xl" sx={{ py: 2 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={3}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar sx={{ backgroundColor: '#667eea', width: 40, height: 40 }}>
                  <QuizIcon />
                </Avatar>
                <Box>
                  <Typography variant="h6" fontWeight={600} color="#1e293b">
                    Grammar Test
                  </Typography>
                  <Typography variant="body2" color="#64748b">
                    {module.charAt(0).toUpperCase() + module.slice(1)} Level
                  </Typography>
                </Box>
              </Box>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="body1" fontWeight={600} color="#1e293b" gutterBottom>
                  Question {currentQuestionIndex + 1} of {questions.length}
                </Typography>
                <LinearProgress 
                  variant="determinate" 
                  value={getCompletionPercentage()} 
                  sx={{ 
                    height: 8, 
                    borderRadius: 4,
                    backgroundColor: '#e5e7eb',
                    '& .MuiLinearProgress-bar': {
                      backgroundColor: '#667eea',
                      borderRadius: 4
                    }
                  }} 
                />
                <Typography variant="body2" color="#6b7280" sx={{ mt: 1, mb: 2 }}>
                  {getCompletionPercentage().toFixed(0)}% Complete
                </Typography>
                
                {/* Navigation Buttons */}
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 1 }}>
                  <Button
                    variant="outlined"
                    onClick={handlePrevQuestion}
                    disabled={currentQuestionIndex === 0}
                    startIcon={<ArrowBackIcon />}
                    size="small"
                    sx={{
                      borderColor: '#667eea',
                      color: '#667eea',
                      fontWeight: 600,
                      px: 2,
                      py: 0.5,
                      textTransform: 'none',
                      borderRadius: 2,
                      fontSize: '0.8rem',
                      '&:hover': {
                        backgroundColor: 'rgba(102, 126, 234, 0.05)',
                        borderColor: '#667eea',
                      },
                      '&:disabled': {
                        borderColor: '#cbd5e1',
                        color: '#9ca3af'
                      }
                    }}
                  >
                    Previous
                  </Button>

                  {currentQuestionIndex === questions.length - 1 ? (
                    <Button
                      variant="contained"
                      onClick={handleTestComplete}
                      disabled={isSubmitting}
                      startIcon={isSubmitting ? <CircularProgress size={16} /> : <SendIcon />}
                      size="small"
                      sx={{
                        background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                        fontWeight: 600,
                        px: 2,
                        py: 0.5,
                        textTransform: 'none',
                        borderRadius: 2,
                        fontSize: '0.8rem',
                        '&:hover': {
                          background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
                        },
                        '&:disabled': {
                          background: '#9ca3af'
                        }
                      }}
                    >
                      {isSubmitting ? 'Submitting...' : 'Submit'}
                    </Button>
                  ) : (
                    <Button
                      variant="contained"
                      onClick={handleNextQuestion}
                      endIcon={<ArrowForwardIcon />}
                      size="small"
                      sx={{
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        fontWeight: 600,
                        px: 2,
                        py: 0.5,
                        textTransform: 'none',
                        borderRadius: 2,
                        fontSize: '0.8rem',
                        '&:hover': {
                          background: 'linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%)',
                        }
                      }}
                    >
                      Next
                    </Button>
                  )}
                </Box>
              </Box>
            </Grid>
            
            <Grid item xs={12} md={3}>
              <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                <Chip
                  icon={<TimerIcon />}
                  label={formatTime(testTimeLeft)}
                  color={testTimeLeft < 300 ? 'error' : 'primary'}
                  variant="filled"
                  sx={{ 
                    fontSize: '1.1rem',
                    fontWeight: 600,
                    py: 2.5,
                    px: 2,
                    animation: testTimeLeft < 300 ? 'pulse 1s infinite' : 'none',
                    '@keyframes pulse': {
                      '0%': { opacity: 1 },
                      '50%': { opacity: 0.7 },
                      '100%': { opacity: 1 }
                    }
                  }}
                />
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Grid container spacing={4}>
          {/* Question Panel */}
          <Grid item xs={12} lg={8}>
            {/* Question Card */}
            <Card sx={{
              borderRadius: 2,
              border: '2px solid #e5e7eb',
              backgroundColor: 'white',
              position: 'relative',
              overflow: 'hidden',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
              height: 'fit-content'
            }}>
              {/* Top indicator */}
              <Box
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: 6,
                  background: 'linear-gradient(90deg, #667eea, #764ba2)'
                }}
              />

              <CardContent sx={{ p: 3 }}>
                {/* Question Header */}
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Avatar sx={{
                    backgroundColor: '#667eea',
                    width: 40,
                    height: 40,
                    mr: 2,
                    fontSize: '1.1rem',
                    fontWeight: 600
                  }}>
                    {currentQuestionIndex + 1}
                  </Avatar>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="body2" color="#667eea" fontWeight={600} gutterBottom>
                      Question {currentQuestionIndex + 1} of {questions.length}
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                      {currentQuestion?.category && (
                        <Chip 
                          label={currentQuestion.category.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())} 
                          color="secondary" 
                          size="small"
                          variant="outlined"
                        />
                      )}
                      {currentQuestion?.grammarRule && (
                        <Chip 
                          label={currentQuestion.grammarRule} 
                          color="info" 
                          size="small"
                          variant="outlined"
                        />
                      )}
                    </Box>
                  </Box>
                </Box>

                {/* Question Text */}
                <Typography variant="h6" fontWeight={600} color="#1e293b" sx={{ mb: 3, lineHeight: 1.4 }}>
                  {currentQuestion?.questionText}
                </Typography>

                {currentQuestion?.imageUrl && (
                  <Box sx={{ mb: 2, textAlign: 'center' }}>
                    <CardMedia
                      component="img"
                      sx={{ 
                        maxWidth: 300, 
                        maxHeight: 200, 
                        mx: 'auto', 
                        borderRadius: 2,
                        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                      }}
                      image={getFullImageUrl(currentQuestion.imageUrl)}
                      alt="Question image"
                    />
                  </Box>
                )}

                {/* Answer Options */}
                <FormControl component="fieldset" fullWidth>
                  <Typography variant="body1" fontWeight={600} color="#1e293b" sx={{ mb: 2 }}>
                    Select your answer:
                  </Typography>
                  
                  <RadioGroup
                    value={answers[currentQuestionIndex] !== null ? answers[currentQuestionIndex] : ''}
                    onChange={(e) => handleAnswerSelect(currentQuestionIndex, parseInt(e.target.value))}
                  >
                    <Grid container spacing={1}>
                      {currentQuestion?.options.map((option, index) => (
                        <Grid item xs={12} key={index}>
                          <FormControlLabel
                            value={index}
                            control={<Radio color="primary" sx={{ display: 'none' }} />}
                            label={
                              <Box sx={{ 
                                width: '100%',
                                p: 2,
                                border: '2px solid',
                                borderColor: answers[currentQuestionIndex] === index ? '#667eea' : '#e5e7eb',
                                borderRadius: 2,
                                backgroundColor: answers[currentQuestionIndex] === index ? 'rgba(102, 126, 234, 0.08)' : 'white',
                                transition: 'all 0.2s ease',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: 1.5,
                                '&:hover': {
                                  backgroundColor: answers[currentQuestionIndex] === index ? 'rgba(102, 126, 234, 0.12)' : '#f8fafc',
                                  borderColor: answers[currentQuestionIndex] === index ? '#667eea' : '#cbd5e1',
                                  transform: 'translateY(-1px)',
                                  boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
                                }
                              }}>
                                <Avatar sx={{
                                  backgroundColor: answers[currentQuestionIndex] === index ? '#667eea' : '#e5e7eb',
                                  color: answers[currentQuestionIndex] === index ? 'white' : '#6b7280',
                                  width: 28,
                                  height: 28,
                                  fontSize: '0.9rem',
                                  fontWeight: 600
                                }}>
                                  {String.fromCharCode(65 + index)}
                                </Avatar>
                                <Typography variant="body1" sx={{ fontWeight: 500, color: '#1e293b', flex: 1 }}>
                                  {option}
                                </Typography>
                                {answers[currentQuestionIndex] === index && (
                                  <CheckIcon sx={{ color: '#667eea', fontSize: '1.2rem' }} />
                                )}
                              </Box>
                            }
                            sx={{ 
                              width: '100%',
                              ml: 0,
                              mr: 0
                            }}
                          />
                        </Grid>
                      ))}
                    </Grid>
                  </RadioGroup>
                </FormControl>
              </CardContent>
            </Card>


          </Grid>

          {/* Question Navigator Sidebar */}
          <Grid item xs={12} lg={4}>
            <Card sx={{
              position: 'sticky',
              top: 100,
              borderRadius: 2,
              border: '2px solid #e5e7eb',
              backgroundColor: 'white',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)'
            }}>
              <CardContent sx={{ p: 2 }}>
                <Typography variant="subtitle1" fontWeight={600} color="#1e293b" gutterBottom>
                  Question Navigator
                </Typography>
                <Typography variant="caption" color="#64748b" sx={{ mb: 2, display: 'block' }}>
                  Click any number to jump to that question
                </Typography>

                <Grid container spacing={0.5}>
                  {questions.map((_, index) => (
                    <Grid item xs={3} key={index}>
                      <Button
                        variant={index === currentQuestionIndex ? 'contained' : 'outlined'}
                        onClick={() => setCurrentQuestionIndex(index)}
                        sx={{
                          width: '100%',
                          height: 36,
                          borderRadius: 1,
                          fontWeight: 600,
                          fontSize: '0.8rem',
                          minWidth: 'unset',
                          backgroundColor: 
                            index === currentQuestionIndex ? '#667eea' :
                            answers[index] !== null ? 'rgba(34, 197, 94, 0.1)' : 'white',
                          borderColor: 
                            index === currentQuestionIndex ? '#667eea' :
                            answers[index] !== null ? '#22c55e' : '#e5e7eb',
                          color: 
                            index === currentQuestionIndex ? 'white' :
                            answers[index] !== null ? '#22c55e' : '#6b7280',
                          '&:hover': {
                            backgroundColor: 
                              index === currentQuestionIndex ? '#5a67d8' :
                              answers[index] !== null ? 'rgba(34, 197, 94, 0.2)' : '#f8fafc',
                            borderColor: 
                              index === currentQuestionIndex ? '#5a67d8' :
                              answers[index] !== null ? '#22c55e' : '#cbd5e1'
                          }
                        }}
                      >
                        {index + 1}
                      </Button>
                    </Grid>
                  ))}
                </Grid>

                <Box sx={{ mt: 2, p: 2, backgroundColor: '#f8fafc', borderRadius: 1 }}>
                  <Typography variant="caption" fontWeight={600} color="#1e293b" gutterBottom>
                    Legend:
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Box sx={{ width: 12, height: 12, backgroundColor: '#667eea', borderRadius: 0.5 }} />
                      <Typography variant="caption" color="#64748b">Current</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Box sx={{ width: 12, height: 12, backgroundColor: '#22c55e', borderRadius: 0.5 }} />
                      <Typography variant="caption" color="#64748b">Answered</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Box sx={{ width: 12, height: 12, border: '1px solid #e5e7eb', borderRadius: 0.5 }} />
                      <Typography variant="caption" color="#64748b">Not Answered</Typography>
                    </Box>
                  </Box>
                </Box>

                <Box sx={{ mt: 2, p: 2, backgroundColor: '#fef3c7', borderRadius: 1, border: '1px solid #fbbf24' }}>
                  <Typography variant="caption" fontWeight={600} color="#92400e" gutterBottom>
                    💡 Pro Tip
                  </Typography>
                  <Typography variant="caption" color="#92400e">
                    Review all questions before submitting.
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}

export default GrammarTest; 