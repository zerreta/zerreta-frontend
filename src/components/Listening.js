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
  Avatar,
  LinearProgress,
  Chip
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Headphones as HeadphonesIcon,
  VolumeUp as VolumeUpIcon,
  CheckCircle as CheckCircleIcon,
  PlayArrow as PlayArrowIcon,
  Psychology as PsychologyIcon,
  AutoGraph as AutoGraphIcon,
  Assessment as AssessmentIcon,
  Lock as LockIcon
} from '@mui/icons-material';

const Listening = () => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate('/student-dashboard/speaky');
  };

  const listeningLevels = [
    {
      id: 'A1',
      title: 'A1 - Beginner',
      subtitle: 'Basic Listening Skills',
      level: 'A1',
      description: 'Start with simple everyday conversations and basic English listening comprehension.',
      bgGradient: 'linear-gradient(135deg, #4CAF50 0%, #45a049 100%)',
      bgColor: '#E8F5E9',
      borderColor: '#4CAF50',
      textColor: '#2E7D32',
      packCount: 11,
      difficulty: 'Beginner',
      completed: 3,
      locked: false,
      features: ['Simple conversations', 'Basic vocabulary', 'Slow speech pace', 'Clear pronunciation']
    },
    {
      id: 'B1',
      title: 'B1 - Intermediate',
      subtitle: 'Intermediate Listening',
      level: 'B1',
      description: 'Practice with workplace conversations, travel scenarios, and everyday situations.',
      bgGradient: 'linear-gradient(135deg, #2196F3 0%, #1976d2 100%)',
      bgColor: '#E3F2FD',
      borderColor: '#2196F3',
      textColor: '#1565C0',
      packCount: 11,
      difficulty: 'Intermediate',
      completed: 0,
      locked: true,
      features: ['Professional dialogues', 'Travel conversations', 'News & media', 'Cultural topics']
    },
    {
      id: 'C1',
      title: 'C1 - Advanced',
      subtitle: 'Advanced Listening',
      level: 'C1',
      description: 'Master complex academic discussions, professional meetings, and nuanced conversations.',
      bgGradient: 'linear-gradient(135deg, #9C27B0 0%, #7b1fa2 100%)',
      bgColor: '#F3E5F5',
      borderColor: '#9C27B0',
      textColor: '#7B1FA2',
      packCount: 11,
      difficulty: 'Advanced',
      completed: 0,
      locked: true,
      features: ['Academic lectures', 'Business meetings', 'Complex discussions', 'Native-like speed']
    }
  ];

  const handleLevelClick = (level) => {
    if (level.locked) {
      alert(`${level.title} is locked. Complete A1 level first to unlock!`);
      return;
    }
    navigate(`/speaky/listening/${level.level.toLowerCase()}`);
  };

  const getDifficultyColor = (difficulty) => {
    const colors = {
      'Beginner': '#4CAF50',
      'Intermediate': '#2196F3', 
      'Advanced': '#9C27B0'
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
                  Listening Mastery
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
                Enhance your listening comprehension from A1 to C1 level
              </Typography>
              <Typography variant="body1" sx={{ opacity: 0.8 }}>
                Progressive listening exercises with YouTube content and interactive practices
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
                    3
                  </Typography>
                  <Typography variant="h6" sx={{ opacity: 0.9 }}>
                    CEFR Levels
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.7, mt: 1 }}>
                    A1 to C1 progression
                  </Typography>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Listening Levels Grid */}
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Grid container spacing={4}>
          {listeningLevels.map((level) => (
            <Grid item xs={12} md={4} key={level.id}>
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
                        backgroundColor: level.locked ? '#9ca3af' : level.borderColor,
                        width: 48,
                        height: 48,
                        mr: 2
                      }}
                    >
                      {level.locked ? <LockIcon /> : <HeadphonesIcon />}
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

                  {/* Features */}
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="caption" fontWeight={600} color="#374151" sx={{ mb: 1, display: 'block' }}>
                      What you'll practice:
                    </Typography>
                    {level.features.slice(0, 3).map((feature, index) => (
                      <Typography key={index} variant="caption" color="#64748b" sx={{ display: 'block', mb: 0.5 }}>
                        • {feature}
                      </Typography>
                    ))}
                  </Box>

                  {/* Progress Section */}
                  {!level.locked && level.completed > 0 && (
                    <Box sx={{ mb: 3 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="body2" fontWeight={600} color="#374151">
                          Progress
                        </Typography>
                        <Typography variant="body2" color="#6b7280">
                          {level.completed}/{level.packCount} packs
                        </Typography>
                      </Box>
                      <LinearProgress
                        variant="determinate"
                        value={getProgressPercentage(level.completed, level.packCount)}
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
                      <Typography variant="h6" fontWeight={600} color={level.locked ? '#9ca3af' : level.borderColor}>
                        {level.packCount}
                      </Typography>
                      <Typography variant="caption" color="#6b7280">
                        Packs
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
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="h6" fontWeight={600} color={level.locked ? '#9ca3af' : level.borderColor}>
                        <VolumeUpIcon sx={{ fontSize: '1.5rem' }} />
                      </Typography>
                      <Typography variant="caption" color="#6b7280">
                        Audio
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Features Section */}
        <Box sx={{ mt: 8, p: 4, backgroundColor: 'white', borderRadius: 3, boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <Typography variant="h5" fontWeight={600} color="#1e293b" gutterBottom>
            Why Choose Our Listening Module?
          </Typography>
          <Grid container spacing={3} sx={{ mt: 2 }}>
            <Grid item xs={12} md={4}>
              <Box sx={{ textAlign: 'center', p: 2 }}>
                <Avatar sx={{ bgcolor: '#4CAF50', width: 48, height: 48, mx: 'auto', mb: 2 }}>
                  <PlayArrowIcon />
                </Avatar>
                <Typography variant="h6" fontWeight={600} gutterBottom>
                  YouTube Content
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Real conversations from native speakers with authentic pronunciation and context
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box sx={{ textAlign: 'center', p: 2 }}>
                <Avatar sx={{ bgcolor: '#2196F3', width: 48, height: 48, mx: 'auto', mb: 2 }}>
                  <AutoGraphIcon />
                </Avatar>
                <Typography variant="h6" fontWeight={600} gutterBottom>
                  Progressive Learning
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Structured progression from basic A1 conversations to advanced C1 discussions
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box sx={{ textAlign: 'center', p: 2 }}>
                <Avatar sx={{ bgcolor: '#9C27B0', width: 48, height: 48, mx: 'auto', mb: 2 }}>
                  <AssessmentIcon />
                </Avatar>
                <Typography variant="h6" fontWeight={600} gutterBottom>
                  Interactive Practice
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Quizzes, fill-in-the-blank exercises, and comprehension tests for each pack
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Box>

        {/* Learning Journey */}
        <Box sx={{ mt: 6, p: 4, backgroundColor: '#f8fafc', borderRadius: 3, border: '1px solid #e5e7eb' }}>
          <Typography variant="h5" fontWeight={600} color="#1e293b" gutterBottom>
            Your Listening Journey
          </Typography>
          <Grid container spacing={3} sx={{ mt: 2 }}>
            <Grid item xs={12} md={6}>
              <Typography variant="body1" color="#475569" sx={{ mb: 2 }}>
                <strong>🎯 Level A1 (Beginner):</strong> Start with simple daily conversations, greetings, and basic vocabulary. Perfect for building foundation listening skills.
              </Typography>
              <Typography variant="body1" color="#475569" sx={{ mb: 2 }}>
                <strong>🚀 Level B1 (Intermediate):</strong> Progress to workplace discussions, travel scenarios, and cultural topics with natural speech patterns.
              </Typography>
              <Typography variant="body1" color="#475569">
                <strong>🏆 Level C1 (Advanced):</strong> Master complex academic content, business meetings, and nuanced conversations at near-native level.
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box sx={{ 
                backgroundColor: 'white', 
                borderRadius: 2, 
                p: 3,
                border: '1px solid #e5e7eb'
              }}>
                <Typography variant="h6" fontWeight={600} color="#1e293b" gutterBottom>
                  Each Pack Includes:
                </Typography>
                <Typography variant="body2" color="#64748b" sx={{ mb: 1 }}>
                  📹 YouTube video with native speakers
                </Typography>
                <Typography variant="body2" color="#64748b" sx={{ mb: 1 }}>
                  📝 Complete conversation transcripts
                </Typography>
                <Typography variant="body2" color="#64748b" sx={{ mb: 1 }}>
                  📚 Grammar lessons in context
                </Typography>
                <Typography variant="body2" color="#64748b" sx={{ mb: 1 }}>
                  🧠 Comprehension quiz questions
                </Typography>
                <Typography variant="body2" color="#64748b">
                  ✏️ Fill-in-the-blank practice exercises
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </Box>
  );
};

export default Listening; 