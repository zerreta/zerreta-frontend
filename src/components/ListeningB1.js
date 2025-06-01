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

const ListeningB1 = () => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate('/speaky/listening');
  };

  // Sample data for B1 packs - All unlocked for immediate access
  const b1Packs = [
    {
      id: 1,
      title: 'Workplace Conversations',
      description: 'Professional dialogues and office discussions',
      youtubeUrl: '#',
      duration: '5:12',
      difficulty: 'Intermediate',
      completed: false,
      locked: false,
      topics: ['Work', 'Meetings', 'Presentations']
    },
    {
      id: 2,
      title: 'Travel & Tourism',
      description: 'Hotel bookings, airport announcements, tourist guides',
      youtubeUrl: '#',
      duration: '4:45',
      difficulty: 'Intermediate',
      completed: false,
      locked: false,
      topics: ['Travel', 'Hotels', 'Transportation']
    },
    {
      id: 3,
      title: 'Health & Medical',
      description: 'Doctor visits, pharmacy conversations, health advice',
      youtubeUrl: '#',
      duration: '5:28',
      difficulty: 'Intermediate',
      completed: false,
      locked: false,
      topics: ['Health', 'Medical', 'Symptoms']
    },
    {
      id: 4,
      title: 'Education & Learning',
      description: 'University discussions, course planning, study groups',
      youtubeUrl: '#',
      duration: '4:55',
      difficulty: 'Intermediate',
      completed: false,
      locked: false,
      topics: ['Education', 'Learning', 'Courses']
    },
    {
      id: 5,
      title: 'News & Current Events',
      description: 'News broadcasts, weather reports, current affairs',
      youtubeUrl: '#',
      duration: '5:33',
      difficulty: 'Intermediate',
      completed: false,
      locked: false,
      topics: ['News', 'Events', 'Reports']
    },
    {
      id: 6,
      title: 'Social Situations',
      description: 'Parties, social gatherings, making plans with friends',
      youtubeUrl: '#',
      duration: '4:42',
      difficulty: 'Intermediate',
      completed: false,
      locked: false,
      topics: ['Social', 'Friends', 'Plans']
    },
    {
      id: 7,
      title: 'Technology & Media',
      description: 'Tech support, social media, digital communication',
      youtubeUrl: '#',
      duration: '5:18',
      difficulty: 'Upper-Intermediate',
      completed: false,
      locked: false,
      topics: ['Technology', 'Media', 'Digital']
    },
    {
      id: 8,
      title: 'Culture & Entertainment',
      description: 'Movies, music, cultural events and festivals',
      youtubeUrl: '#',
      duration: '4:36',
      difficulty: 'Upper-Intermediate',
      completed: false,
      locked: false,
      topics: ['Culture', 'Entertainment', 'Events']
    },
    {
      id: 9,
      title: 'Environment & Nature',
      description: 'Environmental issues, nature documentaries, conservation',
      youtubeUrl: '#',
      duration: '5:25',
      difficulty: 'Upper-Intermediate',
      completed: false,
      locked: false,
      topics: ['Environment', 'Nature', 'Conservation']
    },
    {
      id: 10,
      title: 'Business & Economics',
      description: 'Business meetings, economic discussions, market trends',
      youtubeUrl: '#',
      duration: '5:48',
      difficulty: 'Upper-Intermediate',
      completed: false,
      locked: false,
      topics: ['Business', 'Economics', 'Markets']
    },
    {
      id: 11,
      title: 'Final Assessment',
      description: 'Comprehensive review of all B1 level topics',
      youtubeUrl: '#',
      duration: '6:15',
      difficulty: 'Upper-Intermediate',
      completed: false,
      locked: false,
      topics: ['Review', 'Assessment', 'Mixed Topics']
    }
  ];

  const handlePackClick = (pack) => {
    navigate(`/speaky/listening/b1/pack/${pack.id}`);
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Intermediate': return '#2196F3';
      case 'Upper-Intermediate': return '#1976D2';
      default: return '#2196F3';
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#f5f5f5' }}>
      {/* Header */}
      <AppBar position="static" sx={{ backgroundColor: '#2196F3', minHeight: 'auto' }}>
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
            🎧 B1 Intermediate - Listening Packs
          </Typography>
        </Toolbar>
      </AppBar>

      {/* Main Content */}
      <Container maxWidth="lg" sx={{ py: 4, flex: 1 }}>
        {/* Title Section */}
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Typography variant="h4" fontWeight={600} color="#333" gutterBottom>
            B1 Intermediate Level
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto' }}>
            Develop intermediate listening skills with 11 challenging learning packs
          </Typography>
        </Box>

        {/* Progress Overview */}
        <Box sx={{ mb: 4, p: 3, backgroundColor: 'white', borderRadius: 3, boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={4}>
              <Typography variant="h6" fontWeight={600} color="#2196F3">
                Progress: 0/11 Completed
              </Typography>
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography variant="body2" color="text.secondary">
                Total Duration: ~55 minutes
              </Typography>
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography variant="body2" color="text.secondary">
                Level: B1 Intermediate
              </Typography>
            </Grid>
          </Grid>
        </Box>

        {/* Packs Grid */}
        <Grid container spacing={3}>
          {b1Packs.map((pack) => (
            <Grid item xs={12} sm={6} md={4} key={pack.id}>
              <Card 
                sx={{ 
                  height: '100%', 
                  display: 'flex', 
                  flexDirection: 'column',
                  borderRadius: 3,
                  border: pack.locked ? '2px solid #e0e0e0' : '2px solid #2196F3',
                  backgroundColor: pack.locked ? '#f5f5f5' : 'white',
                  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                  cursor: pack.locked ? 'not-allowed' : 'pointer',
                  opacity: pack.locked ? 0.6 : 1,
                  '&:hover': pack.locked ? {} : {
                    transform: 'translateY(-5px)',
                    boxShadow: '0 8px 25px rgba(33, 150, 243, 0.2)',
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
                    backgroundColor: pack.locked ? '#f0f0f0' : '#E3F2FD',
                    borderBottom: `1px solid ${pack.locked ? '#e0e0e0' : '#2196F3'}`
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {pack.locked ? (
                      <LockIcon sx={{ color: '#999', fontSize: '1.2rem' }} />
                    ) : pack.completed ? (
                      <CheckCircleIcon sx={{ color: '#2196F3', fontSize: '1.2rem' }} />
                    ) : (
                      <PlayArrowIcon sx={{ color: '#2196F3', fontSize: '1.2rem' }} />
                    )}
                    <Typography variant="body2" fontWeight={600} color={pack.locked ? '#999' : '#1565C0'}>
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
                          borderColor: pack.locked ? '#ccc' : '#2196F3',
                          color: pack.locked ? '#999' : '#2196F3'
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
                      backgroundColor: pack.locked ? 'transparent' : '#2196F3',
                      borderColor: pack.locked ? '#ccc' : '#2196F3',
                      color: pack.locked ? '#999' : '#fff',
                      fontWeight: 600,
                      borderRadius: 2,
                      py: 1,
                      textTransform: 'none',
                      '&:hover': pack.locked ? {} : {
                        backgroundColor: '#1976D2',
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

export default ListeningB1; 