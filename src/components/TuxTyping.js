import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Paper,
  Typography,
  Button,
  Grid,
  Avatar,
  Chip,
  Card,
  CardContent,
  CardActions,
  LinearProgress
} from '@mui/material';

// Material Icons
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import KeyboardIcon from '@mui/icons-material/Keyboard';
import HomeIcon from '@mui/icons-material/Home';
import PetsIcon from '@mui/icons-material/Pets';
import BrushIcon from '@mui/icons-material/Brush';
import SchoolIcon from '@mui/icons-material/School';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import FunctionsIcon from '@mui/icons-material/Functions';
import PublicIcon from '@mui/icons-material/Public';
import SpeedIcon from '@mui/icons-material/Speed';
import TimerIcon from '@mui/icons-material/Timer';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import GpsFixedIcon from '@mui/icons-material/GpsFixed';
import TrackChangesIcon from '@mui/icons-material/TrackChanges';

// Grade 3 Typing Lessons - 10 Unique Lessons
const typingLessonsGrade3 = {
  fundamentals: [
    {
      id: 1,
      title: "Home Row Magic",
      level: "Beginner",
      description: "Master the home row keys",
      text: "asdf jkl; dad sad all fall ask lad shall",
      targetWPM: 8,
      timeLimit: 120,
      icon: HomeIcon,
      color: "#e91e63"
    },
    {
      id: 2,
      title: "Animal Friends",
      level: "Easy",
      description: "Type animal names",
      text: "cat dog pig cow hen fox bee bat rat ant elk owl jay duck lamb goat bear deer fish bird frog",
      targetWPM: 10,
      timeLimit: 100,
      icon: PetsIcon,
      color: "#4caf50"
    },
    {
      id: 3,
      title: "Rainbow Colors",
      level: "Easy",
      description: "Practice typing colors",
      text: "red blue green yellow pink purple orange black white brown gray silver gold",
      targetWPM: 12,
      timeLimit: 90,
      icon: BrushIcon,
      color: "#ff9800"
    },
    {
      id: 4,
      title: "My School Day",
      level: "Easy",
      description: "Words about school",
      text: "school teacher book pen desk chair friend class read write learn study play",
      targetWPM: 10,
      timeLimit: 110,
      icon: SchoolIcon,
      color: "#9c27b0"
    },
    {
      id: 5,
      title: "Family Love",
      level: "Easy",
      description: "Family member names",
      text: "mom dad sister brother baby grandma grandpa uncle aunt cousin family love",
      targetWPM: 11,
      timeLimit: 105,
      icon: HomeIcon,
      color: "#795548"
    }
  ],
  stories: [
    {
      id: 6,
      title: "My Pet Cat",
      level: "Intermediate",
      description: "A story about a pet",
      text: "I have a pet cat. Her name is Bella. She likes to play with a ball. Bella is very soft and kind.",
      targetWPM: 15,
      timeLimit: 150,
      icon: PetsIcon,
      color: "#607d8b"
    },
    {
      id: 7,
      title: "Fun at the Park",
      level: "Intermediate",
      description: "Playing at the park",
      text: "We went to the park today. I played on the swing and slide. My friend ran with me. We had so much fun.",
      targetWPM: 16,
      timeLimit: 140,
      icon: SchoolIcon,
      color: "#ff5722"
    },
    {
      id: 8,
      title: "Helping Mom",
      level: "Intermediate",
      description: "Helping family",
      text: "I help my mom cook dinner. We make soup and bread. I wash the dishes after we eat. Mom is happy.",
      targetWPM: 17,
      timeLimit: 135,
      icon: HomeIcon,
      color: "#00bcd4"
    },
    {
      id: 9,
      title: "Garden Flowers",
      level: "Intermediate",
      description: "About beautiful flowers",
      text: "In our garden grow many flowers. Red roses smell sweet. Yellow daisies dance in the wind. I water them daily.",
      targetWPM: 18,
      timeLimit: 130,
      icon: BrushIcon,
      color: "#4caf50"
    },
    {
      id: 10,
      title: "Birthday Party",
      level: "Intermediate",
      description: "A fun birthday story",
      text: "Today is my birthday. My friends came to my party. We ate cake and played games. I got many nice gifts.",
      targetWPM: 19,
      timeLimit: 125,
      icon: SchoolIcon,
      color: "#e91e63"
    }
  ]
};

