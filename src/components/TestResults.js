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
  Error as ErrorIcon,
  QuestionAnswer as QuestionAnswerIcon
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
            let parsedData = JSON.parse(savedTestData);
            
            // Add validation for required fields
            if (!parsedData.score) parsedData.score = 0;
            if (!parsedData.totalQuestions) parsedData.totalQuestions = 0;
            if (!parsedData.correctAnswers) parsedData.correctAnswers = 0;
            if (!parsedData.timeTaken) parsedData.timeTaken = 0;
            if (!parsedData.subject) parsedData.subject = 'General';
            if (!parsedData.level) parsedData.level = '1';
            
            // Verify this is the test we're looking for
            if (parsedData.testId === testId || parsedData._id === testId) {
              console.log('Retrieved test result from session storage:', parsedData);
              
              // Debug the questions data
              if (parsedData.questions && parsedData.questions.length > 0) {
                console.log(`First question sample - explanation: "${parsedData.questions[0].explanation}"`);
                console.log(`First question sample - allocatedTime: ${parsedData.questions[0].allocatedTime}`);
                
                // Log how many questions have explanations
                const questionsWithExplanations = parsedData.questions.filter(q => q.explanation && q.explanation.trim() !== '').length;
                console.log(`Questions with explanations: ${questionsWithExplanations}/${parsedData.questions.length}`);
                
                // Log all explanations and their types
                parsedData.questions.forEach((q, i) => {
                  console.log(`Question ${i + 1} explanation:`, 
                    q.explanation, 
                    `(type: ${typeof q.explanation}, length: ${q.explanation ? q.explanation.length : 0})`
                  );
                });
                
                // Log all keys in the first question object
                console.log('First question keys:', Object.keys(parsedData.questions[0]));
              } else {
                // Create empty questions array if it doesn't exist
                parsedData.questions = [];
              }
              
              // Process the questions to ensure they have the right format
              parsedData.questions = processQuestions(parsedData.questions);
              
              // Recalculate score based on correct answers
              const correctCount = parsedData.questions.filter(q => q.isCorrect).length;
              const totalCount = parsedData.questions.length;
              if (totalCount > 0) {
                parsedData.correctAnswers = correctCount;
                parsedData.totalQuestions = totalCount;
                parsedData.score = Math.round((correctCount / totalCount) * 100);
                parsedData.passedLevel = parsedData.score >= 70;
              }
              
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
          
          let responseData = response.data;
          
          // Add validation for required fields
          if (!responseData.score) responseData.score = 0;
          if (!responseData.totalQuestions) responseData.totalQuestions = 0;
          if (!responseData.correctAnswers) responseData.correctAnswers = 0;
          if (!responseData.timeTaken) responseData.timeTaken = 0;
          if (!responseData.subject) responseData.subject = 'General';
          if (!responseData.level) responseData.level = '1';
          
          // Process the questions to ensure they have the right format
          if (responseData && responseData.questions) {
            responseData.questions = processQuestions(responseData.questions);
            
            // Recalculate score based on correct answers
            const correctCount = responseData.questions.filter(q => q.isCorrect).length;
            const totalCount = responseData.questions.length;
            if (totalCount > 0) {
              responseData.correctAnswers = correctCount;
              responseData.totalQuestions = totalCount;
              responseData.score = Math.round((correctCount / totalCount) * 100);
              responseData.passedLevel = responseData.score >= 70;
            }
          } else {
            responseData.questions = [];
          }
          
          setTestData(responseData);
        } catch (err) {
          console.error('Error fetching test result:', err);
          setError('Failed to load test result. Please try again later.');
          // For development: Use mockup data if API fails
          console.log('Loading mock data for test result');
          const mockData = {
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
          };
          mockData.questions = processQuestions(mockData.questions);
          setTestData(mockData);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchTestResult();
  }, [testId]);

  // Update the processQuestions function to be more robust
  const processQuestions = (questions) => {
    if (!questions || !Array.isArray(questions) || questions.length === 0) {
      console.log('No questions data available or invalid questions format');
      // Return at least one placeholder question to avoid empty display
      return [{
        id: 'placeholder',
        questionText: 'No questions available for this test',
        isCorrect: false,
        timeSpent: 0,
        allocatedTime: 60,
        options: ['Option A', 'Option B', 'Option C', 'Option D'],
        selectedOption: '',
        correctOption: 'A',
        explanation: 'This test does not have any questions to review.'
      }];
    }
    
    return questions.map((q, index) => {
      // Skip if the question is null or undefined
      if (!q) {
        return {
          id: `missing-${index}`,
          questionText: `Question ${index + 1} (missing data)`,
          isCorrect: false,
          timeSpent: 0,
          allocatedTime: 60,
          options: ['Option A', 'Option B', 'Option C', 'Option D'],
          selectedOption: '',
          correctOption: 'A',
          explanation: 'No data available for this question.'
        };
      }
      
      // Create a deep copy of the question to avoid modifying original data
      const processedQ = {...q};
      
      // Set defaults for missing properties
      if (typeof processedQ.isCorrect !== 'boolean') {
        processedQ.isCorrect = processedQ.selectedOption === processedQ.correctOption;
      }
      
      if (!processedQ.timeSpent && processedQ.timeSpent !== 0) processedQ.timeSpent = 30;
      if (!processedQ.allocatedTime) processedQ.allocatedTime = 60;
      
      // Process question text
      processedQ.questionText = q.questionText || q.text || q.question || `Question ${index + 1}`;
      
      // Process options
      let options = [];
      
      // Try different formats for options
      if (q.options && Array.isArray(q.options)) {
        options = [...q.options];
      } else if (q.options && typeof q.options === 'object') {
        options = [
          q.options.A || q.options.a || q.options.optionA || q.options['0'] || '',
          q.options.B || q.options.b || q.options.optionB || q.options['1'] || '',
          q.options.C || q.options.c || q.options.optionC || q.options['2'] || '',
          q.options.D || q.options.d || q.options.optionD || q.options['3'] || ''
        ];
      } else if (q.optionA || q.optionB || q.optionC || q.optionD) {
        options = [q.optionA || '', q.optionB || '', q.optionC || '', q.optionD || ''];
      } else if (q.option1 || q.option2 || q.option3 || q.option4) {
        options = [q.option1 || '', q.option2 || '', q.option3 || '', q.option4 || ''];
      }
      
      // Ensure we have 4 options with fallbacks
      if (!options || options.length < 4) {
        const existing = options || [];
        options = existing.concat(Array(4 - existing.length).fill('')
          .map((_, i) => `Option ${String.fromCharCode(65 + i + existing.length)}`));
      }
      
      // Process the options to handle empty or undefined values
      options = options.map((opt, i) => {
        if (!opt && opt !== 0) {
          return `Option ${String.fromCharCode(65 + i)}`;
        }
        return opt;
      });
      
      processedQ.options = options;
      
      // Process correctOption to ensure it's in letter format (A, B, C, D)
      if (q.correctOption !== undefined) {
        if (typeof q.correctOption === 'string' && q.correctOption.match(/^[A-D]$/i)) {
          processedQ.correctOption = q.correctOption.toUpperCase();
        } else if (typeof q.correctOption === 'number') {
          processedQ.correctOption = String.fromCharCode(65 + (q.correctOption % 4));
        }
      } else if (q.correctAnswer !== undefined) {
        if (typeof q.correctAnswer === 'string' && q.correctAnswer.match(/^[A-D]$/i)) {
          processedQ.correctOption = q.correctAnswer.toUpperCase();
        } else if (typeof q.correctAnswer === 'number') {
          processedQ.correctOption = String.fromCharCode(65 + (q.correctAnswer % 4));
        }
      } else {
        processedQ.correctOption = 'A';  // Default
      }
      
      // Process selectedOption to ensure it's in letter format (A, B, C, D)
      if (q.selectedOption !== undefined) {
        if (typeof q.selectedOption === 'string' && q.selectedOption.match(/^[A-D]$/i)) {
          processedQ.selectedOption = q.selectedOption.toUpperCase();
        } else if (typeof q.selectedOption === 'number') {
          processedQ.selectedOption = String.fromCharCode(65 + (q.selectedOption % 4));
        }
      } else {
        processedQ.selectedOption = '';  // Default to empty if not selected
      }
      
      // Ensure explanation exists
      if (!processedQ.explanation) {
        processedQ.explanation = 'No explanation provided for this question.';
      }
      
      return processedQ;
    });
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAskAI = (question) => {
    // Store the question in sessionStorage to be retrieved by AI chat
    sessionStorage.setItem('aiChatQuestion', JSON.stringify({
      questionText: question.questionText,
      options: question.options,
      correctOption: question.correctOption,
      selectedOption: question.selectedOption,
      explanation: question.explanation
    }));
    
    // Navigate to the AI Help page with the correct path (using hyphen)
    navigate('/student-dashboard/ai-help');
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
                  {testData.score ? `${testData.score}%` : '0%'}
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.8 }}>
                  {testData.correctAnswers || 0} of {testData.totalQuestions || 0} questions answered correctly
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
                  {testData.timeTaken ? 
                    `${Math.floor(testData.timeTaken / 60)}:${(testData.timeTaken % 60).toString().padStart(2, '0')}` : 
                    '00:00'}
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.8 }}>
                  {testData.timeTaken && testData.totalQuestions ? 
                    `Avg. ${Math.round(testData.timeTaken / testData.totalQuestions)} seconds per question` :
                    'No time data available'}
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
              This chart shows how much time you spent on each question compared to the allocated time for each question.
            </Typography>
            
            <Box sx={{ height: 'auto', width: '100%', mb: 4, mt: 3 }}>
              <Grid container spacing={2}>
                {testData.questions && testData.questions.map((question, index) => {
                  const questionId = question._id || question.id;
                  const timeSpent = question.timeSpent || 0;
                  const allocatedTime = question.allocatedTime || 60; // Use question's allocatedTime if available
                  const isCorrect = question.isCorrect;
                  
                  // Calculate percentage of allocated time
                  const percentage = Math.min(100, (timeSpent / allocatedTime) * 100);
                  
                  // Determine color based on correctness and time
                  let color = '#f44336'; // Red for incorrect
                  let statusText = "Incorrect";
                  let statusColor = "error";
                  
                  if (isCorrect) {
                    if (timeSpent > allocatedTime) {
                      color = '#ff9800'; // Orange for overtime but correct
                      statusText = "Correct (Overtime)";
                      statusColor = "warning";
                    } else {
                      color = '#4caf50'; // Green for correct and on time
                      statusText = "Correct";
                      statusColor = "success";
                    }
                  }
                  
                  return (
                    <Grid item xs={12} md={6} key={questionId || index}>
                      <Paper elevation={0} sx={{ 
                        p: 2, 
                        border: '1px solid', 
                        borderColor: 'divider',
                        borderRadius: 2,
                        transition: 'all 0.2s',
                        '&:hover': {
                          boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                          transform: 'translateY(-2px)'
                        }
                      }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                          <Typography variant="subtitle1" fontWeight="bold">
                            Question {index + 1}
                          </Typography>
                          <Chip 
                            size="small" 
                            label={statusText}
                            color={statusColor}
                          />
                        </Box>
                        
                        <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', mt: 2, mb: 1 }}>
                          <Box sx={{ 
                            flexGrow: 1, 
                            bgcolor: 'rgba(0,0,0,0.05)', 
                            height: 16, 
                            borderRadius: 8, 
                            overflow: 'hidden',
                            position: 'relative'
                          }}>
                            {/* Allocated time marker */}
                            <Box sx={{
                              position: 'absolute',
                              top: 0,
                              bottom: 0,
                              left: `${100}%`,
                              width: 2,
                              bgcolor: 'divider',
                              zIndex: 2
                            }} />
                            
                            {/* Time spent bar */}
                            <Box
                              sx={{ 
                                width: `${percentage}%`,
                                bgcolor: color,
                                height: '100%',
                                transition: 'width 0.5s ease-in-out',
                                position: 'relative',
                                borderRadius: 8
                              }}
                            />
                    </Box>
                  </Box>
                        
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                            0s
                          </Typography>
                          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                            Time spent: <strong>{timeSpent}s</strong> / {allocatedTime}s
                          </Typography>
                        </Box>
                      </Paper>
                    </Grid>
                  );
                })}
                </Grid>
            </Box>
            
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'center', 
              gap: 3, 
              flexWrap: 'wrap', 
              p: 2,
              bgcolor: 'background.paper',
              borderRadius: 2,
              border: '1px dashed',
              borderColor: 'divider'
            }}>
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
                          {question.questionText || "Question text not available"}
                        </Typography>
                      </Box>
                      
                      {/* Answer Options */}
                      <Box sx={{ mb: 3 }}>
                        <Typography variant="body2" fontWeight="bold" sx={{ mb: 1 }}>
                          Answer Options:
                </Typography>

                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  {['A', 'B', 'C', 'D'].map((option, optIndex) => {
                            const isUserSelected = selectedOption === option;
                            const isCorrectOption = question.correctOption === option;
                            
                            let optionText = '';
                            
                            // Get option text from various possible formats
                            if (question.options && Array.isArray(question.options) && optIndex < question.options.length) {
                              optionText = question.options[optIndex];
                            } else if (question[`option${option}`]) {
                              optionText = question[`option${option}`];
                            }
                            
                            // Fallback if option text is not found
                            if (!optionText && optionText !== 0) {
                              optionText = `Option ${option}`;
                            }
                    
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
                      
                      {/* Explanation - Ensure it's always shown by removing conditional check */}
                      <Box sx={{ mt: 'auto', pt: 1 }}>
                        <Typography variant="body2" fontWeight="bold" color="text.secondary">
                  Explanation:
                </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.9rem' }}>
                          {(question.explanation && question.explanation.trim() !== "") 
                            ? question.explanation 
                            : "No explanation available for this question."}
                  </Typography>
                        
                        {/* Add Ask AI button */}
                        <Button
                          variant="outlined"
                          color="secondary"
                          size="small"
                          sx={{ mt: 2, display: 'flex', alignItems: 'center', gap: 1 }}
                          onClick={() => handleAskAI(question)}
                          startIcon={<QuestionAnswerIcon />}
                        >
                          Ask AI to explain this
                        </Button>
                  </Box>
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