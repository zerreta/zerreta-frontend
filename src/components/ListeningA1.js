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
  IconButton,
  Toolbar,
  AppBar,
  Chip
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  PlayArrow as PlayArrowIcon,
  CheckCircle as CheckCircleIcon,
  Lock as LockIcon
} from '@mui/icons-material';

const ListeningA1 = () => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate('/speaky/listening');
  };

  // Sample data for A1 packs - Pack 1 has your content, others are placeholders
  const a1Packs = [
    {
      id: 1,
      title: 'First Day at School',
      description: 'Basic introductions and meeting new people',
      youtubeUrl: 'https://www.youtube.com/watch?v=nuXyJazvm4U&list=PLxzKFWoy_6NC67Xj6MfgJHxtAKncOyBfO',
      duration: '4:32',
      difficulty: 'Very Easy',
      completed: false,
      locked: false,
      topics: ['Greetings', 'Introductions', 'Be Verbs']
    },
    {
      id: 2,
      title: 'At the Cafe',
      description: 'Ordering food and drinks in simple English',
      youtubeUrl: '#',
      duration: '3:45',
      difficulty: 'Very Easy',
      completed: false,
      locked: false,
      topics: ['Food', 'Ordering', 'Numbers']
    },
    {
      id: 3,
      title: 'Family Members',
      description: 'Talking about family and relationships',
      youtubeUrl: '#',
      duration: '4:12',
      difficulty: 'Very Easy',
      completed: false,
      locked: false,
      topics: ['Family', 'Possessives', 'This/That']
    },
    {
      id: 4,
      title: 'Daily Routine',
      description: 'Describing what you do every day',
      youtubeUrl: '#',
      duration: '3:58',
      difficulty: 'Very Easy',
      completed: false,
      locked: false,
      topics: ['Time', 'Activities', 'Present Simple']
    },
    {
      id: 5,
      title: 'Colors and Shapes',
      description: 'Learning about colors and basic shapes',
      youtubeUrl: '#',
      duration: '3:22',
      difficulty: 'Very Easy',
      completed: false,
      locked: false,
      topics: ['Colors', 'Shapes', 'Adjectives']
    },
    {
      id: 6,
      title: 'Weather Talk',
      description: 'Simple conversations about weather',
      youtubeUrl: '#',
      duration: '4:05',
      difficulty: 'Easy',
      completed: false,
      locked: false,
      topics: ['Weather', 'Seasons', 'It is/It has']
    },
    {
      id: 7,
      title: 'Shopping Basics',
      description: 'Basic shopping conversations',
      youtubeUrl: '#',
      duration: '4:28',
      difficulty: 'Easy',
      completed: false,
      locked: false,
      topics: ['Shopping', 'Money', 'How much/many']
    },
    {
      id: 8,
      title: 'Directions',
      description: 'Asking for and giving simple directions',
      youtubeUrl: '#',
      duration: '3:54',
      difficulty: 'Easy',
      completed: false,
      locked: false,
      topics: ['Directions', 'Places', 'Prepositions']
    },
    {
      id: 9,
      title: 'Hobbies and Interests',
      description: 'Talking about what you like to do',
      youtubeUrl: '#',
      duration: '4:17',
      difficulty: 'Easy',
      completed: false,
      locked: false,
      topics: ['Hobbies', 'Likes/Dislikes', 'Gerunds']
    },
    {
      id: 10,
      title: 'Transportation',
      description: 'Using different types of transport',
      youtubeUrl: '#',
      duration: '3:39',
      difficulty: 'Easy',
      completed: false,
      locked: false,
      topics: ['Transport', 'Travel', 'Modal Verbs']
    },
    {
      id: 11,
      title: 'Final Review',
      description: 'Review of all A1 level topics',
      youtubeUrl: '#',
      duration: '5:12',
      difficulty: 'Easy',
      completed: false,
      locked: false,
      topics: ['Review', 'Mixed Topics', 'Assessment']
    }
  ];

  const handlePackClick = (pack) => {
    navigate(`/speaky/listening/a1/pack/${pack.id}`);
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Very Easy': return '#4CAF50';
      case 'Easy': return '#8BC34A';
      case 'Medium': return '#FF9800';
      default: return '#4CAF50';
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#f5f5f5' }}>
      {/* Header */}
      <AppBar position="static" sx={{ backgroundColor: '#4CAF50', minHeight: 'auto' }}>
        <Toolbar sx={{ minHeight: '44px !important', py: 0.75 }}>
          <IconButton
            edge="start"
            color="inherit"
            onClick={handleGoBack}
            sx={{ 
              mr: 0.5, 
              p: 0.25,
              minWidth: 'auto',
              width: 28,
              height: 28,
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.1)'
              }
            }}
          >
            <ArrowBackIcon sx={{ fontSize: 24 }} />
          </IconButton>
          
          <Typography variant="body2" sx={{ flexGrow: 1, fontSize: '0.9rem' }}>
            🎧 A1 Beginner - Listening Packs
          </Typography>
        </Toolbar>
      </AppBar>

      {/* Main Content */}
      <Container maxWidth="lg" sx={{ py: 4, flex: 1 }}>
        {/* Title Section */}
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Typography variant="h4" fontWeight={600} color="#333" gutterBottom>
            A1 Beginner Level
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto' }}>
            Master basic English listening skills with 11 carefully structured learning packs
          </Typography>
        </Box>

        {/* Progress Overview */}
        <Box sx={{ mb: 4, p: 3, backgroundColor: 'white', borderRadius: 3, boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={4}>
              <Typography variant="h6" fontWeight={600} color="#4CAF50">
                Progress: 0/11 Completed
              </Typography>
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography variant="body2" color="text.secondary">
                Total Duration: ~45 minutes
              </Typography>
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography variant="body2" color="text.secondary">
                Level: A1 Beginner
              </Typography>
            </Grid>
          </Grid>
        </Box>

        {/* Packs Grid */}
        <Grid container spacing={3}>
          {a1Packs.map((pack) => (
            <Grid item xs={12} sm={6} md={4} key={pack.id}>
              <Card 
                sx={{ 
                  height: '100%', 
                  display: 'flex', 
                  flexDirection: 'column',
                  borderRadius: 3,
                  border: pack.locked ? '2px solid #e0e0e0' : '2px solid #4CAF50',
                  backgroundColor: pack.locked ? '#f5f5f5' : 'white',
                  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                  cursor: pack.locked ? 'not-allowed' : 'pointer',
                  opacity: pack.locked ? 0.6 : 1,
                  '&:hover': pack.locked ? {} : {
                    transform: 'translateY(-5px)',
                    boxShadow: '0 8px 25px rgba(76, 175, 80, 0.2)',
                  }
                }}
                onClick={() => handlePackClick(pack)}
              >
                {/* Pack Header */}
                <Box 
                  sx={{ 
                    p: 2,
                    display: 'flex', 
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    backgroundColor: pack.locked ? '#f0f0f0' : '#E8F5E9',
                    borderBottom: `1px solid ${pack.locked ? '#e0e0e0' : '#4CAF50'}`
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {pack.locked ? (
                      <LockIcon sx={{ color: '#999', fontSize: '1.2rem' }} />
                    ) : pack.completed ? (
                      <CheckCircleIcon sx={{ color: '#4CAF50', fontSize: '1.2rem' }} />
                    ) : (
                      <PlayArrowIcon sx={{ color: '#4CAF50', fontSize: '1.2rem' }} />
                    )}
                    <Typography variant="body2" fontWeight={600} color={pack.locked ? '#999' : '#2E7D32'}>
                      Pack {pack.id}
                    </Typography>
                  </Box>
                  <Chip 
                    label={pack.difficulty}
                    size="small"
                    sx={{ 
                      backgroundColor: getDifficultyColor(pack.difficulty),
                      color: 'white',
                      fontSize: '0.7rem'
                    }}
                  />
                </Box>

                <CardContent sx={{ flexGrow: 1, p: 2 }}>
                  <Typography variant="h6" fontWeight={600} color={pack.locked ? '#999' : '#333'} gutterBottom>
                    {pack.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2, lineHeight: 1.4 }}>
                    {pack.description}
                  </Typography>
                  
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    Duration: {pack.duration}
                  </Typography>

                  {/* Topics */}
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 1 }}>
                    {pack.topics.map((topic, index) => (
                      <Chip 
                        key={index}
                        label={topic}
                        size="small"
                        variant="outlined"
                        sx={{ 
                          fontSize: '0.7rem',
                          height: '20px',
                          borderColor: pack.locked ? '#ccc' : '#4CAF50',
                          color: pack.locked ? '#999' : '#4CAF50'
                        }}
                      />
                    ))}
                  </Box>
                </CardContent>

                <CardActions sx={{ p: 2, pt: 0 }}>
                  <Button 
                    fullWidth
                    variant={pack.locked ? "outlined" : "contained"}
                    startIcon={pack.locked ? <LockIcon /> : <PlayArrowIcon />}
                    disabled={pack.locked}
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePackClick(pack);
                    }}
                    sx={{
                      backgroundColor: pack.locked ? 'transparent' : '#4CAF50',
                      borderColor: pack.locked ? '#ccc' : '#4CAF50',
                      color: pack.locked ? '#999' : '#fff',
                      fontWeight: 600,
                      borderRadius: 2,
                      py: 1,
                      textTransform: 'none',
                      '&:hover': pack.locked ? {} : {
                        backgroundColor: '#45a049',
                      },
                      '&.Mui-disabled': {
                        backgroundColor: 'transparent',
                        borderColor: '#ccc',
                        color: '#999'
                      }
                    }}
                  >
                    {pack.locked ? 'Complete Previous Pack' : 'Start Pack'}
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default ListeningA1; 