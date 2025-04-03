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
import { motion } from 'framer-motion';
import { physicsTopics, chemistryTopics, biologyTopics } from './SyllabusData';
import { saveTestResult } from '../services/firebase';

const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add request interceptor to add token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle errors
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('Axios error:', error.response || error);
    return Promise.reject(error);
  }
);

function TestPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state;
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [timers, setTimers] = useState([]);
  const [questionStartTime, setQuestionStartTime] = useState(new Date());
  const [questionTimer, setQuestionTimer] = useState(null);
  const [testTimer, setTestTimer] = useState(null);
  const [testTimeLeft, setTestTimeLeft] = useState(60 * 60); // Default 60 minutes
  const [isSubmitting, setSubmitting] = useState(false);
  const [correctOptions, setCorrectOptions] = useState([]);
  
  // Add missing state variables for test completion
  const [timeSpent, setTimeSpent] = useState(0);
  const [pausedTime, setPausedTime] = useState(0);
  const [questionTimers, setQuestionTimers] = useState([]);
  const [selectedAnswers, setSelectedAnswers] = useState([]);
  const [reviewedQuestions, setReviewedQuestions] = useState([]);
  const [subject, setSubject] = useState(state?.subject || '');
  const [topicNumber, setTopicNumber] = useState(state?.topicNumber || '');
  
  // Added state variables for enhanced metrics
  const [testStartTime, setTestStartTime] = useState(new Date());
  const [pauseDuration, setPauseDuration] = useState(0);
  const [pauseStartTime, setPauseStartTime] = useState(null);
  const [questionTransitionTimes, setQuestionTransitionTimes] = useState([]);
  const [optionChanges, setOptionChanges] = useState(0);
  const [reviewMarkedQuestions, setReviewMarkedQuestions] = useState([]);
  const [screenSize, setScreenSize] = useState(`${window.innerWidth}x${window.innerHeight}`);
  const [previousAttempts, setPreviousAttempts] = useState([]);
  
  // Add missing state variables
  const [showRules, setShowRules] = useState(true);
  const [confirmStartDialogOpen, setConfirmStartDialogOpen] = useState(false);
  const [testStarted, setTestStarted] = useState(false);
  const [testCompleted, setTestCompleted] = useState(false);
  const [results, setResults] = useState(null);

  // Add calculateScore function
  const calculateScore = useCallback(() => {
    if (!questions || !selectedAnswers) return 0;
    const correctAnswers = questions.filter((question, index) => 
      selectedAnswers[index] === question.correctOption
    ).length;
    return (correctAnswers / questions.length) * 100;
  }, [questions, selectedAnswers]);

  // Update useEffect to set subject and topicNumber when state changes
  useEffect(() => {
    if (state) {
      setSubject(state?.subject || '');
      setTopicNumber(state?.topicNumber || '');
    }
  }, [state]);

  // Update useEffect to track time spent
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

  // Update useEffect to track question timers
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

  // Update useEffect to track selected answers
  useEffect(() => {
    if (answers.length > 0) {
      setSelectedAnswers(answers);
    }
  }, [answers]);

  // Update useEffect to track reviewed questions
  useEffect(() => {
    if (reviewMarkedQuestions.length > 0) {
      setReviewedQuestions(reviewMarkedQuestions);
    }
  }, [reviewMarkedQuestions]);

  // Function to get full image URL
  const getFullImageUrl = (imageUrl) => {
    if (!imageUrl) return null;
    if (imageUrl.startsWith('http')) return imageUrl;
    return `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/uploads/${imageUrl}`;
  };
  
  // Function to handle when time is up
  const handleTimeUp = () => {
    console.log('Time is up! Submitting test automatically...');
    handleTestComplete();
  };

  // Define fetchPreviousAttempts before it's used in useEffect
  const fetchPreviousAttempts = async () => {
    try {
      if (!state) {
        console.error('Cannot fetch previous attempts: state is null');
        return;
      }
      
      let query = `?subject=${state?.subject || ''}`;
      
      if (state?.mode === 'practice' && state?.topicNumber) {
        query += `&topicNumber=${state.topicNumber}`;
      } else if (state?.stage && state?.level) {
        query += `&stage=${state.stage}&level=${state.level}`;
      }
      
      const response = await axiosInstance.get(`/student/test-history${query}`);
      
      if (response.data && Array.isArray(response.data) && response.data.length > 0) {
        setPreviousAttempts(response.data);
        console.log(`Found ${response.data.length} previous attempts for this test`);
      }
    } catch (error) {
      console.error('Error fetching previous attempts:', error);
      // Non-critical error, don't set error state
    }
  };

  // Add support for multi-subject tests in the fetchQuestions function
  const fetchQuestions = async () => {
    setLoading(true);
    console.log("Starting to fetch questions with state:", state);
    
    try {
      // Check if state exists
      if (!state) {
        setError('Test configuration not found. Please return to the dashboard and try again.');
        setLoading(false);
        return;
      }

      // Get auth token from local storage
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Authentication token not found. Please log in again.');
        setLoading(false);
        return;
      }

      // Handle multi-subject tests
      if (state.multiSubject) {
        console.log("Fetching multi-subject test with config:", JSON.stringify(state, null, 2));
        
        try {
          // Make sure timeLimit is set - convert from minutes to seconds if needed
          let timeLimit = state.timeLimit;
          if (!timeLimit) {
            timeLimit = (state.questionCount || 45) * 60; // Default to 1 minute per question
            console.log(`No timeLimit provided, defaulting to ${timeLimit} seconds (${timeLimit/60} minutes)`);
          }
          
          // Log the params being sent to the API
          const params = {
            topicsBySubject: JSON.stringify(state.topicsBySubject),
            selectedSubjects: state.selectedSubjects.join(','),
            questionCount: state.questionCount || 45,
            timeLimit: timeLimit,
            mode: 'assessment'
          };
          console.log("Sending params to /student/combined-test:", params);
          
          // Fetch questions from the server for a combined test
          const response = await axiosInstance.get(`/student/combined-test`, { params });
          
          console.log('Combined test response:', response.data);
          
          // Process the questions
          if (response.data && response.data.questions && response.data.questions.length > 0) {
            const fetchedQuestions = processResponseQuestions(response.data.questions);
            console.log('Processed combined questions:', fetchedQuestions);
            
            // Update state with fetched questions
            setQuestions(fetchedQuestions);
            
            // Set time limit based on total question time allocations or provided timeLimit
            setTestTimeLeft(timeLimit);
            console.log(`Set test time limit to ${timeLimit} seconds (${timeLimit/60} minutes)`);
            
            setLoading(false);
            return;
          } else {
            console.error('No questions returned from API:', response.data);
            throw new Error('No questions returned from API');
          }
        } catch (combinedError) {
          console.error('Error fetching combined test questions:', combinedError);
          
          // Try using manual test generation as a fallback
          try {
            console.log("Trying fallback method for combined test...");
            let allQuestions = [];
            
            // Log topics by subject for debugging
            console.log("Topics by subject:", state.topicsBySubject);
            console.log("Selected subjects:", state.selectedSubjects);
            
            // For each subject, fetch questions for each topic
            for (const subjectId of state.selectedSubjects) {
              const topicNumbers = state.topicsBySubject[subjectId] || [];
              
              if (topicNumbers.length > 0) {
                // Determine how many questions to fetch from this subject
                const topicCount = topicNumbers.length;
                const totalTopicsCount = Object.values(state.topicsBySubject)
                  .reduce((sum, topics) => sum + topics.length, 0);
                
                // Allocate questions proportionally by subject
                const subjectQuestionCount = Math.ceil(
                  ((state.questionCount || 45) * topicCount) / totalTopicsCount
                );
                
                console.log(`Fetching ${subjectQuestionCount} questions for ${subjectId} with topics: ${topicNumbers.join(',')}`);
                
                // Create parameters for this subject's request
                const subjectParams = {
                  subject: subjectId,
                  topics: topicNumbers.join(','),
                  count: subjectQuestionCount,
                  mode: 'assessment'
                };
                console.log("Subject request params:", subjectParams);
                
                // Make the request
                const subjectResponse = await axiosInstance.get(`/student/test`, { params: subjectParams });
                
                if (subjectResponse.data && subjectResponse.data.questions && subjectResponse.data.questions.length > 0) {
                  console.log(`Received ${subjectResponse.data.questions.length} questions for ${subjectId}`);
                  
                  // Add subject info to each question
                  const subjectQuestions = subjectResponse.data.questions.map(q => ({
                    ...q,
                    subject: subjectId
                  }));
                  
                  allQuestions = [...allQuestions, ...subjectQuestions];
                } else {
                  console.warn(`No questions returned for subject ${subjectId}`, subjectResponse.data);
                }
              } else {
                console.warn(`No topics selected for subject ${subjectId}`);
              }
            }
            
            console.log(`Total questions collected from all subjects: ${allQuestions.length}`);
            
            // Ensure we don't exceed the requested question count
            if (allQuestions.length > (state.questionCount || 45)) {
              console.log(`Limiting to ${state.questionCount || 45} questions as requested`);
              allQuestions = allQuestions.slice(0, state.questionCount || 45);
            }
            
            if (allQuestions.length === 0) {
              throw new Error('No questions could be retrieved for any of the selected topics');
            }
            
            // Process all questions
            const fetchedQuestions = processResponseQuestions(allQuestions);
            console.log('Processed combined questions (fallback method):', fetchedQuestions);
            
            // Update state with fetched questions
            setQuestions(fetchedQuestions);
            
            // Set time limit based on provided timeLimit or default to question count * 60 seconds
            const timeLimit = state.timeLimit || ((state.questionCount || 45) * 60);
            console.log(`Using time limit: ${timeLimit} seconds (${timeLimit/60} minutes)`);
            
            setTestTimeLeft(timeLimit);
            
            setLoading(false);
            return;
          } catch (fallbackError) {
            console.error('Error in fallback method for combined test:', fallbackError);
            setError('Failed to load combined test questions. Please try again later. Error: ' + fallbackError.message);
            setLoading(false);
            return;
          }
        }
      }
      
      // Normal single-subject test logic (unchanged)
      // Fetch questions from the server
      const response = await axiosInstance.get(`/student/test`, {
        params: {
          subject: state?.subject || '',
          ...(state?.mode === 'practice' && state?.topicNumber ? { topicNumber: state.topicNumber } : {}),
          ...(state?.mode === 'assessment' && state?.topics ? { 
            topics: state.topics.join(','),
            count: state?.questionCount || 40
          } : {}),
          mode: state?.mode || 'practice'
        }
      });

      console.log('Raw questions from server:', response.data);
      
      // Process the questions
      const fetchedQuestions = processResponseQuestions(response.data.questions);

      console.log('Processed questions:', fetchedQuestions);
      
      // Update state with fetched questions
      setQuestions(fetchedQuestions);
      
      // Set time limit based on total question time allocations
      const totalTimeAllocation = fetchedQuestions.reduce((total, q) => total + (q.timeAllocation || 60), 0);
      setTestTimeLeft(Math.max(totalTimeAllocation, 1800)); // Min 30 minutes

      // Initialize state for previous attempts if available
      if (response.data.previousAttempts) {
        setPreviousAttempts(response.data.previousAttempts);
      }

      setLoading(false);
    } catch (error) {
      console.error('Error fetching questions:', error);
      setError('Failed to load test questions. Please try again later.');
      setLoading(false);
    }
  };

  // Helper function to process questions from API response
  const processResponseQuestions = (questionsArray) => {
    if (!questionsArray || !Array.isArray(questionsArray)) {
      console.error('Invalid questions array:', questionsArray);
      return [];
    }
    
    return questionsArray.map(q => {
      // Convert letter option to index
      let correctOptionIndex = null;
      let correctOptionLetter = null;
      
      // First, try to extract the correct option in a consistent way
      if (q.correctOption !== undefined && q.correctOption !== null) {
        if (typeof q.correctOption === 'string') {
          if (q.correctOption.match(/^[A-D]$/)) {
            // If it's a letter (A, B, C, D), convert to index (0, 1, 2, 3)
            correctOptionIndex = q.correctOption.charCodeAt(0) - 65; // 'A' -> 0, 'B' -> 1, etc.
            correctOptionLetter = q.correctOption;
          } else if (q.correctOption.match(/^[0-3]$/)) {
            // If it's a string with a number 0-3, convert to index
            correctOptionIndex = parseInt(q.correctOption);
            correctOptionLetter = String.fromCharCode(65 + correctOptionIndex);
          }
        } else if (typeof q.correctOption === 'number' && q.correctOption >= 0 && q.correctOption <= 3) {
          // If it's already a number between 0-3, use as is
          correctOptionIndex = q.correctOption;
          correctOptionLetter = String.fromCharCode(65 + correctOptionIndex);
        }
      }
      
      // If we still don't have a correct option, check if there's any other field that might have it
      if (correctOptionIndex === null) {
        // Look for alternative fields like answer, answerIndex, etc.
        if (q.answer && typeof q.answer === 'string' && q.answer.match(/^[A-D]$/)) {
          correctOptionIndex = q.answer.charCodeAt(0) - 65;
          correctOptionLetter = q.answer;
        } else if (q.answerIndex !== undefined && typeof q.answerIndex === 'number') {
          correctOptionIndex = q.answerIndex;
          correctOptionLetter = String.fromCharCode(65 + correctOptionIndex);
        }
      }
      
      // Ensure we have a consistent structure
      return {
        ...q,
        id: q._id || q.id, // Ensure id is consistently available
        questionText: q.questionText || q.text || "No question text available", // Ensure questionText is always set
        options: Array.isArray(q.options) ? q.options : [], // Ensure options is an array
        timeAllocation: q.timeAllocation || 60, // Default time allocation
        correctOptionIndex: correctOptionIndex, // Store the index (0-3)
        correctOption: correctOptionLetter, // Store the letter (A-D)
        // Include subject info if available
        subject: q.subject || state?.subject || 'general',
        // Debug fields
        _debug_correctOption: {
          original: q.correctOption,
          type: typeof q.correctOption,
          index: correctOptionIndex,
          letter: correctOptionLetter
        }
      };
    });
  };

  useEffect(() => {
    if (!state) {
      setError('Test configuration not found. Please return to the dashboard and try again.');
      setLoading(false);
      return;
    }

    // Set test start time when component mounts
    setTestStartTime(new Date());
    
    // Capture screen size on mount
    setScreenSize(`${window.innerWidth}x${window.innerHeight}`);
    
    // Try to fetch previous attempts for this topic/subject
    if (state.subject) {
      fetchPreviousAttempts();
    }

    // Fetch test questions from API
    fetchQuestions();

    // Set up test timer
    const timer = setInterval(() => {
      setTestTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          handleTimeUp();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    setTestTimer(timer);

    return () => {
      if (timer) clearInterval(timer);
      if (questionTimer) clearInterval(questionTimer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Update handleOptionChange to track changes
  const handleOptionChange = (index, optionIndex) => {
    // If the answer is being changed (not just initial selection), count it
    if (answers[index] !== null && answers[index] !== undefined) {
      setOptionChanges(prev => prev + 1);
    }
    
    setAnswers(prev => {
      const newAnswers = [...prev];
      newAnswers[index] = optionIndex;
      return newAnswers;
    });
  };

  // Update handleNextQuestion to track transition times
  const handleNextQuestion = () => {
    // Record time spent on current question before moving to next
    const timeSpent = (new Date() - questionStartTime) / 1000; // in seconds
    setQuestionTransitionTimes(prev => [...prev, timeSpent]);
    
    // Reset question timer for next question
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setQuestionStartTime(new Date());
    }
  };

  // Add function to mark questions for review
  const handleMarkForReview = () => {
    const currentIndex = currentQuestionIndex;
    setReviewMarkedQuestions(prev => {
      if (prev.includes(currentIndex)) {
        return prev.filter(idx => idx !== currentIndex);
        } else {
        return [...prev, currentIndex];
      }
    });
  };

  // Add pause handling functions
  const handlePause = () => {
    // Record when the pause started
    setPauseStartTime(new Date());
    
    // Pause timers if needed
    if (testTimer) clearInterval(testTimer);
    if (questionTimer) clearInterval(questionTimer);
  };
  
  const handleResume = () => {
    // Calculate pause duration and add to total
    if (pauseStartTime) {
      const pauseEnd = new Date();
      const pauseTimeInSeconds = (pauseEnd - pauseStartTime) / 1000;
      setPauseDuration(prev => prev + pauseTimeInSeconds);
      setPauseStartTime(null);
    }
    
    // Resume timers
    // Restart test timer
    const timer = setInterval(() => {
      setTestTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          handleTimeUp();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    setTestTimer(timer);
    setQuestionStartTime(new Date());
  };

  // Update the handleTestComplete function
  const handleTestComplete = async () => {
    try {
      setSubmitting(true);
      console.log('Starting test completion process...');

      // Calculate total time spent
      const totalTimeSpent = timeSpent + (pausedTime || 0);
      console.log('Total time spent:', totalTimeSpent);
      
      // Process each question to gather metrics - enhanced to include more data
      const processedQuestions = questions.map((question, index) => {
        const timeSpentOnQuestion = questionTimers[index] || 0;
        const selectedOption = selectedAnswers[index];
        // Get the letter (A, B, C, D) representation for selected option
        const selectedOptionLetter = selectedOption !== null && selectedOption !== undefined 
          ? String.fromCharCode(65 + selectedOption) 
          : '';
        // Determine if the answer was correct
        const isCorrect = selectedOption === question.correctOptionIndex;
        const isReviewed = reviewedQuestions.includes(index);

        // Construct full question data
        return {
          questionId: question._id || question.id,
          timeSpent: timeSpentOnQuestion,
          selectedOption: selectedOptionLetter,
          correctOption: question.correctOption || 'A',
          isCorrect: isCorrect,
          isReviewed: isReviewed,
          // Include full question text and options
          questionText: question.questionText || question.text || `Question ${index + 1}`,
          options: question.options || ['Option A', 'Option B', 'Option C', 'Option D'],
          explanation: question.explanation || 'No explanation available for this question.',
          allocatedTime: question.timeAllocation || 60
        };
      });

      // Create test history data
      const testHistoryData = {
        subject: subject || 'general',
        mode: state?.mode || 'practice',
        topicNumber: topicNumber || '',
        score: calculateScore(),
        totalTime: totalTimeSpent,
        questions: processedQuestions,
        deviceInfo: {
          userAgent: navigator.userAgent,
          platform: navigator.platform,
          language: navigator.language
        },
        completedAt: new Date().toISOString()
      };

      console.log('Sending test data to backend:', testHistoryData);
      const response = await axiosInstance.post('/student/complete-test', testHistoryData);
      console.log('Backend response:', response.data);

      // Save to Firebase
      try {
        await saveTestResult(response.data._id, testHistoryData);
        console.log('Test result saved to Firebase');
      } catch (firebaseError) {
        console.error('Error saving to Firebase:', firebaseError);
        // Continue with navigation even if Firebase save fails
      }

      // Clear test history cache
      if (window.TEST_HISTORY_CACHE) {
        window.TEST_HISTORY_CACHE.invalidate();
      }

      // Store test data in session storage with enhanced question data
      try {
        const testDataToStore = {
          ...response.data,
          testId: response.data._id, // Ensure we have the testId
          // Make sure we store the full question data
          questions: processedQuestions,
          // Ensure basic data is present
          score: response.data.score || calculateScore(),
          totalQuestions: questions.length,
          correctAnswers: processedQuestions.filter(q => q.isCorrect).length,
          timeTaken: totalTimeSpent,
          subject: subject || 'General',
          level: topicNumber || '1'
        };
        
        // Log the data we're storing for debugging
        console.log('Storing test data in session storage:', testDataToStore);
        console.log('Question sample:', testDataToStore.questions[0]);
        
        sessionStorage.setItem('lastTestResult', JSON.stringify(testDataToStore));
        console.log('Test data saved to session storage.');
      } catch (storageError) {
        console.error('Error saving to sessionStorage:', storageError);
      }

      // Add a longer delay before navigation to ensure state updates and storage is complete
      setTimeout(() => {
        console.log('Navigating to test results page with testId:', response.data._id);
        if (response.data && response.data._id) {
          navigate(`/test-results/${response.data._id}`);
        } else {
          navigate('/test-results');
        }
      }, 1000);

    } catch (error) {
      console.error('Error completing test:', error);
      setError('Failed to submit test. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };
  
  // Helper function to get previous best score
  const getPreviousBestScore = () => {
    if (!previousAttempts || previousAttempts.length === 0) return 0;
    
    // Filter out attempts with invalid scores first
    const validScores = previousAttempts
      .map(a => a?.score || 0)
      .filter(score => typeof score === 'number' && !isNaN(score));
    
    if (validScores.length === 0) return 0;
    return Math.max(...validScores);
  };

  // Function to shuffle array (Fisher-Yates algorithm)
  const shuffleArray = (array) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  // Timer effect with the memoized handleSubmitTest
  useEffect(() => {
    let timer;
    if (testTimer && testTimeLeft > 0) {
      timer = setTimeout(() => {
        setTestTimeLeft(prevTime => prevTime - 1);
      }, 1000);
    } else if (testTimeLeft === 0) {
      handleTestComplete();
    }
    
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [testTimer, testTimeLeft, handleTestComplete]);

  // Set up question timer
  useEffect(() => {
    let interval;
    
    if (questionTimer && currentQuestionIndex < questions.length) {
      // Set the initial time immediately when test starts
      questionStartTime.current = Date.now();
      
      // Start from 0 instead of waiting for the first interval
      setQuestionTimer(0);
      
      interval = setInterval(() => {
        setQuestionTimer(prev => prev + 1);
      }, 1000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [questionTimer, currentQuestionIndex, questions.length]);

  // Clean up timer when component unmounts
  useEffect(() => {
    return () => {
      if (testTimer) {
        clearInterval(testTimer);
      }
      if (questionTimer) {
        clearInterval(questionTimer);
      }
    };
  }, []);

  const handleStartTest = () => {
    // Initialize test when user starts it
    setShowRules(false);
    setTestStarted(true);
    setTestCompleted(false);
    setTestStartTime(new Date());
    
    // Initialize question timer
    setQuestionStartTime(new Date());
    
    // Reset answers
    setAnswers([]);
    
    // Reset timers
    setTimers([]);
    
    console.log('Test started with', questions.length, 'questions');
  };
  
  const handleOpenConfirmStartDialog = () => {
    setConfirmStartDialogOpen(true);
  };
  
  const handleCloseConfirmStartDialog = () => {
    setConfirmStartDialogOpen(false);
  };

  // Implement the handleAnswerSelect function
  const handleAnswerSelect = (questionIndex, optionIndex) => {
    console.log('Selected option', optionIndex, 'for question', questionIndex);
    
    // Get the current question
    const currentQuestion = questions[questionIndex];
    if (!currentQuestion) return;
    
    // Store the answer in the answers state
    setAnswers(prev => {
      const newAnswers = [...prev];
      newAnswers[questionIndex] = optionIndex;
      return newAnswers;
    });
  };

  // Implement the handleConfirmAnswer function
  const handleConfirmAnswer = () => {
    // Get the current question
    const currentQuestion = questions[currentQuestionIndex];
    if (!currentQuestion) return;
    
    const questionId = currentQuestion._id || currentQuestion.id;
    const selectedOption = answers[currentQuestionIndex];
    
    if (selectedOption === null || selectedOption === undefined) {
      // No option selected
      console.log('No option selected');
      return;
    }
    
    console.log('Confirming answer', selectedOption, 'for question', questionId);
    
    // Record current question's correct option for later scoring
    const newCorrectOptions = [...correctOptions];
    const correctOptionIndex = currentQuestion.correctOptionIndex;
    newCorrectOptions[currentQuestionIndex] = correctOptionIndex;
    setCorrectOptions(newCorrectOptions);
    
    // Log for debugging
    console.log(`Question ${currentQuestionIndex}: 
      Selected: ${selectedOption} (${String.fromCharCode(65 + selectedOption)}), 
      Correct: ${correctOptionIndex} (${String.fromCharCode(65 + correctOptionIndex)}),
      isCorrect: ${selectedOption === correctOptionIndex}`
    );
    
    // Update timer for this question
    setTimers(prev => {
      const newTimers = [...prev];
      const timeSpent = (new Date() - questionStartTime) / 1000; // in seconds
      newTimers[currentQuestionIndex] = timeSpent;
      return newTimers;
    });
    
    // Move to next question if available
    if (currentQuestionIndex < questions.length - 1) {
        handleNextQuestion();
    } else {
      // Show confirmation dialog to submit the test
      if (window.confirm('You\'ve reached the last question. Would you like to submit the test?')) {
        handleTestComplete();
      }
    }
  };

  const handlePrevQuestion = () => {
    // Implementation of handlePrevQuestion function
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
    const answeredCount = Object.keys(answers).length;
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

  // Add the renderTestInfo function to display test information
  const renderTestInfo = () => {
    const testMode = state?.mode || 'practice';
    const testTypeLabel = testMode === 'practice' ? 'Practice Test' : 'Assessment Test';
    
    let topicInfo;
    if (testMode === 'practice') {
      // For practice mode, show the specific topic
      const topicNumber = state?.topicNumber;
      // Get the topic data from SyllabusData.js
      const subjectTopics = {
        'physics': physicsTopics,
        'chemistry': chemistryTopics,
        'biology': biologyTopics
      }[state?.subject] || [];
      
      const topicData = subjectTopics.find(t => t.number === topicNumber);
      topicInfo = topicData ? `Topic ${topicNumber}: ${topicData.title}` : `Topic ${topicNumber}`;
    } else if (testMode === 'assessment' && state?.multiSubject) {
      // For multi-subject assessment mode
      const subjectCount = state?.selectedSubjects?.length || 0;
      const topicsCount = Object.values(state?.topicsBySubject || {}).reduce((sum, topics) => sum + topics.length, 0);
      topicInfo = `${topicsCount} topics across ${subjectCount} subjects`;
    } else {
      // For single-subject assessment mode
      const selectedTopics = state?.topics || [];
      topicInfo = `${selectedTopics.length} selected topics`;
    }

    // Get subject info based on type of test
    let subjectInfo;
    if (state?.multiSubject) {
      // For multi-subject tests, show a list of subjects
      const subjects = state?.selectedSubjects || [];
      if (subjects.length > 0) {
        // Make sure each subject is a valid string before using charAt
        subjectInfo = subjects
          .filter(s => typeof s === 'string' && s.length > 0)
          .map(s => s.charAt(0).toUpperCase() + s.slice(1))
          .join(', ');
        
        // If we ended up with an empty string, use a fallback
        if (!subjectInfo) {
          subjectInfo = 'Multiple Subjects';
        }
      } else {
        subjectInfo = 'Multiple Subjects';
      }
    } else {
      // For single-subject tests, show the subject name
      if (state?.subject && typeof state.subject === 'string' && state.subject.length > 0) {
        subjectInfo = state.subject.charAt(0).toUpperCase() + state.subject.slice(1);
      } else {
        subjectInfo = 'Unknown Subject';
      }
    }

    return (
      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          {testTypeLabel}
        </Typography>
        <Typography variant="body1">
          Subject: {subjectInfo}
        </Typography>
        <Typography variant="body1">
          {topicInfo}
        </Typography>
        <Typography variant="body1">
          Questions: {questions.length}
        </Typography>
      </Box>
    );
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
        <Box sx={{ p: 4, maxWidth: 800, mx: 'auto' }}>
          <Paper sx={{ p: 4, borderRadius: 2, boxShadow: 3 }}>
            <Typography variant="h4" gutterBottom fontWeight="bold" align="center">
              Test Instructions
          </Typography>
            
            {renderTestInfo()}
            
            <Divider sx={{ my: 3 }} />
          
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
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <TrophyIcon color="primary" sx={{ fontSize: 28, mr: 1 }} />
                <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                  Test History
                </Typography>
              </Box>
              <Divider sx={{ mb: 3 }} />
              
              <TableContainer component={Paper} elevation={0} sx={{ mb: 2 }}>
                <Table size="small">
                  <TableHead>
                    <TableRow sx={{ bgcolor: '#f5f5f5' }}>
                      <TableCell sx={{ fontWeight: 'bold' }}>Date</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Score</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Time Taken</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {previousAttempts.map((attempt, index) => (
                      <TableRow key={index} sx={{ 
                        '&:hover': { bgcolor: 'rgba(0, 0, 0, 0.02)' },
                        bgcolor: index % 2 === 0 ? 'white' : 'rgba(0, 0, 0, 0.01)'
                      }}>
                        <TableCell>
                          {new Date(attempt.date).toLocaleDateString()} {new Date(attempt.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </TableCell>
                        <TableCell>
                          <Chip 
                            label={`${attempt.score}%`}
                            color={attempt.score >= 70 ? 'success' : 'warning'}
                            size="small"
                            variant="outlined"
                          />
                        </TableCell>
                        <TableCell>
                          {Math.floor(attempt.timeTaken / 60)}:{(attempt.timeTaken % 60).toString().padStart(2, '0')} min
                        </TableCell>
                        <TableCell>
                          <Chip 
                            label={attempt.passedLevel ? 'PASSED' : 'FAILED'}
                            color={attempt.passedLevel ? 'success' : 'error'}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          <Button 
                            size="small" 
                            variant="outlined"
                            startIcon={<InfoIcon />}
                            sx={{ textTransform: 'none', fontSize: '0.75rem' }}
                            onClick={() => navigate(`/student-dashboard/test-results/${attempt._id}`)}
                          >
                            View Details
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              
              <Box sx={{ p: 2, bgcolor: '#f8f9fa', borderRadius: 1, fontSize: '0.85rem' }}>
                <Typography variant="body2" color="text.secondary">
                  <strong>Note:</strong> You need to score at least 70% to pass a level. Retake tests to improve your scores.
                </Typography>
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
              onClick={handleOpenConfirmStartDialog}
              disabled={questions.length === 0}
              size="large"
              sx={{ 
                px: 6, 
                py: 1.5, 
                fontSize: '1.1rem',
                ml: 4, // Add margin to separate from the Go Back button
                bgcolor: '#7445f8',
                '&:hover': {
                  bgcolor: '#7445f8',
                  opacity: 0.9,
                  boxShadow: '0 6px 10px rgba(116, 69, 248, 0.4)'
                },
                boxShadow: '0 4px 8px rgba(116, 69, 248, 0.3)',
                outline: '2px solid transparent', // Add outline for visibility even when hovered
                transition: 'all 0.3s ease',
                visibility: 'visible !important', // Ensure always visible
                position: 'relative',
                zIndex: 10
              }}
            >
              Start Test
            </Button>
          </Box>
          </Paper>
        
        {/* Confirmation Dialog */}
        <Dialog
          open={confirmStartDialogOpen}
          onClose={handleCloseConfirmStartDialog}
          aria-labelledby="start-test-confirmation-dialog"
        >
          <DialogTitle id="start-test-confirmation-dialog" sx={{ fontWeight: 'bold' }}>
            Start Test Confirmation
          </DialogTitle>
          <DialogContent>
            <DialogContentText>
              Are you sure you want to start the test? Once started, the timer will begin and you cannot pause the test.
            </DialogContentText>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 2 }}>
            <Button 
              onClick={handleCloseConfirmStartDialog}
              variant="outlined"
            >
              Cancel
            </Button>
            <Button 
              onClick={() => {
                handleCloseConfirmStartDialog();
                handleStartTest();
              }}
              variant="contained"
              color="primary"
              autoFocus
            >
              Start Test
            </Button>
          </DialogActions>
        </Dialog>
        </Box>
      </motion.div>
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
            p: 1.5,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderRadius: 0,
            borderBottom: '1px solid #e0e0e0',
            flexShrink: 0, // Prevent header from shrinking
            backgroundColor: '#f9fafb'
          }}
        >
          <Typography variant="h6" fontWeight="medium" sx={{ fontSize: '0.95rem' }}>
            {state?.subject && typeof state.subject === 'string' 
              ? `${state.subject.charAt(0).toUpperCase() + state.subject.slice(1)}${state?.stage ? ` - Stage ${state.stage}, Level ${state.level}` : ''}`
              : 'Test'}
          </Typography>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center',
              bgcolor: 'background.paper',
              py: 0.7,
              px: 2,
              borderRadius: 20,
              border: '1px solid',
              borderColor: testTimer < 300 ? "error.main" : testTimer < 600 ? "warning.main" : "primary.main"
            }}>
              <TimerIcon sx={{ 
                color: testTimer < 300 ? "error.main" : testTimer < 600 ? "warning.main" : "primary.main", 
                mr: 1,
                fontSize: '1rem'
              }} />
              <Typography variant="body1" fontWeight="bold" sx={{ 
                color: testTimer < 300 ? "error.main" : testTimer < 600 ? "warning.main" : "primary.main",
                fontSize: '0.9rem'
              }}>
                {formatTime(testTimer)}
              </Typography>
            </Box>
            
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              bgcolor: 'success.light', 
              py: 0.7, 
              px: 2, 
              borderRadius: 20,
              border: '1px solid',
              borderColor: 'success.main'
            }}>
              <Typography variant="body1" fontWeight="medium" color="success.dark" sx={{ fontSize: '0.9rem' }}>
                {Object.keys(answers).length}/{questions.length}
              </Typography>
            </Box>
          </Box>
        </Box>
        
        {/* Main test area */}
        <Box sx={{ 
          display: 'flex', 
          flexGrow: 1, 
          overflow: 'hidden',
          height: 'calc(100vh - 56px)', // Account for header height
          backgroundColor: '#f5f7fa'
        }}>
          {/* OMR Sheet (Left Panel) */}
          <Paper
            elevation={0}
            sx={{ 
              width: 230, 
              borderRight: '1px solid #e0e0e0',
              display: { xs: 'none', md: 'flex' },
              flexDirection: 'column',
              p: 2,
              backgroundColor: 'white'
            }}
          >
            <Typography variant="h6" fontWeight="bold" sx={{ mb: 2, fontSize: '0.95rem', color: 'text.primary' }}>
              Answer Sheet
            </Typography>
            
            <Box sx={{ mb: 3 }}>
              <LinearProgress 
                variant="determinate" 
                value={(Object.keys(answers).length / questions.length) * 100} 
                sx={{ height: 6, borderRadius: 3, mb: 1.5 }}
              />
              <Typography variant="body2" sx={{ textAlign: 'center', color: 'text.secondary', fontSize: '0.8rem' }}>
                {Object.keys(answers).length} of {questions.length} questions answered
              </Typography>
            </Box>
            
            <Grid container spacing={1} sx={{ mb: 3 }}>
              {questions.map((question, index) => {
                const questionId = question._id || question.id;
                const isAnswered = !!answers[questionId];
                const selectedOption = answers[questionId] || '';
                
                return (
                  <Grid item xs={3} key={questionId}>
                    <Button
                      variant={currentQuestionIndex === index ? "contained" : "outlined"}
                      color={isAnswered ? "success" : "primary"}
                      onClick={() => setCurrentQuestionIndex(index)}
                      size="small"
                      sx={{
                        minWidth: 'auto',
                        width: 36,
                        height: 36,
                        fontWeight: 'bold',
                        position: 'relative',
                        fontSize: '0.75rem',
                        p: 0
                      }}
                    >
                      {index + 1}
                      {isAnswered && (
                        <Box sx={{
                          position: 'absolute',
                          top: -4,
                          right: -4,
                          bgcolor: 'success.main',
                          color: 'white',
                          width: 16,
                          height: 16,
                          borderRadius: '50%',
                          fontSize: '0.6rem',
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
            
            {/* Answer Legend */}
            <Paper 
              elevation={0} 
              sx={{ 
                border: '1px solid',
                borderColor: 'divider',
                p: 1.5,
                borderRadius: 2,
                mb: 3,
                bgcolor: '#fafafa'
              }}
            >
              <Typography variant="subtitle2" sx={{ mb: 1, color: 'text.secondary', fontSize: '0.7rem' }}>
                ANSWER KEY
              </Typography>
              
              <Grid container spacing={1} sx={{ mb: 0.5 }}>
                {['A', 'B', 'C', 'D'].map(option => (
                  <Grid item xs={3} key={option}>
                    <Box sx={{
                      bgcolor: 'white',
                      border: '1px solid',
                      borderColor: 'divider',
                      borderRadius: '50%',
                      width: 32,
                      height: 32,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 'medium',
                      color: 'text.primary',
                      fontSize: '0.75rem',
                      mx: 'auto'
                    }}>
                      {option}
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </Paper>
            
            <Box sx={{ mt: 'auto', pt: 2, borderTop: '1px solid', borderColor: 'divider' }}>
              <Typography variant="body2" sx={{ mb: 0.5, color: 'text.secondary', fontSize: '0.75rem' }}>
                • Select an option and confirm your answer
              </Typography>
              <Typography variant="body2" sx={{ mb: 0.5, color: 'text.secondary', fontSize: '0.75rem' }}>
                • Use the navigation buttons to move between questions
              </Typography>
              <Typography variant="body2" sx={{ mb: 0.5, color: 'text.secondary', fontSize: '0.75rem' }}>
                • Submit when you're ready to finish the test
              </Typography>
            </Box>
          </Paper>
          
          {/* Question Display */}
          <Box sx={{ 
            flexGrow: 1, 
            p: { xs: 2, md: 3 }, 
            display: 'flex', 
            flexDirection: 'column',
            overflow: 'auto',
            height: '100%'
          }}>
            <Box sx={{ 
              maxWidth: 900, 
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
                mb: 2,
                pb: 1.5,
                borderBottom: '1px solid',
                borderColor: 'divider'
              }}>
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={handlePrevQuestion}
                  disabled={currentQuestionIndex === 0}
                  startIcon={<ArrowBackIcon />}
                  size="small"
                  sx={{ 
                    textTransform: 'none', 
                    borderRadius: 2,
                    mr: 2 // Add right margin to separate from the question counter
                  }}
                >
                  Previous
                </Button>
                <Typography variant="subtitle1" fontWeight="medium" sx={{ flex: 1, textAlign: 'center' }}>
                  Question {currentQuestionIndex + 1} of {questions.length}
                </Typography>
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={handleNextQuestion}
                  disabled={currentQuestionIndex === questions.length - 1}
                  endIcon={<ArrowForwardIcon />}
                  size="small"
                  sx={{ 
                    textTransform: 'none', 
                    borderRadius: 2,
                    ml: 2 // Add left margin to separate from the question counter
                  }}
                >
                  Next
                </Button>
              </Box>
              
              {/* Question Content */}
              <Paper 
                elevation={0} 
                sx={{ 
                  p: 3, 
                  flexGrow: 1, 
                  display: 'flex', 
                  flexDirection: 'column',
                  borderRadius: 3,
                  border: '1px solid',
                  borderColor: 'divider',
                  bgcolor: '#ffffff',
                  mb: 2,
                  boxShadow: '0px 2px 10px rgba(0, 0, 0, 0.05)'
                }}
              >
                <Box sx={{ mb: 3 }}>
                  <Typography variant="caption" color="text.secondary" gutterBottom sx={{ 
                    display: 'block',
                    fontSize: '0.7rem',
                    letterSpacing: '0.5px'
                  }}>
                    {state?.subject && typeof state.subject === 'string' 
                      ? `${state.subject.toUpperCase()}${state?.stage ? ` • STAGE ${state.stage} • LEVEL ${state.level}` : ''}`
                      : 'TEST'}
                  </Typography>
                  <Typography variant="h5" sx={{ fontWeight: 'medium', fontSize: '1.1rem', lineHeight: 1.4 }}>
                    {questions[currentQuestionIndex]?.questionText || "Loading question..."}
                  </Typography>
                </Box>
                
                {/* Image display area */}
                {questions[currentQuestionIndex]?.imageUrl && (
                  <Box sx={{ 
                    mb: 3, 
                    display: 'flex',
                    justifyContent: 'center',
                    p: 2,
                    bgcolor: 'white',
                    border: '1px solid',
                    borderColor: 'divider',
                    borderRadius: 2,
                    overflow: 'hidden'
                  }}>
                    <img 
                      src={getFullImageUrl(questions[currentQuestionIndex]?.imageUrl)}
                      alt="Question"
                      style={{
                        maxWidth: '100%',
                        maxHeight: 250,
                        objectFit: 'contain'
                      }}
                    />
                  </Box>
                )}
                
                {/* Options Section */}
                <Typography variant="subtitle1" fontWeight="medium" sx={{ mb: 2, fontSize: '0.9rem' }}>
                  Select your answer:
                </Typography>
                
                {questions[currentQuestionIndex] ? (
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, mb: 3 }}>
                    {['A', 'B', 'C', 'D'].map((option, optionIndex) => {
                      const currentQuestion = questions[currentQuestionIndex];
                      const questionId = currentQuestion?._id || currentQuestion?.id;
                      const isSelected = answers[currentQuestionIndex] === optionIndex;
                      const isConfirmed = false; // We'll just use selected state for simplicity
                      
                      // Get option text from the question
                      let optionText = '';
                      
                      // First try direct property access (optionA, optionB, etc.)
                      optionText = currentQuestion[`option${String.fromCharCode(65 + optionIndex)}`] || '';
                      
                      // If that fails, try the options array with proper error handling
                      if (!optionText && optionText !== 0) {
                        if (currentQuestion.options && Array.isArray(currentQuestion.options) && currentQuestion.options.length > 0) {
                          if (optionIndex < currentQuestion.options.length) {
                            optionText = currentQuestion.options[optionIndex] || `Option ${String.fromCharCode(65 + optionIndex)}`;
                          } else {
                            optionText = `Option ${String.fromCharCode(65 + optionIndex)}`;
                          }
                        }
                      }
                      
                      // If still no option text, show placeholder
                      if (!optionText && optionText !== 0) {
                        optionText = `Option ${String.fromCharCode(65 + optionIndex)}`;
                      }
                      
                      return (
                        <Paper
                          key={option}
                          elevation={0}
                          onClick={() => handleAnswerSelect(currentQuestionIndex, optionIndex)}
                          sx={{
                            p: 1.5,
                            border: '1.5px solid',
                            borderColor: isSelected ? 'primary.main' : 'divider',
                            borderRadius: 2,
                            transition: 'all 0.2s ease',
                            bgcolor: isSelected ? 'rgba(33, 150, 243, 0.08)' : 'white',
                            cursor: 'pointer',
                            '&:hover': {
                              bgcolor: '#f8f9fa',
                              borderColor: '#bdbdbd'
                            },
                            display: 'flex',
                            alignItems: 'center'
                          }}
                        >
                          <Box sx={{
                            width: 36,
                            height: 36,
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            bgcolor: isSelected ? 'primary.main' : '#f5f5f5',
                            color: isSelected ? 'white' : 'text.primary',
                                    fontWeight: 'medium',
                                    mr: 2,
                            fontSize: '0.9rem'
                          }}>
                            {String.fromCharCode(65 + optionIndex)}
                          </Box>
                          <Typography variant="body1" sx={{ 
                            fontWeight: 'normal',
                            wordBreak: 'break-word',
                            flex: 1,
                            fontSize: '0.9rem',
                            lineHeight: 1.5
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
                
                {/* Confirm Answer Button */}
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 'auto', pt: 2 }}>
                  <Button
                    variant="contained"
                    color="success"
                    onClick={handleConfirmAnswer}
                    disabled={answers[currentQuestionIndex] === undefined || answers[currentQuestionIndex] === null}
                    sx={{ 
                      px: 4, 
                      py: 1,
                      borderRadius: 30,
                      fontWeight: 'medium',
                      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                      textTransform: 'none',
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
        
        {/* Submit Test Button - Fixed position at the bottom */}
        <Box sx={{ 
          position: 'fixed',
          bottom: 20,
          right: 20,
          zIndex: 100
        }}>
          <Paper
            elevation={3}
            sx={{
              borderRadius: 30,
              bgcolor: 'white',
              boxShadow: '0 3px 10px rgba(0, 0, 0, 0.1)'
            }}
          >
            <Button
              variant="contained"
              color="primary"
              onClick={handleTestComplete}
              startIcon={<SendIcon />}
              sx={{ 
                px: 3, 
                py: 1.2, 
                borderRadius: 30,
                fontWeight: 'medium',
                textTransform: 'none',
                fontSize: '0.9rem'
              }}
            >
              Submit Test ({Object.keys(answers).length}/{questions.length})
            </Button>
          </Paper>
        </Box>
      </Box>
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
                    Avg. {Math.round(results.timeTaken / results.totalQuestions)} seconds per question
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Paper>

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
            
            <Button
              variant="contained"
              onClick={() => navigate('/student-dashboard')}
            >
              Continue to Dashboard
            </Button>
          </Box>
        </Container>
      </Box>
    );
  }

  // Return loading state as fallback
  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <CircularProgress />
    </Box>
  );
}

export default TestPage; 