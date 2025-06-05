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
  DialogTitle
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
  Error as ErrorIcon
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
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography variant="h4" gutterBottom align="center" color="primary">
            📝 Grammar Test - {module.charAt(0).toUpperCase() + module.slice(1)} Level
          </Typography>
          {topicNumber && (
            <Typography variant="h6" gutterBottom align="center" color="text.secondary">
              Topic {topicNumber}
            </Typography>
          )}
          
          <Divider sx={{ my: 3 }} />
          
          <Typography variant="h6" gutterBottom>
            📋 Test Instructions:
          </Typography>
          
          <Box component="ul" sx={{ pl: 3, mb: 3 }}>
            <Typography component="li" sx={{ mb: 1 }}>
              You will have <strong>20 minutes</strong> to complete this grammar test
            </Typography>
            <Typography component="li" sx={{ mb: 1 }}>
              The test contains <strong>{questions.length} questions</strong> from {module} grammar topics
            </Typography>
            <Typography component="li" sx={{ mb: 1 }}>
              Each question has 4 options - choose the best answer
            </Typography>
            <Typography component="li" sx={{ mb: 1 }}>
              You can navigate between questions using Next/Previous buttons
            </Typography>
            <Typography component="li" sx={{ mb: 1 }}>
              The test will auto-submit when time is up
            </Typography>
            <Typography component="li" sx={{ mb: 1 }}>
              Your progress will be saved and you'll see detailed results at the end
            </Typography>
          </Box>

          <Alert severity="info" sx={{ mb: 3 }}>
            Make sure you have a stable internet connection before starting the test.
          </Alert>

          <Box sx={{ textAlign: 'center' }}>
            <Button
              variant="contained"
              size="large"
              onClick={handleStartTest}
              sx={{ px: 4, py: 1.5, fontSize: '1.1rem' }}
            >
              Start Grammar Test
            </Button>
            <Box sx={{ mt: 2 }}>
              <Button variant="text" onClick={handleGoBack} startIcon={<ArrowBackIcon />}>
                Back to Grammar
              </Button>
            </Box>
          </Box>
        </Paper>
      </Container>
    );
  }

  // Show test results
  if (testCompleted && results) {
    const { score, performanceMetrics, questions: reviewQuestions } = results;
    const passed = score >= 70;

    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Paper elevation={3} sx={{ p: 4 }}>
            <Box sx={{ textAlign: 'center', mb: 4 }}>
              <Typography variant="h4" gutterBottom>
                {passed ? '🎉 Congratulations!' : '📚 Keep Learning!'}
              </Typography>
              <Typography variant="h5" color={passed ? 'success.main' : 'warning.main'}>
                Your Score: {score.toFixed(1)}%
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
                {module.charAt(0).toUpperCase() + module.slice(1)} Grammar Test
                {topicNumber && ` - Topic ${topicNumber}`}
              </Typography>
            </Box>

            <Grid container spacing={3} sx={{ mb: 4 }}>
              <Grid item xs={6} md={3}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" color="success.main">
                    {performanceMetrics.correctAnswers}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Correct
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={6} md={3}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" color="error.main">
                    {performanceMetrics.incorrectAnswers}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Incorrect
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={6} md={3}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" color="warning.main">
                    {performanceMetrics.unanswered}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Unanswered
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={6} md={3}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" color="info.main">
                    {formatTime(timeSpent)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Time Taken
                  </Typography>
                </Box>
              </Grid>
            </Grid>

            {/* Detailed Test Review Section */}
            <Divider sx={{ my: 4 }}>
              <Typography variant="h6" color="primary">
                📝 Test Review
              </Typography>
            </Divider>

            <Typography variant="body2" color="text.secondary" sx={{ mb: 3, textAlign: 'center' }}>
              Review each question to understand your performance and learn from explanations
            </Typography>

            {reviewQuestions && reviewQuestions.map((question, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1, duration: 0.3 }}
              >
                <Paper 
                  elevation={1} 
                  sx={{ 
                    p: 3, 
                    mb: 3, 
                    border: '2px solid',
                    borderColor: question.isCorrect ? 'success.main' : (question.selectedOption ? 'error.main' : 'warning.main'),
                    borderRadius: 2,
                    position: 'relative',
                    overflow: 'hidden',
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '4px',
                      height: '100%',
                      backgroundColor: question.isCorrect ? 'success.main' : (question.selectedOption ? 'error.main' : 'warning.main'),
                    }
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h6" sx={{ mr: 2 }}>
                      Question {index + 1}
                    </Typography>
                    {question.isCorrect ? (
                      <Chip icon={<CheckCircleIcon />} label="Correct" color="success" size="small" />
                    ) : question.selectedOption ? (
                      <Chip icon={<CancelIcon />} label="Incorrect" color="error" size="small" />
                    ) : (
                      <Chip icon={<ErrorIcon />} label="Not Answered" color="warning" size="small" />
                    )}
                    <Box sx={{ ml: 'auto' }}>
                      <Chip 
                        label={`Time: ${formatTime(question.timeSpent || 0)}`} 
                        variant="outlined" 
                        size="small" 
                      />
                    </Box>
                  </Box>

                  <Typography variant="body1" sx={{ mb: 3, fontWeight: 500, lineHeight: 1.6 }}>
                    {question.text}
                  </Typography>

                  <Grid container spacing={2} sx={{ mb: 3 }}>
                    <Grid item xs={12} md={6}>
                      <Box sx={{ 
                        p: 2, 
                        border: '1px solid', 
                        borderColor: question.selectedOption ? 
                          (question.isCorrect ? 'success.main' : 'error.main') : 
                          'warning.main',
                        borderRadius: 1,
                        backgroundColor: question.selectedOption ? 
                          (question.isCorrect ? 'success.50' : 'error.50') : 
                          'warning.50',
                        transition: 'all 0.2s ease'
                      }}>
                        <Typography variant="subtitle2" gutterBottom fontWeight="bold">
                          {question.selectedOption ? 
                            (question.isCorrect ? '✅ Your Answer:' : '❌ Your Answer:') : 
                            '⚠️ Your Answer:'
                          }
                        </Typography>
                        <Typography variant="body1">
                          {question.selectedOption || 'Not answered'}
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Box sx={{ 
                        p: 2, 
                        border: '1px solid', 
                        borderColor: 'success.main',
                        borderRadius: 1,
                        backgroundColor: 'success.50',
                        transition: 'all 0.2s ease'
                      }}>
                        <Typography variant="subtitle2" gutterBottom fontWeight="bold">
                          ✅ Correct Answer:
                        </Typography>
                        <Typography variant="body1">
                          {question.correctOption}
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>

                  {question.explanation && (
                    <Box sx={{ 
                      p: 2, 
                      backgroundColor: 'info.50', 
                      borderRadius: 1,
                      border: '1px solid',
                      borderColor: 'info.main',
                      transition: 'all 0.2s ease'
                    }}>
                      <Typography variant="subtitle2" gutterBottom color="info.dark" fontWeight="bold">
                        <InfoIcon sx={{ fontSize: 16, mr: 1, verticalAlign: 'middle' }} />
                        Explanation:
                      </Typography>
                      <Typography variant="body2" color="info.dark" sx={{ lineHeight: 1.6 }}>
                        {question.explanation}
                      </Typography>
                    </Box>
                  )}

                  {/* Show grammar rule and category if available */}
                  {(question.category || question.grammarRule) && (
                    <Box sx={{ mt: 2, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                      {question.category && (
                        <Chip 
                          label={`Category: ${question.category.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}`} 
                          color="secondary" 
                          size="small"
                          variant="outlined"
                        />
                      )}
                      {question.grammarRule && (
                        <Chip 
                          label={`Rule: ${question.grammarRule}`} 
                          color="info" 
                          size="small"
                          variant="outlined"
                        />
                      )}
                    </Box>
                  )}
                </Paper>
              </motion.div>
            ))}

            <Box sx={{ textAlign: 'center', mt: 4 }}>
              <Button
                variant="contained"
                onClick={handleRetakeTest}
                startIcon={<ReplayIcon />}
                sx={{ mr: 2 }}
              >
                Retake Test
              </Button>
              <Button variant="outlined" onClick={handleGoBack}>
                Back to Grammar
              </Button>
            </Box>
          </Paper>
        </motion.div>
      </Container>
    );
  }

  // Show test interface
  const currentQuestion = questions[currentQuestionIndex];
  
  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 2, mb: 4 }}>
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h5" color="primary">
            Grammar Test - {module.charAt(0).toUpperCase() + module.slice(1)}
          </Typography>
          <Chip
            icon={<TimerIcon />}
            label={formatTime(testTimeLeft)}
            color={testTimeLeft < 300 ? 'error' : 'primary'}
            variant="outlined"
          />
        </Box>

        {/* Progress Bar */}
        <Box sx={{ mb: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
            <Typography variant="body2" color="text.secondary">
              Question {currentQuestionIndex + 1} of {questions.length}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {getCompletionPercentage().toFixed(0)}% Complete
            </Typography>
          </Box>
          <LinearProgress variant="determinate" value={getCompletionPercentage()} sx={{ height: 8, borderRadius: 4 }} />
        </Box>

        {/* Question Card */}
        <Paper elevation={2} sx={{ p: 4, mb: 3 }}>
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" sx={{ mb: 2, lineHeight: 1.6 }}>
              {currentQuestion?.questionText}
            </Typography>
            
            {currentQuestion?.category && (
              <Chip 
                label={currentQuestion.category.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())} 
                color="secondary" 
                size="small"
                sx={{ mr: 1 }}
              />
            )}
            
            {currentQuestion?.grammarRule && (
              <Chip 
                label={currentQuestion.grammarRule} 
                color="info" 
                size="small"
              />
            )}
          </Box>

          {currentQuestion?.imageUrl && (
            <Box sx={{ mb: 3, textAlign: 'center' }}>
              <CardMedia
                component="img"
                sx={{ maxWidth: 400, maxHeight: 300, mx: 'auto', borderRadius: 1 }}
                image={getFullImageUrl(currentQuestion.imageUrl)}
                alt="Question image"
              />
            </Box>
          )}

          <FormControl component="fieldset" fullWidth>
            <RadioGroup
              value={answers[currentQuestionIndex] !== null ? answers[currentQuestionIndex] : ''}
              onChange={(e) => handleAnswerSelect(currentQuestionIndex, parseInt(e.target.value))}
            >
              {currentQuestion?.options.map((option, index) => (
                <FormControlLabel
                  key={index}
                  value={index}
                  control={<Radio />}
                  label={
                    <Typography variant="body1" sx={{ py: 0.5 }}>
                      {option}
                    </Typography>
                  }
                  sx={{
                    mb: 1,
                    ml: 0,
                    p: 2,
                    border: '1px solid',
                    borderColor: answers[currentQuestionIndex] === index ? 'primary.main' : 'grey.300',
                    borderRadius: 1,
                    backgroundColor: answers[currentQuestionIndex] === index ? 'primary.50' : 'transparent',
                    '&:hover': {
                      backgroundColor: 'grey.50',
                    },
                  }}
                />
              ))}
            </RadioGroup>
          </FormControl>
        </Paper>

        {/* Navigation Buttons */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Button
            variant="outlined"
            onClick={handlePrevQuestion}
            disabled={currentQuestionIndex === 0}
            startIcon={<ArrowBackIcon />}
          >
            Previous
          </Button>

          <Box sx={{ display: 'flex', gap: 2 }}>
            {currentQuestionIndex === questions.length - 1 ? (
              <Button
                variant="contained"
                color="success"
                onClick={handleTestComplete}
                disabled={isSubmitting}
                startIcon={isSubmitting ? <CircularProgress size={20} /> : <SendIcon />}
              >
                {isSubmitting ? 'Submitting...' : 'Submit Test'}
              </Button>
            ) : (
              <Button
                variant="contained"
                onClick={handleNextQuestion}
                endIcon={<ArrowForwardIcon />}
              >
                Next
              </Button>
            )}
          </Box>
        </Box>
      </Box>
    </Container>
  );
}

export default GrammarTest; 