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

const ListeningC1 = () => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate('/speaky/listening');
  };

  // Sample data for C1 packs - All unlocked for immediate access
  const c1Packs = [
    {
      id: 1,
      title: 'Academic Lectures',
      description: 'University lectures, research presentations, academic discussions',
      youtubeUrl: '#',
      duration: '6:45',
      difficulty: 'Advanced',
      completed: false,
      locked: false,
      topics: ['Academia', 'Research', 'Lectures']
    },
    {
      id: 2,
      title: 'Professional Meetings',
      description: 'Board meetings, corporate presentations, strategic planning',
      youtubeUrl: '#',
      duration: '7:20',
      difficulty: 'Advanced',
      completed: false,
      locked: false,
      topics: ['Business', 'Corporate', 'Strategy']
    },
    {
      id: 3,
      title: 'Scientific Discussions',
      description: 'Research findings, scientific debates, technical explanations',
      youtubeUrl: '#',
      duration: '6:55',
      difficulty: 'Advanced',
      completed: false,
      locked: false,
      topics: ['Science', 'Research', 'Technical']
    },
    {
      id: 4,
      title: 'Political & Social Issues',
      description: 'Debates, policy discussions, social commentary',
      youtubeUrl: '#',
      duration: '7:15',
      difficulty: 'Advanced',
      completed: false,
      locked: false,
      topics: ['Politics', 'Society', 'Debates']
    },
    {
      id: 5,
      title: 'Documentary Features',
      description: 'Complex documentaries, investigative reports, analysis',
      youtubeUrl: '#',
      duration: '8:30',
      difficulty: 'Advanced',
      completed: false,
      locked: false,
      topics: ['Documentary', 'Investigation', 'Analysis']
    },
    {
      id: 6,
      title: 'Literary & Cultural',
      description: 'Literature discussions, cultural analysis, artistic commentary',
      youtubeUrl: '#',
      duration: '7:45',
      difficulty: 'Expert',
      completed: false,
      locked: false,
      topics: ['Literature', 'Culture', 'Arts']
    },
    {
      id: 7,
      title: 'Economic Analysis',
      description: 'Market analysis, economic theories, financial discussions',
      youtubeUrl: '#',
      duration: '7:10',
      difficulty: 'Expert',
      completed: false,
      locked: false,
      topics: ['Economics', 'Finance', 'Markets']
    },
    {
      id: 8,
      title: 'Philosophy & Ethics',
      description: 'Philosophical debates, ethical discussions, moral reasoning',
      youtubeUrl: '#',
      duration: '8:15',
      difficulty: 'Expert',
      completed: false,
      locked: false,
      topics: ['Philosophy', 'Ethics', 'Reasoning']
    },
    {
      id: 9,
      title: 'Global Affairs',
      description: 'International relations, global issues, diplomatic discussions',
      youtubeUrl: '#',
      duration: '7:55',
      difficulty: 'Expert',
      completed: false,
      locked: false,
      topics: ['Global', 'Diplomacy', 'International']
    },
    {
      id: 10,
      title: 'Innovation & Future',
      description: 'Technological innovation, future trends, disruptive ideas',
      youtubeUrl: '#',
      duration: '8:45',
      difficulty: 'Expert',
      completed: false,
      locked: false,
      topics: ['Innovation', 'Technology', 'Future']
    },
    {
      id: 11,
      title: 'Comprehensive Assessment',
      description: 'Advanced listening assessment covering all C1 topics',
      youtubeUrl: '#',
      duration: '9:30',
      difficulty: 'Expert',
      completed: false,
      locked: false,
      topics: ['Assessment', 'Comprehensive', 'Advanced']
    }
  ];

  const handlePackClick = (pack) => {
    navigate(`/speaky/listening/c1/pack/${pack.id}`);
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Advanced': return '#9C27B0';
      case 'Expert': return '#7B1FA2';
      default: return '#9C27B0';
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#f5f5f5' }}>
      {/* Header */}
      <AppBar position="static" sx={{ backgroundColor: '#9C27B0', minHeight: 'auto' }}>
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
            🎧 C1 Advanced - Listening Packs
          </Typography>
        </Toolbar>
      </AppBar>

      {/* Main Content */}
      <Container maxWidth="lg" sx={{ py: 4, flex: 1 }}>
        {/* Title Section */}
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Typography variant="h4" fontWeight={600} color="#333" gutterBottom>
            C1 Advanced Level
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto' }}>
            Master advanced listening skills with 11 sophisticated learning packs
          </Typography>
        </Box>

        {/* Progress Overview */}
        <Box sx={{ mb: 4, p: 3, backgroundColor: 'white', borderRadius: 3, boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={4}>
              <Typography variant="h6" fontWeight={600} color="#9C27B0">
                Progress: 0/11 Completed
              </Typography>
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography variant="body2" color="text.secondary">
                Total Duration: ~85 minutes
              </Typography>
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography variant="body2" color="text.secondary">
                Level: C1 Advanced
              </Typography>
            </Grid>
          </Grid>
        </Box>

        {/* Packs Grid */}
        <Grid container spacing={3}>
          {c1Packs.map((pack) => (
            <Grid item xs={12} sm={6} md={4} key={pack.id}>
              <Card 
                sx={{ 
                  height: '100%', 
                  display: 'flex', 
                  flexDirection: 'column',
                  borderRadius: 3,
                  border: pack.locked ? '2px solid #e0e0e0' : '2px solid #9C27B0',
                  backgroundColor: pack.locked ? '#f5f5f5' : 'white',
                  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                  cursor: pack.locked ? 'not-allowed' : 'pointer',
                  opacity: pack.locked ? 0.6 : 1,
                  '&:hover': pack.locked ? {} : {
                    transform: 'translateY(-5px)',
                    boxShadow: '0 8px 25px rgba(156, 39, 176, 0.2)',
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
                    backgroundColor: pack.locked ? '#f0f0f0' : '#F3E5F5',
                    borderBottom: `1px solid ${pack.locked ? '#e0e0e0' : '#9C27B0'}`
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {pack.locked ? (
                      <LockIcon sx={{ color: '#999', fontSize: '1.2rem' }} />
                    ) : pack.completed ? (
                      <CheckCircleIcon sx={{ color: '#9C27B0', fontSize: '1.2rem' }} />
                    ) : (
                      <PlayArrowIcon sx={{ color: '#9C27B0', fontSize: '1.2rem' }} />
                    )}
                    <Typography variant="body2" fontWeight={600} color={pack.locked ? '#999' : '#7B1FA2'}>
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
                          borderColor: pack.locked ? '#ccc' : '#9C27B0',
                          color: pack.locked ? '#999' : '#9C27B0'
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
                      backgroundColor: pack.locked ? 'transparent' : '#9C27B0',
                      borderColor: pack.locked ? '#ccc' : '#9C27B0',
                      color: pack.locked ? '#999' : '#fff',
                      fontWeight: 600,
                      borderRadius: 2,
                      py: 1,
                      textTransform: 'none',
                      '&:hover': pack.locked ? {} : {
                        backgroundColor: '#7B1FA2',
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

export default ListeningC1; 