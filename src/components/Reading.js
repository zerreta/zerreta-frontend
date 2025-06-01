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
  AppBar
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  OpenInNew as OpenInNewIcon
} from '@mui/icons-material';

// Import the uploaded images
import pbsImage from '../assets/pbs.png';
import storylineImage from '../assets/Storyline.png';
import oxfordImage from '../assets/oxfordowl.png';
import starfallImage from '../assets/starfall.png';

const Reading = () => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate('/student-dashboard/speaky');
  };

  const readingResources = [
    {
      id: 1,
      title: 'PBS Kids Reading Games',
      description: 'Interactive reading activities with beloved characters like Super Why!, Martha Speaks, and more educational content.',
      url: 'https://pbskids.org/games/reading/',
      bgColor: '#ff6b35',
      hoverColor: '#e55a2b',
      image: pbsImage,
      imagePosition: 'center'
    },
    {
      id: 2,
      title: 'Storyline Online',
      description: 'Free celebrity-read stories that inspire a love of reading and learning in children.',
      url: 'https://www.storylineonline.net/',
      bgColor: '#4CAF50',
      hoverColor: '#45a049',
      image: storylineImage,
      imagePosition: 'center'
    },
    {
      id: 3,
      title: 'Oxford Owl',
      description: 'Free eBooks, reading activities, and educational games for children of all ages.',
      url: 'https://www.oxfordowl.co.uk/for-home/find-a-book/library-page/',
      bgColor: '#2196F3',
      hoverColor: '#1976D2',
      image: oxfordImage,
      imagePosition: 'center'
    },
    {
      id: 4,
      title: 'Starfall Reading',
      description: 'Interactive phonics games and reading activities that make learning fun and engaging.',
      url: 'https://www.starfall.com/h/ltr-classic/',
      bgColor: '#9C27B0',
      hoverColor: '#7B1FA2',
      image: starfallImage,
      imagePosition: 'left'
    }
  ];

  const handleResourceClick = (url) => {
    window.open(url, '_blank');
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#f5f5f5' }}>
      {/* Header */}
      <AppBar position="static" sx={{ backgroundColor: '#ff6b35', minHeight: 'auto' }}>
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
            📖 Reading Resources & Games
          </Typography>
        </Toolbar>
      </AppBar>

      {/* Main Content */}
      <Container maxWidth="lg" sx={{ py: 4, flex: 1 }}>
        {/* Title Section */}
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Typography variant="h4" fontWeight={600} color="#333" gutterBottom>
            Reading Resources
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto' }}>
            Explore interactive reading activities, stories, and educational games from trusted educational platforms
          </Typography>
        </Box>

        {/* Resource Cards Grid */}
        <Grid container spacing={4}>
          {readingResources.map((resource) => (
            <Grid item xs={12} sm={6} md={6} lg={3} key={resource.id}>
              <Card 
                sx={{ 
                  height: '100%', 
                  display: 'flex', 
                  flexDirection: 'column',
                  borderRadius: 3,
                  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
                  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                  cursor: 'pointer',
                  overflow: 'hidden',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: '0 12px 30px rgba(0, 0, 0, 0.15)',
                  }
                }}
                onClick={() => handleResourceClick(resource.url)}
              >
                {/* Image Area with Hover Effect */}
                <Box 
                  sx={{ 
                    height: 200,
                    position: 'relative',
                    backgroundImage: `url(${resource.image})`,
                    backgroundSize: 'cover',
                    backgroundPosition: resource.imagePosition,
                    backgroundRepeat: 'no-repeat',
                    '&:hover .hover-overlay': {
                      opacity: 1,
                    }
                  }}
                >
                  {/* Hover overlay for title display */}
                  <Box
                    className="hover-overlay"
                    sx={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      background: 'linear-gradient(45deg, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.4) 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      opacity: 0,
                      transition: 'opacity 0.3s ease-in-out'
                    }}
                  >
                    <Typography 
                      variant="h6" 
                      component="div"
                      sx={{
                        color: 'white',
                        fontWeight: 700,
                        textAlign: 'center',
                        textShadow: '2px 2px 4px rgba(0,0,0,0.8)',
                        px: 2,
                        fontSize: '1.1rem',
                        transform: 'translateY(10px)',
                        transition: 'transform 0.3s ease-in-out'
                      }}
                    >
                      {resource.title}
                    </Typography>
                  </Box>
                </Box>

                <CardContent sx={{ flexGrow: 1, p: 3 }}>
                  <Typography gutterBottom variant="h6" component="h3" fontWeight={600} color="#333">
                    {resource.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.5 }}>
                    {resource.description}
                  </Typography>
                </CardContent>

                <CardActions sx={{ p: 3, pt: 0 }}>
                  <Button 
                    fullWidth
                    variant="contained"
                    startIcon={<OpenInNewIcon />}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleResourceClick(resource.url);
                    }}
                    sx={{
                      backgroundColor: resource.bgColor,
                      color: '#fff',
                      fontWeight: 600,
                      borderRadius: 2,
                      py: 1.5,
                      textTransform: 'none',
                      fontSize: '1rem',
                      boxShadow: `0 4px 12px rgba(0, 0, 0, 0.2)`,
                      '&:hover': {
                        backgroundColor: resource.hoverColor,
                      }
                    }}
                  >
                    Open Resource
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Footer Info */}
        <Box sx={{ mt: 6, textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto' }}>
            All resources open in new tabs for the best learning experience. These platforms offer age-appropriate content suitable for various reading levels.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Reading; 