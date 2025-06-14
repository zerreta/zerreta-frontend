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
  Avatar,
  Container
} from '@mui/material';
import {
  Timer as TimerIcon,
  ArrowBack as ArrowBackIcon,
  ArrowForward as ArrowForwardIcon,
  Check as CheckIcon,
  Clear as ClearIcon,
  Refresh as RefreshIcon,
  Calculate as CalculateIcon,
  Psychology as PsychologyIcon,
  RecordVoiceOver as VerbalIcon,
  Lock as LockIcon,
  Grade as GradeIcon,
  MenuBook as BookIcon,
  CheckCircle as CheckCircleIcon
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import axiosInstance from './axios-config';

// Questions will be fetched from backend

// Main component
const Apti = () => {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState(null);
  const [selectedGrade, setSelectedGrade] = useState(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState(null);
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [showGradeSelection, setShowGradeSelection] = useState(false);
  const [showDifficultySelection, setShowDifficultySelection] = useState(false);
  const [showTopicSelection, setShowTopicSelection] = useState(false);
  const [syllabus, setSyllabus] = useState({});
  const [availableTopics, setAvailableTopics] = useState([]);
  const [activeTest, setActiveTest] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [testComplete, setTestComplete] = useState(false);
  const [testResults, setTestResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [questions, setQuestions] = useState([]);
  
  const theme = useTheme();
  
  // Fetch syllabus on component mount
  useEffect(() => {
    fetchSyllabus();
  }, []);
  
  const fetchSyllabus = async () => {
    try {
      const response = await axiosInstance.get('/aptitude-syllabus');
      setSyllabus(response.data);
    } catch (err) {
      console.error('Error fetching syllabus:', err);
    }
  };
  
  // Timer effect for active test
  useEffect(() => {
    let timerId;
    
    if (activeTest && timeRemaining > 0 && !testComplete) {
      timerId = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            clearInterval(timerId);
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
  
  const handleCategoryClick = (category) => {
    setActiveCategory(category);
    setShowGradeSelection(true);
  };

  const handleGradeSelection = (grade) => {
    setSelectedGrade(grade);
    setShowGradeSelection(false);
    setShowDifficultySelection(true);
  };

  const handleDifficultySelection = (difficulty) => {
    if (difficulty === 'medium' || difficulty === 'hard') {
      alert('This difficulty level is locked. Complete Easy level first!');
      return;
    }
    setSelectedDifficulty(difficulty);
    setShowDifficultySelection(false);
    
    // Get available topics for this selection
    const topics = syllabus?.[selectedGrade]?.[activeCategory]?.[difficulty] || [];
    setAvailableTopics(topics);
    setShowTopicSelection(true);
  };

  const handleTopicSelection = (topic) => {
    setSelectedTopic(topic);
    setShowTopicSelection(false);
    fetchQuestionsAndStartTest();
  };

  const fetchQuestionsAndStartTest = async (difficultyOverride = null) => {
    try {
      setLoading(true);
      setError('');

      const response = await axiosInstance.get('/aptitude-questions', {
        params: {
          category: activeCategory,
          grade: selectedGrade,
          difficulty: difficultyOverride || selectedDifficulty,
          topic: selectedTopic
        }
      });

      if (response.data && response.data.length > 0) {
        setQuestions(response.data);
        startTest();
      } else {
        setError('No questions found for this category, grade, and difficulty level. Please try a different combination.');
      }
    } catch (err) {
      console.error('Error fetching aptitude questions:', err);
      setError('Failed to load questions. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  const startTest = () => {
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
    if (currentQuestionIndex < questions.length - 1) {
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
    
    questions.forEach(question => {
      const correctAnswer = question.options[question.correctOption];
      const isCorrect = userAnswers[question._id] === correctAnswer;
      if (isCorrect) correctCount++;
      
      questionResults.push({
        questionId: question._id,
        question: question.questionText,
        userAnswer: userAnswers[question._id] || null,
        correctAnswer: correctAnswer,
        isCorrect: isCorrect,
        explanation: question.explanation
      });
    });
    
    const score = (correctCount / questions.length) * 100;
    
    const results = {
      category: activeCategory,
      grade: selectedGrade,
      difficulty: selectedDifficulty,
      totalQuestions: questions.length,
      correctAnswers: correctCount,
      score: Math.round(score),
      timeTaken: 300 - timeRemaining,
      date: new Date().toISOString(),
      questionResults: questionResults
    };
    
    setTestResults(results);
  };
  
  const resetTest = () => {
    setActiveCategory(null);
    setSelectedGrade(null);
    setSelectedDifficulty(null);
    setSelectedTopic(null);
    setShowGradeSelection(false);
    setShowDifficultySelection(false);
    setShowTopicSelection(false);
    setAvailableTopics([]);
    setActiveTest(false);
    setCurrentQuestionIndex(0);
    setUserAnswers({});
    setTimeRemaining(0);
    setTestComplete(false);
    setTestResults(null);
    setQuestions([]);
    setError('');
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
      if (window.confirm('Are you sure you want to leave? Your progress will be lost.')) {
        resetTest();
      }
    } else if (showTopicSelection) {
      setShowTopicSelection(false);
      setShowDifficultySelection(true);
    } else if (showDifficultySelection) {
      setShowDifficultySelection(false);
      setShowGradeSelection(true);
    } else if (showGradeSelection) {
      setShowGradeSelection(false);
      setActiveCategory(null);
    } else if (activeCategory) {
      setActiveCategory(null);
    } else {
      navigate('/student-dashboard/skills');
    }
  };

     // Grade Selection Component
   const renderGradeSelection = () => (
     <Box sx={{ width: '100%' }}>
       <Typography variant="h4" fontWeight={700} color="#1e293b" gutterBottom align="center">
         Select Your Grade Level
       </Typography>
       <Typography variant="body1" color="#64748b" align="center" sx={{ mb: 4 }}>
         Choose your current grade to practice aptitude questions tailored to your level
       </Typography>
       
       <Grid container spacing={3}>
         <Grid item xs={12} md={6}>
           <Card
             sx={{
               height: '200px',
               borderRadius: 3,
               boxShadow: '0 2px 12px rgba(0, 0, 0, 0.04)',
               transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
               cursor: 'pointer',
               border: '1px solid #e2e8f0',
               backgroundColor: '#f8fafc',
               '&:hover': {
                 transform: 'translateY(-4px)',
                 boxShadow: '0 8px 25px rgba(59, 130, 246, 0.15)',
                 borderColor: '#3b82f6',
                 backgroundColor: '#f1f5f9'
               }
             }}
             onClick={() => handleGradeSelection('11')}
           >
             <CardContent sx={{ p: 4, height: '100%', display: 'flex', alignItems: 'center' }}>
               <Avatar
                 sx={{
                   backgroundColor: '#dbeafe',
                   color: '#1e40af',
                   width: 80,
                   height: 80,
                   mr: 3,
                   fontSize: '2rem',
                   fontWeight: 700
                 }}
               >
                 <GradeIcon sx={{ fontSize: '2.5rem' }} />
               </Avatar>
               <Box sx={{ flex: 1 }}>
                 <Typography variant="h4" fontWeight={600} color="#1e293b" gutterBottom>
                   Grade 11
                 </Typography>
                 <Typography variant="body1" color="#64748b" sx={{ mb: 2 }}>
                   Foundation level questions covering basic mathematical concepts and problem-solving
                 </Typography>
                 <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                   <Chip label="Basic Algebra" size="small" sx={{ bgcolor: '#dbeafe', color: '#1e40af' }} />
                   <Chip label="Arithmetic" size="small" sx={{ bgcolor: '#dbeafe', color: '#1e40af' }} />
                   <Chip label="Geometry" size="small" sx={{ bgcolor: '#dbeafe', color: '#1e40af' }} />
                 </Box>
               </Box>
             </CardContent>
           </Card>
         </Grid>
         
         <Grid item xs={12} md={6}>
           <Card
             sx={{
               height: '200px',
               borderRadius: 3,
               boxShadow: '0 2px 12px rgba(0, 0, 0, 0.04)',
               transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
               cursor: 'pointer',
               border: '1px solid #e2e8f0',
               backgroundColor: '#f8fafc',
               '&:hover': {
                 transform: 'translateY(-4px)',
                 boxShadow: '0 8px 25px rgba(16, 185, 129, 0.15)',
                 borderColor: '#10b981',
                 backgroundColor: '#f1f5f9'
               }
             }}
             onClick={() => handleGradeSelection('12')}
           >
             <CardContent sx={{ p: 4, height: '100%', display: 'flex', alignItems: 'center' }}>
               <Avatar
                 sx={{
                   backgroundColor: '#dcfce7',
                   color: '#166534',
                   width: 80,
                   height: 80,
                   mr: 3,
                   fontSize: '2rem',
                   fontWeight: 700
                 }}
               >
                 <GradeIcon sx={{ fontSize: '2.5rem' }} />
               </Avatar>
               <Box sx={{ flex: 1 }}>
                 <Typography variant="h4" fontWeight={600} color="#1e293b" gutterBottom>
                   Grade 12
                 </Typography>
                 <Typography variant="body1" color="#64748b" sx={{ mb: 2 }}>
                   Advanced level questions with complex problem-solving and competitive exam preparation
                 </Typography>
                 <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                   <Chip label="Advanced Calculus" size="small" sx={{ bgcolor: '#dcfce7', color: '#166534' }} />
                   <Chip label="Statistics" size="small" sx={{ bgcolor: '#dcfce7', color: '#166534' }} />
                   <Chip label="Complex Problems" size="small" sx={{ bgcolor: '#dcfce7', color: '#166534' }} />
                 </Box>
               </Box>
             </CardContent>
           </Card>
         </Grid>
       </Grid>
     </Box>
   );

   // Difficulty Selection Component
   const renderDifficultySelection = () => (
     <Box sx={{ maxWidth: 1000, mx: 'auto' }}>
       <Typography variant="h4" fontWeight={700} color="#1e293b" gutterBottom align="center">
         Select Difficulty Level
       </Typography>
       <Typography variant="body1" color="#64748b" align="center" sx={{ mb: 4 }}>
         Choose your difficulty level for Grade {selectedGrade} {activeCategory === 'quantitative' ? 'Quantitative Aptitude' : activeCategory === 'logical' ? 'Logical Reasoning' : 'Verbal Ability'}
       </Typography>
       
       <Grid container spacing={4} justifyContent="center">
         {/* Easy - Unlocked */}
         <Grid item xs={12} sm={6} md={4}>
           <Card
             sx={{
               height: '100%',
               borderRadius: 3,
               boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
               transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
               cursor: 'pointer',
               border: '2px solid #e2e8f0',
               '&:hover': {
                 transform: 'translateY(-8px)',
                 boxShadow: '0 12px 40px rgba(34, 197, 94, 0.25)',
                 borderColor: '#22c55e'
               }
             }}
             onClick={() => handleDifficultySelection('easy')}
           >
             <CardContent sx={{ p: 4, textAlign: 'center' }}>
                                <Avatar
                   sx={{
                     backgroundColor: '#22c55e',
                     width: 60,
                     height: 60,
                     mx: 'auto',
                     mb: 2
                   }}
                 >
                   <CheckCircleIcon sx={{ fontSize: '2rem' }} />
                 </Avatar>
               <Typography variant="h5" fontWeight={600} color="#1e293b" gutterBottom>
                 Easy
               </Typography>
               <Typography variant="body2" color="#64748b" sx={{ mb: 3 }}>
                 Basic level questions to build your foundation and confidence
               </Typography>
               <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mb: 3 }}>
                 <Chip label="Foundation Level" size="small" sx={{ bgcolor: '#dcfce7', color: '#166534' }} />
                 <Chip label="10 Questions" size="small" sx={{ bgcolor: '#dcfce7', color: '#166534' }} />
                 <Chip label="5 Minutes" size="small" sx={{ bgcolor: '#dcfce7', color: '#166534' }} />
               </Box>
               <Button
                 variant="contained"
                 sx={{
                   bgcolor: '#22c55e',
                   color: 'white',
                   '&:hover': { bgcolor: '#16a34a' },
                   width: '100%',
                   py: 1.5
                 }}
               >
                 Start Test
               </Button>
             </CardContent>
           </Card>
         </Grid>
         
         {/* Medium - Locked */}
         <Grid item xs={12} sm={6} md={4}>
           <Card
             sx={{
               height: '100%',
               borderRadius: 3,
               boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
               transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
               cursor: 'not-allowed',
               border: '2px solid #e2e8f0',
               opacity: 0.6
             }}
             onClick={() => handleDifficultySelection('medium')}
           >
             <CardContent sx={{ p: 4, textAlign: 'center' }}>
               <Avatar
                 sx={{
                   backgroundColor: '#9ca3af',
                   width: 60,
                   height: 60,
                   mx: 'auto',
                   mb: 2
                 }}
               >
                 <LockIcon sx={{ fontSize: '1.5rem' }} />
               </Avatar>
               <Typography variant="h5" fontWeight={600} color="#6b7280" gutterBottom>
                 Medium
               </Typography>
               <Typography variant="body2" color="#9ca3af" sx={{ mb: 3 }}>
                 Intermediate level questions with moderate complexity
               </Typography>
               <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mb: 3 }}>
                 <Chip label="Intermediate Level" size="small" sx={{ bgcolor: '#f3f4f6', color: '#6b7280' }} />
                 <Chip label="15 Questions" size="small" sx={{ bgcolor: '#f3f4f6', color: '#6b7280' }} />
                 <Chip label="8 Minutes" size="small" sx={{ bgcolor: '#f3f4f6', color: '#6b7280' }} />
               </Box>
               <Button
                 variant="outlined"
                 disabled
                 sx={{
                   borderColor: '#9ca3af',
                   color: '#9ca3af',
                   width: '100%',
                   py: 1.5
                 }}
               >
                 🔒 Locked
               </Button>
             </CardContent>
           </Card>
         </Grid>
         
         {/* Hard - Locked */}
         <Grid item xs={12} sm={6} md={4}>
           <Card
             sx={{
               height: '100%',
               borderRadius: 3,
               boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
               transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
               cursor: 'not-allowed',
               border: '2px solid #e2e8f0',
               opacity: 0.6
             }}
             onClick={() => handleDifficultySelection('hard')}
           >
             <CardContent sx={{ p: 4, textAlign: 'center' }}>
               <Avatar
                 sx={{
                   backgroundColor: '#9ca3af',
                   width: 60,
                   height: 60,
                   mx: 'auto',
                   mb: 2
                 }}
               >
                 <LockIcon sx={{ fontSize: '1.5rem' }} />
               </Avatar>
               <Typography variant="h5" fontWeight={600} color="#6b7280" gutterBottom>
                 Hard
               </Typography>
               <Typography variant="body2" color="#9ca3af" sx={{ mb: 3 }}>
                 Advanced level questions for competitive exam preparation
               </Typography>
               <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mb: 3 }}>
                 <Chip label="Advanced Level" size="small" sx={{ bgcolor: '#f3f4f6', color: '#6b7280' }} />
                 <Chip label="20 Questions" size="small" sx={{ bgcolor: '#f3f4f6', color: '#6b7280' }} />
                 <Chip label="12 Minutes" size="small" sx={{ bgcolor: '#f3f4f6', color: '#6b7280' }} />
               </Box>
               <Button
                 variant="outlined"
                 disabled
                 sx={{
                   borderColor: '#9ca3af',
                   color: '#9ca3af',
                   width: '100%',
                   py: 1.5
                 }}
               >
                 🔒 Locked
               </Button>
             </CardContent>
           </Card>
         </Grid>
       </Grid>
     </Box>
   );

   // Topic Selection Component
   const renderTopicSelection = () => (
     <Box sx={{ maxWidth: 1200, mx: 'auto' }}>
       <Typography variant="h4" fontWeight={700} color="#1e293b" gutterBottom align="center">
         Select Topic
       </Typography>
       <Typography variant="body1" color="#64748b" align="center" sx={{ mb: 4 }}>
         Choose a specific topic for Grade {selectedGrade} {selectedDifficulty?.charAt(0).toUpperCase() + selectedDifficulty?.slice(1)} level {activeCategory === 'quantitative' ? 'Quantitative Aptitude' : activeCategory === 'logical' ? 'Logical Reasoning' : 'Verbal Ability'}
       </Typography>
       
       <Grid container spacing={3}>
         {availableTopics.map((topic, index) => (
           <Grid item xs={12} sm={6} md={4} key={topic}>
             <Card
               sx={{
                 height: '140px',
                 borderRadius: 3,
                 boxShadow: '0 2px 12px rgba(0, 0, 0, 0.04)',
                 transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                 cursor: 'pointer',
                 border: '1px solid #e2e8f0',
                 backgroundColor: '#f8fafc',
                 '&:hover': {
                   transform: 'translateY(-4px)',
                   boxShadow: '0 8px 25px rgba(99, 102, 241, 0.15)',
                   borderColor: '#6366f1',
                   backgroundColor: '#f1f5f9'
                 }
               }}
               onClick={() => handleTopicSelection(topic)}
             >
               <CardContent sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                 <Avatar
                   sx={{
                     backgroundColor: '#e0e7ff',
                     color: '#4338ca',
                     width: 50,
                     height: 50,
                     mb: 2,
                     fontSize: '1.5rem'
                   }}
                 >
                   <BookIcon />
                 </Avatar>
                 <Typography 
                   variant="h6" 
                   fontWeight={600} 
                   color="#1e293b" 
                   align="center"
                   sx={{ 
                     fontSize: '0.95rem',
                     lineHeight: 1.3
                   }}
                 >
                   {topic}
                 </Typography>
               </CardContent>
             </Card>
           </Grid>
         ))}
         
         <Grid item xs={12} sm={6} md={4}>
           <Card
             sx={{
               height: '140px',
               borderRadius: 3,
               boxShadow: '0 2px 12px rgba(0, 0, 0, 0.04)',
               transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
               cursor: 'pointer',
               border: '2px dashed #cbd5e1',
               backgroundColor: '#f8fafc',
               '&:hover': {
                 transform: 'translateY(-4px)',
                 boxShadow: '0 8px 25px rgba(168, 85, 247, 0.15)',
                 borderColor: '#a855f7',
                 backgroundColor: '#faf5ff'
               }
             }}
             onClick={() => handleTopicSelection(null)} // All topics
           >
             <CardContent sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
               <Avatar
                 sx={{
                   backgroundColor: '#f3e8ff',
                   color: '#7c3aed',
                   width: 50,
                   height: 50,
                   mb: 2,
                   fontSize: '1.5rem'
                 }}
               >
                 ✨
               </Avatar>
               <Typography 
                 variant="h6" 
                 fontWeight={600} 
                 color="#7c3aed" 
                 align="center"
                 sx={{ 
                   fontSize: '0.95rem',
                   lineHeight: 1.3
                 }}
               >
                 All Topics Mixed
               </Typography>
             </CardContent>
           </Card>
         </Grid>
       </Grid>
     </Box>
   );
   
   // Main Category Selection Component
  const renderCategorySelection = () => (
    <Box>
      <Grid container spacing={4}>
        {/* Quantitative Aptitude - Unlocked */}
        <Grid item xs={12} md={4}>
          <Card 
            sx={{ 
              height: '100%',
              borderRadius: 3,
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              cursor: 'pointer',
              border: '2px solid #e2e8f0',
              '&:hover': {
                transform: 'translateY(-8px)',
                boxShadow: '0 12px 40px rgba(59, 130, 246, 0.25)',
                borderColor: '#3b82f6'
              }
            }}
            onClick={() => handleCategoryClick('quantitative')}
          >
            {/* Gradient overlay */}
            <Box
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: 6,
                background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)'
              }}
            />
            
            <CardContent sx={{ p: 4 }}>
              <Box sx={{ textAlign: 'center', mb: 3 }}>
                <Avatar
                  sx={{
                    backgroundColor: '#3b82f6',
                    width: 64,
                    height: 64,
                    mx: 'auto',
                    mb: 2
                  }}
                >
                  <CalculateIcon sx={{ fontSize: '2rem' }} />
                </Avatar>
                <Typography variant="h5" fontWeight={600} color="#1e293b" gutterBottom>
                  Quantitative Aptitude
                </Typography>
                <Typography variant="body2" color="#64748b" sx={{ mb: 2 }}>
                  Master mathematical problem-solving with numbers, algebra, geometry, and data interpretation
                </Typography>
              </Box>
              
              <Box sx={{ mb: 3 }}>
                <Typography variant="caption" fontWeight={600} color="#374151" sx={{ mb: 1, display: 'block' }}>
                  Available Levels:
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                  <Chip label="Grade 11" size="small" sx={{ bgcolor: '#dbeafe', color: '#1e40af' }} />
                  <Chip label="Grade 12" size="small" sx={{ bgcolor: '#dcfce7', color: '#166534' }} />
                </Box>
              </Box>
              
              <Box sx={{ 
                pt: 2, 
                borderTop: '1px solid #e5e7eb',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <GradeIcon sx={{ fontSize: '1.2rem', color: '#3b82f6' }} />
                  <Typography variant="caption" color="#64748b" fontWeight={500}>
                    Choose Your Level
                  </Typography>
                </Box>
                
                <Chip 
                  label="Available" 
                  size="small" 
                  sx={{ 
                    bgcolor: '#10b981', 
                    color: 'white',
                    fontWeight: 600
                  }} 
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
                 {/* Logical Reasoning - Unlocked */}
         <Grid item xs={12} md={4}>
           <Card 
             sx={{ 
               height: '100%',
               borderRadius: 3,
               boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
               transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
               cursor: 'pointer',
               border: '2px solid #e2e8f0',
               '&:hover': {
                 transform: 'translateY(-8px)',
                 boxShadow: '0 12px 40px rgba(147, 51, 234, 0.25)',
                 borderColor: '#9333ea'
               }
             }}
             onClick={() => handleCategoryClick('logical')}
           >
             {/* Gradient overlay */}
             <Box
               sx={{
                 position: 'absolute',
                 top: 0,
                 left: 0,
                 right: 0,
                 height: 6,
                 background: 'linear-gradient(135deg, #9333ea 0%, #7c3aed 100%)'
               }}
             />
             
             <CardContent sx={{ p: 4 }}>
               <Box sx={{ textAlign: 'center', mb: 3 }}>
                 <Avatar
                   sx={{
                     backgroundColor: '#9333ea',
                     width: 64,
                     height: 64,
                     mx: 'auto',
                     mb: 2
                   }}
                 >
                   <PsychologyIcon sx={{ fontSize: '2rem' }} />
                 </Avatar>
                 <Typography variant="h5" fontWeight={600} color="#1e293b" gutterBottom>
                   Logical Reasoning
                 </Typography>
                 <Typography variant="body2" color="#64748b" sx={{ mb: 2 }}>
                   Enhance logical thinking with pattern recognition, sequences, and analytical reasoning
                 </Typography>
               </Box>
               
               <Box sx={{ mb: 3 }}>
                 <Typography variant="caption" fontWeight={600} color="#374151" sx={{ mb: 1, display: 'block' }}>
                   Available Levels:
                 </Typography>
                 <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                   <Chip label="Grade 11" size="small" sx={{ bgcolor: '#f3e8ff', color: '#7c3aed' }} />
                   <Chip label="Grade 12" size="small" sx={{ bgcolor: '#ede9fe', color: '#8b5cf6' }} />
                 </Box>
               </Box>
               
               <Box sx={{ 
                 pt: 2, 
                 borderTop: '1px solid #e5e7eb',
                 display: 'flex',
                 alignItems: 'center',
                 justifyContent: 'space-between'
               }}>
                 <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                   <GradeIcon sx={{ fontSize: '1.2rem', color: '#9333ea' }} />
                   <Typography variant="caption" color="#64748b" fontWeight={500}>
                     Choose Your Level
                   </Typography>
                 </Box>
                 
                 <Chip 
                   label="Available" 
                   size="small" 
                   sx={{ 
                     bgcolor: '#10b981', 
                     color: 'white',
                     fontWeight: 600
                   }} 
                 />
               </Box>
             </CardContent>
           </Card>
         </Grid>
        
                 {/* Verbal Ability - Unlocked */}
         <Grid item xs={12} md={4}>
           <Card 
             sx={{ 
               height: '100%',
               borderRadius: 3,
               boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
               transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
               cursor: 'pointer',
               border: '2px solid #e2e8f0',
               '&:hover': {
                 transform: 'translateY(-8px)',
                 boxShadow: '0 12px 40px rgba(251, 146, 60, 0.25)',
                 borderColor: '#fb923c'
               }
             }}
             onClick={() => handleCategoryClick('verbal')}
           >
             {/* Gradient overlay */}
             <Box
               sx={{
                 position: 'absolute',
                 top: 0,
                 left: 0,
                 right: 0,
                 height: 6,
                 background: 'linear-gradient(135deg, #fb923c 0%, #f97316 100%)'
               }}
             />
             
             <CardContent sx={{ p: 4 }}>
               <Box sx={{ textAlign: 'center', mb: 3 }}>
                 <Avatar
                   sx={{
                     backgroundColor: '#fb923c',
                     width: 64,
                     height: 64,
                     mx: 'auto',
                     mb: 2
                   }}
                 >
                   <VerbalIcon sx={{ fontSize: '2rem' }} />
                 </Avatar>
                 <Typography variant="h5" fontWeight={600} color="#1e293b" gutterBottom>
                   Verbal Ability
                 </Typography>
                 <Typography variant="body2" color="#64748b" sx={{ mb: 2 }}>
                   Improve vocabulary, comprehension, and communication skills through various exercises
                 </Typography>
               </Box>
               
               <Box sx={{ mb: 3 }}>
                 <Typography variant="caption" fontWeight={600} color="#374151" sx={{ mb: 1, display: 'block' }}>
                   Available Levels:
                 </Typography>
                 <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                   <Chip label="Grade 11" size="small" sx={{ bgcolor: '#fff7ed', color: '#ea580c' }} />
                   <Chip label="Grade 12" size="small" sx={{ bgcolor: '#fed7aa', color: '#c2410c' }} />
                 </Box>
               </Box>
               
               <Box sx={{ 
                 pt: 2, 
                 borderTop: '1px solid #e5e7eb',
                 display: 'flex',
                 alignItems: 'center',
                 justifyContent: 'space-between'
               }}>
                 <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                   <GradeIcon sx={{ fontSize: '1.2rem', color: '#fb923c' }} />
                   <Typography variant="caption" color="#64748b" fontWeight={500}>
                     Choose Your Level
                   </Typography>
                 </Box>
                 
                 <Chip 
                   label="Available" 
                   size="small" 
                   sx={{ 
                     bgcolor: '#10b981', 
                     color: 'white',
                     fontWeight: 600
                   }} 
                 />
               </Box>
             </CardContent>
           </Card>
         </Grid>
      </Grid>
    </Box>
  );

    const renderActiveTest = () => {
    if (loading) {
      return (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
          <CircularProgress />
          <Typography sx={{ ml: 2 }}>Loading questions...</Typography>
        </Box>
      );
    }

    if (error) {
      return (
        <Box sx={{ p: 4 }}>
          <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>
          <Button onClick={resetTest} variant="contained">
            Back to Categories
          </Button>
        </Box>
      );
    }

    if (!questions || questions.length === 0) {
      return (
        <Box sx={{ p: 4 }}>
          <Alert severity="warning" sx={{ mb: 2 }}>
            No questions available for this category, grade, and difficulty level.
          </Alert>
          <Button onClick={resetTest} variant="contained">
            Back to Categories
          </Button>
        </Box>
      );
    }

    const currentQuestion = questions[currentQuestionIndex];
    const hasAnswered = userAnswers[currentQuestion._id] !== undefined;
    
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
          {questions.map((q, index) => (
            <Step key={q._id}>
              <StepLabel
                optional={
                  userAnswers[q._id] ? 
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
            p: 4, 
            borderRadius: 3,
            border: '1px solid #e2e8f0'
          }}
        >
          <Box sx={{ mb: 3 }}>
            <Typography variant="body2" color="text.secondary" gutterBottom>
                              Question {currentQuestionIndex + 1} of {questions.length}
            </Typography>
            
            <LinearProgress 
              variant="determinate" 
                              value={(currentQuestionIndex + 1) / questions.length * 100}
              sx={{ 
                height: 6, 
                borderRadius: 3,
                mb: 3,
                bgcolor: '#f1f5f9',
                '& .MuiLinearProgress-bar': {
                  bgcolor: '#3b82f6'
                }
              }}
            />
          </Box>
          
          <Typography variant="h6" gutterBottom sx={{ lineHeight: 1.6 }}>
                          {currentQuestion.questionText}
          </Typography>
          
          <FormControl component="fieldset" sx={{ width: '100%', mt: 3 }}>
            <RadioGroup
              value={userAnswers[currentQuestion._id] || ''}
              onChange={(e) => handleAnswer(currentQuestion._id, e.target.value)}
            >
              {currentQuestion.options.map((option, index) => (
                <FormControlLabel
                  key={index}
                  value={option}
                  control={<Radio />}
                  label={option}
                  sx={{
                    mb: 1,
                    p: 2,
                    border: '1px solid #e2e8f0',
                    borderRadius: 2,
                    margin: '4px 0',
                    '&:hover': {
                      bgcolor: '#f8fafc'
                    },
                    '& .MuiFormControlLabel-label': {
                      fontSize: '1rem'
                    }
                  }}
                />
              ))}
            </RadioGroup>
          </FormControl>
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
            <Button
              variant="outlined"
              startIcon={<ArrowBackIcon />}
              onClick={prevQuestion}
              disabled={currentQuestionIndex === 0}
            >
              Previous
            </Button>
            
            <Button
              variant="contained"
              endIcon={currentQuestionIndex === questions.length - 1 ? 
                <CheckIcon /> : <ArrowForwardIcon />}
              onClick={nextQuestion}
              disabled={!hasAnswered}
              sx={{ 
                bgcolor: '#3b82f6',
                '&:hover': {
                  bgcolor: '#1d4ed8',
                }
              }}
            >
              {currentQuestionIndex === questions.length - 1 ? 
                'Complete Test' : 'Next Question'}
            </Button>
          </Box>
        </Paper>
      </Box>
    );
  };

  const renderTestResults = () => (
    <Box>
      <Paper 
        elevation={3} 
        sx={{ 
          p: 4, 
          borderRadius: 3, 
          textAlign: 'center',
          border: `2px solid ${getScoreColor(testResults.score)}`,
          background: `linear-gradient(135deg, ${getScoreColor(testResults.score)}15, white)`
        }}
      >
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          Test Complete!
        </Typography>
        
        <Typography variant="h1" fontWeight="bold" sx={{ color: getScoreColor(testResults.score), mb: 2 }}>
          {testResults.score}%
        </Typography>
        
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
      
      <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>
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
          <Typography variant="body2" sx={{ fontStyle: 'italic' }}>
            {result.explanation}
          </Typography>
        </Paper>
      ))}
      
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <Button
          variant="contained"
          startIcon={<RefreshIcon />}
          onClick={resetTest}
          sx={{ 
            bgcolor: '#3b82f6',
            px: 4,
            '&:hover': {
              bgcolor: '#1d4ed8',
            }
          }}
        >
          Take Another Test
        </Button>
      </Box>
    </Box>
  );
  
  return (
    <Box sx={{ 
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: 1300,
      backgroundColor: '#f8fafc',
      overflow: 'auto'
    }}>
      {/* Hero Section */}
      <Box sx={{ 
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        py: 6
      }}>
        <Container maxWidth="lg">
          <Box sx={{ 
            display: 'flex', 
            alignItems: { xs: 'flex-start', sm: 'center' }, 
            flexDirection: { xs: 'column', sm: 'row' },
            gap: 2, 
            mb: 3 
          }}>
            <Box sx={{ flexGrow: 1 }}>
              <Typography variant="h3" fontWeight={700} sx={{ 
                fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
                mb: 1
              }}>
                Aptitude Training
              </Typography>
              <Typography variant="h6" sx={{ opacity: 0.9, mb: 1 }}>
                Enhance Your Problem-Solving Skills
              </Typography>
              <Typography variant="body1" sx={{ opacity: 0.8 }}>
                Practice quantitative aptitude, logical reasoning, and verbal ability with structured learning paths
              </Typography>
            </Box>
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
              {activeTest || testComplete ? 'Exit Test' : 
               showTopicSelection ? 'Back to Difficulty Selection' :
               showDifficultySelection ? 'Back to Grade Selection' :
               showGradeSelection ? 'Back to Categories' : 
               activeCategory ? 'Back to Categories' : 
               'Back to Skills'}
            </Button>
          </Box>
        </Container>
      </Box>

      {/* Main Content */}
      <Container maxWidth="lg" sx={{ py: 6 }}>
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
                 {!activeCategory && !showGradeSelection && !showDifficultySelection && !showTopicSelection && !activeTest && !testComplete && renderCategorySelection()}
        {showGradeSelection && !showDifficultySelection && !showTopicSelection && renderGradeSelection()}
        {showDifficultySelection && !showTopicSelection && renderDifficultySelection()}
        {showTopicSelection && renderTopicSelection()}
                  {activeTest && !testComplete && renderActiveTest()}
         {testComplete && renderTestResults()}

         {/* Syllabus Section - Only show on main category page */}
         {!activeCategory && !showGradeSelection && !showDifficultySelection && !showTopicSelection && !activeTest && !testComplete && (
           <Box sx={{ mt: 6, p: 4, backgroundColor: 'white', borderRadius: 3, boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
             <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
               <Avatar sx={{ bgcolor: '#3b82f6', width: 48, height: 48, mr: 2 }}>
                 <BookIcon />
               </Avatar>
               <Typography variant="h5" fontWeight={600} color="#1e293b">
                 Aptitude Test Syllabus
               </Typography>
             </Box>
             
             <Grid container spacing={4}>
               <Grid item xs={12} md={4}>
                 <Box sx={{ p: 3, backgroundColor: '#f8fafc', borderRadius: 2 }}>
                   <Typography variant="h6" fontWeight={600} color="#3b82f6" gutterBottom>
                     Quantitative Aptitude
                   </Typography>
                   <Typography variant="body2" color="#64748b" sx={{ mb: 2 }}>
                     Mathematical problem-solving and numerical reasoning
                   </Typography>
                   <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                     <Typography variant="body2">• Arithmetic & Number Systems</Typography>
                     <Typography variant="body2">• Algebra & Equations</Typography>
                     <Typography variant="body2">• Geometry & Mensuration</Typography>
                     <Typography variant="body2">• Data Interpretation</Typography>
                     <Typography variant="body2">• Percentage & Ratios</Typography>
                     <Typography variant="body2">• Time, Speed & Distance</Typography>
                   </Box>
                 </Box>
               </Grid>
               
               <Grid item xs={12} md={4}>
                 <Box sx={{ p: 3, backgroundColor: '#f8fafc', borderRadius: 2 }}>
                   <Typography variant="h6" fontWeight={600} color="#9333ea" gutterBottom>
                     Logical Reasoning
                   </Typography>
                   <Typography variant="body2" color="#64748b" sx={{ mb: 2 }}>
                     Pattern recognition and analytical thinking
                   </Typography>
                   <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                     <Typography variant="body2">• Series & Patterns</Typography>
                     <Typography variant="body2">• Coding & Decoding</Typography>
                     <Typography variant="body2">• Blood Relations</Typography>
                     <Typography variant="body2">• Direction & Rankings</Typography>
                     <Typography variant="body2">• Logical Puzzles</Typography>
                     <Typography variant="body2">• Syllogism</Typography>
                   </Box>
                 </Box>
               </Grid>
               
               <Grid item xs={12} md={4}>
                 <Box sx={{ p: 3, backgroundColor: '#f8fafc', borderRadius: 2 }}>
                   <Typography variant="h6" fontWeight={600} color="#fb923c" gutterBottom>
                     Verbal Ability
                   </Typography>
                   <Typography variant="body2" color="#64748b" sx={{ mb: 2 }}>
                     Language skills and comprehension
                   </Typography>
                   <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                     <Typography variant="body2">• Vocabulary & Synonyms</Typography>
                     <Typography variant="body2">• Antonyms & Analogies</Typography>
                     <Typography variant="body2">• Reading Comprehension</Typography>
                     <Typography variant="body2">• Grammar & Usage</Typography>
                     <Typography variant="body2">• Sentence Completion</Typography>
                     <Typography variant="body2">• Para Jumbles</Typography>
                   </Box>
                 </Box>
               </Grid>
             </Grid>
             
             <Box sx={{ mt: 4, p: 3, backgroundColor: '#f0f9ff', borderRadius: 2, border: '1px solid #bae6fd' }}>
               <Typography variant="h6" fontWeight={600} color="#1e293b" gutterBottom>
                 📋 Test Structure & Guidelines
               </Typography>
               <Grid container spacing={3} sx={{ mt: 1 }}>
                 <Grid item xs={12} md={6}>
                   <Typography variant="body2" color="#475569" sx={{ mb: 1 }}>
                     ⏱️ <strong>Time Limits:</strong> Easy (5 min), Medium (8 min), Hard (12 min)
                   </Typography>
                   <Typography variant="body2" color="#475569" sx={{ mb: 1 }}>
                     📝 <strong>Question Types:</strong> Multiple choice questions with 4 options
                   </Typography>
                   <Typography variant="body2" color="#475569">
                     🎯 <strong>Scoring:</strong> +1 for correct answer, 0 for wrong/unattempted
                   </Typography>
                 </Grid>
                 <Grid item xs={12} md={6}>
                   <Typography variant="body2" color="#475569" sx={{ mb: 1 }}>
                     📊 <strong>Difficulty Levels:</strong> Progressive unlocking system
                   </Typography>
                   <Typography variant="body2" color="#475569" sx={{ mb: 1 }}>
                     🎓 <strong>Grade Levels:</strong> Separate question sets for Grade 11 & 12
                   </Typography>
                   <Typography variant="body2" color="#475569">
                     📈 <strong>Progress Tracking:</strong> Detailed performance analytics
                   </Typography>
                 </Grid>
               </Grid>
             </Box>
           </Box>
         )}
       </Container>
     </Box>
   );
};

export default Apti; 