// Grade 4 Typing Lessons - 10 Unique Lessons
const typingLessonsGrade4 = {
  fundamentals: [
    {
      id: 1,
      title: "Master Keyboard",
      level: "Intermediate",
      description: "Use all keyboard keys",
      text: "The quick brown fox jumps over the lazy dog while typing fast on the computer keyboard.",
      targetWPM: 18,
      timeLimit: 100,
      icon: KeyboardIcon,
      color: "#ff5722"
    },
    {
      id: 2,
      title: "Science Discovery",
      level: "Intermediate",
      description: "Learn science facts",
      text: "Plants need water, sunlight, and carbon dioxide to make food. The Earth rotates around the Sun in 365 days.",
      targetWPM: 20,
      timeLimit: 120,
      icon: AutoAwesomeIcon,
      color: "#00bcd4"
    },
    {
      id: 3,
      title: "Space Explorer",
      level: "Intermediate",
      description: "Journey through space",
      text: "Astronauts travel to space in rockets. They see Earth from far away. The moon has no air to breathe.",
      targetWPM: 21,
      timeLimit: 115,
      icon: RocketLaunchIcon,
      color: "#3f51b5"
    },
    {
      id: 4,
      title: "Ocean Adventure",
      level: "Intermediate",
      description: "Explore the deep sea",
      text: "The ocean is very deep and blue. Whales and dolphins swim in the waves. Coral reefs are colorful homes for fish.",
      targetWPM: 22,
      timeLimit: 110,
      icon: PublicIcon,
      color: "#009688"
    },
    {
      id: 5,
      title: "Technology Today",
      level: "Intermediate",
      description: "Modern technology",
      text: "Computers help us learn and work. Smartphones connect people around the world. Robots can do many helpful tasks.",
      targetWPM: 23,
      timeLimit: 105,
      icon: KeyboardIcon,
      color: "#607d8b"
    }
  ],
  advanced: [
    {
      id: 6,
      title: "Treasure Hunt",
      level: "Advanced",
      description: "An exciting adventure",
      text: "The brave explorer discovered a hidden treasure chest deep in the mysterious cave. Golden coins sparkled in the torchlight.",
      targetWPM: 24,
      timeLimit: 140,
      icon: RocketLaunchIcon,
      color: "#795548"
    },
    {
      id: 7,
      title: "Math Wizard",
      level: "Advanced",
      description: "Numbers and equations",
      text: "Addition: 25 + 37 = 62. Multiplication: 8 × 9 = 72. Division: 144 ÷ 12 = 12. Percentage: 75% of 80 = 60.",
      targetWPM: 25,
      timeLimit: 160,
      icon: FunctionsIcon,
      color: "#607d8b"
    },
    {
      id: 8,
      title: "World Geography",
      level: "Advanced",
      description: "Explore our planet",
      text: "The Amazon River flows through South America. Mount Everest is the highest peak. The Pacific Ocean is the largest body of water.",
      targetWPM: 26,
      timeLimit: 150,
      icon: PublicIcon,
      color: "#3f51b5"
    },
    {
      id: 9,
      title: "History Heroes",
      level: "Advanced",
      description: "Learn about famous people",
      text: "Thomas Edison invented the light bulb. Marie Curie won two Nobel Prizes. Albert Einstein discovered the theory of relativity.",
      targetWPM: 27,
      timeLimit: 145,
      icon: AutoAwesomeIcon,
      color: "#9c27b0"
    },
    {
      id: 10,
      title: "Future Dreams",
      level: "Advanced",
      description: "Imagine tomorrow",
      text: "In the future, cars might fly through the sky. People could live on other planets. Artificial intelligence will help solve problems.",
      targetWPM: 28,
      timeLimit: 140,
      icon: RocketLaunchIcon,
      color: "#ff9800"
    }
  ]
};

