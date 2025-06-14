import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  Container,
  Grid,
  Card,
  CardContent,
  Avatar,
  LinearProgress,
  Chip,
  IconButton
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Edit as EditIcon,
  Create as CreateIcon,
  Assignment as EssayIcon,
  Spellcheck as GrammarIcon,
  PlayArrow as PlayArrowIcon,
  Lock as LockIcon,
  CheckCircle as CheckCircleIcon
} from '@mui/icons-material';

const SpeakyWriting = () => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate('/student-dashboard/speaky');
  };

  const writingLevels = [
    {
      id: 3,
      title: 'Class 3 Writing',
      subtitle: 'Basic Writing Skills',
      icon: <EditIcon />,
      bgGradient: 'linear-gradient(135deg, #4CAF50 0%, #45a049 100%)',
      bgColor: '#E8F5E9',
      borderColor: '#4CAF50',
      description: 'Master fundamental writing skills with simple sentences and basic paragraph structure.',
      exercises: 8,
      completed: 0,
      difficulty: 'Class 3',
      path: '/speaky/writing/3',
      locked: false,
      questions: [
        'Write 5 sentences about your favourite fruit.',
        'Look at the picture and write 3 sentences about it.',
        'Fill in the blanks with a, an, the.',
        'Write 3 naming words (nouns) you see at home.',
        'Make 5 simple sentences using is/am/are.',
        'Describe your pet or a friend\'s pet in 5 lines.',
        'Write 3 things under your table, 3 things on your table.',
        'Write a short paragraph: "My School Bag" (5 lines).'
      ]
    },
    {
      id: 4,
      title: 'Class 4 Writing',
      subtitle: 'Descriptive Writing',
      icon: <CreateIcon />,
      bgGradient: 'linear-gradient(135deg, #2196F3 0%, #1976d2 100%)',
      bgColor: '#E3F2FD',
      borderColor: '#2196F3',
      description: 'Develop descriptive writing skills and learn to create engaging paragraphs.',
      exercises: 10,
      completed: 0,
      difficulty: 'Class 4',
      path: '/speaky/writing/4',
      locked: false
    },
    {
      id: 5,
      title: 'Class 5 Writing',
      subtitle: 'Creative Expression',
      icon: <EssayIcon />,
      bgGradient: 'linear-gradient(135deg, #9C27B0 0%, #7b1fa2 100%)',
      bgColor: '#F3E5F5',
      borderColor: '#9C27B0',
      description: 'Explore creative writing techniques and improve storytelling abilities.',
      exercises: 12,
      completed: 0,
      difficulty: 'Class 5',
      path: '/speaky/writing/5',
      locked: false
    },
    {
      id: 6,
      title: 'Class 6 Writing',
      subtitle: 'Structured Writing',
      icon: <GrammarIcon />,
      bgGradient: 'linear-gradient(135deg, #FF9800 0%, #f57c00 100%)',
      bgColor: '#FFF3E0',
      borderColor: '#FF9800',
      description: 'Learn structured writing formats including essays and formal letters.',
      exercises: 15,
      completed: 0,
      difficulty: 'Class 6',
      path: '/speaky/writing/6',
      locked: false
    },
    {
      id: 7,
      title: 'Class 7 Writing',
      subtitle: 'Advanced Composition',
      icon: <EditIcon />,
      bgGradient: 'linear-gradient(135deg, #607D8B 0%, #455a64 100%)',
      bgColor: '#ECEFF1',
      borderColor: '#607D8B',
      description: 'Master advanced composition techniques and analytical writing skills.',
      exercises: 18,
      completed: 0,
      difficulty: 'Class 7',
      path: '/speaky/writing/7',
      locked: false
    },
    {
      id: 8,
      title: 'Class 8 Writing',
      subtitle: 'Professional Writing',
      icon: <CreateIcon />,
      bgGradient: 'linear-gradient(135deg, #795548 0%, #5d4037 100%)',
      bgColor: '#EFEBE9',
      borderColor: '#795548',
      description: 'Develop professional writing skills for academic and formal contexts.',
      exercises: 20,
      completed: 0,
      difficulty: 'Class 8',
      path: '/speaky/writing/8',
      locked: false
    }
  ];

  const handleLevelClick = (level) => {
    navigate(level.path);
  };

  const getDifficultyColor = (difficulty) => {
    const colors = {
      'Class 3': '#4CAF50',
      'Class 4': '#2196F3',
      'Class 5': '#9C27B0',
      'Class 6': '#FF9800',
      'Class 7': '#607D8B',
      'Class 8': '#795548'
    };
    return colors[difficulty] || '#4CAF50';
  };

  const getProgressPercentage = (completed, total) => {
    return Math.round((completed / total) * 100);
  };

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#f8fafc' }}>
      {/* Hero Section */}
      <Box sx={{ 
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        py: 6
      }}>
        <Container maxWidth="lg">
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
                  Writing Mastery
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
                  Back to Speaky
                </Button>
              </Box>
              <Typography variant="h6" sx={{ opacity: 0.9, mb: 1 }}>
                Develop exceptional writing skills from Class 3 to Class 8
              </Typography>
              <Typography variant="body1" sx={{ opacity: 0.8 }}>
                Progressive writing exercises designed to enhance creativity and communication
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
                    6
                  </Typography>
                  <Typography variant="h6" sx={{ opacity: 0.9 }}>
                    Writing Levels
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.7, mt: 1 }}>
                    From basic to advanced
                  </Typography>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Writing Levels Grid */}
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Grid container spacing={3}>
          {writingLevels.map((level) => (
            <Grid item xs={12} md={6} lg={4} key={level.id}>
              <Card
                sx={{
                  height: '100%',
                  borderRadius: 3,
                  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  cursor: level.locked ? 'not-allowed' : 'pointer',
                  position: 'relative',
                  overflow: 'hidden',
                  border: `2px solid ${level.borderColor}15`,
                  opacity: level.locked ? 0.6 : 1,
                  '&:hover': level.locked ? {} : {
                    transform: 'translateY(-8px)',
                    boxShadow: `0 12px 40px ${level.borderColor}25`,
                    borderColor: `${level.borderColor}40`
                  }
                }}
                onClick={() => handleLevelClick(level)}
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

                <CardContent sx={{ p: 3 }}>
                  {/* Header */}
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 3 }}>
                    <Avatar
                      sx={{
                        backgroundColor: level.borderColor,
                        width: 48,
                        height: 48,
                        mr: 2
                      }}
                    >
                      {level.locked ? <LockIcon /> : level.icon}
                    </Avatar>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="h6" fontWeight={600} color="#1e293b" gutterBottom>
                        {level.title}
                      </Typography>
                      <Chip
                        label={level.difficulty}
                        size="small"
                        sx={{
                          backgroundColor: getDifficultyColor(level.difficulty),
                          color: 'white',
                          fontWeight: 600,
                          fontSize: '0.75rem'
                        }}
                      />
                    </Box>
                  </Box>

                  {/* Subtitle */}
                  <Typography variant="body2" color="#64748b" sx={{ mb: 2, fontWeight: 500 }}>
                    {level.subtitle}
                  </Typography>

                  {/* Description */}
                  <Typography variant="body2" color="#475569" sx={{ mb: 3, lineHeight: 1.6 }}>
                    {level.description}
                  </Typography>

                  {/* Progress Section */}
                  {!level.locked && (
                    <Box sx={{ mb: 3 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="body2" fontWeight={600} color="#374151">
                          Progress
                        </Typography>
                        <Typography variant="body2" color="#6b7280">
                          {level.completed}/{level.exercises} exercises
                        </Typography>
                      </Box>
                      <LinearProgress
                        variant="determinate"
                        value={getProgressPercentage(level.completed, level.exercises)}
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
                  )}

                  {/* Stats */}
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', pt: 2, borderTop: '1px solid #e5e7eb' }}>
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="h6" fontWeight={600} color={level.borderColor}>
                        {level.exercises}
                      </Typography>
                      <Typography variant="caption" color="#6b7280">
                        Exercises
                      </Typography>
                    </Box>
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="h6" fontWeight={600} color={level.locked ? '#9ca3af' : '#10b981'}>
                        {level.locked ? '🔒' : level.completed}
                      </Typography>
                      <Typography variant="caption" color="#6b7280">
                        {level.locked ? 'Locked' : 'Completed'}
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Information Section */}
        <Box sx={{ mt: 6, p: 4, backgroundColor: 'white', borderRadius: 3, boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <Typography variant="h5" fontWeight={600} color="#1e293b" gutterBottom>
            Start Your Writing Journey
          </Typography>
          <Grid container spacing={3} sx={{ mt: 2 }}>
            <Grid item xs={12} md={4}>
              <Box sx={{ textAlign: 'center', p: 2 }}>
                <Avatar sx={{ bgcolor: '#4CAF50', width: 48, height: 48, mx: 'auto', mb: 2 }}>
                  <EditIcon />
                </Avatar>
                <Typography variant="h6" fontWeight={600} gutterBottom>
                  Start with Class 3
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Begin with fundamental writing exercises and basic sentence formation
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
                  Complete exercises to unlock higher levels and advanced writing skills
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box sx={{ textAlign: 'center', p: 2 }}>
                <Avatar sx={{ bgcolor: '#9C27B0', width: 48, height: 48, mx: 'auto', mb: 2 }}>
                  <EssayIcon />
                </Avatar>
                <Typography variant="h6" fontWeight={600} gutterBottom>
                  Master Writing
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Develop professional writing skills suitable for academic and formal contexts
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </Box>
  );
};

export default SpeakyWriting; 