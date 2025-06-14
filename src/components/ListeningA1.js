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
  Chip,
  LinearProgress
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  PlayArrow as PlayArrowIcon,
  Headphones as HeadphonesIcon,
  Schedule as ScheduleIcon,
  VideoLibrary as VideoLibraryIcon,
  TrendingUp as TrendingUpIcon,
  Quiz as QuizIcon,
  Assignment as AssignmentIcon
} from '@mui/icons-material';

const ListeningA1 = () => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate('/speaky/listening');
  };

  // A1 packs data with enhanced information
  const a1Packs = [
    {
      id: 1,
      title: 'First Day at School',
      subtitle: 'Basic Introductions & Greetings',
      description: 'Learn essential greetings and how to introduce yourself when meeting new people at school.',
      youtubeUrl: 'https://www.youtube.com/watch?v=nuXyJazvm4U&list=PLxzKFWoy_6NC67Xj6MfgJHxtAKncOyBfO',
      duration: '4:32',
      difficulty: 'Very Easy',
      completed: false,
      locked: false,
      topics: ['Greetings', 'Introductions', 'Be Verbs'],
      bgColor: '#E8F5E9',
      borderColor: '#4CAF50'
    },
    {
      id: 2,
      title: 'Everyday Questions',
      subtitle: 'Yes/No Questions Practice',
      description: 'Master the art of asking and answering simple yes/no questions using be verbs in daily conversations.',
      youtubeUrl: '#',
      duration: '3:45',
      difficulty: 'Very Easy',
      completed: false,
      locked: false,
      topics: ['Be Verbs', 'Yes/No Questions', 'Everyday Topics'],
      bgColor: '#E8F5E9',
      borderColor: '#4CAF50'
    },
    {
      id: 3,
      title: 'Food & Drinks',
      subtitle: 'Expressing Preferences',
      description: 'Express your likes and dislikes about food, drinks, desserts, and snacks in English.',
      youtubeUrl: 'https://youtu.be/rDc6mGC1f_w',
      duration: '4:32',
      difficulty: 'Very Easy',
      completed: false,
      locked: false,
      topics: ['Food', 'Drinks', 'Likes/Preferences', 'Questions'],
      bgColor: '#E8F5E9',
      borderColor: '#4CAF50'
    },
    {
      id: 4,
      title: 'Daily Routine',
      subtitle: 'Describing Your Day',
      description: 'Learn to talk about your daily activities from morning routines to weekend plans.',
      youtubeUrl: '#',
      duration: '3:58',
      difficulty: 'Very Easy',
      completed: false,
      locked: false,
      topics: ['Daily Activities', 'Basic Verbs', 'Questions & Answers'],
      bgColor: '#E8F5E9',
      borderColor: '#4CAF50'
    },
    {
      id: 5,
      title: 'Simple Present Questions',
      subtitle: 'Do/Does Practice',
      description: 'Practice asking questions about sports, pets, cooking, and living situations using do/does.',
      youtubeUrl: '#',
      duration: '3:22',
      difficulty: 'Very Easy',
      completed: false,
      locked: false,
      topics: ['Do/Does Questions', 'Simple Present', 'Daily Life'],
      bgColor: '#E8F5E9',
      borderColor: '#4CAF50'
    },
    {
      id: 6,
      title: 'Third Person Singular',
      subtitle: 'He/She/It Conversations',
      description: 'Learn to talk about family members, work, and school using third person pronouns.',
      youtubeUrl: '#',
      duration: '4:05',
      difficulty: 'Easy',
      completed: false,
      locked: false,
      topics: ['He/She/It Pronouns', 'Family & Work', 'Third Person Questions'],
      bgColor: '#F1F8E9',
      borderColor: '#8BC34A'
    },
    {
      id: 7,
      title: 'Descriptive Adjectives',
      subtitle: 'Describing Things & Experiences',
      description: 'Use descriptive words to talk about classes, food, technology, and personal experiences.',
      youtubeUrl: '#',
      duration: '4:28',
      difficulty: 'Easy',
      completed: false,
      locked: false,
      topics: ['Adjectives', 'Descriptions', 'Opinions & Feelings'],
      bgColor: '#F1F8E9',
      borderColor: '#8BC34A'
    },
    {
      id: 8,
      title: 'Getting Directions',
      subtitle: 'Navigation & Places',
      description: 'Learn to ask for and give simple directions to common places in your neighborhood.',
      youtubeUrl: '#',
      duration: '3:54',
      difficulty: 'Easy',
      completed: false,
      locked: false,
      topics: ['Directions', 'Places', 'Prepositions'],
      bgColor: '#F1F8E9',
      borderColor: '#8BC34A'
    },
    {
      id: 9,
      title: 'Hobbies & Interests',
      subtitle: 'Talking About Activities',
      description: 'Share your hobbies and interests while learning about what others like to do.',
      youtubeUrl: '#',
      duration: '4:17',
      difficulty: 'Easy',
      completed: false,
      locked: false,
      topics: ['Hobbies', 'Likes/Dislikes', 'Gerunds'],
      bgColor: '#F1F8E9',
      borderColor: '#8BC34A'
    },
    {
      id: 10,
      title: 'Transportation',
      subtitle: 'Getting Around',
      description: 'Discuss different ways of getting around and transportation preferences.',
      youtubeUrl: '#',
      duration: '3:39',
      difficulty: 'Easy',
      completed: false,
      locked: false,
      topics: ['Transport', 'Travel', 'Modal Verbs'],
      bgColor: '#F1F8E9',
      borderColor: '#8BC34A'
    },
    {
      id: 11,
      title: 'Final Review',
      subtitle: 'A1 Comprehensive Assessment',
      description: 'Review and practice all A1 level topics in this comprehensive listening assessment.',
      youtubeUrl: '#',
      duration: '5:12',
      difficulty: 'Easy',
      completed: false,
      locked: false,
      topics: ['Review', 'Mixed Topics', 'Assessment'],
      bgColor: '#F1F8E9',
      borderColor: '#8BC34A'
    }
  ];

  const handlePackClick = (pack) => {
    navigate(`/speaky/listening/a1/pack/${pack.id}`);
  };

  const getDifficultyColor = (difficulty) => {
    const colors = {
      'Very Easy': '#4CAF50',
      'Easy': '#8BC34A',
      'Medium': '#FF9800'
    };
    return colors[difficulty] || '#4CAF50';
  };

  const getProgressPercentage = () => {
    const completedPacks = a1Packs.filter(pack => pack.completed).length;
    return Math.round((completedPacks / a1Packs.length) * 100);
  };

  const getTotalDuration = () => {
    return a1Packs.reduce((total, pack) => {
      const [minutes, seconds] = pack.duration.split(':').map(Number);
      return total + minutes + (seconds / 60);
    }, 0);
  };

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#f8fafc' }}>
      {/* Hero Section */}
      <Box sx={{ 
        background: 'linear-gradient(135deg, #4CAF50 0%, #45a049 100%)',
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
                A1 Beginner Listening
              </Typography>
              <Typography variant="h6" sx={{ opacity: 0.9, mb: 1 }}>
                Basic Listening Skills for English Beginners
              </Typography>
              <Typography variant="body1" sx={{ opacity: 0.8 }}>
                Start your English listening journey with simple conversations and everyday situations
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
              Back to Listening Levels
            </Button>
          </Box>

          {/* Stats Cards */}
          <Grid container spacing={3}>
            <Grid item xs={6} md={3}>
              <Box sx={{ 
                p: 2, 
                textAlign: 'center', 
                backgroundColor: 'rgba(255,255,255,0.1)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255,255,255,0.2)',
                borderRadius: 2
              }}>
                <Typography variant="h4" fontWeight={700} color="white">
                  {a1Packs.length}
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.8 }}>
                  Learning Packs
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={6} md={3}>
              <Box sx={{ 
                p: 2, 
                textAlign: 'center', 
                backgroundColor: 'rgba(255,255,255,0.1)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255,255,255,0.2)',
                borderRadius: 2
              }}>
                <Typography variant="h4" fontWeight={700} color="white">
                  {Math.round(getTotalDuration())}m
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.8 }}>
                  Total Duration
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={6} md={3}>
              <Box sx={{ 
                p: 2, 
                textAlign: 'center', 
                backgroundColor: 'rgba(255,255,255,0.1)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255,255,255,0.2)',
                borderRadius: 2
              }}>
                <Typography variant="h4" fontWeight={700} color="white">
                  A1
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.8 }}>
                  CEFR Level
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={6} md={3}>
              <Box sx={{ 
                p: 2, 
                textAlign: 'center', 
                backgroundColor: 'rgba(255,255,255,0.1)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255,255,255,0.2)',
                borderRadius: 2
              }}>
                <Typography variant="h4" fontWeight={700} color="white">
                  {getProgressPercentage()}%
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.8 }}>
                  Progress
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Learning Packs Grid */}
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Grid container spacing={3}>
          {a1Packs.map((pack) => (
            <Grid item xs={12} sm={6} lg={4} key={pack.id}>
              <Card
                sx={{
                  height: '100%',
                  borderRadius: 3,
                  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  cursor: 'pointer',
                  position: 'relative',
                  overflow: 'hidden',
                  border: `2px solid ${pack.borderColor}15`,
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: `0 12px 40px ${pack.borderColor}25`,
                    borderColor: `${pack.borderColor}40`
                  }
                }}
                onClick={() => handlePackClick(pack)}
              >
                {/* Gradient overlay */}
                <Box
                  sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: 6,
                    background: `linear-gradient(135deg, ${pack.borderColor} 0%, ${pack.borderColor}dd 100%)`
                  }}
                />

                <CardContent sx={{ p: 3 }}>
                  {/* Header */}
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                    <Avatar
                      sx={{
                        backgroundColor: pack.borderColor,
                        width: 40,
                        height: 40,
                        mr: 2,
                        fontSize: '1.2rem',
                        fontWeight: 700
                      }}
                    >
                      {pack.id}
                    </Avatar>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="h6" fontWeight={600} color="#1e293b" sx={{ fontSize: '1.1rem', mb: 0.5 }}>
                        {pack.title}
                      </Typography>
                      <Typography variant="caption" color="#64748b" sx={{ fontWeight: 500 }}>
                        {pack.subtitle}
                      </Typography>
                    </Box>
                  </Box>

                  {/* Description */}
                  <Typography variant="body2" color="#475569" sx={{ mb: 2, lineHeight: 1.5, fontSize: '0.9rem' }}>
                    {pack.description}
                  </Typography>

                  {/* Duration and Difficulty */}
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                    <Chip
                      icon={<ScheduleIcon sx={{ fontSize: '0.9rem' }} />}
                      label={pack.duration}
                      size="small"
                      variant="outlined"
                      sx={{
                        borderColor: pack.borderColor,
                        color: pack.borderColor,
                        fontSize: '0.75rem',
                        height: 24
                      }}
                    />
                    <Chip
                      label={pack.difficulty}
                      size="small"
                      sx={{
                        backgroundColor: getDifficultyColor(pack.difficulty),
                        color: 'white',
                        fontWeight: 600,
                        fontSize: '0.75rem',
                        height: 24
                      }}
                    />
                  </Box>

                  {/* Topics */}
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="caption" fontWeight={600} color="#374151" sx={{ mb: 1, display: 'block' }}>
                      Topics covered:
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {pack.topics.slice(0, 3).map((topic, index) => (
                        <Chip 
                          key={index}
                          label={topic}
                          size="small"
                          variant="outlined"
                          sx={{ 
                            fontSize: '0.7rem',
                            height: '20px',
                            borderColor: `${pack.borderColor}60`,
                            color: `${pack.borderColor}`
                          }}
                        />
                      ))}
                    </Box>
                  </Box>

                  {/* Action Section */}
                  <Box sx={{ 
                    pt: 2, 
                    borderTop: '1px solid #e5e7eb',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <VideoLibraryIcon sx={{ fontSize: '1.2rem', color: pack.borderColor }} />
                      <Typography variant="caption" color="#64748b" fontWeight={500}>
                        Video + Practice
                      </Typography>
                    </Box>
                    
                    <Avatar
                      sx={{
                        backgroundColor: pack.borderColor,
                        width: 32,
                        height: 32,
                        '&:hover': {
                          backgroundColor: `${pack.borderColor}dd`,
                          transform: 'scale(1.1)'
                        },
                        transition: 'all 0.2s ease'
                      }}
                    >
                      <PlayArrowIcon sx={{ fontSize: '1.2rem' }} />
                    </Avatar>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Learning Path Information */}
        <Box sx={{ mt: 6, p: 4, backgroundColor: 'white', borderRadius: 3, boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <Typography variant="h5" fontWeight={600} color="#1e293b" gutterBottom>
            Your A1 Learning Path
          </Typography>
          <Grid container spacing={3} sx={{ mt: 2 }}>
            <Grid item xs={12} md={4}>
              <Box sx={{ textAlign: 'center', p: 2 }}>
                <Avatar sx={{ bgcolor: '#4CAF50', width: 48, height: 48, mx: 'auto', mb: 2 }}>
                  <HeadphonesIcon />
                </Avatar>
                <Typography variant="h6" fontWeight={600} gutterBottom>
                  Listen & Learn
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Watch YouTube videos with native speakers and follow along with conversations
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box sx={{ textAlign: 'center', p: 2 }}>
                <Avatar sx={{ bgcolor: '#8BC34A', width: 48, height: 48, mx: 'auto', mb: 2 }}>
                  <QuizIcon />
                </Avatar>
                <Typography variant="h6" fontWeight={600} gutterBottom>
                  Test Understanding
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Complete quizzes and comprehension exercises to check your progress
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box sx={{ textAlign: 'center', p: 2 }}>
                <Avatar sx={{ bgcolor: '#66BB6A', width: 48, height: 48, mx: 'auto', mb: 2 }}>
                  <TrendingUpIcon />
                </Avatar>
                <Typography variant="h6" fontWeight={600} gutterBottom>
                  Track Progress
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Monitor your improvement as you complete each pack and build confidence
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Box>

        {/* Study Tips */}
        <Box sx={{ mt: 4, p: 4, backgroundColor: '#f0f9ff', borderRadius: 3, border: '1px solid #bae6fd' }}>
          <Typography variant="h6" fontWeight={600} color="#1e293b" gutterBottom>
            💡 Study Tips for Success
          </Typography>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} md={6}>
              <Typography variant="body2" color="#475569" sx={{ mb: 1 }}>
                🎯 <strong>Start Simple:</strong> Begin with Pack 1 and progress sequentially for best results
              </Typography>
              <Typography variant="body2" color="#475569" sx={{ mb: 1 }}>
                🔄 <strong>Repeat:</strong> Listen to each video multiple times to improve comprehension
              </Typography>
              <Typography variant="body2" color="#475569">
                📝 <strong>Take Notes:</strong> Write down new words and phrases you hear
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="body2" color="#475569" sx={{ mb: 1 }}>
                🗣️ <strong>Practice Speaking:</strong> Repeat what you hear to improve pronunciation
              </Typography>
              <Typography variant="body2" color="#475569" sx={{ mb: 1 }}>
                🧠 <strong>Be Patient:</strong> Understanding takes time - don't worry if you miss some words
              </Typography>
              <Typography variant="body2" color="#475569">
                ✅ <strong>Complete Exercises:</strong> Do all quizzes and practice activities for each pack
              </Typography>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </Box>
  );
};

export default ListeningA1; 