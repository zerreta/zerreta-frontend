import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  Container,
  Grid,
  Card,
  CardContent,
  CardActions,
  Chip,
  Avatar,
  LinearProgress
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  PlayArrow as PlayArrowIcon,
  Quiz as QuizIcon,
  School as SchoolIcon,
  TrendingUp as TrendingUpIcon,
  CheckCircle as CheckCircleIcon,
  Park as EcoIcon,
  MenuBook as MenuBookIcon,
  GpsFixed as TargetIcon,
  EmojiEvents as TrophyIcon,
  Create as CreateIcon,
  AutoGraph as AutoGraphIcon,
  Assessment as AssessmentIcon,
  Lock as LockIcon
} from '@mui/icons-material';

const SpeakyGrammar = () => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate('/student-dashboard/speaky');
  };

  const grammarLevels = [
    {
      id: 1,
      title: 'Beginner Grammar',
      subtitle: 'Topics 1-10',
      icon: <EcoIcon />,
      bgGradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      bgColor: '#F8F9FF',
      borderColor: '#667eea',
      description: 'Master the fundamentals of English grammar with basic sentence structures and essential rules.',
      topics: 10,
      completed: 7,
      difficulty: 'Beginner',
      path: '/speaky/grammar/beginner',
      module: 'beginner',
      locked: false
    },
    {
      id: 2,
      title: 'Basic Grammar',
      subtitle: 'Topics 11-20',
      icon: <MenuBookIcon />,
      bgGradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      bgColor: '#FFF8F8',
      borderColor: '#f093fb',
      description: 'Build upon basic grammar structures and expand your understanding of verb tenses.',
      topics: 10,
      completed: 4,
      difficulty: 'Basic',
      path: '/speaky/grammar/basic',
      module: 'basic',
      locked: true
    },
    {
      id: 3,
      title: 'Intermediate Grammar',
      subtitle: 'Topics 21-35',
      icon: <TargetIcon />,
      bgGradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
      bgColor: '#F0FEFF',
      borderColor: '#4facfe',
      description: 'Master intermediate concepts including complex sentences and advanced structures.',
      topics: 15,
      completed: 2,
      difficulty: 'Intermediate',
      path: '/speaky/grammar/intermediate',
      module: 'intermediate',
      locked: true
    },
    {
      id: 4,
      title: 'Advanced Grammar',
      subtitle: 'Topics 36-50',
      icon: <TrophyIcon />,
      bgGradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
      bgColor: '#F0FFF8',
      borderColor: '#43e97b',
      description: 'Perfect advanced grammar structures and sophisticated language patterns.',
      topics: 15,
      completed: 0,
      difficulty: 'Advanced',
      path: '/speaky/grammar/advanced',
      module: 'advanced',
      locked: true
    }
  ];

  const handleLevelClick = (path, locked) => {
    if (!locked) {
      navigate(path);
    }
  };

  const handleStartTest = (module, locked) => {
    if (!locked) {
      navigate('/grammar-test', {
        state: {
          module: module
        }
      });
    }
  };

  const getProgressPercentage = (completed, total) => {
    return Math.round((completed / total) * 100);
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Beginner': return '#4CAF50';
      case 'Basic': return '#FF9800';
      case 'Intermediate': return '#2196F3';
      case 'Advanced': return '#9C27B0';
      default: return '#757575';
    }
  };

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
                <Typography variant="h3" fontWeight={700} sx={{ 
                  flexGrow: 1,
                  fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' }
                }}>
                  Master English Grammar
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
                  Back to Previous Page
                </Button>
              </Box>
              <Typography variant="h6" sx={{ opacity: 0.9, mb: 3, lineHeight: 1.6 }}>
                Progressive learning path from fundamentals to advanced concepts.
                Start your journey today and build confidence in English grammar.
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <Chip 
                  icon={<SchoolIcon />} 
                  label="50+ Topics" 
                  sx={{ backgroundColor: 'rgba(255,255,255,0.2)', color: 'white' }}
                />
                <Chip 
                  icon={<QuizIcon />} 
                  label="Interactive Tests" 
                  sx={{ backgroundColor: 'rgba(255,255,255,0.2)', color: 'white' }}
                />
                <Chip 
                  icon={<TrendingUpIcon />} 
                  label="Progress Tracking" 
                  sx={{ backgroundColor: 'rgba(255,255,255,0.2)', color: 'white' }}
                />
              </Box>
            </Grid>
            <Grid item xs={12} md={4} sx={{ textAlign: 'center' }}>
              <MenuBookIcon sx={{ 
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
          Choose Your Level
        </Typography>
        <Typography variant="body1" color="#64748b" sx={{ mb: 4 }}>
          Select the level that matches your current English proficiency
        </Typography>

        <Grid container spacing={4} sx={{ width: '100%', m: 0 }}>
          {grammarLevels.map((level) => (
            <Grid item xs={12} sm={6} lg={6} key={level.id}>
              <Card
                sx={{
                  height: '100%',
                  borderRadius: 3,
                  border: `2px solid ${level.borderColor}20`,
                  backgroundColor: level.bgColor,
                  transition: 'all 0.3s ease',
                  cursor: level.locked ? 'not-allowed' : 'pointer',
                  position: 'relative',
                  overflow: 'hidden',
                  '&:hover': level.locked ? {} : {
                    transform: 'translateY(-8px)',
                    boxShadow: `0 20px 40px ${level.borderColor}20`,
                    border: `2px solid ${level.borderColor}`,
                  }
                }}
              >
                {/* Card Content */}
                <Box
                  sx={{
                    height: '100%',
                    opacity: level.locked ? 0.4 : 1
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

                  <CardContent sx={{ p: 4, pb: 2 }}>
                    {/* Header */}
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 3 }}>
                      <Avatar
                        sx={{
                          backgroundColor: level.borderColor,
                          width: 56,
                          height: 56,
                          mr: 2,
                          fontSize: '24px'
                        }}
                      >
                        {level.icon}
                      </Avatar>
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="h5" fontWeight={600} color="#1e293b" gutterBottom>
                          {level.title}
                        </Typography>
                        <Chip
                          label={level.difficulty}
                          size="small"
                          sx={{
                            backgroundColor: getDifficultyColor(level.difficulty),
                            color: 'white',
                            fontWeight: 600,
                            mb: 1
                          }}
                        />
                        <Typography variant="body2" color="#64748b">
                          {level.subtitle}
                        </Typography>
                      </Box>
                    </Box>

                    {/* Description */}
                    <Typography variant="body2" color="#475569" sx={{ mb: 3, lineHeight: 1.6 }}>
                      {level.description}
                    </Typography>

                    {/* Progress */}
                    <Box sx={{ mb: 3 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="body2" fontWeight={600} color="#374151">
                          Progress
                        </Typography>
                        <Typography variant="body2" color="#6b7280">
                          {level.completed}/{level.topics} topics
                        </Typography>
                      </Box>
                      <LinearProgress
                        variant="determinate"
                        value={getProgressPercentage(level.completed, level.topics)}
                        sx={{
                          height: 8,
                          borderRadius: 4,
                          backgroundColor: '#e5e7eb',
                          '& .MuiLinearProgress-bar': {
                            backgroundColor: level.borderColor,
                            borderRadius: 4
                          }
                        }}
                      />
                      <Typography variant="caption" color="#6b7280" sx={{ mt: 0.5 }}>
                        {getProgressPercentage(level.completed, level.topics)}% complete
                      </Typography>
                    </Box>

                    {/* Stats */}
                    <Box sx={{ display: 'flex', gap: 3, mb: 3 }}>
                      <Box sx={{ textAlign: 'center' }}>
                        <Typography variant="h6" fontWeight={600} color={level.borderColor}>
                          {level.topics}
                        </Typography>
                        <Typography variant="caption" color="#6b7280">
                          Topics
                        </Typography>
                      </Box>
                      <Box sx={{ textAlign: 'center' }}>
                        <Typography variant="h6" fontWeight={600} color="#10b981">
                          {level.completed}
                        </Typography>
                        <Typography variant="caption" color="#6b7280">
                          Completed
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>

                  <CardActions sx={{ p: 4, pt: 0, gap: 2 }}>
                    <Button
                      fullWidth
                      variant="contained"
                      startIcon={level.locked ? <LockIcon /> : <PlayArrowIcon />}
                      onClick={() => handleLevelClick(level.path, level.locked)}
                      disabled={level.locked}
                      sx={{
                        background: level.locked ? '#9ca3af' : level.bgGradient,
                        color: 'white',
                        fontWeight: 600,
                        py: 1.5,
                        borderRadius: 2,
                        textTransform: 'none',
                        '&:hover': level.locked ? {} : {
                          background: level.bgGradient,
                          opacity: 0.9
                        },
                        '&:disabled': {
                          background: '#9ca3af',
                          color: 'white'
                        }
                      }}
                    >
                      {level.locked ? 'Locked' : 'Learn Topics'}
                    </Button>
                    <Button
                      fullWidth
                      variant="outlined"
                      startIcon={level.locked ? <LockIcon /> : <QuizIcon />}
                      onClick={() => handleStartTest(level.module, level.locked)}
                      disabled={level.locked}
                      sx={{
                        borderColor: level.locked ? '#9ca3af' : level.borderColor,
                        color: level.locked ? '#9ca3af' : level.borderColor,
                        fontWeight: 600,
                        py: 1.5,
                        borderRadius: 2,
                        textTransform: 'none',
                        '&:hover': level.locked ? {} : {
                          backgroundColor: `${level.borderColor}10`,
                          borderColor: level.borderColor
                        },
                        '&:disabled': {
                          borderColor: '#9ca3af',
                          color: '#9ca3af'
                        }
                      }}
                    >
                      {level.locked ? 'Locked' : 'Take Test'}
                    </Button>
                  </CardActions>
                </Box>

                {/* Simple Lock Icon - Center */}
                {level.locked && (
                  <Box
                    sx={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      zIndex: 10,
                      textAlign: 'center'
                    }}
                  >
                    <LockIcon 
                      sx={{ 
                        fontSize: '4rem',
                        color: '#ef4444',
                        filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.3))',
                        mb: 2
                      }} 
                    />
                    <Typography
                      variant="h6"
                      fontWeight={700}
                      sx={{
                        color: '#1e293b',
                        backgroundColor: 'rgba(255,255,255,0.95)',
                        px: 2,
                        py: 1,
                        borderRadius: 2,
                        border: '2px solid #ef4444',
                        textShadow: 'none',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                      }}
                    >
                      {level.id === 2 && 'Complete Beginner'}
                      {level.id === 3 && 'Complete Basic'}
                      {level.id === 4 && 'Complete Intermediate'}
                    </Typography>
                  </Box>
                )}
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Features Section */}
        <Box sx={{ mt: 8, p: 4, backgroundColor: 'white', borderRadius: 3, boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <Typography variant="h5" fontWeight={600} color="#1e293b" gutterBottom>
            Why Choose Our Grammar Module?
          </Typography>
          <Grid container spacing={3} sx={{ mt: 2 }}>
            <Grid item xs={12} md={4}>
              <Box sx={{ textAlign: 'center', p: 2 }}>
                <Avatar sx={{ bgcolor: '#3b82f6', width: 48, height: 48, mx: 'auto', mb: 2 }}>
                  <AutoGraphIcon />
                </Avatar>
                <Typography variant="h6" fontWeight={600} gutterBottom>
                  Progressive Learning
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Start from basics and gradually advance to complex grammar structures
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box sx={{ textAlign: 'center', p: 2 }}>
                <Avatar sx={{ bgcolor: '#10b981', width: 48, height: 48, mx: 'auto', mb: 2 }}>
                  <TargetIcon />
                </Avatar>
                <Typography variant="h6" fontWeight={600} gutterBottom>
                  Interactive Practice
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Engage with quizzes and exercises designed to reinforce learning
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box sx={{ textAlign: 'center', p: 2 }}>
                <Avatar sx={{ bgcolor: '#f59e0b', width: 48, height: 48, mx: 'auto', mb: 2 }}>
                  <AssessmentIcon />
                </Avatar>
                <Typography variant="h6" fontWeight={600} gutterBottom>
                  Track Progress
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Monitor your improvement with detailed progress tracking
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </Box>
  );
};

export default SpeakyGrammar; 