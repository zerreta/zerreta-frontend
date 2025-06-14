import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Container,
  Paper,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Chip,
  LinearProgress,
  useTheme,
  useMediaQuery,
  Avatar,
  Divider,
  IconButton
} from '@mui/material';
import {
  School as SchoolIcon,
  Keyboard as KeyboardIcon,
  Brush as BrushIcon,
  Folder as FolderIcon,
  Code as CodeIcon,
  Web as WebIcon,
  Description as DescriptionIcon,
  Slideshow as SlideshowIcon,
  Security as SecurityIcon,
  SportsEsports as SportsEsportsIcon,
  TableChart as TableChartIcon,
  PhoneAndroid as PhoneAndroidIcon,
  Style as StyleIcon,
  PlayArrow as PlayArrowIcon,
  Star as StarIcon,
  TrendingUp as TrendingUpIcon,
  ArrowBack as ArrowBackIcon,
  CheckCircle as CheckCircleIcon,
  Create as CreateIcon
} from '@mui/icons-material';

const Codezy = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleGoBack = () => {
    navigate('/student-dashboard');
  };

  const codingLevels = [
    {
      id: 3,
      title: 'Grade 3 Computer Skills',
      subtitle: 'Foundation Level',
      icon: <KeyboardIcon />,
      bgGradient: 'linear-gradient(135deg, #4CAF50 0%, #45a049 100%)',
      bgColor: '#E8F5E9',
      borderColor: '#4CAF50',
      description: 'Start your computer journey with basic typing and drawing skills.',
      exercises: 3,
      completed: 0,
      difficulty: 'Grade 3',
      path: '/student-dashboard/codezy/3',
      locked: false,
      skills: [
        {
          title: 'Tux Typing Practice',
          description: 'Learn keyboard typing with fun games and stories',
          icon: <KeyboardIcon />,
          path: '/student-dashboard/tux-typing/3',
          progress: 0,
          duration: '15 min'
        },
        {
          title: 'MS Paint Basics',
          description: 'Create digital art and learn basic drawing tools',
          icon: <BrushIcon />,
          path: '/student-dashboard/codezy/paint',
          progress: 0,
          duration: '20 min'
        },
        {
          title: 'File Management',
          description: 'Learn to organize files and folders on your computer',
          icon: <FolderIcon />,
          path: '/student-dashboard/codezy/file-manager',
          progress: 0,
          duration: '15 min'
        }
      ]
    },
    {
      id: 4,
      title: 'Grade 4 Computer Skills',
      subtitle: 'Building Level',
      icon: <DescriptionIcon />,
      bgGradient: 'linear-gradient(135deg, #2196F3 0%, #1976d2 100%)',
      bgColor: '#E3F2FD',
      borderColor: '#2196F3',
      description: 'Build on your foundation with more advanced typing and basic coding.',
      exercises: 3,
      completed: 0,
      difficulty: 'Grade 4',
      path: '/student-dashboard/codezy/4',
      locked: false,
      skills: [
        {
          title: 'Advanced Tux Typing',
          description: 'Master typing with advanced lessons and challenges',
          icon: <KeyboardIcon />,
          path: '/student-dashboard/tux-typing/4',
          progress: 0,
          duration: '20 min'
        },
        {
          title: 'Word Processing',
          description: 'Create and format documents with Microsoft Word',
          icon: <DescriptionIcon />,
          path: '/student-dashboard/word-processing',
          progress: 0,
          duration: '25 min'
        },
        {
          title: 'Basic Coding',
          description: 'Introduction to programming concepts with fun activities',
          icon: <CodeIcon />,
          path: '/student-dashboard/basic-coding',
          progress: 0,
          duration: '30 min'
        }
      ]
    },
    {
      id: 5,
      title: 'Grade 5 Computer Skills',
      subtitle: 'Developing Level',
      icon: <SlideshowIcon />,
      bgGradient: 'linear-gradient(135deg, #9C27B0 0%, #7b1fa2 100%)',
      bgColor: '#F3E5F5',
      borderColor: '#9C27B0',
      description: 'Explore more advanced computer skills and start coding.',
      exercises: 3,
      completed: 0,
      difficulty: 'Grade 5',
      path: '/student-dashboard/codezy/5',
      locked: false,
      skills: [
        {
          title: 'PowerPoint Basics',
          description: 'Create engaging presentations with animations',
          icon: <SlideshowIcon />,
          path: '/student-dashboard/powerpoint-basics',
          progress: 0,
          duration: '25 min'
        },
        {
          title: 'Scratch Programming',
          description: 'Create interactive stories and games with Scratch',
          icon: <CodeIcon />,
          path: '/student-dashboard/codezy/Scratch/5',
          progress: 0,
          duration: '35 min'
        },
        {
          title: 'Internet Safety',
          description: 'Learn about safe internet usage and digital citizenship',
          icon: <SecurityIcon />,
          path: '/student-dashboard/internet-safety',
          progress: 0,
          duration: '15 min'
        }
      ]
    },
    {
      id: 6,
      title: 'Grade 6 Computer Skills',
      subtitle: 'Advancing Level',
      icon: <SportsEsportsIcon />,
      bgGradient: 'linear-gradient(135deg, #FF9800 0%, #f57c00 100%)',
      bgColor: '#FFF3E0',
      borderColor: '#FF9800',
      description: 'Create games, webpages, and learn spreadsheet basics.',
      exercises: 3,
      completed: 0,
      difficulty: 'Grade 6',
      path: '/student-dashboard/codezy/6',
      locked: false,
      skills: [
        {
          title: 'Scratch Game Development',
          description: 'Create simple games and animations using Scratch',
          icon: <SportsEsportsIcon />,
          path: '/student-dashboard/scratch-games',
          progress: 0,
          duration: '45 min'
        },
        {
          title: 'HTML Basics',
          description: 'Create webpages with headings and paragraphs',
          icon: <CodeIcon />,
          path: '/student-dashboard/html-basics',
          progress: 0,
          duration: '30 min'
        },
        {
          title: 'MS Excel Basics',
          description: 'Learn tables and simple calculations in Excel',
          icon: <TableChartIcon />,
          path: '/student-dashboard/excel-basics',
          progress: 0,
          duration: '25 min'
        }
      ]
    },
    {
      id: 7,
      title: 'Grade 7 Computer Skills',
      subtitle: 'Mastering Level',
      icon: <WebIcon />,
      bgGradient: 'linear-gradient(135deg, #607D8B 0%, #455a64 100%)',
      bgColor: '#ECEFF1',
      borderColor: '#607D8B',
      description: 'Master web development and presentation skills.',
      exercises: 3,
      completed: 0,
      difficulty: 'Grade 7',
      path: '/student-dashboard/codezy/7',
      locked: false,
      skills: [
        {
          title: 'HTML & CSS Project',
          description: 'Create a personal bio page with styling',
          icon: <WebIcon />,
          path: '/student-dashboard/html-css-project',
          progress: 0,
          duration: '40 min'
        },
        {
          title: 'Google Slides',
          description: 'Create class project presentations',
          icon: <SlideshowIcon />,
          path: '/student-dashboard/google-slides',
          progress: 0,
          duration: '30 min'
        },
        {
          title: 'Advanced Scratch',
          description: 'Use loops and events in Scratch projects',
          icon: <CodeIcon />,
          path: '/student-dashboard/advanced-scratch',
          progress: 0,
          duration: '50 min'
        }
      ]
    },
    {
      id: 8,
      title: 'Grade 8 Computer Skills',
      subtitle: 'Professional Level',
      icon: <CodeIcon />,
      bgGradient: 'linear-gradient(135deg, #795548 0%, #5d4037 100%)',
      bgColor: '#EFEBE9',
      borderColor: '#795548',
      description: 'Start Python programming and app development.',
      exercises: 3,
      completed: 0,
      difficulty: 'Grade 8',
      path: '/student-dashboard/codezy/8',
      locked: false,
      skills: [
        {
          title: 'HTML with Media',
          description: 'Build webpages with images and links',
          icon: <WebIcon />,
          path: '/student-dashboard/html-media',
          progress: 0,
          duration: '35 min'
        },
        {
          title: 'Python Basics',
          description: 'Learn print(), variables, and input() functions',
          icon: <CodeIcon />,
          path: '/student-dashboard/python-basics',
          progress: 0,
          duration: '45 min'
        },
        {
          title: 'MIT App Inventor',
          description: 'Create a simple calculator app',
          icon: <PhoneAndroidIcon />,
          path: '/student-dashboard/app-inventor',
          progress: 0,
          duration: '60 min'
        }
      ]
    },
    {
      id: 9,
      title: 'Grade 9 Computer Skills',
      subtitle: 'Expert Level',
      icon: <PhoneAndroidIcon />,
      bgGradient: 'linear-gradient(135deg, #E91E63 0%, #ad1457 100%)',
      bgColor: '#FCE4EC',
      borderColor: '#E91E63',
      description: 'Advanced programming and app development.',
      exercises: 3,
      completed: 0,
      difficulty: 'Grade 9',
      path: '/student-dashboard/codezy/9',
      locked: false,
      skills: [
        {
          title: 'Python Programming',
          description: 'Master loops, conditions, and functions',
          icon: <CodeIcon />,
          path: '/student-dashboard/python-advanced',
          progress: 0,
          duration: '60 min'
        },
        {
          title: 'CSS Styling',
          description: 'Create beautiful webpages with CSS',
          icon: <StyleIcon />,
          path: '/student-dashboard/css-styling',
          progress: 0,
          duration: '45 min'
        },
        {
          title: 'App Development',
          description: 'Create apps with login functionality',
          icon: <PhoneAndroidIcon />,
          path: '/student-dashboard/app-development',
          progress: 0,
          duration: '75 min'
        }
      ]
    }
  ];

  const handleLevelClick = (level) => {
    navigate(level.path);
  };

  const handleSkillClick = (path) => {
    navigate(path);
  };

  const getDifficultyColor = (difficulty) => {
    const colors = {
      'Grade 3': '#4CAF50',
      'Grade 4': '#2196F3',
      'Grade 5': '#9C27B0',
      'Grade 6': '#FF9800',
      'Grade 7': '#607D8B',
      'Grade 8': '#795548',
      'Grade 9': '#E91E63'
    };
    return colors[difficulty] || '#4CAF50';
  };

  const getProgressPercentage = (completed, total) => {
    return Math.round((completed / total) * 100);
  };

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#f8fafc', width: '100vw', overflow: 'hidden' }}>
      {/* Hero Section */}
      <Box sx={{ 
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        py: 6
      }}>
        <Container maxWidth="xl">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={8}>
              <Box sx={{ 
                display: 'flex', 
                alignItems: { xs: 'flex-start', sm: 'center' }, 
                flexDirection: { xs: 'column', sm: 'row' },
                gap: 2, 
                mb: 2 
              }}>
                <Typography variant="h3" fontWeight={700} sx={{ 
                  flexGrow: 1,
                  fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' }
                }}>
                  Computer Skills Mastery
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
                    px: 3
                  }}
                >
                  Back to Dashboard
                </Button>
              </Box>
              <Typography variant="h6" sx={{ opacity: 0.9, mb: 1 }}>
                Develop essential computer skills from Grade 3 to Grade 9
              </Typography>
              <Typography variant="body1" sx={{ opacity: 0.8 }}>
                Progressive learning path from basic computer operations to advanced programming
              </Typography>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box sx={{ textAlign: 'center' }}>
                <Box sx={{
                  backgroundColor: 'rgba(255,255,255,0.1)',
                  borderRadius: 3,
                  p: 3,
                  backdropFilter: 'blur(10px)'
                }}>
                  <Typography variant="h2" fontWeight={700} sx={{ mb: 1 }}>
                    21
                  </Typography>
                  <Typography variant="h6" sx={{ opacity: 0.9 }}>
                    Total Skills
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.7, mt: 1 }}>
                    Across 7 grade levels
                  </Typography>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Computer Skills Grid */}
      <Container maxWidth="xl" sx={{ py: 6 }}>
        <Grid container spacing={4}>
          {codingLevels.map((level) => (
            <Grid item xs={12} key={level.id}>
              <Card
                sx={{
                  borderRadius: 3,
                  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
                  position: 'relative',
                  overflow: 'hidden',
                  border: `2px solid ${level.borderColor}15`,
                }}
              >
                {/* Gradient overlay */}
                <Box
                  sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: 6,
                    background: level.bgGradient
                  }}
                />

                <CardContent sx={{ p: 4 }}>
                  {/* Grade Header */}
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
                    <Avatar
                      sx={{
                        backgroundColor: level.borderColor,
                        width: 60,
                        height: 60,
                        mr: 3
                      }}
                    >
                      <SchoolIcon sx={{ fontSize: 30 }} />
                    </Avatar>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="h4" fontWeight={700} color="#1e293b" gutterBottom>
                        {level.title}
                      </Typography>
                      <Typography variant="body1" color="#64748b" sx={{ mb: 2 }}>
                        {level.description}
                      </Typography>
                      <Chip
                        label={level.difficulty}
                        sx={{
                          backgroundColor: getDifficultyColor(level.difficulty),
                          color: 'white',
                          fontWeight: 600,
                          fontSize: '0.85rem'
                        }}
                      />
                    </Box>
                  </Box>

                  <Divider sx={{ mb: 4 }} />

                  {/* Skills Grid */}
                  <Typography variant="h5" fontWeight={600} color="#1e293b" gutterBottom sx={{ mb: 3 }}>
                    Learning Modules (3)
                  </Typography>
                  
                  <Grid container spacing={3}>
                    {level.skills.map((skill, index) => (
                      <Grid item xs={12} md={4} key={index}>
                        <Card
                          sx={{
                            height: '100%',
                            border: `2px solid ${level.borderColor}20`,
                            borderRadius: 3,
                            transition: 'all 0.3s ease',
                            '&:hover': {
                              transform: 'translateY(-4px)',
                              borderColor: level.borderColor,
                              boxShadow: `0 8px 25px ${level.borderColor}40`
                            }
                          }}
                        >
                          <CardContent sx={{ p: 3 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                              <Avatar
                                sx={{
                                  bgcolor: `${level.borderColor}15`,
                                  color: level.borderColor,
                                  width: 48,
                                  height: 48,
                                  mr: 2
                                }}
                              >
                                {skill.icon}
                              </Avatar>
                              <Box sx={{ flex: 1, minWidth: 0 }}>
                                <Typography variant="h6" fontWeight={600} color="#1e293b">
                                  {skill.title}
                                </Typography>
                                <Typography variant="body2" color="#64748b">
                                  ⏱️ {skill.duration}
                                </Typography>
                              </Box>
                            </Box>
                            
                            <Typography 
                              variant="body2" 
                              color="#475569" 
                              sx={{ mb: 3, lineHeight: 1.6 }}
                            >
                              {skill.description}
                            </Typography>

                            {/* Progress Bar */}
                            <Box sx={{ mb: 3 }}>
                              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                <Typography variant="body2" fontWeight={600} color="#374151">
                                  Progress
                                </Typography>
                                <Typography variant="body2" color="#6b7280">
                                  {skill.progress}%
                                </Typography>
                              </Box>
                              <LinearProgress
                                variant="determinate"
                                value={skill.progress}
                                sx={{
                                  height: 6,
                                  borderRadius: 3,
                                  backgroundColor: '#e5e7eb',
                                  '& .MuiLinearProgress-bar': {
                                    backgroundColor: level.borderColor,
                                    borderRadius: 3
                                  }
                                }}
                              />
                            </Box>
                          </CardContent>

                          <CardActions sx={{ p: 3, pt: 0 }}>
                            <Button
                              fullWidth
                              variant="contained"
                              startIcon={<PlayArrowIcon />}
                              onClick={() => handleSkillClick(skill.path)}
                              sx={{
                                bgcolor: level.borderColor,
                                color: 'white',
                                fontWeight: 600,
                                py: 1.5,
                                borderRadius: 2,
                                textTransform: 'none',
                                fontSize: '1rem',
                                '&:hover': {
                                  bgcolor: level.borderColor,
                                  filter: 'brightness(0.9)',
                                  transform: 'scale(1.02)'
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
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Information Section */}
        <Box sx={{ mt: 6, p: 4, backgroundColor: 'white', borderRadius: 3, boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <Typography variant="h5" fontWeight={600} color="#1e293b" gutterBottom>
            Start Your Computer Learning Journey
          </Typography>
          <Grid container spacing={3} sx={{ mt: 2 }}>
            <Grid item xs={12} md={4}>
              <Box sx={{ textAlign: 'center', p: 2 }}>
                <Avatar sx={{ bgcolor: '#4CAF50', width: 48, height: 48, mx: 'auto', mb: 2 }}>
                  <KeyboardIcon />
                </Avatar>
                <Typography variant="h6" fontWeight={600} gutterBottom>
                  Start with Grade 3
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Begin with fundamental computer skills like typing and basic operations
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box sx={{ textAlign: 'center', p: 2 }}>
                <Avatar sx={{ bgcolor: '#2196F3', width: 48, height: 48, mx: 'auto', mb: 2 }}>
                  <CheckCircleIcon />
                </Avatar>
                <Typography variant="h6" fontWeight={600} gutterBottom>
                  Progressive Learning
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Complete modules to advance through grades and unlock advanced programming skills
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box sx={{ textAlign: 'center', p: 2 }}>
                <Avatar sx={{ bgcolor: '#9C27B0', width: 48, height: 48, mx: 'auto', mb: 2 }}>
                  <CodeIcon />
                </Avatar>
                <Typography variant="h6" fontWeight={600} gutterBottom>
                  Master Programming
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Develop coding skills from basic concepts to advanced programming languages
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </Box>
  );
};

export default Codezy; 