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
  VolumeUp as VolumeUpIcon
} from '@mui/icons-material';

const Listening = () => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate('/student-dashboard/speaky');
  };

  const listeningModules = [
    {
      id: 'A1',
      title: 'A1 - Beginner',
      level: 'A1',
      description: 'Basic listening skills with simple everyday conversations',
      bgColor: '#E8F5E9',
      borderColor: '#4CAF50',
      textColor: '#2E7D32',
      packCount: 11,
      difficulty: 'Beginner'
    },
    {
      id: 'B1',
      title: 'B1 - Intermediate',
      level: 'B1',
      description: 'Intermediate listening with more complex dialogues and topics',
      bgColor: '#E3F2FD',
      borderColor: '#2196F3',
      textColor: '#1565C0',
      packCount: 11,
      difficulty: 'Intermediate'
    },
    {
      id: 'C1',
      title: 'C1 - Advanced',
      level: 'C1',
      description: 'Advanced listening skills with professional and academic content',
      bgColor: '#F3E5F5',
      borderColor: '#9C27B0',
      textColor: '#7B1FA2',
      packCount: 11,
      difficulty: 'Advanced'
    }
  ];

  const handleModuleClick = (moduleLevel) => {
    navigate(`/speaky/listening/${moduleLevel.toLowerCase()}`);
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
            🎧 Listening Modules
          </Typography>
        </Toolbar>
      </AppBar>

      {/* Main Content */}
      <Container maxWidth="lg" sx={{ py: 4, flex: 1 }}>
        {/* Title Section */}
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Typography variant="h4" fontWeight={600} color="#333" gutterBottom>
            Listening Comprehension
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto' }}>
            Enhance your listening skills with structured modules from beginner to advanced level
          </Typography>
        </Box>

        {/* Module Cards Grid */}
        <Grid container spacing={4} justifyContent="center">
          {listeningModules.map((module) => (
            <Grid item xs={12} sm={6} md={4} key={module.id}>
              <Card 
                sx={{ 
                  height: '100%', 
                  display: 'flex', 
                  flexDirection: 'column',
                  borderRadius: 3,
                  border: `2px solid ${module.borderColor}`,
                  backgroundColor: module.bgColor,
                  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                  cursor: 'pointer',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: '0 12px 30px rgba(0, 0, 0, 0.15)',
                  }
                }}
                onClick={() => handleModuleClick(module.level)}
              >
                {/* Module Header */}
                <Box 
                  sx={{ 
                    p: 3,
                    display: 'flex', 
                    flexDirection: 'column',
                    alignItems: 'center',
                    backgroundColor: 'white',
                    borderBottom: `2px solid ${module.borderColor}`
                  }}
                >
                  <VolumeUpIcon sx={{ fontSize: '3rem', color: module.borderColor, mb: 1 }} />
                  <Typography variant="h5" fontWeight={700} color={module.textColor} gutterBottom>
                    {module.title}
                  </Typography>
                  <Chip 
                    label={module.difficulty}
                    sx={{ 
                      backgroundColor: module.borderColor,
                      color: 'white',
                      fontWeight: 600
                    }}
                  />
                </Box>

                <CardContent sx={{ flexGrow: 1, p: 3 }}>
                  <Typography variant="body1" color="text.primary" sx={{ mb: 2, lineHeight: 1.6 }}>
                    {module.description}
                  </Typography>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <PlayArrowIcon sx={{ color: module.borderColor }} />
                    <Typography variant="body2" color={module.textColor} fontWeight={600}>
                      {module.packCount} Learning Packs Available
                    </Typography>
                  </Box>
                </CardContent>

                <CardActions sx={{ p: 3, pt: 0 }}>
                  <Button 
                    fullWidth
                    variant="contained"
                    startIcon={<PlayArrowIcon />}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleModuleClick(module.level);
                    }}
                    sx={{
                      backgroundColor: module.borderColor,
                      color: '#fff',
                      fontWeight: 600,
                      borderRadius: 2,
                      py: 1.5,
                      textTransform: 'none',
                      fontSize: '1rem',
                      '&:hover': {
                        backgroundColor: module.textColor,
                      }
                    }}
                  >
                    Start {module.level} Module
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Info Section */}
        <Box sx={{ mt: 6, p: 4, backgroundColor: 'white', borderRadius: 3, boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
          <Typography variant="h6" fontWeight={600} color="#333" gutterBottom>
            What You'll Learn:
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                • <strong>Video Listening:</strong> YouTube content with native speakers
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                • <strong>Script Practice:</strong> Follow along with conversation transcripts
              </Typography>
              <Typography variant="body2" color="text.secondary">
                • <strong>Grammar Focus:</strong> Learn grammar in context
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                • <strong>Comprehension Quiz:</strong> Test your understanding
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                • <strong>Practice Exercises:</strong> Fill-in-the-blank activities
              </Typography>
              <Typography variant="body2" color="text.secondary">
                • <strong>Progressive Learning:</strong> 11 packs per level
              </Typography>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </Box>
  );
};

export default Listening; 