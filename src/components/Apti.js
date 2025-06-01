import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  Button,
  CircularProgress,
  Alert,
  Divider,
  List,
  ListItem,
  ListItemText,
  Card,
  CardContent,
  Grid,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  LinearProgress,
  Chip,
  IconButton,
  Stepper,
  Step,
  StepLabel,
  useTheme,
} from '@mui/material';
import {
  Timer as TimerIcon,
  ArrowBack as ArrowBackIcon,
  ArrowForward as ArrowForwardIcon,
  Check as CheckIcon,
  Clear as ClearIcon,
  Refresh as RefreshIcon,
  History as HistoryIcon,
  Psychology as PsychologyIcon,
  Calculate as CalculateIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import axiosInstance from './axios-config';

// Sample aptitude questions for NEET
const sampleQuestions = {
  numerical: [
    {
      id: 1,
      question: "If the half-life of a radioactive isotope is 10 days, what fraction of the original amount will remain after 30 days?",
      options: [
        "1/8",
        "1/6",
        "1/4",
        "1/3"
      ],
      correctAnswer: "1/8",
      explanation: "Using the half-life formula: (1/2)^(t/half-life) = (1/2)^(30/10) = (1/2)^3 = 1/8"
    },
    {
      id: 2,
      question: "A solution contains 20% alcohol by volume. If 50ml of water is added to 150ml of this solution, what will be the percentage of alcohol in the new solution?",
      options: [
        "10%",
        "12%",
        "15%",
        "18%"
      ],
      correctAnswer: "15%",
      explanation: "Original alcohol: 20% of 150ml = 30ml. New volume: 150ml + 50ml = 200ml. New percentage: (30ml/200ml) × 100 = 15%"
    },
    {
      id: 3,
      question: "If the pH of a solution changes from 6 to 4, by what factor does the hydrogen ion concentration increase?",
      options: [
        "2 times",
        "10 times",
        "100 times",
        "1000 times"
      ],
      correctAnswer: "100 times",
      explanation: "pH = -log[H+]. A decrease of 2 pH units means the hydrogen ion concentration increases by a factor of 10^2 = 100."
    },
    {
      id: 4,
      question: "The angle of refraction for a light ray passing from air to glass is 30°. If the refractive index of glass is 1.5, what is the angle of incidence?",
      options: [
        "19.5°",
        "45°",
        "48.6°",
        "60°"
      ],
      correctAnswer: "48.6°",
      explanation: "Using Snell's law: n₁sin(θ₁) = n₂sin(θ₂). 1×sin(θ₁) = 1.5×sin(30°). θ₁ = sin⁻¹(1.5×0.5) = sin⁻¹(0.75) = 48.6°"
    }
  ],
  logical: [
    {
      id: 1,
      question: "In a certain code, CHEMISTRY is written as DIXNJTUSZ. How would BIOLOGY be written in that code?",
      options: [
        "CJPMPFZ",
        "CJPMPHZ",
        "CJNKNFZ",
        "CJPNPHZ"
      ],
      correctAnswer: "CJPMPHZ",
      explanation: "Each letter is replaced with the next letter in the alphabet (A→B, B→C, etc.). BIOLOGY → CJPMPHZ"
    },
    {
      id: 2,
      question: "In a DNA sequence, if A pairs with T and G pairs with C, and a DNA strand has the sequence ATTGC, what would be the complementary strand?",
      options: [
        "TAACG",
        "ATGCG",
        "GCATT",
        "ATACG"
      ],
      correctAnswer: "TAACG",
      explanation: "A pairs with T, T pairs with A, G pairs with C, C pairs with G. So ATTGC would have the complementary strand TAACG."
    },
    {
      id: 3,
      question: "In a class of 50 students, 30 study Biology, 25 study Physics, and 20 study Chemistry. 10 students study both Biology and Physics, 8 study both Physics and Chemistry, and 12 study both Biology and Chemistry. 5 students study all three subjects. How many students don't study any of these subjects?",
      options: [
        "0",
        "5",
        "10",
        "15"
      ],
      correctAnswer: "5",
      explanation: "Using the formula: Total = B + P + C - (B∩P) - (P∩C) - (B∩C) + (B∩P∩C) = 30 + 25 + 20 - 10 - 8 - 12 + 5 = 50. All 50 are accounted for, so students not studying any subject = 50 - 45 = 5."
    }
  ],
  reasoning: [
    {
      id: 1,
      question: "A genetic disease shows a pattern where it affects males more frequently than females and is passed from mother to son. This pattern of inheritance is most likely:",
      options: [
        "Autosomal dominant",
        "Autosomal recessive",
        "X-linked dominant",
        "X-linked recessive"
      ],
      correctAnswer: "X-linked recessive",
      explanation: "X-linked recessive disorders affect males more frequently than females because males have only one X chromosome and therefore only need one copy of the mutant gene to express the phenotype."
    },
    {
      id: 2,
      question: "In a food chain, energy transfer from one trophic level to the next is typically about:",
      options: [
        "10%",
        "50%",
        "75%",
        "90%"
      ],
      correctAnswer: "10%",
      explanation: "According to the 10% law of energy transfer in food chains, only about 10% of the energy at one trophic level is transferred to the next level."
    },
    {
      id: 3,
      question: "Which of the following is NOT a postulate of Dalton's atomic theory?",
      options: [
        "All matter is composed of atoms",
        "Atoms of the same element are identical in mass and properties",
        "Atoms can be created or destroyed in chemical reactions",
        "Compounds are formed by the combination of two or more different kinds of atoms"
      ],
      correctAnswer: "Atoms can be created or destroyed in chemical reactions",
      explanation: "One of Dalton's postulates is that atoms cannot be created or destroyed in chemical reactions, which is the law of conservation of mass."
    }
  ]
};

// Main component
const Apti = () => {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState(null);
  const [activeTest, setActiveTest] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [testComplete, setTestComplete] = useState(false);
  const [testResults, setTestResults] = useState(null);
  const [testHistory, setTestHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const theme = useTheme();
  
  useEffect(() => {
    // Load test history from localStorage
    const savedHistory = localStorage.getItem('aptiTestHistory');
    if (savedHistory) {
      try {
        setTestHistory(JSON.parse(savedHistory));
      } catch (err) {
        console.error('Error loading test history:', err);
      }
    }
  }, []);
  
  // Timer effect for active test
  useEffect(() => {
    let timerId;
    
    if (activeTest && timeRemaining > 0 && !testComplete) {
      timerId = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            clearInterval(timerId);
            // End the test when time runs out
            completeTest();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    
    return () => {
      if (timerId) clearInterval(timerId);
    };
  }, [activeTest, timeRemaining, testComplete]);
  
  const startTest = (category) => {
    setActiveCategory(category);
    setCurrentQuestionIndex(0);
    setUserAnswers({});
    setTimeRemaining(300); // 5 minutes in seconds
    setActiveTest(true);
    setTestComplete(false);
    setTestResults(null);
  };
  
  const handleAnswer = (questionId, answer) => {
    setUserAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };
  
  const nextQuestion = () => {
    if (currentQuestionIndex < sampleQuestions[activeCategory].length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      completeTest();
    }
  };
  
  const prevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };
  
  const completeTest = () => {
    setTestComplete(true);
    setActiveTest(false);
    
    // Calculate results
    let correctCount = 0;
    const questionResults = [];
    
    sampleQuestions[activeCategory].forEach(question => {
      const isCorrect = userAnswers[question.id] === question.correctAnswer;
      if (isCorrect) correctCount++;
      
      questionResults.push({
        questionId: question.id,
        question: question.question,
        userAnswer: userAnswers[question.id] || null,
        correctAnswer: question.correctAnswer,
        isCorrect: isCorrect,
        explanation: question.explanation
      });
    });
    
    const score = (correctCount / sampleQuestions[activeCategory].length) * 100;
    
    const results = {
      category: activeCategory,
      totalQuestions: sampleQuestions[activeCategory].length,
      correctAnswers: correctCount,
      score: Math.round(score),
      timeTaken: 300 - timeRemaining,
      date: new Date().toISOString(),
      questionResults: questionResults
    };
    
    setTestResults(results);
    
    // Save to history
    const updatedHistory = [results, ...testHistory.slice(0, 9)]; // Keep last 10 tests
    setTestHistory(updatedHistory);
    localStorage.setItem('aptiTestHistory', JSON.stringify(updatedHistory));
  };
  
  const resetTest = () => {
    setActiveCategory(null);
    setActiveTest(false);
    setCurrentQuestionIndex(0);
    setUserAnswers({});
    setTimeRemaining(0);
    setTestComplete(false);
    setTestResults(null);
  };
  
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };
  
  const getScoreColor = (score) => {
    if (score >= 80) return theme.palette.success.main;
    if (score >= 60) return theme.palette.primary.main;
    if (score >= 40) return theme.palette.warning.main;
    return theme.palette.error.main;
  };
  
  const handleGoBack = () => {
    if (activeTest || testComplete) {
      // If in a test, confirm before leaving
      if (window.confirm('Are you sure you want to leave? Your progress will be lost.')) {
        resetTest();
        setActiveCategory(null);
      }
    } else if (activeCategory) {
      // If on category selection, go back to main
      setActiveCategory(null);
    } else {
      // If on main screen, go back to extras
      navigate('/student-dashboard/extras');
    }
  };
  
  const renderCategorySelection = () => (
    <Box>
      <Typography 
        variant="h5" 
        gutterBottom 
        sx={{ fontWeight: 'bold', color: '#7445f8', mb: 3 }}
      >
        Select Aptitude Category
      </Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card 
            variant="outlined" 
            sx={{ 
              cursor: 'pointer', 
              height: '100%',
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: 3
              },
              borderRadius: 2
            }}
            onClick={() => startTest('numerical')}
          >
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ mb: 2, display: 'flex', justifyContent: 'center' }}>
                <CalculateIcon sx={{ fontSize: 50, color: '#FF6384' }} />
              </Box>
              <Typography variant="h6" gutterBottom align="center">
                Numerical Ability
              </Typography>
              <Typography variant="body2" color="text.secondary" align="center">
                Practice solving quantitative problems relevant to NEET, including calculations for pH, concentration, half-life, and more.
              </Typography>
              <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
                <Button variant="outlined" color="primary">
                  Start Test
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Card 
            variant="outlined" 
            sx={{ 
              cursor: 'pointer', 
              height: '100%',
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: 3
              },
              borderRadius: 2
            }}
            onClick={() => startTest('logical')}
          >
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ mb: 2, display: 'flex', justifyContent: 'center' }}>
                <PsychologyIcon sx={{ fontSize: 50, color: '#36A2EB' }} />
              </Box>
              <Typography variant="h6" gutterBottom align="center">
                Logical Ability
              </Typography>
              <Typography variant="body2" color="text.secondary" align="center">
                Enhance your logical thinking with pattern recognition, coding-decoding, and problem-solving relevant to medical entrance exams.
              </Typography>
              <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
                <Button variant="outlined" color="primary">
                  Start Test
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Card 
            variant="outlined" 
            sx={{ 
              cursor: 'pointer', 
              height: '100%',
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: 3
              },
              borderRadius: 2
            }}
            onClick={() => startTest('reasoning')}
          >
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ mb: 2, display: 'flex', justifyContent: 'center' }}>
                <HistoryIcon sx={{ fontSize: 50, color: '#4BC0C0' }} />
              </Box>
              <Typography variant="h6" gutterBottom align="center">
                Scientific Reasoning
              </Typography>
              <Typography variant="body2" color="text.secondary" align="center">
                Test your ability to apply scientific principles to situations, analyze data, and draw conclusions relevant to medical scenarios.
              </Typography>
              <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
                <Button variant="outlined" color="primary">
                  Start Test
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      
      {testHistory.length > 0 && (
        <Box sx={{ mt: 4 }}>
          <Typography variant="h6" gutterBottom>
            Recent Tests
          </Typography>
          <Paper elevation={1} sx={{ p: 0, borderRadius: 2, overflow: 'hidden' }}>
            <List disablePadding>
              {testHistory.slice(0, 5).map((test, index) => (
                <React.Fragment key={index}>
                  <ListItem 
                    sx={{ 
                      py: 2,
                      bgcolor: index % 2 === 0 ? 'rgba(0, 0, 0, 0.02)' : 'transparent'
                    }}
                    secondaryAction={
                      <Chip 
                        label={`${test.score}%`} 
                        size="small"
                        sx={{ 
                          bgcolor: getScoreColor(test.score),
                          color: 'white'
                        }}
                      />
                    }
                  >
                    <ListItemText
                      primary={`${test.category.charAt(0).toUpperCase() + test.category.slice(1)} Aptitude`}
                      secondary={`${new Date(test.date).toLocaleDateString()} · ${test.correctAnswers}/${test.totalQuestions} correct`}
                    />
                  </ListItem>
                  {index < testHistory.slice(0, 5).length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
          </Paper>
        </Box>
      )}
    </Box>
  );
  
  const renderActiveTest = () => {
    const currentQuestion = sampleQuestions[activeCategory][currentQuestionIndex];
    const hasAnswered = userAnswers[currentQuestion.id] !== undefined;
    
    return (
      <Box>
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          mb: 3
        }}>
          <Button 
            startIcon={<ArrowBackIcon />} 
            onClick={resetTest}
            color="primary"
          >
            Cancel Test
          </Button>
          
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center',
            border: '1px solid',
            borderColor: 'primary.main',
            borderRadius: 4,
            px: 2,
            py: 0.5,
            color: timeRemaining < 60 ? 'error.main' : 'primary.main',
            bgcolor: timeRemaining < 60 ? 'rgba(244, 67, 54, 0.1)' : 'rgba(116, 69, 248, 0.1)'
          }}>
            <TimerIcon sx={{ mr: 1 }} />
            <Typography variant="body2" fontWeight="medium">
              Time: {formatTime(timeRemaining)}
            </Typography>
          </Box>
        </Box>
        
        <Stepper 
          alternativeLabel 
          activeStep={currentQuestionIndex}
          sx={{ mb: 3 }}
        >
          {sampleQuestions[activeCategory].map((q, index) => (
            <Step key={q.id}>
              <StepLabel
                optional={
                  userAnswers[q.id] ? 
                    <Typography variant="caption" color="primary">Answered</Typography> : 
                    null
                }
              >
                Q{index + 1}
              </StepLabel>
            </Step>
          ))}
        </Stepper>
        
        <Paper 
          elevation={2} 
          sx={{ 
            p: 3, 
            borderRadius: 2,
            mb: 3 
          }}
        >
          <Typography 
            variant="h6" 
            gutterBottom 
            sx={{ fontWeight: 'medium' }}
          >
            Question {currentQuestionIndex + 1} of {sampleQuestions[activeCategory].length}
          </Typography>
          
          <Typography variant="body1" paragraph>
            {currentQuestion.question}
          </Typography>
          
          <FormControl component="fieldset" sx={{ width: '100%', mt: 2 }}>
            <RadioGroup
              value={userAnswers[currentQuestion.id] || ''}
              onChange={(e) => handleAnswer(currentQuestion.id, e.target.value)}
            >
              {currentQuestion.options.map((option, index) => (
                <FormControlLabel
                  key={index}
                  value={option}
                  control={<Radio />}
                  label={option}
                  sx={{ 
                    mb: 1, 
                    p: 1, 
                    borderRadius: 1, 
                    width: '100%',
                    bgcolor: userAnswers[currentQuestion.id] === option ? 'rgba(116, 69, 248, 0.1)' : 'transparent',
                    '&:hover': {
                      bgcolor: 'rgba(0, 0, 0, 0.05)'
                    }
                  }}
                />
              ))}
            </RadioGroup>
          </FormControl>
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
            <Button
              startIcon={<ArrowBackIcon />}
              variant="outlined"
              onClick={prevQuestion}
              disabled={currentQuestionIndex === 0}
            >
              Previous
            </Button>
            
            <Button
              endIcon={currentQuestionIndex === sampleQuestions[activeCategory].length - 1 ? <CheckIcon /> : <ArrowForwardIcon />}
              variant="contained"
              color={currentQuestionIndex === sampleQuestions[activeCategory].length - 1 ? "success" : "primary"}
              onClick={nextQuestion}
              disabled={!hasAnswered}
            >
              {currentQuestionIndex === sampleQuestions[activeCategory].length - 1 ? 'Finish Test' : 'Next'}
            </Button>
          </Box>
        </Paper>
        
        <Box sx={{ mb: 3 }}>
          <Typography variant="body2" color="text.secondary">
            Progress: {Object.keys(userAnswers).length} of {sampleQuestions[activeCategory].length} questions answered
          </Typography>
          <LinearProgress 
            variant="determinate" 
            value={(Object.keys(userAnswers).length / sampleQuestions[activeCategory].length) * 100}
            sx={{ mt: 1, height: 8, borderRadius: 4 }}
          />
        </Box>
      </Box>
    );
  };
  
  const renderTestResults = () => (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Button 
          startIcon={<ArrowBackIcon />} 
          onClick={resetTest}
          color="primary"
        >
          Back to Categories
        </Button>
        
        <Button 
          startIcon={<RefreshIcon />} 
          variant="outlined"
          onClick={() => startTest(testResults.category)}
        >
          Retake Test
        </Button>
      </Box>
      
      <Paper 
        elevation={3} 
        sx={{ 
          p: 3, 
          borderRadius: 2,
          borderTop: '4px solid',
          borderColor: getScoreColor(testResults.score),
          mb: 3
        }}
      >
        <Typography variant="h5" gutterBottom sx={{ textAlign: 'center' }}>
          {testResults.category.charAt(0).toUpperCase() + testResults.category.slice(1)} Test Results
        </Typography>
        
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'center',
          my: 3 
        }}>
          <Box sx={{ 
            width: 120, 
            height: 120, 
            borderRadius: '50%', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            bgcolor: getScoreColor(testResults.score),
            color: 'white',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)'
          }}>
            <Typography variant="h3" fontWeight="bold">
              {testResults.score}%
            </Typography>
          </Box>
        </Box>
        
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-around',
          textAlign: 'center',
          mb: 3
        }}>
          <Box>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Questions
            </Typography>
            <Typography variant="h6">
              {testResults.correctAnswers} / {testResults.totalQuestions}
            </Typography>
          </Box>
          
          <Box>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Time Taken
            </Typography>
            <Typography variant="h6">
              {formatTime(testResults.timeTaken)}
            </Typography>
          </Box>
          
          <Box>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Performance
            </Typography>
            <Typography variant="h6" sx={{ color: getScoreColor(testResults.score) }}>
              {testResults.score >= 80 ? 'Excellent' : 
               testResults.score >= 60 ? 'Good' : 
               testResults.score >= 40 ? 'Average' : 'Needs Work'}
            </Typography>
          </Box>
        </Box>
      </Paper>
      
      <Typography variant="h6" gutterBottom>
        Question Review
      </Typography>
      
      {testResults.questionResults.map((result, index) => (
        <Paper 
          key={result.questionId} 
          elevation={1} 
          sx={{ 
            p: 3, 
            mb: 2, 
            borderRadius: 2,
            borderLeft: '4px solid', 
            borderColor: result.isCorrect ? 'success.main' : 'error.main'
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="subtitle1" fontWeight="medium">
              Question {index + 1}
            </Typography>
            <Chip 
              label={result.isCorrect ? 'Correct' : 'Incorrect'} 
              color={result.isCorrect ? 'success' : 'error'} 
              size="small" 
              icon={result.isCorrect ? <CheckIcon /> : <ClearIcon />}
            />
          </Box>
          
          <Typography variant="body1" paragraph>
            {result.question}
          </Typography>
          
          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Your Answer:
            </Typography>
            <Typography 
              variant="body1" 
              sx={{ 
                color: result.isCorrect ? 'success.main' : 'error.main',
                fontWeight: 'medium' 
              }}
            >
              {result.userAnswer || 'Not answered'}
            </Typography>
          </Box>
          
          {!result.isCorrect && (
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Correct Answer:
              </Typography>
              <Typography variant="body1" sx={{ color: 'success.main', fontWeight: 'medium' }}>
                {result.correctAnswer}
              </Typography>
            </Box>
          )}
          
          <Divider sx={{ my: 2 }} />
          
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Explanation:
          </Typography>
          <Typography variant="body2">
            {result.explanation}
          </Typography>
        </Paper>
      ))}
    </Box>
  );
  
  // Add the missing renderTestIntro function
  const renderTestIntro = () => {
    const categoryDisplayName = activeCategory.charAt(0).toUpperCase() + activeCategory.slice(1);
    
    return (
      <Box>
        <Paper elevation={2} sx={{ p: 3, borderRadius: 2, mb: 3 }}>
          <Typography variant="h5" gutterBottom sx={{ color: '#7445f8', fontWeight: 'bold' }}>
            {categoryDisplayName} Aptitude Test
          </Typography>
          
          <Typography variant="body1" paragraph>
            You are about to start the {categoryDisplayName} aptitude test, which consists of {sampleQuestions[activeCategory].length} questions.
          </Typography>
          
          <Box sx={{ my: 3 }}>
            <Typography variant="subtitle1" fontWeight="medium" gutterBottom>
              Test Instructions:
            </Typography>
            <List sx={{ pl: 2 }}>
              <ListItem sx={{ display: 'list-item', listStyleType: 'disc', pl: 0 }}>
                <ListItemText primary="You will have 5 minutes to complete the test." />
              </ListItem>
              <ListItem sx={{ display: 'list-item', listStyleType: 'disc', pl: 0 }}>
                <ListItemText primary="Each question has only one correct answer." />
              </ListItem>
              <ListItem sx={{ display: 'list-item', listStyleType: 'disc', pl: 0 }}>
                <ListItemText primary="You can navigate between questions using the Next and Previous buttons." />
              </ListItem>
              <ListItem sx={{ display: 'list-item', listStyleType: 'disc', pl: 0 }}>
                <ListItemText primary="Your score will be displayed immediately after test completion." />
              </ListItem>
            </List>
          </Box>
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
            <Button
              variant="outlined"
              startIcon={<ArrowBackIcon />}
              onClick={() => setActiveCategory(null)}
            >
              Back to Categories
            </Button>
            
            <Button
              variant="contained"
              color="primary"
              onClick={() => setActiveTest(true)}
              sx={{ 
                bgcolor: '#7445f8',
                '&:hover': {
                  bgcolor: '#5c33d4',
                }
              }}
            >
              Start Test
            </Button>
          </Box>
        </Paper>
      </Box>
    );
  };
  
  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', py: 4, px: 2 }}>
      {/* Back Button */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={handleGoBack}
          sx={{
            borderColor: '#7445f8',
            color: '#7445f8',
            '&:hover': {
              borderColor: '#5c33d4',
              backgroundColor: 'rgba(116, 69, 248, 0.04)',
            }
          }}
        >
          {activeTest || testComplete ? 'Exit Test' : 
           activeCategory ? 'Back to Categories' : 
           'Back to Extras'}
        </Button>
      </Box>

      {/* Page Title */}
      <Typography variant="h4" component="h1" gutterBottom align="center" fontWeight="bold" sx={{ mb: 4 }}>
        Aptitude Training
      </Typography>
      
      {/* Error Message Display */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}
      
      {/* Loading Indicator */}
      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
          <CircularProgress />
        </Box>
      )}
      
      {/* Render the appropriate view based on state */}
      {!activeCategory && !activeTest && !testComplete && renderCategorySelection()}
      {activeCategory && !activeTest && !testComplete && renderTestIntro()}
      {activeTest && !testComplete && renderActiveTest()}
      {testComplete && renderTestResults()}
    </Box>
  );
};

export default Apti; 