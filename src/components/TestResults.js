import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  Paper,
  Divider,
  Grid,
  Chip,
  Container,
  CircularProgress,
  TableContainer,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Card,
  CardContent,
  Alert
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Timer as TimerIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Replay as ReplayIcon,
  ArrowForward as ArrowForwardIcon,
  Error as ErrorIcon
} from '@mui/icons-material';
import axiosInstance from './axios-config';

function TestResults() {
  const { testId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [testData, setTestData] = useState(null);

  useEffect(() => {
    const fetchTestResult = async () => {
      try {
        setLoading(true);
        console.log('TestResults component mounted with testId:', testId);
        
        // First, check sessionStorage for the last test result
        const savedTestData = sessionStorage.getItem('lastTestResult');
        if (savedTestData) {
          try {
            const parsedData = JSON.parse(savedTestData);
            // Verify this is the test we're looking for
            if (parsedData.testId === testId || parsedData._id === testId) {
              console.log('Retrieved test result from session storage:', parsedData);
              setTestData(parsedData);
              setLoading(false);
              return;
            }
          } catch (parseError) {
            console.error('Error parsing saved test data:', parseError);
            // Continue to API fetch if parse fails
          }
        }
        
        // If not in sessionStorage or ID doesn't match, try the API
        const token = localStorage.getItem('token');
        if (!token) {
          setError('Authentication token not found. Please log in again.');
          setLoading(false);
          return;
        }

        try {
          const response = await axiosInstance.get(`/student/test-history/${testId}`);
          console.log('Fetched test result:', response.data);
          setTestData(response.data);
        } catch (err) {
          console.error('Error fetching test result:', err);
          setError('Failed to load test result. Please try again later.');
          // For development: Use mockup data if API fails
          console.log('Loading mock data for test result');
          setTestData({
            _id: testId,
            subject: 'Physics',
            stage: '1',
            level: '3',
            score: 78,
            totalQuestions: 45,
            correctAnswers: 35,
            timeTaken: 2400, // 40 minutes
            passedLevel: true,
            date: new Date().toISOString(),
            questions: Array(45).fill(null).map((_, i) => ({
              id: `q${i}`,
              questionText: `Sample question ${i+1}?`,
              selectedOption: ['A', 'B', 'C', 'D'][Math.floor(Math.random() * 4)],
              correctOption: ['A', 'B', 'C', 'D'][Math.floor(Math.random() * 4)],
              isCorrect: Math.random() > 0.3,
              timeSpent: Math.floor(Math.random() * 90) + 20,
              allocatedTime: 60,
              explanation: 'This is a sample explanation for this question.'
            }))
          });
        }
      } finally {
        setLoading(false);
      }
    };

    fetchTestResult();
  }, [testId]);

  const handleGoBack = () => {
    navigate(-1);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
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
      }}>
        <Paper elevation={2} sx={{ p: 3, maxWidth: 400, width: '100%', textAlign: 'center' }}>
          <CircularProgress sx={{ mb: 2 }} size={30} />
          <Typography variant="h6" gutterBottom sx={{ fontSize: '1.1rem' }}>
            Loading Results
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.8rem' }}>
            Please wait while we retrieve your test results...
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
      }}>
        <Paper elevation={2} sx={{ p: 3, maxWidth: 450, width: '100%', textAlign: 'center' }}>
          <ErrorIcon color="error" sx={{ fontSize: 50, mb: 1.5 }} />
          <Typography variant="h6" gutterBottom color="error">
            Error Loading Results
          </Typography>
          <Typography variant="body1" sx={{ mb: 2.5 }}>
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

  if (!testData) {
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
      }}>
        <Paper elevation={2} sx={{ p: 3, maxWidth: 450, width: '100%', textAlign: 'center' }}>
          <Alert severity="warning" sx={{ mb: 2 }}>
            Test result not found
          </Alert>
          <Button 
            variant="contained" 
            onClick={handleGoBack} 
            startIcon={<ArrowBackIcon />}
          >
            Go Back
          </Button>
        </Paper>
      </Box>
    );
  }

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
            background: testData.score >= 70 ? 
              'linear-gradient(to right, #4caf50, #81c784)' : 
              'linear-gradient(to right, #ff9800, #ffb74d)',
            color: 'white'
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            {testData.score >= 70 ? (
              <CheckCircleIcon sx={{ fontSize: 40, mr: 2 }} />
            ) : (
              <ErrorIcon sx={{ fontSize: 40, mr: 2 }} />
            )}
            <Typography variant="h4" fontWeight="bold">
              {testData.score >= 70 ? 'Test Passed!' : 'Test Completed'}
            </Typography>
          </Box>
          
          <Typography variant="h6" sx={{ opacity: 0.9, mb: 3 }}>
            {testData.score >= 70 
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
                  {testData.score}%
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.8 }}>
                  {testData.correctAnswers} of {testData.totalQuestions} questions answered correctly
                </Typography>
              </Box>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="overline" sx={{ opacity: 0.8, letterSpacing: 1 }}>
                  RESULT
                </Typography>
                <Typography variant="h2" fontWeight="bold" sx={{ my: 1 }}>
                  {testData.passedLevel ? 'PASS' : 'FAIL'}
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.8 }}>
                  {testData.passedLevel 
                    ? `You earned ${testData.leaderboardPoints || 25} points` 
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
                  {Math.floor(testData.timeTaken / 60)}:{(testData.timeTaken % 60).toString().padStart(2, '0')}
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.8 }}>
                  Avg. {Math.round(testData.timeTaken / testData.totalQuestions)} seconds per question
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
                {testData.questions && testData.questions.map((question, index) => {
                  const questionId = question._id || question.id;
                  const timeSpent = question.timeSpent || 0;
                  const allocatedTime = 60; // Default 60 seconds per question
                  const isCorrect = question.isCorrect;
                  
                  // Calculate percentage of allocated time
                  const percentage = Math.min(100, (timeSpent / allocatedTime) * 100);
                  
                  // Determine color based on correctness and time
                  let color = '#f44336'; // Red for incorrect
                  if (isCorrect) {
                    color = timeSpent > allocatedTime ? '#ff9800' : '#4caf50'; // Orange for overtime, green for on time
                  }
                  
                  return (
                    <Grid item xs={12} key={questionId || index} sx={{ mb: 1 }}>
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
            {testData.questions && testData.questions.map((question, index) => {
              const questionId = question._id || question.id;
              const selectedOption = question.selectedOption || '';
              const isCorrect = question.isCorrect;
              
              return (
                <Grid item xs={12} md={6} key={questionId || index}>
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
                        label={`${question.timeSpent || 0} seconds`}
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
                          {testData.subject.toUpperCase()} • LEVEL {testData.level}
                        </Typography>
                        <Typography variant="h5" sx={{ fontWeight: 'medium', mb: 3, fontSize: '0.95rem' }}>
                          {question.questionText || question.question || "Loading question..."}
                        </Typography>
                      </Box>
                      
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
                            
                            return (
                              <Paper
                                key={option}
                                elevation={0}
                                sx={{
                                  p: 1.5,
                                  border: '1.5px solid',
                                  borderColor: isCorrectOption ? 'success.main' : 
                                              isUserSelected ? 'primary.main' : 
                                              '#e0e0e0',
                                  borderRadius: 1.5,
                                  bgcolor: isCorrectOption ? 'rgba(76, 175, 80, 0.1)' : 
                                          isUserSelected ? 'rgba(33, 150, 243, 0.1)' : 
                                          'white',
                                  cursor: 'default',
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
                      {question.explanation && (
                        <Box sx={{ mt: 'auto', pt: 1 }}>
                          <Typography variant="body2" fontWeight="bold" color="text.secondary">
                            Explanation:
                          </Typography>
                          <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.9rem' }}>
                            {question.explanation}
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
          
          {!testData.passedLevel && (
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
          
          {testData.passedLevel && (
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

export default TestResults; 