// Lesson Selector Component
const LessonSelector = ({ lessons, theme, onSelectLesson, onBack }) => {
  const currentGrade = parseInt(window.location.pathname.split('/')[3]) || 3;

  const getCategoryInfo = (key) => {
    if (currentGrade === 3) {
      const categories = {
        fundamentals: { icon: HomeIcon, title: 'Foundation Skills', color: '#e91e63' },
        stories: { icon: SchoolIcon, title: 'Story Practice', color: '#9c27b0' }
      };
      return categories[key] || categories.fundamentals;
    } else {
      const categories = {
        fundamentals: { icon: KeyboardIcon, title: 'Core Skills', color: '#ff5722' },
        advanced: { icon: RocketLaunchIcon, title: 'Advanced Practice', color: '#795548' }
      };
      return categories[key] || categories.fundamentals;
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', width: '100vw', bgcolor: '#f5f5f5', overflow: 'hidden' }}>
      {/* Header */}
      <Paper sx={{ 
        m: 0,
        p: 4, 
        borderRadius: 0, 
        background: `linear-gradient(135deg, ${theme.primaryColor} 0%, ${theme.accentColor} 100%)`, 
        color: 'white',
        boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
      }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Avatar sx={{
              width: 64,
              height: 64,
              bgcolor: 'rgba(255, 255, 255, 0.2)',
              mr: 3
            }}>
              <KeyboardIcon sx={{ fontSize: 32 }} />
            </Avatar>
            <Box>
              <Typography variant="h3" fontWeight="bold" sx={{ 
                mb: 1,
                fontSize: { xs: '1.8rem', md: '2.5rem' }
              }}>
                Typing Practice
              </Typography>
              <Typography variant="h6" sx={{ opacity: 0.9 }}>
                {theme.name}
              </Typography>
            </Box>
          </Box>
          
          <Button
            variant="contained"
            startIcon={<ArrowBackIcon />}
            onClick={onBack}
            sx={{
              bgcolor: 'rgba(255, 255, 255, 0.2)',
              color: 'white',
              fontWeight: 'bold',
              px: 3,
              py: 1.5,
              '&:hover': {
                bgcolor: 'rgba(255, 255, 255, 0.3)',
              }
            }}
          >
            Back to Curriculum
          </Button>
        </Box>
      </Paper>

      {/* Lessons */}
      <Box sx={{ px: 4, py: 4, maxWidth: '1400px', mx: 'auto' }}>
        {Object.entries(lessons).map(([categoryKey, categoryLessons]) => {
          const categoryInfo = getCategoryInfo(categoryKey);
          
          return (
            <Box key={categoryKey} sx={{ mb: 6 }}>
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                mb: 4,
                p: 3,
                bgcolor: 'white',
                borderRadius: 2,
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
              }}>
                <Avatar sx={{ 
                  bgcolor: categoryInfo.color,
                  mr: 2,
                  width: 48,
                  height: 48
                }}>
                  <categoryInfo.icon sx={{ fontSize: 24 }} />
                </Avatar>
                <Typography variant="h4" fontWeight="bold" sx={{ 
                  color: categoryInfo.color,
                  fontSize: { xs: '1.5rem', md: '2rem' }
                }}>
                  {categoryInfo.title}
                </Typography>
              </Box>
              
              <Grid container spacing={3}>
                {categoryLessons.map((lesson) => (
                  <Grid item xs={12} md={6} lg={4} key={lesson.id}>
                    <Card
                      sx={{
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        border: `2px solid ${lesson.color}20`,
                        '&:hover': {
                          boxShadow: `0 8px 25px ${lesson.color}40`,
                          transform: 'translateY(-4px)',
                          border: `2px solid ${lesson.color}60`,
                        }
                      }}
                      onClick={() => onSelectLesson(lesson)}
                    >
                      <CardContent sx={{ flex: 1, p: 3 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                          <Avatar sx={{ 
                            bgcolor: lesson.color + '20',
                            mr: 2,
                            width: 48,
                            height: 48
                          }}>
                            <lesson.icon sx={{ 
                              fontSize: 24,
                              color: lesson.color
                            }} />
                          </Avatar>
                          <Box sx={{ flex: 1 }}>
                            <Typography variant="h6" fontWeight="bold" sx={{ 
                              color: lesson.color,
                              mb: 0.5
                            }}>
                              {lesson.title}
                            </Typography>
                            <Chip 
                              label={lesson.level}
                              size="small"
                              sx={{ 
                                bgcolor: lesson.color + '20',
                                color: lesson.color,
                                fontWeight: 'bold',
                                fontSize: '0.75rem'
                              }}
                            />
                          </Box>
                        </Box>

                        <Typography 
                          variant="body2" 
                          sx={{ 
                            color: '#666', 
                            mb: 3,
                            lineHeight: 1.5
                          }}
                        >
                          {lesson.description}
                        </Typography>

                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <GpsFixedIcon sx={{ fontSize: 16, mr: 0.5, color: '#666' }} />
                            <Typography variant="body2" color="#666">
                              {lesson.targetWPM} WPM
                            </Typography>
                          </Box>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <TimerIcon sx={{ fontSize: 16, mr: 0.5, color: '#666' }} />
                            <Typography variant="body2" color="#666">
                              {Math.floor(lesson.timeLimit / 60)}:{(lesson.timeLimit % 60).toString().padStart(2, '0')}
                            </Typography>
                          </Box>
                        </Box>

                        <Paper sx={{ 
                          p: 2,
                          bgcolor: lesson.color + '10',
                          border: `1px solid ${lesson.color}30`
                        }}>
                          <Typography 
                            variant="body2" 
                            sx={{ 
                              fontFamily: 'monospace',
                              fontSize: '0.85rem',
                              color: '#555',
                              display: '-webkit-box',
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: 'vertical',
                              overflow: 'hidden'
                            }}
                          >
                            "{lesson.text.substring(0, 60)}{lesson.text.length > 60 ? '...' : ''}"
                          </Typography>
                        </Paper>
                      </CardContent>

                      <CardActions sx={{ p: 3, pt: 0 }}>
                        <Button
                          variant="contained"
                          startIcon={<PlayArrowIcon />}
                          fullWidth
                          sx={{
                            bgcolor: lesson.color,
                            fontWeight: 600,
                            py: 1.5,
                            '&:hover': {
                              bgcolor: lesson.color,
                              filter: 'brightness(0.9)'
                            }
                          }}
                        >
                          Start Practice
                        </Button>
                      </CardActions>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Box>
          );
        })}
      </Box>
    </Box>
  );
};

// Typing Practice Component
const TypingPractice = ({ lesson, theme, onComplete, onBack }) => {
  const [input, setInput] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [startTime, setStartTime] = useState(null);
  const [isStarted, setIsStarted] = useState(false);
  const [wpm, setWpm] = useState(0);
  const [accuracy, setAccuracy] = useState(100);
  const [isCompleted, setIsCompleted] = useState(false);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [errors, setErrors] = useState(0);
  const typingInputRef = useRef(null);

  useEffect(() => {
    if (typingInputRef.current) {
      typingInputRef.current.focus();
    }
  }, []);

  // Check completion whenever input changes
  useEffect(() => {
    if (input && input.length > 0) {
      console.log("Input changed:", input);
      console.log("Checking against:", lesson.text);
      
      // Multiple exact match checks
      if (input === lesson.text) {
        console.log("🚀 EXACT MATCH! Setting completed to true");
        setIsCompleted(true);
        return;
      }
      
      // Check if input matches text length and is correct
      if (input.length === lesson.text.length) {
        let allCorrect = true;
        for (let i = 0; i < input.length; i++) {
          if (input[i] !== lesson.text[i]) {
            allCorrect = false;
            break;
          }
        }
        if (allCorrect) {
          console.log("🚀 CHARACTER BY CHARACTER MATCH! Setting completed to true");
          setIsCompleted(true);
        }
      }
    }
  }, [input, lesson.text]);

  // Prevent body scrolling when popup is shown
  useEffect(() => {
    console.log("🔄 isCompleted changed to:", isCompleted);
    if (isCompleted) {
      console.log("✅ Setting body overflow to hidden - popup should show!");
      document.body.style.overflow = 'hidden';
    } else {
      console.log("❌ Setting body overflow to unset - popup hidden");
      document.body.style.overflow = 'unset';
    }
    
    // Cleanup function to restore scrolling
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isCompleted]);

  const handleComplete = () => {
    setIsCompleted(true);
  };

  useEffect(() => {
    let interval;
    if (isStarted && !isCompleted) {
      interval = setInterval(() => {
        const elapsed = (Date.now() - startTime) / 1000;
        setTimeElapsed(elapsed);
        
        const words = currentIndex / 5;
        const minutes = elapsed / 60;
        const currentWPM = minutes > 0 ? Math.round(words / minutes) : 0;
        setWpm(currentWPM);
        
        if (elapsed >= lesson.timeLimit) {
          handleComplete();
        }
      }, 100);
    }
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isStarted, startTime, currentIndex, isCompleted, lesson.timeLimit]);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setInput(value);
    
    if (!isStarted && value.length > 0) {
      setIsStarted(true);
      setStartTime(Date.now());
    }
    
    let correctChars = 0;
    let errorCount = 0;
    
    for (let i = 0; i < value.length; i++) {
      if (value[i] === lesson.text[i]) {
        correctChars++;
      } else {
        errorCount++;
      }
    }
    
    setCurrentIndex(value.length);
    setErrors(errorCount);
    setAccuracy(value.length > 0 ? Math.round((correctChars / value.length) * 100) : 100);
    
    // Check completion when typing each character
    console.log("Typed:", value.length, "Target:", lesson.text.length);
    console.log("Current text:", `"${value}"`);
    console.log("Target text:", `"${lesson.text}"`);
    
    // IMMEDIATE completion check when we reach the target length
    if (value.length >= lesson.text.length) {
      console.log("Length reached - checking completion");
      console.log("Correct chars:", correctChars, "Target length:", lesson.text.length);
      
      // Check if all typed characters are correct
      if (correctChars === lesson.text.length) {
        console.log("🎉 ALL CHARACTERS CORRECT! COMPLETED!");
        setIsCompleted(true);
        return;
      }
      
      // Also check exact string match
      if (value === lesson.text || value.trim() === lesson.text.trim()) {
        console.log("🎉 EXACT STRING MATCH! COMPLETED!");
        setIsCompleted(true);
        return;
      }
    }
    
    // ADDITIONAL check: if we typed the exact number of characters and they're all correct
    if (value.length === lesson.text.length && correctChars === lesson.text.length) {
      console.log("🎉 PERFECT MATCH! Length and accuracy match!");
      setIsCompleted(true);
    }
  };

  const renderText = () => {
    return lesson.text.split('').map((char, index) => {
      let backgroundColor = 'transparent';
      let color = '#333';
      let border = 'none';
      
      if (index < currentIndex) {
        if (input[index] === char) {
          backgroundColor = '#c8e6c9';
          color = '#2e7d32';
        } else {
          backgroundColor = '#ffcdd2';
          color = '#c62828';
        }
      } else if (index === currentIndex) {
        border = '2px solid #2196f3';
        backgroundColor = '#e3f2fd';
      }
      
      return (
        <span key={index} style={{
          backgroundColor,
          color,
          border,
          padding: '4px 6px',
          margin: '2px',
          borderRadius: '4px',
          display: 'inline-block',
          minWidth: '12px',
          textAlign: 'center',
          fontFamily: 'monospace',
          fontSize: '18px',
          lineHeight: '1.5'
        }}>
          {char === ' ' ? '⎵' : char}
        </span>
      );
    });
  };

  const resetPractice = () => {
    console.log("🔄 Resetting practice...");
    setInput('');
    setCurrentIndex(0);
    setStartTime(null);
    setIsStarted(false);
    setWpm(0);
    setAccuracy(100);
    setIsCompleted(false);
    setTimeElapsed(0);
    setErrors(0);
    if (typingInputRef.current) {
      typingInputRef.current.focus();
    }
  };

  const progress = (currentIndex / lesson.text.length) * 100;

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      width: '100vw', 
      bgcolor: '#f5f5f5', 
      overflow: isCompleted ? 'hidden' : 'auto',
      position: 'relative'
    }}>
      {/* CSS Animation Keyframes */}
      <style>
        {`
          @keyframes fadeInScale {
            0% {
              opacity: 0;
              transform: scale(0.8);
            }
            100% {
              opacity: 1;
              transform: scale(1.05);
            }
          }
        `}
      </style>
      {/* Header */}
      <Paper sx={{ 
        m: 0,
        mb: 4, 
        p: 4, 
        borderRadius: 0, 
        background: `linear-gradient(135deg, ${theme.primaryColor} 0%, ${theme.accentColor} 100%)`, 
        color: 'white'
      }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Avatar sx={{
              width: 64,
              height: 64,
              bgcolor: 'rgba(255, 255, 255, 0.2)',
              mr: 3
            }}>
              <lesson.icon sx={{ fontSize: 32 }} />
            </Avatar>
            <Box>
              <Typography variant="h3" fontWeight="bold" sx={{ 
                mb: 1,
                fontSize: { xs: '1.8rem', md: '2.5rem' }
              }}>
                {lesson.title}
              </Typography>
              <Typography variant="h6" sx={{ opacity: 0.9 }}>
                {lesson.description}
              </Typography>
            </Box>
          </Box>
          
          <Button
            variant="contained"
            startIcon={<ArrowBackIcon />}
            onClick={onBack}
            sx={{
              bgcolor: 'rgba(255, 255, 255, 0.2)',
              color: 'white',
              fontWeight: 'bold',
              px: 3,
              py: 1.5
            }}
          >
            Back to Lessons
          </Button>
        </Box>

        {/* Progress Bar */}
        <Box sx={{ mt: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="body2">Progress</Typography>
            <Typography variant="body2">{Math.round(progress)}%</Typography>
          </Box>
          <LinearProgress 
            variant="determinate" 
            value={progress} 
            sx={{ 
              height: 8, 
              borderRadius: 4,
              bgcolor: 'rgba(255,255,255,0.3)',
              '& .MuiLinearProgress-bar': {
                bgcolor: 'rgba(255,255,255,0.9)'
              }
            }} 
          />
        </Box>
      </Paper>

      <Box sx={{ maxWidth: '1400px', mx: 'auto', px: 4 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3, borderRadius: 2, height: 'fit-content' }}>
              <Typography variant="h6" fontWeight="bold" sx={{ mb: 3, color: theme.primaryColor }}>
                Performance Stats
              </Typography>
              
              <Box sx={{ mb: 3 }}>
                <Card sx={{ p: 2, mb: 2, textAlign: 'center', border: `2px solid ${theme.primaryColor}` }}>
                  <SpeedIcon sx={{ fontSize: 32, color: theme.primaryColor, mb: 1 }} />
                  <Typography variant="h3" fontWeight="bold" sx={{ color: theme.primaryColor }}>
                    {wpm}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Words per Minute
                  </Typography>
                </Card>

                <Card sx={{ p: 2, mb: 2, textAlign: 'center', border: '2px solid #4caf50' }}>
                  <TrackChangesIcon sx={{ fontSize: 32, color: '#4caf50', mb: 1 }} />
                  <Typography variant="h3" fontWeight="bold" sx={{ color: '#4caf50' }}>
                    {accuracy}%
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Accuracy
                  </Typography>
                </Card>

                <Card sx={{ p: 2, mb: 2, textAlign: 'center', border: '2px solid #ff9800' }}>
                  <TimerIcon sx={{ fontSize: 32, color: '#ff9800', mb: 1 }} />
                  <Typography variant="h3" fontWeight="bold" sx={{ color: '#ff9800' }}>
                    {Math.floor(timeElapsed)}s
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Time Elapsed
                  </Typography>
                </Card>
              </Box>

              <Button
                variant="contained"
                startIcon={<RestartAltIcon />}
                fullWidth
                onClick={resetPractice}
                sx={{ 
                  bgcolor: theme.primaryColor,
                  fontWeight: 'bold',
                  py: 1.5,
                  mb: 2
                }}
              >
                Reset Practice
              </Button>
              

            </Paper>
          </Grid>

          <Grid item xs={12} md={8}>
            <Paper sx={{ p: 4, borderRadius: 2 }}>
              <Typography variant="h6" fontWeight="bold" sx={{ mb: 2, color: theme.primaryColor }}>
                Practice Text
              </Typography>
              <Typography variant="body1" sx={{ mb: 3, color: '#666', fontWeight: '500' }}>
                👆 Type the exact text shown above (including spaces and punctuation)
              </Typography>
              
              <Paper sx={{ 
                p: 3, 
                mb: 4, 
                bgcolor: lesson.color + '10',
                border: `2px solid ${lesson.color}`,
                minHeight: '150px',
                fontSize: '18px',
                lineHeight: 2
              }}>
                {renderText()}
              </Paper>

              <textarea
                ref={typingInputRef}
                value={input}
                onChange={handleInputChange}
                placeholder={`Type this exactly: "${lesson.text}"`}
                disabled={isCompleted}
                style={{
                  width: '100%',
                  minHeight: '120px',
                  padding: '16px',
                  fontSize: '18px',
                  fontFamily: 'monospace',
                  border: `3px solid ${theme.primaryColor}`,
                  borderRadius: '8px',
                  resize: 'none',
                  outline: 'none',
                  backgroundColor: isCompleted ? '#f0fdf4' : 'white',
                  lineHeight: '1.5'
                }}
              />

              {isCompleted && (
                <Box
                  sx={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100vw',
                    height: '100vh',
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    zIndex: 999999,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <Box
                    sx={{
                      background: `linear-gradient(135deg, ${theme.primaryColor}, ${theme.accentColor})`,
                      color: 'white',
                      padding: '40px 50px',
                      borderRadius: '20px',
                      textAlign: 'center',
                      boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
                      maxWidth: '500px',
                      width: '90%'
                    }}
                  >
                    <EmojiEventsIcon sx={{ fontSize: 80, mb: 3, color: '#FFD700' }} />
                    <Typography variant="h3" fontWeight="bold" sx={{ mb: 4 }}>
                      Lesson Complete!
                    </Typography>
                    
                    {/* Stats Display */}
                    <Box sx={{ 
                      display: 'flex', 
                      flexDirection: 'column',
                      gap: 3,
                      mb: 4
                    }}>
                      <Box sx={{ textAlign: 'center', bgcolor: 'rgba(255,255,255,0.1)', borderRadius: '12px', p: 3 }}>
                        <Typography variant="h2" fontWeight="bold" sx={{ color: '#FFD700', mb: 1 }}>
                          {wpm}
                        </Typography>
                        <Typography variant="h6" sx={{ opacity: 0.9 }}>
                          Words per Minute
                        </Typography>
                      </Box>
                      
                      <Box sx={{ textAlign: 'center', bgcolor: 'rgba(255,255,255,0.1)', borderRadius: '12px', p: 3 }}>
                        <Typography variant="h2" fontWeight="bold" sx={{ color: '#FFD700', mb: 1 }}>
                          {accuracy}%
                        </Typography>
                        <Typography variant="h6" sx={{ opacity: 0.9 }}>
                          Accuracy
                        </Typography>
                      </Box>
                      
                      <Box sx={{ textAlign: 'center', bgcolor: 'rgba(255,255,255,0.1)', borderRadius: '12px', p: 3 }}>
                        <Typography variant="h2" fontWeight="bold" sx={{ color: '#FFD700', mb: 1 }}>
                          {Math.floor(timeElapsed)}s
                        </Typography>
                        <Typography variant="h6" sx={{ opacity: 0.9 }}>
                          Time Elapsed
                        </Typography>
                      </Box>
                    </Box>

                    {/* Action Buttons */}
                    <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
                      <Button
                        variant="contained"
                        onClick={onBack}
                        sx={{
                          bgcolor: 'rgba(255,255,255,0.2)',
                          color: 'white',
                          fontWeight: 'bold',
                          px: 4,
                          py: 2,
                          borderRadius: '12px',
                          '&:hover': {
                            bgcolor: 'rgba(255,255,255,0.3)'
                          }
                        }}
                      >
                        Next Lesson
                      </Button>
                      <Button
                        variant="outlined"
                        onClick={() => {
                          setIsCompleted(false);
                          resetPractice();
                        }}
                        sx={{
                          borderColor: 'rgba(255,255,255,0.5)',
                          color: 'white',
                          fontWeight: 'bold',
                          px: 4,
                          py: 2,
                          borderRadius: '12px',
                          '&:hover': {
                            borderColor: 'rgba(255,255,255,0.8)',
                            bgcolor: 'rgba(255,255,255,0.1)'
                          }
                        }}
                      >
                        Try Again
                      </Button>
                    </Box>
                  </Box>
                </Box>
              )}
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

// Main TuxTyping Component
const TuxTyping = () => {
  const params = useParams();
  const navigate = useNavigate();
  const [currentView, setCurrentView] = useState('lessons');
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [typingStats, setTypingStats] = useState(null);

  const getTypingLessons = () => {
    const gradeNumber = params.grade ? parseInt(params.grade) : 3;
    return gradeNumber === 4 ? typingLessonsGrade4 : typingLessonsGrade3;
  };

  const getGradeTheme = () => {
    const gradeNumber = params.grade ? parseInt(params.grade) : 3;
    if (gradeNumber === 4) {
      return {
        primaryColor: '#26a69a',
        secondaryColor: '#e0f2f1',
        accentColor: '#00897b',
        name: 'Grade 4 - Advanced Skills'
      };
    }
    return {
      primaryColor: '#e91e63',
      secondaryColor: '#fce4ec',
      accentColor: '#c2185b',
      name: 'Grade 3 - Foundation Skills'
    };
  };

  const currentLessons = getTypingLessons();
  const theme = getGradeTheme();

  const handleLessonSelect = (lesson) => {
    setSelectedLesson(lesson);
    setCurrentView('practice');
  };

  const handleTypingComplete = (stats) => {
    setTypingStats(stats);
    setCurrentView('results');
  };

  const handleBackToLessons = () => {
    setCurrentView('lessons');
    setSelectedLesson(null);
    setTypingStats(null);
  };

  const handleBackToCurriculum = () => {
    navigate('/student-dashboard/codezy');
  };

  return (
    <Box sx={{ minHeight: '100vh', width: '100vw', bgcolor: '#f5f5f5', overflow: 'hidden' }}>
      {currentView === 'lessons' && (
        <LessonSelector 
          lessons={currentLessons}
          theme={theme}
          onSelectLesson={handleLessonSelect}
          onBack={handleBackToCurriculum}
        />
      )}
      
      {currentView === 'practice' && selectedLesson && (
        <TypingPractice 
          lesson={selectedLesson}
          theme={theme}
          onComplete={handleTypingComplete}
          onBack={handleBackToLessons}
        />
      )}
      
      {currentView === 'results' && typingStats && selectedLesson && (
        <Box sx={{ minHeight: '100vh', width: '100vw', bgcolor: '#f5f5f5', display: 'flex', alignItems: 'center', justifyContent: 'center', px: 4, overflow: 'hidden' }}>
          <Box sx={{ width: '100%', maxWidth: '600px' }}>
            <Card sx={{ p: 4, textAlign: 'center' }}>
              <CheckCircleIcon sx={{ fontSize: 80, color: theme.primaryColor, mb: 2 }} />
              <Typography variant="h4" fontWeight="bold" sx={{ color: theme.primaryColor, mb: 2 }}>
                Lesson Complete!
              </Typography>
              <Typography variant="h6" sx={{ color: '#666', mb: 4 }}>
                WPM: {typingStats.wpm} | Accuracy: {typingStats.accuracy}% | Time: {Math.floor(typingStats.timeElapsed)}s
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
                <Button
                  variant="contained"
                  onClick={handleBackToLessons}
                  sx={{
                    bgcolor: theme.primaryColor,
                    fontWeight: 'bold',
                    px: 4,
                    py: 2
                  }}
                >
                  Practice Another Lesson
                </Button>
                <Button
                  variant="outlined"
                  onClick={handleBackToCurriculum}
                  sx={{
                    borderColor: theme.primaryColor,
                    color: theme.primaryColor,
                    fontWeight: 'bold',
                    px: 4,
                    py: 2
                  }}
                >
                  Back to Curriculum
                </Button>
              </Box>
            </Card>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default TuxTyping; 